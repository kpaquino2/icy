import { createTRPCRouter, publicProcedure } from "../trpc";

export const curriculumRouter = createTRPCRouter({
  getCurriculum: publicProcedure.query(async ({ ctx }) => {
    const curric = await ctx.prisma.curriculum.findUnique({
      where: { userId: ctx.session?.user.id || "" },
      include: {
        sems: {
          orderBy: {
            createdAt: "asc",
          },
          include: {
            courses: {
              orderBy: {
                createdAt: "asc",
              },
            },
          },
        },
      },
    });

    return curric;
  }),
  createCurriculum: publicProcedure.mutation(async ({ ctx }) => {
    if (ctx.session) {
      await ctx.prisma.curriculum.create({
        data: { userId: ctx.session?.user.id, curricUnits: 0 },
      });
      return;
    }
  }),
});
