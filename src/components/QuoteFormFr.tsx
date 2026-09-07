"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";

/* ------------------------------------------------------------------ *
 * French copy of QuoteForm.
 *
 * This is a self-contained duplicate (not a shared component) so the
 * English Get a Quote flow — and its HubSpot submission — can never be
 * affected by French-side changes. Field internal names, the HubSpot
 * endpoint, and the submission payload are IDENTICAL to QuoteForm.tsx;
 * only the visible UI copy is translated.
 * NOTE: AI-generated French translation — pending Rachel/Amelia review.
 *
 * TODO (before launch): if French-language field labels are ever needed
 * *inside* HubSpot itself (e.g. for internal team views), that is a
 * separate HubSpot form/property configuration — this component still
 * submits to the same English-named HubSpot properties below.
 *
 * HubSpot configuration
 * ------------------------------------------------------------------ *
 * Portal:   5617063
 * Form GUID: 166e67c3-16c9-4ccb-b5c2-6ef88678fa87
 *
 * The 7 custom contact properties below must exist in HubSpot with these
 * EXACT internal names and be added to the form, otherwise the submission
 * is rejected:
 *   rent_or_purchase, event_attendance, event_location,
 *   event_start_date, event_end_date, potable_water_access, messages
 * (firstname / lastname / email are HubSpot defaults.)
 *
 * If event_start_date / event_end_date are created as *date-picker*
 * properties, keep toHubSpotDate() (midnight-UTC epoch millis).
 * If they are created as plain *text* properties instead, change
 * toHubSpotDate() to return the raw "YYYY-MM-DD" string.
 * ------------------------------------------------------------------ */
const HUBSPOT_PORTAL_ID = "5617063";
const HUBSPOT_FORM_GUID = "166e67c3-16c9-4ccb-b5c2-6ef88678fa87";
const HUBSPOT_ENDPOINT = `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_GUID}`;

/** HubSpot date-picker properties want midnight-UTC epoch milliseconds. */
function toHubSpotDate(value: string): string {
  if (!value) return "";
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return "";
  return String(Date.UTC(y, m - 1, d));
}

// Step indices (also drive the progress bar).
const STEP = {
  WELCOME: 0,
  CONTACT: 1,
  OPTION: 2,
  ATTENDANCE: 3,
  LOCATION: 4,
  START: 5,
  END: 6,
  NOTES: 7,
  POTABLE: 8,
} as const;
const LAST_QUESTION = STEP.POTABLE;
const TOTAL = LAST_QUESTION + 1; // for progress %

type FormData = {
  firstname: string;
  lastname: string;
  email: string;
  rent_or_purchase: string;
  event_attendance: string;
  event_location: string;
  event_start_date: string;
  event_end_date: string;
  potable_water_access: string;
  messages: string;
};

const EMPTY: FormData = {
  firstname: "",
  lastname: "",
  email: "",
  rent_or_purchase: "",
  event_attendance: "",
  event_location: "",
  event_start_date: "",
  event_end_date: "",
  potable_water_access: "",
  messages: "",
};

const emailOk = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

// NOTE: values POSTed to HubSpot stay in English (Rent/Purchase/Both,
// Yes/No/Not sure) to match the existing property configuration.
const OPTION_CHOICES = [
  { key: "A", label: "Louer", value: "Rent" },
  { key: "B", label: "Acheter", value: "Purchase" },
  { key: "C", label: "Les deux", value: "Both" },
];
const POTABLE_CHOICES = [
  { key: "A", label: "Oui", value: "Yes" },
  { key: "B", label: "Non", value: "No" },
  { key: "C", label: "Pas certain", value: "Not sure" },
];

type Status = "idle" | "submitting" | "success" | "error";

