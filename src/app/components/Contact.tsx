"use client";

import { useState } from "react";
import { CONTACT_ENDPOINT } from "../lib/booking";

type Status = "idle" | "sending" | "success" | "error";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const sending = status === "sending";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      // Success ONLY on a 2xx response — anything else is an error.
      if (res.ok) {
        setStatus("success");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus("error");
      }
    } catch {
      // Network failure / rejected fetch → error, never success.
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="glass-panel rounded-2xl p-8 text-center max-w-md mx-auto">
        <span className="material-symbols-outlined text-3xl text-[var(--primary)] mb-3 block">
          check_circle
        </span>
        <h3 className="text-lg font-bold mb-2">Message sent</h3>
        <p className="text-sm text-[var(--text-muted)]">
          Thanks for reaching out — I&apos;ll get back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-panel rounded-2xl p-6 sm:p-8 max-w-md mx-auto space-y-4 text-left"
    >
      <div>
        <label
          htmlFor="contact-name"
          className="block text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2"
        >
          Name
        </label>
        <input
          id="contact-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={200}
          className="w-full rounded-xl bg-[var(--surface-lowest)] border border-[var(--border)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus-visible:outline-none focus-visible:border-[var(--border-active)] focus-visible:ring-1 focus-visible:ring-[var(--primary)] transition-colors"
          placeholder="Your name"
        />
      </div>

      <div>
        <label
          htmlFor="contact-email"
          className="block text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2"
        >
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          maxLength={254}
          className="w-full rounded-xl bg-[var(--surface-lowest)] border border-[var(--border)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus-visible:outline-none focus-visible:border-[var(--border-active)] focus-visible:ring-1 focus-visible:ring-[var(--primary)] transition-colors"
          placeholder="you@company.com"
        />
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="block text-xs font-bold uppercase tracking-widest text-[var(--text-muted)] mb-2"
        >
          Message
        </label>
        <textarea
          id="contact-message"
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={5000}
          rows={4}
          className="w-full rounded-xl bg-[var(--surface-lowest)] border border-[var(--border)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus-visible:outline-none focus-visible:border-[var(--border-active)] focus-visible:ring-1 focus-visible:ring-[var(--primary)] transition-colors resize-y"
          placeholder="What would you like to build?"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-[var(--secondary)] font-semibold">
          Something went wrong — please try again, or email me directly.
        </p>
      )}

      <button
        type="submit"
        disabled={sending}
        className="gradient-btn rounded-xl px-8 py-4 text-base font-bold w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {sending ? (
          "Sending…"
        ) : (
          <>
            <span className="material-symbols-outlined text-lg">send</span>
            Send Message
          </>
        )}
      </button>
    </form>
  );
}
