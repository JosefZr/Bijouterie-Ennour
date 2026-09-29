import { useState } from "react";
import { ChevronLeft, ChevronRight, Diamond, Gem, Layers, Ruler, Scale, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Eyebrow from "@/components/Eyebrow";
import { WhatsappIcon } from "@/components/icons";
import { cn, img } from "@/lib/utils";
import { whatsappLink } from "@/config/site";

// Pièces mises en avant (équivalent du « Find Your Perfect Ride » du site auto).
const pieces = [
  {
    tab: "Parure",
    name: "Parure Nour",
    description: "Collier plastron et boucles assorties, sertis de pierres roses — la pièce phare de nos mariées.",
    image: "photo-1601121141461-9d6647bca1ed",
    specs: [
      { icon: Gem, label: "Or", value: "18 carats" },
      { icon: Scale, label: "Poids total", value: "≈ 42 g" },
      { icon: Diamond, label: "Pierres", value: "Roses" },
      { icon: Sparkles, label: "Finition", value: "Ciselée" },
    ],
  },
  {
    tab: "Sautoir",
    name: "Sautoir Médaille",
    description: "Un long collier à médaille ajourée, qui se porte seul ou en accumulation.",
    image: "photo-1601121141418-c1caa10a2a0b",
    specs: [
      { icon: Gem, label: "Or", value: "18 carats" },
      { icon: Scale, label: "Poids total", value: "≈ 28 g" },
      { icon: Ruler, label: "Longueur", value: "70 cm" },
      { icon: Sparkles, label: "Finition", value: "Filigrane" },
    ],
  },
  {
    tab: "Mariée",
    name: "Coffret Mariée",
    description: "Colliers, boucles et bracelets assortis : l'ensemble complet pour le grand jour.",
    image: "photo-1721807644561-9efcabee5c42",
    specs: [
      { icon: Gem, label: "Or", value: "18 carats" },
      { icon: Layers, label: "Pièces", value: "6 bijoux" },
      { icon: Diamond, label: "Pierres", value: "Multicolores" },
      { icon: Sparkles, label: "Finition", value: "Traditionnelle" },
    ],
  },
];

const Featured = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const piece = pieces[activeIndex];

  const go = (step) => setActiveIndex((index) => (index + step + pieces.length) % pieces.length);

  return (
    <section className="py-20 lg:py-28 bg-dark">
      <div className="wrapper">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <Eyebrow light>Coup de cœur</Eyebrow>
            <h2 className="font-display text-4xl lg:text-5xl font-semibold text-dark-foreground">
              La pièce du moment
            </h2>
          </div>
          <div className="flex items-center gap-4">
            {/* Tabs */}
            <div className="flex items-center gap-1 bg-dark-foreground/10 rounded-full p-1" role="tablist">
              {pieces.map((item, index) => (
                <button
                  key={item.tab}
                  role="tab"
                  aria-selected={activeIndex === index}
                  onClick={() => setActiveIndex(index)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                    activeIndex === index
                      ? "bg-dark-foreground text-dark"
                      : "text-dark-foreground/70 hover:text-dark-foreground"
                  }`}
                >
                  {item.tab}
                </button>
              ))}
            </div>
            {/* Flèches (masquées sur téléphone : les onglets suffisent) */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => go(-1)}
                aria-label="Pièce précédente"
                className="w-10 h-10 rounded-full border border-dark-foreground/30 flex items-center justify-center text-dark-foreground/70 hover:text-dark-foreground hover:border-gold transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => go(1)}
                aria-label="Pièce suivante"
                className="w-10 h-10 rounded-full bg-dark-foreground text-dark flex items-center justify-center hover:bg-gold transition-colors cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Image */}
          <div className="relative rounded-3xl overflow-hidden aspect-[4/3] md:aspect-[16/9] bg-dark-foreground/5">
            {/* Les 3 photos sont superposées : elles se chargent ensemble et le changement est instantané */}
            {pieces.map((item, index) => (
              <img
                key={item.image}
                src={img(item.image, { w: 1600, h: 900 })}
                alt={index === activeIndex ? item.name : ""}
                aria-hidden={index !== activeIndex}
                loading="lazy"
                className={cn(
                  "absolute inset-0 w-full h-full object-cover transition-opacity duration-700",
                  index === activeIndex ? "opacity-100" : "opacity-0",
                )}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/10 to-transparent" />
            <div key={piece.name} className="absolute bottom-0 left-0 p-6 lg:p-10 max-w-xl animate-in fade-in slide-in-from-bottom-2 duration-500">
              <p className="text-gold text-xs font-semibold tracking-[0.3em] mb-2">
                {String(activeIndex + 1).padStart(2, "0")} / {String(pieces.length).padStart(2, "0")}
              </p>
              <h3 className="font-display text-3xl lg:text-5xl font-semibold text-dark-foreground">{piece.name}</h3>
              <p className="hidden sm:block text-dark-foreground/75 text-sm lg:text-base mt-2">{piece.description}</p>
            </div>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {piece.specs.map((spec) => (
              <div
                key={spec.label}
                className="bg-dark-foreground/5 border border-dark-foreground/10 rounded-2xl p-5 text-center"
              >
                <div className="w-12 h-12 bg-gold/15 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <spec.icon className="w-6 h-6 text-gold" />
                </div>
                <p className="font-display text-2xl font-semibold text-dark-foreground mb-1">{spec.value}</p>
                <p className="text-dark-foreground/60 text-sm">{spec.label}</p>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-8">
            <Button asChild variant="gold" size="lg" className="px-8">
              <a
                href={whatsappLink(`Bonjour Ennour, la « ${piece.name} » est-elle disponible ?`)}
                target="_blank"
                rel="noreferrer"
              >
                <WhatsappIcon />
                Réserver sur WhatsApp
              </a>
            </Button>
            <Button asChild variant="outlineLight" size="lg" className="px-8">
              <a href="#collections">Voir la collection</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Featured;
