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
                hidden: sem.hidden,
                number: sem.number,
                courses: {
                  create: sem.courses.map((course, i) => ({
                    code: course.code,
                    title: course.title,
                    description: course.description,
                    units: course.courseUnits,
                    position: String.fromCharCode(i + 98).repeat(3),
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
