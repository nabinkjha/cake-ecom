import React, { useContext } from "react";
import NextLink from "next/link";
import Image from "next/image";
import dynamic from 'next/dynamic';
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
  Button,
  Card,
  List,
  ListItem,
} from "@material-ui/core";
import { useRouter } from "next/router";
import { ItemInBasket } from "../components/cart/context/types";
import { useCart } from "../components/cart/hooks/useCart";
import { MenuItem, Select } from "@mui/material";
import Layout from "../components/Layout";
import { NextPage } from "next";
import axios from "axios";
type CartItemsProps = {
  readonly cartitems: Array<ItemInBasket>;
};

const CartPage = () => {
  const { state, dispatch } = useCart();
  const router = useRouter();
  const { cart, totalPrice } = state;
  const { cartItems } = cart;
  const handleDelete = (product: ItemInBasket) => {
    dispatch({ type: "REMOVE_CART_ITEM", payload: product });
  };
  const checkoutHandler = () => {
    router.push("/shipping");
  };

  const updateCartHandler = async (item: ItemInBasket, quantity: number) => {
    const { data } = await axios.get(`/api/products/${item.id}`);
    if (data.countInStock < quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }
    dispatch({ type: "ADD_CART_ITEM", payload: { ...item, quantity } });
  };

  return (
    // <CartItems cartitems={cartitems} />
    <Layout title="Shopping Cart">
      <Typography component="h3" variant="h3">
        Shopping Cart
      </Typography>
      {cartItems.length === 0 ? (
        <div>
          Cart is empty.{" "}
          <NextLink href="/" passHref>
            <Link>Go shopping</Link>
          </NextLink>
        </div>
      ) : (
        <Grid container spacing={1}>
          <Grid item md={9} xs={12}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cartItems.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <NextLink href={`/product/${product.slug}`} passHref>
                          <Link>
                            <Image
                              src={product.imageUrl}
                              alt={product.name}
                              width={50}
                              height={50}
                            ></Image>
                          </Link>
                        </NextLink>
                      </TableCell>

                      <TableCell>
                        <NextLink href={`/product/${product.slug}`} passHref>
                          <Link>
                            <Typography>{product.name}</Typography>
                          </Link>
                        </NextLink>
                      </TableCell>
                      <TableCell align="right">
                        <Select
                          value={product.quantity}
                          onChange={(e) =>
                            updateCartHandler(product, e.target.value)
                          }
                        >
                          {[...Array(product.countInStock).keys()].map((x) => (
                            <MenuItem key={x + 1} value={x + 1}>
                              {x + 1}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell align="right">₹{product.price}</TableCell>
                      <TableCell align="right">
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleDelete(product)}
                        >
                          x
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item md={3} xs={12}>
            <Card>
              <List>
                <ListItem>
                  <Typography variant="h5">
                    Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{" "}
                    items) : ₹{totalPrice}
                  </Typography>
                </ListItem>
                <ListItem>
                  <Button
                    onClick={checkoutHandler}
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    Check Out
                  </Button>
                </ListItem>
              </List>
            </Card>
          </Grid>
        </Grid>
      )}
    </Layout>
  );
};
export default dynamic(() => Promise.resolve(CartPage), { ssr: false });
//export default CartPage;
