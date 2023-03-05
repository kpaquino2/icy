import { Plus, X } from "phosphor-react";
import { useState } from "react";
import { api } from "../../../utils/api";
import { useCurriculumStore } from "../../../utils/stores/curriculumStore";
import AddCourseModal from "../Course/AddCourseModal";

interface SemesterProps {
  index: number;
}

const SemesterColumn = ({ index }: SemesterProps) => {
  const sem = (index % 3) + 1;
  const year = Math.ceil((index + 1) / 3);
  const curriculum = useCurriculumStore((state) => state.curriculum);
  const deleteSemester = useCurriculumStore((state) => state.deleteSemester);

  let refetchTimeout: NodeJS.Timeout;
  const tctx = api.useContext();
  const { mutate: deleteSemesterMutation } =
    api.curriculum.deleteSemester.useMutation({
      onMutate: async () => {
        deleteSemester();
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
    if (!curriculum) return;
    deleteSemesterMutation({ id: curriculum.id });
  };

  return (
    <div className="flex h-full items-center justify-between">
      {sem > 2 ? "midyear" : `year ${year} sem ${sem}`}
      <AddCourseModal
        sem={index}
        newCourseOpen={newCourseOpen}
        setNewCourseOpen={setNewCourseOpen}
      />
      <div className="flex gap-2">
        <button
          type="button"
          className="flex text-zinc-400 hover:text-teal-600 hover:dark:text-teal-400"
          onClick={() => setNewCourseOpen(true)}
        >
          <Plus weight="bold" />
        </button>
        {index > 1 && (
          <button
            type="button"
            className="group block text-zinc-400 hover:text-teal-600 hover:dark:text-teal-400"
            onClick={handleDelete}
          >
            <X weight="bold" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SemesterColumn;
