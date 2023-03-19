import Link from "next/link";
import type {
  HTMLAttributeAnchorTarget,
  MouseEventHandler,
  ReactNode,
} from "react";

interface ButtonProps {
  variant: "primary" | "base" | "error";
  size: "md" | "lg" | "xl";
  fill?: boolean;
  children: ReactNode;
  type?: "button" | "submit";
  onClick?: MouseEventHandler;
  onMouseDown?: MouseEventHandler;
  disabled?: boolean;
  grouped?: boolean;
  active?: boolean;
  href?: string;
  target?: HTMLAttributeAnchorTarget;
}

const Button = (props: ButtonProps) => {
  const variants = {
    primary:
      "text-zinc-100 dark:text-zinc-900 active:bg-teal-600 " +
      (props.active ? "bg-teal-600" : "bg-teal-500 hover:bg-teal-400"),
    base:
      "text-zinc-700 dark:text-zinc-300 active:bg-zinc-300 dark:active:bg-zinc-700 " +
      (props.active
        ? "bg-zinc-300 dark:bg-zinc-700"
        : "bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800"),
    error:
      "text-zinc-100 dark:text-zinc-900 active:bg-rose-600 " +
      (props.active ? "bg-rose-600" : "bg-rose-500 hover:bg-rose-400"),
  };

  const sizes = {
    md: "h-8 px-2 text-base ",
    lg: "h-12 px-3 text-lg ",
    xl: "h-16 px-4 text-xl ",
  };

  return props.href ? (
    <Link
      href={props.href}
      target={props.target}
      type={props.type}
      onClick={props.onClick}
      onMouseDown={props.onMouseDown}
      className={
        "flex items-center justify-center gap-2 transition disabled:pointer-events-none disabled:opacity-50 " +
        sizes[props.size] +
        (props.fill ? "w-full " : "") +
        (props.grouped ? "first:rounded-l last:rounded-r " : "rounded ") +
        variants[props.variant]
      }
    >
      {props.children}
    </Link>
  ) : (
    <button
      type={props.type}
      onClick={props.onClick}
      onMouseDown={props.onMouseDown}
      disabled={props.disabled}
      className={
        "flex items-center justify-center gap-2 transition disabled:pointer-events-none disabled:opacity-50 " +
        sizes[props.size] +
        (props.fill ? "w-full " : "") +
        (props.grouped ? "first:rounded-l last:rounded-r " : "rounded ") +
        variants[props.variant]
      }
    >
      {props.children}
    </button>
  );
};

export default Button;
