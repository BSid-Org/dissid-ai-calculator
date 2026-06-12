import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import Services from "./components/Services";
import Calculator from "./components/Calculator";
import WhatIBuildVideo from "./components/WhatIBuildVideo";
import About from "./components/About";
import Footer from "./components/Footer";
import ErrorBoundaryWrapper from "./components/ErrorBoundaryWrapper";

export default function Home() {
  return (
    <ErrorBoundaryWrapper>
      <main>
        <Navbar />
        <Hero />
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
        <section id="about">
          <About />
        </section>
        <Footer />
      </main>
    </ErrorBoundaryWrapper>
  );
}
