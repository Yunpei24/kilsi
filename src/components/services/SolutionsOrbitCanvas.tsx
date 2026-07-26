import { useEffect, useRef } from 'react';

/**
 * SolutionsOrbitCanvas
 * Fond animé de la section NOS SOLUTIONS : le noyau Kilsi — le symbole de
 * la marque incandescent — au centre, et six satellites (les six branches)
 * qui gravitent autour de lui sur trois anneaux orbitaux inclinés.
 * Chaque satellite porte la couleur et l'icône de sa branche ; des
 * impulsions d'énergie partent régulièrement du noyau vers les satellites :
 * une offre complète, irriguée par un même cœur.
 *
 * Canvas 2D pur, même hygiène que les autres fonds : sprites pré-calculés,
 * pause hors viewport, prefers-reduced-motion, DPR plafonné.
 */

const MAX_DPR = 2;
const ORBIT_TILT = 0.38;

interface Satellite {
  id: string;                       // id de branche (route /branches/:id)
  color: [number, number, number];  // couleur de la branche
  icon: string;                     // path SVG 24×24 (mêmes icônes que les cartes)
  ring: number;                     // index d'anneau
  phase: number;                    // angle initial
}

interface Ring {
  rx: number;
  ry: number;
  omega: number;         // vitesse angulaire signée (rad/s)
}

interface EnergyPulse {
  satIdx: number;
  start: number;
  dur: number;
}

interface Twinkle {
  x: number; y: number; r: number;
  alpha: number; speed: number; phase: number;
}

// 3 anneaux × 2 satellites = les 6 branches, chacune sa couleur et son icône
const SATELLITES: Satellite[] = [
  {
    id: 'studio', ring: 0, phase: 0.4, color: [47, 123, 255],
    icon: 'M8 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3M7 8l4 4-4 4M13 16h4',
  },
  {
    id: 'ai', ring: 0, phase: 0.4 + Math.PI, color: [232, 178, 58],
    icon: 'M12 2a4 4 0 0 1 4 4c0 1.5-.8 2.8-2 3.4V11h3a3 3 0 0 1 3 3v1.6c1.2.6 2 1.9 2 3.4a4 4 0 0 1-8 0c0-1.5.8-2.8 2-3.4V14a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v1.6c1.2.6 2 1.9 2 3.4a4 4 0 0 1-8 0c0-1.5.8-2.8 2-3.4V14a3 3 0 0 1 3-3h3V9.4C8.8 8.8 8 7.5 8 6a4 4 0 0 1 4-4Z',
  },
  {
    id: 'data', ring: 1, phase: 2.1, color: [62, 214, 192],
    icon: 'M3 3v18h18M7 16l4-6 4 4 4-8',
  },
  {
    id: 'drone', ring: 1, phase: 2.1 + Math.PI, color: [148, 112, 255],
    icon: 'M12 2L4 7v4c0 5.5 3.4 10.7 8 12 4.6-1.3 8-6.5 8-12V7l-8-5Zm-1 14 6-6-1.4-1.4L11 13.2 8.4 10.6 7 12l4 4Z',
  },
  {
    id: 'cloud', ring: 2, phase: 4.4, color: [103, 212, 255],
    icon: 'M6.5 19a4.5 4.5 0 0 1-.4-9A6 6 0 0 1 18 10a4 4 0 0 1-1.5 7.7',
  },
  {
    id: 'academy', ring: 2, phase: 4.4 + Math.PI, color: [255, 138, 92],
    icon: 'M12 3L2 9l10 6 8-4.8V17h2V9L12 3ZM4 11.4V16l8 5 8-5v-4.6l-8 4.8-8-4.8Z',
  },
];

function makeRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/**
 * Sprite d'un satellite : halo aux couleurs de la branche, cœur assombri
 * cerclé, et l'icône de la branche gravée en blanc (Path2D sur le même
 * tracé SVG que les cartes de la grille).
 */
function buildSatSprite(sat: Satellite): HTMLCanvasElement {
  const S = 128;
  const c = document.createElement('canvas');
  c.width = S;
  c.height = S;
  const ctx = c.getContext('2d');
  if (!ctx) return c;
  const [r, g, b] = sat.color;

  // halo coloré
  const halo = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  halo.addColorStop(0, `rgba(${r},${g},${b},0.9)`);
  halo.addColorStop(0.3, `rgba(${r},${g},${b},0.35)`);
  halo.addColorStop(0.62, `rgba(${r},${g},${b},0.1)`);
  halo.addColorStop(1, `rgba(${r},${g},${b},0)`);
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, S, S);

  // cœur sombre pour la lisibilité de l'icône
  const coreR = S * 0.26;
  ctx.fillStyle = 'rgba(8,18,40,0.72)';
  ctx.beginPath();
  ctx.arc(S / 2, S / 2, coreR, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = `rgba(${r},${g},${b},0.95)`;
  ctx.lineWidth = 2.6;
  ctx.beginPath();
  ctx.arc(S / 2, S / 2, coreR, 0, Math.PI * 2);
  ctx.stroke();

  // icône de la branche (stroke, comme sur les cartes)
  const iconBox = S * 0.34;
  const scale = iconBox / 24;
  ctx.save();
  ctx.translate(S / 2 - iconBox / 2, S / 2 - iconBox / 2);
  ctx.scale(scale, scale);
  ctx.strokeStyle = 'rgba(255,255,255,0.96)';
  ctx.lineWidth = 1.9;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.shadowColor = `rgba(${r},${g},${b},0.9)`;
  ctx.shadowBlur = 4;
  ctx.stroke(new Path2D(sat.icon));
  ctx.restore();

  return c;
}

