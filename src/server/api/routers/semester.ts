import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const semesterRouter = createTRPCRouter({
  createSemester: publicProcedure
    .input(
      z.object({
        id: z.string(),
        curricId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        await ctx.prisma.semester.create({
          data: {
            id: input.id,
            curriculumId: input.curricId,
            semUnits: 0,
          },
        });
      }
    }),
  deleteSemester: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        await ctx.prisma.semester.delete({
          where: {
            id: input.id,
          },
        });
      }
    }),
});
