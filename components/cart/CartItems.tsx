import React, { useContext } from "react";
import NextLink from "next/link";
import Image from "next/image";
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
import Layout from "../Layout";
import { ItemInBasket } from "./context/types";
import { CartItem } from "./CartItem";

type CartItemsProps = {
  readonly cartitems: Array<ItemInBasket>;
};

export const CartItems = ({ cartitems }: CartItemsProps) => {
  const router = useRouter();
  const checkoutHandler = () => {
    router.push("/shipping");
  };

  return (
    <>
      <Layout title="Shopping Cart">
        <Typography component="h3" variant="h3">
          Shopping Cart
        </Typography>
        {cartitems.length === 0 ? (
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
                    {cartitems.map((item) => (
                      <CartItem key={item.id} {...item} />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid item md={3} xs={12}>
              <Card>
                <List>
                  <ListItem>
                    <Typography variant="h2">
                      Subtotal ({cartitems.reduce((a, c) => a + c.quantity, 0)}{" "}
                      items) : $
                      {cartitems.reduce((a, c) => a + c.quantity * c.price, 0)}
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
    </>
  );
};
