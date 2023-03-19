import { useEffect, useState } from "react";
import { useConstantsStore } from "../../../utils/stores/constantsStore";

interface TempLineProps {
  prereqpos: number;
  prereqsem: number;
  postreqpos: number | undefined;
  postreqsem: number | undefined;
  focused: boolean;
  boundleft: number;
  boundtop: number;
}

const TempLine = ({
  prereqpos,
  prereqsem,
  postreqpos,
  postreqsem,
  boundleft,
  boundtop,
}: TempLineProps) => {
  const zoom = useConstantsStore((state) => state.zoom);
  const rowHeight = 36 * zoom;
  const colWidth = 192 * zoom;

  const start: [number, number] = [
    (prereqsem + 1) * colWidth - colWidth * 0.125,
    (prereqpos + 1) * rowHeight + 40 * zoom,
  ];

  const [mousepos, setMousePos] = useState<[number, number]>(start);
  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePos([e.clientX - boundleft, e.pageY - boundtop]);
    };
    document.addEventListener("mousemove", updateMousePosition);
    return () => {
      document.removeEventListener("mousemove", updateMousePosition);
    };
  });

  const end: [number, number] =
    postreqpos !== undefined && postreqsem !== undefined
      ? [
          postreqsem * colWidth + colWidth * 0.125,
          (postreqpos + 1) * rowHeight + 40 * zoom,
        ]
      : mousepos;

  return (
    <g
      className="fill-none stroke-zinc-500 opacity-50"
      style={{
        strokeWidth: 2 * zoom,
      }}
    >
      <path
        d={`M ${start[0]} ${start[1] - 5.66 * zoom} L ${
          start[0] + 5.66 * zoom
        } ${start[1]}`}
      />
      <path
        d={`M ${start[0]} ${start[1] + 5.66 * zoom} L ${
          start[0] + 5.66 * zoom
        } ${start[1]}`}
      />
      <path
        d={`M ${start[0] + 4} ${start[1]}
            L ${start[0] + (end[0] - start[0]) / 4} ${start[1]}
            L ${end[0] - (end[0] - start[0]) / 4} ${end[1]}
            L ${end[0]} ${end[1]}
          `}
      />
      <path
        d={`M ${end[0] - 5.66 * zoom} ${end[1] - 5.66 * zoom} L ${end[0]} ${
          end[1]
        }`}
      />
      <path
        d={`M ${end[0] - 5.66 * zoom} ${end[1] + 5.66 * zoom} L ${end[0]} ${
          end[1]
        }`}
      />
    </g>
  );
};

export default TempLine;
