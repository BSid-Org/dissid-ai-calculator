"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  categories,
  questionsInScope,
  scoreReadiness,
  type Answer,
  type CategoryId,
  type Priority,
} from "./soc2-data";
import { BOOKING_MAILTO, BOOKING_URL, CONTACT_ENDPOINT } from "../lib/booking";

function Icon({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span className={`material-symbols-outlined ${className}`}>{name}</span>
  );
}

const priorityStyles: Record<Priority, { label: string; cls: string }> = {
  high: { label: "High", cls: "text-[var(--secondary)] border-[var(--secondary)]" },
  medium: { label: "Medium", cls: "text-[var(--primary)] border-[var(--primary)]" },
  low: { label: "Low", cls: "text-[var(--text-muted)] border-[var(--border)]" },
};

// ---- Step 1: category scope ----
function ScopeStep({
  selected,
  toggle,
}: {
  selected: CategoryId[];
  toggle: (id: CategoryId) => void;
}) {
  return (
    <div>
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
          Which Trust Services Categories are in scope?
        </h2>
        <p className="text-[var(--text-muted)] max-w-xl mx-auto">
          Security is the mandatory baseline for every SOC 2 report. Add the
          elective categories your customers ask about.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {categories.map((cat) => {
          const isSelected = cat.mandatory || selected.includes(cat.id);
          return (
            <button
              key={cat.id}
              onClick={() => !cat.mandatory && toggle(cat.id)}
              disabled={cat.mandatory}
              aria-pressed={isSelected}
              aria-label={`${cat.label} (${cat.criteria})${cat.mandatory ? ", mandatory" : ""}`}
              className={`group relative w-full rounded-xl p-5 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-dark)] ${
                cat.mandatory ? "cursor-default" : "hover:scale-[1.02]"
              } ${
                isSelected
                  ? "glass-panel-selected"
                  : "glass-panel card-glow hover:border-[var(--border-active)]/30"
              }`}
            >
              <div className="flex items-start gap-3">
                <Icon
                  name={cat.icon}
                  className={`text-2xl ${isSelected ? "text-[var(--primary)]" : "text-[var(--text-muted)] group-hover:text-[var(--primary)]"}`}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                      {cat.label}
                    </h3>
                    <span className="text-[10px] font-mono text-[var(--text-muted)]">
                      {cat.criteria}
                    </span>
                    {cat.mandatory && (
                      <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full bg-[var(--primary)]/15 text-[var(--primary)]">
                        Required
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-[var(--text-muted)] leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </div>
              {isSelected && (
                <div className="absolute top-3 right-3 h-5 w-5 rounded-full bg-[var(--primary)] flex items-center justify-center">
                  <svg
                    className="h-3 w-3 text-[var(--bg-dark)]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---- Step 2: questionnaire ----
const answerOptions: { value: Answer; label: string; icon: string }[] = [
  { value: "yes", label: "Yes", icon: "check_circle" },
  { value: "partial", label: "Partial", icon: "remove_circle" },
  { value: "no", label: "No", icon: "cancel" },
];

function QuestionStep({
  selected,
  answers,
  setAnswer,
}: {
  selected: CategoryId[];
  answers: Record<string, Answer>;
  setAnswer: (id: string, a: Answer) => void;
}) {
  const scoped = questionsInScope(selected);
  return (
    <div>
      <div className="text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
          Assess your controls
        </h2>
        <p className="text-[var(--text-muted)] max-w-xl mx-auto">
          Answer honestly — &ldquo;Partial&rdquo; means started-but-not-formalized.
          {" "}
          <span className="text-[var(--text-secondary)]">
            {Object.keys(answers).length}/{scoped.length} answered
          </span>
        </p>
      </div>
      <div className="space-y-3">
        {scoped.map((q) => {
          const cat = categories.find((c) => c.id === q.category)!;
          return (
            <div key={q.id} className="glass-panel rounded-xl p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--text-muted)]">
                      {cat.short}
                    </span>
                    <span className="text-[10px] font-mono text-[var(--text-muted)]">
                      {q.criterion}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${priorityStyles[q.priority].cls}`}
                    >
                      {priorityStyles[q.priority].label}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--text-primary)] font-medium">
                    {q.prompt}
                  </p>
                </div>
                <div
                  role="group"
                  aria-label={q.control}
                  className="flex gap-2 shrink-0"
                >
                  {answerOptions.map((opt) => {
                    const active = answers[q.id] === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => setAnswer(q.id, opt.value)}
                        aria-pressed={active}
                        aria-label={`${q.control}: ${opt.label}`}
                        className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] ${
                          active
                            ? "glass-panel-selected text-[var(--primary)]"
                            : "glass-panel card-glow text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                        }`}
                      >
                        <Icon name={opt.icon} className="text-base" />
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center py-32 gap-6"
    >
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-2 border-[var(--border)] border-t-[var(--primary)] animate-spin" />
        <Icon
          name="security"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[var(--primary)] text-xl animate-pulse-glow"
        />
      </div>
      <div className="text-center">
        <p className="text-lg font-semibold gradient-text">
          Scoring your readiness…
        </p>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Mapping answers to the Trust Services Criteria
        </p>
      </div>
    </motion.div>
  );
}

// ---- Email capture (reuses the Contact Cloud Function path) ----
type EmailStatus = "idle" | "sending" | "success" | "error";

function isValidEmail(value: string): boolean {
  // Simple, permissive RFC-ish check — must have local@domain.tld.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function RoadmapCapture({
  overall,
  inScopeLabels,
  highGaps,
}: {
  overall: number;
  inScopeLabels: string[];
  highGaps: number;
}) {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<EmailStatus>("idle");
  const valid = isValidEmail(email);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setTouched(true);
    if (!valid) return;
    setStatus("sending");
    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Reuse the existing {name,email,message} shape the Cloud Function
        // already accepts — message carries the readiness context as the lead.
        body: JSON.stringify({
          name: "SOC 2 Readiness lead",
          email,
          message: `SOC 2 readiness self-assessment: ${overall}% overall, ${highGaps} high-priority gaps. In scope: ${inScopeLabels.join(", ")}. Requesting the full remediation roadmap.`,
        }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="glass-panel rounded-xl p-6 text-center">
        <Icon
          name="check_circle"
          className="text-3xl text-[var(--primary)] mb-3 block"
        />
        <h3 className="text-lg font-bold mb-2">Roadmap on its way</h3>
        <p className="text-sm text-[var(--text-muted)]">
          Thanks — I&apos;ll send your prioritized SOC 2 remediation roadmap to{" "}
          <span className="text-[var(--text-secondary)] font-semibold">
            {email}
          </span>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-panel rounded-xl p-6">
      <h3 className="font-bold text-sm uppercase tracking-widest text-[var(--text-muted)] mb-1">
        Get the full remediation roadmap
      </h3>
      <p className="text-sm text-[var(--text-secondary)] mb-4">
        A prioritized, control-by-control plan to close your gaps — emailed to
        you. No spam; one reply unsubscribes.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label htmlFor="soc2-email" className="sr-only">
            Email
          </label>
          <input
            id="soc2-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched(true)}
            maxLength={254}
            aria-invalid={touched && !valid}
            className="w-full rounded-xl bg-[var(--surface-lowest)] border border-[var(--border)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus-visible:outline-none focus-visible:border-[var(--border-active)] focus-visible:ring-1 focus-visible:ring-[var(--primary)] transition-colors"
            placeholder="you@startup.com"
          />
        </div>
        <button
          type="submit"
          disabled={status === "sending"}
          className="gradient-btn rounded-xl px-6 py-3 text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === "sending" ? (
            "Sending…"
          ) : (
            <>
              <Icon name="mail" className="text-base" />
              Email me the roadmap
            </>
          )}
        </button>
      </div>
      {touched && !valid && (
        <p className="mt-2 text-xs text-[var(--secondary)] font-semibold">
          Please enter a valid email address.
        </p>
      )}
      {status === "error" && (
        <p className="mt-2 text-xs text-[var(--secondary)] font-semibold">
          Something went wrong — please try again, or{" "}
          <a href={BOOKING_MAILTO} className="underline">
            email me directly
          </a>
          .
        </p>
      )}
    </form>
  );
}

// ---- Results ----
function ResultsPage({
  result,
  onRestart,
}: {
  result: ReturnType<typeof scoreReadiness>;
  onRestart: () => void;
}) {
  const inScopeLabels = result.perCategory.map((c) => c.label);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="text-center animate-count-up">
        <p className="text-sm text-[var(--text-muted)] uppercase tracking-widest font-bold mb-2">
          Estimated SOC 2 Readiness
        </p>
        <h2 className="text-6xl sm:text-7xl font-extrabold gradient-text">
          {result.overall}%
        </h2>
        <p className="mt-3 text-sm text-[var(--text-secondary)] max-w-md mx-auto">
          {result.effortLabel}
        </p>
      </div>

      {/* Per-category breakdown */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-muted)]">
          Per-category readiness
        </h3>
        {result.perCategory.map((cat, i) => (
          <div
            key={cat.id}
            className="glass-panel rounded-xl p-4 animate-count-up"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-sm">{cat.label}</div>
              <div className="font-bold gradient-text">{cat.readiness}%</div>
            </div>
            <div className="h-1.5 w-full bg-[var(--surface-lowest)] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--tertiary)]"
                initial={{ width: 0 }}
                animate={{ width: `${cat.readiness}%` }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Prioritized gap list */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-muted)]">
          Prioritized gaps{" "}
          {result.gaps.length > 0 && (
            <span className="text-[var(--secondary)]">
              ({result.highGaps} high-priority)
            </span>
          )}
        </h3>
        {result.gaps.length === 0 ? (
          <div className="glass-panel rounded-xl p-5 flex items-center gap-3">
            <Icon name="check_circle" className="text-[var(--tertiary)] text-xl" />
            <p className="text-sm text-[var(--text-secondary)]">
              No gaps flagged for your in-scope categories — focus on collecting
              evidence and formalizing what you already do.
            </p>
          </div>
        ) : (
          result.gaps.map((gap, i) => (
            <div
              key={gap.questionId}
              className="glass-panel rounded-xl p-4 animate-count-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex items-start justify-between gap-3 mb-1">
                <div className="font-semibold text-sm">{gap.control}</div>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${priorityStyles[gap.priority].cls}`}
                >
                  {priorityStyles[gap.priority].label}
                </span>
              </div>
              <div className="text-[11px] text-[var(--text-muted)] mb-2 font-mono">
                {gap.categoryLabel} · {gap.criterion} ·{" "}
                {gap.answer === "partial" ? "partially met" : "not met"}
              </div>
              <p className="text-sm text-[var(--text-secondary)]">
                {gap.remediation}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Email capture for the full roadmap */}
      <RoadmapCapture
        overall={result.overall}
        inScopeLabels={inScopeLabels}
        highGaps={result.highGaps}
      />

      {/* CTA — DISSID Readiness Sprint (aggressive loss-aversion framing) */}
      <div className="glass-panel-selected rounded-xl p-6 text-center">
        <p className="text-[10px] uppercase tracking-widest font-bold text-[var(--secondary)] mb-2">
          {result.highGaps > 0
            ? `${result.highGaps} open gap${result.highGaps > 1 ? "s" : ""} standing between you and the contract`
            : "The badge your competitors already wave at buyers"}
        </p>
        <h3 className="font-bold text-lg mb-2">
          Your buyers ask for SOC 2 before they sign
        </h3>
        <p className="text-sm text-[var(--text-secondary)] mb-5 max-w-md mx-auto">
          Every week these gaps stay open, the deal goes to the vendor
          who&apos;s already compliant — and that revenue doesn&apos;t come
          back. The DISSID Readiness Sprint closes them in 5 days flat —
          without burning your engineers on evidence spreadsheets for a month.
          Fixed scope, a human sign-off, ready to hand straight to your auditor.
        </p>
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex gradient-btn rounded-xl px-6 py-3.5 text-sm font-bold items-center justify-center gap-2"
        >
          <Icon name="rocket_launch" className="text-base" />
          Claim your Readiness Sprint slot
        </a>
        <p className="mt-4 text-xs text-[var(--text-muted)]">
          I run a limited number of sprints each month — book before they&apos;re
          gone. Or{" "}
          <a href="/#services" className="underline hover:text-[var(--text-secondary)]">
            see everything DISSID builds
          </a>
          .
        </p>
      </div>

      <button
        onClick={onRestart}
        className="w-full rounded-xl border border-[var(--border)] px-6 py-4 text-center font-semibold text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)] transition-colors"
      >
        Start Over
      </button>

      <p className="text-center text-xs text-[var(--text-muted)] max-w-xl mx-auto">
        Disclaimer: this is a self-assessment readiness estimate based on the
        AICPA Trust Services Criteria. It is NOT a SOC 2 audit and not a
        substitute for an examination by a licensed CPA firm.
      </p>
    </motion.div>
  );
}

const slideVariants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

export default function Soc2Scanner() {
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState<CategoryId[]>([]);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [isLoading, setIsLoading] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const id = requestAnimationFrame(() => {
      // scrollIntoView is unimplemented in some jsdom builds — guard the call.
      rootRef.current?.scrollIntoView?.({ behavior: "smooth", block: "start" });
    });
    return () => cancelAnimationFrame(id);
  }, [step, isLoading]);

  const toggleCategory = (id: CategoryId) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const setAnswer = (id: string, a: Answer) =>
    setAnswers((prev) => ({ ...prev, [id]: a }));

  const scoped = questionsInScope(selected);
  const allAnswered = scoped.length > 0 && scoped.every((q) => answers[q.id]);

  const canContinue = () => {
    if (step === 1) return true; // Security is always in scope
    if (step === 2) return allAnswered;
    return false;
  };

  const handleContinue = () => {
    if (step === 2) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setStep(3);
      }, 1500);
    } else {
      setStep((s) => s + 1);
    }
  };

  const result =
    step === 3 && !isLoading ? scoreReadiness(selected, answers) : null;

  const totalSteps = 2;
  const pct = Math.round((Math.min(step, totalSteps) / totalSteps) * 100);

  return (
    <div
      ref={rootRef}
      className="mx-auto max-w-3xl px-4 py-8 sm:py-12 scroll-mt-24"
    >
      {step <= 2 && !isLoading && (
        <div className="mb-10 w-full max-w-md mx-auto">
          <div className="flex justify-between items-end mb-3">
            <span className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-bold">
              Step {String(step).padStart(2, "0")} —{" "}
              {step === 1 ? "SCOPE" : "ASSESSMENT"}
            </span>
            <span className="text-xs font-mono text-[var(--primary)]">
              {pct}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-[var(--surface-lowest)] rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            />
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoadingScreen />
          </motion.div>
        )}

        {step === 1 && !isLoading && (
          <motion.div
            key="step1"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <ScopeStep selected={selected} toggle={toggleCategory} />
          </motion.div>
        )}

        {step === 2 && !isLoading && (
          <motion.div
            key="step2"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <QuestionStep
              selected={selected}
              answers={answers}
              setAnswer={setAnswer}
            />
          </motion.div>
        )}

        {step === 3 && result && !isLoading && (
          <motion.div
            key="step3"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4 }}
            role="region"
            aria-live="polite"
            aria-label="SOC 2 readiness results"
          >
            <ResultsPage
              result={result}
              onRestart={() => {
                setStep(1);
                setSelected([]);
                setAnswers({});
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {step <= 2 && !isLoading && (
        <div className="mt-10 flex items-center justify-center gap-6">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center gap-1 text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              <Icon name="arrow_back" className="text-base" /> Back
            </button>
          ) : (
            <div />
          )}
          <button
            onClick={handleContinue}
            disabled={!canContinue()}
            aria-label={
              step === 2 ? "Score my readiness" : "Continue to assessment"
            }
            className={`rounded-xl px-8 py-3.5 font-bold text-sm flex items-center gap-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-dark)] ${
              canContinue()
                ? "gradient-btn cursor-pointer"
                : "bg-[var(--border)] text-[var(--text-muted)] cursor-not-allowed opacity-50"
            }`}
          >
            {step === 2 ? (
              <>
                <Icon name="security" className="text-base" />
                Score My Readiness
              </>
            ) : (
              "Continue"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
