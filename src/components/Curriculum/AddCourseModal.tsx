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

  const submitData = (data: {
    title: string;
    code: string;
    description: string;
    courseUnits: number;
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
        defaultData={{ code: "", courseUnits: 0, title: "", description: "" }}
      />
    </Modal>
  );
};

export default AddCourseModal;
