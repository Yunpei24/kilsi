import { useEffect, useRef } from 'react';

/**
 * ContactSignalCanvas
 * Fond animé de la section Contact : une balise d'émission posée sur un
 * horizon en perspective envoie des ondes concentriques dans la nuit.
 * Des messages — de petites enveloppes lumineuses dorées — s'élancent
 * vers le ciel le long d'arcs, et des réponses bleues reviennent se poser
 * sur la balise. Le dialogue, mis en image : « Construisons ensemble. »
 *
 * Canvas 2D pur : fond statique pré-rendu (dégradé, étoiles, grille
 * d'horizon), enveloppes en sprites, arcs quadratiques animés.
 * Respecte prefers-reduced-motion et se met en pause hors du viewport.
 */

const MAX_DPR = 2;

interface Ripple {
  start: number;
  dur: number;
}

interface Message {
  start: number;
  dur: number;
  outgoing: boolean;      // true : part de la balise · false : réponse entrante
  tx: number;             // destination (ratio de largeur)
  ty: number;             // destination (ratio de hauteur)
  bulge: number;          // courbure de l'arc
  spin: number;           // léger balancement
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

/** Sprite d'enveloppe lumineuse (message). */
function buildEnvelope(rgb: [number, number, number]): HTMLCanvasElement {
  const W = 72;
  const H = 60;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const ctx = c.getContext('2d');
  if (!ctx) return c;
  const [r, g, b] = rgb;

  // halo
  const halo = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W / 2);
  halo.addColorStop(0, `rgba(${r},${g},${b},0.5)`);
  halo.addColorStop(0.45, `rgba(${r},${g},${b},0.14)`);
  halo.addColorStop(1, `rgba(${r},${g},${b},0)`);
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, W, H);

  // corps de l'enveloppe
  const ew = 30;
  const eh = 21;
  const ex = (W - ew) / 2;
  const ey = (H - eh) / 2;
  ctx.fillStyle = 'rgba(9,20,45,0.85)';
  ctx.beginPath();
  ctx.roundRect(ex, ey, ew, eh, 3);
  ctx.fill();
  ctx.strokeStyle = `rgba(${r},${g},${b},0.95)`;
  ctx.lineWidth = 1.8;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.roundRect(ex, ey, ew, eh, 3);
  ctx.stroke();

  // rabat
  ctx.strokeStyle = `rgba(255,255,255,0.9)`;
  ctx.lineWidth = 1.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(ex + 2.5, ey + 3.5);
  ctx.lineTo(ex + ew / 2, ey + eh * 0.6);
  ctx.lineTo(ex + ew - 2.5, ey + 3.5);
  ctx.stroke();

  return c;
}

