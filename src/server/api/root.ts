import { connectionRouter } from "./routers/connection";
import { courseRouter } from "./routers/course";
import { curriculumRouter } from "./routers/curriculum";
import { createTRPCRouter } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  curriculum: curriculumRouter,
  course: courseRouter,
  connection: connectionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
