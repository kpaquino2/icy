import { Gear, GithubLogo, SquareHalf } from "phosphor-react";
import { useRouter } from "next/router";
import Button from "../UI/Button";

const Sidebar = () => {
  const router = useRouter();

  const sidebarItems = [
    { url: "/", icon: <SquareHalf size={32} /> },
    {
      url: "/settings",
      icon: <Gear size={32} />,
    },
  ];

  return (
    <div className="z-20 flex h-full w-16 flex-col justify-between border-r-2 border-zinc-200 dark:border-zinc-800">
      <div className="flex grow flex-col">
        {sidebarItems.map((item, index) => (
          <Button
            href={item.url}
            key={index}
            active={item.url === router.asPath}
            variant="base"
            size="xl"
            fill
          >
            {item.icon}
          </Button>
        ))}
      </div>
      <div className="border-t-2 border-zinc-200 dark:border-zinc-800">
        <Button
          href="https://github.com/kpaquino2/icy"
          target="_blank"
          variant="base"
          size="xl"
          fill
        >
          <GithubLogo size={32} />
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
