import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const semesterRouter = createTRPCRouter({
  createSemester: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        year: z.number(),
        sem: z.number(),
        curriculumId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.semester.create({
        data: input,
      });
    }),
  deleteSemester: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.semester.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
