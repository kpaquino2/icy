import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import Modal from "../Modal";
import {
  Check,
  MagnifyingGlass,
  ProjectorScreen,
  ProjectorScreenChart,
} from "phosphor-react";
import { api } from "../../utils/api";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createId } from "@paralleldrive/cuid2";
import { useCurriculumStore } from "../../utils/stores/curriculumStore";

interface AddCurriculumModalProps {
  newCurricOpen: boolean;
  setNewCurricOpen: Dispatch<SetStateAction<boolean>>;
  title: string;
}

const schema = z.object({
  template: z.string({ required_error: "need this" }),
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
  const [search, setSearch] = useState("");

  const { data: templates } = api.template_curriculum.getTemplates.useQuery();
  const { mutateAsync: getTemplateByCode } =
    api.template_curriculum.getTemplateByCode.useMutation();

  const userId = useCurriculumStore((state) => state.userId);
  const setCurriculum = useCurriculumStore((state) => state.setCurriculum);

  const tctx = api.useContext();
  const { mutate: createCurriculumMutation } =
    api.curriculum.createCurriculum.useMutation({
      onMutate: async (input) => {
        setNewCurricOpen(false);
        setCurriculum({
          id: input.id,
          userId: userId,
          sems: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
          courses: [],
          connections: [],
        });
        await tctx.curriculum.getCurriculum.cancel();
        const prev = tctx.curriculum.getCurriculum.getData();
        return { prev };
      },
      onError: (err, input, ctx) => {
        if (err.data?.code === "UNAUTHORIZED") return;
        tctx.curriculum.getCurriculum.setData(undefined, ctx?.prev);
      },
      onSettled: async () => {
        await tctx.curriculum.getCurriculum.refetch();
      },
    });
  const { mutate: createNewCurriculumFromTemplateMutation, isLoading } =
    api.curriculum.createCurriculumFromTemplate.useMutation({
      onError: (err, input) => {
        if (err.data?.code === "UNAUTHORIZED") {
          setCurriculum({
            id: input.curriculum.id,
            userId: userId,
            sems: input.curriculum.sems,
            createdAt: new Date(),
            updatedAt: new Date(),
            connections: [],
            courses: input.curriculum.courses.map((course) => ({
              id: createId(),
              code: course.code,
              title: course.title,
              description: course.description,
              units: course.units,
              position: course.position,
              sem: course.sem,
              curriculumId: input.curriculum.id,
              createdAt: new Date(),
            })),
          });
        }
      },
      onSettled: async () => {
        await tctx.curriculum.getCurriculum.refetch();
        setNewCurricOpen(false);
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
      setSearch("");
      return;
    }
    reset();
  }, [newCurricOpen, reset]);

  const createFromScratch = () => {
    createCurriculumMutation({ id: createId() });
  };

  const handleNext = () => {
    setStepIndex(1);
  };

  const handleBack = () => {
    setStepIndex(0);
  };

  // dont just copy from template
  const onSubmit = async (data: Schema) => {
    const template = await getTemplateByCode({ code: data.template });
    if (!template) return;
    createNewCurriculumFromTemplateMutation({
      curriculum: {
        ...template.curriculum,
        id: createId(),
      },
    });
  };

  return (
    <Modal
      isOpen={newCurricOpen}
      close={() => setNewCurricOpen(false)}
      width="w-[600px]"
      title={title}
    >
      <div className="flex h-96 max-h-96 flex-col overflow-x-hidden pb-3">
        <div className="flex min-w-max flex-1 flex-nowrap gap-2 overflow-hidden">
          <div
            id="form0"
            className="flex w-[568px] flex-col justify-center gap-5"
          >
            <div className="text-center text-lg font-light">
              how would you like to make your curriculum?
            </div>
            <div className="mx-8 flex gap-8">
              <button
                type="button"
                onClick={createFromScratch}
                className="flex w-full flex-col items-center justify-center rounded border-2 border-zinc-400 py-8 text-zinc-400 hover:border-teal-600 hover:text-teal-600 dark:border-zinc-600 dark:text-zinc-600 dark:hover:border-teal-400 dark:hover:text-teal-400"
              >
                <ProjectorScreen size={32} />
                create from scratch
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex w-full flex-col items-center justify-center rounded border-2 border-zinc-400 py-8 text-zinc-400 hover:border-teal-600 hover:text-teal-600 dark:border-zinc-600 dark:text-zinc-600 hover:dark:border-teal-400 hover:dark:text-teal-400"
              >
                <ProjectorScreenChart size={32} />
                use a template
              </button>
            </div>
          </div>
          <form
            id="form1"
            onSubmit={handleSubmit(onSubmit)}
            className="flex h-full w-[568px] flex-col gap-3"
          >
            <div className="relative p-0.5">
              <input
                type="text"
                disabled={isLoading}
                className="peer w-full rounded border-2 border-zinc-200 bg-inherit px-3 py-1 pl-8 focus:border-teal-600 focus:outline-none focus:ring-1 focus:ring-teal-600 dark:border-zinc-800 focus:dark:border-teal-400 focus:dark:ring-teal-400"
                onChange={(e) => setSearch(e.target.value.toLowerCase().trim())}
              />
              <MagnifyingGlass
                size={20}
                weight="bold"
                className="absolute bottom-0 top-0 left-2 my-auto text-zinc-500 peer-focus:text-teal-600 dark:peer-focus:text-teal-400 "
              />
            </div>
            <div
              className={
                (isLoading ? "overflow-y-hidden" : "overflow-y-auto") +
                " relative overflow-y-auto rounded border-2 border-zinc-200 dark:border-zinc-800"
              }
            >
              <div
                className={
                  (isLoading ? "opacity-50" : "opacity-100") +
                  " rounded border-r-2 border-zinc-200 dark:border-zinc-800"
                }
              >
                {templates
                  ?.filter(
                    (p) =>
                      p.program.toLowerCase().includes(search) ||
                      p.currics
                        .map((c) => c.toLowerCase().includes(search))
                        .includes(true)
                  )
                  .map((p, index) => (
                    <div key={index} className="group flex flex-col">
                      <div className="sticky top-0 border-b-2 border-zinc-200 bg-zinc-100 p-2 text-lg dark:border-zinc-800 dark:bg-zinc-900">
                        {p.program.toLowerCase()}
                      </div>
                      {p.currics
                        .filter(
                          (c) =>
                            p.program.toLowerCase().includes(search) ||
                            c.toLowerCase().includes(search)
                        )
                        .map((c, index) => (
                          <label
                            htmlFor={c}
                            tabIndex={0}
                            key={index}
                            className={
                              (isLoading
                                ? ""
                                : "hover:bg-teal-600 hover:text-zinc-100 dark:hover:bg-teal-400 dark:hover:text-zinc-900") +
                              " flex justify-between border-zinc-200 px-4 py-1.5 last:border-b-2  peer-checked:text-teal-600 dark:border-zinc-800 dark:peer-checked:text-teal-400"
                            }
                          >
                            <input
                              type="radio"
                              className="peer hidden"
                              disabled={isLoading}
                              id={c}
                              value={c}
                              {...register("template")}
                            />
                            <div className="text-sm   ">{c.toLowerCase()}</div>
                            <Check
                              size={20}
                              weight="bold"
                              className="hidden peer-checked:block "
                            />
                          </label>
                        ))}
                    </div>
                  ))}
              </div>
            </div>
            <div className="text-end text-xs italic text-zinc-500">
              source: https://amis.uplb.edu.ph/curriculums-management/
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleBack}
                className="rounded border-2 border-teal-600 px-2 py-1 text-teal-600 transition hover:brightness-110 disabled:opacity-50 dark:border-teal-400 dark:text-teal-400"
                disabled={isLoading}
              >
                back
              </button>
              <button
                className="flex items-center gap-2 rounded bg-teal-600 px-2 py-1 text-zinc-100 transition enabled:hover:brightness-110 disabled:opacity-50 dark:bg-teal-400 dark:text-zinc-900"
                disabled={isSubmitting || !isDirty || isLoading}
              >
                confirm
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default AddCurriculumModal;
