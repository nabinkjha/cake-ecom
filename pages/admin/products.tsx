import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import NextLink from "next/link";
import React, { useEffect, useState } from "react";

import {
  CircularProgress,
  Grid,
  List,
  ListItem,
  Typography,
  Card,
  Button,
  ListItemText,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { getError } from "@/utils/error";
import Layout from "@/components/Layout";
import ConfirmDialog from "@/components/ConfirmDialog";
import useStyles from "@/utils/style";
import { useSnackbar } from "notistack";
import { useCart } from "@/components/cart/hooks/useCart";

function AdminProdcuts() {
  const { cartState, cartDispatch } = useCart();
  const router = useRouter();
  const classes = useStyles();
  const {
    loading,
    loadingCreate,
    error,
    products,
    successDelete,
    loadingDelete,
    userInfo,
  } = cartState;

  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(0);
  const handleClickOpen = (selectedId:number) => {
    setSelectedId(selectedId);
    setOpen(true);
  };

  const handleAddClick = (value: string) => {
    router.push("/admin/product/0");
  };
  const handleDeleteClose = (value: string, selectedId: number) => {
    setOpen(false);
    if (value === "Ok") {
      deleteHandler(selectedId);
    }
  };

  useEffect(() => {
    if (!userInfo) {
      router.push("/login");
    }
    const fetchData = async () => {
      try {
        cartDispatch({ type: "PRODUCTS_FETCH_REQUEST", payload: null });
        const { data } = await axios.get(`/api/admin/products`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        cartDispatch({ type: "PRODUCTS_FETCH_SUCCESS", payload: data });
        setSelectedId(data[0].id);
      } catch (err) {
        cartDispatch({ type: "PRODUCTS_FETCH_FAIL", payload: getError(err) });
      }
    };
    if (successDelete) {
      cartDispatch({ type: "PRODUCT_DELETE_RESET", payload: null });
    } else {
      fetchData();
    }
  }, [successDelete]);

  const { enqueueSnackbar } = useSnackbar();

  const deleteHandler = async (productId:number) => {
    console.log("Deleting the product...");
    try {
      cartDispatch({ type: "PRODUCT_DELETE_REQUEST", payload: null });
      await axios.delete(`/api/admin/products/${productId}`, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
      cartDispatch({ type: "PRODUCT_DELETE_SUCCESS", payload: null });
      enqueueSnackbar("Product deleted successfully", { variant: "success" });
    } catch (err) {
      cartDispatch({ type: "PRODUCT_DELETE_FAIL", payload: null });
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  };
  return (
    <Layout title="Products">
      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card className={classes.section}>
            <List>
              <NextLink href="/admin/dashboard" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Admin Dashboard"></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/admin/orders" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Orders"></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/admin/products" passHref>
                <ListItem selected button component="a">
                  <ListItemText primary="Products"></ListItemText>
                </ListItem>
              </NextLink>
              <NextLink href="/admin/users" passHref>
                <ListItem button component="a">
                  <ListItemText primary="Users"></ListItemText>
                </ListItem>
              </NextLink>
            </List>
          </Card>
        </Grid>
        <Grid item md={9} xs={12}>
          <Card className={classes.section}>
            <List>
              <ListItem>
                <Grid container alignItems="center">
                  <Grid item xs={6}>
                    <Typography component="h1" variant="h1">
                      Products
                    </Typography>
                    {loadingDelete && <CircularProgress />}
                  </Grid>
                  <Grid align="right" item xs={6}>
                    <Button size="small" variant="contained" onClick={()=> handleAddClick()}>
                      Create
                    </Button>
                    {loadingCreate && <CircularProgress />}
                  </Grid>
                </Grid>
              </ListItem>

              <ListItem>
                {loading ? (
                  <CircularProgress />
                ) : error ? (
                  <Typography className={classes.error}>{error}</Typography>
                ) : (
                  <TableContainer>
                    <Table sx={{ minWidth: 650 }}>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>NAME</TableCell>
                          <TableCell>PRICE</TableCell>
                          <TableCell>CATEGORY</TableCell>
                          <TableCell>COUNT</TableCell>
                          <TableCell>RATING</TableCell>
                          <TableCell sx={{ minWidth: 200 }}>ACTIONS</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {products?.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>{product.id}</TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>₹{product.price}</TableCell>
                            <TableCell>
                              {product.productCategory?.name}
                            </TableCell>
                            <TableCell>{product.countInStock}</TableCell>
                            <TableCell>{product.rating}</TableCell>
                            <TableCell>
                              <NextLink
                                href={`/admin/product/${product.id}`}
                                passHref
                              >
                                <Button size="small" variant="contained">
                                  Edit
                                </Button>
                              </NextLink>{" "}
                              <Button
                                onClick={()=> handleClickOpen(product.id)}
                                size="small"
                                variant="contained"
                              >
                                Delete
                              </Button>
                              <ConfirmDialog
                                open={open}
                                selectedId={selectedId}
                                onClose={handleDeleteClose}
                                dialogTitle="Delete Product"
                                okButtonText="Ok"
                                cancelButtonText="Cancel"
                                dialogContentText= {`Are you sure you want to Delete product with id ${selectedId}?`}  />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default dynamic(() => Promise.resolve(AdminProdcuts), { ssr: false });
