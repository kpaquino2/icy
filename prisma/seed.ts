import { PrismaClient } from "@prisma/client";
import templates from "./templates/templates";

const prisma = new PrismaClient();

const main = async () => {
  const input = templates;
  for (const template of input) {
    const { program, code, sems, courses } = template;
    await prisma.template.create({
      data: {
        program,
        code,
        curriculum: {
          create: {
            sems: sems,
            courses: {
              create: courses,
            },
          },
        },
      },
    });
  }
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
