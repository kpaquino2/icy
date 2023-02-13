import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const curriculumRouter = createTRPCRouter({
  getCurriculum: publicProcedure.query(async ({ ctx }) => {
    const curric = await ctx.prisma.curriculum.findUnique({
      where: { userId: ctx.session?.user.id || "" },
      include: {
        sems: {
          orderBy: {
            createdAt: "asc",
          },
          include: {
            courses: {
              orderBy: {
                createdAt: "asc",
              },
            },
          },
        },
      },
    });

    return curric;
  }),
  createCurriculum: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        await ctx.prisma.curriculum.create({
          data: { id: input.id, userId: ctx.session?.user.id, curricUnits: 0 },
        });
        return;
      }
    }),
});
