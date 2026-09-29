/**
 * Bijouterie Ennour — Fiche client → Google Sheets → export Meta (événements hors ligne)
 *
 * 1. Le formulaire /fiche-client envoie chaque vente ici (doPost) → ajoutée à l'onglet « Ventes ».
 * 2. Menu « Meta Ads » → « Préparer l'export » → onglet « Export Meta » au format attendu par Meta,
 *    avec uniquement les nouvelles ventes. Fichier → Télécharger → CSV, puis import dans Events Manager.
 *
 * Installation : voir README.md (section « Brancher Google Sheets »).
 */

const SHEET_NAME = 'Ventes';
const EXPORT_SHEET_NAME = 'Export Meta';
const CURRENCY = 'DZD';
const COUNTRY = 'dz';
const ABROAD = 'Hors Algérie';
const META_MAX_AGE_DAYS = 62; // Meta refuse les ventes en boutique de plus de 62 jours.

const HEADERS = [
  "Date d'achat", 'N° fiche', 'Prénom', 'Nom', 'Téléphone', 'Email', 'Genre',
  'Wilaya', 'Article', 'Montant (DA)', 'Consentement', 'Enregistré le', 'Export Meta',
];
const COL = {};
HEADERS.forEach((header, index) => (COL[header] = index + 1)); // n° de colonne (1 = A)

// Colonnes reconnues automatiquement par l'import de fichier de Meta.
const META_HEADERS = [
  'event_name', 'event_time', 'action_source', 'order_id', 'value', 'currency',
  'phone', 'email', 'fn', 'ln', 'gen', 'ct', 'st', 'country', 'content_category',
];

/* ─────────────────────────── Installation ─────────────────────────── */

// À lancer une fois depuis l'éditeur : crée l'onglet « Ventes » et demande les autorisations.
function setup() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', spreadsheet.getId());
  getSalesSheet_();
  spreadsheet.toast('Onglet « Ventes » prêt. Vous pouvez déployer le script.', 'Ennour', 8);
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Meta Ads')
    .addItem("Préparer l'export des nouvelles ventes", 'prepareMetaExport')
    .addToUi();
}

/* ─────────────────────── Réception du formulaire ─────────────────────── */

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000); // plusieurs vendeurs peuvent envoyer en même temps

    const p = (e && e.parameter) || {};
    const firstName = clean_(p.first_name);
    const lastName = clean_(p.last_name);
    const phone = String(p.phone || '').replace(/\D/g, '');
    const value = Number(String(p.value || '').replace(/\D/g, ''));
    const category = clean_(p.category);

    if (!firstName || !lastName || phone.length < 8 || !value || !category) {
      return json_({ result: 'error', message: 'Champs obligatoires manquants.' });
    }

    const sheet = getSalesSheet_();
    const orderId = clean_(p.order_id) || 'EN-' + Utilities.getUuid().slice(0, 8).toUpperCase();

    // Même fiche reçue deux fois (double clic, nouvel essai après une coupure…) → on ne l'ajoute pas.
    const existing = sheet
      .getRange(1, COL['N° fiche'], Math.max(sheet.getLastRow(), 1))
      .createTextFinder(orderId)
      .matchEntireCell(true)
      .findNext();
    if (existing) return json_({ result: 'success', order_id: orderId, duplicate: true });

    // Date de l'achat envoyée par le formulaire (jamais dans le futur : Meta refuserait la ligne).
    const eventMs = Number(p.event_time) * 1000;
    const purchaseDate = eventMs && eventMs <= Date.now() ? new Date(eventMs) : new Date();
    const gender = p.gender === 'f' ? 'Femme' : p.gender === 'm' ? 'Homme' : '';

    sheet.appendRow([
      purchaseDate,
      orderId,
      firstName,
      lastName,
      formatPhone_(phone),
      clean_(p.email).toLowerCase(),
      gender,
      clean_(p.wilaya),
      category,
      value,
      p.consent === 'oui' ? 'Oui' : 'Non',
      new Date(),
      '',
    ]);

    return json_({ result: 'success', order_id: orderId });
  } catch (err) {
    return json_({ result: 'error', message: String((err && err.message) || err) });
  } finally {
    lock.releaseLock();
  }
}

// Ouvrir l'URL /exec dans le navigateur permet de vérifier que le script est bien en ligne.
function doGet() {
  return json_({ result: 'success', message: 'Script Ennour en ligne.' });
}

/* ───────────────────────────── Export Meta ───────────────────────────── */