/** Fond statique : dégradé nocturne, étoiles, grille d'horizon en perspective. */
function buildBackground(w: number, h: number, dpr: number): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.floor(w * dpr));
  c.height = Math.max(1, Math.floor(h * dpr));
  const ctx = c.getContext('2d');
  if (!ctx) return c;
  ctx.scale(dpr, dpr);

  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, '#040A1C');
  bg.addColorStop(0.45, '#071026');
  bg.addColorStop(0.78, '#0A1733');
  bg.addColorStop(1, '#0C1B3C');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  const rng = makeRng(90210);
  const horizon = h * 0.8;

  // étoiles (au-dessus de l'horizon)
  const count = Math.round((w * horizon) / 5200);
  for (let i = 0; i < count; i++) {
    const tint = rng();
    const a = 0.14 + rng() * 0.45;
    ctx.fillStyle = tint < 0.72
      ? `rgba(255,255,255,${a})`
      : tint < 0.9
        ? `rgba(185,214,255,${a})`
        : `rgba(255,224,176,${a})`;
    ctx.beginPath();
    ctx.arc(rng() * w, rng() * horizon, 0.3 + rng() * 0.85, 0, Math.PI * 2);
    ctx.fill();
  }

  // lueur d'horizon
  const glow = ctx.createLinearGradient(0, horizon - h * 0.14, 0, horizon);
  glow.addColorStop(0, 'rgba(79,156,255,0)');
  glow.addColorStop(1, 'rgba(79,156,255,0.09)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, horizon - h * 0.14, w, h * 0.14);
  ctx.strokeStyle = 'rgba(120,175,255,0.18)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, horizon);
  ctx.lineTo(w, horizon);
  ctx.stroke();

  // grille en perspective sous l'horizon
  const vpX = w * 0.5;
  ctx.strokeStyle = 'rgba(100,160,255,0.1)';
  ctx.lineWidth = 1;
  for (let i = -14; i <= 14; i++) {
    ctx.beginPath();
    ctx.moveTo(vpX + i * (w * 0.035), horizon);
    ctx.lineTo(vpX + i * (w * 0.42), h);
    ctx.stroke();
  }
  // lignes de fuite horizontales (espacement croissant)
  for (let k = 1; k <= 8; k++) {
    const u = k / 8;
    const y = horizon + Math.pow(u, 2.1) * (h - horizon);
    ctx.strokeStyle = `rgba(100,160,255,${0.11 * (1 - u * 0.55)})`;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  return c;
}

const ContactSignalCanvas: React.FC = () => {
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
    let twinkles: Twinkle[] = [];
    let ripples: Ripple[] = [];
    let messages: Message[] = [];
    let nextRippleAt = 0.4;
    let nextMessageAt = 1.2;
    let msgSeed = 0;
    let baseX = 0;
    let baseY = 0;
    let scale = 1;

    const goldEnvelope = buildEnvelope([232, 178, 58]);
    const blueEnvelope = buildEnvelope([96, 168, 255]);

    const rebuild = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, Math.round(rect.width));
      h = Math.max(1, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      bgCanvas = buildBackground(w, h, dpr);

      const desktop = w >= 1024;
      // La balise se pose sur l'horizon, décalée pour ne pas gêner le contenu
      baseX = desktop ? w * 0.82 : w * 0.5;
      baseY = h * 0.8;
      scale = Math.max(Math.min(w, h) / 900, 0.55);

      const rng = makeRng(5150750);
      twinkles = Array.from({ length: desktop ? 34 : 18 }, () => ({
        x: rng() * w,
        y: rng() * h * 0.78,
        r: 0.5 + rng() * 0.8,
        alpha: 0.2 + rng() * 0.45,
        speed: 0.5 + rng() * 1.3,
        phase: rng() * Math.PI * 2,
      }));

      ripples = [];
      messages = [];
      nextRippleAt = 0.4;
      nextMessageAt = 1.2;
      msgSeed = 0;
    };

    /** Position sur l'arc d'un message (Bézier quadratique). */
    const messagePoint = (m: Message, u: number): [number, number] => {
      const dx = m.tx * w;
      const dy = m.ty * h;
      const [x0, y0, x1, y1] = m.outgoing
        ? [baseX, baseY, dx, dy]
        : [dx, dy, baseX, baseY];
      const mx = (x0 + x1) / 2 + m.bulge * w * 0.12;
      const my = (y0 + y1) / 2 - Math.abs(m.bulge) * h * 0.18;
      const mu = 1 - u;
      return [
        mu * mu * x0 + 2 * mu * u * mx + u * u * x1,
        mu * mu * y0 + 2 * mu * u * my + u * u * y1,
      ];
    };

    // ── Ondes concentriques de la balise ──────────────────────────
    const drawRipples = (t: number) => {
      ripples = ripples.filter((r) => t - r.start < r.dur);
      if (t >= nextRippleAt) {
        ripples.push({ start: t, dur: 4.6 });
        nextRippleAt = t + 1.5;
      }

      ctx.save();
      for (const r of ripples) {
        const p = (t - r.start) / r.dur;
        const rr = Math.pow(p, 0.72) * Math.max(w, h) * 0.42;
        const fade = (1 - p) * 0.42;
        // ellipse aplatie : l'onde court sur le sol
        ctx.strokeStyle = `rgba(232,178,58,${fade})`;
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.ellipse(baseX, baseY, rr, rr * 0.26, 0, 0, Math.PI * 2);
        ctx.stroke();
        // écho bleuté légèrement en retard
        ctx.strokeStyle = `rgba(96,168,255,${fade * 0.5})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(baseX, baseY, rr * 0.86, rr * 0.86 * 0.26, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    };

    // ── Balise d'émission ─────────────────────────────────────────
    const drawBeacon = (t: number) => {
      const breath = 1 + 0.12 * Math.sin(t * 2);
      const mastH = 46 * scale;

      ctx.save();
      // mât
      ctx.strokeStyle = 'rgba(150,192,255,0.5)';
      ctx.lineWidth = 1.8;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(baseX, baseY);
      ctx.lineTo(baseX, baseY - mastH);
      ctx.stroke();
      // haubans
      ctx.strokeStyle = 'rgba(150,192,255,0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(baseX - 13 * scale, baseY);
      ctx.lineTo(baseX, baseY - mastH * 0.78);
      ctx.lineTo(baseX + 13 * scale, baseY);
      ctx.stroke();

      // antenne : deux arcs d'émission
      ctx.strokeStyle = `rgba(232,178,58,${0.45 + 0.25 * Math.sin(t * 2)})`;
      ctx.lineWidth = 1.4;
      for (let k = 1; k <= 2; k++) {
        const rr = (7 + k * 5) * scale * breath;
        ctx.beginPath();
        ctx.arc(baseX, baseY - mastH, rr, -Math.PI * 0.86, -Math.PI * 0.14);
        ctx.stroke();
      }

      ctx.globalCompositeOperation = 'lighter';
      // lampe au sommet
      const R = 14 * scale * breath;
      const g = ctx.createRadialGradient(baseX, baseY - mastH, 0, baseX, baseY - mastH, R);
      g.addColorStop(0, 'rgba(255,232,170,0.85)');
      g.addColorStop(0.35, 'rgba(232,178,58,0.35)');
      g.addColorStop(1, 'rgba(232,178,58,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(baseX, baseY - mastH, R, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,245,215,0.95)';
      ctx.beginPath();
      ctx.arc(baseX, baseY - mastH, 2.2 * scale, 0, Math.PI * 2);
      ctx.fill();

      // reflet au sol
      const floor = ctx.createRadialGradient(baseX, baseY, 0, baseX, baseY, 60 * scale);
      floor.addColorStop(0, 'rgba(232,178,58,0.16)');
      floor.addColorStop(1, 'rgba(232,178,58,0)');
      ctx.fillStyle = floor;
      ctx.beginPath();
      ctx.ellipse(baseX, baseY, 60 * scale, 16 * scale, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    // ── Messages en vol ───────────────────────────────────────────
    const drawMessages = (t: number) => {
      messages = messages.filter((m) => t - m.start < m.dur);
      if (t >= nextMessageAt && messages.length < 4) {
        const rng = makeRng(9001 + msgSeed++ * 7717);
        const outgoing = msgSeed % 3 !== 0; // 2 départs pour 1 réponse
        messages.push({
          start: t,
          dur: 4.6 + rng() * 1.6,
          outgoing,
          tx: 0.06 + rng() * 0.34,
          ty: 0.08 + rng() * 0.3,
          bulge: (rng() - 0.5) * 2,
          spin: (rng() - 0.5) * 0.5,
        });
        nextMessageAt = t + 1.5 + rng() * 1.4;
      }

      for (const m of messages) {
        const p = (t - m.start) / m.dur;
        const u = Math.min(p / 0.9, 1);
        const fade = p < 0.1 ? p / 0.1 : p > 0.82 ? Math.max(0, (1 - p) / 0.18) : 1;
        const [x, y] = messagePoint(m, u);
        const [cr, cg, cb] = m.outgoing ? [232, 178, 58] : [96, 168, 255];

        // sillage
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.beginPath();
        const N = 14;
        for (let k = 0; k <= N; k++) {
          const uu = Math.max(0, u - (k / N) * 0.22);
          const [qx, qy] = messagePoint(m, uu);
          if (k === 0) ctx.moveTo(qx, qy);
          else ctx.lineTo(qx, qy);
        }
        const [hx, hy] = messagePoint(m, Math.max(0, u - 0.22));
        const grad = ctx.createLinearGradient(x, y, hx, hy);
        grad.addColorStop(0, `rgba(${cr},${cg},${cb},${0.5 * fade})`);
        grad.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.4;
        ctx.lineCap = 'round';
        ctx.stroke();
        ctx.restore();

        // enveloppe, légèrement balancée
        const sprite = m.outgoing ? goldEnvelope : blueEnvelope;
        const size = 62 * scale;
        ctx.save();
        ctx.globalAlpha = fade;
        ctx.translate(x, y);
        ctx.rotate(Math.sin(t * 1.6 + m.start) * 0.12 + m.spin * 0.3);
        ctx.drawImage(sprite, -size / 2, -size / 2, size, size);
        ctx.restore();

        // éclat à l'arrivée d'une réponse
        if (!m.outgoing && p > 0.86) {
          const rp = (p - 0.86) / 0.14;
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          ctx.strokeStyle = `rgba(96,168,255,${(1 - rp) * 0.5})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(baseX, baseY - 46 * scale, 6 + rp * 26 * scale, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
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

      drawRipples(t);
      drawBeacon(t);
      drawMessages(t);
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
      // Première image synchrone : la section n'est jamais vide, même si
      // l'animation démarre une frame plus tard (ou reste bridée).
      drawFrame((performance.now() - t0) / 1000);
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    rebuild();
    if (reducedMotion) {
      drawFrame(2.6);
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
        // Redessine tout de suite : sans cela, un canvas en pause (hors
        // écran ou mouvement réduit) resterait vide après redimensionnement.
        drawFrame(reducedMotion ? 2.6 : (performance.now() - t0) / 1000);
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

export default ContactSignalCanvas;
