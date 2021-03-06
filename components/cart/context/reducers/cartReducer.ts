import type { Action, ItemInBasket, State } from "../types";
import Cookies from "js-cookie";

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
      Cookies.set("userInfo", JSON.stringify(action.payload));
      return { ...state, userInfo: action.payload };
    case "USER_LOGOUT":
      Cookies.remove("userInfo");
      Cookies.remove("cartItems");
      Cookies.remove("shippinhAddress");
      Cookies.remove("paymentMethod");
      return {
        ...state,
        userInfo: null,
        cart: {
          cartItems: [],
          shippingAddress: { location: {} },
          paymentMethod: "",
        },
      };
    case "DARK_MODE_ON":
      Cookies.set("darkMode", JSON.stringify("ON"));
      return { ...state, darkMode: "ON" };
    case "DARK_MODE_OFF":
      Cookies.set("darkMode", JSON.stringify("OFF"));
      return { ...state, darkMode: "OFF" };
    case "ORDER_FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "ORDER_FETCH_SUCCESS":
      return { ...state, loading: false, order: action.payload, error: "" };
    case "ORDER_FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "ORDERS_FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "ORDERS_FETCH_SUCCESS":
      return { ...state, loading: false, orders: action.payload, error: "" };
    case "ORDERS_FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "PAY_REQUEST":
      return { ...state, loadingPay: true };
    case "PAY_SUCCESS":
      return { ...state, loadingPay: false, successPay: true };
    case "PAY_FAIL":
      return { ...state, loadingPay: false, errorPay: action.payload };
    case "PAY_RESET":
      return { ...state, loadingPay: false, successPay: false, errorPay: "" };

    case "DELIVER_REQUEST":
      return { ...state, loadingDeliver: true };
    case "DELIVER_SUCCESS":
      return { ...state, loadingDeliver: false, successDeliver: true };
    case "DELIVER_FAIL":
      return { ...state, loadingDeliver: false, errorDeliver: action.payload };
    case "DELIVER_RESET":
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: false,
        errorDeliver: "",
      };

    case "USER_FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "USER_FETCH_SUCCESS":
      return { ...state, loading: false, users: action.payload, error: "" };
    case "USER_FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "USER_DELETE_REQUEST":
      return { ...state, loadingDelete: true };
    case "USER_DELETE_SUCCESS":
      return { ...state, loadingDelete: false, successDelete: true };
    case "USER_DELETE_FAIL":
      return { ...state, loadingDelete: false };
    case "USER_DELETE_RESET":
      return { ...state, loadingDelete: false, successDelete: false };
    case "USER_UPDATE_REQUEST":
      return { ...state, loadingDelete: true };
    case "USER_UPDATE_SUCCESS":
      return { ...state, loadingDelete: false, successDelete: true };
    case "USER_UPDATE_FAIL":
      return { ...state, loadingDelete: false };
    case "USER_UPDATE_RESET":
      return { ...state, loadingDelete: false, successDelete: false };
    case "ORDERS_FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "ORDERS_FETCH_SUCCESS":
      return { ...state, loading: false, orders: action.payload, error: "" };
    case "ORDERS_FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "SUMMARY_FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "SUMMARY_FETCH_SUCCESS":
      return { ...state, loading: false, summary: action.payload, error: "" };
    case "SUMMARY_FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "PRODUCTS_FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "PRODUCTS_FETCH_SUCCESS":
      return { ...state, loading: false, products: action.payload, error: "" };
    case "PRODUCTS_FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "PRODUCT_FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "PRODUCT_FETCH_SUCCESS":
      return { ...state, loading: false, product: action.payload, error: "" };
    case "PRODUCT_FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "PRODUCT_CREATE_REQUEST":
      return { ...state, loadingCreate: true };
    case "PRODUCT_CREATE_SUCCESS":
      return { ...state, loadingCreate: false };
    case "PRODUCT_CREATE_FAIL":
      return { ...state, loadingCreate: false };
    case "PRODUCT_DELETE_REQUEST":
      return { ...state, loadingDelete: true };
    case "PRODUCT_DELETE_SUCCESS":
      return { ...state, loadingDelete: false, successDelete: true };
    case "PRODUCT_DELETE_FAIL":
      return { ...state, loadingDelete: false };
    case "PRODUCT_DELETE_RESET":
      return { ...state, loadingDelete: false, successDelete: false };
    case "PRODUCT_UPDATE_REQUEST":
      return { ...state, loadingUpdate: true, errorUpdate: "" };
    case "PRODUCT_UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false, errorUpdate: "" };
    case "PRODUCT_UPDATE_FAIL":
      return { ...state, loadingUpdate: false, errorUpdate: action.payload };
    case "PRODUCT_IMAGE_UPLOAD_REQUEST":
      return { ...state, loadingUpload: true, errorUpload: "" };
    case "PRODUCT_DETAIL_VIEW":
      return { ...state,loading:false, product:action.payload};

    case "PRODUCT_IMAGE_UPLOAD_SUCCESS":
      return {
        ...state,
        loadingUpload: false,
        errorUpload: "",
      };
    case "PRODUCT_IMAGE_UPLOAD_FAIL":
      return { ...state, loadingUpload: false, errorUpload: action.payload };
    case "PRODUCT_REVIEW_UPDATED":
      return { ...state, loadingUpload: false, errorUpload: action.payload };
    //
    default: {
      return state;
    }
  }
};
