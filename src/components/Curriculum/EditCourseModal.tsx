import type { Course } from "@prisma/client";
import type { Dispatch, SetStateAction } from "react";
import { api } from "../../utils/api";
import CourseDetailsForm from "../Forms/CourseDetailsForm";
import Modal from "../Modal";

interface EditCourseModalProps {
  course: Course;
  editCourseOpen: boolean;
  setEditCourseOpen: Dispatch<SetStateAction<boolean>>;
  title: string;
}

const EditCourseModal = ({
  course,
  editCourseOpen,
  setEditCourseOpen,
  title,
}: EditCourseModalProps) => {
  const tctx = api.useContext();
  const { mutate: updateCourseMutation } = api.course.updateCourse.useMutation({
    onMutate: async (input) => {
      await tctx.curriculum.getCurriculum.cancel();
      const prev = tctx.curriculum.getCurriculum.getData();
      tctx.curriculum.getCurriculum.setData(undefined, (old) => {
        if (!old) return;
        const newsems = old.sems.map((s) =>
          s.id === input.semesterId
            ? {
                ...s,
                courses: s.courses.map((c) =>
                  c.id === input.id
                    ? {
                        ...c,
                        code: input.code,
                        title: input.title,
                        description: input.description,
                        courseUnits: input.courseUnits,
                      }
                    : c
                ),
              }
            : s
        );
        return {
          ...old,
          sems: newsems,
        };
      });
      setEditCourseOpen(false);
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
    updateCourseMutation({
      ...course,
      code: data.code,
      title: data.title,
      description: data.description,
      courseUnits: data.courseUnits,
    });
  };
  return (
    <Modal
      isOpen={editCourseOpen}
      setIsOpen={setEditCourseOpen}
      width="w-96"
      title={title}
    >
      <CourseDetailsForm
        open={editCourseOpen}
        setOpen={setEditCourseOpen}
        submitData={submitData}
        defaultData={{
          code: course.code,
          courseUnits: course.courseUnits,
          title: course.title || "",
          description: course.description || "",
        }}
      />
    </Modal>
  );
};

export default EditCourseModal;
