import { PrismaClient } from "@prisma/client";
import templates from "./templates/templates";

const prisma = new PrismaClient();

const main = async () => {
  const input = templates;
  await prisma.templates.createMany({
    data: input,
  });
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
