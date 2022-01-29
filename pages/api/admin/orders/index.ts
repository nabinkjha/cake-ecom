import nc from 'next-connect';
import { isAuth } from '@/utils/auth';
import { onError } from '@/utils/error';
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();
const handler = nc({
  onError,
});
handler.use(isAuth);

handler.get(async (req:NextApiRequest, res:NextApiResponse) => {
  const orders = await prisma.order.findMany({
    include: {
      orderItems: true,
      user: true,
      shippingAddress:true
    },
  });
  res.send(orders);
});

export default handler;
