import { GOOGLE_SCRIPT_URL } from "@/config/site";

export const isSheetConfigured = Boolean(GOOGLE_SCRIPT_URL);

// Envoie une vente au script Google Apps Script (même principe que le formulaire de contact du projet CM),
// mais on lit la réponse du script pour être sûr que la ligne a bien été ajoutée au Google Sheet.
export async function submitSale(payload) {
  if (!isSheetConfigured) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { result: "success", demo: true };
  }

  let response;
  try {
    // Corps « x-www-form-urlencoded » : pas de pré-requête CORS, et Apps Script le lit dans `e.parameter`.
    response = await fetch(GOOGLE_SCRIPT_URL, { method: "POST", body: new URLSearchParams(payload) });
  } catch {
    throw new Error("Impossible de joindre Google Sheets. Vérifiez la connexion internet puis réessayez.");
  }

  const data = await response.json().catch(() => null);
  if (!response.ok || !data) {
    throw new Error("Réponse inattendue de Google Sheets. Vérifiez que le script est déployé avec l'accès « Tout le monde ».");
  }
  if (data.result !== "success") {
    throw new Error(data.message || "La fiche n'a pas pu être enregistrée.");
  }
  return data;
}
