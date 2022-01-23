import type Prisma from "@prisma/client";

export type Action =
  | { type: "ADD_CART_ITEM"; payload: ItemInBasket }
  | { type: "REMOVE_CART_ITEM"; payload: ItemInBasket }
  | { type: "DARK_MODE_ON"; payload: boolean | null }
  | { type: "DARK_MODE_OFF"; payload: boolean | null }
  | { type: "SAVE_SHIPPING_ADDRESS"; payload: ShippingAddress }
  | { type: "SAVE_PAYMENT_METHOD"; payload: string }
  | { type: "USER_LOGIN"; payload: string }
  | { type: "USER_LOGOUT"; payload: string };

export type State = {
  readonly cart: cart;
  readonly userInfo: Prisma.User | null;
  readonly darkMode: string | null;
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
export type PaymentAction =
  | { type: "FETCH_REQUEST"; payload: null }
  | { type: "FETCH_SUCCESS"; payload: Prisma.Order }
  | { type: "FETCH_FAIL"; payload: string }
  | { type: "PAY_REQUEST"; payload: null }
  | { type: "PAY_SUCCESS"; payload: Prisma.Order }
  | { type: "PAY_FAIL"; payload: string }
  | { type: "PAY_RESET"; payload: null }
  | { type: "DELIVER_REQUEST"; payload: string }
  | { type: "DELIVER_SUCCESS"; payload: Prisma.Order }
  | { type: "DELIVER_FAIL"; payload: string }
  | { type: "DELIVER_RESET"; payload: null };

export type PaymentState = {
  loading: boolean | null;
  error: string | null;
  order:Prisma.Order| null;
  successPay: string | null;
  loadingDeliver: string | null;
  successDeliver:  string | null;
};
