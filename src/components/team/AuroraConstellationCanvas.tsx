import { useEffect, useRef } from 'react';

/**
 * AuroraConstellationCanvas
 * Fond animé de la section Équipe : des rideaux d'aurore boréale aux
 * couleurs de la marque ondulent au-dessus d'un champ d'étoiles, tandis
 * qu'une constellation de nœuds lumineux — l'équipe, une constellation
 * de talents — se relie en réseau. Des impulsions dorées voyagent le
 * long des liens, des étoiles filantes traversent le ciel, et la
 * constellation réagit subtilement au curseur.
 *
 * L'aurore est rendue en basse résolution puis agrandie (flou naturel,
 * coût par frame minime). Respecte prefers-reduced-motion et se met en
 * pause hors du viewport.
 */

const MAX_DPR = 2;

interface Ribbon {
  baseY: number;                    // position verticale relative
  amp1: number; k1: number; s1: number;
  amp2: number; k2: number; s2: number;
  height: number;                   // hauteur du rideau (relative)
  color: [number, number, number];
  alpha: number;
  rayStep: number;                  // espacement des rayons verticaux (px offscreen)
}

const RIBBONS: Ribbon[] = [
  { baseY: 0.26, amp1: 0.035, k1: 1.1, s1: 0.14, amp2: 0.015, k2: 2.3, s2: 0.08, height: 0.2, color: [79, 156, 255], alpha: 0.3, rayStep: 7 },
  { baseY: 0.38, amp1: 0.04, k1: 0.8, s1: 0.1, amp2: 0.018, k2: 1.9, s2: 0.12, height: 0.15, color: [96, 214, 197], alpha: 0.22, rayStep: 8 },
  { baseY: 0.5, amp1: 0.032, k1: 0.65, s1: 0.12, amp2: 0.015, k2: 1.6, s2: 0.07, height: 0.11, color: [232, 178, 58], alpha: 0.13, rayStep: 9 },
];

interface Node {
  x: number; y: number;
  vx: number; vy: number;
  r: number;
  gold: boolean;
}

