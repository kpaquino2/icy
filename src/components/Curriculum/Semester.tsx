import { type Prisma } from "@prisma/client";
import { Plus, X } from "phosphor-react";
import { api } from "../../utils/api";

interface SemesterProps {
  sem: Prisma.SemesterGetPayload<{ include: { courses: true } }>;
  index: number;
}

const Semester = ({ sem, index }: SemesterProps) => {
  const tctx = api.useContext();
  const { mutate: deleteSemesterMutation } =
    api.semester.deleteSemester.useMutation({
      onMutate: async (input) => {
        await tctx.curriculum.getCurriculum.cancel();
        const prev = tctx.curriculum.getCurriculum.getData();
        tctx.curriculum.getCurriculum.setData(undefined, (old) => {
          if (old) {
            const newsems = old.sems.filter((s) => s.id !== input.id);
            return {
              ...old,
              sems: newsems,
            };
          }
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
    deleteSemesterMutation({ id: sem.id });
  };

  return (
    <div className="flex h-full w-48 flex-col justify-between border-y-2 border-l-2 border-zinc-200 first:rounded-l-lg last:rounded-r-lg last:border-r-2 dark:border-zinc-800">
      <div className="flex items-center justify-between border-b-2 border-zinc-200 p-2 dark:border-zinc-800">
        year {Math.floor(index / 2) + 1} sem {(index % 2) + 1}
        <button
          type="button"
          className="text-zinc-400 hover:text-teal-600 hover:dark:text-teal-400"
          onClick={handleDelete}
        >
          <X weight="bold" />
        </button>
      </div>
      <div className="flex flex-1 flex-col p-2">
        {sem.courses?.map(() => (
          <>a</>
        ))}
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded border-2 border-dashed border-zinc-200 p-2 text-zinc-500 hover:border-teal-600 hover:text-teal-600 dark:border-zinc-800 hover:dark:border-teal-400 hover:dark:text-teal-400"
        >
          <Plus weight="bold" />
          new course
        </button>
      </div>
      <div className="w-full border-t-2 border-zinc-200 py-2 text-center text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
        total units: {sem.semUnits}
      </div>
    </div>
  );
};

export default Semester;
