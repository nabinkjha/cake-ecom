import React from "react";
import NextLink from "next/link";
import Image from "next/image";
import {
  Grid,
  Link,
  List,
  ListItem,
  Typography,
  Card,
  Button
} from "@mui/material";
import Rating from "@material-ui/lab/Rating";
import Layout from "./Layout";
import { useRouter } from "next/router";
import { useCart } from "./cart/hooks/useCart";
import useStyles from "../utils/style";
import { ItemInBasket } from "./cart/context/types";

export const ProductDetails = (itemInBasket: ItemInBasket) => {
  console.log(itemInBasket);
  const { id, imageUrl, name, price } = itemInBasket;
  const { cartDispatch } = useCart();
  const classes = useStyles();
  const router = useRouter();
  const addToCart = () => {
    cartDispatch({ type: 'ADD_CART_ITEM', payload: itemInBasket });
    router.push('/cart');
  };

  return (
    <Layout title={itemInBasket.name} description={itemInBasket.description} id={id}>
    <div className={classes.section}>
      <NextLink href="/" passHref>
        <Link>
          <Typography>back to products</Typography>
        </Link>
      </NextLink>
    </div>
    <Grid container spacing={1}>
      <Grid item md={6} xs={12}>
        <Image
          src={imageUrl}
          alt={name}
          width={640}
          height={640}
          layout="responsive"
        ></Image>
      </Grid>
      <Grid item md={3} xs={12}>
        <List>
          <ListItem>
            <Typography component="h1" variant="h1">
              {itemInBasket.name}
            </Typography>
          </ListItem>
        
        </List>
      </Grid>
      <Grid item md={3} xs={12}>
        <Card>
          <List>
            <ListItem>
              <Grid container>
                <Grid item xs={6}>
                  <Typography>Price</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>₹ {price}</Typography>
                </Grid>
              </Grid>
            </ListItem>
            <ListItem>
              <Grid container>
                <Grid item xs={6}>
                  <Typography>Status</Typography>
                </Grid>
                <Grid item xs={6}>
                  
                </Grid>
              </Grid>
            </ListItem>
            <ListItem>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={addToCart}
              >
                Add to cart
              </Button>
            </ListItem>
          </List>
        </Card>
      </Grid>
    </Grid>
  </Layout>
  );
};
