import nc from "next-connect";
import { PrismaClient } from "@prisma/client";
import { isAdmin, isAuth } from "@/utils/auth";
const prisma = new PrismaClient();

const handler = nc();
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  console.log(`/api/admin/users/ is called to fetch all users`);
  const users = await prisma.user
    .findMany({})
    .catch((e) => {
      console.log(e);
    })
    .finally(() => {
      prisma.$disconnect();
    });
  res.send(users);
});

export default handler;
