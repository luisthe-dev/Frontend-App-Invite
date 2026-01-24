import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  noPadding?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, noPadding = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-card text-card-foreground rounded-xl border border-border shadow-sm overflow-hidden",
          className,
        )}
        {...props}
      >
        <div className={cn(noPadding ? "p-0" : "p-6")}>{children}</div>
      </div>
    );
  }
);

Card.displayName = "Card";

export const CardHeader = ({
  className,
  children,
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "px-6 py-4 border-b border-border flex items-center justify-between",
      className,
    )}
  >
    {children}
  </div>
);

export const CardTitle = ({
  className,
  children,
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    className={cn(
      "text-lg font-bold text-foreground",
      className,
    )}
  >
    {children}
  </h3>
);
