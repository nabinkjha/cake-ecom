import type { NextPage } from "next";
import NextLink from 'next/link';
import { GetServerSideProps } from 'next';
import { PrismaClient, Product } from "@prisma/client";
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

const Home: NextPage = ({ data }:{data:SearchProps}) => {
  return (
    <Layout title="" >
      <div>
        <h1>Cakes</h1>
        <Grid container spacing={3}>
          {data.products.map((product) => (
            <Grid item md={4} key={product.name}>
              <Card>
                <NextLink href={`/products/${product.slug}`} passHref>
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="300"
                      image={product.imageUrl}
                      title={product.name}
                    ></CardMedia>
                    <CardContent>
                      <Typography>{product.name}</Typography>
                    </CardContent>
                  </CardActionArea>
                </NextLink>
                <CardActions>
                  <Typography> ₹ {product.price}</Typography>
                  <Button size="small" color="primary">
                    Add to cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </Layout>
  );
};

export interface SearchProps {
  products: Product[];
  totalPages: number;
}
// This gets called on every request
export const getServerSideProps: GetServerSideProps<SearchProps> = async (
  ctx
) => {
  const prisma = new PrismaClient();
  const page = +ctx.query.page | 1;
  const rowsPerPage = +ctx.query.rowsPerPage || 3;
  const totalRowsPromise = prisma.product.count() ;
  const productPromise = prisma.product.findMany({
    skip: (page - 1) * rowsPerPage,
    take: rowsPerPage,
  }
  ) ;

  const [products, totalRows] = await Promise.all([productPromise, totalRowsPromise]);
  const totalPages = Math.ceil(totalRows/ rowsPerPage);
  return {
    props: {
      data:{
        products,
        totalPages
      }
     
    },
  };
}

export default Home;
