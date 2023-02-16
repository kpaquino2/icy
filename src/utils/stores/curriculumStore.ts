import type { Course, Prisma } from "@prisma/client";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type SemWithCourses = Prisma.SemesterGetPayload<{ include: { courses: true } }>;

type CurricWithSemsAndCourses = Prisma.CurriculumGetPayload<{
  include: { sems: { include: { courses: true } } };
}>;

interface CurriculumState {
  curriculum: CurricWithSemsAndCourses | null;
  createCurriculum: (currric: CurricWithSemsAndCourses) => void;
  deleteCurriculum: () => void;
  createSemester: (sem: SemWithCourses) => void;
  deleteSemester: (semId: string) => void;
  createCourse: (course: Course) => void;
  updateCourse: (course: Course) => void;
  deleteCourse: (courseId: string) => void;
}

export const useCurriculumStore = create<CurriculumState>()(
  persist(
    (set) => ({
      curriculum: null,
      createCurriculum: (curric) => set({ curriculum: curric }),
      deleteCurriculum: () => set({ curriculum: null }),
      createSemester: (sem) =>
        set((state) => {
          if (!state.curriculum) return state;
          return {
            curriculum: {
              ...state.curriculum,
              sems: [...state.curriculum.sems, sem],
            },
          };
        }),
      deleteSemester: (semId) =>
        set((state) => {
          if (!state.curriculum) return state;
          return {
            curriculum: {
              ...state.curriculum,
              sems: state.curriculum.sems.filter((s) => s.id !== semId),
            },
          };
        }),
      createCourse: (course) =>
        set((state) => {
          if (!state.curriculum) return state;
          return {
            curriculum: {
              ...state.curriculum,
              sems: state.curriculum.sems.map((s) =>
                s.id === course.semesterId
                  ? { ...s, courses: [...s.courses, course] }
                  : s
              ),
            },
          };
        }),
      updateCourse: (course) =>
        set((state) => {
          if (!state.curriculum) return state;
          return {
            curriculum: {
              ...state.curriculum,
              sems: state.curriculum.sems.map((s) =>
                s.id === course.semesterId
                  ? {
                      ...s,
                      courses: s.courses.map((c) =>
                        c.id === course.id
                          ? {
                              ...c,
                              code: course.code,
                              title: course.title,
                              description: course.description,
                              courseUnits: course.courseUnits,
                            }
                          : c
                      ),
                    }
                  : s
              ),
            },
          };
        }),
      deleteCourse: (courseId) =>
        set((state) => {
          if (!state.curriculum) return state;
          return {
            curriculum: {
              ...state.curriculum,
              sems: state.curriculum.sems.map((s) => ({
                ...s,
                courses: s.courses.filter((c) => c.id !== courseId),
              })),
            },
          };
        }),
    }),
    { name: "curric-storage", storage: createJSONStorage(() => localStorage) }
  )
);
