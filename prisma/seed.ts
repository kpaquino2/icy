import { PrismaClient } from "@prisma/client";
import templates from "./templates/templates";

const prisma = new PrismaClient();

const main = async () => {
  const input = templates;
  for (const template of input) {
    const { program, code, totalUnits, sems } = template;

    await prisma.template.create({
      data: {
        program,
        code,
        curriculum: {
          create: {
            curricUnits: totalUnits,
            sems: {
              create: sems.map((sem) => ({
                year: sem.year,
                sem: sem.sem,
                semUnits: sem.semUnits,
                courses: {
                  create: sem.courses.map((course) => ({
                    code: course.code,
                    title: course.title,
                    description: course.description,
                    courseUnits: course.courseUnits,
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
