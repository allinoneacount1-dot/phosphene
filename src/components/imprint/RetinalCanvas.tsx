import { useEffect, useRef, useCallback } from "react";
import type { MarketState } from "@/lib/engine/signal";

interface RetinalCanvasProps {
  marketState: MarketState;
  className?: string;
}

export default function RetinalCanvas({ marketState, className }: RetinalCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);

  const mapRange = (value: number, inMin: number, inMax: number, outMin: number, outMax: number) => {
    return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const cx = w / 2;
    const cy = h / 2;
    const t = timeRef.current;

    const { colorPalette, marketCap, volume24h, momentum, whaleActivity, volatility, noiseFloor } = marketState;
    const primary = colorPalette[0] || "#FFE135";
    const secondary = colorPalette[1] || "#FFD700";
    const accent = colorPalette[2] || "#FFFFFF";

    // background
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, w, h);

    // fovea core — central glow, size mapped from marketCap
    const coreSize = mapRange(Math.log10(Math.max(marketCap, 1e6)), 6, 12, 50, Math.min(w, h) * 0.35);
    const pulseScale = 1 + Math.sin(t * 0.002) * 0.05 * volatility;
    const effectiveCore = coreSize * pulseScale;

    // core glow layers
    for (let layer = 3; layer >= 0; layer--) {
      const layerSize = effectiveCore * (1 + layer * 0.4);
      const alpha = (0.08 - layer * 0.015).toString(16).padStart(2, "0");
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, layerSize);
      grad.addColorStop(0, primary + (layer === 0 ? "60" : alpha));
      grad.addColorStop(0.4, secondary + alpha);
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, layerSize, 0, Math.PI * 2);
      ctx.fill();
    }

    // inner bright core
    const innerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, effectiveCore * 0.3);
    innerGrad.addColorStop(0, primary + "CC");
    innerGrad.addColorStop(0.6, primary + "40");
    innerGrad.addColorStop(1, "transparent");
    ctx.fillStyle = innerGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, effectiveCore * 0.3, 0, Math.PI * 2);
    ctx.fill();

    // retinal vessels — 5 lines radiating from center, thickness = momentum
    const vesselCount = 5;
    const vesselThickness = mapRange(Math.abs(momentum), 0, 1, 1, 6);
    const vesselLength = effectiveCore * 1.8;
    for (let i = 0; i < vesselCount; i++) {
      const angle = (i / vesselCount) * Math.PI * 2 + t * 0.00008;
      ctx.beginPath();
      ctx.moveTo(cx, cy);

      // slightly curved vessel
      const midX = cx + Math.cos(angle) * vesselLength * 0.5 + Math.sin(t * 0.001 + i) * 8;
      const midY = cy + Math.sin(angle) * vesselLength * 0.5 + Math.cos(t * 0.001 + i) * 8;
      const endX = cx + Math.cos(angle) * vesselLength;
      const endY = cy + Math.sin(angle) * vesselLength;

      ctx.quadraticCurveTo(midX, midY, endX, endY);
      ctx.strokeStyle = primary + "18";
      ctx.lineWidth = vesselThickness;
      ctx.lineCap = "round";
      ctx.stroke();
    }

    // phosphene bursts — radial particles, count = volume
    const burstCount = Math.floor(mapRange(Math.log10(Math.max(volume24h, 1)), 3, 10, 4, 24));
    for (let i = 0; i < burstCount; i++) {
      const angle = (i / burstCount) * Math.PI * 2 + t * 0.0003;
      const dist = effectiveCore * 0.4 + Math.sin(t * 0.001 + i * 2) * effectiveCore * 0.3;
      const size = 2 + Math.random() * 3 * (1 + volatility);
      const x = cx + Math.cos(angle) * dist;
      const y = cy + Math.sin(angle) * dist;

      const burstGrad = ctx.createRadialGradient(x, y, 0, x, y, size * 4);
      burstGrad.addColorStop(0, accent + "BB");
      burstGrad.addColorStop(0.4, accent + "44");
      burstGrad.addColorStop(1, "transparent");
      ctx.fillStyle = burstGrad;
      ctx.beginPath();
      ctx.arc(x, y, size * 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // floaters — drifting small circles, count = whale activity
    const floaterCount = Math.floor(mapRange(whaleActivity, 0, 1, 3, 18));
    for (let i = 0; i < floaterCount; i++) {
      const ft = t * 0.0002 + i * 1.7;
      const fx = cx + Math.sin(ft * 0.7 + i) * effectiveCore * 1.2;
      const fy = cy + Math.cos(ft * 0.5 + i * 0.3) * effectiveCore * 0.9;
      const fSize = 1 + Math.random() * 2.5;

      ctx.fillStyle = primary + "50";
      ctx.beginPath();
      ctx.arc(fx, fy, fSize, 0, Math.PI * 2);
      ctx.fill();
    }

    // film grain overlay
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const grainIntensity = noiseFloor * 25;
    for (let i = 0; i < data.length; i += 16) {
      const noise = (Math.random() - 0.5) * grainIntensity;
      data[i] += noise;
      data[i + 1] += noise;
      data[i + 2] += noise;
    }
    ctx.putImageData(imageData, 0, 0);

    // vignette
    const vignetteGrad = ctx.createRadialGradient(cx, cy, effectiveCore * 0.6, cx, cy, Math.max(w, h) * 0.7);
    vignetteGrad.addColorStop(0, "transparent");
    vignetteGrad.addColorStop(0.7, "#05050540");
    vignetteGrad.addColorStop(1, "#050505DD");
    ctx.fillStyle = vignetteGrad;
    ctx.fillRect(0, 0, w, h);

    timeRef.current += 16;
    animRef.current = requestAnimationFrame(draw);
  }, [marketState]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  return (
    <div ref={containerRef} className={className} style={{ width: "100%", height: "100%" }}>
      <canvas
        ref={canvasRef}
        style={{ width: "100%", height: "100%", display: "block" }}
      />
    </div>
  );
}
