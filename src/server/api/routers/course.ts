import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const courseRouter = createTRPCRouter({
  createCourses: protectedProcedure
    .input(
      z
        .object({
          id: z.string(),
          code: z.string(),
          title: z.string().nullable(),
          description: z.string().nullable(),
          units: z.number(),
          position: z.string(),
          semesterId: z.string(),
        })
        .array()
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.course.createMany({
        data: input,
      });
    }),
  updateCourses: protectedProcedure
    .input(
      z
        .object({
          id: z.string(),
          code: z.string(),
          title: z.string().nullable(),
          description: z.string().nullable(),
          units: z.number(),
        })
        .array()
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.$transaction(
        input.map((c) =>
          ctx.prisma.course.update({
            where: {
              id: c.id,
            },
            data: {
              code: c.code,
              title: c.title,
              description: c.description,
              units: c.units,
            },
          })
        )
      );
    }),
  deleteCourses: protectedProcedure
    .input(
      z.object({
        ids: z.string().array(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.course.deleteMany({
        where: {
          id: {
            in: input.ids,
          },
        },
      });
    }),
});
