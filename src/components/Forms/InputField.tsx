import { forwardRef } from "react";

interface InputFieldProps {
  label: string;
  width: string;
  error?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, width, error, ...rest }, ref) => {
    return (
      <div className={"flex flex-col " + width}>
        <label>{label}</label>
        {
          <input
            ref={ref}
            type="text"
            className={
              `w-full rounded border-2 border-zinc-300 bg-inherit px-3 py-1 focus:outline-none focus:ring-1 dark:border-zinc-700 ` +
              (error
                ? "border-pink-600 focus:ring-pink-600 dark:border-pink-400 focus:dark:ring-pink-400"
                : "border-zinc-300 focus:border-teal-600 focus:ring-teal-600 dark:border-zinc-700 focus:dark:border-teal-400 focus:dark:ring-teal-400")
            }
            {...rest}
          />
        }
        <div className="text-xs text-pink-600 dark:text-pink-400">{error}</div>
      </div>
    );
  }
);

InputField.displayName = "InputField";

export default InputField;
