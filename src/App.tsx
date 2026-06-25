import { lazy, Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import MarketTicker from "@/components/landing/MarketTicker";
import StatsBar from "@/components/landing/StatsBar";
import Footer from "@/components/layout/Footer";
import "@/styles/globals.css";

const DashboardPage = lazy(() => import("@/components/dashboard/DashboardPage"));

export default function App() {
  return (
    <div className="relative min-h-screen bg-void text-sclera-white overflow-x-hidden film-grain">
      <Navbar />
      <HeroSection />
      <MarketTicker />
      <StatsBar />

      <section id="dashboard" className="relative z-10 py-20">
        <div className="mx-auto max-w-7xl px-6 text-center mb-12">
          <p className="font-mono text-[10px] text-white/15 uppercase tracking-[0.3em] mb-3">
            // signal processing
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-3">
            The <span className="text-phosphene-gold text-glow-gold">Retina</span>
          </h2>
          <p className="text-white/30 font-mono text-sm max-w-lg mx-auto">
            Generate unique retinal imprints from real-time market data
          </p>
        </div>
        <Suspense fallback={
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-96 bg-white/[0.02] rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
        }>
          <DashboardPage />
        </Suspense>
      </section>

      <section id="ophthalmoscope" className="relative z-10 py-20">
        <div className="mx-auto max-w-7xl px-6 text-center mb-12">
          <p className="font-mono text-[10px] text-white/15 uppercase tracking-[0.3em] mb-3">
            // social layer
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-3">
            The <span className="text-cyan">Ophthalmoscope</span>
          </h2>
          <p className="text-white/30 font-mono text-sm max-w-lg mx-auto">
            Community imprints — coming soon
          </p>
        </div>
        <div className="mx-auto max-w-3xl px-6">
          <div className="glass rounded-2xl p-16 text-center">
            <p className="text-white/20 text-lg font-display">Community features launching Q4 2026</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
