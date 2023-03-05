import type { Course } from "@prisma/client";
import type { Dispatch, SetStateAction } from "react";
import { api } from "../../utils/api";
import { useCurriculumStore } from "../../utils/stores/curriculumStore";
import CourseDetailsForm from "../Forms/CourseDetailsForm";
import Modal from "../Modal";

interface EditCourseModalProps {
  course: Course;
  editCourseOpen: boolean;
  setEditCourseOpen: Dispatch<SetStateAction<boolean>>;
}

const EditCourseModal = ({
  course,
  editCourseOpen,
  setEditCourseOpen,
}: EditCourseModalProps) => {
  const updateCourse = useCurriculumStore((state) => state.updateCourse);

  let refetchTimeout: NodeJS.Timeout;
  const tctx = api.useContext();
  const { mutate: updateCourseMutation } = api.course.updateCourse.useMutation({
    onMutate: async (input) => {
      updateCourse({
        ...course,
        ...input,
      });
      await tctx.curriculum.getCurriculum.cancel();
      const prev = tctx.curriculum.getCurriculum.getData();
      return { prev };
    },
    onError: (err, input, ctx) => {
      if (err.data?.code === "UNAUTHORIZED") return;
      tctx.curriculum.getCurriculum.setData(undefined, ctx?.prev);
    },
    onSettled: () => {
      setEditCourseOpen(false);
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
    updateCourseMutation({
      id: course.id,
      code: data.code,
      title: data.title,
      description: data.description,
      units: data.units,
    });
    setEditCourseOpen(false);
  };
  return (
    <Modal
      isOpen={editCourseOpen}
      setIsOpen={setEditCourseOpen}
      width="w-96"
      title="edit course"
    >
      <CourseDetailsForm
        open={editCourseOpen}
        setOpen={setEditCourseOpen}
        submitData={submitData}
        defaultData={{
          code: course.code,
          units: course.units,
          title: course.title || "",
          description: course.description || "",
        }}
      />
    </Modal>
  );
};

export default EditCourseModal;
