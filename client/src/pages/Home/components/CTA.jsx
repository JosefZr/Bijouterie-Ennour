import { Clock, MapPin, Navigation, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import Eyebrow from "@/components/Eyebrow";
import { img } from "@/lib/utils";
import { phoneLink, site } from "@/config/site";

const CTA = () => {
  return (
    <section className="py-16 lg:py-20 bg-dark">
      <div className="wrapper">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={img("photo-1717409014701-8e630ff057f3", { w: 1800 })}
              alt="Bracelets et bagues en or exposés en vitrine"
              loading="lazy"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-dark/95 via-dark/75 to-dark/10" />
          </div>

          {/* Content */}
          <div className="relative z-10 py-16 lg:py-24 px-6 sm:px-8 lg:px-16">
            <div className="max-w-lg">
              <Eyebrow light>Visitez-nous</Eyebrow>
              <h2 className="font-display text-4xl lg:text-5xl font-semibold text-dark-foreground mb-4">
                Venez les essayer,
                <br />
                <em className="text-gold font-medium">en boutique.</em>
              </h2>
              <p className="text-dark-foreground/75 mb-6">
                Un bijou se choisit à la lumière, au creux de la main. Passez nous voir : nous prendrons le temps
                de vous conseiller.
              </p>
              <ul className="flex flex-col sm:flex-row sm:flex-wrap gap-x-6 gap-y-2 text-sm text-dark-foreground/80 mb-8">
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gold" />
                  {site.address}
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gold" />
                  {site.hours}
                </li>
              </ul>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="gold" size="lg" className="px-8">
                  <a href={site.mapsUrl} target="_blank" rel="noreferrer">
                    <Navigation />
                    Itinéraire
                  </a>
                </Button>
                <Button asChild variant="outlineLight" size="lg" className="px-8">
                  <a href={phoneLink}>
                    <Phone />
                    Appeler
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
