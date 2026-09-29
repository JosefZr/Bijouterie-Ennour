import Eyebrow from "@/components/Eyebrow";
import { img } from "@/lib/utils";

const steps = [
  {
    number: "01",
    title: "Choisissez votre bijou",
    description:
      "Parcourez nos vitrines en boutique ou nos nouveautés sur Instagram. Nous vous conseillons selon l'occasion et votre budget.",
    image: "photo-1650389236412-e7413cbcf2fe",
  },
  {
    number: "02",
    title: "Essayez-le en boutique",
    description:
      "Prenez le temps d'essayer et de comparer : poids, finition, confort… tout se décide sur place, sans pression.",
    image: "photo-1698495386518-5e21688bc27b",
  },
  {
    number: "03",
    title: "Ajustement & gravure",
    description:
      "Notre bijoutier met la bague à votre taille et grave prénoms ou dates, souvent le jour même.",
    image: "photo-1516652695352-6118f7cc1a07",
  },
  {
    number: "04",
    title: "Repartez avec votre écrin",
    description:
      "Votre bijou vous est remis dans son écrin avec son certificat — et nous restons là pour son entretien.",
    image: "photo-1584115838497-f317f7455abe",
  },
];

const Process = () => {
  return (
    <section id="savoir-faire" className="py-20 lg:py-28 bg-secondary/50">
      <div className="wrapper">
        <div className="text-center mb-16">
          <Eyebrow center>Savoir-faire</Eyebrow>
          <h2 className="font-display text-4xl lg:text-5xl font-semibold text-foreground">
            Votre bijou, <em className="text-gold-deep font-medium">étape par étape</em>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Du premier regard en vitrine jusqu'à l'écrin, nous vous accompagnons comme en famille.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Vertical Line */}
              {index < steps.length - 1 && (
                <div className="absolute left-[27px] top-16 bottom-0 w-px bg-gold/40" />
              )}

              <div className={`flex items-start gap-8 ${index < steps.length - 1 ? "pb-12" : ""}`}>
                {/* Number Circle & Content */}
                <div className="flex items-start gap-6 flex-1">
                  <div className="relative z-10 w-14 h-14 bg-foreground rounded-full flex items-center justify-center shrink-0 ring-4 ring-background">
                    <span className="text-gold font-bold">{step.number}</span>
                  </div>
                  <div className="pt-3">
                    <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-sm max-w-md">{step.description}</p>
                  </div>
                </div>

                {/* Image */}
                <div className="w-52 h-36 rounded-2xl overflow-hidden shrink-0 hidden md:block shadow-sm">
                  <img
                    src={img(step.image, { w: 520, h: 360 })}
                    alt={step.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
