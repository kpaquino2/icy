import { useCurriculumStore } from "../../../utils/stores/curriculumStore";
import Line from "./Line";

interface ConnectionsProps {
  focused: string;
}

const Connections = ({ focused }: ConnectionsProps) => {
  const curriculum = useCurriculumStore((state) => state.curriculum);

  return (
    <>
      {curriculum && (
        <svg className="pointer-events-none absolute z-[2] h-full w-full scale-100 overflow-visible">
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
                focused={focused === pre.id || focused === post.id}
                key={i}
                pre={pre}
                post={post}
              />
            );
          })}
        </svg>
      )}
    </>
  );
};

export default Connections;
