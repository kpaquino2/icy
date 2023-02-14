import { type BaseSyntheticEvent, useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import Modal from "../Modal";
import {
  CaretLeft,
  ProjectorScreen,
  ProjectorScreenChart,
} from "phosphor-react";
import { api } from "../../utils/api";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createId } from "@paralleldrive/cuid2";

interface AddCurriculumModalProps {
  newCurricOpen: boolean;
  setNewCurricOpen: Dispatch<SetStateAction<boolean>>;
  title: string;
}

const schema = z.object({
  mode: z.string({ required_error: "need this" }),
});

type Schema = z.infer<typeof schema>;

const AddCurriculumModal = ({
  newCurricOpen,
  setNewCurricOpen,
  title,
}: AddCurriculumModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  });
  const [stepIndex, setStepIndex] = useState(0);

  const tctx = api.useContext();
  const { mutate: createNewCurriculumMutation } =
    api.curriculum.createCurriculum.useMutation({
      onMutate: async (input) => {
        await tctx.curriculum.getCurriculum.cancel();
        const prev = tctx.curriculum.getCurriculum.getData();
        tctx.curriculum.getCurriculum.setData(undefined, () => {
          return {
            id: input.id,
            curricUnits: 0,
            userId: "",
            createdAt: new Date(),
            sems: [],
          };
        });
        setNewCurricOpen(false);
        return { prev };
      },
      onError: (err, input, ctx) => {
        tctx.curriculum.getCurriculum.setData(undefined, ctx?.prev);
      },
      onSettled: async () => {
        await tctx.curriculum.getCurriculum.refetch();
      },
    });

  useEffect(() => {
    const el = document.getElementById(`form${stepIndex}`);
    el?.scrollIntoView({
      block: "start",
      behavior: "smooth",
    });
  }, [stepIndex]);

  useEffect(() => {
    if (newCurricOpen) {
      setStepIndex(0);
      return;
    }
    reset();
  }, [newCurricOpen, reset]);

  const handleNext = () => {
    setStepIndex(1);
  };

  const handleBack = () => {
    setStepIndex(0);
  };

  const onSubmit = (data: Schema, e?: BaseSyntheticEvent) => {
    e?.preventDefault();
    createNewCurriculumMutation({ id: createId() });
  };

  return (
    <Modal
      isOpen={newCurricOpen}
      setIsOpen={setNewCurricOpen}
      width="w-[500px]"
      title={title}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col overflow-x-hidden pb-3">
          <div className="flex min-w-max flex-1 flex-nowrap gap-2">
            <div id="form0" className="flex w-[468px] flex-col gap-1">
              <div className="text-lg font-light">
                how would you like to make your curriculum?
              </div>
              <div className="mx-8 flex gap-8">
                <input
                  type="radio"
                  className="peer hidden"
                  id="scratch"
                  value="scratch"
                  {...register("mode")}
                />
                <label
                  htmlFor="scratch"
                  className="flex w-full flex-col items-center justify-center rounded border-2 border-zinc-400 py-8 text-zinc-400 peer-checked:border-teal-600 peer-checked:text-teal-600 dark:border-zinc-600 dark:text-zinc-600 dark:peer-checked:border-teal-400 dark:peer-checked:text-teal-400"
                >
                  <ProjectorScreen size={32} />
                  create from scratch
                </label>
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex w-full flex-col items-center justify-center rounded border-2 border-zinc-400 py-8 text-zinc-400 active:border-teal-600 active:text-teal-600 dark:border-zinc-600 dark:text-zinc-600 active:dark:border-teal-400 active:dark:text-teal-400"
                >
                  <ProjectorScreenChart size={32} />
                  use a template
                </button>
              </div>
            </div>
            <div
              id="form1"
              className="relative grid w-[468px] flex-col place-items-center"
            >
              <button
                onClick={handleBack}
                type="button"
                className="absolute top-4 left-0"
              >
                <CaretLeft size={32} />
              </button>
              not implemented yet
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setNewCurricOpen(false)}
            className="rounded border-2 border-teal-600 px-2 py-1 text-teal-600 transition hover:brightness-125 dark:border-teal-400 dark:text-teal-400"
          >
            cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 rounded bg-teal-600 px-2 py-1 text-zinc-100 transition enabled:hover:brightness-125 disabled:opacity-50 dark:bg-teal-400 dark:text-zinc-900"
            disabled={isSubmitting || !isDirty}
          >
            confirm
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddCurriculumModal;
