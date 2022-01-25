import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from "@prisma/client";
/*
 * Product data can be loaded from anywhere. In this case, we’re loading it from
 * a local JSON file, but this could also come from an async call to your
 * inventory management service, a database query, or some other API call.
 *
 * The important thing is that the product info is loaded from somewhere trusted
 * so you know the pricing information is accurate.
 */

import Stripe from 'stripe';
import { transformProduct } from '../../../../../utils/transform';
import { isTemplateExpression } from 'typescript';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: '2020-08-27'
});
const prisma = new PrismaClient();
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const order = await prisma.order.findUnique({
        where: {
          id: +req.query.orderid
        },
        include:{
          shippingAddress:true,
          orderItems:{
            include: {
              product: true,
            }       
        }
      }
      });
      
    // Validate the cart details that were sent from the client.
      const line_items = order?.orderItems;
      var products = line_items?.map((item) => ({...item.product,quantity:item.quantity}));
      const stripeItems = products?.map((product) => transformProduct(product));
      //Create Checkout Sessions from body params.
      const params: Stripe.Checkout.SessionCreateParams = {
        mode: 'payment',
        submit_type: 'pay',
        payment_method_types: ['card'],
        billing_address_collection: 'auto',
        shipping_address_collection: {
          allowed_countries: ['US', 'GB'],
        },
        line_items:stripeItems,
        success_url: `${req.headers.origin}/order/stripe/result?session_id={CHECKOUT_SESSION_ID}&orderid=${order.id}`,
        cancel_url: `${req.headers.origin}/placeorder`,
      };
      const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.create(
        params
      );
      res.status(200).json(checkoutSession);
    } catch (err) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
