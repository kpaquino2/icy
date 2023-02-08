import { useState } from "react";
import { Switch } from "@headlessui/react";
import { Gear, Sparkle, SquareHalf, User } from "phosphor-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";

const Sidebar = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [dark, setDark] = useState(false);

  const sidebarItems = [
    { label: "curricula", url: "/", icon: <SquareHalf size={32} /> },
    {
      label: "tools",
      url: "/tools",
      icon: <Sparkle size={32} />,
    },
    {
      label: "account",
      url: "/account",
      icon: <User size={32} />,
    },
    {
      label: "settings",
      url: "/settings",
      icon: <Gear size={32} />,
    },
  ];

  const handleTheme = (value: boolean) => {
    document.documentElement.className = value ? "dark" : "light";
    setDark(value);
  };

  return (
    <div className="fixed inset-y-0 left-0 w-52">
      <div className="flex min-h-screen flex-col justify-between gap-4 border-r-2 border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-3 px-4 pt-4">
          <svg
            width="30"
            height="30"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            className="fill-teal-600 dark:fill-teal-400"
          >
            <g clipPath="url(#clip0_0_1)">
              <path d="M73.9142 77.9142L56.4142 60.4142C55.1543 59.1543 53 60.0466 53 61.8284V77.6716C53 78.202 53.2107 78.7107 53.5858 79.0858L71.0858 96.5858C72.3457 97.8457 74.5 96.9534 74.5 95.1716V79.3284C74.5 78.798 74.2893 78.2893 73.9142 77.9142Z" />
              <path d="M22.0858 26.0858L39.5858 43.5858C40.8457 44.8457 39.9534 47 38.1716 47H22.3284C21.798 47 21.2893 46.7893 20.9142 46.4142L3.41422 28.9142C2.15429 27.6543 3.04662 25.5 4.82843 25.5L20.6716 25.5C21.202 25.5 21.7107 25.7107 22.0858 26.0858Z" />
              <path d="M79.0858 53.5858L96.5858 71.0858C97.8457 72.3457 96.9534 74.5 95.1716 74.5H79.3284C78.798 74.5 78.2893 74.2893 77.9142 73.9142L60.4142 56.4142C59.1543 55.1543 60.0466 53 61.8284 53H77.6716C78.202 53 78.7107 53.2107 79.0858 53.5858Z" />
              <path d="M79.0858 46.4142L96.5858 28.9142C97.8457 27.6543 96.9534 25.5 95.1716 25.5H79.3284C78.798 25.5 78.2893 25.7107 77.9142 26.0858L60.4142 43.5858C59.1543 44.8457 60.0466 47 61.8284 47H77.6716C78.202 47 78.7107 46.7893 79.0858 46.4142Z" />
              <path d="M22.0858 73.9142L39.5858 56.4142C40.8457 55.1543 39.9534 53 38.1716 53H22.3284C21.798 53 21.2893 53.2107 20.9142 53.5858L3.41422 71.0858C2.15429 72.3457 3.04662 74.5 4.82843 74.5H20.6716C21.202 74.5 21.7107 74.2893 22.0858 73.9142Z" />
              <path d="M26.0858 77.9142L43.5858 60.4142C44.8457 59.1543 47 60.0466 47 61.8284V77.6716C47 78.202 46.7893 78.7107 46.4142 79.0858L28.9142 96.5858C27.6543 97.8457 25.5 96.9534 25.5 95.1716V79.3284C25.5 78.798 25.7107 78.2893 26.0858 77.9142Z" />
              <path d="M53.5858 20.9142L71.0858 3.41421C72.3457 2.15428 74.5 3.04662 74.5 4.82843V20.6716C74.5 21.202 74.2893 21.7107 73.9142 22.0858L56.4142 39.5858C55.1543 40.8457 53 39.9534 53 38.1716V22.3284C53 21.798 53.2107 21.2893 53.5858 20.9142Z" />
              <path d="M46.4142 20.9142L28.9142 3.41421C27.6543 2.15428 25.5 3.04662 25.5 4.82843V20.6716C25.5 21.202 25.7107 21.7107 26.0858 22.0858L43.5858 39.5858C44.8457 40.8457 47 39.9534 47 38.1716V22.3284C47 21.798 46.7893 21.2893 46.4142 20.9142Z" />
            </g>
            <defs>
              <clipPath id="clip0_0_1">
                <rect width="100" height="100" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <span className="text-xl font-thin">icy planner</span>
        </div>
        <div className="flex grow flex-col gap-2">
          {sidebarItems.map((item, index) => (
            <Link
              href={item.url}
              key={index}
              className={`${
                item.url === router.asPath
                  ? "text-zinc-900 dark:text-zinc-100"
                  : "text-zinc-500 "
              } my-1 flex items-center gap-3 px-4 py-1 hover:text-teal-600 hover:dark:text-teal-400`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex flex-col border-t-2 border-zinc-200 py-4 text-sm dark:border-zinc-800">
          {session && (
            <button
              type="button"
              className={`w-max px-4 py-1 text-zinc-600 hover:text-zinc-700 dark:text-zinc-400 hover:dark:text-zinc-300`}
              onClick={() => void signOut()}
            >
              sign out
            </button>
          )}
          <Link
            href="help"
            className={`${
              "/signin" === router.asPath
                ? "text-zinc-700 dark:text-zinc-300"
                : "text-zinc-600 dark:text-zinc-400"
            } px-4 py-1 hover:text-zinc-700 hover:dark:text-zinc-300`}
          >
            help
          </Link>
          <Link
            href="contactus"
            className={`${
              "/signin" === router.asPath
                ? "text-zinc-700 dark:text-zinc-300"
                : "text-zinc-600 dark:text-zinc-400"
            } px-4 py-1 hover:text-zinc-700 hover:dark:text-zinc-300`}
          >
            contact us
          </Link>
          <div className="flex items-center justify-between px-4 py-1 text-zinc-600 dark:text-zinc-400">
            dark mode
            <Switch
              checked={dark}
              onChange={handleTheme}
              className={`${
                dark ? "dark:bg-teal-400" : "bg-zinc-400"
              } relative inline-flex h-6 w-11 items-center rounded-full`}
            >
              <span className="sr-only">Enable notifications</span>
              <span
                className={`${
                  dark ? "translate-x-6" : "translate-x-1"
                } inline-block h-4 w-4 transform rounded-full bg-white transition`}
              />
            </Switch>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
