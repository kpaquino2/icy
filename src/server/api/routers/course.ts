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
        position: z.string(),
        semesterId: z.string(),
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
        semesterId: z.string(),
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
        course: z.object({
          id: z.string(),
          code: z.string(),
          title: z.string().nullable(),
          description: z.string().nullable(),
          units: z.number(),
          position: z.string(),
          semesterId: z.string(),
          createdAt: z.date(),
        }),
        sourceIndex: z.number(),
        sourceSemIndex: z.number(),
        destinationSemIndex: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.course.update({
        where: {
          id: input.course.id,
        },
        data: {
          position: input.course.position,
          semesterId: {
            set: input.course.semesterId,
          },
        },
      });
    }),
});
