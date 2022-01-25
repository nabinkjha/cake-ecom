import { NextApiRequest, NextApiResponse } from 'next';
import nc from "next-connect";
import onError from "../../../../../utils/error";
import { isAuth } from "../../../../../utils/auth";
import { PrismaClient } from "@prisma/client";
import Stripe from 'stripe';
const prisma = new PrismaClient();

const handler = nc({
  onError,
});
handler.use(isAuth);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion:'2020-08-27',
});
handler.put(async (req: NextApiRequest, res: NextApiResponse) => {
  const id: string = req.query.id as string;
  try {
    if (!id.startsWith('cs_')) {
      throw Error('Incorrect CheckoutSession ID.');
    }
    const checkout_session: Stripe.Checkout.Session = await stripe.checkout.sessions.retrieve(
      id,
      { expand: ['payment_intent'] }
    );
    const order = await prisma.order.findUnique({
      where: {
        id: +req.query.orderid,
      },
    });
    if (order) {
      order.isPaid = true;
      order.paidAt = new  Date(Date.now());
      order.paymentResult = JSON.stringify(checkout_session);
      const paidOrder = await prisma.order.update({
          where: {
              id: order.id,
            },
            data:order
      });
      res.send({ message: "order paid", order: paidOrder });
    }
    else {
      res.status(404).send({ message: "order not found" });
    }
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
});

export default handler;