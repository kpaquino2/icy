import type { Course, Prisma, Semester } from "@prisma/client";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type SemWithCourses = Prisma.SemesterGetPayload<{ include: { courses: true } }>;

type CurricWithSemsAndCourses = Prisma.CurriculumGetPayload<{
  include: { sems: { include: { courses: true } } };
}>;

interface CurriculumState {
  saved: boolean;
  userId: string;
  curriculum: CurricWithSemsAndCourses | null;
  deleted: { courses: string[]; sems: string[] };
  created: { courses: Course[]; sems: Semester[] };
  updated: { courses: Course[] };
  saveCurriculum: () => void;
  setUserId: (userId: string) => void;
  createCurriculum: (currric: CurricWithSemsAndCourses | null) => void;
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
      saved: false,
      userId: "",
      curriculum: null,
      deleted: { courses: [], sems: [] },
      created: { courses: [], sems: [] },
      updated: { courses: [] },
      saveCurriculum: () =>
        set({
          saved: true,
          deleted: { courses: [], sems: [] },
          created: { courses: [], sems: [] },
          updated: { courses: [] },
        }),
      setUserId: (userId) => set({ userId: userId }),
      createCurriculum: (curric) => set({ curriculum: curric, saved: true }),
      deleteCurriculum: () => set({ curriculum: null }),
      createSemester: (sem) =>
        set((state) => {
          if (!state.curriculum) return state;
          return {
            curriculum: {
              ...state.curriculum,
              sems: [...state.curriculum.sems, sem],
            },
            created: {
              ...state.created,
              sems: [...state.created.sems, sem],
            },
            saved: false,
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
            deleted: {
              ...state.deleted,
              sems: [...state.deleted.sems, semId],
            },
            saved: false,
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
            created: {
              ...state.created,
              courses: [...state.created.courses, course],
            },
            saved: false,
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
                              units: course.units,
                            }
                          : c
                      ),
                    }
                  : s
              ),
            },
            updated: {
              courses: [...state.updated.courses, course],
            },
            saved: false,
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
            deleted: {
              ...state.deleted,
              courses: [...state.deleted.courses, courseId],
            },
            saved: false,
          };
        }),
    }),
    { name: "curric-storage", storage: createJSONStorage(() => localStorage) }
  )
);
