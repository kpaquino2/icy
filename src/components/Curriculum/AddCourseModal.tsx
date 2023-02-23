import { createId } from "@paralleldrive/cuid2";
import { type Dispatch, type SetStateAction } from "react";
import { getPosition } from "../../utils/position";
import { useCurriculumStore } from "../../utils/stores/curriculumStore";
import CourseDetailsForm from "../Forms/CourseDetailsForm";
import Modal from "../Modal";

interface AddCourseModalProps {
  semesterId: string;
  lastPosition: string;
  newCourseOpen: boolean;
  setNewCourseOpen: Dispatch<SetStateAction<boolean>>;
  title: string;
}

const AddCourseModal = ({
  semesterId,
  lastPosition,
  newCourseOpen,
  setNewCourseOpen,
  title,
}: AddCourseModalProps) => {
  const createCourse = useCurriculumStore((state) => state.createCourse);

  const submitData = (data: {
    title: string;
    code: string;
    description: string;
    units: number;
  }) => {
    createCourse({
      ...data,
      id: createId(),
      position: getPosition(lastPosition),
      semesterId: semesterId,
      createdAt: new Date(),
    });
    setNewCourseOpen(false);
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
