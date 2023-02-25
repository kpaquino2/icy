import { Popover, Transition } from "@headlessui/react";
import { Draggable } from "@hello-pangea/dnd";
import { Course } from "@prisma/client";
import { PencilSimpleLine, TrashSimple } from "phosphor-react";
import { useState } from "react";
import { api } from "../../utils/api";
import { useCurriculumStore } from "../../utils/stores/curriculumStore";
import EditCourseModal from "./EditCourseModal";

interface CourseProps {
  course: Course;
  index: number;
}

const Course = ({ course, index }: CourseProps) => {
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

  const handleDelete = () => {
    deleteCourseMutation({ id: course.id, semesterId: course.semesterId });
  };

  return (
    <>
      <EditCourseModal
        editCourseOpen={editCourseOpen}
        setEditCourseOpen={setEditCourseOpen}
        course={course}
        title="edit course"
      />
      <Draggable draggableId={course.id} index={index}>
        {(provided) => (
          <Popover
            className="my-2 w-3/4"
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <Popover.Button
              as="div"
              // type="div"
              className="flex w-full justify-center rounded bg-teal-600 py-2 text-zinc-100 hover:brightness-125 dark:bg-teal-400 dark:text-zinc-900"
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
              <Popover.Panel className="absolute z-10 ml-2 w-64 -translate-y-10 translate-x-32 overflow-auto rounded border-2 border-zinc-200 bg-zinc-100 p-3 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setEditCourseOpen(true)}
                    className="rounded text-zinc-400 hover:text-teal-600 hover:dark:text-teal-400"
                  >
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
                    {course.units} unit{course.units !== 1 && "s"}
                  </div>
                </div>

                <div className="text-sm leading-none text-zinc-600 dark:text-zinc-400">
                  {course.title || <p className="italic">no course title</p>}
                </div>
                <div className="mt-1 leading-tight">
                  {course.description || (
                    <p className="italic">no course description</p>
                  )}
                </div>
              </Popover.Panel>
            </Transition>
          </Popover>
        )}
      </Draggable>
    </>
  );
};

export default Course;
