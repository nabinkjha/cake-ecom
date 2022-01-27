import nc from "next-connect";
import { isAdmin, isAuth } from "@/utils/auth";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
const prisma = new PrismaClient();

const handler = nc();
handler.use(isAuth, isAdmin);

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await prisma.user
    .findUnique({
      where: {
        id: +req.query.id,
      },
    })
    .catch((e) => {
      console.log(e);
    })
    .finally(() => {
      prisma.$disconnect();
    });
  res.send(user);
});

handler.put(async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await prisma.user.findUnique({
    where: {
      id: +req.query.id,
    },
  });
  if (user) {
    const updatedUser = await prisma.user
      .update({
        where: {
          id: user.id,
        },
        data: req.body,
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        prisma.$disconnect();
      });
    res.send({ message: "User Updated Successfully" });
  } else {
    res.status(404).send({ message: "User Not Found" });
  }
});

handler.delete(async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await prisma.user.findUnique({
    where: {
      id: +req.query.id,
    },
  });
  if (user) {
    await prisma.user
      .delete({
        where: {
          id: +req.query.id,
        },
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        prisma.$disconnect();
      });
    res.send({ message: "User Deleted" });
  } else {
    res.status(404).send({ message: "User Not Found" });
  }
});

export default handler;
