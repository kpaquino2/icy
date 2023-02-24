import type { Course, Prisma, Semester } from "@prisma/client";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getPosition } from "../position";

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
  moveCourse: (
    sourceCourseIndex: number,
    destinationCourseIndex: number,
    sourceSemIndex: number,
    destinationSemIndex: number
  ) => void;
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
      createCurriculum: (curric) =>
        set({
          curriculum: curric,
          saved: true,
          deleted: { courses: [], sems: [] },
          created: { courses: [], sems: [] },
          updated: { courses: [] },
        }),
      deleteCurriculum: () => set({ curriculum: null }),
      createSemester: (sem) =>
        set((state) => {
          if (!state.curriculum) return state;
          return {
            curriculum: {
              ...state.curriculum,
              sems: [...state.curriculum.sems, sem],
              updatedAt: new Date(),
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
              updatedAt: new Date(),
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
              updatedAt: new Date(),
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
              updatedAt: new Date(),
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
              updatedAt: new Date(),
            },
            deleted: {
              ...state.deleted,
              courses: [...state.deleted.courses, courseId],
            },
            saved: false,
          };
        }),
      moveCourse: (
        sourceCourseIndex,
        destinationCourseIndex,
        sourceSemIndex,
        destinationSemIndex
      ) =>
        set((state) => {
          if (!state.curriculum) return state;
          const sourceSem = state.curriculum.sems[sourceSemIndex];
          const destinationSem = state.curriculum.sems[destinationSemIndex];
          if (!sourceSem || !destinationSem) return state;
          const sourceCourse = sourceSem.courses[sourceCourseIndex];
          if (!sourceCourse) return state;
          sourceSem.courses.splice(sourceCourseIndex, 1);
          const newCourse = {
            ...sourceCourse,
            position: getPosition(
              destinationSem.courses[destinationCourseIndex - 1]?.position ||
                "aaa",
              destinationSem.courses[destinationCourseIndex]?.position || "zzz"
            ),
            semesterId: destinationSem.id,
          };
          destinationSem.courses.push(newCourse);
          destinationSem.courses.sort((a, b) =>
            a.position < b.position ? -1 : 1
          );
          return {
            curriculum: {
              ...state.curriculum,
              updatedAt: new Date(),
            },
            deleted: {
              ...state.deleted,
              courses: [
                ...state.deleted.courses.filter((c) => c !== newCourse.id),
                newCourse.id,
              ],
            },
            created: {
              ...state.created,
              courses: [
                ...state.created.courses.filter((c) => c.id !== newCourse.id),
                newCourse,
              ],
            },
            saved: false,
          };
        }),
    }),
    { name: "curric-storage", storage: createJSONStorage(() => localStorage) }
  )
);
