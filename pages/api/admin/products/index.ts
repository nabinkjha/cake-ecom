import nc from "next-connect";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();
const handler = nc();

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const products = await prisma.product.findMany({
    include: {
      productCategory: true,
    },
  });
  res.send(products);
});
handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("Creating product");
  try {
    const { name, slug, imageUrl, price, countInStock, description } = req.body;
    const newProduct = {
      name,
      slug,
      imageUrl,
      description,
      price: +price,
      countInStock: +countInStock,
      brand:"",
      rating:1,
      numReviews:4

    };
    console.log(newProduct);
    newProduct.id = await prisma.product
      .create({ data: newProduct })
      .catch((e) => {
        console.log(e);
        throw e;
      })
      .finally(() => {
        prisma.$disconnect();
      });
    res.send({ message: "Product Created", newProduct });
  } catch (err) {
    res.status(500).send({ message: err });
    console.log(err);
  }
});
export default handler;
