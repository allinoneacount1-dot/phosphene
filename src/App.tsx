import { useEffect, lazy, Suspense } from "react";
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

      <section id="dashboard" className="relative z-10 px-4 sm:px-6 lg:px-12 py-20 max-w-[1400px] mx-auto">
        <div className="mb-8">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-2">
            The <span className="text-phosphene-gold text-glow-gold">Retina</span>
          </h2>
          <p className="text-white/30 font-mono text-sm">
            Generate unique retinal imprints from real-time market data
          </p>
        </div>
        <Suspense fallback={
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 bg-white/[0.02] rounded-xl animate-pulse" />
            ))}
          </div>
        }>
          <DashboardPage />
        </Suspense>
      </section>

      <section id="ophthalmoscope" className="relative z-10 px-4 sm:px-6 lg:px-12 py-20 max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-2">
            The <span className="text-cyan">Ophthalmoscope</span>
          </h2>
          <p className="text-white/30 font-mono text-sm">
            Community imprints — coming soon
          </p>
        </div>
        <div className="glass rounded-xl p-16 text-center">
          <p className="text-white/20 text-lg font-display">Community features launching Q4 2026</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
