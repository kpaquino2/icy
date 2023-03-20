import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../../UI/Forms/InputField";
import TextArea from "../../UI/Forms/TextArea";
import { type Dispatch, type SetStateAction, useEffect } from "react";
import Button from "../../UI/Button";

const schema = z.object({
  code: z.string().min(1, "course code is required"),
  title: z.string(),
  description: z.string(),
  units: z.coerce
    .number({ invalid_type_error: "expected a number" })
    .int("must be an integer")
    .gte(0, "can not be negative"),
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
    formState: { errors, isSubmitting, isDirty },
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
          {...register("units")}
          label="units"
          width="col-span-1"
          error={errors.units?.message}
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
        <Button
          type="button"
          onClick={() => setOpen(false)}
          disabled={isSubmitting}
          variant="base"
          size="md"
        >
          cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !isDirty}
          variant="primary"
          size="md"
        >
          submit
        </Button>
      </div>
    </form>
  );
};

export default CourseDetailsForm;
