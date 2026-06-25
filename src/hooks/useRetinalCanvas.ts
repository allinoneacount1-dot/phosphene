import { useRef, useEffect, useCallback } from "react";

interface RetinalParams {
  coreSize: number;
  burstIntensity: number;
  chromaticShift: number;
  floaterCount: number;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  volatility: number;
  momentum: number;
  noiseFloor: number;
}

export function useRetinalCanvas(params: RetinalParams) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;

    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, w, h);

    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, params.coreSize);
    gradient.addColorStop(0, params.primaryColor + "80");
    gradient.addColorStop(0.5, params.secondaryColor + "40");
    gradient.addColorStop(1, "transparent");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2 + Date.now() * 0.0001;
      const len = params.coreSize * 1.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(
        cx + Math.cos(angle) * len,
        cy + Math.sin(angle) * len
      );
      ctx.strokeStyle = params.primaryColor + "15";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    const burstCount = Math.floor(params.burstIntensity * 12);
    for (let i = 0; i < burstCount; i++) {
      const angle = (i / burstCount) * Math.PI * 2 + Date.now() * 0.0003;
      const dist = params.coreSize * 0.3 + Math.random() * params.coreSize * 0.7;
      const size = 2 + Math.random() * 4 * params.burstIntensity;
      const x = cx + Math.cos(angle) * dist;
      const y = cy + Math.sin(angle) * dist;

      const burstGrad = ctx.createRadialGradient(x, y, 0, x, y, size * 3);
      burstGrad.addColorStop(0, params.accentColor + "AA");
      burstGrad.addColorStop(0.5, params.accentColor + "44");
      burstGrad.addColorStop(1, "transparent");
      ctx.fillStyle = burstGrad;
      ctx.beginPath();
      ctx.arc(x, y, size * 3, 0, Math.PI * 2);
      ctx.fill();
    }

    for (let i = 0; i < params.floaterCount; i++) {
      const t = Date.now() * 0.0002 + i * 1.7;
      const x = cx + Math.sin(t * 0.7 + i) * params.coreSize * 0.8;
      const y = cy + Math.cos(t * 0.5 + i * 0.3) * params.coreSize * 0.6;
      const size = 1 + Math.random() * 2;

      ctx.fillStyle = params.primaryColor + "60";
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    const vignetteGrad = ctx.createRadialGradient(cx, cy, params.coreSize * 0.5, cx, cy, Math.max(w, h) * 0.7);
    vignetteGrad.addColorStop(0, "transparent");
    vignetteGrad.addColorStop(1, "#050505CC");
    ctx.fillStyle = vignetteGrad;
    ctx.fillRect(0, 0, w, h);

    animRef.current = requestAnimationFrame(draw);
  }, [params]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  return canvasRef;
}
