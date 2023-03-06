import { type Course } from "@prisma/client";
import { type MouseEventHandler } from "react";

interface CourseProps {
  course: Course;
  open: MouseEventHandler;
}

const CourseItem = ({ course, open }: CourseProps) => {
  return (
    <div
      onClick={open}
      className="flex h-3/4 w-36 items-center rounded bg-teal-600 p-2 text-zinc-100 hover:brightness-110 dark:bg-teal-400 dark:text-zinc-900"
    >
      {course.code}
    </div>
  );
};

export default CourseItem;