export default function QuoteFormFr() {
  const router = useRouter();
  const [step, setStep] = useState<number>(STEP.WELCOME);
  const [data, setData] = useState<FormData>(EMPTY);
  const [status, setStatus] = useState<Status>("idle");
  const firstFieldRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  const set = (patch: Partial<FormData>) => setData((d) => ({ ...d, ...patch }));

  // Whether the current input step is valid enough to advance.
  const canAdvance = useMemo(() => {
    switch (step) {
      case STEP.WELCOME:
        return true;
      case STEP.CONTACT:
        return (
          data.firstname.trim() !== "" &&
          data.lastname.trim() !== "" &&
          emailOk(data.email.trim())
        );
      case STEP.OPTION:
        return data.rent_or_purchase !== "";
      case STEP.ATTENDANCE:
        return data.event_attendance.trim() !== "";
      case STEP.LOCATION:
        return data.event_location.trim() !== "";
      case STEP.START:
        return data.event_start_date !== "";
      case STEP.END:
        return data.event_end_date !== "";
      case STEP.NOTES:
        return true; // notes are optional
      case STEP.POTABLE:
        return data.potable_water_access !== "";
      default:
        return false;
    }
  }, [step, data]);

  const submit = useCallback(
    async (payloadData: FormData) => {
      setStatus("submitting");
      const fields = [
        { name: "firstname", value: payloadData.firstname.trim() },
        { name: "lastname", value: payloadData.lastname.trim() },
        { name: "email", value: payloadData.email.trim() },
        { name: "rent_or_purchase", value: payloadData.rent_or_purchase },
        { name: "event_attendance", value: payloadData.event_attendance.trim() },
        { name: "event_location", value: payloadData.event_location.trim() },
        { name: "event_start_date", value: toHubSpotDate(payloadData.event_start_date) },
        { name: "event_end_date", value: toHubSpotDate(payloadData.event_end_date) },
        { name: "potable_water_access", value: payloadData.potable_water_access },
        { name: "messages", value: payloadData.messages.trim() },
      ].filter((f) => f.value !== "");

      try {
        const res = await fetch(HUBSPOT_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fields,
            context: {
              pageUri: typeof window !== "undefined" ? window.location.href : "",
              pageName: "Demander une soumission",
            },
          }),
        });
        // Never show the success screen on a failed submit.
        if (!res.ok) throw new Error(`HubSpot responded ${res.status}`);

        // Fire-and-forget relative to the "Thank you" UI below — but
        // sequenced internally: the monday.com item's "HubSpot Deal"
        // column needs the real deal id, so it has to wait on
        // /api/create-deal before creating the rental item. Same pattern
        // as QuoteForm.tsx; `notes` additionally maps to the "Extra
        // comments & notes" column (text2__1) via MONDAY_COLUMN_MAP.
        (async () => {
          const dealPayload = {
            firstname: payloadData.firstname.trim(),
            lastname: payloadData.lastname.trim(),
            email: payloadData.email.trim(),
            eventStartDate: payloadData.event_start_date, // "YYYY-MM-DD"
            eventEndDate: payloadData.event_end_date, // "YYYY-MM-DD"
            eventLocation: payloadData.event_location.trim(),
            expectedAttendance: payloadData.event_attendance.trim(),
            notes: payloadData.messages.trim(),
          };

          let hubspotDealId: string | undefined;
          try {
            const dealRes = await fetch("/api/create-deal", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(dealPayload),
            });
            const dealData = await dealRes.json<{ ok?: boolean; dealId?: string }>().catch(() => null);
            if (dealData?.ok) {
              hubspotDealId = dealData.dealId;
            } else {
              console.error("create-deal failed:", dealData);
            }
          } catch (err) {
            console.error("create-deal failed:", err);
          }

          // Runs regardless of whether the HubSpot call above succeeded —
          // a missing hubspotDealId just means the rental item is created
          // without a linked deal, not skipped entirely.
          fetch("/api/create-rental-item", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...dealPayload, hubspotDealId }),
          }).catch((err) => {
            console.error("create-rental-item failed:", err);
          });
        })();

        setStatus("success");
      } catch {
        setStatus("error");
      }
    },
    [],
  );

  const goNext = useCallback(() => {
    if (!canAdvance) return;
    if (step < LAST_QUESTION) {
      setStep((s) => s + 1);
    } else if (step === LAST_QUESTION) {
      submit(data);
    }
  }, [canAdvance, step, data, submit]);

  const goBack = useCallback(() => {
    if (status === "error") {
      setStatus("idle");
      setStep(LAST_QUESTION);
      return;
    }
    setStep((s) => Math.max(STEP.WELCOME, s - 1));
  }, [status]);

  const pickChoice = useCallback(
    (field: "rent_or_purchase" | "potable_water_access", value: string) => {
      const next = { ...data, [field]: value };
      setData(next);
      if (field === "rent_or_purchase") {
        setStep(STEP.ATTENDANCE);
      } else {
        // potable water is the final question -> submit immediately.
        submit(next);
      }
    },
    [data, submit],
  );

  const close = useCallback(() => router.push("/fr"), [router]);

  // Lock background scroll while the full-screen form is mounted.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Focus the first field whenever the step changes.
  useEffect(() => {
    if (status !== "idle") return;
    const id = window.setTimeout(() => firstFieldRef.current?.focus(), 60);
    return () => window.clearTimeout(id);
  }, [step, status]);

  // Global keyboard handling: Esc closes, Enter advances, letters pick choices.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (status === "submitting") return;
      if (status === "success" || status === "error") return;

      // Letter selection on choice steps.
      if (step === STEP.OPTION || step === STEP.POTABLE) {
        const choices = step === STEP.OPTION ? OPTION_CHOICES : POTABLE_CHOICES;
        const match = choices.find((c) => c.key.toLowerCase() === e.key.toLowerCase());
        if (match) {
          e.preventDefault();
          pickChoice(
            step === STEP.OPTION ? "rent_or_purchase" : "potable_water_access",
            match.value,
          );
          return;
        }
      }

      if (e.key === "Enter") {
        // In the notes textarea, Shift+Enter inserts a newline.
        if (step === STEP.NOTES && e.shiftKey) return;
        e.preventDefault();
        goNext();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, status, goNext, pickChoice, close]);

  const progress = status === "success" ? 100 : Math.round((step / TOTAL) * 100);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col overflow-y-auto bg-blue text-white">
      {/* Progress bar */}
      <div
        className="h-1.5 w-full bg-white/20"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progression du formulaire"
      >
        <div
          className="h-full bg-coral transition-[width] duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Top bar: logo (left) + close (right) */}
      <div className="flex items-center justify-between px-5 py-4 sm:px-8">
        <button
          type="button"
          onClick={close}
          className="flex items-center gap-2"
          aria-label="Accueil O'land Stations"
        >
          <Logo className="h-9 w-9" />
          <span className="text-lg font-extrabold tracking-tight">O&rsquo;land</span>
        </button>
        <button
          type="button"
          onClick={close}
          aria-label="Fermer et retourner à l'accueil"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white/80 hover:bg-white/10 hover:text-white"
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-1 items-center justify-center px-5 py-8 sm:px-8">
        <div className="w-full max-w-2xl">
          {status === "success" ? (
            <ThankYou onClose={close} />
          ) : status === "error" ? (
            <ErrorState onRetry={() => submit(data)} onBack={goBack} />
          ) : (
            <StepBody
              step={step}
              data={data}
              set={set}
              firstFieldRef={firstFieldRef}
              onStart={() => setStep(STEP.CONTACT)}
              onPick={pickChoice}
              submitting={status === "submitting"}
            />
          )}
        </div>
      </div>

      {/* Bottom-right prev / next arrows (hidden on terminal screens) */}
      {status === "idle" && step !== STEP.WELCOME && (
        <div className="pointer-events-none sticky bottom-0 flex justify-end gap-2 px-5 pb-6 sm:px-8">
          <button
            type="button"
            onClick={goBack}
            aria-label="Question précédente"
            className="pointer-events-auto inline-flex h-12 w-12 items-center justify-center rounded-lg bg-steel text-white shadow-lg hover:bg-steel/80"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {step !== STEP.OPTION && step !== STEP.POTABLE && (
            <button
              type="button"
              onClick={goNext}
              disabled={!canAdvance}
              aria-label="Question suivante"
              className="pointer-events-auto inline-flex h-12 w-12 items-center justify-center rounded-lg bg-coral text-white shadow-lg hover:bg-coral/80 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Step body                                                           */
/* ------------------------------------------------------------------ */
function StepBody({
  step,
  data,
  set,
  firstFieldRef,
  onStart,
  onPick,
  submitting,
}: {
  step: number;
  data: FormData;
  set: (patch: Partial<FormData>) => void;
  firstFieldRef: React.MutableRefObject<HTMLInputElement | HTMLTextAreaElement | null>;
  onStart: () => void;
  onPick: (field: "rent_or_purchase" | "potable_water_access", value: string) => void;
  submitting: boolean;
}) {
  if (submitting) {
    return (
      <p className="text-center text-2xl font-semibold" aria-live="polite">
        Envoi de votre demande&hellip;
      </p>
    );
  }

  switch (step) {
    case STEP.WELCOME:
      return (
        <div>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Obtenons votre soumission
          </h1>
          <p className="mt-5 text-lg text-white/85">
            Quelques questions rapides sur votre événement et nous vous répondrons sous peu. Cela
            prend environ une minute.
          </p>
          <button
            type="button"
            onClick={onStart}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-coral px-8 py-3.5 text-base font-bold uppercase tracking-wide text-white hover:bg-coral/90"
          >
            Commencer
            <span className="text-sm font-medium normal-case opacity-80">appuyez sur Entrée ↵</span>
          </button>
        </div>
      );

    case STEP.CONTACT:
      return (
        <Question label="D'abord, à qui avons-nous l'honneur?">
          <div className="space-y-4">
            <TextField
              ref={firstFieldRef as React.MutableRefObject<HTMLInputElement | null>}
              label="Prénom"
              value={data.firstname}
              onChange={(v) => set({ firstname: v })}
              autoComplete="given-name"
            />
            <TextField
              label="Nom de famille"
              value={data.lastname}
              onChange={(v) => set({ lastname: v })}
              autoComplete="family-name"
            />
            <TextField
              label="Courriel"
              type="email"
              value={data.email}
              onChange={(v) => set({ email: v })}
              autoComplete="email"
              invalid={data.email !== "" && !emailOk(data.email)}
              hint={data.email !== "" && !emailOk(data.email) ? "Entrez une adresse courriel valide" : undefined}
            />
          </div>
        </Question>
      );

    case STEP.OPTION:
      return (
        <Question label="Souhaitez-vous louer ou acheter?">
          <Choices
            choices={OPTION_CHOICES}
            selected={data.rent_or_purchase}
            onSelect={(v) => onPick("rent_or_purchase", v)}
          />
        </Question>
      );

    case STEP.ATTENDANCE:
      return (
        <Question label="Combien de personnes assisteront à l'événement?">
          <TextField
            ref={firstFieldRef as React.MutableRefObject<HTMLInputElement | null>}
            label="Achalandage prévu"
            type="number"
            inputMode="numeric"
            value={data.event_attendance}
            onChange={(v) => set({ event_attendance: v })}
          />
        </Question>
      );

    case STEP.LOCATION:
      return (
        <Question label="Où se déroule votre événement?">
          <TextField
            ref={firstFieldRef as React.MutableRefObject<HTMLInputElement | null>}
            label="Lieu de l'événement"
            value={data.event_location}
            onChange={(v) => set({ event_location: v })}
            autoComplete="address-level2"
          />
        </Question>
      );

    case STEP.START:
      return (
        <Question label="Quand débute-t-il?">
          <TextField
            ref={firstFieldRef as React.MutableRefObject<HTMLInputElement | null>}
            label="Date de début"
            type="date"
            value={data.event_start_date}
            onChange={(v) => set({ event_start_date: v })}
          />
        </Question>
      );

    case STEP.END:
      return (
        <Question label="Et quand se termine-t-il?">
          <TextField
            ref={firstFieldRef as React.MutableRefObject<HTMLInputElement | null>}
            label="Date de fin"
            type="date"
            value={data.event_end_date}
            onChange={(v) => set({ event_end_date: v })}
            min={data.event_start_date || undefined}
          />
        </Question>
      );

    case STEP.NOTES:
      return (
        <Question label="Autre chose que nous devrions savoir?" optional>
          <textarea
            ref={firstFieldRef as React.MutableRefObject<HTMLTextAreaElement | null>}
            value={data.messages}
            onChange={(e) => set({ messages: e.target.value })}
            rows={4}
            placeholder="Parlez-nous de votre événement… (Maj + Entrée pour un saut de ligne)"
            className="w-full rounded-xl border-2 border-white/30 bg-white/10 px-4 py-3 text-lg text-white outline-none placeholder:text-white/50 focus:border-white"
          />
        </Question>
      );

    case STEP.POTABLE:
      return (
        <Question label="Y a-t-il un accès à l'eau potable sur place?">
          <Choices
            choices={POTABLE_CHOICES}
            selected={data.potable_water_access}
            onSelect={(v) => onPick("potable_water_access", v)}
          />
        </Question>
      );

    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */
function Question({
  label,
  optional,
  children,
}: {
  label: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
        {label}
        {optional && <span className="ml-2 text-base font-medium text-white/60">(facultatif)</span>}
      </h2>
      <div className="mt-6">{children}</div>
    </div>
  );
}

type TextFieldProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  inputMode?: "numeric" | "text" | "email";
  autoComplete?: string;
  invalid?: boolean;
  hint?: string;
  min?: string;
  // React 19: ref is a plain prop, no forwardRef needed.
  ref?: React.Ref<HTMLInputElement>;
};

function TextField({
  label,
  value,
  onChange,
  type = "text",
  inputMode,
  autoComplete,
  invalid,
  hint,
  min,
  ref,
}: TextFieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-white/80">{label}</span>
      <input
        ref={ref}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        min={min}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={invalid || undefined}
        className={[
          "w-full rounded-xl border-2 bg-white/10 px-4 py-3 text-lg text-white outline-none",
          "placeholder:text-white/50 [color-scheme:dark]",
          invalid ? "border-coral" : "border-white/30 focus:border-white",
        ].join(" ")}
      />
      {hint && <span className="mt-1.5 block text-sm font-medium text-coral">{hint}</span>}
    </label>
  );
}

function Choices({
  choices,
  selected,
  onSelect,
}: {
  choices: { key: string; label: string; value: string }[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="space-y-3" role="listbox" aria-label="Choisissez une option">
      {choices.map((c) => {
        const isSel = selected === c.value;
        return (
          <button
            key={c.value}
            type="button"
            role="option"
            aria-selected={isSel}
            onClick={() => onSelect(c.value)}
            className={[
              "flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-left text-lg transition-colors",
              isSel
                ? "border-white bg-white/20"
                : "border-white/30 bg-white/5 hover:border-white hover:bg-white/10",
            ].join(" ")}
          >
            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/50 text-sm font-bold">
              {c.key}
            </span>
            <span className="font-semibold">{c.label}</span>
          </button>
        );
      })}
      <p className="pt-1 text-sm text-white/60">Astuce : appuyez sur la lettre pour choisir.</p>
    </div>
  );
}

function ThankYou({ onClose }: { onClose: () => void }) {
  return (
    <div className="text-center" aria-live="polite">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/20">
        <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl">Merci!</h1>
      <p className="mx-auto mt-4 max-w-md text-lg text-white/85">
        Nous avons bien reçu votre demande et vous répondrons sous peu. Nous avons hâte de vous
        aider à rendre votre événement sans plastique.
      </p>
      <button
        type="button"
        onClick={onClose}
        className="mt-8 inline-flex items-center justify-center rounded-full bg-coral px-8 py-3.5 text-base font-bold uppercase tracking-wide text-white hover:bg-coral/90"
      >
        Retour à l&rsquo;accueil
      </button>
    </div>
  );
}

function ErrorState({ onRetry, onBack }: { onRetry: () => void; onBack: () => void }) {
  return (
    <div className="text-center" aria-live="assertive">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-coral/30">
        <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <path d="M12 8v5M12 16.5v.5" strokeLinecap="round" />
          <circle cx="12" cy="12" r="9" />
        </svg>
      </div>
      <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl">Une erreur est survenue</h1>
      <p className="mx-auto mt-4 max-w-md text-lg text-white/85">
        Nous n&rsquo;avons pas pu envoyer votre demande. Veuillez vérifier votre connexion et
        réessayer.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center justify-center rounded-full bg-coral px-8 py-3.5 text-base font-bold uppercase tracking-wide text-white hover:bg-coral/90"
        >
          Réessayer
        </button>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center justify-center rounded-full border-2 border-white px-8 py-3.5 text-base font-bold uppercase tracking-wide text-white hover:bg-white hover:text-blue"
        >
          Retour
        </button>
      </div>
    </div>
  );
}
