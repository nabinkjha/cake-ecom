import nc from "next-connect";
import bcrypt from "bcryptjs";
import { signToken, isAuth } from "../../../utils/auth";
import { PrismaClient } from "@prisma/client";
import onError from "@/utils/error";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();
const handler = nc({ onError });
handler.use(isAuth);
handler.put(async (req: NextApiRequest, res: NextApiResponse) => {
  console.log("Updating the profile ");
  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email
    },
  });
  user.name = req.body.name;
  user.password = req.body.password
    ? bcrypt.hashSync(req.body.password)
    : user.password;
  await prisma.user
    .update({ data: user })
    .catch((e) => {
      console.log(e);
    })
    .finally(() => {
      prisma.$disconnect();
    });

  const token = signToken(user);
  res.send({
    token,
    id: user.id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
});

export default handler;
