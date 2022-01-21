import type { NextPage } from "next";
import NextLink from "next/link";
import { GetServerSideProps } from "next";
import { PrismaClient } from "@prisma/client";
import axios from 'axios';
import {
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@mui/material";
import Layout from "../components/Layout";
import { ItemInBasket } from "../components/cart/context/reducers/types";
import { Rating } from "@material-ui/lab";
import { useRouter } from "next/router";
import { useCart } from "../components/cart/hooks/useCart";

const Home: NextPage = ({ data }: { data: SearchProps }) => {

  const router = useRouter();
  const { state, dispatch } = useCart();
  const addToCartHandler = async (product: ItemInBasket) => {
    const existItem = state.cartitems.find((x) => x.id === product.id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product.id}`);

    if (data.countInStock < quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }
    dispatch({ type: "addProduct", payload: { ...product, quantity } });
    router.push("/cart");
  };

  return (
    <div id="divNabin">
      <Layout title="">
        <h1>Cakes</h1>
        <Grid container spacing={3}>
          {data.items.map((product) => (
            <Grid item md={4} key={product.name}>
              {/* <ProductItem key={product.id} {...product} /> */}

              <Card>
                <NextLink href={`/product/${product.slug}`} passHref>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="300"
                      image={product.imageUrl}
                      title={product.name}
                    ></CardMedia>
                    <CardContent>
                      <Typography>{product.name}</Typography>
                      <Rating value={product.rating} readOnly></Rating>
                    </CardContent>
                  </CardActionArea>
                </NextLink>
                <CardActions>
                  <Typography>Rs.{product.price}</Typography>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => addToCartHandler(product)}
                  >
                    Add to cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Layout>
    </div>
  );
};

export interface SearchProps {
  items: ItemInBasket[];
  totalPages: number;
}
// This gets called on every request
export const getServerSideProps: GetServerSideProps<SearchProps> = async (
  ctx
) => {
  const prisma = new PrismaClient();
  const page = +ctx.query.page | 1;
  const rowsPerPage = +ctx.query.rowsPerPage || 6;
  const totalRowsPromise = prisma.product.count();
  const productPromise = prisma.product.findMany({
    skip: (page - 1) * rowsPerPage,
    take: rowsPerPage,
  });

  const [products, totalRows] = await Promise.all([
    productPromise,
    totalRowsPromise,
  ]);
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  return {
    props: {
      data: {
        items: products,
        totalPages,
      },
    },
  };
};

export default Home;
