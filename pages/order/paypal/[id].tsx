import React, { useContext, useEffect, useReducer } from "react";
import dynamic from "next/dynamic";
import Layout from "../../../components/Layout";
import NextLink from "next/link";
import Image from "next/image";
import type Prisma from "@prisma/client";
import { useCart } from "../../../components/cart/hooks/useCart";
import useStyles from "../../../utils/style";
import {
  Grid,
  TableContainer,
  Table,
  Typography,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Link,
  CircularProgress,
  Button,
  Card,
  List,
  ListItem,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { getError } from "../../../utils/error";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { paymentReducer } from "../../../components/cart/context/reducers/paymentReducer";
import { initialPaymentState } from "../../../components/cart/context/paymentContext";

function Order({ params }: { params: Prisma.Order }) {
  const orderId = params.id;
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const classes = useStyles();
  const router = useRouter();
  const { cartState } = useCart();
  const { userInfo } = cartState;

  const [paymentStatus, dispatch] = useReducer(
    paymentReducer,
    initialPaymentState
  );
  const { loading, error, order, successPay, loadingDeliver, successDeliver } =
    paymentStatus;
  const {
    shippingAddress,
    paymentMethod,
    orderItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
  } = order;

  useEffect(() => {
    if (!userInfo) {
      return router.push("/login");
    }
    const fetchOrder = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST", payload: null });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    if (
      !order.id ||
      successPay ||
      successDeliver ||
      (order.id && order.id !== +orderId)
    ) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: "PAY_RESET", payload: null });
      }
      if (successDeliver) {
        dispatch({ type: "DELIVER_RESET", payload: null });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get("/api/keys/paypal", {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      loadPaypalScript();
    }
  }, [order, successPay, successDeliver]);
  const { enqueueSnackbar } = useSnackbar();

  function createOrder(data: any, actions: any) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: totalPrice },
          },
        ],
      })
      .then((orderID: number) => {
        return orderID;
      });
  }
  function onApprove(data: any, actions: any) {
    return actions.order.capture().then(async function (details: any) {
      try {
        dispatch({ type: "PAY_REQUEST", payload: null });
        const { data } = await axios.put(
          `/api/order/paypal/${order.id}/pay`,
          details,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: "PAY_SUCCESS", payload: data });
        enqueueSnackbar("Order is paid", { variant: "success" });
      } catch (err) {
        dispatch({ type: "PAY_FAIL", payload: getError(err) });
        enqueueSnackbar(getError(err), { variant: "error" });
      }
    });
  }

  function onError(err: any) {
    enqueueSnackbar(getError(err), { variant: "error" });
  }

  async function deliverOrderHandler() {
    try {
      dispatch({ type: "DELIVER_REQUEST", payload: "" });
      const { data } = await axios.put(
        `/api/orders/${order.id}/deliver`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "DELIVER_SUCCESS", payload: data });
      enqueueSnackbar("Order is delivered", { variant: "success" });
    } catch (err) {
      dispatch({ type: "DELIVER_FAIL", payload: getError(err) });
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  }

  return (
    <Layout title={`Order ${orderId}`}>
      <Typography component="h5" variant="h5">
        Order {orderId}
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography className={classes.error}>{error}</Typography>
      ) : (
        <Grid container spacing={1}>
          <Grid item md={9} xs={12}>
            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography component="h5" variant="h5">
                    Shipping Address
                  </Typography>
                </ListItem>
                <ListItem>
                  {shippingAddress.fullName}, {shippingAddress.address},{" "}
                  {shippingAddress.city}, {shippingAddress.postalCode},{" "}
                  {shippingAddress.country}
                  &nbsp;
                  {shippingAddress.location && (
                    <Link
                      variant="button"
                      target="_new"
                      href={`https://maps.google.com?q=${shippingAddress.location.lat},${shippingAddress.location.lng}`}
                    >
                      Show On Map
                    </Link>
                  )}
                </ListItem>
                <ListItem>
                  Status:{" "}
                  {isDelivered
                    ? `delivered at ${deliveredAt}`
                    : "not delivered"}
                </ListItem>
              </List>
            </Card>
            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography component="h5" variant="h5">
                    Payment Method
                  </Typography>
                </ListItem>
                <ListItem>{paymentMethod}</ListItem>
                <ListItem>
                  Status: {isPaid ? `paid at ${paidAt}` : "not paid"}
                </ListItem>
              </List>
            </Card>
            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography component="h5" variant="h5">
                    Order Items
                  </Typography>
                </ListItem>
                <ListItem>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Image</TableCell>
                          <TableCell>Name</TableCell>
                          <TableCell align="right">Quantity</TableCell>
                          <TableCell align="right">Price</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orderItems.map((item: any) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <NextLink
                                href={`/product/${item.product.slug}`}
                                passHref
                              >
                                <Link>
                                  <Image
                                    src={item.product.imageUrl}
                                    alt={item.product.name}
                                    width={50}
                                    height={50}
                                  ></Image>
                                </Link>
                              </NextLink>
                            </TableCell>

                            <TableCell>
                              <NextLink
                                href={`/product/${item.product.slug}`}
                                passHref
                              >
                                <Link>
                                  <Typography>{item.product.name}</Typography>
                                </Link>
                              </NextLink>
                            </TableCell>
                            <TableCell align="right">
                              <Typography>{item.quantity}</Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography>${item.price}</Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </ListItem>
              </List>
            </Card>
          </Grid>
          <Grid item md={3} xs={12}>
            <Card className={classes.section}>
              <List>
                <ListItem>
                  <Typography variant="h5">Order Summary</Typography>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Items:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">${itemsPrice}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Tax:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">${taxPrice}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>Shipping:</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">${shippingPrice}</Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                <ListItem>
                  <Grid container>
                    <Grid item xs={6}>
                      <Typography>
                        <strong>Total:</strong>
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography align="right">
                        <strong>${totalPrice}</strong>
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
                {!isPaid && (
                  <ListItem>
                    {isPending ? (
                      <CircularProgress />
                    ) : (
                      <div className={classes.fullWidth}>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      </div>
                    )}
                  </ListItem>
                )}
                {userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                  <ListItem>
                    {loadingDeliver && <CircularProgress />}
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={deliverOrderHandler}
                    >
                      Deliver Order
                    </Button>
                  </ListItem>
                )}
              </List>
            </Card>
          </Grid>
        </Grid>
      )}
    </Layout>
  );
}

export async function getServerSideProps({ params }: { params: any }) {
  return { props: { params } };
}

export default dynamic(() => Promise.resolve(Order), { ssr: false });
