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
  const colWidth = 192;

  const start: [number, number] = [
    (prereqsem + 1) * colWidth - 24,
    (prereqpos + 1) * rowHeight + 40,
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
    postreqpos && postreqsem
      ? [postreqsem * colWidth + 24, (postreqpos + 1) * rowHeight + 40]
      : mousepos;

  return (
    <g>
      <path
        className="stroke-zinc-500 stroke-2 opacity-50"
        d={`M ${start[0]} ${start[1] - 5.66} L ${start[0] + 5.66} ${start[1]}`}
      />
      <path
        className="stroke-zinc-500 stroke-2 opacity-50"
        d={`M ${start[0]} ${start[1] + 5.66} L ${start[0] + 5.66} ${start[1]}`}
      />
      <path
        className="fill-none stroke-zinc-500  stroke-2 opacity-50"
        d={`M ${start[0] + 4} ${start[1]}
            L ${start[0] + (end[0] - start[0]) / 4} ${start[1]}
            L ${end[0] - (end[0] - start[0]) / 4} ${end[1]}
            L ${end[0]} ${end[1]}
          `}
      />
      <path
        className="stroke-zinc-500 stroke-2 opacity-50"
        d={`M ${end[0] - 5.66} ${end[1] - 5.66} L ${end[0]} ${end[1]}`}
      />
      <path
        className="stroke-zinc-500 stroke-2 opacity-50"
        d={`M ${end[0] - 5.66} ${end[1] + 5.66} L ${end[0]} ${end[1]}`}
      />
    </g>
  );
};

export default TempLine;
