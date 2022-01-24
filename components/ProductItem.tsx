import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@material-ui/core";
import React from "react";
import NextLink from "next/link";
import Rating from "@material-ui/lab/Rating";
import { ItemInBasket } from "./cart/context/types";
import { useRouter } from "next/router";
import { useCart } from "./cart/hooks/useCart";
import dynamic from "next/dynamic";
import axios from "axios";

function ProductItem(product: ItemInBasket) {
  const router = useRouter();
  const { cartState, cartDispatch } = useCart();
  const addToCartHandler = async (product: ItemInBasket) => {
    const existItem = cartState.cartitems.find((x) => x.id === product.id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product.id}`);

    if (data.countInStock < quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }
    cartDispatch({ type: "addProduct", payload: { ...product, quantity } });
    router.push("/cart");
  };

  return (
    <div>
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
    </div>
  );
}

//export default dynamic(() => Promise.resolve(ProductItem), { ssr: false });
