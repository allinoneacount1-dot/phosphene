import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ glow = false, className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.06]",
        glow && "shadow-[0_0_40px_rgba(255,225,53,0.08)] border-phosphene-gold/20",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);

GlassCard.displayName = "GlassCard";
export default GlassCard;
