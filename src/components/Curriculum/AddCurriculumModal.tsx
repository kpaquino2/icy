import { useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import Modal from "../UI/Modals/Modal";
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
import Button from "../UI/Button";
import templates from "../../utils/templates/templates";

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

  const temps = templates.reduce(
    (group: { program: string; currics: string[] }[], template) => {
      const index = group.findIndex((v) => v.program === template.program);
      if (group[index]) {
        group[index]?.currics.push(template.code);
        return group;
      }
      group.push({
        program: template.program,
        currics: [template.code],
      });
      return group;
    },
    []
  );

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
          sems: 1,
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
  const { mutateAsync: createNewCurriculumFromTemplateMutation } =
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
    const template = templates.find((t) => {
      if (data.template === t.code) return t;
    });
    if (!template) return;
    try {
      await createNewCurriculumFromTemplateMutation({
        curriculum: {
          ...template,
          id: createId(),
        },
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Modal
      isOpen={newCurricOpen}
      close={() => setNewCurricOpen(isSubmitting)}
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
                className="flex w-full flex-col items-center justify-center rounded border-2 border-zinc-200 py-8 hover:border-teal-500 hover:text-teal-500 dark:border-zinc-800 dark:hover:border-teal-500 dark:hover:text-teal-500"
              >
                <ProjectorScreen size={32} />
                create from scratch
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="flex w-full flex-col items-center justify-center rounded border-2 border-zinc-200 py-8 hover:border-teal-500 hover:text-teal-500 dark:border-zinc-800 dark:hover:border-teal-500 dark:hover:text-teal-500"
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
                disabled={isSubmitting}
                className="peer w-full rounded border-2 border-zinc-200 bg-inherit px-3 py-1 pl-8 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 dark:border-zinc-800"
                onChange={(e) => setSearch(e.target.value.toLowerCase().trim())}
              />
              <MagnifyingGlass
                size={20}
                weight="bold"
                className="absolute bottom-0 top-0 left-2 my-auto text-zinc-500 peer-focus:text-teal-500 "
              />
            </div>
            <div
              className={
                (isSubmitting ? "overflow-y-hidden" : "overflow-y-auto") +
                " relative overflow-y-auto rounded border-2 border-zinc-200 dark:border-zinc-800"
              }
            >
              <div
                className={
                  (isSubmitting ? "opacity-50" : "opacity-100") +
                  " rounded border-r-2 border-zinc-200 dark:border-zinc-800"
                }
              >
                {temps
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
                              (isSubmitting
                                ? ""
                                : "hover:bg-teal-500 hover:text-zinc-100 dark:hover:text-zinc-900") +
                              " flex justify-between border-zinc-200 px-4 py-1.5 last:border-b-2  peer-checked:text-teal-500 dark:border-zinc-800 "
                            }
                          >
                            <input
                              type="radio"
                              className="peer hidden"
                              disabled={isSubmitting}
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
            <div className="mt-auto flex flex-row-reverse items-center justify-between">
              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={handleBack}
                  disabled={isSubmitting}
                  variant="base"
                  size="md"
                >
                  back
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !isDirty}
                  variant="primary"
                  size="md"
                >
                  confirm
                </Button>
              </div>
              {isSubmitting && (
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 100 100"
                  xmlns="http://www.w3.org/2000/svg"
                  className="animate-load fill-teal-500"
                >
                  <g clipPath="url(#clip0_0_1)">
                    <path d="M73.9142 77.9142L56.4142 60.4142C55.1543 59.1543 53 60.0466 53 61.8284V77.6716C53 78.202 53.2107 78.7107 53.5858 79.0858L71.0858 96.5858C72.3457 97.8457 74.5 96.9534 74.5 95.1716V79.3284C74.5 78.798 74.2893 78.2893 73.9142 77.9142Z" />
                    <path d="M22.0858 26.0858L39.5858 43.5858C40.8457 44.8457 39.9534 47 38.1716 47H22.3284C21.798 47 21.2893 46.7893 20.9142 46.4142L3.41422 28.9142C2.15429 27.6543 3.04662 25.5 4.82843 25.5L20.6716 25.5C21.202 25.5 21.7107 25.7107 22.0858 26.0858Z" />
                    <path d="M79.0858 53.5858L96.5858 71.0858C97.8457 72.3457 96.9534 74.5 95.1716 74.5H79.3284C78.798 74.5 78.2893 74.2893 77.9142 73.9142L60.4142 56.4142C59.1543 55.1543 60.0466 53 61.8284 53H77.6716C78.202 53 78.7107 53.2107 79.0858 53.5858Z" />
                    <path d="M79.0858 46.4142L96.5858 28.9142C97.8457 27.6543 96.9534 25.5 95.1716 25.5H79.3284C78.798 25.5 78.2893 25.7107 77.9142 26.0858L60.4142 43.5858C59.1543 44.8457 60.0466 47 61.8284 47H77.6716C78.202 47 78.7107 46.7893 79.0858 46.4142Z" />
                    <path d="M22.0858 73.9142L39.5858 56.4142C40.8457 55.1543 39.9534 53 38.1716 53H22.3284C21.798 53 21.2893 53.2107 20.9142 53.5858L3.41422 71.0858C2.15429 72.3457 3.04662 74.5 4.82843 74.5H20.6716C21.202 74.5 21.7107 74.2893 22.0858 73.9142Z" />
                    <path d="M26.0858 77.9142L43.5858 60.4142C44.8457 59.1543 47 60.0466 47 61.8284V77.6716C47 78.202 46.7893 78.7107 46.4142 79.0858L28.9142 96.5858C27.6543 97.8457 25.5 96.9534 25.5 95.1716V79.3284C25.5 78.798 25.7107 78.2893 26.0858 77.9142Z" />
                    <path d="M53.5858 20.9142L71.0858 3.41421C72.3457 2.15428 74.5 3.04662 74.5 4.82843V20.6716C74.5 21.202 74.2893 21.7107 73.9142 22.0858L56.4142 39.5858C55.1543 40.8457 53 39.9534 53 38.1716V22.3284C53 21.798 53.2107 21.2893 53.5858 20.9142Z" />
                    <path d="M46.4142 20.9142L28.9142 3.41421C27.6543 2.15428 25.5 3.04662 25.5 4.82843V20.6716C25.5 21.202 25.7107 21.7107 26.0858 22.0858L43.5858 39.5858C44.8457 40.8457 47 39.9534 47 38.1716V22.3284C47 21.798 46.7893 21.2893 46.4142 20.9142Z" />
                  </g>
                  <defs>
                    <clipPath id="clip0_0_1">
                      <rect width="100" height="100" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              )}
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default AddCurriculumModal;
