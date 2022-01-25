import nc from 'next-connect';
import { isAuth } from '../../../utils/auth';
import { onError } from '../../../utils/error';
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();
const handler = nc({
  onError,
});
handler.use(isAuth);
handler.post(async (req:NextApiRequest, res:NextApiResponse) => {
  const newOrder = {
    ...req.body,
    user: req.user,
  };
   const orderItems = newOrder.orderItems.map(item => {
    const orderItem = {};
    orderItem.product = { connect: { id:item.id } },
    orderItem.quantity= item.quantity,
    orderItem.price  = item.price
    return orderItem;
});

try {
  const order =  await prisma.order.create({
    data:{
        paymentMethod: newOrder.paymentMethod,
        itemsPrice:  newOrder.itemsPrice,
        shippingPrice: newOrder.shippingPrice,
        taxPrice:  newOrder.taxPrice,
        totalPrice:  newOrder.totalPrice,
        user:{connect:{
            id:req.user.id
        }},
        orderItems:{
            create:orderItems
        },
        shippingAddress:{
           create:newOrder.shippingAddress
        }
    }
}).catch((e) => {
      console.log(e);
    })
    .finally(() => {
      prisma.$disconnect();
    });
    console.log('Order created successfully ',JSON.stringify(order));
  res.status(201).send(order);
} catch (error) {
  console.log(error);
}
});
export default handler;
