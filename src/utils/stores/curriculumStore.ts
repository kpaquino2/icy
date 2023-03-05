import type { Course, Connection, Prisma } from "@prisma/client";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type CurricWithSemsAndCourses = Prisma.CurriculumGetPayload<{
  include: { courses: true; connections: true };
}>;

interface CurriculumState {
  userId: string;
  curriculum: CurricWithSemsAndCourses | null;
  setUserId: (userId: string) => void;
  setCurriculum: (currric: CurricWithSemsAndCourses | null) => void;
  createSemester: () => void;
  deleteSemester: () => void;
  createCourse: (course: Course) => void;
  updateCourse: (course: Course) => void;
  deleteCourse: (courseId: string) => void;
  moveCourse: (courseId: string, tsem: number, tpos: number) => void;
  createConnection: (conn: Connection) => void;
}

export const useCurriculumStore = create<CurriculumState>()(
  persist(
    (set) => ({
      userId: "",
      curriculum: null,
      setUserId: (userId) => set({ userId: userId }),
      setCurriculum: (curric) =>
        set({
          curriculum: curric,
        }),
      createSemester: () =>
        set((state) => {
          if (!state.curriculum) return state;
          return {
            curriculum: {
              ...state.curriculum,
              sems: state.curriculum.sems + 1,
              updatedAt: new Date(),
            },
          };
        }),
      deleteSemester: () =>
        set((state) => {
          if (!state.curriculum) return state;
          return {
            curriculum: {
              ...state.curriculum,
              sems: state.curriculum.sems - 1,
              courses: state.curriculum.courses.filter(
                (c) => c.sem !== (state.curriculum?.sems || 0) - 1
              ),
              updatedAt: new Date(),
            },
          };
        }),
      createCourse: (course) =>
        set((state) => {
          if (!state.curriculum) return state;
          return {
            curriculum: {
              ...state.curriculum,
              courses: [...state.curriculum.courses, course],
              updatedAt: new Date(),
            },
          };
        }),
      updateCourse: (course) =>
        set((state) => {
          if (!state.curriculum) return state;
          return {
            curriculum: {
              ...state.curriculum,
              courses: state.curriculum.courses.map((c) =>
                c.id === course.id ? course : c
              ),
              updatedAt: new Date(),
            },
          };
        }),
      deleteCourse: (courseId) =>
        set((state) => {
          if (!state.curriculum) return state;
          return {
            curriculum: {
              ...state.curriculum,
              courses: state.curriculum.courses.filter(
                (c) => c.id !== courseId
              ),
              updatedAt: new Date(),
            },
          };
        }),
      moveCourse: (courseId, tsem, tpos) =>
        set((state) => {
          if (!state.curriculum) return state;
          return {
            curriculum: {
              ...state.curriculum,
              courses: state.curriculum.courses.map((c) =>
                c.id === courseId ? { ...c, sem: tsem, position: tpos } : c
              ),
              updatedAt: new Date(),
            },
          };
        }),
      createConnection: (conn) =>
        set((state) => {
          if (!state.curriculum) return state;
          return {
            curriculum: {
              ...state.curriculum,
              connections: [...state.curriculum.connections, conn],
            },
          };
        }),
    }),
    { name: "curric-storage", storage: createJSONStorage(() => localStorage) }
  )
);
