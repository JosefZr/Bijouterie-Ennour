import { Clock, MapPin, Phone, Store } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import { FacebookIcon, InstagramIcon, TiktokIcon, WhatsappIcon } from "@/components/icons";
import { phoneLink, site, whatsappLink } from "@/config/site";

const footerLinks = {
  Navigation: [
    { name: "Accueil", href: "#accueil" },
    { name: "Collections", href: "#collections" },
    { name: "Savoir-faire", href: "#savoir-faire" },
    { name: "Avis clients", href: "#avis" },
    { name: "FAQ", href: "#faq" },
  ],
  Collections: [
    { name: "Bagues & alliances", href: "#collections" },
    { name: "Colliers & chaînes", href: "#collections" },
    { name: "Bracelets", href: "#collections" },
    { name: "Boucles d'oreilles", href: "#collections" },
    { name: "Parures de mariée", href: "#collections" },
  ],
};

const socialLinks = [
  { icon: FacebookIcon, href: site.socials.facebook, label: "Facebook" },
  { icon: InstagramIcon, href: site.socials.instagram, label: "Instagram" },
  { icon: TiktokIcon, href: site.socials.tiktok, label: "TikTok" },
  { icon: WhatsappIcon, href: whatsappLink(), label: "WhatsApp" },
];

const contactItems = [
  { icon: MapPin, value: site.address, href: site.mapsUrl },
  { icon: Phone, value: site.phoneDisplay, href: phoneLink },
  { icon: Clock, value: site.hours },
];

const Footer = () => {
  return (
    <footer id="contact" className="bg-dark pt-16 pb-8">
      <div className="wrapper">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#accueil" className="inline-block mb-5" aria-label="Bijouterie Ennour — accueil">
              <Logo />
            </a>
            <p className="text-dark-foreground/50 text-sm mb-5 max-w-xs">
              Bijoux en or 18 carats, alliances et parures de mariée. Choisis avec soin, ajustés sur place,
              remis dans leur écrin.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg bg-dark-foreground/10 flex items-center justify-center text-dark-foreground/60 hover:bg-gold hover:text-dark transition-all"
                >
                  <social.icon />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-dark-foreground font-semibold mb-4 text-sm">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-dark-foreground/50 hover:text-gold transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h4 className="text-dark-foreground font-semibold mb-4 text-sm">Boutique</h4>
            <ul className="space-y-3">
              {contactItems.map((item) => {
                const content = (
                  <>
                    <item.icon className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                    <span>{item.value}</span>
                  </>
                );
                return (
                  <li key={item.value} className="text-dark-foreground/50 text-sm">
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel="noreferrer"
                        className="flex items-start gap-2.5 hover:text-gold transition-colors"
                      >
                        {content}
                      </a>
                    ) : (
                      <span className="flex items-start gap-2.5">{content}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Large Brand Text */}
        <div className="relative overflow-hidden pt-4">
          <p
            aria-hidden="true"
            className="font-display text-[26vw] lg:text-[240px] font-semibold text-dark-foreground/[0.05] text-center leading-[0.8] select-none tracking-wide"
          >
            {site.name}
          </p>
        </div>

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 mt-6 border-t border-dark-foreground/10">
          <p className="text-dark-foreground/40 text-xs">
            © {new Date().getFullYear()} {site.fullName} — <span className="font-arabic text-sm">{site.nameAr}</span>.
            Tous droits réservés.
          </p>
          <Link
            to="/fiche-client"
            className="inline-flex items-center gap-1.5 text-dark-foreground/40 hover:text-gold transition-colors text-xs"
          >
            <Store className="w-3.5 h-3.5" />
            Espace boutique
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
