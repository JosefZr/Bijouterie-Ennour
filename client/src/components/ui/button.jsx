import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all cursor-pointer disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-[3px] focus-visible:ring-gold/50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        gold: "bg-gold text-dark hover:bg-gold-light",
        dark: "bg-dark text-dark-foreground hover:bg-dark/85",
        light: "bg-dark-foreground text-dark hover:bg-dark-foreground/90",
        outline: "border border-border bg-transparent text-foreground hover:bg-secondary",
        outlineLight:
          "border border-dark-foreground/30 bg-transparent text-dark-foreground hover:border-gold hover:text-gold",
        ghost: "text-foreground hover:bg-secondary",
        link: "text-gold-deep underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5",
        sm: "h-9 px-4 text-[13px]",
        lg: "h-12 px-7 text-[15px]",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({ className, variant = "default", size = "default", asChild = false, ...props }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants };
