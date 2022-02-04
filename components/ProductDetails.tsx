import React, { useEffect } from "react";
import NextLink from "next/link";
import Image from "next/image";
import {
  Grid,
  Link,
  List,
  ListItem,
  Typography,
  Card,
  Button,
  CircularProgress
} from "@mui/material";
import Rating from "@material-ui/lab/Rating";
import Layout from "./Layout";
import { useRouter } from "next/router";
import { useCart } from "./cart/hooks/useCart";
import useStyles from "../utils/style";
import ProductReview from "./ProductReview";

export const ProductDetails = ({productDetail}) => {
  const { cartState,cartDispatch } = useCart();
  const {product,loading} =cartState;
  const classes = useStyles();
  const router = useRouter();
  const addToCart = () => {
    cartDispatch({ type: 'ADD_CART_ITEM', payload: product });
    router.push('/cart');
  };
  useEffect(() => { 
    cartDispatch({type: 'PRODUCT_DETAIL_VIEW', payload: productDetail});
  }, [loading]);
  return (
    <>
    {loading && !product && <CircularProgress></CircularProgress>}
    {!loading && product && (<Layout title={product.name} description={product.description}>
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
          src={product.imageUrl}
          alt={product.name}
          width={640}
          height={640}
          layout="responsive"
          className="roundImage"
        ></Image>
      </Grid>
      <Grid item md={3} xs={12}>
        <List>
          <ListItem>
            <Typography component="h1" variant="h1">
              {product.name}
            </Typography>
          </ListItem>
          <ListItem>
              <Typography>Category: {product.productCategory.name}</Typography>
            </ListItem>
            <ListItem>
              <Rating value={product.rating} readOnly></Rating>
              <Link href="#reviews">
                <Typography>({product.numReviews} reviews)</Typography>
              </Link>
            </ListItem>
            <ListItem>
              <Typography> Description: {product.description}</Typography>
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
                  <Typography>₹ {product.price}</Typography>
                </Grid>
              </Grid>
            </ListItem>
            <ListItem>
              <Grid container>
              <Grid item xs={6}>
                    <Typography>Status</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>
                      {product.countInStock > 0 ? 'In stock' : 'Unavailable'}
                    </Typography>
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
    <ProductReview/>
  </Layout>)}
  </>
  );
};
