import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "./InputField";
import TextArea from "./TextArea";
import { type Dispatch, type SetStateAction, useEffect } from "react";

const schema = z.object({
  code: z.string().min(1, "course code is required"),
  title: z.string(),
  description: z.string(),
  courseUnits: z.coerce
    .number({ invalid_type_error: "expected a number" })
    .int("must be an integer")
    .gt(0, "can not be 0 or less"),
});

type Schema = z.infer<typeof schema>;

interface CourseDetailsFormProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  submitData: (data: Schema) => void;
  defaultData: Schema;
}

const CourseDetailsForm = ({
  open,
  setOpen,
  submitData,
  defaultData,
}: CourseDetailsFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: defaultData,
  });

  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  const onSubmit = (data: Schema) => {
    submitData(data);
  };

  return (
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
          onClick={() => setOpen(false)}
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
  );
};

export default CourseDetailsForm;
