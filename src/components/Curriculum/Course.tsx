import { Popover, Transition } from "@headlessui/react";
import { Course } from "@prisma/client";

interface CourseProps {
  course: Course;
}

const Course = ({ course }: CourseProps) => {
  return (
    <Popover>
      <Popover.Button
        type="button"
        className="w-full rounded bg-teal-600 py-2 text-zinc-100 hover:brightness-125 dark:bg-teal-400 dark:text-zinc-900"
      >
        {course.code}
      </Popover.Button>
      <Transition
        enter="transition duration-100 ease-out"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <Popover.Panel className="absolute z-10 ml-1 max-h-48 w-48 -translate-y-10 translate-x-44 overflow-auto rounded border-2 border-zinc-200 bg-zinc-100 p-2 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="grid grid-cols-3">
            <div className="col-span-2">{course.code}</div>
            <div>{course.courseUnits} units</div>
            <div className="col-span-3">{course.title}</div>
            <div className="col-span-3">{course.description}</div>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

export default Course;
