import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  List,
  ListItem,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import CancelIcon from "@material-ui/icons/Cancel";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import Layout from "@/components/Layout";
import useStyles from "../utils/style";
import axios from "axios";
import Rating from "@material-ui/lab/Rating";
import { Pagination } from "@material-ui/lab";
import { PrismaClient } from "@prisma/client";
import NextLink from "next/link";
const PAGE_SIZE = 3;

const prices = [
  {
    name: "₹300 to ₹500",
    value: "300-500",
  },
  {
    name: "₹501 to ₹1000",
    value: "501-1000",
  },
  {
    name: "₹1000+",
    value: "1000+",
  },
];

const ratings = [1, 2, 3, 4, 5];

export default function Search(props) {
  const classes = useStyles();
  const router = useRouter();
  const {
    query = "all",
    category = "all",
    brand = "all",
    price = "all",
    rating = "all",
    sort = "lowest",
  } = router.query;
  const { products, countProducts, categories,  pages } = props;

  const filterSearch = ({
    page,
    category,
    brand,
    sort,
    min,
    max,
    searchQuery,
    price,
    rating,
  }: {
    page: number;
    category: string;
    brand: string;
    sort: string;
    min: number;
    max: number;
    searchQuery: string;
    price: number;
    rating: number;
  }) => {
    const path = router.pathname;
    const { query } = router;
    if (page) query.page = page.toString();
    if (searchQuery) query.searchQuery = searchQuery;
    if (sort) query.sort = sort;
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (price) query.price = price.toString();
    if (rating) query.rating = rating.toString();
    if (min) query.min ? query.min : +query.min === 0 ? 0 : min;
    if (max) query.max ? query.max : +query.max === 0 ? 0 : max;

    router.push({
      pathname: path,
      query: query,
    });
  };
  const categoryHandler = (e) => {
    filterSearch({ category: e.target.value });
  };
  const pageHandler = (e, page) => {
    filterSearch({ page });
  };
  const sortHandler = (e) => {
    filterSearch({ sort: e.target.value });
  };
  const priceHandler = (e) => {
    filterSearch({ price: e.target.value });
  };
  const ratingHandler = (e) => {
    filterSearch({ rating: e.target.value });
  };

  const addToCartHandler = async (product) => {
    const existItem = state.cart.cartItems.find((x) => x.id === product.id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }
    dispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity } });
    router.push("/cart");
  };
  return (
    <Layout title="Search">
      <Grid className={classes.mt1} container spacing={1}>
        <Grid item md={3}>
          <List>
            <ListItem>
              <Box className={classes.fullWidth}>
                <Typography>Categories</Typography>
                <Select fullWidth value={category} onChange={categoryHandler}>
                  <MenuItem value="all">All</MenuItem>
                  {categories &&
                    categories.map((category) => (
                      <MenuItem key={category.id} value={category.name}>
                        {category.name}
                      </MenuItem>
                    ))}
                </Select>
              </Box>
            </ListItem>
            <ListItem>
              <Box className={classes.fullWidth}>
                <Typography>Prices</Typography>
                <Select value={price} onChange={priceHandler} fullWidth>
                  <MenuItem value="all">All</MenuItem>
                  {prices.map((price) => (
                    <MenuItem key={price.value} value={price.value}>
                      {price.name}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </ListItem>
            <ListItem>
              <Box className={classes.fullWidth}>
                <Typography>Ratings</Typography>
                <Select value={rating} onChange={ratingHandler} fullWidth>
                  <MenuItem value="all">All</MenuItem>
                  {ratings.map((rating) => (
                    <MenuItem dispaly="flex" key={rating} value={rating}>
                      <Rating value={rating} readOnly />
                      <Typography component="span">&amp; Up</Typography>
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </ListItem>
          </List>
        </Grid>
       <Grid item md={9}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              {products.length === 0 ? "No" : countProducts} Results
              {query !== "all" && query !== "" && " : " + query}
              {category !== "all" && " : " + category}
              {brand !== "all" && " : " + brand}
              {price !== "all" && " : Price " + price}
              {rating !== "all" && " : Rating " + rating + " & up"}
              {(query !== "all" && query !== "") ||
              category !== "all" ||
              rating !== "all" ||
              price !== "all" ? (
                <Button onClick={() => router.push("/search")}>
                  <CancelIcon />
                </Button>
              ) : null}
            </Grid>
            <Grid item>
              <Typography component="span" className={classes.sort}>
                Sort by
              </Typography>
              <Select value={sort} onChange={sortHandler}>
                <MenuItem value="lowest">Price: Low to High</MenuItem>
                <MenuItem value="highest">Price: High to Low</MenuItem>
                <MenuItem value="toprated">Customer Reviews</MenuItem>
                <MenuItem value="newest">Newest Arrivals</MenuItem>
              </Select>
            </Grid>
          </Grid>
           <Grid className={classes.mt1} container spacing={3}>
            {products.map((product) => (
              <Grid item md={4} key={product.name}>
                {/* <ProductItem
                  product={product}
                  addToCartHandler={addToCartHandler}
                /> */}
                
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
          <Pagination
            className={classes.mt1}
            defaultPage={parseInt(query.page || "1")}
            count={pages}
            onChange={pageHandler}
          ></Pagination>
        </Grid>
      </Grid> 
     
    </Layout>
  );
}

export async function getServerSideProps({ query }) {
  const prisma = new PrismaClient();
  const pageSize = query.pageSize || PAGE_SIZE;
  const page = query.page || 1;
  const category = query.category || "";
  const price = query.price || "";
  const rating = query.rating || "";
  const sort = query.sort || "";
  const searchQuery = query.query || "";
  const createQuery =[];

  const queryFilter =
    searchQuery && searchQuery !== "all"
      ? {
          name: {
            contains: searchQuery
          },
        }
      : null;
      if(queryFilter !==null){
        createQuery.push(queryFilter);
      }

  const categoryFilter = category && category !== "all" ? {     productCategory: {
    name: category,
  }, } : null;
  if(categoryFilter !==null){
    createQuery.push(categoryFilter);
  }
  const ratingFilter =
    rating && rating !== "all"
      ? {
          rating: {
            gte: Number(rating),
          },
        }
      :null;
      if(ratingFilter !==null){
        createQuery.push(ratingFilter);
      }
   
  // 10-50
  const priceFilter =
    price && price !== "all"
      ? {
          price: {
            gte: Number(price.split("-")[0]),
            lte: Number(price.split("-")[1]),
          },
        }
      : null;
      if(priceFilter !==null){
        createQuery.push(priceFilter);
      }
if(createQuery.length === 0){
  createQuery.push({});
}
  const order =
   sort === "lowest"
      ? { price: 'asc' }
      : sort === "highest"
      ? { price: 'desc' }
      : sort === "toprated"
      ? { rating: 'desc' }
      : sort === "newest"
      ? { id: "desc" }
      : { id:"asc" };

  const categoryPromise = prisma.productCategory.findMany({});
  const countProductPromise = prisma.product.count({
    where: {
      AND:createQuery
    },
  });
  const productPromise = prisma.product.findMany({
    where: {
     AND:createQuery,
    },
    orderBy: [order],
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const [products, countProducts, categories] = await Promise.all([
    productPromise,
    countProductPromise,
    categoryPromise,
  ]);
  return {
    props: {
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
      categories,
    },
  };
}
