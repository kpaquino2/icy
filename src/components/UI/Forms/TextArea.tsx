import { forwardRef } from "react";

interface TextAreaProps {
  label: string;
  width: string;
  error?: string;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, width, error, ...rest }, ref) => {
    return (
      <div className={"flex flex-col " + width}>
        <label>{label}</label>
        <textarea
          ref={ref}
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

TextArea.displayName = "TextArea";

export default TextArea;
