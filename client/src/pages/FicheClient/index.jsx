import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  CircleAlert,
  Clock,
  FileSpreadsheet,
  LoaderCircle,
  Lock,
  Plus,
  Send,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Eyebrow from "@/components/Eyebrow";
import Logo from "@/components/Logo";
import { site } from "@/config/site";
import { ABROAD, wilayas } from "@/data/wilayas";
import { formatAmount, formatDate, formatPhone, normalizePhone, toISODate, toLatinDigits } from "@/lib/format";
import { isSheetConfigured, submitSale } from "@/lib/sheets";
import { cn, img } from "@/lib/utils";

const ARTICLES = ["Bague", "Alliance", "Collier", "Chaîne", "Bracelet", "Boucles d'oreilles", "Parure", "Autre"].map(
  (article) => ({ value: article, label: article }),
);

const GENDERS = [
  { value: "f", label: "Femme" },
  { value: "m", label: "Homme" },
];

const badges = [
  { icon: Clock, label: "Moins d'une minute" },
  { icon: FileSpreadsheet, label: "Envoi direct vers Google Sheets" },
  { icon: ShieldCheck, label: "Données privées" },
];

// Meta n'accepte les ventes en boutique que jusqu'à 62 jours après l'achat.
const META_MAX_DAYS = 62;

// Ordre des champs, pour placer le curseur sur la première erreur.
const FIELD_ORDER = ["firstName", "lastName", "phone", "email", "article", "amount", "date", "consent"];

const inputClass =
  "h-12 w-full rounded-xl border border-input bg-background px-4 text-base text-foreground placeholder:text-muted-foreground/60 outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/15 aria-invalid:border-destructive/70";

function createEmptyForm() {
  return {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    gender: "",
    wilaya: site.defaultWilaya,
    article: "",
    amount: "",
    date: toISODate(new Date()),
    consent: false,
  };
}

function getDateBounds() {
  const min = new Date();
  min.setDate(min.getDate() - META_MAX_DAYS);
  return { min: toISODate(min), max: toISODate(new Date()) };
}

function validate(form, bounds) {
  const errors = {};
  const phone = normalizePhone(form.phone);

  if (!form.firstName.trim()) errors.firstName = "Le prénom est obligatoire.";
  if (!form.lastName.trim()) errors.lastName = "Le nom est obligatoire.";
  if (!form.phone.trim()) errors.phone = "Le téléphone est obligatoire.";
  else if (!phone) errors.phone = "Numéro invalide : mobile algérien 05, 06 ou 07 + 8 chiffres.";
  if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = "Adresse email invalide.";
  }
  if (!form.article) errors.article = "Choisissez l'article vendu.";
  if (!Number(form.amount)) errors.amount = "Indiquez le montant de la vente.";
  if (!form.date || form.date < bounds.min || form.date > bounds.max) {
    errors.date = `Choisissez une date entre le ${formatDate(bounds.min)} et aujourd'hui.`;
  }
  if (!form.consent) errors.consent = "L'accord du client est nécessaire pour enregistrer la fiche.";

  return { errors, phone };
}

// Heure de l'achat : maintenant si c'est aujourd'hui, sinon midi le jour choisi.
function toEventTime(dateISO) {
  const now = new Date();
  const date = dateISO === toISODate(now) ? now : new Date(`${dateISO}T12:00:00`);
  return Math.floor(date.getTime() / 1000);
}

// N° de fiche unique, ex : EN-260928-K3F9Q (sert aussi d'« order_id » pour Meta).
function createOrderId(dateISO) {
  const random = Math.random().toString(36).slice(2, 7).toUpperCase().padEnd(5, "0");
  return `EN-${dateISO.replaceAll("-", "").slice(2)}-${random}`;
}

const FieldError = ({ id, children }) =>
  children ? (
    <p id={id} className="flex items-center gap-1.5 text-sm text-destructive">
      <CircleAlert className="size-4 shrink-0" />
      {children}
    </p>
  ) : null;

const Field = ({ id, label, optional, error, hint, children }) => (
  <div className="space-y-2">
    <label htmlFor={id} className="flex items-baseline justify-between gap-2 text-sm font-medium text-foreground">
      {label}
      {optional && <span className="text-xs font-normal text-muted-foreground">Facultatif</span>}
    </label>
    {children}
    {error ? (
      <FieldError id={`${id}-error`}>{error}</FieldError>
    ) : (
      hint && <p className="text-xs text-muted-foreground">{hint}</p>
    )}
  </div>
);

