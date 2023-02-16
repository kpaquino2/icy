import { z } from "zod";
import { useCurriculumStore } from "../../../utils/stores/curriculumStore";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const curriculumRouter = createTRPCRouter({
  getCurriculum: publicProcedure.query(async ({ ctx }) => {
    if (ctx.session) {
      const curric = await ctx.prisma.curriculum.findUnique({
        where: { userId: ctx.session.user.id },
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
    }
    const curric = useCurriculumStore.getState().curriculum;
    return curric;
  }),
  createCurriculum: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        await ctx.prisma.curriculum.create({
          data: { id: input.id, userId: ctx.session?.user.id, curricUnits: 0 },
        });
        return;
      }
      const createCurriculum = useCurriculumStore.getState().createCurriculum;
      createCurriculum({
        id: input.id,
        userId: "anon",
        curricUnits: 0,
        createdAt: new Date(),
        sems: [],
      });
    }),
  deleteCurriculum: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        await ctx.prisma.curriculum.delete({
          where: {
            id: input.id,
          },
        });
      }
      const deleteCurriculum = useCurriculumStore.getState().deleteCurriculum;
      deleteCurriculum();
    }),
});
