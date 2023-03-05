import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const templateCurriculumRouter = createTRPCRouter({
  getTemplates: publicProcedure.query(async ({ ctx }) => {
    const templates = await ctx.prisma.template.findMany({
      select: {
        program: true,
        code: true,
      },
      orderBy: {
        program: "asc",
      },
    });
    return templates.reduce(
      (group: { program: string; currics: string[] }[], template) => {
        const index = group.findIndex((v) => v.program === template.program);
        if (group[index]) {
          group[index]?.currics.push(template.code);
          return group;
        }
        group.push({
          program: template.program,
          currics: [template.code],
        });
        return group;
      },
      []
    );
  }),
  getTemplateByCode: publicProcedure
    .input(
      z.object({
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
              courses: true,
            },
          },
        },
      });
      return template;
    }),
});
