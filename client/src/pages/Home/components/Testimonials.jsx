import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import Eyebrow from "@/components/Eyebrow";

// ⚠️ Avis d'exemple pour la démo : remplacez-les par de vrais avis clients
// (Google Maps, Facebook…) avant de mettre le site en ligne.
const allTestimonials = [
  {
    id: 1,
    name: "Amina B.",
    role: "Mariée · Alger",
    rating: 5,
    text: "Nous avons choisi nos alliances et ma parure chez Ennour. Des conseils patients, la gravure faite sur place et un écrin magnifique.",
  },
  {
    id: 2,
    name: "Karim H.",
    role: "Client fidèle",
    rating: 5,
    text: "J'ai offert une chaîne à ma mère pour son anniversaire. Prix clair au gramme, aucune mauvaise surprise, et un emballage superbe.",
  },
  {
    id: 3,
    name: "Yasmine K.",
    role: "Blida",
    rating: 5,
    text: "Ma bague était trop grande : elle a été ajustée en moins d'une heure. Service rapide, accueil chaleureux, je recommande.",
  },
  {
    id: 4,
    name: "Sarah M.",
    role: "Cliente depuis 2019",
    rating: 5,
    text: "Une vraie bijouterie de confiance. J'y achète mes bijoux et ceux de mes filles, toujours avec le même sérieux.",
  },
  {
    id: 5,
    name: "Nadia T.",
    role: "Tipaza",
    rating: 5,
    text: "J'ai échangé mes anciens bijoux contre un bracelet moderne. Une estimation honnête et bien expliquée.",
  },
  {
    id: 6,
    name: "Rym L.",
    role: "Mariée · Oran",
    rating: 5,
    text: "Le coffret mariée est encore plus beau en vrai. Merci à toute l'équipe pour l'accueil et la patience !",
  },
];

const ITEMS_PER_PAGE = 3;

const Testimonials = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(allTestimonials.length / ITEMS_PER_PAGE);

  const currentTestimonials = allTestimonials.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE,
  );

  return (
    <section id="avis" className="py-20 lg:py-28 bg-dark border-t border-dark-foreground/5">
      <div className="wrapper">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <Eyebrow light>Avis clients</Eyebrow>
            <h2 className="font-display text-4xl lg:text-5xl font-semibold text-dark-foreground">
              Ce que disent
              <br />
              nos <em className="text-gold font-medium">clients</em>
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((page) => Math.max(0, page - 1))}
              disabled={currentPage === 0}
              aria-label="Avis précédents"
              className="w-10 h-10 rounded-full border border-dark-foreground/30 flex items-center justify-center text-dark-foreground/70 hover:text-dark-foreground hover:border-gold transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentPage((page) => Math.min(totalPages - 1, page + 1))}
              disabled={currentPage === totalPages - 1}
              aria-label="Avis suivants"
              className="w-10 h-10 rounded-full bg-dark-foreground text-dark flex items-center justify-center hover:bg-gold transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentTestimonials.map((testimonial) => (
            <figure
              key={testimonial.id}
              className="flex flex-col bg-dark-foreground/5 border border-dark-foreground/10 rounded-2xl p-6 animate-in fade-in duration-500"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4" aria-label={`${testimonial.rating} étoiles sur 5`}>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>

              {/* Text */}
              <blockquote className="text-dark-foreground/80 mb-6 leading-relaxed text-sm flex-1">
                « {testimonial.text} »
              </blockquote>

              {/* Author */}
              <figcaption className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-gold/15 text-gold font-display text-lg font-semibold flex items-center justify-center">
                  {testimonial.name.charAt(0)}
                </span>
                <div>
                  <p className="font-semibold text-dark-foreground text-sm">{testimonial.name}</p>
                  <p className="text-dark-foreground/60 text-xs">{testimonial.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              aria-label={`Page d'avis ${i + 1}`}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                currentPage === i ? "w-8 bg-gold" : "w-2 bg-dark-foreground/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
