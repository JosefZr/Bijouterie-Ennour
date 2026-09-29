// Chiffres arabes (٠١٢…) ou persans (۰۱۲…) → 0-9 : certains claviers de téléphone les tapent.
// (U+0660 et U+06F0 sont des multiples de 16, donc « code % 16 » donne le chiffre.)
export const toLatinDigits = (text) =>
  String(text).replace(/[٠-٩۰-۹]/g, (digit) => String(digit.charCodeAt(0) % 16));

// Numéro de téléphone au format international sans « + » (ex : 213555123456), ou null s'il est invalide.
// Accepte « 0555 12 34 56 », « 555123456 », « +213 555… », « +213 0555… », « 00213… »
// et les numéros étrangers (+33…).
export function normalizePhone(raw) {
  const input = toLatinDigits(raw).trim();
  let digits = input.replace(/\D/g, "");
  if (!digits) return null;

  if (!input.startsWith("+")) {
    if (digits.startsWith("00")) digits = digits.slice(2);
    else if (digits.startsWith("0")) digits = `213${digits.slice(1)}`;
    else if (digits.length === 9) digits = `213${digits}`;
  }

  // « +213 0555… » : le 0 du numéro local est souvent gardé après l'indicatif.
  if (digits.startsWith("2130")) digits = `213${digits.slice(4)}`;

  // Algérie : uniquement les mobiles (05, 06, 07) — ce sont eux que Meta sait associer à un compte.
  if (digits.startsWith("213")) return /^213[567]\d{8}$/.test(digits) ? digits : null;
  return digits.length >= 8 && digits.length <= 15 ? digits : null;
}

// 213555123456 → « 0555 12 34 56 » ; numéro étranger → « +33612345678 ».
export function formatPhone(digits) {
  if (/^213\d{9}$/.test(digits)) {
    return `0${digits.slice(3)}`.replace(/^(\d{4})(\d{2})(\d{2})(\d{2})$/, "$1 $2 $3 $4");
  }
  return `+${digits}`;
}

const amountFormatter = new Intl.NumberFormat("fr-FR");

// « 85000 » → « 85 000 »
export const formatAmount = (digits) => (digits ? amountFormatter.format(Number(digits)) : "");

// Date locale au format AAAA-MM-JJ (valeur d'un <input type="date">).
export function toISODate(date) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

// « 2026-09-28 » → « 28/09/2026 »
export const formatDate = (iso) => iso.split("-").reverse().join("/");
