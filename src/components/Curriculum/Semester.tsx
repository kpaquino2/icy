import { Popover } from "@headlessui/react";
import { type Prisma } from "@prisma/client";
import { Plus, X } from "phosphor-react";
import { useState } from "react";
import { useCurriculumStore } from "../../utils/stores/curriculumStore";
import AddCourseModal from "./AddCourseModal";
import Course from "./Course";

interface SemesterProps {
  sem: Prisma.SemesterGetPayload<{ include: { courses: true } }>;
}

const Semester = ({ sem }: SemesterProps) => {
  const deleteSemester = useCurriculumStore((state) => state.deleteSemester);

  const [newCourseOpen, setNewCourseOpen] = useState(false);

  const handleDelete = () => {
    deleteSemester(sem.id);
  };

  return (
    <>
      <AddCourseModal
        semesterId={sem.id}
        lastPosition={sem.courses[sem.courses.length - 1]?.position || "aaa"}
        newCourseOpen={newCourseOpen}
        setNewCourseOpen={setNewCourseOpen}
        title="add a course"
      />
      <div className="group/sem peer flex h-full w-48 flex-col justify-between border-y-2 border-l-2 border-zinc-200 first:rounded-l-lg last-of-type:rounded-r-lg last-of-type:border-r-2 dark:border-zinc-800">
        <div className="flex items-center justify-between border-b-2 border-zinc-200 p-2 dark:border-zinc-800">
          {sem.sem > 2 ? "midyear" : `year ${sem.year} sem ${sem.sem}`}
          <div className="flex gap-1">
            <button
              type="button"
              className="text-zinc-400 hover:text-teal-600 hover:dark:text-teal-400"
              onClick={() => setNewCourseOpen(true)}
            >
              <Plus weight="bold" />
            </button>
            <button
              type="button"
              className="hidden text-zinc-400 hover:text-teal-600 group-last-of-type/sem:block hover:dark:text-teal-400"
              onClick={handleDelete}
            >
              <X weight="bold" />
            </button>
          </div>
        </div>
        <Popover.Group className="flex h-full w-full flex-col items-center overflow-y-auto overflow-x-hidden p-2">
          {sem.courses?.map((course, index) => (
            <Course key={index} course={course} />
          ))}
          <button
            type="button"
            onClick={() => setNewCourseOpen(true)}
            className="my-auto hidden items-center justify-center gap-2 rounded border-2 border-dashed border-zinc-200 p-2 text-zinc-500 only:flex hover:border-teal-600 hover:text-teal-600 dark:border-zinc-800 hover:dark:border-teal-400 hover:dark:text-teal-400"
          >
            <Plus weight="bold" />
            new course
          </button>
        </Popover.Group>
        <div className="w-full border-t-2 border-zinc-200 py-2 text-center text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
          total units:{" "}
          {sem.courses?.map((c) => c.units).reduce((a, b) => a + b, 0)}
        </div>
      </div>
    </>
  );
};

export default Semester;