interface Pulse {
  ax: number; ay: number;
  bx: number; by: number;
  start: number;
  dur: number;
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

/** Pastille lumineuse pré-calculée (nœud de constellation). */
function buildDotSprite(rgb: [number, number, number]): HTMLCanvasElement {
  const S = 32;
  const c = document.createElement('canvas');
  c.width = S;
  c.height = S;
  const ctx = c.getContext('2d');
  if (!ctx) return c;
  const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  g.addColorStop(0, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.95)`);
  g.addColorStop(0.25, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.55)`);
  g.addColorStop(1, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0)`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S, S);
  return c;
}

/** Fond statique : dégradé profond + étoiles. */
function buildBackground(w: number, h: number, dpr: number): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.floor(w * dpr));
  c.height = Math.max(1, Math.floor(h * dpr));
  const ctx = c.getContext('2d');
  if (!ctx) return c;
  ctx.scale(dpr, dpr);

  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, '#040A1C');
  bg.addColorStop(0.6, '#081128');
  bg.addColorStop(1, '#0A1733');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  const rng = makeRng(4242);
  const count = Math.round((w * h) / 4200);
  for (let i = 0; i < count; i++) {
    const tint = rng();
    const a = 0.18 + rng() * 0.5;
    ctx.fillStyle = tint < 0.7
      ? `rgba(255,255,255,${a})`
      : tint < 0.9
        ? `rgba(185,214,255,${a})`
        : `rgba(255,224,176,${a})`;
    ctx.beginPath();
    ctx.arc(rng() * w, rng() * h, 0.3 + rng() * 0.9, 0, Math.PI * 2);
    ctx.fill();
  }

  // Halo discret en bas (horizon terrestre suggéré)
  const hor = ctx.createLinearGradient(0, h * 0.82, 0, h);
  hor.addColorStop(0, 'rgba(31,91,255,0)');
  hor.addColorStop(1, 'rgba(31,91,255,0.07)');
  ctx.fillStyle = hor;
  ctx.fillRect(0, h * 0.82, w, h * 0.18);

  return c;
}

const AuroraConstellationCanvas: React.FC = () => {
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
    let aurora: HTMLCanvasElement | null = null;
    let auroraCtx: CanvasRenderingContext2D | null = null;
    let aw = 0;
    let ah = 0;
    let nodes: Node[] = [];
    let twinkles: Twinkle[] = [];
    let pulses: Pulse[] = [];
    let nextPulseAt = 1.5;
    let linkDist = 150;
    let meteor: { x0: number; y0: number; vx: number; vy: number; start: number; dur: number } | null = null;
    let nextMeteorAt = 5;

    const whiteDot = buildDotSprite([238, 242, 248]);
    const goldDot = buildDotSprite([232, 178, 58]);

    const mouse = { x: -9999, y: -9999, active: false };
    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = mouse.y >= 0 && mouse.y <= rect.height;
    };
    const onPointerLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const rebuild = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, Math.round(rect.width));
      h = Math.max(1, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const isMobile = w < 768;

      bgCanvas = buildBackground(w, h, dpr);

      // Offscreen basse résolution pour l'aurore (flou naturel à l'agrandissement)
      aw = Math.max(150, Math.round(w / 6));
      ah = Math.max(100, Math.round(h / 6));
      aurora = document.createElement('canvas');
      aurora.width = aw;
      aurora.height = ah;
      auroraCtx = aurora.getContext('2d');

      // Constellation
      const rng = makeRng(90210);
      const nodeCount = isMobile ? 24 : 46;
      linkDist = Math.min(Math.max(w * 0.1, 110), 175);
      nodes = Array.from({ length: nodeCount }, () => ({
        x: rng() * w,
        y: rng() * h,
        vx: (rng() - 0.5) * 7,
        vy: (rng() - 0.5) * 7,
        r: 0.8 + rng() * 1.6,
        gold: rng() < 0.22,
      }));

      const twinkleRng = makeRng(31337);
      twinkles = Array.from({ length: isMobile ? 24 : 54 }, () => ({
        x: twinkleRng() * w,
        y: twinkleRng() * h,
        r: 0.5 + twinkleRng() * 0.9,
        alpha: 0.25 + twinkleRng() * 0.5,
        speed: 0.5 + twinkleRng() * 1.4,
        phase: twinkleRng() * Math.PI * 2,
      }));

      pulses = [];
    };

    // ── Aurore (dessinée en basse résolution) ─────────────────────
    const drawAurora = (t: number) => {
      if (!aurora || !auroraCtx) return;
      const o = auroraCtx;
      o.clearRect(0, 0, aw, ah);
      o.globalCompositeOperation = 'lighter';
      o.lineCap = 'round';

      for (let rI = 0; rI < RIBBONS.length; rI++) {
        const r = RIBBONS[rI];
        const [cr, cg, cb] = r.color;
        const baseAt = (x: number) =>
          r.baseY * ah +
          r.amp1 * ah * Math.sin((r.k1 * Math.PI * 2 * x) / aw + t * r.s1 + rI * 1.8) +
          r.amp2 * ah * Math.sin((r.k2 * Math.PI * 2 * x) / aw - t * r.s2 + rI);
        const heightAt = (x: number) =>
          r.height * ah *
          (0.75 + 0.25 * Math.sin((r.k2 * 0.7 * Math.PI * 2 * x) / aw + t * r.s1 * 0.7 + rI * 2.6));

        // Corps du rideau (brillant en bas, fondu vers le haut)
        const yTop = (r.baseY - r.height) * ah - r.amp1 * ah;
        const yBase = r.baseY * ah + (r.amp1 + r.amp2) * ah;
        const grad = o.createLinearGradient(0, yTop, 0, yBase);
        grad.addColorStop(0, `rgba(${cr},${cg},${cb},0)`);
        grad.addColorStop(0.75, `rgba(${cr},${cg},${cb},${r.alpha * 0.4})`);
        grad.addColorStop(1, `rgba(${cr},${cg},${cb},${r.alpha * 0.85})`);
        o.fillStyle = grad;
        o.beginPath();
        o.moveTo(0, baseAt(0));
        for (let x = 0; x <= aw; x += 6) o.lineTo(x, baseAt(x) - heightAt(x));
        o.lineTo(aw, baseAt(aw));
        for (let x = aw; x >= 0; x -= 6) o.lineTo(x, baseAt(x));
        o.closePath();
        o.fill();

        // Bord inférieur incandescent
        o.strokeStyle = `rgba(${cr},${cg},${cb},${r.alpha * 0.4})`;
        o.lineWidth = 1.1;
        o.beginPath();
        o.moveTo(0, baseAt(0));
        for (let x = 0; x <= aw; x += 4) o.lineTo(x, baseAt(x));
        o.stroke();

        // Rayons verticaux scintillants (structure en rideau)
        o.lineWidth = 1.6;
        for (let x = 0; x <= aw; x += r.rayStep) {
          const flicker =
            0.25 +
            0.75 * Math.abs(Math.sin(x * 1.13 + rI * 7) * Math.sin(x * 0.21 + t * (0.7 + r.s2 * 3)));
          const by = baseAt(x);
          const ry = heightAt(x) * (0.65 + 0.35 * Math.sin(x * 0.37 + t * 0.9 + rI));
          o.strokeStyle = `rgba(${cr},${cg},${cb},${r.alpha * 0.22 * flicker})`;
          o.beginPath();
          o.moveTo(x, by);
          o.lineTo(x, by - ry);
          o.stroke();
        }
      }
    };

    // ── Étoile filante ────────────────────────────────────────────
    const drawMeteor = (t: number) => {
      if (!meteor && t >= nextMeteorAt) {
        const rng = makeRng(Math.floor(t * 787));
        const fromLeft = rng() > 0.5;
        const speed = w / (2 + rng());
        meteor = {
          x0: fromLeft ? -30 : w + 30,
          y0: h * (0.05 + rng() * 0.3),
          vx: fromLeft ? speed : -speed,
          vy: speed * (0.14 + rng() * 0.12),
          start: t,
          dur: 2.4,
        };
        nextMeteorAt = t + 8 + rng() * 8;
      }
      if (!meteor) return;
      const p = (t - meteor.start) / meteor.dur;
      if (p >= 1) {
        meteor = null;
        return;
      }
      const env = Math.sin(Math.PI * p);
      const mx = meteor.x0 + meteor.vx * (t - meteor.start);
      const my = meteor.y0 + meteor.vy * (t - meteor.start);
      const nl = Math.hypot(meteor.vx, meteor.vy) || 1;
      const len = 80;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const tail = ctx.createLinearGradient(mx, my, mx - (meteor.vx / nl) * len, my - (meteor.vy / nl) * len);
      tail.addColorStop(0, `rgba(225,238,255,${0.7 * env})`);
      tail.addColorStop(1, 'rgba(225,238,255,0)');
      ctx.strokeStyle = tail;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(mx, my);
      ctx.lineTo(mx - (meteor.vx / nl) * len, my - (meteor.vy / nl) * len);
      ctx.stroke();
      ctx.fillStyle = `rgba(255,255,255,${0.85 * env})`;
      ctx.beginPath();
      ctx.arc(mx, my, 1.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    // ── Constellation ─────────────────────────────────────────────
    let lastT = 0;
    const drawConstellation = (t: number) => {
      const dt = Math.min(t - lastT, 0.05);
      lastT = t;

      // Dérive lente + douce attraction vers le curseur
      for (const n of nodes) {
        if (mouse.active) {
          const dx = mouse.x - n.x;
          const dy = mouse.y - n.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 180 * 180 && d2 > 1) {
            n.vx += (dx / Math.sqrt(d2)) * 2.2 * dt;
            n.vy += (dy / Math.sqrt(d2)) * 2.2 * dt;
          }
        }
        // amortissement pour rester contemplatif
        n.vx *= 0.995;
        n.vy *= 0.995;
        n.x += n.vx * dt;
        n.y += n.vy * dt;
        if (n.x < -10) n.x = w + 10;
        if (n.x > w + 10) n.x = -10;
        if (n.y < -10) n.y = h + 10;
        if (n.y > h + 10) n.y = -10;
      }

      // Liens
      ctx.lineWidth = 0.7;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist >= linkDist) continue;
          let alpha = (1 - dist / linkDist) * 0.16;
          if (mouse.active) {
            const md = Math.min(
              Math.hypot(mouse.x - a.x, mouse.y - a.y),
              Math.hypot(mouse.x - b.x, mouse.y - b.y),
            );
            if (md < 160) alpha *= 1.9;
          }
          const goldLink = a.gold && b.gold;
          ctx.strokeStyle = goldLink
            ? `rgba(232,178,58,${alpha * 1.4})`
            : `rgba(148,186,255,${alpha})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // Impulsions voyageant le long des liens
      if (t >= nextPulseAt && pulses.length < 3) {
        const rng = makeRng(Math.floor(t * 613));
        for (let attempt = 0; attempt < 24; attempt++) {
          const a = nodes[Math.floor(rng() * nodes.length)];
          const b = nodes[Math.floor(rng() * nodes.length)];
          if (a === b) continue;
          if (Math.hypot(a.x - b.x, a.y - b.y) < linkDist) {
            pulses.push({ ax: a.x, ay: a.y, bx: b.x, by: b.y, start: t, dur: 1.1 + rng() * 0.7 });
            break;
          }
        }
        nextPulseAt = t + 1.6 + makeRng(Math.floor(t * 271))() * 2.4;
      }
      pulses = pulses.filter((pl) => t - pl.start < pl.dur);
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (const pl of pulses) {
        const u = (t - pl.start) / pl.dur;
        const px = pl.ax + (pl.bx - pl.ax) * u;
        const py = pl.ay + (pl.by - pl.ay) * u;
        const trailU = Math.max(0, u - 0.18);
        const tx = pl.ax + (pl.bx - pl.ax) * trailU;
        const ty = pl.ay + (pl.by - pl.ay) * trailU;
        const env = Math.sin(Math.PI * u);
        const trail = ctx.createLinearGradient(px, py, tx, ty);
        trail.addColorStop(0, `rgba(232,178,58,${0.75 * env})`);
        trail.addColorStop(1, 'rgba(232,178,58,0)');
        ctx.strokeStyle = trail;
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(tx, ty);
        ctx.stroke();
        ctx.fillStyle = `rgba(255,225,150,${0.9 * env})`;
        ctx.beginPath();
        ctx.arc(px, py, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Nœuds
      for (const n of nodes) {
        const sprite = n.gold ? goldDot : whiteDot;
        const s = n.r * 7;
        ctx.drawImage(sprite, n.x - s / 2, n.y - s / 2, s, s);
      }
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

      drawAurora(t);
      if (aurora) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.drawImage(aurora, 0, 0, w, h);
        ctx.restore();
      }

      drawMeteor(t);
      drawConstellation(t);
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
      drawFrame(8);
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
        if (reducedMotion) drawFrame(8);
      }, 150);
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerleave', onPointerLeave);

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
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

export default AuroraConstellationCanvas;
