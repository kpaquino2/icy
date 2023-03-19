import { type FocusEventHandler, useRef } from "react";
import { useConstantsStore } from "../../../utils/stores/constantsStore";
import { useSettingsStore } from "../../../utils/stores/settingsStore";

interface LineProps {
  prereqpos: number;
  prereqsem: number;
  postreqpos: number;
  postreqsem: number;
  focused: boolean;
  focus: FocusEventHandler;
  blur: FocusEventHandler;
}

const Line = ({
  prereqpos,
  prereqsem,
  postreqpos,
  postreqsem,
  focused,
  focus,
  blur,
}: LineProps) => {
  const zoom = useConstantsStore((state) => state.zoom);
  const rowHeight = 36 * zoom;
  const colWidth = 192 * zoom;

  const start: [number, number] = [
    (prereqsem + 1) * colWidth - colWidth * 0.125,
    (prereqpos + 1) * rowHeight + 40 * zoom,
  ];
  const end: [number, number] = [
    postreqsem * colWidth + colWidth * 0.125,
    (postreqpos + 1) * rowHeight + 40 * zoom,
  ];

  const pathRef = useRef<SVGPathElement>(null);
  const dist = pathRef.current?.getTotalLength();

  const animateConnections = useSettingsStore(
    (state) => state.appearance.animateConnections
  );
  return (
    <g>
      <path
        className={
          (focused
            ? "stroke-teal-500 opacity-100"
            : "stroke-zinc-500 opacity-50 ") + " fill-none stroke-2"
        }
        d={`M ${start[0]} ${start[1] - 5.66} L ${start[0] + 5.66} ${start[1]}`}
      />
      <path
        className={
          (focused
            ? "stroke-teal-500 opacity-100"
            : "stroke-zinc-500 opacity-50 ") + " fill-none stroke-2"
        }
        d={`M ${start[0]} ${start[1] + 5.66} L ${start[0] + 5.66} ${start[1]}`}
      />
      <path
        className={
          (focused
            ? "stroke-teal-500 opacity-100"
            : "stroke-zinc-500 opacity-50 ") + " fill-none stroke-2"
        }
        ref={pathRef}
        d={`M ${start[0] + 4} ${start[1]}
            L ${start[0] + (end[0] - start[0]) / 4} ${start[1]}
            L ${end[0] - (end[0] - start[0]) / 4} ${end[1]}
            L ${end[0]} ${end[1]}
          `}
      />
      <path
        className="cursor-pointer fill-none stroke-transparent stroke-[20px] outline-none"
        d={`M ${start[0] + 4} ${start[1]}
            L ${start[0] + (end[0] - start[0]) / 4} ${start[1]}
            L ${end[0] - (end[0] - start[0]) / 4} ${end[1]}
            L ${end[0]} ${end[1]}
          `}
        tabIndex={1}
        onFocus={focus}
        onBlur={blur}
      />
      <path
        className={
          (focused
            ? "stroke-teal-500 opacity-100"
            : "stroke-zinc-500 opacity-50 ") + " fill-none stroke-2"
        }
        d={`M ${end[0] - 5.66} ${end[1] - 5.66} L ${end[0]} ${end[1]}`}
      />
      <path
        className={
          (focused
            ? "stroke-teal-500 opacity-100"
            : "stroke-zinc-500 opacity-50 ") + " fill-none stroke-2"
        }
        d={`M ${end[0] - 5.66} ${end[1] + 5.66} L ${end[0]} ${end[1]}`}
      />
      {focused && animateConnections && (
        <polygon points="0,-3 3,0 0,3 -3,0" className="rounded fill-teal-500">
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
