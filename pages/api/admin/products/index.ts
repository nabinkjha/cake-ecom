import nc from 'next-connect';
import { PrismaClient} from "@prisma/client";
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();
const handler = nc();

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const products = await prisma.product.findMany({
    include: {
        productCategory: true,
        
      },
  }) ;
  res.send(products);
});

export default handler;
