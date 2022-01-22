import {
  ReactNode,
  createContext,
  useReducer,
  useContext,
  useMemo,
  useState,
} from "react";
import { cartReducer } from "./reducers/cartReducer";
import type { Action, cart, State } from "./types";
import Cookies from "js-cookie";
import { User } from "@prisma/client";

type Dispatch = (action: Action) => void;
type CartProviderProps = { readonly children: React.ReactNode };
export const CartStateContext = createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined);

const cartItems = Cookies.get("cartItems")
  ? JSON.parse(Cookies.get("cartItems"))
  : [];
const shippingAddress = Cookies.get("shippingAddress")
  ? JSON.parse(Cookies.get("shippingAddress"))
  : { location: {} };
const paymentMethod = Cookies.get("paymentMethod")
  ? Cookies.get("paymentMethod")
  : "";
const userInfo = Cookies.get("userInfo")
  ? JSON.parse(Cookies.get("userInfo")) as User
  : null;
 const darkMode = Cookies.get("darkMode")
  ? JSON.parse(Cookies.get("darkMode")) as string
  : null;
  const cartcookie: cart = {
  cartItems: cartItems,
  shippingAddress: shippingAddress,
  paymentMethod: paymentMethod,
};


const initialState: State = {
  cart: cartcookie,
  userInfo: userInfo,
  totalPrice: 0,
  darkMode:darkMode
};

export function CartProvider({ children }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return (
    <CartStateContext.Provider value={value}>
      {children}
    </CartStateContext.Provider>
  );
}
