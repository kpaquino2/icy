import { CaretRight } from "phosphor-react";

interface HeaderProps {
  crumbs: string;
}

const Header = ({ crumbs }: HeaderProps) => {
  return (
    <div className="h-16 border-b-2 border-zinc-200 dark:border-zinc-800">
      <div className="flex h-full items-center gap-2 px-4">
        <span className="text-zinc-600 dark:text-zinc-400">icy planner</span>
        {crumbs.split("/").map((crumb, index) => (
          <div key={index} className="flex items-center gap-2">
            <CaretRight weight="bold" size={16} />
            <span className="text-zinc-600 dark:text-zinc-400">{crumb}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Header;
