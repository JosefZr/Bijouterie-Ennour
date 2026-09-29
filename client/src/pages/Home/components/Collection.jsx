import { useState } from "react";
import { ArrowUpRight, Diamond, Scale, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Eyebrow from "@/components/Eyebrow";
import { InstagramIcon, WhatsappIcon } from "@/components/icons";
import { categories, products } from "@/data/products";
import { img } from "@/lib/utils";
import { site, whatsappLink } from "@/config/site";

const Collection = () => {
  const [activeCategory, setActiveCategory] = useState("Tout");

  const visibleProducts =
    activeCategory === "Tout" ? products : products.filter((product) => product.category === activeCategory);

  return (
    <section id="collections" className="py-20 lg:py-28 bg-background">
      <div className="wrapper">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <Eyebrow>Collections</Eyebrow>
            <h2 className="font-display text-4xl lg:text-5xl font-semibold text-foreground">
              Explorez nos
              <br />
              <em className="text-gold-deep font-medium">créations</em>
            </h2>
          </div>
          <a
            href={site.socials.instagram}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <InstagramIcon className="size-5 text-gold-deep" />
            Nouveautés chaque semaine sur Instagram
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-10" role="group" aria-label="Filtrer par catégorie">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              aria-pressed={activeCategory === category}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
                activeCategory === category
                  ? "bg-foreground text-background"
                  : "bg-secondary text-foreground hover:bg-gold/20"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Jewelry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleProducts.map((product) => (
            <article
              key={product.id}
              className="flex flex-col bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:border-gold/40 transition-all duration-300 group animate-in fade-in"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                <img
                  src={img(product.image, { w: 800, h: 600 })}
                  alt={product.alt}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-3 py-1 bg-background/85 backdrop-blur-sm rounded-full text-xs font-medium">
                    {product.category}
                  </span>
                  <span className="px-3 py-1 bg-gold text-dark rounded-full text-xs font-semibold">Or 18K</span>
                </div>
              </div>

              <div className="flex flex-col flex-1 p-5">
                <h3 className="text-lg font-semibold text-foreground mb-4">{product.name}</h3>
                <div className="flex flex-wrap gap-x-5 gap-y-2 mb-5">
                  <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                    <Scale className="w-4 h-4 shrink-0" />
                    <span>{product.weight}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                    <Diamond className="w-4 h-4 shrink-0" />
                    <span>{product.stone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span>{product.finish}</span>
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-between gap-3 pt-4 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground">Prix</p>
                    <p className="text-sm font-semibold text-foreground">Selon le cours du jour</p>
                  </div>
                  <Button asChild variant="dark" size="sm">
                    <a
                      href={whatsappLink(
                        `Bonjour Ennour, je suis intéressé(e) par « ${product.name} ». Pouvez-vous m'indiquer le prix ?`,
                      )}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <WhatsappIcon />
                      Demander
                    </a>
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-12">
          <Button asChild variant="dark" size="lg" className="px-8">
            <a href={site.socials.instagram} target="_blank" rel="noreferrer">
              <InstagramIcon />
              Voir toute la collection
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Collection;
