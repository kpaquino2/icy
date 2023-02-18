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
          data: { id: input.id, userId: ctx.session?.user.id, curricUnits: 0 },
        });
        return;
      }
      const createCurriculum = useCurriculumStore.getState().createCurriculum;
      createCurriculum({
        id: input.id,
        userId: "anon",
        curricUnits: 0,
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
            curricUnits: template.curriculum.curricUnits,
            sems: {
              create: template.curriculum.sems.map((sem) => ({
                midyear: sem.midyear,
                semUnits: sem.semUnits,
                courses: {
                  create: sem.courses.map((course) => ({
                    code: course.code,
                    title: course.title,
                    description: course.description,
                    courseUnits: course.courseUnits,
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
