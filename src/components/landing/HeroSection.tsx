"use client";

import { useRef, useEffect, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  pulse: number;
  pulseSpeed: number;
}

const PARTICLE_COUNT = 240;
const GOLD = { r: 255, g: 225, b: 53 };

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const scanYRef = useRef(-2);
  const frameRef = useRef(0);
  const rafRef = useRef<number>(0);

  const initParticles = useCallback((w: number, h: number) => {
    const particles: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.15 - 0.05,
        radius: Math.random() * 1.8 + 0.4,
        opacity: Math.random() * 0.6 + 0.1,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.02 + 0.005,
      });
    }
    particlesRef.current = particles;
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // particles
    for (const p of particlesRef.current) {
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += p.pulseSpeed;

      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;

      const glow = 0.3 + Math.sin(p.pulse) * 0.2;
      const alpha = p.opacity * glow;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${GOLD.r},${GOLD.g},${GOLD.b},${alpha})`;
      ctx.fill();

      // glow halo
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${GOLD.r},${GOLD.g},${GOLD.b},${alpha * 0.12})`;
      ctx.fill();
    }

    // scan line — sweeps down every ~240 frames
    frameRef.current++;
    const cycle = 240;
    const progress = (frameRef.current % cycle) / cycle;
    scanYRef.current = progress * (h + 40) - 20;

    const sy = scanYRef.current;
    const gradient = ctx.createLinearGradient(0, sy - 1, 0, sy + 1);
    gradient.addColorStop(0, "rgba(255,225,53,0)");
    gradient.addColorStop(0.5, "rgba(255,225,53,0.18)");
    gradient.addColorStop(1, "rgba(255,225,53,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, sy - 12, w, 24);

    ctx.fillStyle = `rgba(${GOLD.r},${GOLD.g},${GOLD.b},0.35)`;
    ctx.fillRect(0, sy, w, 1);

    rafRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(dpr, dpr);
      initParticles(rect.width, rect.height);
    };

    resize();
    window.addEventListener("resize", resize);
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [initParticles, draw]);

  const scrollToDashboard = () => {
    document.getElementById("dashboard")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative w-full h-screen overflow-hidden bg-[#050505]">
      {/* canvas bg */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: "block" }}
      />

      {/* film grain overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
      />

      {/* vignette */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_40%,#050505_100%)]" />

      {/* content */}
      <div className="relative z-20 flex h-full flex-col items-center justify-center px-6">
        <p className="mb-6 font-mono text-xs tracking-[0.35em] text-white/25 uppercase">
          The Retinal Market Engine
        </p>

        <h1
          className="font-display text-center font-black leading-[0.88] tracking-tight text-[#FFE135]"
          style={{ fontSize: "clamp(4rem, 12vw, 12rem)" }}
        >
          PHOSPHENE
        </h1>

        <p className="mt-6 max-w-md text-center text-sm text-white/40 font-body">
          See What The Market Hides
        </p>

        <button
          onClick={scrollToDashboard}
          className="mt-10 group relative inline-flex items-center gap-2 border border-[#FFE135]/30 bg-[#FFE135]/5 px-8 py-3 font-mono text-xs tracking-[0.2em] text-[#FFE135] uppercase transition-colors hover:border-[#FFE135]/60 hover:bg-[#FFE135]/10"
        >
          <span>Enter The Retina</span>
          <span className="inline-block transition-transform group-hover:translate-y-0.5">
            ↓
          </span>
        </button>
      </div>

      {/* bottom fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 z-20 bg-gradient-to-t from-[#050505] to-transparent" />
    </section>
  );
}
