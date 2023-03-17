import { Gear, SignIn, SquareHalf, User } from "phosphor-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";

const Sidebar = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const sidebarItems = [
    { url: "/", icon: <SquareHalf size={32} /> },
    {
      url: "/settings",
      icon: <Gear size={32} />,
    },
  ];

  return (
    <div className="flex h-full w-16 flex-col justify-between border-r-2 border-zinc-200 dark:border-zinc-800">
      <div className="flex grow flex-col gap-2">
        {sidebarItems.map((item, index) => (
          <Link
            href={item.url}
            key={index}
            className={`${
              item.url === router.asPath
                ? "text-zinc-900 dark:text-zinc-100"
                : "text-zinc-500 "
            } flex items-center justify-center pt-4 hover:text-teal-600 hover:dark:text-teal-400`}
          >
            {item.icon}
          </Link>
        ))}
      </div>
      <div className="flex flex-col border-t-2 border-zinc-200 py-4 text-sm dark:border-zinc-800">
        {session ? (
          <button
            type="button"
            className={`flex items-center justify-center text-zinc-600 hover:text-zinc-700 dark:text-zinc-400 hover:dark:text-zinc-300`}
            onClick={() => void signOut()}
          >
            <User size={32} />
          </button>
        ) : (
          <Link
            href="sign-in"
            className="flex items-center justify-center text-zinc-600 hover:text-teal-600 dark:text-zinc-400 hover:dark:text-teal-400 "
          >
            <SignIn size={32} />
          </Link>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
