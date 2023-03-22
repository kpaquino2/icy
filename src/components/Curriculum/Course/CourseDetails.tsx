import { Transition } from "@headlessui/react";
import { PencilSimpleLine, TrashSimple, X } from "phosphor-react";
import { useRef, useState, type MouseEventHandler } from "react";
import { api } from "../../../utils/api";
import { useConstantsStore } from "../../../utils/stores/constantsStore";
import { useCurriculumStore } from "../../../utils/stores/curriculumStore";
import ConfirmActionModal from "../../UI/Modals/ConfirmActionModal";
import EditCourseModal from "./EditCourseModal";

interface CourseDetailsProps {
  courseDetails: { id: string; sem: number; pos: number; open: boolean };
  close: MouseEventHandler;
}

const CourseDetails = ({ courseDetails, close }: CourseDetailsProps) => {
  const deleteCourse = useCurriculumStore((state) => state.deleteCourse);
  const curriculum = useCurriculumStore((state) => state.curriculum);

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
  const [onConfirm, setOnConfirm] = useState<null | {
    title: string;
    message: string;
    action: () => void;
  }>(null);

  const zoom = useConstantsStore((state) => state.zoom);
  const rowHeight = 36 * zoom;
  const colWidth = 192 * zoom;
  const course = curriculum?.courses.find((c) => c.id === courseDetails.id);

  const handleDeleteCourse = () => {
    if (!course) return;
    deleteCourseMutation({ id: course.id });
  };
  const bgref = useRef<HTMLDivElement>(null);
  if (!course) return <></>;
  const width = Math.max(
    bgref.current?.getBoundingClientRect().width || 0,
    (curriculum?.sems || 0) * colWidth
  );
  const right =
    colWidth * (courseDetails.sem + 1) - colWidth * 0.0625 + colWidth * 1.5 <
      width || courseDetails.sem < 1.5;
  const bottom =
    rowHeight * (courseDetails.pos + 1) + rowHeight * 7 <
      (bgref.current?.getBoundingClientRect().height || 0) ||
    course.position < 4;

  const x = right
    ? colWidth * (courseDetails.sem + 1) - colWidth * 0.0625
    : colWidth * courseDetails.sem - colWidth * 1.5 + colWidth * 0.0625;
  const y = bottom
    ? rowHeight * (courseDetails.pos + 1)
    : rowHeight * (courseDetails.pos - 4);

  return (
    <div className="pointer-events-none absolute h-full w-full" ref={bgref}>
      {course && (
        <EditCourseModal
          editCourseOpen={editCourseOpen}
          setEditCourseOpen={setEditCourseOpen}
          course={course}
        />
      )}
      <ConfirmActionModal onConfirm={onConfirm} setOnConfirm={setOnConfirm} />
      <Transition
        enter="transition duration-300 ease-out"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        show={courseDetails.open}
        appear={true}
        className="pointer-events-auto absolute z-20 flex flex-col rounded border-2 border-zinc-200 bg-zinc-100 transition-all dark:border-zinc-800 dark:bg-zinc-900"
        style={{
          transform: `translate(${x}px, ${y}px)`,
          height: rowHeight * 7,
          width: colWidth * 1.5,
          fontSize: 16 * zoom,
          padding: 12 * zoom,
        }}
      >
        <span
          className={
            "absolute border-zinc-200 bg-inherit dark:border-zinc-800 " +
            (right ? "border-b-2 border-l-2" : "border-t-2 border-r-2")
          }
          style={{
            transform: `translate(${
              right ? -21 * zoom : colWidth * 1.5 - 22 * zoom
            }px, ${
              bottom ? 16 * zoom : rowHeight * 6 - 16 * zoom
            }px) rotate(45deg)`,
            height: zoom * 16,
            width: zoom * 16,
          }}
        />
        <div className="flex justify-end" style={{ gap: 12 * zoom }}>
          <button
            onClick={() => setEditCourseOpen(true)}
            className="rounded text-zinc-400 hover:text-teal-500"
          >
            <PencilSimpleLine size={16 * zoom} weight="bold" />
          </button>
          <button
            onClick={(e) => {
              setOnConfirm({
                title: "delete course",
                message:
                  "all the connections to this course will also be deleted. are you sure you want to delete this course?",
                action: () => {
                  handleDeleteCourse();
                  close(e);
                },
              });
            }}
            className="rounded text-zinc-400 hover:text-teal-500"
          >
            <TrashSimple size={16 * zoom} weight="bold" />
          </button>
          <button
            onClick={close}
            className="rounded text-zinc-400 hover:text-teal-500"
          >
            <X size={16 * zoom} weight="bold" />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div className="leading-none" style={{ fontSize: 20 * zoom }}>
            {course?.code || <p className="italic">no course code</p>}
          </div>
          <div>
            {course?.units || 0} unit
            {course?.units !== 1 && "s"}
          </div>
        </div>
        <div
          className="leading-none text-zinc-600 dark:text-zinc-400"
          style={{ fontSize: 14 * zoom }}
        >
          {course?.title || <p className="italic">no course title</p>}
        </div>
        <div className="mt-1 overflow-auto leading-tight">
          {course?.description || (
            <p className="italic">no course description</p>
          )}
        </div>
      </Transition>
    </div>
  );
};

export default CourseDetails;