// Groupe de boutons « pilule » (boutons radio stylés).
const ChoiceGroup = ({ name, legend, options, value, onSelect, error, optional, allowClear }) => (
  <fieldset className="space-y-2">
    <legend className="mb-2 flex w-full items-baseline justify-between gap-2 text-sm font-medium text-foreground">
      {legend}
      {optional && <span className="text-xs font-normal text-muted-foreground">Facultatif</span>}
    </legend>
    <div className="flex flex-wrap gap-2">
      {options.map((option, index) => (
        <label key={option.value} className="cursor-pointer">
          <input
            type="radio"
            id={index === 0 ? name : undefined}
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onSelect(option.value)}
            onClick={() => {
              if (allowClear && value === option.value) onSelect("");
            }}
            aria-describedby={error ? `${name}-error` : undefined}
            className="peer sr-only"
          />
          <span className="inline-flex h-11 items-center rounded-full border border-input bg-background px-4 text-sm font-medium text-foreground transition hover:border-gold peer-checked:border-dark peer-checked:bg-dark peer-checked:text-dark-foreground peer-focus-visible:ring-4 peer-focus-visible:ring-gold/30">
            {option.label}
          </span>
        </label>
      ))}
    </div>
    <FieldError id={`${name}-error`}>{error}</FieldError>
  </fieldset>
);

const SectionTitle = ({ number, title, description }) => (
  <div className="flex items-start gap-4">
    <span className="w-10 h-10 rounded-full bg-dark text-gold text-sm font-bold flex items-center justify-center shrink-0">
      {number}
    </span>
    <div>
      <h2 className="font-display text-2xl font-semibold text-foreground leading-tight">{title}</h2>
      <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
    </div>
  </div>
);

const cardClass = "bg-card rounded-3xl border border-border shadow-[0_24px_60px_-32px_rgba(20,17,14,0.45)]";

const SuccessCard = ({ saved, onNew }) => {
  const rows = [
    ["N° de fiche", saved.orderId],
    ["Client", saved.client],
    ["Téléphone", saved.phone],
    ["Article", saved.article],
    ["Montant", saved.amount],
    ["Date", saved.date],
  ];

  return (
    <div role="status" className={cn(cardClass, "p-6 sm:p-10 text-center animate-in fade-in zoom-in-95 duration-300")}>
      <div className="mx-auto mb-5 w-16 h-16 rounded-full bg-gold/15 flex items-center justify-center">
        <Check className="w-8 h-8 text-gold-deep" strokeWidth={2.5} />
      </div>
      <h2 className="font-display text-4xl font-semibold text-foreground mb-2">Vente enregistrée</h2>
      <p className="text-muted-foreground mb-8">
        {saved.demo
          ? "Mode démo : la fiche n'a pas été envoyée (Google Sheets n'est pas encore connecté)."
          : "La fiche a bien été ajoutée à votre Google Sheet."}
      </p>

      <dl className="grid grid-cols-2 sm:grid-cols-3 gap-px overflow-hidden rounded-2xl border border-border bg-border text-left mb-8">
        {rows.map(([label, value]) => (
          <div key={label} className="bg-background p-4 min-w-0">
            <dt className="text-xs text-muted-foreground">{label}</dt>
            <dd className="mt-1 font-semibold text-foreground truncate">{value}</dd>
          </div>
        ))}
      </dl>

      <Button variant="dark" size="lg" onClick={onNew} className="w-full sm:w-auto px-8">
        <Plus className="size-5" />
        Nouvelle fiche
      </Button>
    </div>
  );
};

