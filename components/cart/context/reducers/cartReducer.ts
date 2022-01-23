import type { Action, ItemInBasket, State } from "../types";
import Cookies from "js-cookie";



export const cartReducer = (state: any, action: Action) => {
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
      Cookies.set("cartItems", JSON.stringify(cartItems));
      return {
        ...state,
        cart: { ...state.cart, cartItems },
      };
    }
    case "REMOVE_CART_ITEM": {
      const cartItems = state.cart.cartItems.filter(
        (item) => item.id !== action.payload.id
      );
      Cookies.set("cartItems", JSON.stringify(cartItems));
      return {
        ...state,
        cart: { ...state.cart, cartItems },
      };
    }
    case "SAVE_SHIPPING_ADDRESS":
      Cookies.set("shippingAddress", JSON.stringify(action.payload));
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
    case "SAVE_PAYMENT_METHOD":
      Cookies.set("paymentMethod", JSON.stringify(action.payload));
      return {
        ...state,
        cart: { ...state.cart, paymentMethod: action.payload },
      };
    case "USER_LOGIN":
      Cookies.set('userInfo',JSON.stringify(action.payload));
      return { ...state, userInfo: action.payload };
    case "USER_LOGOUT":
      Cookies.remove('userInfo');
      Cookies.remove('cartItems');
      Cookies.remove('shippinhAddress');
      Cookies.remove('paymentMethod');
      return {
        ...state,
        userInfo: null,
        cart: {
          cartItems: [],
          shippingAddress: { location: {} },
          paymentMethod: "",
        },
      };
      case 'DARK_MODE_ON':
        Cookies.set('darkMode',JSON.stringify('ON'));
        return { ...state, darkMode: 'ON' };
      case 'DARK_MODE_OFF':
        Cookies.set('darkMode', JSON.stringify('OFF') );
        return { ...state, darkMode: 'OFF' };
    default: {
      return state;
    }
  }
};
