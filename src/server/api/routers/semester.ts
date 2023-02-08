import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const semesterRouter = createTRPCRouter({
  createSemester: protectedProcedure
    .input(
      z.object({
        curricId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const sem = await ctx.prisma.semester.create({
        data: {
          curriculumId: input.curricId,
          semUnits: 0,
        },
      });
    }),
});
