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
    include:{
      productCategory:true
    }
  });
  prisma.$disconnect();
  if (product) {
    res.send(product);
  } else {
    res.status(404).send("The requested resource was not found.");
  }
});
handler.put(async (req: NextApiRequest, res: NextApiResponse) => {

  const {
    name,
    imageUrl,
    description,
    price,
    countInStock
  } = req.body;
  await prisma.product.update({
    where: {
      id:  +req.query.id,
    },
    data: {
      name,
      imageUrl,
      description,
      price:+price,
      countInStock:+countInStock
    }
  })
  .catch((e) => {
    console.log(e);
    res.status(404).send({ message: 'Product Not Found' });
    throw e;
  })
  .finally(() => {
    console.log("Product updated successfully.");
    prisma.$disconnect();
  });
  res.status(200).send("The product updated successfully.");
});

handler.delete(async (req, res) => {
const product = await prisma.product.delete({
  where: {
    id: +req.query.id,
  },
}).catch((e) => {
  console.log(e);
  res.status(404).send({ message: 'Product Not Found' });
  return;
})
.finally(() => {
  prisma.$disconnect();
});
res.send({ message: 'Product with id '+product.id+ ' Deleted' });
});

export default handler;
