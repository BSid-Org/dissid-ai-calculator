import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MetricsSection from "./components/MetricsSection";
import HowItWorks from "./components/HowItWorks";
import Services from "./components/Services";
import Calculator from "./components/Calculator";
import WhatIBuildVideo from "./components/WhatIBuildVideo";
import ArchitectureFleet from "./components/ArchitectureFleet";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import ErrorBoundaryWrapper from "./components/ErrorBoundaryWrapper";

export default function Home() {
  return (
    <ErrorBoundaryWrapper>
      <main>
        <Navbar />
        <Hero />
        <MetricsSection />
        <section id="how-it-works">
          <HowItWorks />
        </section>
        <section id="services">
          <Services />
        </section>
        <section id="calculator" className="py-16">
          <div className="text-center mb-8 px-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
              Live Demo: AI Savings Calculator
            </h2>
            <p className="text-[var(--text-muted)] max-w-lg mx-auto">
              An interactive tool I designed and shipped — try it
            </p>
          </div>
          <Calculator />
        </section>
        <section id="what-i-build" className="py-20">
          <div className="text-center mb-8 px-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
              What I Build
            </h2>
            <p className="text-[var(--text-muted)] max-w-lg mx-auto">
              A 30-second walkthrough of my core capabilities
            </p>
          </div>
          <div className="max-w-3xl mx-auto px-4">
            <WhatIBuildVideo />
          </div>
        </section>
        <section id="architecture" className="py-20">
          <div className="text-center mb-8 px-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
              How It Runs
            </h2>
            <p className="text-[var(--text-muted)] max-w-lg mx-auto">
              One Mac orchestrator, a fleet of cloud agents, connected to the
              tools you already use
            </p>
          </div>
          <div className="max-w-3xl mx-auto px-4 flex justify-center">
            <ArchitectureFleet />
          </div>
        </section>
        <section id="about">
          <About />
        </section>
        <section id="contact" className="py-20 px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
              Send a <span className="gradient-text">Message</span>
            </h2>
            <p className="text-[var(--text-muted)] max-w-lg mx-auto">
              Prefer to write instead of booking a call? Drop me a note and
              I&apos;ll get back to you.
            </p>
          </div>
          <Contact />
        </section>
        <Footer />
      </main>
    </ErrorBoundaryWrapper>
  );
}
