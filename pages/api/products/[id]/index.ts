import nc from "next-connect";
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const handler = nc();

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const product = await prisma.product.findUnique({
    where: {
      id: +req.query.id,
    },
  });
  prisma.$disconnect();
  if (product) {
    res.send(product);
  } else {
    res.status(404).send("The requested resource was not found.");
  }
});
export default handler;
