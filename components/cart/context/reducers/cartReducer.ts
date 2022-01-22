import type { Action, ItemInBasket, State } from "../types";
import Cookies from 'js-cookie';

const calculateTotalPrice = (cartitems: Array<ItemInBasket>) => {
  return cartitems.reduce((acc, curr) => acc + curr.price, 0);
};

export const cartReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "ADD_CART_ITEM": {
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item.id === newItem.id
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item.name === existItem.name ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
      const totalPrice = calculateTotalPrice(cartItems);
      Cookies.set('cartItems', JSON.stringify(cartItems));
      return { ...state,totalPrice:totalPrice, cart: { ...state.cart, cartItems } };
    }
    case "REMOVE_CART_ITEM": {
      const cartItems = state.cart.cartItems.filter(
        (item) => item.id !== action.payload.id
      );
      const totalPrice = calculateTotalPrice(cartItems);
      Cookies.set('cartItems', JSON.stringify(cartItems));
      return { ...state,totalPrice:totalPrice,  cart: { ...state.cart, cartItems } };
    }
    case 'SAVE_SHIPPING_ADDRESS':
      Cookies.set('shippingAddress', JSON.stringify(action.payload));
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: {
            ...state.cart.shippingAddress,
            ...action.payload,
          },
        },
      };
      case 'SAVE_PAYMENT_METHOD':
        Cookies.set('paymentMethod', JSON.stringify(action.payload));
        return {
          ...state,
          cart: { ...state.cart, paymentMethod: action.payload },
        };
    default: {
      return state;
    }
  }
};
