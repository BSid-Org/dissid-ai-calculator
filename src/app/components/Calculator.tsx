"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  industries,
  painPoints,
  teamSizes,
  calculateResults,
} from "./calculator-data";
import { BOOKING_URL, BOOKING_MAILTO } from "../lib/booking";

const stepLabels = [
  { label: "INDUSTRY SELECTION", nav: "Project" },
  { label: "OPERATIONAL SCOPE", nav: "Scope" },
  { label: "FINAL CONFIGURATION", nav: "Team" },
];

function Icon({ name, className = "" }: { name: string; className?: string }) {
  return (
    <span className={`material-symbols-outlined ${className}`}>{name}</span>
  );
}

function SelectionCard({
  label,
  subtitle,
  icon,
  selected,
  onClick,
}: {
  label: string;
  subtitle: string;
  icon: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={`${selected ? "Deselect" : "Select"} ${label}: ${subtitle}`}
      aria-pressed={selected}
      className={`group relative w-full rounded-xl p-5 text-left transition-all duration-200 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-dark)] ${
        selected
          ? "glass-panel-selected"
          : "glass-panel card-glow hover:border-[var(--border-active)]/30"
      }`}
    >
      <Icon
        name={selected ? icon : icon}
        className={`text-2xl mb-2 transition-colors ${
          selected
            ? "text-[var(--primary)]"
            : "text-[var(--text-muted)] group-hover:text-[var(--primary)]"
        }`}
      />
      <h3 className="text-sm font-semibold text-[var(--text-primary)]">
        {label}
      </h3>
      <p className="mt-0.5 text-xs text-[var(--text-muted)]">{subtitle}</p>
      {selected && (
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
}

function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = Math.round((step / total) * 100);
  return (
    <div className="mb-10 w-full max-w-md mx-auto">
      <div className="flex justify-between items-end mb-3">
        <span className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-bold">
          Step {String(step).padStart(2, "0")} — {stepLabels[step - 1]?.label}
        </span>
        <span className="text-xs font-mono text-[var(--primary)]">{pct}%</span>
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
          name="auto_awesome"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[var(--primary)] text-xl animate-pulse-glow"
        />
      </div>
      <div className="text-center">
        <p className="text-lg font-semibold gradient-text">
          Calculating your savings...
        </p>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Analyzing operational efficiency
        </p>
      </div>
    </motion.div>
  );
}

function ResultsPage({
  results,
  onRestart,
}: {
  results: ReturnType<typeof calculateResults>;
  onRestart: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="text-center animate-count-up">
        <p className="text-sm text-[var(--text-muted)] uppercase tracking-widest font-bold mb-2">
          Estimated Annual Savings
        </p>
        <h2 className="text-5xl sm:text-6xl font-extrabold gradient-text">
          ${results.annualSavings.toLocaleString()}
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          {
            value: `$${results.totalMonthlySavings.toLocaleString()}`,
            label: "/month savings",
            icon: "savings",
          },
          {
            value: `${results.totalHoursSaved}`,
            label: "hours saved",
            icon: "schedule",
          },
          { value: `${results.roi}x`, label: "ROI", icon: "trending_up" },
        ].map((stat, i) => (
          <div
            key={i}
            className="glass-panel rounded-xl p-5 text-center animate-count-up"
            style={{ animationDelay: `${i * 0.15}s` }}
          >
            <Icon
              name={stat.icon}
              className="text-[var(--primary)] text-xl mb-2"
            />
            <div className="text-2xl sm:text-3xl font-bold gradient-text">
              {stat.value}
            </div>
            <div className="mt-1 text-xs text-[var(--text-muted)]">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--text-muted)]">
          Operational Breakdown
        </h3>
        {results.breakdown.map((item, i) => (
          <div
            key={item.id}
            className="glass-panel rounded-xl p-4 animate-count-up"
            style={{ animationDelay: `${(i + 3) * 0.1}s` }}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-semibold text-sm">{item.label}</div>
                <div className="text-xs text-[var(--text-muted)]">
                  {item.replacementPct}% automatable
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold gradient-text">
                  ${item.savings.toLocaleString()}/mo
                </div>
                <div className="text-xs text-[var(--text-muted)]">
                  {item.hoursSaved} hrs saved
                </div>
              </div>
            </div>
            <div className="h-1.5 w-full bg-[var(--surface-lowest)] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--tertiary)]"
                initial={{ width: 0 }}
                animate={{ width: `${item.replacementPct}%` }}
                transition={{
                  duration: 0.8,
                  delay: (i + 3) * 0.1,
                  ease: "easeOut",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="glass-panel rounded-xl p-6 space-y-3">
        <h3 className="font-bold text-sm uppercase tracking-widest text-[var(--text-muted)]">
          What This Looks Like
        </h3>
        <ul className="space-y-2.5">
          {results.breakdown.map((item) => (
            <li
              key={item.id}
              className="flex items-start gap-3 text-sm text-[var(--text-secondary)]"
            >
              <Icon
                name="check_circle"
                className="text-[var(--tertiary)] text-lg mt-0.5"
              />
              AI agent handles {item.replacementPct}% of{" "}
              {item.label.toLowerCase()}
            </li>
          ))}
          <li className="flex items-start gap-3 text-sm text-[var(--text-secondary)]">
            <Icon
              name="check_circle"
              className="text-[var(--tertiary)] text-lg mt-0.5"
            />
            AI cost: ${results.totalAiCost}/mo vs $
            {(
              results.totalMonthlySavings + results.totalAiCost
            ).toLocaleString()}
            /mo current spend
          </li>
        </ul>
      </div>

      <div className="glass-panel rounded-xl p-6">
        <h3 className="font-bold text-sm uppercase tracking-widest text-[var(--text-muted)] mb-3">
          What would you do with {results.totalHoursSaved} extra hours?
        </h3>
        <p className="text-sm text-[var(--text-secondary)] mb-4">
          That&apos;s {Math.round(results.totalHoursSaved / 4)} hours per week —{" "}
          {results.totalHoursSaved >= 160
            ? "a full-time employee"
            : results.totalHoursSaved >= 80
              ? "a part-time hire"
              : `${Math.round(results.totalHoursSaved / 8)} extra workdays`}{" "}
          worth of capacity back in your business.
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            "Grow revenue",
            "Improve product",
            "Strategic planning",
            "Client relationships",
            "Take a break",
          ].map((tag) => (
            <span
              key={tag}
              className="text-xs px-3 py-1.5 rounded-full border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors cursor-default"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 gradient-btn rounded-xl px-6 py-4 text-center font-bold flex items-center justify-center gap-2"
          >
            <Icon name="event" className="text-lg" />
            Book a call to capture this $
            {results.annualSavings.toLocaleString()}/yr
          </a>
          <button
            onClick={onRestart}
            className="flex-1 rounded-xl border border-[var(--border)] px-6 py-4 text-center font-semibold text-[var(--text-muted)] hover:bg-[var(--bg-card-hover)] transition-colors"
          >
            Start Over
          </button>
        </div>
        <p className="mt-3 text-center text-sm text-[var(--text-muted)]">
          Prefer email?{" "}
          <a
            href={BOOKING_MAILTO}
            className="text-[var(--primary)] hover:underline font-semibold"
          >
            Email me directly
          </a>
        </p>
      </div>
    </motion.div>
  );
}

export default function Calculator() {
  const [step, setStep] = useState(1);
  const [industry, setIndustry] = useState("");
  const [selectedPainPoints, setSelectedPainPoints] = useState<string[]>([]);
  const [teamSize, setTeamSize] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  // Keep the user on the calculator when steps change. Run AFTER the new step
  // mounts (AnimatePresence mode="wait" unmounts the old step first, which
  // briefly collapses height and snaps the page up) — an inline scroll on click
  // gets overridden by that reflow, so we scroll in an effect instead.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return; // don't auto-scroll to the calculator on initial page load
    }
    const id = requestAnimationFrame(() =>
      // scrollIntoView is unimplemented in some jsdom builds — guard the call.
      rootRef.current?.scrollIntoView?.({ behavior: "smooth", block: "start" }),
    );
    return () => cancelAnimationFrame(id);
  }, [step, isLoading]);

  const togglePainPoint = (id: string) => {
    setSelectedPainPoints((prev) =>
      prev.includes(id)
        ? prev.filter((p) => p !== id)
        : prev.length < 3
          ? [...prev, id]
          : prev,
    );
  };

  const canContinue = () => {
    if (step === 1) return industry !== "";
    if (step === 2) return selectedPainPoints.length > 0;
    if (step === 3) return teamSize !== "";
    return false;
  };

  const handleContinue = () => {
    if (step === 3) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setStep(4);
      }, 2000);
    } else {
      setStep((s) => s + 1);
    }
  };

  const results =
    step === 4 && !isLoading
      ? calculateResults(selectedPainPoints, teamSize, hoursPerWeek)
      : null;

  const slideVariants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  return (
    <div
      ref={rootRef}
      className="mx-auto max-w-3xl px-4 py-8 sm:py-12 scroll-mt-24"
    >
      {step <= 3 && !isLoading && <ProgressBar step={step} total={3} />}

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
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
                What does your business do?
              </h2>
              <p className="text-[var(--text-muted)] max-w-lg mx-auto">
                Select the category that best aligns with your primary
                operations to tailor your custom estimate.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {industries.map((ind) => (
                <SelectionCard
                  key={ind.id}
                  label={ind.label}
                  subtitle={ind.subtitle}
                  icon={ind.icon}
                  selected={industry === ind.id}
                  onClick={() => setIndustry(ind.id)}
                />
              ))}
            </div>
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
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
                Where are you spending the most time?
              </h2>
              <p className="text-[var(--text-muted)] max-w-lg mx-auto">
                Identify the bottlenecks in your daily operations.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {painPoints.map((pp) => (
                <SelectionCard
                  key={pp.id}
                  label={pp.label}
                  subtitle={pp.subtitle}
                  icon={pp.icon}
                  selected={selectedPainPoints.includes(pp.id)}
                  onClick={() => togglePainPoint(pp.id)}
                />
              ))}
            </div>
            <p className="mt-4 text-center text-sm text-[var(--text-muted)]">
              <span className="gradient-text font-bold">
                {selectedPainPoints.length}
              </span>
              /3 tasks selected
            </p>
          </motion.div>
        )}

        {step === 3 && !isLoading && (
          <motion.div
            key="step3"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
                How big is your team?
              </h2>
              <p className="text-[var(--text-muted)] max-w-lg mx-auto">
                Define your operational scale to help our curator calculate
                precise efficiency gains.
              </p>
            </div>

            {/* Horizontal pill selector */}
            <div className="flex justify-center gap-3 mb-16">
              {teamSizes.map((ts) => (
                <button
                  key={ts.id}
                  onClick={() => setTeamSize(ts.id)}
                  aria-label={`Team size: ${ts.label} people`}
                  aria-pressed={teamSize === ts.id}
                  className={`flex flex-col items-center gap-2 px-5 py-4 rounded-xl transition-all hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-dark)] ${
                    teamSize === ts.id
                      ? "glass-panel-selected scale-[1.02]"
                      : "glass-panel card-glow"
                  }`}
                >
                  <Icon
                    name={ts.icon}
                    className={`text-2xl transition-colors ${
                      teamSize === ts.id
                        ? "text-[var(--primary)]"
                        : "text-[var(--text-muted)]"
                    }`}
                  />
                  <span
                    className={`text-sm font-semibold ${teamSize === ts.id ? "text-[var(--primary)]" : ""}`}
                  >
                    {ts.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Hours slider in glass panel */}
            <div className="max-w-2xl mx-auto glass-panel p-8 rounded-xl">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
                <div className="flex-1 w-full">
                  <label className="block text-sm font-bold uppercase tracking-widest text-[var(--text-muted)] mb-6">
                    Hours per week spent on these tasks
                  </label>
                  <input
                    type="range"
                    min={5}
                    max={60}
                    step={5}
                    value={hoursPerWeek}
                    onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                    aria-label={`Hours per week: ${hoursPerWeek}`}
                    aria-valuemin={5}
                    aria-valuemax={60}
                    aria-valuenow={hoursPerWeek}
                    className="w-full rounded-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
                  />
                  <div className="flex justify-between mt-3 text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-bold">
                    <span>Min (5h)</span>
                    <span>Max (60h)</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-5xl font-extrabold gradient-text">
                    {hoursPerWeek}h
                  </span>
                  <div className="text-xs text-[var(--text-muted)] uppercase tracking-widest mt-1">
                    per week
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 4 && results && !isLoading && (
          <motion.div
            key="step4"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4 }}
            role="region"
            aria-live="polite"
            aria-label="Savings calculation results"
          >
            <ResultsPage
              results={results}
              onRestart={() => {
                setStep(1);
                setIndustry("");
                setSelectedPainPoints([]);
                setTeamSize("");
                setHoursPerWeek(20);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {step <= 3 && !isLoading && (
        <div className="mt-10 flex items-center justify-center gap-6">
          {step > 1 ? (
            <button
              onClick={() => {
                setStep((s) => s - 1);
              }}
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
              step === 3 ? "Generate savings estimate" : "Continue to next step"
            }
            className={`rounded-xl px-8 py-3.5 font-bold text-sm flex items-center gap-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-dark)] ${
              canContinue()
                ? "gradient-btn cursor-pointer"
                : "bg-[var(--border)] text-[var(--text-muted)] cursor-not-allowed opacity-50"
            }`}
          >
            {step === 3 ? (
              <>
                <Icon name="auto_awesome" className="text-base" />
                Generate Estimate
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
