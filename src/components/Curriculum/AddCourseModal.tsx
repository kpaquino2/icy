import { createId } from "@paralleldrive/cuid2";
import { type Dispatch, type SetStateAction } from "react";
import { api } from "../../utils/api";
import CourseDetailsForm from "../Forms/CourseDetailsForm";
import Modal from "../Modal";

interface AddCourseModalProps {
  semesterId: string;
  newCourseOpen: boolean;
  setNewCourseOpen: Dispatch<SetStateAction<boolean>>;
  title: string;
}

const AddCourseModal = ({
  semesterId,
  newCourseOpen,
  setNewCourseOpen,
  title,
}: AddCourseModalProps) => {
  let refetchTimeout: NodeJS.Timeout;
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
                      units: input.units,
                      semesterId: input.semesterId,
                      createdAt: new Date(),
                    },
                  ],
                }
              : s
          );
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

  const submitData = (data: {
    title: string;
    code: string;
    description: string;
    units: number;
  }) => {
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
      <CourseDetailsForm
        open={newCourseOpen}
        setOpen={setNewCourseOpen}
        submitData={submitData}
        defaultData={{ code: "", units: 0, title: "", description: "" }}
      />
    </Modal>
  );
};

export default AddCourseModal;
