import Eyebrow from "@/components/Eyebrow";

// Chiffres d'exemple : à remplacer par ceux de la boutique.
const stats = [
  {
    value: "18K",
    label: "OR POINÇONNÉ",
    description: "Toutes nos pièces sont en or 18 carats, contrôlées et poinçonnées.",
  },
  {
    value: "+500",
    label: "MODÈLES EN VITRINE",
    description: "Bagues, alliances, colliers, bracelets et parures renouvelés chaque saison.",
  },
  {
    value: "15 ans",
    label: "DE CONFIANCE",
    description: "Des familles nous confient leurs plus beaux moments, de génération en génération.",
  },
];

const Stats = () => {
  return (
    <section className="pt-20 pb-4 lg:pt-28 lg:pb-8 bg-background">
      <div className="wrapper">
        <div className="text-center mb-14">
          <Eyebrow center>Pourquoi Ennour</Eyebrow>
          <h2 className="font-display text-4xl lg:text-5xl font-semibold text-foreground">
            Une bijouterie de <em className="text-gold-deep font-medium">confiance</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-0 max-w-5xl mx-auto md:divide-x divide-border">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center md:px-8">
              <p className="font-display text-6xl lg:text-7xl font-semibold text-foreground mb-2">{stat.value}</p>
              <h3 className="text-xs font-semibold text-gold-deep mb-3 tracking-[0.2em]">{stat.label}</h3>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
