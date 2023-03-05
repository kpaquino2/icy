import type { Course } from "@prisma/client";

interface LineProps {
  pre: Course;
  post: Course;
  offset: number;
}

const Line = ({ pre, post, offset }: LineProps) => {
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
  console.log(offset);

  return (
    <g>
      <path
        className="stroke-black stroke-2 transition-all"
        d={`M ${start[0]} ${start[1]} L ${end[0] - 6 * offset} ${start[1]}`}
      />
      <path
        className="stroke-black stroke-2 transition-all"
        d={`M ${end[0] - 6 * offset} ${start[1]} L ${end[0] - 6 * offset} ${
          end[1]
        }`}
      />
      <path
        className="stroke-black stroke-2 transition-all"
        d={`M ${end[0] - 6 * offset} ${end[1]} L ${end[0]} ${end[1]}`}
      />
    </g>
  );
};

export default Line;
