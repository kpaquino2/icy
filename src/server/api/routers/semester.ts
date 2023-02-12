import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const semesterRouter = createTRPCRouter({
  createSemester: publicProcedure
    .input(
      z.object({
        curricId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        await ctx.prisma.semester.create({
          data: {
            curriculumId: input.curricId,
            semUnits: 0,
          },
        });
      }
    }),
});
