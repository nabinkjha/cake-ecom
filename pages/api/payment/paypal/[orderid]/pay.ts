import nc from "next-connect";
import onError from "../../../../../utils/error";
import { isAuth } from "../../../../../utils/auth";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
const prisma = new PrismaClient();

const handler = nc({
  onError,
});
handler.use(isAuth);
handler.put(async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("The API request is received to update the Order", req.body);
  const order = await prisma.order.findUnique({
    where: {
      id: +req.query.orderid,
    },
  });
  if (order) {
    order.isPaid = true;
    order.paidAt = new  Date(Date.now());
    order.paymentResult = JSON.stringify({
      id: req.body.id,
      status: req.body.status,
      email_address: req.body.email_address,
    });
    const paidOrder = await prisma.order.update({
        where: {
            id: order.id,
          },
          data:order
    });
    res.send({ message: "order paid", order: paidOrder });
  } else {
    res.status(404).send({ message: "order not found" });
  }
});

export default handler;
