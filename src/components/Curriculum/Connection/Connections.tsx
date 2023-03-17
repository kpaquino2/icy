import { useRef, type Dispatch, type SetStateAction } from "react";
import { useCurriculumStore } from "../../../utils/stores/curriculumStore";
import Line from "./Line";
import TempLine from "./TempLine";

interface ConnectionsProps {
  focused: string;
  setFocused: Dispatch<SetStateAction<string>>;
  prereq: string;
  postreq: string;
}

const Connections = ({
  focused,
  setFocused,
  prereq,
  postreq,
}: ConnectionsProps) => {
  const curriculum = useCurriculumStore((state) => state.curriculum);
  const svgref = useRef<SVGSVGElement>(null);

  if (!curriculum) return <></>;
  const selpre = curriculum.courses.find((c) => c.id === prereq);
  const selpost = curriculum.courses.find((c) => c.id === postreq);

  return (
    <>
      <svg
        className="absolute z-[2] h-full w-full scale-100 overflow-visible"
        ref={svgref}
      >
        {!!selpre && svgref.current && (
          <TempLine
            focused={false}
            prereqsem={selpre.sem}
            prereqpos={selpre.position}
            postreqsem={selpost?.sem}
            postreqpos={selpost?.position}
            boundleft={svgref.current.getBoundingClientRect().left}
            boundtop={svgref.current.getBoundingClientRect().top}
          />
        )}
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
              prereqsem={pre.sem}
              prereqpos={pre.position}
              postreqsem={post.sem}
              postreqpos={post.position}
              focus={() => setFocused(pre.id + post.id)}
              blur={() => setFocused("")}
            />
          );
        })}
      </svg>
    </>
  );
};

export default Connections;
