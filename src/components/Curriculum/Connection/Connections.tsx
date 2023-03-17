import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useConstantsStore } from "../../../utils/stores/constantsStore";
import { useCurriculumStore } from "../../../utils/stores/curriculumStore";
import Line from "./Line";

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
  const [mousepos, setMousePos] = useState<[number, number]>([0, 0]);
  const svgref = useRef<SVGSVGElement | null>(null);
  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      if (!svgref.current) return;
      const bound = svgref.current.getBoundingClientRect();
      setMousePos([e.clientX - bound.left, e.pageY - bound.top]);
    };
    document.addEventListener("mousemove", updateMousePosition);
    return () => {
      document.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  const zoom = useConstantsStore((state) => state.zoom);
  const rowHeight = 36 * zoom;
  const colWidth = 192;

  if (!curriculum) return <></>;
  const selpre = curriculum.courses.find((c) => c.id === prereq);
  const selpost = curriculum.courses.find((c) => c.id === postreq);

  const selstart: [number, number] | null = selpre
    ? [(selpre.sem + 1) * colWidth - 24, (selpre.position + 1) * rowHeight + 40]
    : null;
  const selend: [number, number] = selpost
    ? [selpost.sem * colWidth + 24, (selpost.position + 1) * rowHeight + 40]
    : mousepos;

  return (
    <>
      <svg
        className="absolute z-[2] h-full w-full scale-100 overflow-visible"
        ref={svgref}
      >
        {!!selstart && (
          <Line
            focused={false}
            start={selstart}
            end={selend}
            focus={() => void undefined}
            blur={() => void undefined}
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
          const prereqsem = pre.sem;
          const prereqpos = pre.position;
          const postreqsem = post.sem;
          const postreqpos = post.position;
          const start: [number, number] = [
            (prereqsem + 1) * colWidth - 24,
            (prereqpos + 1) * rowHeight + 40,
          ];
          const end: [number, number] = [
            postreqsem * colWidth + 24,
            (postreqpos + 1) * rowHeight + 40,
          ];
          return (
            <Line
              focused={
                focused === pre.id ||
                focused === post.id ||
                focused === pre.id + post.id
              }
              key={i}
              start={start}
              end={end}
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
