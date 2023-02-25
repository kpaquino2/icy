import { Popover } from "@headlessui/react";
import { Droppable } from "@hello-pangea/dnd";
import { type Prisma } from "@prisma/client";
import { Plus, X } from "phosphor-react";
import { useState } from "react";
import { api } from "../../utils/api";
import { useCurriculumStore } from "../../utils/stores/curriculumStore";
import AddCourseModal from "./AddCourseModal";
import Course from "./Course";

interface SemesterProps {
  sem: Prisma.SemesterGetPayload<{ include: { courses: true } }>;
}

const Semester = ({ sem }: SemesterProps) => {
  const deleteSemester = useCurriculumStore((state) => state.deleteSemester);

  let refetchTimeout: NodeJS.Timeout;
  const tctx = api.useContext();
  const { mutate: deleteSemesterMutation } =
    api.semester.deleteSemester.useMutation({
      onMutate: async (input) => {
        deleteSemester(input.id);
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

  const [newCourseOpen, setNewCourseOpen] = useState(false);

  const handleDelete = () => {
    deleteSemesterMutation({ id: sem.id });
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
        <Droppable droppableId={sem.id}>
          {(provided) => (
            <Popover.Group
              className="flex h-full w-full flex-col items-center p-2"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {sem.courses?.map((course, index) => (
                <Course key={course.id} course={course} index={index} />
              ))}
              <button
                type="button"
                onClick={() => setNewCourseOpen(true)}
                className="mb-auto hidden items-center justify-center gap-2 rounded border-2 border-dashed border-zinc-200 p-2 text-zinc-500 only:flex hover:border-teal-600 hover:text-teal-600 dark:border-zinc-800 hover:dark:border-teal-400 hover:dark:text-teal-400"
              >
                <Plus weight="bold" />
                new course
              </button>
              {provided.placeholder}
            </Popover.Group>
          )}
        </Droppable>
        <div className="w-full border-t-2 border-zinc-200 py-2 text-center text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
          total units:{" "}
          {sem.courses?.map((c) => c.units).reduce((a, b) => a + b, 0)}
        </div>
      </div>
    </>
  );
};

export default Semester;
