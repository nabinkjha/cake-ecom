import {
  createContext,
  useReducer,
  useMemo,
} from "react";
import { cartReducer } from "./reducers/cartReducer";
import type { Action, cart, State } from "./types";
import Cookies from "js-cookie";
import {  User } from "@prisma/client";

type Dispatch = (action: Action) => void;
type CartProviderProps = { readonly children: React.ReactNode };
export const CartStateContext = createContext<
  { cartState: State; cartDispatch: Dispatch } | undefined
>(undefined);

const cartItems = Cookies.get("cartItems")
  ? JSON.parse(Cookies.get("cartItems"))
  : [];
const shippingAddress = Cookies.get("shippingAddress")
  ? JSON.parse(Cookies.get("shippingAddress"))
  : { location: {} };
const paymentMethod = Cookies.get("paymentMethod")
  ? JSON.parse(Cookies.get("paymentMethod"))
  : "";
const userInfo = Cookies.get("userInfo")
  ? (JSON.parse(Cookies.get("userInfo")) as User)
  : null;
const darkMode = Cookies.get("darkMode")
  ? (JSON.parse(Cookies.get("darkMode")) as string)
  : null;
const totalPrice = Cookies.get("totalPrice")
  ? (JSON.parse(Cookies.get("totalPrice")) as number)
  : 0;
const cartcookie: cart = {
  cartItems: cartItems,
  shippingAddress: shippingAddress,
  paymentMethod: paymentMethod,
};
const order={
  shippingAddress:{},
    paymentMethod:"",
    orderItems:[],
    itemsPrice:null,
    taxPrice:null,
    shippingPrice:null,
    totalPrice:null,
    createdAt:null,
    isPaid:false,
    paidAt:null,
    isDelivered:false,
    deliveredAt:null,
}
const summary ={
  ordersCount: 0,
  productsCount:0,
  usersCount:0,
  ordersPrice: 0,
  salesData: []
}
const product ={
  id:0,
  name: "",
  slug: "",
  description: "",
  imageUrl: "",
  isFeatured: false,
  featuredImage: "",
  price: null,
  brand: "",
  rating: 0,
  numReviews: 0,
  countInStock: 0,
  productCategory:  {},
};
const initialState: State = {
  cart: cartcookie,
  order:order,
  userInfo: userInfo,
  darkMode: darkMode,
  loading: true,
  error: "",
  successPay: "",
  loadingDeliver: "",
  successDeliver: "",
  users:[],
  successDelete:"",
  loadingDelete:"",
  successUpdate:"",
  loadingUpdate:"",
  orders:[],
  summary:summary,
  product:product,
  products:[],

  message: '',
  onSubmit: undefined,
  close: () => { onSubmit: undefined },
};

export function CartProvider({ children }: CartProviderProps) {
  const [cartState, cartDispatch] = useReducer(cartReducer, initialState);

  const value = useMemo(() => ({ cartState, cartDispatch }), [cartState]);
  return (
    <CartStateContext.Provider value={value}>
      {children}
    </CartStateContext.Provider>
  );
}
