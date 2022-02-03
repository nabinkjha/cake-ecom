import nc from 'next-connect';
import { PrismaClient} from "@prisma/client";
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();
const handler = nc();

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const productCategories = await prisma.productCategory.findMany({}).catch((e) => {
    console.log(e);
    throw e;
  })
  .finally(() => {
    prisma.$disconnect();
  });
  res.send(productCategories);
});

export default handler;
