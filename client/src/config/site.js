// ─────────────────────────────────────────────────────────────
//  Infos de la boutique — modifiez ici, tout le site se met à jour.
//  Les valeurs avec des « X » sont à remplacer avant la démo.
// ─────────────────────────────────────────────────────────────

export const site = {
  name: "Ennour",
  fullName: "Bijouterie Ennour",
  nameAr: "النور",

  // Numéro WhatsApp / téléphone au format international, chiffres uniquement.
  // Ex : 0555 12 34 56  →  "213555123456"
  phone: "2135XXXXXXXX",
  phoneDisplay: "05 XX XX XX XX",

  address: "Centre-ville, Algérie",
  hours: "Sam – Jeu · 9h – 19h",

  // Lien Google Maps de la boutique (bouton « Itinéraire »).
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Bijouterie+Ennour",

  socials: {
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com/",
    tiktok: "https://www.tiktok.com/",
  },

  // Wilaya présélectionnée dans la fiche client (ex : "Alger"). Vide = aucune.
  defaultWilaya: "",
};

// URL « /exec » du script Google Apps Script (voir google-apps-script/Code.gs).
// Tant qu'elle est vide, la fiche client fonctionne en mode démo : rien n'est envoyé.
export const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbx208rBH1weOAAvxQJh7coNl2MLq8tcJu3Ym2N__Hjmzy153mXBO4qf-qbNg8HgoSyjpA/exec";

export const whatsappLink = (text) =>
  `https://wa.me/${site.phone}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export const phoneLink = `tel:+${site.phone}`;
