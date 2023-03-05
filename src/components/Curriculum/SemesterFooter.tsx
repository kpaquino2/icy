interface SemesterProps {
  units: number;
}

const SemesterFooter = ({ units }: SemesterProps) => {
  return (
    <div className="flex items-center justify-between ">sem units: {units}</div>
  );
};

export default SemesterFooter;
