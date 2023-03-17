import { useConstantsStore } from "../../../utils/stores/constantsStore";

interface SemesterProps {
  units: number;
}

const SemesterFooter = ({ units }: SemesterProps) => {
  const zoom = useConstantsStore((state) => state.zoom);
  return (
    <div
      className="flex h-full items-center justify-between"
      style={{
        fontSize: 16 * zoom,
      }}
    >
      sem units: {units}
    </div>
  );
};

export default SemesterFooter;