function prepareMetaExport() {
  const ui = SpreadsheetApp.getUi();
  const spreadsheet = getSpreadsheet_();
  const sheet = getSalesSheet_();
  const lastRow = sheet.getLastRow();

  if (lastRow < 2) {
    ui.alert('Aucune vente enregistrée pour le moment.');
    return;
  }

  const rows = sheet.getRange(2, 1, lastRow - 1, HEADERS.length).getValues();
  const timeZone = spreadsheet.getSpreadsheetTimeZone();
  const today = Utilities.formatDate(new Date(), timeZone, 'dd/MM/yyyy');
  const cutoff = Date.now() - META_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

  const exportRows = [];
  const statuses = rows.map((row) => {
    const status = String(row[COL['Export Meta'] - 1] || '');
    if (status) return [status]; // déjà traitée

    const date = row[COL["Date d'achat"] - 1];
    if (!isDate_(date)) return ['Date invalide'];
    if (date.getTime() < cutoff) return ['Trop ancienne (> 62 j)'];

    exportRows.push(toMetaRow_(row));
    return ['Exportée le ' + today];
  });

  if (!exportRows.length) {
    ui.alert(
      'Aucune nouvelle vente à exporter',
      "Toutes les ventes ont déjà été exportées. Le dernier lot est toujours dans l'onglet « " +
        EXPORT_SHEET_NAME + ' ».',
      ui.ButtonSet.OK
    );
    return;
  }

  let out = spreadsheet.getSheetByName(EXPORT_SHEET_NAME);
  if (!out) out = spreadsheet.insertSheet(EXPORT_SHEET_NAME);
  out.clearContents();
  out.getRange(1, 1, exportRows.length + 1, META_HEADERS.length)
    .setNumberFormat('@') // garde les numéros de téléphone tels quels
    .setValues([META_HEADERS].concat(exportRows));
  out.setFrozenRows(1);

  sheet.getRange(2, COL['Export Meta'], statuses.length, 1).setValues(statuses);
  spreadsheet.setActiveSheet(out);

  ui.alert(
    exportRows.length + ' vente(s) prête(s) pour Meta',
    'Téléchargez cet onglet : Fichier → Télécharger → Valeurs séparées par des virgules (.csv), ' +
      "puis importez-le dans Meta Events Manager (ensemble de données → Importer des événements).",
    ui.ButtonSet.OK
  );
}

// Une ligne de l'onglet « Ventes » → une ligne au format Meta.
function toMetaRow_(row) {
  const get = (header) => row[COL[header] - 1];
  const wilaya = String(get('Wilaya') || '');
  const abroad = wilaya === ABROAD;
  const place = abroad ? '' : slug_(wilaya);
  const gender = String(get('Genre') || '').toLowerCase();

  let phone = String(get('Téléphone') || '').replace(/\D/g, '');
  if (/^0[567]\d{8}$/.test(phone)) phone = '213' + phone.slice(1); // saisie manuelle « 0555… »

  return [
    'Purchase',
    String(Math.floor(get("Date d'achat").getTime() / 1000)),
    'physical_store',
    String(get('N° fiche')),
    String(Number(get('Montant (DA)')) || ''),
    CURRENCY,
    phone,
    String(get('Email') || '').trim().toLowerCase(),
    String(get('Prénom') || '').trim().toLowerCase(),
    String(get('Nom') || '').trim().toLowerCase(),
    gender.startsWith('f') ? 'f' : gender.startsWith('h') ? 'm' : '',
    place,
    place,
    abroad ? '' : COUNTRY,
    String(get('Article') || ''),
  ];
}

/* ────────────────────────────── Utilitaires ────────────────────────────── */

function getSpreadsheet_() {
  const active = SpreadsheetApp.getActiveSpreadsheet();
  if (active) return active;

  const id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!id) throw new Error("Lancez d'abord la fonction « setup » depuis l'éditeur Apps Script.");
  return SpreadsheetApp.openById(id);
}

function getSalesSheet_() {
  const spreadsheet = getSpreadsheet_();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME, 0);

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length)
      .setValues([HEADERS])
      .setFontWeight('bold')
      .setBackground('#14110e')
      .setFontColor('#e8d3a1');
    sheet.setFrozenRows(1);
    sheet.getRange('A:A').setNumberFormat('dd/mm/yyyy hh:mm');
    sheet.getRange('B:I').setNumberFormat('@'); // texte brut : pas de formule, téléphone intact
    sheet.getRange('J:J').setNumberFormat('#,##0 "DA"');
    sheet.getRange('K:K').setNumberFormat('@');
    sheet.getRange('L:L').setNumberFormat('dd/mm/yyyy hh:mm');
    sheet.getRange('M:M').setNumberFormat('@');
    sheet.setColumnWidths(1, HEADERS.length, 130);
  }
  return sheet;
}

// 213555123456 → « +213 555 12 34 56 »
function formatPhone_(digits) {
  if (/^213\d{9}$/.test(digits)) {
    const n = digits.slice(3);
    return '+213 ' + n.slice(0, 3) + ' ' + n.slice(3, 5) + ' ' + n.slice(5, 7) + ' ' + n.slice(7);
  }
  return '+' + digits;
}

// « Bordj Bou Arréridj » → « bordjbouarreridj » (format ville / région demandé par Meta)
function slug_(text) {
  return String(text).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z]/g, '');
}

// Texte propre, sans « = + - @ » au début (évite qu'une valeur soit lue comme une formule).
function clean_(value) {
  return String(value == null ? '' : value)
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^[=+\-@]+/, '')
    .slice(0, 120);
}

function isDate_(value) {
  return Object.prototype.toString.call(value) === '[object Date]' && !isNaN(value.getTime());
}

function json_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
