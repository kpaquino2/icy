import { type Course } from "@prisma/client";
import type { FocusEventHandler, MouseEventHandler } from "react";
import { useConstantsStore } from "../../../utils/stores/constantsStore";

interface CourseProps {
  course: Course;
  open: MouseEventHandler;
  focus: FocusEventHandler;
  blur: FocusEventHandler;
  mousedown: MouseEventHandler;
  mouseup: MouseEventHandler;
  mouseover: MouseEventHandler;
  mouseout: MouseEventHandler;
}

const CourseItem = ({
  course,
  open,
  focus,
  blur,
  mouseup,
  mousedown,
  mouseover,
  mouseout,
}: CourseProps) => {
  const zoom = useConstantsStore((state) => state.zoom);
  return (
    <button
      onFocus={focus}
      onBlur={blur}
      onClick={open}
      onMouseDown={mousedown}
      onMouseUp={mouseup}
      onMouseOver={mouseover}
      onMouseOut={mouseout}
      className="pointer-events-auto flex h-3/4 w-3/4 items-center justify-start rounded bg-teal-600 p-2 text-start text-zinc-100 hover:brightness-110 dark:bg-teal-400 dark:text-zinc-900"
      style={{
        fontSize: 16 * zoom,
      }}
    >
      {course.code}
    </button>
  );
};

export default CourseItem;
