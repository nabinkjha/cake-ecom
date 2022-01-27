import nc from 'next-connect';

import { isAuth, isAdmin } from '@/utils/auth';

import { onError } from '@/utils/error';
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const handler = nc({
  onError,
});
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  const ordersCount = await prisma.order.count()
  const productsCount = await prisma.product.count()
  const usersCount = await prisma.user.count()
 
  const ordersPrice = 0;
  const salesData = 0;
  res.send({ ordersCount, productsCount, usersCount, ordersPrice, salesData });
});

export default handler;
