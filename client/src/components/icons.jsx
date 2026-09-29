import { cn } from "@/lib/utils";

// Icônes de marques (lucide-react ne les fournit plus depuis la v1).
const BrandIcon = ({ className, children, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={cn("size-4", className)}
    {...props}
  >
    {children}
  </svg>
);

export const FacebookIcon = (props) => (
  <BrandIcon {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </BrandIcon>
);

export const InstagramIcon = (props) => (
  <BrandIcon {...props}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <path d="M17.5 6.5h.01" />
  </BrandIcon>
);

export const TiktokIcon = (props) => (
  <BrandIcon {...props}>
    <path d="M9 12a4 4 0 1 0 4 4V3c.5 2.6 2.6 4.6 5.5 4.8" />
  </BrandIcon>
);

export const WhatsappIcon = (props) => (
  <BrandIcon {...props}>
    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
    <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
  </BrandIcon>
);
