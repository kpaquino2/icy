import { z } from "zod";
import { useCurriculumStore } from "../../../utils/stores/curriculumStore";
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
      const createSemester = useCurriculumStore.getState().createSemester;
      createSemester({
        id: input.id,
        curriculumId: input.curricId,
        semUnits: 0,
        midyear: false,
        createdAt: new Date(),
        courses: [],
      });
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
      const deleteSemester = useCurriculumStore.getState().deleteSemester;
      deleteSemester(input.id);
    }),
});
