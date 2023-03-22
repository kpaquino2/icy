import { Switch } from "@headlessui/react";

interface ToggleProps {
  checked: boolean;
  onChange: (...event: unknown[]) => void;
  name: string;
}

const Toggle = (props: ToggleProps) => {
  return (
    <Switch
      checked={props.checked}
      onChange={props.onChange}
      name={props.name}
      className={`${
        props.checked ? "bg-teal-500" : "bg-zinc-200 dark:bg-zinc-800"
      } relative inline-flex h-7 min-w-[44px] items-center rounded-full transition-colors duration-150`}
    >
      <span
        className={`${
          props.checked
            ? "translate-x-5 bg-white"
            : "translate-x-1 bg-zinc-100 dark:bg-zinc-900"
        } inline-block h-5 w-5 transform rounded-full shadow-lg transition`}
      />
    </Switch>
  );
};

export default Toggle;