/** Fond statique : dégradé + étoiles éparses. */
function buildBackground(w: number, h: number, dpr: number): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.floor(w * dpr));
  c.height = Math.max(1, Math.floor(h * dpr));
  const ctx = c.getContext('2d');
  if (!ctx) return c;
  ctx.scale(dpr, dpr);

  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, '#040A1D');
  bg.addColorStop(0.55, '#08122B');
  bg.addColorStop(1, '#0A1733');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  const rng = makeRng(60606);
  const count = Math.round((w * h) / 5000);
  for (let i = 0; i < count; i++) {
    const tint = rng();
    const a = 0.15 + rng() * 0.45;
    ctx.fillStyle = tint < 0.72
      ? `rgba(255,255,255,${a})`
      : tint < 0.9
        ? `rgba(185,214,255,${a})`
        : `rgba(255,224,176,${a})`;
    ctx.beginPath();
    ctx.arc(rng() * w, rng() * h, 0.3 + rng() * 0.85, 0, Math.PI * 2);
    ctx.fill();
  }
  return c;
}

const SolutionsOrbitCanvas: React.FC = () => {
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
    let rings: Ring[] = [];
    let cx = 0;
    let cy = 0;
    let coreScale = 1;
    let twinkles: Twinkle[] = [];
    let pulses: EnergyPulse[] = [];
    let nextPulseAt = 1;

    const satSprites = SATELLITES.map(buildSatSprite);

    const rebuild = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, Math.round(rect.width));
      h = Math.max(1, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      bgCanvas = buildBackground(w, h, dpr);

      cx = w * 0.5;
      cy = h * 0.54;
      const base = Math.min(w * 0.46, h * 0.62);
      coreScale = Math.max(base / 460, 0.55);
      const radii = [0.36, 0.62, 0.92];
      const periods = [14, 24, 38];
      rings = radii.map((k, i) => ({
        rx: base * k,
        ry: base * k * ORBIT_TILT,
        omega: ((Math.PI * 2) / periods[i]) * (i % 2 === 0 ? 1 : -1),
      }));

      const twinkleRng = makeRng(515151);
      twinkles = Array.from({ length: w < 768 ? 22 : 46 }, () => ({
        x: twinkleRng() * w,
        y: twinkleRng() * h,
        r: 0.5 + twinkleRng() * 0.8,
        alpha: 0.2 + twinkleRng() * 0.45,
        speed: 0.5 + twinkleRng() * 1.4,
        phase: twinkleRng() * Math.PI * 2,
      }));

      pulses = [];
      nextPulseAt = 1;
    };

    const satPos = (s: Satellite, t: number): [number, number, number] => {
      const ring = rings[s.ring];
      const ang = s.phase + ring.omega * t;
      return [cx + ring.rx * Math.cos(ang), cy + ring.ry * Math.sin(ang), ang];
    };

    // ── Noyau : symbole Kilsi incandescent ────────────────────────
    const drawCore = (t: number) => {
      const breath = 1 + 0.08 * Math.sin(t * 1.6) + 0.03 * Math.sin(t * 3.7);
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';

      // halo
      const R = 46 * coreScale * breath;
      const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
      halo.addColorStop(0, 'rgba(255,228,150,0.5)');
      halo.addColorStop(0.4, 'rgba(232,178,58,0.18)');
      halo.addColorStop(1, 'rgba(232,178,58,0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fill();

      // ondes d'énergie
      for (let i = 0; i < 2; i++) {
        const rp = (t * 0.35 + i * 0.5) % 1;
        const rr = rp * 90 * coreScale;
        ctx.strokeStyle = `rgba(232,178,58,${(1 - rp) * 0.3})`;
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.arc(cx, cy, rr, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      // symbole Kilsi : barre + chevron + point d'or
      const u = 1.05 * coreScale; // unité d'échelle du glyphe
      ctx.save();
      ctx.translate(cx - 13 * u, cy - 13 * u);
      ctx.scale(u, u);
      ctx.shadowColor = 'rgba(255,240,200,0.9)';
      ctx.shadowBlur = 10;
      // barre verticale arrondie
      ctx.fillStyle = 'rgba(255,252,242,0.96)';
      ctx.beginPath();
      ctx.roundRect(0, 1, 4.6, 24, 2.3);
      ctx.fill();
      // chevron >
      ctx.strokeStyle = 'rgba(255,252,242,0.96)';
      ctx.lineWidth = 4.6;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(9.5, 2.5);
      ctx.lineTo(25, 13);
      ctx.lineTo(9.5, 23.5);
      ctx.stroke();
      // point d'or
      ctx.fillStyle = '#E8B23A';
      ctx.beginPath();
      ctx.arc(25, 13, 3.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    // ── Impulsions d'énergie noyau → satellites ───────────────────
    const drawPulses = (t: number) => {
      pulses = pulses.filter((p) => t - p.start < p.dur);
      if (t >= nextPulseAt && pulses.length < 2) {
        const rng = makeRng(Math.floor(t * 449));
        pulses.push({
          satIdx: Math.floor(rng() * SATELLITES.length),
          start: t,
          dur: 1.15,
        });
        nextPulseAt = t + 1.6 + rng() * 1.8;
      }

      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (const p of pulses) {
        const s = SATELLITES[p.satIdx];
        const u = (t - p.start) / p.dur;
        // le pulse vise la position du satellite à l'arrivée (léger lead)
        const [tx, ty] = satPos(s, p.start + p.dur);
        const px = cx + (tx - cx) * u;
        const py = cy + (ty - cy) * u;
        const env = Math.sin(Math.PI * u);
        const [cr, cg, cb] = s.color;

        // trainée vers le noyau
        const trailU = Math.max(0, u - 0.22);
        const tx2 = cx + (tx - cx) * trailU;
        const ty2 = cy + (ty - cy) * trailU;
        const grad = ctx.createLinearGradient(px, py, tx2, ty2);
        grad.addColorStop(0, `rgba(${cr},${cg},${cb},${0.7 * env})`);
        grad.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(tx2, ty2);
        ctx.stroke();

        // tête
        ctx.fillStyle = `rgba(255,244,214,${0.9 * env})`;
        ctx.beginPath();
        ctx.arc(px, py, 1.9, 0, Math.PI * 2);
        ctx.fill();

        // ping à l'arrivée
        if (u > 0.82) {
          const rp = (u - 0.82) / 0.18;
          ctx.strokeStyle = `rgba(${cr},${cg},${cb},${(1 - rp) * 0.55})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(tx, ty, 4 + rp * 12, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      ctx.restore();
    };

    const drawFrame = (t: number) => {
      if (!bgCanvas) return;
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(bgCanvas, 0, 0, w, h);

      for (const s of twinkles) {
        const a = s.alpha * (0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * s.speed + s.phase)));
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Anneaux orbitaux
      ctx.lineWidth = 1;
      for (const ring of rings) {
        ctx.strokeStyle = 'rgba(148,186,255,0.08)';
        ctx.beginPath();
        ctx.ellipse(cx, cy, ring.rx, ring.ry, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Satellites derrière le noyau (moitié haute de l'ellipse)
      const behind: number[] = [];
      const front: number[] = [];
      SATELLITES.forEach((s, i) => {
        const ang = s.phase + rings[s.ring].omega * t;
        (Math.sin(ang) < 0 ? behind : front).push(i);
      });

      const drawSat = (i: number) => {
        const s = SATELLITES[i];
        const ring = rings[s.ring];
        const [x, y, ang] = satPos(s, t);

        // trainée le long de l'orbite, aux couleurs de la branche
        const dir = Math.sign(ring.omega);
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        const [cr, cg, cb] = s.color;
        const TRAIL = 0.55;
        const SEG = 9;
        for (let k = 1; k <= SEG; k++) {
          const a0 = ang - dir * (TRAIL * (k - 1)) / SEG * 1;
          const a1 = ang - dir * (TRAIL * k) / SEG * 1;
          const alpha = 0.28 * (1 - k / SEG);
          ctx.strokeStyle = `rgba(${cr},${cg},${cb},${alpha})`;
          ctx.lineWidth = 1.6;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(cx + ring.rx * Math.cos(a0), cy + ring.ry * Math.sin(a0));
          ctx.lineTo(cx + ring.rx * Math.cos(a1), cy + ring.ry * Math.sin(a1));
          ctx.stroke();
        }
        ctx.restore();

        // satellite : halo coloré + icône de sa branche (plus grand côté proche)
        const depth = 1 + 0.25 * Math.sin(ang);
        const size = Math.max(48 * depth * Math.max(coreScale, 0.7), 30);
        ctx.drawImage(satSprites[i], x - size / 2, y - size / 2, size, size);
      };

      behind.forEach(drawSat);
      drawCore(t);
      front.forEach(drawSat);
      drawPulses(t);
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
      drawFrame(3.2);
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
        if (reducedMotion) drawFrame(3.2);
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

export default SolutionsOrbitCanvas;
