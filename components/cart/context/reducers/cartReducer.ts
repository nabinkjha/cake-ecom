import type Prisma from "@prisma/client";
import type { Action, ItemInBasket, State } from "../types";
import Cookies from 'js-cookie';

const calculateTotalPrice = (cartitems: Array<ItemInBasket>) => {
  return cartitems.reduce((acc, curr) => acc + curr.price, 0);
};

export const cartReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "addProduct": {
      const cartitems = [...state.cartitems];
      const newItem = action.payload;
      const isAlredyExist = cartitems.find(
        (cartitem) => cartitem.id === newItem.id
      );
      const newCartItems = [newItem, ...cartitems];
      const totalPrice = calculateTotalPrice(newCartItems);
      if (!isAlredyExist) {
        console.log("Total Price",totalPrice);
        return {
          ...state,
          cartitems: newCartItems,
          totalPrice,
        };
      }
      return state;
    }
    case "deleteProduct": {
      const cartitems = [...state.cartitems];
      const itemToDelete = action.payload;
      const selectedItems = cartitems.filter(
        (product) => product.id !== itemToDelete.id
      );

      const totalPrice = calculateTotalPrice(selectedItems);

      return {
        ...state,
        cartitems: [...selectedItems],
        totalPrice,
      };
    }

    default: {
      return state;
    }
  }
};