const FicheClient = () => {
  const [form, setForm] = useState(createEmptyForm);
  const [bounds, setBounds] = useState(getDateBounds);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | error | success
  const [submitError, setSubmitError] = useState("");
  const [saved, setSaved] = useState(null);
  // Dernier envoi tenté. Si on renvoie la même fiche après une erreur, on garde le même N° :
  // le script le reconnaît et n'ajoute pas de doublon. Fiche modifiée → nouveau N°.
  const lastAttemptRef = useRef(null);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Fiche client — Bijouterie Ennour";
    return () => {
      document.title = previousTitle;
    };
  }, []);

  const setField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const bind = (field) => ({
    id: field,
    value: form[field],
    onChange: (event) => setField(field, event.target.value),
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? `${field}-error` : undefined,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (status === "sending") return;

    const { errors: nextErrors, phone } = validate(form, bounds);
    setErrors(nextErrors);
    const firstInvalid = FIELD_ORDER.find((field) => nextErrors[field]);
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus();
      return;
    }

    const fingerprint = JSON.stringify(form);
    if (lastAttemptRef.current?.fingerprint !== fingerprint) {
      lastAttemptRef.current = { fingerprint, orderId: createOrderId(form.date) };
    }
    const payload = {
      order_id: lastAttemptRef.current.orderId,
      event_time: toEventTime(form.date),
      first_name: form.firstName.trim(),
      last_name: form.lastName.trim(),
      phone,
      email: form.email.trim().toLowerCase(),
      gender: form.gender,
      wilaya: form.wilaya,
      category: form.article,
      value: form.amount,
      consent: "oui",
    };

    setStatus("sending");
    setSubmitError("");
    try {
      const result = await submitSale(payload);
      setSaved({
        demo: Boolean(result.demo),
        orderId: payload.order_id,
        client: `${payload.first_name} ${payload.last_name}`,
        phone: formatPhone(phone),
        article: form.article,
        amount: `${formatAmount(form.amount)} DA`,
        date: formatDate(form.date),
      });
      setStatus("success");
      lastAttemptRef.current = null;
      window.scrollTo({ top: 0 });
    } catch (error) {
      setSubmitError(error.message);
      setStatus("error");
    }
  };

  const startNewEntry = () => {
    setForm(createEmptyForm());
    setBounds(getDateBounds());
    setErrors({});
    setSaved(null);
    setStatus("idle");
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="min-h-screen bg-background">
      <meta name="robots" content="noindex" />

      <header className="relative bg-dark overflow-hidden">
        <img
          src={img("photo-1601121141461-9d6647bca1ed", { w: 1600 })}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark/60 via-dark/80 to-dark" />

        <div className="relative wrapper">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link to="/" aria-label="Retour à l'accueil">
              <Logo />
            </Link>
            <Button asChild variant="outlineLight" size="sm">
              <Link to="/">
                <ArrowLeft />
                Retour au site
              </Link>
            </Button>
          </div>

          <div className="max-w-2xl mx-auto text-center pt-2 pb-20 sm:pt-6 sm:pb-24 lg:pt-10 lg:pb-28">
            <Eyebrow light center>
              Espace boutique
            </Eyebrow>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-dark-foreground mb-4">
              Fiche client
            </h1>
            <p className="text-dark-foreground/70 text-sm sm:text-base max-w-lg mx-auto">
              Enregistrez chaque vente en moins d'une minute : la fiche est ajoutée automatiquement à votre Google
              Sheet.
            </p>
            <ul className="hidden sm:flex flex-wrap justify-center gap-2 mt-6">
              {badges.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border border-dark-foreground/15 bg-dark-foreground/5 px-3.5 py-1.5 text-xs text-dark-foreground/80"
                >
                  <Icon className="w-3.5 h-3.5 text-gold" />
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </header>

      <main className="wrapper relative -mt-16 pb-16">
        <div className="max-w-3xl mx-auto">
          {status === "success" && saved ? (
            <SuccessCard saved={saved} onNew={startNewEntry} />
          ) : (
            <form noValidate onSubmit={handleSubmit} className={cn(cardClass, "p-5 sm:p-8 lg:p-10 space-y-10")}>
              {!isSheetConfigured && (
                <div className="flex gap-3 rounded-2xl border border-gold/40 bg-gold/10 p-4 text-sm text-foreground">
                  <TriangleAlert className="w-5 h-5 text-gold-deep shrink-0 mt-0.5" />
                  <p>
                    <strong className="font-semibold">Mode démo :</strong> Google Sheets n'est pas encore connecté,
                    les fiches ne sont pas envoyées. Ajoutez l'URL du script dans{" "}
                    <code className="rounded bg-background px-1.5 py-0.5 text-xs">src/config/site.js</code>.
                  </p>
                </div>
              )}

              {/* 01 — Client */}
              <section className="space-y-6">
                <SectionTitle
                  number="01"
                  title="Le client"
                  description="Ses coordonnées pour le suivi client et la mesure de vos publicités."
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field id="firstName" label="Prénom" error={errors.firstName}>
                    <input
                      {...bind("firstName")}
                      autoComplete="off"
                      autoCapitalize="words"
                      placeholder="Ex : Amina"
                      className={inputClass}
                    />
                  </Field>
                  <Field id="lastName" label="Nom" error={errors.lastName}>
                    <input
                      {...bind("lastName")}
                      autoComplete="off"
                      autoCapitalize="words"
                      placeholder="Ex : Benali"
                      className={inputClass}
                    />
                  </Field>
                  <Field
                    id="phone"
                    label="Téléphone (WhatsApp de préférence)"
                    error={errors.phone}
                    hint="Numéro étranger : commencez par + (ex : +33 6…)."
                  >
                    <input
                      {...bind("phone")}
                      type="tel"
                      inputMode="tel"
                      autoComplete="off"
                      placeholder="05 55 12 34 56"
                      className={inputClass}
                    />
                  </Field>
                  <Field id="email" label="Email" optional error={errors.email}>
                    <input
                      {...bind("email")}
                      type="email"
                      inputMode="email"
                      autoComplete="off"
                      autoCapitalize="none"
                      placeholder="client@email.com"
                      className={inputClass}
                    />
                  </Field>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <ChoiceGroup
                    name="gender"
                    legend="Genre"
                    optional
                    allowClear
                    options={GENDERS}
                    value={form.gender}
                    onSelect={(value) => setField("gender", value)}
                  />
                  <Field id="wilaya" label="Wilaya" optional>
                    <div className="relative">
                      <select {...bind("wilaya")} className={cn(inputClass, "appearance-none pr-10 cursor-pointer")}>
                        <option value="">Choisir la wilaya…</option>
                        {wilayas.map((name, index) => (
                          <option key={name} value={name}>
                            {String(index + 1).padStart(2, "0")} · {name}
                          </option>
                        ))}
                        <option value={ABROAD}>{ABROAD}</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    </div>
                  </Field>
                </div>
              </section>

              {/* 02 — Achat */}
              <section className="space-y-6">
                <SectionTitle number="02" title="L'achat" description="Ce que le client a acheté aujourd'hui." />

                <ChoiceGroup
                  name="article"
                  legend="Article vendu"
                  options={ARTICLES}
                  value={form.article}
                  onSelect={(value) => setField("article", value)}
                  error={errors.article}
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field id="amount" label="Montant de la vente" error={errors.amount}>
                    <div className="relative">
                      <input
                        {...bind("amount")}
                        value={formatAmount(form.amount)}
                        onChange={(event) =>
                          setField("amount", toLatinDigits(event.target.value).replace(/\D/g, "").slice(0, 9))
                        }
                        inputMode="numeric"
                        autoComplete="off"
                        placeholder="Ex : 85 000"
                        className={cn(inputClass, "pr-14 font-semibold")}
                      />
                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">
                        DA
                      </span>
                    </div>
                  </Field>
                  <Field id="date" label="Date de l'achat" error={errors.date} hint="Aujourd'hui par défaut.">
                    <input {...bind("date")} type="date" min={bounds.min} max={bounds.max} className={inputClass} />
                  </Field>
                </div>
              </section>

              {/* Consentement */}
              <div className="space-y-2">
                <label
                  htmlFor="consent"
                  className={cn(
                    "flex items-start gap-3 rounded-2xl border bg-secondary/50 p-4 cursor-pointer transition-colors",
                    errors.consent ? "border-destructive/50" : "border-border hover:border-gold/50",
                  )}
                >
                  <input
                    id="consent"
                    type="checkbox"
                    checked={form.consent}
                    onChange={(event) => setField("consent", event.target.checked)}
                    aria-describedby={errors.consent ? "consent-error" : undefined}
                    className="mt-0.5 size-5 shrink-0 cursor-pointer accent-gold-deep"
                  />
                  <span className="text-sm text-foreground/80">
                    Le client accepte que ses coordonnées soient enregistrées par la boutique, pour le suivi client et
                    la mesure de nos publicités.
                  </span>
                </label>
                <FieldError id="consent-error">{errors.consent}</FieldError>
              </div>

              {status === "error" && (
                <div
                  role="alert"
                  className="flex gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
                >
                  <CircleAlert className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">La fiche n'a pas été enregistrée.</p>
                    <p className="opacity-90">{submitError}</p>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                variant="dark"
                size="lg"
                disabled={status === "sending"}
                className="w-full h-14 text-base"
              >
                {status === "sending" ? (
                  <>
                    <LoaderCircle className="size-5 animate-spin" />
                    Enregistrement…
                  </>
                ) : (
                  <>
                    <Send className="size-5" />
                    Enregistrer la vente
                  </>
                )}
              </Button>
            </form>
          )}

          <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
            <Lock className="w-3.5 h-3.5" />
            Les fiches ne sont visibles que dans le Google Sheet de la boutique.
          </p>
        </div>
      </main>
    </div>
  );
};

export default FicheClient;
