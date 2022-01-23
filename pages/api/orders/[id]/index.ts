import nc from 'next-connect';
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { isAuth } from '../../../../utils/auth';

const handler = nc();
handler.use(isAuth);
handler.get(async (req, res) => {
  const order = await prisma.order.findUnique({
    where: {
      id: +req.query.id
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
  res.send(order);
});

export default handler;