"use client";

import { useState, useEffect } from "react";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Calculator", href: "#calculator" },
  { label: "About", href: "#about" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass-panel border-b border-[var(--border)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="text-xl font-bold tracking-tighter"
        >
          <span className="gradient-text">DISSID</span>
        </button>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNav(link.href)}
              className="text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => handleNav("#calculator")}
            className="gradient-btn rounded-lg px-5 py-2 text-sm font-bold"
          >
            Hire Me
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="sm:hidden p-2 text-[var(--text-muted)]"
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined text-2xl">
            {mobileOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="sm:hidden glass-panel border-t border-[var(--border)] px-4 pb-4">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNav(link.href)}
              className="block w-full text-left py-3 text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => handleNav("#calculator")}
            className="w-full gradient-btn rounded-lg px-5 py-3 text-sm font-bold mt-2"
          >
            Hire Me
          </button>
        </div>
      )}
    </nav>
  );
}
