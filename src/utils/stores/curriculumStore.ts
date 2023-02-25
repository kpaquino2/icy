import type { Course, Prisma } from "@prisma/client";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type SemWithCourses = Prisma.SemesterGetPayload<{ include: { courses: true } }>;

type CurricWithSemsAndCourses = Prisma.CurriculumGetPayload<{
  include: { sems: { include: { courses: true } } };
}>;

interface CurriculumState {
  userId: string;
  curriculum: CurricWithSemsAndCourses | null;
  setUserId: (userId: string) => void;
  setCurriculum: (currric: CurricWithSemsAndCourses | null) => void;
  createSemester: (sem: SemWithCourses) => void;
  deleteSemester: (semId: string) => void;
  createCourse: (course: Course) => void;
  updateCourse: (course: Course) => void;
  deleteCourse: (courseId: string) => void;
  moveCourse: (
    course: Course,
    sourceCourseIndex: number,
    sourceSemIndex: number,
    destinationSemIndex: number
  ) => void;
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
      createSemester: (sem) =>
        set((state) => {
          if (!state.curriculum) return state;
          return {
            curriculum: {
              ...state.curriculum,
              sems: [...state.curriculum.sems, sem],
              updatedAt: new Date(),
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
              sems: state.curriculum.sems.map((s) =>
                s.id === course.semesterId
                  ? { ...s, courses: [...s.courses, course] }
                  : s
              ),
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
              sems: state.curriculum.sems.map((s) => ({
                ...s,
                courses: s.courses.filter((c) => c.id !== courseId),
              })),
              updatedAt: new Date(),
            },
          };
        }),
      moveCourse: (
        course,
        sourceCourseIndex,
        sourceSemIndex,
        destinationSemIndex
      ) =>
        set((state) => {
          if (!state.curriculum) return state;
          const sourceSem = state.curriculum.sems[sourceSemIndex];
          const destinationSem = state.curriculum.sems[destinationSemIndex];
          if (!sourceSem || !destinationSem) return state;
          // sourceSem.courses.splice(sourceCourseIndex, 1);
          destinationSem.courses.push(course);
          destinationSem.courses.sort((a, b) =>
            a.position < b.position ? -1 : 1
          );
          return {
            curriculum: {
              ...state.curriculum,
              updatedAt: new Date(),
            },
          };
        }),
    }),
    { name: "curric-storage", storage: createJSONStorage(() => localStorage) }
  )
);
