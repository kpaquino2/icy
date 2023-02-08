import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const curriculumRouter = createTRPCRouter({
  getCurriculum: publicProcedure.query(async ({ ctx }) => {
    const curric = ctx.prisma.curriculum.findFirst({
      where: { userId: ctx.session?.user.id },
    });
    return curric;
  }),
  createCurriculum: protectedProcedure.mutation(async ({ ctx }) => {
    const curric = await ctx.prisma.curriculum.create({
      data: { userId: ctx.session?.user.id, curricUnits: 0 },
    });
    return curric;
  }),
});
