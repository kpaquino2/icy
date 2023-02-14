import { zodResolver } from "@hookform/resolvers/zod";
import { createId } from "@paralleldrive/cuid2";
import { type Dispatch, type SetStateAction, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "../../utils/api";
import InputField from "../Forms/InputField";
import TextArea from "../Forms/TextArea";
import Modal from "../Modal";

interface AddCourseModalProps {
  semesterId: string;
  newCourseOpen: boolean;
  setNewCourseOpen: Dispatch<SetStateAction<boolean>>;
  title: string;
}

const schema = z.object({
  code: z.string().min(1, "course code is required"),
  title: z.string(),
  description: z.string(),
  courseUnits: z.coerce
    .number({ invalid_type_error: "expected a number" })
    .int("must be an integer")
    .gte(0, "can not be negative"),
});

type Schema = z.infer<typeof schema>;

const AddCourseModal = ({
  semesterId,
  newCourseOpen,
  setNewCourseOpen,
  title,
}: AddCourseModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  });

  const tctx = api.useContext();
  const { mutate: createNewCourseMutation } =
    api.course.createCourse.useMutation({
      onMutate: async (input) => {
        await tctx.curriculum.getCurriculum.cancel();
        const prev = tctx.curriculum.getCurriculum.getData();
        tctx.curriculum.getCurriculum.setData(undefined, (old) => {
          if (!old) return;
          const newsems = old.sems.map((s) =>
            s.id === input.semesterId
              ? {
                  ...s,
                  courses: [
                    ...s.courses,
                    {
                      id: input.id,
                      code: input.code,
                      title: input.title,
                      description: input.description,
                      courseUnits: input.courseUnits,
                      semesterId: input.semesterId,
                      createdAt: new Date(),
                    },
                  ],
                }
              : s
          );
          console.log(newsems);
          return {
            ...old,
            sems: newsems,
          };
        });
        setNewCourseOpen(false);
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
    if (newCourseOpen) reset();
  }, [newCourseOpen, reset]);

  const onSubmit = (data: Schema) => {
    createNewCourseMutation({
      ...data,
      id: createId(),
      semesterId: semesterId,
    });
  };

  return (
    <Modal
      isOpen={newCourseOpen}
      setIsOpen={setNewCourseOpen}
      width="w-96"
      title={title}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-3 gap-x-2 gap-y-1 pb-3">
          <InputField
            {...register("code")}
            label="course code"
            width="col-span-2"
            error={errors.code?.message}
          />
          <InputField
            {...register("courseUnits")}
            label="units"
            width="col-span-1"
            error={errors.courseUnits?.message}
          />
          <InputField
            {...register("title")}
            label="course title"
            width="col-span-3"
            error={errors.title?.message}
          />
          <TextArea
            {...register("description")}
            label="description"
            width="col-span-3"
            error={errors.description?.message}
          />
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setNewCourseOpen(false)}
            className="rounded border-2 border-teal-600 px-2 py-1 text-teal-600 transition hover:brightness-125 dark:border-teal-400 dark:text-teal-400"
          >
            cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 rounded bg-teal-600 px-2 py-1 text-zinc-100 transition enabled:hover:brightness-125 disabled:opacity-50 dark:bg-teal-400 dark:text-zinc-900"
          >
            submit
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddCourseModal;
