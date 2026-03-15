import * as React from "react";

import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "outline";
  size?: "sm" | "default" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variants = {
      default:
        "bg-primary text-primary-foreground hover:bg-primary/90 text-white",
      ghost: "hover:bg-zinc-900 text-zinc-200 hover:text-white",
      outline: "border border-zinc-800 hover:bg-zinc-900 text-zinc-200",
    };

    const sizes = {
      sm: "h-9 rounded-md px-3 text-sm",
      default: "h-10 px-4 py-2 text-sm",
      lg: "h-11 rounded-md px-8 text-lg",
      icon: "h-10 w-10 rounded-md",
    };

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
          variants[variant],
          sizes[size],
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };
