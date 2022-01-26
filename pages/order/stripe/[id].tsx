import React, { useContext, useEffect, useReducer, useState } from "react";
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
  Card,
  List,
  ListItem,
} from "@mui/material";
import { useRouter } from "next/router";
import StripeBuyButton from "@/components/StripeBuyButton";
import DeliveryButton from "@/components/DeliveryButton";
import { fetchOrder } from "@/utils/api-helpers";
function Order({ params }: { params: Prisma.Order }) {
  const orderId = params.id;
  const classes = useStyles();
  const router = useRouter();
  const { cartState,cartDispatch } = useCart();
  const { loading, error, order, userInfo,successPay, loadingDeliver, successDeliver } =  cartState;
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
    if (
      !order.id ||
      successPay ||
      successDeliver ||
      (order.id && order.id !== +orderId)
    ) {
      fetchOrder(orderId,userInfo.token,cartDispatch);
      if (successPay) {
        cartDispatch({ type: "PAY_RESET", payload: null });
      }
      if (successDeliver) {
        cartDispatch({ type: "DELIVER_RESET", payload: null });
      }
    } 
  }, [order]);

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
                    { (
                         <StripeBuyButton order={order}>

                         </StripeBuyButton>
                    )}
                  </ListItem>
                )}
                {userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                  <ListItem>
                    <DeliveryButton order={order}>

                    </DeliveryButton>
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

export default dynamic(() => Promise.resolve(Order), { ssr: true });
