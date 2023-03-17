import { Gear, SignIn, SignOut, SquareHalf, UserCircle } from "phosphor-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import { Menu, Transition } from "@headlessui/react";

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
    <div className="z-20 flex h-full w-16 flex-col justify-between border-r-2 border-zinc-200 dark:border-zinc-800">
      <div className="flex grow flex-col gap-2 py-2">
        {sidebarItems.map((item, index) => (
          <Link
            href={item.url}
            key={index}
            className={`${
              item.url === router.asPath
                ? "text-zinc-900 dark:text-zinc-100"
                : "text-zinc-500 "
            } flex items-center justify-center py-2 hover:text-teal-600 hover:dark:text-teal-400`}
          >
            {item.icon}
          </Link>
        ))}
      </div>
      <div className="flex flex-col border-t-2 border-zinc-200 py-4 text-sm dark:border-zinc-800">
        {session ? (
          <Menu>
            <Menu.Button className="flex items-center justify-center text-zinc-600 hover:text-teal-600 dark:text-zinc-400 hover:dark:text-teal-400">
              <UserCircle size={32} />
            </Menu.Button>
            <Transition
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Menu.Items className="absolute w-32 translate-x-[4.25rem] -translate-y-10 scale-100 rounded border-2 border-zinc-200 bg-zinc-100 p-1 dark:border-zinc-800 dark:bg-zinc-900">
                <Menu.Item>
                  <button
                    className="flex w-full items-center justify-start gap-2 rounded px-1 text-base hover:bg-teal-600 hover:text-zinc-100 dark:hover:bg-teal-400 dark:hover:text-zinc-900"
                    type="button"
                    onClick={() => void signOut()}
                  >
                    <SignOut weight="bold" />
                    sign out
                  </button>
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        ) : (
          <Link
            href="sign-in"
            className="flex items-center justify-center text-zinc-600 hover:text-teal-600 dark:text-zinc-400 hover:dark:text-teal-400"
          >
            <SignIn size={32} />
          </Link>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
