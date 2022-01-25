import nc from "next-connect";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { isAuth } from "../../../../../utils/auth";
import { NextApiRequest, NextApiResponse } from "next";

const handler = nc();
handler.use(isAuth);
handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const order = await prisma.order.findUnique({
    where: {
      id: +req.query.orderid,
    },
    include: {
      shippingAddress: true,
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });
  res.send(order);
});

export default handler;
