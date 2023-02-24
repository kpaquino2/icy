import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const curriculumRouter = createTRPCRouter({
  getCurriculum: publicProcedure.query(async ({ ctx }) => {
    const curric = await ctx.prisma.curriculum.findUnique({
      where: { userId: ctx.session?.user.id || "" },
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
  }),
  createCurriculum: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.curriculum.create({
        data: { id: input.id, userId: ctx.session?.user.id },
      });
      return;
    }),
  createCurriculumFromTemplate: protectedProcedure
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

      if (!template) return null;
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
    }),

  deleteCurriculum: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.curriculum.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
