import nc from 'next-connect';
import { PrismaClient} from "@prisma/client";
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();
const handler = nc();

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  console.log('Get products from index');
  const page = +req.query.page | 1;
  const rowsPerPage = +req.query.rowsPerPage || 3;
  const totalRowsPromise = prisma.product.count() ;
  const productPromise = prisma.product.findMany({
    skip: (page - 1) * rowsPerPage,
    take: rowsPerPage,
  }
  ) ;
  const [products, totalRows] = await Promise.all([productPromise, totalRowsPromise]);
  const totalPages = Math.ceil(totalRows/ rowsPerPage);
 
  res.send({products,totalPages});
});

export default handler;
