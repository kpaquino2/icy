import { courseRouter } from "./routers/course";
import { curriculumRouter } from "./routers/curriculum";
import { semesterRouter } from "./routers/semester";
import { templateCurriculumRouter } from "./routers/template_curriculum";
import { createTRPCRouter } from "./trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  curriculum: curriculumRouter,
  semester: semesterRouter,
  course: courseRouter,
  template_curriculum: templateCurriculumRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
