import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-phosphene-gold text-black font-semibold hover:brightness-110 active:brightness-95 shadow-[0_0_24px_rgba(255,225,53,0.25)]",
  secondary:
    "bg-white/[0.06] backdrop-blur-md border border-white/[0.08] text-white hover:bg-white/[0.1] active:bg-white/[0.04]",
  ghost:
    "bg-transparent text-white/70 hover:text-white hover:bg-white/[0.05] active:bg-white/[0.03]",
};

const sizeStyles: Record<Size, string> = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-md",
  md: "h-10 px-5 text-sm gap-2 rounded-lg",
  lg: "h-12 px-7 text-base gap-2.5 rounded-lg",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center font-sans transition-colors duration-150 cursor-pointer select-none disabled:opacity-40 disabled:pointer-events-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
);

Button.displayName = "Button";
export default Button;
