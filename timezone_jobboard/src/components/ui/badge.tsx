import { cn } from "@/lib/utils";

export function Badge({
  className,
  children,
  variant = "default",
}: {
  className?: string;
  children: React.ReactNode;
  variant?: "default" | "teal" | "signal" | "outline";
}) {
  const styles = {
    default: "bg-ink-line/70 text-paper",
    teal: "bg-teal-soft text-teal border border-teal/40",
    signal: "bg-signal/15 text-signal border border-signal/40",
    outline: "border border-ink-line text-muted",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-mono tracking-tight",
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}