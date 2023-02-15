import { Popover, Transition } from "@headlessui/react";
import { Course } from "@prisma/client";
import { PencilSimpleLine, TrashSimple } from "phosphor-react";
import { api } from "../../utils/api";

interface CourseProps {
  course: Course;
}

const Course = ({ course }: CourseProps) => {
  const tctx = api.useContext();
  const { mutate: deleteCourseMutation } = api.course.deleteCourse.useMutation({
    onMutate: async (input) => {
      await tctx.curriculum.getCurriculum.cancel();
      const prev = tctx.curriculum.getCurriculum.getData();
      tctx.curriculum.getCurriculum.setData(undefined, (old) => {
        if (!old) return;
        const newsems = old.sems.map((s) =>
          s.id === course.semesterId
            ? {
                ...s,
                courses: s.courses.filter((c) => c.id !== input.id),
              }
            : s
        );
        return {
          ...old,
          sems: newsems,
        };
      });
      return { prev };
    },
    onError: (err, input, ctx) => {
      tctx.curriculum.getCurriculum.setData(undefined, ctx?.prev);
    },
    onSettled: async () => {
      await tctx.curriculum.getCurriculum.refetch();
    },
  });

  const handleDelete = () => {
    deleteCourseMutation({ id: course.id });
  };

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
        <Popover.Panel className="absolute z-10 ml-1 w-64 -translate-y-10 translate-x-44 overflow-auto rounded border-2 border-zinc-200 bg-zinc-100 p-3 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex justify-end gap-3">
            <button className="rounded text-zinc-400 hover:text-teal-600 hover:dark:text-teal-400">
              <PencilSimpleLine size={16} weight="bold" />
            </button>
            <button
              onClick={handleDelete}
              className="rounded text-zinc-400 hover:text-teal-600 hover:dark:text-teal-400"
            >
              <TrashSimple size={16} weight="bold" />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-xl leading-none">{course.code}</div>
            <div>
              {course.courseUnits} unit{course.courseUnits !== 1 && "s"}
            </div>
          </div>

          <div className="text-sm leading-none text-zinc-600 dark:text-zinc-400">
            {course.title}
          </div>
          <div className="mt-1 leading-tight">{course.description}</div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
};

export default Course;
