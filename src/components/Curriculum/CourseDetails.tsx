import { Transition } from "@headlessui/react";
import { type Course } from "@prisma/client";
import { PencilSimpleLine, TrashSimple, X } from "phosphor-react";
import { useState, type MouseEventHandler } from "react";
import { api } from "../../utils/api";
import { useCurriculumStore } from "../../utils/stores/curriculumStore";
import EditCourseModal from "./EditCourseModal";

interface CourseDetailsProps {
  course: Course;
  x: number;
  y: number;
  close: MouseEventHandler;
}

const CourseDetails = ({ course, x, y, close }: CourseDetailsProps) => {
  const deleteCourse = useCurriculumStore((state) => state.deleteCourse);

  let refetchTimeout: NodeJS.Timeout;
  const tctx = api.useContext();
  const { mutate: deleteCourseMutation } = api.course.deleteCourse.useMutation({
    onMutate: async (input) => {
      deleteCourse(input.id);
      await tctx.curriculum.getCurriculum.cancel();
      const prev = tctx.curriculum.getCurriculum.getData();
      return { prev };
    },
    onError: (err, input, ctx) => {
      if (err.data?.code === "UNAUTHORIZED") return;
      tctx.curriculum.getCurriculum.setData(undefined, ctx?.prev);
    },
    onSettled: () => {
      // Cancel previous timeout, if any
      clearTimeout(refetchTimeout);

      // Set a new timeout to refetch after 500ms
      refetchTimeout = setTimeout(() => {
        async () => {
          await tctx.curriculum.getCurriculum.refetch();
        };
      }, 500); // adjust the delay time as needed
    },
  });

  const [editCourseOpen, setEditCourseOpen] = useState(false);

  return (
    <>
      <EditCourseModal
        editCourseOpen={editCourseOpen}
        setEditCourseOpen={setEditCourseOpen}
        course={course}
      />
      <Transition
        enter="transition duration-300 ease-out"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        show={!!course}
        appear={true}
      >
        <div
          className="absolute flex h-[186px] w-64 scale-0 flex-col rounded border-2 border-zinc-200 bg-zinc-100 p-3 transition-all dark:border-zinc-800 dark:bg-zinc-900"
          style={{
            transform: `translate(${x}px, ${y}px)`,
          }}
        >
          <div className="flex justify-end gap-3 ">
            <button
              onClick={() => setEditCourseOpen(true)}
              className="rounded text-zinc-400 hover:text-teal-600 hover:dark:text-teal-400"
            >
              <PencilSimpleLine size={16} weight="bold" />
            </button>
            <button
              onClick={(e) => {
                deleteCourseMutation({ id: course.id });
                close(e);
              }}
              className="rounded text-zinc-400 hover:text-teal-600 hover:dark:text-teal-400"
            >
              <TrashSimple size={16} weight="bold" />
            </button>
            <button
              onClick={close}
              className="rounded text-zinc-400 hover:text-teal-600 hover:dark:text-teal-400"
            >
              <X size={16} weight="bold" />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-xl leading-none">{course.code}</div>
            <div>
              {course.units} unit
              {course.units !== 1 && "s"}
            </div>
          </div>
          <div className="text-sm leading-none text-zinc-600 dark:text-zinc-400">
            {course.title || <p className="italic">no course title</p>}
          </div>
          <div className="mt-1 overflow-auto leading-tight">
            {course.description || (
              <p className="italic">no course description</p>
            )}
          </div>
        </div>
      </Transition>
    </>
  );
};

export default CourseDetails;
