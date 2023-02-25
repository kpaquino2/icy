import { createId } from "@paralleldrive/cuid2";
import { type Dispatch, type SetStateAction } from "react";
import { api } from "../../utils/api";
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

  let refetchTimeout: NodeJS.Timeout;
  const tctx = api.useContext();
  const { mutate: createCourseMutation } = api.course.createCourse.useMutation({
    onMutate: async (input) => {
      setNewCourseOpen(false);
      createCourse({ ...input, createdAt: new Date() });
      await tctx.curriculum.getCurriculum.cancel();
      const prev = tctx.curriculum.getCurriculum.getData();
      return { prev };
    },
    onError: (err, input, ctx) => {
      if (err.data?.code === "UNAUTHORIZED") return;
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
    createCourseMutation({
      ...data,
      id: createId(),
      position: getPosition(lastPosition),
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
