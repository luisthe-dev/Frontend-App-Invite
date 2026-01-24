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
      primary:
        "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm border border-transparent",
      secondary:
        "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-transparent",
      outline:
        "bg-background text-foreground border border-input hover:bg-accent hover:text-accent-foreground",
      ghost:
        "bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground border border-transparent",
      danger:
        "bg-destructive text-destructive-foreground hover:bg-destructive/90 border border-transparent",
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
          "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring/20 active:scale-[0.98]",
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
