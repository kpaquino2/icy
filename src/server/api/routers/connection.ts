import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const connectionRouter = createTRPCRouter({
  createConnection: protectedProcedure
    .input(
      z.object({
        prereqId: z.string(),
        postreqId: z.string(),
        curriculumId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.connection.create({
        data: input,
      });
    }),
  deleteConnection: protectedProcedure
    .input(
      z.object({
        prereqId: z.string(),
        postreqId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.connection.delete({
        where: {
          postreqId_prereqId: input,
        },
      });
    }),
});
