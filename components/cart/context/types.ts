import type Prisma from "@prisma/client";
import { Order } from "@prisma/client";

export type Action =
  | { type: "ADD_CART_ITEM"; payload: ItemInBasket }
  | { type: "REMOVE_CART_ITEM"; payload: ItemInBasket }
  | { type: "DARK_MODE_ON"; payload: boolean | null }
  | { type: "DARK_MODE_OFF"; payload: boolean | null }
  | { type: "SAVE_SHIPPING_ADDRESS"; payload: ShippingAddress }
  | { type: "SAVE_PAYMENT_METHOD"; payload: string }
  | { type: "USER_LOGIN"; payload: string }
  | { type: "USER_LOGOUT"; payload: string }
  | { type: "ORDER_FETCH_REQUEST"; payload: null }
  | { type: "ORDER_FETCH_SUCCESS"; payload: Prisma.Order }
  | { type: "ORDER_FETCH_FAIL"; payload: string }
  | { type: "PAY_REQUEST"; payload: null }
  | { type: "PAY_SUCCESS"; payload: Prisma.Order }
  | { type: "PAY_FAIL"; payload: string }
  | { type: "PAY_RESET"; payload: null }
  | { type: "DELIVER_REQUEST"; payload: string }
  | { type: "DELIVER_SUCCESS"; payload: Prisma.Order }
  | { type: "DELIVER_FAIL"; payload: string }
  | { type: "DELIVER_RESET"; payload: null }
  | { type: "USER_FETCH_REQUEST"; payload: null }
  | { type: "USER_FETCH_SUCCESS"; payload: null }
  | { type: "USER_FETCH_FAIL"; payload: null }
  | { type: "USER_DELETE_REQUEST"; payload: null }
  | { type: "USER_DELETE_SUCCESS"; payload: null }
  | { type: "USER_DELETE_FAIL"; payload: null }
  | { type: "USER_DELETE_RESET"; payload: null }
  | { type: "USER_UPDATE_REQUEST"; payload: null }
  | { type: "USER_UPDATE_SUCCESS"; payload: null }
  | { type: "USER_UPDATE_FAIL"; payload: null }
  | { type: "USER_UPDATE_RESET"; payload: null }
  | { type: "ORDERS_FETCH_REQUEST"; payload: null }
  | { type: "ORDERS_FETCH_SUCCESS"; payload: null }
  | { type: "ORDERS_FETCH_FAIL"; payload: null }
  | { type: "SUMMARY_FETCH_REQUEST"; payload: null }
  | { type: "SUMMARY_FETCH_SUCCESS"; payload: null }
  | { type: "SUMMARY_FETCH_FAIL"; payload: null };

export type State = {
  readonly cart: cart;
  readonly order: any | null;
  readonly userInfo: Prisma.User | null;
  readonly darkMode: string | null;
  readonly loading: boolean | true;
  readonly error: string | null;
  readonly successPay: string | null;
  readonly loadingDeliver: string | null;
  readonly successDeliver: string | null;
  readonly users: Array<Prisma.User> | null;
  readonly successDelete: string | null;
  readonly loadingDelete: string | null;
  readonly successUpdate: string | null;
  readonly loadingUpdate: string | null;
  readonly orders: Array<Prisma.Order> | null;
  readonly summary: summary | null;
};

export interface cart {
  cartItems: Array<ItemInBasket>;
  shippingAddress: ShippingAddress;
  paymentMethod: string;
}

export interface ItemInBasket {
  id: number;
  name: string;
  slug: string;
  description: string;
  category: string;
  imageUrl: string;
  quantity: number;
  countInStock: number;
  price: number;
  rating: number;
}
export interface ShippingAddress {
  fullName: string | null;
  address: string | null;
  city: string | null;
  postalCode: string | null;
  country: string | null;
  location: Location | null;
}
export interface Location {
  lat: string | null;
  lng: string | null;
  address: string | null;
  name: string | null;
  vicinity: string | null;
  googleAddressId: string | null;
}
export interface summary {
  ordersCount: number | null;
  productsCount: number | null;
  usersCount: number | null;
  ordersPrice: number | null;
  salesData: [];
}
