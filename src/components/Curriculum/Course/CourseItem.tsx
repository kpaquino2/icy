import { type Course } from "@prisma/client";
import type { FocusEventHandler, MouseEventHandler } from "react";

interface CourseProps {
  course: Course;
  open: MouseEventHandler;
  focus: FocusEventHandler;
  blur: FocusEventHandler;
}

const CourseItem = ({ course, open, focus, blur }: CourseProps) => {
  return (
    <button
      onFocus={focus}
      onBlur={blur}
      onClick={open}
      className="flex h-3/4 w-36 items-center rounded bg-teal-600 p-2 text-zinc-100 hover:brightness-110 dark:bg-teal-400 dark:text-zinc-900"
    >
      {course.code}
    </button>
  );
};

export default CourseItem;
