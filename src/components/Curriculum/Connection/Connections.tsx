import { type Dispatch, type SetStateAction } from "react";
import { useCurriculumStore } from "../../../utils/stores/curriculumStore";
import Line from "./Line";

interface ConnectionsProps {
  focused: string;
  setFocused: Dispatch<SetStateAction<string>>;
}

const Connections = ({ focused, setFocused }: ConnectionsProps) => {
  const curriculum = useCurriculumStore((state) => state.curriculum);

  return (
    <>
      {curriculum && (
        <svg className="absolute z-[2] h-full w-full scale-100 overflow-visible">
          {curriculum.connections.map((connection, i) => {
            const pre = curriculum.courses.find(
              (c) => c.id === connection.prereqId
            );
            const post = curriculum.courses.find(
              (c) => c.id === connection.postreqId
            );
            if (!pre || !post) return <></>;
            return (
              <Line
                focused={
                  focused === pre.id ||
                  focused === post.id ||
                  focused === pre.id + post.id
                }
                key={i}
                pre={pre}
                post={post}
                focus={() => setFocused(pre.id + post.id)}
                blur={() => setFocused("")}
              />
            );
          })}
        </svg>
      )}
    </>
  );
};

export default Connections;
