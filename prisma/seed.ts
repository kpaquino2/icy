import { PrismaClient } from "@prisma/client";
import templates from "./templates/templates";

const prisma = new PrismaClient();

const main = async () => {
  const input = templates;
  for (const template of input) {
    const { program, code, sems } = template;

    await prisma.template.create({
      data: {
        program,
        code,
        curriculum: {
          create: {
            sems: {
              create: sems.map((sem) => ({
                year: sem.year,
                sem: sem.sem,
                courses: {
                  create: sem.courses.map((course) => ({
                    code: course.code,
                    title: course.title,
                    description: course.description,
                    units: course.courseUnits,
                  })),
                },
              })),
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
