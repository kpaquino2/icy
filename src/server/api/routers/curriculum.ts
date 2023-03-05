import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const curriculumRouter = createTRPCRouter({
  getCurriculum: publicProcedure.query(async ({ ctx }) => {
    const curric = await ctx.prisma.curriculum.findUnique({
      where: { userId: ctx.session?.user.id || "" },
      include: {
        courses: true,
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
        data: { id: input.id, userId: ctx.session?.user.id, sems: 2 },
      });
      return;
    }),
  createCurriculumFromTemplate: protectedProcedure
    .input(
      z.object({
        curriculum: z.object({
          id: z.string(),
          sems: z.number(),
          courses: z
            .object({
              code: z.string(),
              title: z.string().nullable(),
              description: z.string().nullable(),
              units: z.number(),
              position: z.number(),
              sem: z.number(),
            })
            .array(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.curriculum.create({
        data: {
          id: input.curriculum.id,
          userId: ctx.session.user.id,
          sems: input.curriculum.sems,
          courses: {
            create: input.curriculum.courses,
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
  createSemester: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.curriculum.update({
        where: {
          id: input.id,
        },
        data: {
          sems: {
            increment: 1,
          },
        },
      });
    }),
  deleteSemester: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const c = await ctx.prisma.curriculum.update({
        where: {
          id: input.id,
        },
        data: {
          sems: {
            decrement: 1,
          },
        },
      });
      await ctx.prisma.course.deleteMany({
        where: {
          sem: c.sems,
          curriculumId: c.id,
        },
      });
    }),
});
