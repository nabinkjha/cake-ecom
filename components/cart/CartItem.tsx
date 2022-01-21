import Image from "next/image";
import { useCart } from "./hooks/useCart";
import NextLink from "next/link";
import axios from 'axios';
import {
  Typography,
  TableRow,
  TableCell,
  Link,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { ItemInBasket } from "./context/types";

export const CartItem = (product: ItemInBasket) => {
  const { dispatch } = useCart();

  const handleDelete = (product: ItemInBasket) => {
    dispatch({ type: "deleteProduct", payload: product });
  };

  const updateCartHandler = async (item:ItemInBasket, quantity:number) => {
    const { data } = await axios.get(`/api/products/${item.id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    dispatch({ type: 'addProduct', payload: { ...item, quantity } });
  };

  return (
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
          onChange={(e) => updateCartHandler(product, e.target.value)}
        >
          {[...Array(product.countInStock).keys()].map((x) => (
            <MenuItem key={x + 1} value={x + 1}>
              {x + 1}
            </MenuItem>
          ))}
        </Select>
      </TableCell>
      <TableCell align="right">${product.price}</TableCell>
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
  );
};
