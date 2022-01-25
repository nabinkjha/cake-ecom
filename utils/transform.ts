import type Prisma from "@prisma/client";
import type Stripe from "stripe";
import { formatAmountForStripe } from "./stripe-helpers";
import { CURRENCY } from '../config';
export const transformProduct = ({
  name,
  description,
  price,
  quantity,
  imageUrl
}: any): Stripe.Checkout.SessionCreateParams.LineItem => ({
  name,
  description,
  amount: formatAmountForStripe(price,CURRENCY),
  currency: CURRENCY,
  images: [imageUrl],
  quantity: quantity
});
