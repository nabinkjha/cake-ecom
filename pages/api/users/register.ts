import nc from "next-connect";
import bcrypt from "bcryptjs";
import { signToken } from "../../../utils/auth";
import { PrismaClient } from "@prisma/client";
import onError from "@/utils/error";
import { User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
const prisma = new PrismaClient();
const handler = nc({ onError });

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  const newUser = {
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password),
    isAdmin: false,
  } as User;
  const user = await prisma.user
    .create({
      data: newUser,
    })
    .catch((e) => {
      console.log(e);
    })
    .finally(() => {
      prisma.$disconnect();
    });
  const token = signToken(newUser);
  res.send({
    token,
    id: user.id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
});

export default handler;
