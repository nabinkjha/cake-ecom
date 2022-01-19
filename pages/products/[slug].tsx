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
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import { PrismaClient, Product } from "@prisma/client";
import useStyles from "../../utils/style";
import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";

const prisma = new PrismaClient();

const addToCartHandler = async () => {
  //TODO
  };

export default function ProductScreen(props: SearchProps) {
  const router = useRouter();
  const classes = useStyles();
  const { product } = props;
  return (
    <Layout title={product.name} description={product.description}>
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
              <Typography>Brand: {product.brand}</Typography>
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
                      {product.countInStock > 0 ? "In stock" : "Unavailable"}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={addToCartHandler}
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
}

interface SearchProps {
  product: Product;
}

interface Params extends ParsedUrlQuery {
    slug: string,
  }

export const getServerSideProps: GetServerSideProps<SearchProps> = async (
  context
) => {

  const param = context.params as Params;
  const product = await prisma.product.findUnique({
    where: {
      slug: param.slug
    },
    include:{
        productCategory:true,
        reviews:true
    }
  });

  return {
    props: {
      product: product,
    },
  };
};
