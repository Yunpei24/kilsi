import { useEffect, useRef } from 'react';

/**
 * FaqCircuitCanvas
 * Fond animé de la section Questions Fréquentes : des pistes de circuit
 * imprimé courent depuis les bords de l'écran, parcourues d'impulsions de
 * signal — les questions qui cheminent vers leurs réponses — tandis
 * qu'une petite fusée traverse régulièrement le ciel étoilé dans un
 * panache de particules, et que quelques points d'interrogation flottent
 * comme des bulles.
 *
 * Canvas 2D pur : circuit pré-rendu dans le fond statique, impulsions par
 * interpolation d'abscisse curviligne, fusée sprite + flamme dynamique.
 * Respecte prefers-reduced-motion et se met en pause hors du viewport.
 */

const MAX_DPR = 2;

interface Trace {
  pts: Array<[number, number]>;   // polyligne (px)
  cum: number[];                  // longueurs cumulées
  total: number;
}

interface SignalPulse {
  traceIdx: number;
  start: number;
  dur: number;
  gold: boolean;
}

interface SmokeParticle {
  x: number; y: number;
  vx: number; vy: number;
  born: number;
  life: number;
  r: number;
}

interface FloatingMark {
  x: number; y: number;
  size: number;
  speed: number;
  sway: number;
  phase: number;
  alpha: number;
  gold: boolean;
}

interface Twinkle {
  x: number; y: number; r: number;
  alpha: number; speed: number; phase: number;
}

function makeRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** Génère les pistes du circuit (marche de Manhattan depuis les bords). */
function buildTraces(w: number, h: number): Trace[] {
  const rng = makeRng(424242);
  const unit = Math.max(18, Math.min(w, h) / 30);
  const traces: Trace[] = [];
  const count = Math.max(10, Math.min(22, Math.round(w / 90)));

  for (let i = 0; i < count; i++) {
    const fromLeft = i % 2 === 0;
    let x = fromLeft ? 0 : w;
    let y = Math.round((0.08 + rng() * 0.84) * h / unit) * unit;
    const pts: Array<[number, number]> = [[x, y]];
    let horizontal = true;
    const steps = 3 + Math.floor(rng() * 4);
    for (let sI = 0; sI < steps; sI++) {
      const len = unit * (1 + Math.floor(rng() * 4));
      if (horizontal) {
        x += fromLeft ? len : -len;
        // rester sur son tiers latéral pour laisser le centre respirer
        x = fromLeft ? Math.min(x, w * 0.34) : Math.max(x, w * 0.66);
      } else {
        y += rng() > 0.5 ? len : -len;
        y = Math.max(unit, Math.min(h - unit, y));
      }
      pts.push([x, y]);
      horizontal = !horizontal;
    }
    // longueurs cumulées
    const cum = [0];
    for (let k = 1; k < pts.length; k++) {
      cum.push(cum[k - 1] + Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]));
    }
    traces.push({ pts, cum, total: cum[cum.length - 1] });
  }
  return traces;
}

/** Point à l'abscisse curviligne s le long d'une piste. */
function pointAt(tr: Trace, s: number): [number, number] {
  const target = Math.max(0, Math.min(s, tr.total));
  let k = 1;
  while (k < tr.cum.length - 1 && tr.cum[k] < target) k++;
  const seg = tr.cum[k] - tr.cum[k - 1] || 1;
  const u = (target - tr.cum[k - 1]) / seg;
  return [
    tr.pts[k - 1][0] + (tr.pts[k][0] - tr.pts[k - 1][0]) * u,
    tr.pts[k - 1][1] + (tr.pts[k][1] - tr.pts[k - 1][1]) * u,
  ];
}

