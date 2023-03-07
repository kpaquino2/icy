import type { Course } from "@prisma/client";
import { useRef } from "react";

interface LineProps {
  pre: Course;
  post: Course;
  focused: boolean;
}

const Line = ({ pre, post, focused }: LineProps) => {
  const prereqsem = pre.sem;
  const prereqpos = pre.position;
  const postreqsem = post.sem;
  const postreqpos = post.position;
  const start: [number, number] = [
    (prereqsem + 1) * 192 - 24,
    (prereqpos + 1) * 36 + 40,
  ];
  const end: [number, number] = [
    postreqsem * 192 + 24,
    (postreqpos + 1) * 36 + 40,
  ];

  const pathRef = useRef<SVGPathElement>(null);
  const dist = pathRef.current?.getTotalLength();
  return (
    <g
      className={
        (focused
          ? "stroke-teal-600 opacity-100 dark:stroke-teal-400"
          : "stroke-zinc-500 opacity-50 ") +
        " fill-transparent stroke-2 transition-all"
      }
    >
      <path
        d={`M ${start[0]} ${start[1] - 5.66} L ${start[0] + 5.66} ${start[1]}`}
      />
      <path
        d={`M ${start[0]} ${start[1] + 5.66} L ${start[0] + 5.66} ${start[1]}`}
      />
      <path
        ref={pathRef}
        d={`M ${start[0] + 4} ${start[1]}
            L ${start[0] + (end[0] - start[0]) / 4} ${start[1]}
            L ${end[0] - (end[0] - start[0]) / 4} ${end[1]}
            L ${end[0]} ${end[1]}
          `}
      />
      <path d={`M ${end[0] - 5.66} ${end[1] - 5.66} L ${end[0]} ${end[1]}`} />
      <path d={`M ${end[0] - 5.66} ${end[1] + 5.66} L ${end[0]} ${end[1]}`} />
      {focused && (
        <polygon
          points="0,-3 3,0 0,3 -3,0"
          className="rounded fill-teal-600 dark:fill-teal-400"
        >
          <animateMotion
            dur={`${(dist || 1) * 0.01}`}
            repeatCount="indefinite"
            rotate="auto"
            path={`M ${start[0] + 4} ${start[1]}
            L ${start[0] + (end[0] - start[0]) / 4} ${start[1]}
            L ${end[0] - (end[0] - start[0]) / 4} ${end[1]}
            L ${end[0]} ${end[1]}
          `}
          />
        </polygon>
      )}
    </g>
  );
};

export default Line;
