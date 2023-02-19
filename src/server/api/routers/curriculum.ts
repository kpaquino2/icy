import { z } from "zod";
import { useCurriculumStore } from "../../../utils/stores/curriculumStore";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const curriculumRouter = createTRPCRouter({
  getCurriculum: publicProcedure.query(async ({ ctx }) => {
    if (ctx.session) {
      const curric = await ctx.prisma.curriculum.findUnique({
        where: { userId: ctx.session.user.id },
        include: {
          sems: {
            orderBy: [
              {
                year: "asc",
              },
              { sem: "asc" },
            ],
            include: {
              courses: {
                orderBy: {
                  position: "asc",
                },
              },
            },
          },
        },
      });
      return curric;
    }
    const curric = useCurriculumStore.getState().curriculum;
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
          data: { id: input.id, userId: ctx.session?.user.id },
        });
        return;
      }
      const createCurriculum = useCurriculumStore.getState().createCurriculum;
      createCurriculum({
        id: input.id,
        userId: "anon",
        createdAt: new Date(),
        sems: [],
      });
    }),
  createCurriculumFromTemplate: publicProcedure
    .input(
      z.object({
        id: z.string(),
        code: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const template = await ctx.prisma.template.findUnique({
        where: {
          code: input.code,
        },
        include: {
          curriculum: {
            include: {
              sems: {
                include: {
                  courses: true,
                },
              },
            },
          },
        },
      });

      if (!template) return;

      if (ctx.session) {
        await ctx.prisma.curriculum.create({
          data: {
            id: input.id,
            userId: ctx.session.user.id,
            sems: {
              create: template.curriculum.sems.map((sem) => ({
                year: sem.year,
                sem: sem.sem,
                courses: {
                  create: sem.courses.map((course) => ({
                    code: course.code,
                    title: course.title,
                    description: course.description,
                    units: course.units,
                    position: course.position,
                  })),
                },
              })),
            },
          },
        });
        return;
      }
    }),

  deleteCurriculum: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.session) {
        await ctx.prisma.curriculum.delete({
          where: {
            id: input.id,
          },
        });
      }
      const deleteCurriculum = useCurriculumStore.getState().deleteCurriculum;
      deleteCurriculum();
    }),
});