/** Fond statique : dégradé, étoiles et circuit gravé. */
function buildBackground(w: number, h: number, dpr: number, traces: Trace[]): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.floor(w * dpr));
  c.height = Math.max(1, Math.floor(h * dpr));
  const ctx = c.getContext('2d');
  if (!ctx) return c;
  ctx.scale(dpr, dpr);

  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, '#0A1733');
  bg.addColorStop(0.5, '#081127');
  bg.addColorStop(1, '#0A1733');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  const rng = makeRng(101010);
  const starCount = Math.round((w * h) / 6500);
  for (let i = 0; i < starCount; i++) {
    ctx.fillStyle = `rgba(255,255,255,${0.12 + rng() * 0.4})`;
    ctx.beginPath();
    ctx.arc(rng() * w, rng() * h, 0.3 + rng() * 0.8, 0, Math.PI * 2);
    ctx.fill();
  }

  // Pistes du circuit
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  for (const tr of traces) {
    ctx.strokeStyle = 'rgba(79,156,255,0.13)';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(tr.pts[0][0], tr.pts[0][1]);
    for (let k = 1; k < tr.pts.length; k++) ctx.lineTo(tr.pts[k][0], tr.pts[k][1]);
    ctx.stroke();

    // vias aux coudes
    for (let k = 1; k < tr.pts.length - 1; k++) {
      ctx.fillStyle = 'rgba(79,156,255,0.2)';
      ctx.beginPath();
      ctx.arc(tr.pts[k][0], tr.pts[k][1], 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
    // pastille terminale (pad)
    const end = tr.pts[tr.pts.length - 1];
    ctx.strokeStyle = 'rgba(79,156,255,0.3)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(end[0], end[1], 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = 'rgba(232,178,58,0.35)';
    ctx.beginPath();
    ctx.arc(end[0], end[1], 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  return c;
}

/** Sprite de la fusée (pointe vers le haut, échelle 2×). */
function buildRocketSprite(): HTMLCanvasElement {
  const W = 64;
  const H = 148;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const ctx = c.getContext('2d');
  if (!ctx) return c;
  const cx = W / 2;

  // corps
  const body = ctx.createLinearGradient(cx - 14, 0, cx + 14, 0);
  body.addColorStop(0, '#C9D6EA');
  body.addColorStop(0.45, '#F4F8FF');
  body.addColorStop(1, '#AEBDD6');
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.moveTo(cx, 6);
  ctx.bezierCurveTo(cx + 15, 34, cx + 14, 74, cx + 12, 108);
  ctx.lineTo(cx - 12, 108);
  ctx.bezierCurveTo(cx - 14, 74, cx - 15, 34, cx, 6);
  ctx.closePath();
  ctx.fill();

  // coiffe dorée
  ctx.fillStyle = '#E8B23A';
  ctx.beginPath();
  ctx.moveTo(cx, 6);
  ctx.bezierCurveTo(cx + 10, 20, cx + 12, 30, cx + 12.5, 40);
  ctx.lineTo(cx - 12.5, 40);
  ctx.bezierCurveTo(cx - 12, 30, cx - 10, 20, cx, 6);
  ctx.closePath();
  ctx.fill();

  // hublot
  ctx.fillStyle = '#0A1733';
  ctx.beginPath();
  ctx.arc(cx, 62, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#4F9CFF';
  ctx.beginPath();
  ctx.arc(cx, 62, 6.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.beginPath();
  ctx.arc(cx - 2.2, 59.5, 2.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.6)';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(cx, 62, 9, 0, Math.PI * 2);
  ctx.stroke();

  // ailerons
  ctx.fillStyle = '#1F5BFF';
  ctx.beginPath();
  ctx.moveTo(cx - 12, 76);
  ctx.bezierCurveTo(cx - 26, 96, cx - 27, 112, cx - 26, 120);
  ctx.lineTo(cx - 11, 106);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx + 12, 76);
  ctx.bezierCurveTo(cx + 26, 96, cx + 27, 112, cx + 26, 120);
  ctx.lineTo(cx + 11, 106);
  ctx.closePath();
  ctx.fill();

  // tuyère
  ctx.fillStyle = '#7C8AA5';
  ctx.beginPath();
  ctx.moveTo(cx - 8, 108);
  ctx.lineTo(cx + 8, 108);
  ctx.lineTo(cx + 5.5, 118);
  ctx.lineTo(cx - 5.5, 118);
  ctx.closePath();
  ctx.fill();

  return c;
}

const FaqCircuitCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let raf = 0;
    let running = false;
    let visible = true;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let bgCanvas: HTMLCanvasElement | null = null;
    let traces: Trace[] = [];
    let pulses: SignalPulse[] = [];
    let twinkles: Twinkle[] = [];
    let marks: FloatingMark[] = [];
    let smoke: SmokeParticle[] = [];
    let rocket: {
      x0: number; y0: number; cxp: number; cyp: number; x1: number; y1: number;
      start: number; dur: number;
    } | null = null;
    let nextRocketAt = 3;

    const rocketSprite = buildRocketSprite();

    const rebuild = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, Math.round(rect.width));
      h = Math.max(1, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      traces = buildTraces(w, h);
      bgCanvas = buildBackground(w, h, dpr, traces);

      const rng = makeRng(31415);
      pulses = Array.from({ length: Math.min(6, Math.ceil(traces.length / 3)) }, (_, i) => ({
        traceIdx: Math.floor(rng() * traces.length),
        start: i * 0.7 + rng(),
        dur: 1.8 + rng() * 1.6,
        gold: rng() < 0.3,
      }));

      twinkles = Array.from({ length: w < 768 ? 16 : 30 }, () => ({
        x: rng() * w,
        y: rng() * h,
        r: 0.5 + rng() * 0.8,
        alpha: 0.18 + rng() * 0.4,
        speed: 0.5 + rng() * 1.3,
        phase: rng() * Math.PI * 2,
      }));

      marks = Array.from({ length: w < 768 ? 5 : 8 }, () => ({
        x: rng() * w,
        y: rng() * h,
        size: 16 + rng() * 26,
        speed: 9 + rng() * 12,
        sway: 8 + rng() * 14,
        phase: rng() * Math.PI * 2,
        alpha: 0.05 + rng() * 0.06,
        gold: rng() < 0.35,
      }));

      smoke = [];
      rocket = null;
      nextRocketAt = 2.5;
    };

    // ── Impulsions de signal le long des pistes ───────────────────
    const drawPulses = (t: number) => {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (const p of pulses) {
        const local = (t - p.start) % (p.dur + 1.2); // pause entre deux passages
        if (local < 0 || local > p.dur) continue;
        const tr = traces[p.traceIdx];
        const s = (local / p.dur) * tr.total;
        const [px, py] = pointAt(tr, s);
        const [cr, cg, cb] = p.gold ? [232, 178, 58] : [79, 156, 255];

        // sillage
        for (let k = 1; k <= 5; k++) {
          const [qx, qy] = pointAt(tr, s - k * 9);
          ctx.fillStyle = `rgba(${cr},${cg},${cb},${0.3 * (1 - k / 6)})`;
          ctx.beginPath();
          ctx.arc(qx, qy, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
        // tête
        ctx.fillStyle = `rgba(255,255,255,0.9)`;
        ctx.beginPath();
        ctx.arc(px, py, 1.8, 0, Math.PI * 2);
        ctx.fill();
        const halo = ctx.createRadialGradient(px, py, 0, px, py, 8);
        halo.addColorStop(0, `rgba(${cr},${cg},${cb},0.5)`);
        halo.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(px, py, 8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // recyclage : nouvelle piste après chaque cycle complet
      for (const p of pulses) {
        if (t - p.start > p.dur + 1.2) {
          const rng = makeRng(Math.floor(t * 883) + p.traceIdx);
          p.traceIdx = Math.floor(rng() * traces.length);
          p.start = t + rng() * 0.8;
          p.dur = 1.8 + rng() * 1.6;
          p.gold = rng() < 0.3;
        }
      }
    };

    // ── Points d'interrogation flottants ──────────────────────────
    const drawMarks = (t: number, dt: number) => {
      for (const m of marks) {
        m.y -= m.speed * dt;
        if (m.y < -m.size) {
          m.y = h + m.size;
          m.x = makeRng(Math.floor(m.phase * 1000) + Math.floor(t))() * w;
        }
        const x = m.x + Math.sin(t * 0.6 + m.phase) * m.sway;
        ctx.font = `700 ${m.size}px Outfit, Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = m.gold
          ? `rgba(232,178,58,${m.alpha})`
          : `rgba(148,186,255,${m.alpha})`;
        ctx.fillText('?', x, m.y);
      }
    };

    // ── Fusée ─────────────────────────────────────────────────────
    const spawnRocket = (t: number) => {
      const rng = makeRng(Math.floor(t * 733));
      const fromLeft = rng() > 0.45;
      const y0 = h + 90;
      const x0 = fromLeft ? -50 + rng() * w * 0.15 : w + 50 - rng() * w * 0.15;
      const x1 = fromLeft ? w * (0.75 + rng() * 0.35) : w * (0.25 - rng() * 0.35);
      const y1 = -110;
      rocket = {
        x0, y0, x1, y1,
        cxp: (x0 + x1) / 2 + (fromLeft ? -1 : 1) * w * (0.1 + rng() * 0.15),
        cyp: h * (0.25 + rng() * 0.3),
        start: t,
        dur: 5.5 + rng() * 1.5,
      };
      nextRocketAt = t + 11 + rng() * 8;
    };

    const drawRocket = (t: number) => {
      if (!rocket && t >= nextRocketAt) spawnRocket(t);

      // fumée résiduelle (dessinée même après la fin du vol)
      ctx.save();
      smoke = smoke.filter((sp) => t - sp.born < sp.life);
      for (const sp of smoke) {
        const u = (t - sp.born) / sp.life;
        const x = sp.x + sp.vx * (t - sp.born);
        const y = sp.y + sp.vy * (t - sp.born);
        ctx.fillStyle = `rgba(190,208,235,${0.16 * (1 - u)})`;
        ctx.beginPath();
        ctx.arc(x, y, sp.r * (1 + u * 1.6), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      if (!rocket) return;
      const p = (t - rocket.start) / rocket.dur;
      if (p >= 1) {
        rocket = null;
        return;
      }
      const u = p;
      const mu = 1 - u;
      const x = mu * mu * rocket.x0 + 2 * mu * u * rocket.cxp + u * u * rocket.x1;
      const y = mu * mu * rocket.y0 + 2 * mu * u * rocket.cyp + u * u * rocket.y1;
      // tangente → orientation
      const dx = 2 * mu * (rocket.cxp - rocket.x0) + 2 * u * (rocket.x1 - rocket.cxp);
      const dy = 2 * mu * (rocket.cyp - rocket.y0) + 2 * u * (rocket.y1 - rocket.cyp);
      const ang = Math.atan2(dy, dx) + Math.PI / 2;

      const scale = Math.max(0.34, Math.min(0.5, w / 2600));
      const spriteH = 148 * scale;
      const nozzleY = 44 * scale; // tuyère, sous le centre du sprite

      // particules d'échappement (à la tuyère, dans le repère tourné)
      const rng = makeRng(Math.floor(t * 6131));
      const nx = x - Math.sin(ang) * nozzleY;
      const ny = y + Math.cos(ang) * nozzleY;
      for (let i = 0; i < 2; i++) {
        smoke.push({
          x: nx + (rng() - 0.5) * 4,
          y: ny + (rng() - 0.5) * 4,
          vx: -dx * 0.02 + (rng() - 0.5) * 12,
          vy: -dy * 0.02 + (rng() - 0.5) * 12,
          born: t,
          life: 0.6 + rng() * 0.5,
          r: 1.6 + rng() * 2.4,
        });
      }
      if (smoke.length > 90) smoke.splice(0, smoke.length - 90);

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(ang);

      // flamme vacillante, ancrée à la tuyère
      const flick = 1 + 0.35 * Math.sin(t * 31) + 0.2 * Math.sin(t * 47 + 1.3);
      const fl = 30 * scale * flick;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const flame = ctx.createLinearGradient(0, nozzleY, 0, nozzleY + fl);
      flame.addColorStop(0, 'rgba(255,246,220,0.95)');
      flame.addColorStop(0.4, 'rgba(255,190,80,0.75)');
      flame.addColorStop(1, 'rgba(255,120,40,0)');
      ctx.fillStyle = flame;
      ctx.beginPath();
      ctx.moveTo(-6 * scale, nozzleY);
      ctx.quadraticCurveTo(0, nozzleY + fl * 1.25, 6 * scale, nozzleY);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // corps
      ctx.drawImage(
        rocketSprite,
        -(64 * scale) / 2,
        -spriteH / 2,
        64 * scale,
        spriteH,
      );
      ctx.restore();
    };

    let lastT = 0;
    const drawFrame = (t: number) => {
      if (!bgCanvas) return;
      const dt = Math.min(t - lastT, 0.05);
      lastT = t;
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(bgCanvas, 0, 0, w, h);

      for (const s of twinkles) {
        const a = s.alpha * (0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * s.speed + s.phase)));
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      drawPulses(t);
      drawMarks(t, dt);
      drawRocket(t);
    };

    const t0 = performance.now();
    const loop = () => {
      if (!running) return;
      drawFrame((performance.now() - t0) / 1000);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reducedMotion || !visible) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    rebuild();
    if (reducedMotion) {
      drawFrame(1.2);
    } else {
      start();
    }

    const io = new IntersectionObserver((entries) => {
      visible = entries[0]?.isIntersecting ?? true;
      if (visible) start();
      else stop();
    }, { threshold: 0.02 });
    io.observe(canvas);

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        rebuild();
        if (reducedMotion) drawFrame(1.2);
      }, 150);
    };
    window.addEventListener('resize', onResize);

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener('resize', onResize);
      window.clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
    />
  );
};

export default FaqCircuitCanvas;
