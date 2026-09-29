import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { WhatsappIcon } from "@/components/icons";
import { whatsappLink } from "@/config/site";

const navLinks = [
  { name: "Accueil", id: "accueil" },
  { name: "Collections", id: "collections" },
  { name: "Savoir-faire", id: "savoir-faire" },
  { name: "Avis", id: "avis" },
  { name: "FAQ", id: "faq" },
];

const contactHref = whatsappLink("Bonjour Ennour, je souhaite avoir des informations.");

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState("accueil");

  // Met en surbrillance le lien de la section visible à l'écran.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );

    navLinks.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark/90 backdrop-blur-md border-b border-dark-foreground/5">
      <div className="wrapper">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <a href="#accueil" aria-label="Bijouterie Ennour — accueil">
            <Logo />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 bg-dark-foreground/10 rounded-full px-2 py-1.5">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                aria-current={active === link.id ? "true" : undefined}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  active === link.id
                    ? "bg-dark-foreground text-dark"
                    : "text-dark-foreground/70 hover:text-dark-foreground"
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center">
            <Button asChild variant="outlineLight" size="sm" className="px-5">
              <a href={contactHref} target="_blank" rel="noreferrer">
                <WhatsappIcon />
                Nous écrire
              </a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-dark-foreground p-2 -mr-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-dark-foreground/10">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    active === link.id
                      ? "bg-dark-foreground/10 text-gold"
                      : "text-dark-foreground/70 hover:text-dark-foreground"
                  }`}
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 mt-2 border-t border-dark-foreground/10">
                <Button asChild variant="gold" className="w-full">
                  <a href={contactHref} target="_blank" rel="noreferrer">
                    <WhatsappIcon />
                    Nous écrire sur WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
