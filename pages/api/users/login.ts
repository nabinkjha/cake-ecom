import nc from "next-connect";
import bcrypt from "bcryptjs";
import { signToken } from "../../../utils/auth";
import { PrismaClient, User } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();
const handler = nc();

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });
  const userInfo = { ...user } as User;

  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    const token = signToken(userInfo);
    res.send({
      token,
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401).send({ message: "Invalid email or password" });
  }
});

export default handler;
