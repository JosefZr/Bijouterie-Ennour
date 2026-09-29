import { BadgeCheck, Gift, RefreshCw, Ruler } from "lucide-react";
import Eyebrow from "@/components/Eyebrow";

const features = [
  {
    icon: BadgeCheck,
    title: "Or 18 carats poinçonné",
    description: "Chaque bijou est contrôlé et porte le poinçon officiel. Certificat remis à l'achat.",
  },
  {
    icon: Ruler,
    title: "Mise à taille & gravure",
    description: "Bagues ajustées sur place, prénoms et dates gravés pour un bijou unique.",
  },
  {
    icon: RefreshCw,
    title: "Reprise de votre or",
    description: "Échangez vos anciens bijoux contre une nouvelle pièce, estimés au cours du jour.",
  },
  {
    icon: Gift,
    title: "Écrin offert",
    description: "Chaque bijou est remis dans un écrin élégant, prêt à être offert.",
  },
];

const Features = () => {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="wrapper">
        <div className="text-center mb-16">
          <Eyebrow center>Nos engagements</Eyebrow>
          <h2 className="font-display text-4xl lg:text-5xl font-semibold text-foreground mb-4">
            Le soin du détail,
            <br />
            <em className="text-gold-deep font-medium">de la vitrine à l'écrin.</em>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Plus qu'une bijouterie : un accompagnement à chaque étape, du choix du modèle à l'entretien de vos
            bijoux.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-6 bg-card rounded-2xl border border-border hover:border-gold/50 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-gold/15 rounded-xl flex items-center justify-center mb-5 group-hover:bg-gold group-hover:scale-110 transition-all duration-300">
                <feature.icon className="w-7 h-7 text-gold-deep group-hover:text-dark transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
