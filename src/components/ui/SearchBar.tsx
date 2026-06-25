import { forwardRef, type InputHTMLAttributes } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface SearchBarProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  ({ value, onChange, placeholder = "Search…", className, ...props }, ref) => (
    <div
      className={cn(
        "relative flex items-center h-10 rounded-lg bg-white/[0.04] backdrop-blur-md border border-white/[0.08] transition-colors duration-150 focus-within:border-phosphene-gold/40 focus-within:shadow-[0_0_20px_rgba(255,225,53,0.06)]",
        className
      )}
    >
      <Search className="absolute left-3 w-4 h-4 text-white/30 pointer-events-none" />
      <input
        ref={ref}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-full bg-transparent pl-9 pr-3 text-sm text-white placeholder:text-white/25 outline-none font-sans"
        {...props}
      />
    </div>
  )
);

SearchBar.displayName = "SearchBar";
export default SearchBar;
