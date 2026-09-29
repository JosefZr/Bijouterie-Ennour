import { Clock, MapPin, Navigation, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsappIcon } from "@/components/icons";
import { img } from "@/lib/utils";
import { phoneLink, site, whatsappLink } from "@/config/site";

const HERO_IMAGE = "photo-1600862754152-80a263dd564f";

const infos = [
  { icon: MapPin, label: "Adresse", value: site.address, href: site.mapsUrl },
  { icon: Clock, label: "Horaires", value: site.hours },
  { icon: Phone, label: "Téléphone", value: site.phoneDisplay, href: phoneLink },
];

const InfoTile = ({ icon: Icon, label, value, href }) => {
  const Tag = href ? "a" : "div";
  const linkProps = href?.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {};

  return (
    <Tag
      href={href}
      {...linkProps}
      className="flex items-center gap-3 p-3 bg-secondary rounded-xl min-w-0 transition-colors hover:bg-secondary/70"
    >
      <Icon className="w-5 h-5 text-gold-deep shrink-0" />
      <div className="min-w-0 text-left">
        <p className="text-muted-foreground text-xs">{label}</p>
        <p className="text-foreground font-semibold text-sm truncate">{value}</p>
      </div>
    </Tag>
  );
};

const Hero = () => {
  return (
    <section id="accueil" className="relative min-h-screen bg-dark overflow-hidden pt-20">
      {/* Background Image — calée à droite sur grand écran pour laisser le texte sur fond noir */}
      <div className="absolute inset-0 lg:left-[30%]">
        <img
          src={img(HERO_IMAGE, { w: 2000 })}
          alt="Collier plastron et boucles d'oreilles en or exposés sur un buste noir"
          fetchPriority="high"
          className="w-full h-full object-cover object-[65%_center] opacity-45 lg:opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-dark/40" />
      </div>

      {/* Content */}
      <div className="relative wrapper py-14 lg:py-24">
        <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
          <p className="flex items-center gap-3 text-gold text-[11px] font-semibold uppercase tracking-[0.32em] mb-6">
            <span className="h-px w-10 bg-gold/70" />
            Bijouterie
            <span className="font-arabic text-2xl normal-case tracking-normal leading-none">{site.nameAr}</span>
          </p>

          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold text-dark-foreground leading-[1.02] mb-6">
            L'éclat de l'or,
            <br />
            <em className="text-gold font-medium">la lumière</em> de vos moments.
          </h1>

          <p className="text-dark-foreground/70 text-base md:text-lg mb-9 max-w-lg">
            Bagues, alliances, colliers et parures en or 18 carats — choisis avec soin et ajustés sur place
            dans notre boutique.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button asChild variant="gold" size="lg">
              <a href="#collections">Découvrir la collection</a>
            </Button>
            <Button asChild variant="outlineLight" size="lg">
              <a
                href={whatsappLink("Bonjour Ennour, je souhaite des informations sur vos bijoux.")}
                target="_blank"
                rel="noreferrer"
              >
                <WhatsappIcon />
                Écrire sur WhatsApp
              </a>
            </Button>
          </div>
        </div>

        {/* Infos boutique (à la place du formulaire de recherche du site auto) */}
        <div className="mt-14 lg:mt-24">
          <div className="bg-dark-foreground rounded-2xl p-3 lg:p-4 max-w-4xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {infos.map((info) => (
                <InfoTile key={info.label} {...info} />
              ))}
              <Button asChild variant="dark" className="h-full min-h-[60px] rounded-xl">
                <a href={site.mapsUrl} target="_blank" rel="noreferrer">
                  <Navigation />
                  Itinéraire
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
