import { forwardRef } from "react";

interface InputFieldProps {
  label: string;
  width?: string;
  error?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, width, error, ...rest }, ref) => {
    return (
      <div className={"flex flex-col " + (width || "")}>
        <label>{label}</label>
        <input
          ref={ref}
          type="text"
          className={
            `w-full rounded border-2 border-zinc-300 bg-inherit px-3 py-1 focus:outline-none focus:ring-1 dark:border-zinc-700 ` +
            (error
              ? "border-rose-600 focus:ring-rose-600 dark:border-rose-400 focus:dark:ring-rose-400"
              : "border-zinc-300 focus:border-teal-500 focus:ring-teal-500 dark:border-zinc-700")
          }
          {...rest}
        />
        <div className="text-xs text-rose-600 dark:text-rose-400">{error}</div>
      </div>
    );
  }
);

InputField.displayName = "InputField";

export default InputField;
