import { cn } from "@/lib/utils/cn";

interface LoaderProps {
  className?: string;
  size?: number;
}

export default function Loader({ className, size = 24 }: LoaderProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={cn("animate-spin", className)}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeOpacity={0.15}
        strokeWidth="3"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="#FFE135"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
