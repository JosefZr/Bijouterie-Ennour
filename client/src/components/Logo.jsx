import { Gem } from "lucide-react";
import { site } from "@/config/site";
import { cn } from "@/lib/utils";

const Logo = ({ className }) => (
  <span className={cn("flex items-center gap-2.5", className)}>
    <span className="w-9 h-9 bg-gold rounded-lg flex items-center justify-center shrink-0">
      <Gem className="w-5 h-5 text-dark" strokeWidth={2.2} />
    </span>
    <span className="flex flex-col text-left leading-none">
      <span className="font-display text-[26px] font-semibold tracking-wide text-dark-foreground">
        {site.name}
      </span>
      <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.42em] text-gold">
        Bijouterie
      </span>
    </span>
  </span>
);

export default Logo;
