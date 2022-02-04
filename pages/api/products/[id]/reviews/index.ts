import nextConnect from "next-connect";
import { onError } from "@/utils/error";
import { isAuth } from "@/utils/auth";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();
const handler = nextConnect({
  onError,
});

handler.get(async  (req: NextApiRequest, res: NextApiResponse) => {

  const product = await prisma.product
    .findUnique({
      where: {
        id: +req.query.id,
      },
      select: {
        reviews: true
      },
    })
    .catch((e) => {
      console.log(e);
      throw e;
    })
    .finally(() => {
      prisma.$disconnect();
    });
  if (product) {
    res.send(product.reviews);
  } else {
    res.status(404).send({ message: "Product not found" });
  }
});

handler.use(isAuth).post(async  (req: NextApiRequest, res: NextApiResponse) => {
  let product = await prisma.product.findUnique({
    where: {
      id: +req.query.id,
    },
    include: {
      reviews: true,
    },
  });

  if (product) {
    const existReview = product.reviews.find( (item) => item.reviewerId === req.user.id );
    if (existReview) {
      await prisma.review
      .update({
        where: {
          id: existReview.id,
        },
        data: {
          rating: Number(req.body.rating),
          name: req.body.name,
          content: req.body.content,
        }
      });
      product.rating = product.reviews.reduce((a, c) => c.rating + a, 0) / product.reviews.length;
      product = await prisma.product.update({
        where: {
          id: +req.query.id,
        },
        data: {
          rating:product.rating,
        },
        include: {
          reviews: true,
        },
      });
      return res.send({product, message: "Review updated" });
    } else {
      const newReview = {
        rating: Number(req.body.rating),
        name: req.body.name,
        content: req.body.content,
        reviewer: {
          connect: {
            id: req.user.id,
          },
        },
        product: {
          connect: {
            id: product.id,
          },
        },
        createdAt: new Date(Date.now()),
      };
      await prisma.review.create({
        data: newReview,
      });
      product = await prisma.product
        .update({
          where: {
            id: product.id,
          },
          data: {
            numReviews: 1,
            rating: newReview.rating,
          },
          include: {
            reviews: true,
          },
        })
        .catch((e) => {
          console.log(e);
          throw e;
        })
        .finally(() => {
          prisma.$disconnect();
        });
      res.status(201).send({product,
        message: "Review submitted",
      });
    }
  } else {
    await prisma.$disconnect();
    res.status(404).send({ message: "Product Not Found" });
  }
});

export default handler;
