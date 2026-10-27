import { Search } from "lucide-react";
import { cn } from "@/lib/cn";

export function SearchInput({
  value,
  onChange,
  placeholder,
  className,
  id,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  className?: string;
  id?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <Search
        className="pointer-events-none absolute left-0 top-1/2 size-4 -translate-y-1/2 text-text-muted"
        aria-hidden
      />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border-0 border-b border-border bg-transparent py-2 pl-7 pr-2 text-sm text-text-primary placeholder:text-text-muted transition focus:border-accent focus:outline-none"
      />
    </div>
  );
}
