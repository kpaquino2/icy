import { z } from "zod";
import { useCurriculumStore } from "../../../utils/stores/curriculumStore";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const courseRouter = createTRPCRouter({
  createCourse: publicProcedure
    .input(
      z.object({
        id: z.string(),
        code: z.string(),
        title: z.string(),
        description: z.string(),
        courseUnits: z.number(),
        semesterId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        await ctx.prisma.course.create({
          data: {
            id: input.id,
            code: input.code,
            title: input.title,
            description: input.description,
            courseUnits: input.courseUnits,
            semesterId: input.semesterId,
          },
        });
      }
      const createCourse = useCurriculumStore.getState().createCourse;
      createCourse({ ...input, createdAt: new Date() });
    }),
  updateCourse: publicProcedure
    .input(
      z.object({
        id: z.string(),
        code: z.string(),
        title: z.string(),
        description: z.string(),
        courseUnits: z.number(),
        semesterId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        await ctx.prisma.course.update({
          where: { id: input.id },
          data: {
            code: input.code,
            title: input.title,
            description: input.description,
            courseUnits: input.courseUnits,
          },
        });
      }
      const updateCourse = useCurriculumStore.getState().updateCourse;
      updateCourse({ ...input, createdAt: new Date() });
    }),
  deleteCourse: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        await ctx.prisma.course.delete({
          where: {
            id: input.id,
          },
        });
      }
      const deleteCourse = useCurriculumStore.getState().deleteCourse;
      deleteCourse(input.id);
    }),
});
