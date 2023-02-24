import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const semesterRouter = createTRPCRouter({
  createSemesters: protectedProcedure
    .input(
      z
        .object({
          id: z.string(),
          year: z.number(),
          sem: z.number(),
          curriculumId: z.string(),
        })
        .array()
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.semester.createMany({
        data: input,
      });
    }),
  deleteSemesters: protectedProcedure
    .input(
      z.object({
        ids: z.string().array(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.semester.deleteMany({
        where: {
          id: {
            in: input.ids,
          },
        },
      });
    }),
});
