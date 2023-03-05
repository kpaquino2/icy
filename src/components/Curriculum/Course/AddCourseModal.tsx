import { createId } from "@paralleldrive/cuid2";
import { type Dispatch, type SetStateAction } from "react";
import { api } from "../../../utils/api";
import { useCurriculumStore } from "../../../utils/stores/curriculumStore";
import CourseDetailsForm from "../../Forms/CourseDetailsForm";
import Modal from "../../Modal";

interface AddCourseModalProps {
  sem: number;
  newCourseOpen: boolean;
  setNewCourseOpen: Dispatch<SetStateAction<boolean>>;
}

const AddCourseModal = ({
  sem,
  newCourseOpen,
  setNewCourseOpen,
}: AddCourseModalProps) => {
  const curriculum = useCurriculumStore((state) => state.curriculum);
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
    if (!curriculum) return;
    const courses = curriculum.courses
      .filter((c) => c.sem === sem)
      .sort((a, b) => (a.position > b.position ? 1 : -1));

    let last = -2;

    for (const course of courses) {
      if (course.position - last - 2 >= 2) break;
      last = course.position;
    }

    createCourseMutation({
      ...data,
      id: createId(),
      position: last + 2,
      sem: sem,
      curriculumId: curriculum.id,
    });
  };

  return (
    <Modal
      isOpen={newCourseOpen}
      setIsOpen={setNewCourseOpen}
      width="w-96"
      title="create new course"
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
