import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-display tracking-wide font-medium transition-[transform,background-color,opacity] duration-150 ease-out active:not-disabled:scale-[0.96] disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
  {
    variants: {
      variant: {
        primary: "bg-accent text-accent-fg hover:bg-accent/90",
        ghost: "bg-transparent text-fg/90 hover:bg-surface-2",
        outline: "border border-border bg-surface text-fg hover:bg-surface-2",
        quiet: "border border-border bg-transparent text-muted hover:text-fg hover:bg-surface-2",
      },
      size: {
        sm: "h-9 px-3 rounded-sm text-xs",
        md: "h-11 px-4 rounded-md text-sm",
        lg: "h-12 px-5 rounded-md text-sm",
        icon: "size-11 rounded-md",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export function Button({
  className,
  variant,
  size,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>) {
  return (
    <button type={type} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}
