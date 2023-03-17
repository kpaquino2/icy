import { Plus, X } from "phosphor-react";
import { useState } from "react";
import { api } from "../../../utils/api";
import { useConstantsStore } from "../../../utils/stores/constantsStore";
import { useCurriculumStore } from "../../../utils/stores/curriculumStore";
import ConfirmActionModal from "../../ConfirmActionModal";
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
  const [onConfirm, setOnConfirm] = useState<null | (() => void)>(null);

  const handleDelete = () => {
    if (!curriculum) return;
    deleteSemesterMutation({ id: curriculum.id });
  };

  const zoom = useConstantsStore((state) => state.zoom);

  return (
    <div className="flex h-full items-center justify-between">
      <span
        style={{
          fontSize: 16 * zoom,
        }}
      >
        {sem > 2 ? "midyear" : `year ${year} sem ${sem}`}
      </span>
      <AddCourseModal
        sem={index}
        newCourseOpen={newCourseOpen}
        setNewCourseOpen={setNewCourseOpen}
      />
      <ConfirmActionModal onConfirm={onConfirm} setOnConfirm={setOnConfirm} />
      <div className="flex gap-2">
        <button
          type="button"
          className="flex text-zinc-400 hover:text-teal-600 hover:dark:text-teal-400"
          onClick={() => setNewCourseOpen(true)}
        >
          <Plus size={16 * zoom} weight="bold" />
        </button>
        <button
          type="button"
          className="group hidden text-zinc-400 hover:text-teal-600 group-last-of-type/sem:block group-only-of-type/sem:hidden hover:dark:text-teal-400"
          onClick={() => setOnConfirm(() => handleDelete)}
        >
          <X size={16 * zoom} weight="bold" />
        </button>
      </div>
    </div>
  );
};

export default SemesterColumn;
