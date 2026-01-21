import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, children, disabled, ...props }, ref) => {
    const variants = {
      primary: "bg-violet-600 text-white hover:bg-violet-700 shadow-sm shadow-violet-200 border border-transparent",
      secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 border border-transparent",
      outline: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300",
      ghost: "bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent",
      danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-transparent",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-6 text-base",
    };

    return (
      <button
        ref={ref}
        disabled={loading || disabled}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 active:scale-[0.98]",
          variants[variant],
          sizes[size],
          (loading || disabled) && "opacity-50 cursor-not-allowed pointer-events-none",
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
