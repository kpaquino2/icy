import { Menu, Transition } from "@headlessui/react";
import type { ReactNode } from "react";
import { Fragment } from "react";

interface DropdownMenuProps {
  button: ReactNode;
  items: ReactNode[];
}

const DropdownMenu = (props: DropdownMenuProps) => {
  return (
    <Menu as="div" className="relative">
      <Menu.Button as={Fragment}>{props.button}</Menu.Button>
      <Transition
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <Menu.Items className="absolute right-0 mt-1 w-32 scale-100 rounded border-2 border-zinc-200 bg-zinc-100 p-1 dark:border-zinc-800 dark:bg-zinc-900">
          {props.items.map((item, index) => (
            <Menu.Item as={Fragment} key={index}>
              {item}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default DropdownMenu;
