import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const curriculumRouter = createTRPCRouter({
  getCurriculum: publicProcedure.query(async ({ ctx }) => {
    const curric = ctx.prisma.curriculum.findFirst({
      where: { userId: ctx.session?.user.id },
    });
    return curric;
  }),
});
