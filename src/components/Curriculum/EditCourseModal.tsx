import type { Course } from "@prisma/client";
import type { Dispatch, SetStateAction } from "react";
import { useCurriculumStore } from "../../utils/stores/curriculumStore";
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
  const updateCourse = useCurriculumStore((state) => state.updateCourse);

  const submitData = (data: {
    title: string;
    code: string;
    description: string;
    units: number;
  }) => {
    updateCourse({
      ...course,
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
      title={title}
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
