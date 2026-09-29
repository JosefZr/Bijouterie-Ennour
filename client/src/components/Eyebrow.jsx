import { cn } from "@/lib/utils";

// Petit sur-titre doré au-dessus des titres de section.
const Eyebrow = ({ children, light = false, center = false, className }) => {
  const line = cn("h-px w-8", light ? "bg-gold/70" : "bg-gold-deep/50");

  return (
    <p
      className={cn(
        "mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em]",
        light ? "text-gold" : "text-gold-deep",
        center && "justify-center",
        className,
      )}
    >
      <span className={line} />
      {children}
      {center && <span className={line} />}
    </p>
  );
};

export default Eyebrow;
