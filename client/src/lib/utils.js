import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Les photos de démo viennent d'Unsplash (licence gratuite). Pour utiliser les
// vraies photos de la boutique, mettez-les dans `public/images/` et remplacez
// l'identifiant « photo-… » par le chemin, ex : "/images/bague-solitaire.jpg".
export function img(src, { w = 1200, h, q = 75 } = {}) {
  if (!src.startsWith("photo-")) return src;

  const params = new URLSearchParams({ w: String(w), q: String(q), auto: "format", fit: "crop" });
  if (h) params.set("h", String(h));
  return `https://images.unsplash.com/${src}?${params}`;
}
