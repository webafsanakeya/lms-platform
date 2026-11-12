import { cn } from "@/lib/utils";

export function Sticker({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block -rotate-3 border-2 border-ink bg-brand-yellow px-3 py-1 font-hand text-xl shadow-hard",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function NeoCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("rounded-2xl border-2 border-ink bg-white p-4 shadow-hard", className)}
    >
      {children}
      
    </div>
  );
}