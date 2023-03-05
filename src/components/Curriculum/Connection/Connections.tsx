import { useCurriculumStore } from "../../../utils/stores/curriculumStore";
import Line from "./Line";

const Connections = () => {
  const curriculum = useCurriculumStore((state) => state.curriculum);
  const offsets: number[] = [];

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
            offsets[post.sem] = offsets[post.sem]
              ? ((offsets[post.sem] || 0) + 1) % 8
              : 1;
            return (
              <Line
                key={i}
                pre={pre}
                post={post}
                offset={offsets[post.sem] || 1}
              />
            );
          })}
        </svg>
      )}
    </>
  );
};

export default Connections;
