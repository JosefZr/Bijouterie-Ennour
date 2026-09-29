import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Eyebrow from "@/components/Eyebrow";
import { WhatsappIcon } from "@/components/icons";
import { whatsappLink } from "@/config/site";

const faqs = [
  {
    question: "Vos bijoux sont-ils en or véritable ?",
    answer:
      "Oui. Toutes nos pièces sont en or 18 carats (750 ‰) et portent le poinçon officiel. Un certificat vous est remis à chaque achat.",
  },
  {
    question: "Comment est calculé le prix d'un bijou ?",
    answer:
      "Le prix dépend du poids en grammes, du cours de l'or du jour et du travail de la pièce. Envoyez-nous le modèle sur WhatsApp : nous vous répondons avec le prix exact.",
  },
  {
    question: "Pouvez-vous ajuster la taille d'une bague ?",
    answer:
      "Oui, la mise à taille est faite en boutique, le plus souvent le jour même. La gravure de prénoms ou de dates est aussi possible.",
  },
  {
    question: "Reprenez-vous l'ancien or ?",
    answer:
      "Oui. Apportez vos anciens bijoux : nous les estimons au cours du jour et vous pouvez les échanger contre une nouvelle pièce.",
  },
  {
    question: "Peut-on réserver un bijou à distance ?",
    answer:
      "Bien sûr. Écrivez-nous sur WhatsApp avec la photo du modèle : nous le mettons de côté et vous venez l'essayer en boutique.",
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="py-20 lg:py-28 bg-background">
      <div className="wrapper">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <Eyebrow>FAQ</Eyebrow>
            <h2 className="font-display text-4xl lg:text-5xl font-semibold text-foreground mb-4">
              Questions
              <br />
              <em className="text-gold-deep font-medium">fréquentes</em>
            </h2>
            <p className="text-muted-foreground max-w-md mb-8">
              Tout ce qu'il faut savoir avant de choisir votre bijou. Une autre question ? Écrivez-nous, nous
              répondons rapidement.
            </p>
            <Button asChild variant="dark" size="lg">
              <a
                href={whatsappLink("Bonjour Ennour, j'ai une question :")}
                target="_blank"
                rel="noreferrer"
              >
                <WhatsappIcon />
                Poser une question
              </a>
            </Button>
          </div>

          <Accordion type="single" collapsible defaultValue="item-0" className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={faq.question}
                value={`item-${index}`}
                className="bg-card border border-border rounded-2xl px-5 last:border-b data-[state=open]:border-gold/50"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-5 text-[15px]">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 text-sm leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
