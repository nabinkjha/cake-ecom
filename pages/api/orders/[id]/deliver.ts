import nc from "next-connect";
import onError from "../../../../utils/error";
import { isAuth } from "../../../../utils/auth";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
const prisma = new PrismaClient();
const handler = nc({
  onError,
});
handler.use(isAuth);
handler.put(async (req: NextApiRequest, res: NextApiResponse) => {
  const order = await prisma.order.findUnique({
    where: {
      id: +req.query.id,
    },
  });
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = new Date(Date.now());
    const deliveredOrder = await prisma.order.update({
      where: {
        id: order.id,
      },
      data: order,
    });
    res.send({ message: "order delivered", order: deliveredOrder });
  } else {
    res.status(404).send({ message: "order not found" });
  }
});

export default handler;
