import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const courseRouter = createTRPCRouter({
  createCourse: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        code: z.string(),
        title: z.string().nullable(),
        description: z.string().nullable(),
        units: z.number(),
        position: z.number(),
        sem: z.number(),
        curriculumId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.course.create({
        data: input,
      });
    }),
  updateCourse: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        code: z.string(),
        title: z.string().nullable(),
        description: z.string().nullable(),
        units: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.course.update({
        where: {
          id: input.id,
        },
        data: {
          code: input.code,
          title: input.title,
          description: input.description,
          units: input.units,
        },
      });
    }),
  deleteCourse: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.course.delete({
        where: {
          id: input.id,
        },
      });
    }),
  moveCourse: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        sem: z.number(),
        position: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.course.update({
        where: {
          id: input.id,
        },
        data: {
          sem: input.sem,
          position: input.position,
        },
      });
    }),
});
