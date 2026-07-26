import { useEffect, useRef } from 'react';

/**
 * AfricaRadianceCanvas
 * Fond animé de la section À propos : le continent africain dessiné en
 * pointillés lumineux scintillants sur un ciel étoilé. Ouagadougou brille
 * comme une balise dorée pulsante d'où partent des arcs de lumière animés
 * vers les grandes capitales africaines — et au-delà des rives du
 * continent, vers le monde. « Ancrer une excellence technologique en
 * Afrique de l'Ouest et la faire rayonner bien au-delà. »
 *
 * Canvas 2D pur : grille de points pré-calculée (point-in-polygon),
 * arcs quadratiques animés, anneaux d'impact. Respecte
 * prefers-reduced-motion et se met en pause hors du viewport.
 */

const MAX_DPR = 2;

// ── Géographie (lon, lat) ─────────────────────────────────────────
// Silhouette simplifiée du continent africain
const AFRICA: Array<[number, number]> = [
  [-5.9, 35.8], [-2.2, 35.1], [3.2, 36.9], [10.3, 37.2], [11.1, 33.5],
  [15.3, 32.4], [20.1, 32.2], [25.0, 31.6], [29.9, 31.2], [32.3, 31.3],
  [34.2, 27.8], [37.2, 21.1], [39.7, 15.5], [43.3, 11.5], [51.4, 10.4],
  [50.8, 8.2], [46.0, 2.4], [41.5, -1.7], [39.2, -6.8], [40.4, -10.5],
  [40.5, -15.5], [35.0, -23.8], [32.6, -28.6], [27.9, -33.0], [18.4, -34.3],
  [17.1, -28.8], [14.5, -22.1], [11.8, -15.8], [12.2, -8.8], [9.7, -2.5],
  [8.8, 3.9], [5.6, 4.3], [3.4, 6.4], [-1.6, 5.0], [-4.4, 5.2],
  [-7.5, 4.3], [-11.5, 6.9], [-13.3, 9.5], [-16.6, 12.3], [-17.5, 14.7],
  [-16.5, 19.5], [-14.8, 25.2], [-9.8, 31.4], [-9.2, 33.6],
];

const MADAGASCAR: Array<[number, number]> = [
  [49.3, -12.1], [50.4, -15.7], [47.2, -24.9], [45.2, -25.6],
  [43.3, -22.3], [44.0, -16.2], [46.3, -12.6],
];

// Ouagadougou — le foyer
const OUAGA: [number, number] = [-1.52, 12.37];

// Destinations des arcs : capitales africaines, puis le monde (hors carte)
const TARGETS: Array<{ ll: [number, number]; world?: boolean }> = [
  { ll: [-17.45, 14.7] },   // Dakar
  { ll: [-4.02, 5.34] },    // Abidjan
  { ll: [3.38, 6.45] },     // Lagos
  { ll: [-7.62, 33.6] },    // Casablanca
  { ll: [31.24, 30.05] },   // Le Caire
  { ll: [36.82, -1.29] },   // Nairobi
  { ll: [15.31, -4.33] },   // Kinshasa
  { ll: [28.05, -26.2] },   // Johannesburg
  { ll: [38.75, 9.02] },    // Addis-Abeba
  { ll: [-8.0, 12.65] },    // Bamako
  { ll: [2.35, 48.85], world: true },   // vers l'Europe
  { ll: [-74.0, 40.7], world: true },   // vers les Amériques
  { ll: [77.2, 28.6], world: true },    // vers l'Asie
];

const LON_MIN = -18;
const LON_MAX = 52;
const LAT_MIN = -35.5;
const LAT_MAX = 38;

interface Dot {
  x: number;
  y: number;
  r: number;
  phase: number;
  speed: number;
  gold: boolean;
}

interface ArcSlot {
  targetIdx: number;
  start: number;
  dur: number;
  side: 1 | -1;
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

function pointInPoly(px: number, py: number, poly: Array<[number, number]>): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if ((yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

/** Fond statique : dégradé profond + étoiles discrètes. */
function buildBackground(w: number, h: number, dpr: number): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.floor(w * dpr));
  c.height = Math.max(1, Math.floor(h * dpr));
  const ctx = c.getContext('2d');
  if (!ctx) return c;
  ctx.scale(dpr, dpr);

  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, '#050C20');
  bg.addColorStop(0.5, '#081128');
  bg.addColorStop(1, '#0A1733');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  const rng = makeRng(777001);
  const count = Math.round((w * h) / 5200);
  for (let i = 0; i < count; i++) {
    const tint = rng();
    const a = 0.15 + rng() * 0.45;
    ctx.fillStyle = tint < 0.72
      ? `rgba(255,255,255,${a})`
      : tint < 0.9
        ? `rgba(185,214,255,${a})`
        : `rgba(255,224,176,${a})`;
    ctx.beginPath();
    ctx.arc(rng() * w, rng() * h, 0.3 + rng() * 0.8, 0, Math.PI * 2);
    ctx.fill();
  }
  return c;
}

const AfricaRadianceCanvas: React.FC = () => {
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
    let dots: Dot[] = [];
    let outline: Array<[number, number]> = [];
    let outlineMada: Array<[number, number]> = [];
    let beacon: [number, number] = [0, 0];
    let targetsPx: Array<{ x: number; y: number; world?: boolean }> = [];
    let twinkles: Twinkle[] = [];
    let arcs: ArcSlot[] = [];
    let arcOrder: number[] = [];
    let arcOrderPos = 0;
    let nextArcAt = 0.6;
    let dim = 1;            // atténuation globale (mobile : carte derrière le texte)
    let mapScale = 1;       // échelle relative pour tailles de traits

    const projFactory = (mapX: number, mapY: number, mapW: number, mapH: number) =>
      (lon: number, lat: number): [number, number] => [
        mapX + ((lon - LON_MIN) / (LON_MAX - LON_MIN)) * mapW,
        mapY + ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * mapH,
      ];

    const rebuild = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, Math.round(rect.width));
      h = Math.max(1, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      bgCanvas = buildBackground(w, h, dpr);

      // ── Cadrage de la carte ──
      // Desktop (texte à gauche) : carte derrière la colonne de droite.
      // Mobile (colonnes empilées) : carte centrée, plus discrète.
      const desktop = w >= 1024;
      const aspect = (LON_MAX - LON_MIN) / (LAT_MAX - LAT_MIN); // ≈ 0.95
      let mapH = desktop ? h * 0.84 : Math.min(h * 0.62, w * 1.05 / aspect);
      let mapW = mapH * aspect;
      const maxW = desktop ? w * 0.52 : w * 0.9;
      if (mapW > maxW) {
        mapW = maxW;
        mapH = mapW / aspect;
      }
      const cx = desktop ? w * 0.7 : w * 0.5;
      const cy = desktop ? h * 0.52 : h * 0.5;
      const mapX = cx - mapW / 2;
      const mapY = cy - mapH / 2;
      dim = desktop ? 1 : 0.55;
      mapScale = mapH / 560;

      const proj = projFactory(mapX, mapY, mapW, mapH);
      const africaPx = AFRICA.map(([lon, lat]) => proj(lon, lat));
      const madaPx = MADAGASCAR.map(([lon, lat]) => proj(lon, lat));
      outline = africaPx;
      outlineMada = madaPx;
      beacon = proj(OUAGA[0], OUAGA[1]);
      targetsPx = TARGETS.map((tg) => {
        const [x, y] = proj(tg.ll[0], tg.ll[1]);
        return { x, y, world: tg.world };
      });

      // ── Grille de points du continent ──
      const rng = makeRng(20260726);
      const step = mapH / (desktop ? 50 : 40);
      dots = [];
      for (let gy = mapY; gy <= mapY + mapH; gy += step) {
        for (let gx = mapX; gx <= mapX + mapW; gx += step) {
          const jx = gx + (rng() - 0.5) * step * 0.5;
          const jy = gy + (rng() - 0.5) * step * 0.5;
          if (pointInPoly(jx, jy, africaPx) || pointInPoly(jx, jy, madaPx)) {
            dots.push({
              x: jx,
              y: jy,
              r: (0.85 + rng() * 0.75) * Math.max(mapScale, 0.6),
              phase: rng() * Math.PI * 2,
              speed: 0.4 + rng() * 1.1,
              gold: rng() < 0.06,
            });
          }
        }
      }

      const twinkleRng = makeRng(880088);
      twinkles = Array.from({ length: desktop ? 40 : 20 }, () => ({
        x: twinkleRng() * w,
        y: twinkleRng() * h,
        r: 0.5 + twinkleRng() * 0.8,
        alpha: 0.2 + twinkleRng() * 0.4,
        speed: 0.5 + twinkleRng() * 1.3,
        phase: twinkleRng() * Math.PI * 2,
      }));

      // Ordre de visite des cibles (monde intercalé régulièrement)
      const order = TARGETS.map((_, i) => i);
      for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
      }
      arcOrder = order;
      arcOrderPos = 0;
      arcs = [];
      nextArcAt = 0.6;
    };

    // ── Arcs lumineux ─────────────────────────────────────────────
    const spawnArc = (t: number) => {
      const targetIdx = arcOrder[arcOrderPos % arcOrder.length];
      arcOrderPos++;
      arcs.push({
        targetIdx,
        start: t,
        dur: TARGETS[targetIdx].world ? 5.2 : 4.2,
        side: arcOrderPos % 2 === 0 ? 1 : -1,
      });
    };

    const drawArcs = (t: number) => {
      arcs = arcs.filter((a) => t - a.start < a.dur);
      if (t >= nextArcAt && arcs.length < 3) {
        spawnArc(t);
        nextArcAt = t + 1.4 + makeRng(Math.floor(t * 331))() * 1.2;
      }

      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineCap = 'round';
      for (const a of arcs) {
        const tg = targetsPx[a.targetIdx];
        const p = (t - a.start) / a.dur;
        // enveloppe : tracé (0→0.35), impulsion (0.35→0.78), extinction (0.78→1)
        const drawP = Math.min(p / 0.35, 1);
        const fade = p > 0.78 ? 1 - (p - 0.78) / 0.22 : 1;
        const [bx, by] = beacon;
        const dx = tg.x - bx;
        const dy = tg.y - by;
        const dist = Math.hypot(dx, dy);
        const bulge = Math.min(dist * 0.24, h * 0.16) * a.side;
        const mx = (bx + tg.x) / 2 - (dy / (dist || 1)) * bulge;
        const my = (by + tg.y) / 2 + (dx / (dist || 1)) * bulge;

        const isWorld = !!tg.world;
        const [cr, cg, cb] = isWorld ? [232, 178, 58] : [110, 170, 255];
        const baseAlpha = (isWorld ? 0.5 : 0.42) * fade * dim;

        // tracé progressif de l'arc
        const N = 40;
        const maxU = drawP * (isWorld ? 0.86 : 1); // les arcs "monde" s'évanouissent au bord
        ctx.beginPath();
        for (let k = 0; k <= N; k++) {
          const u = (k / N) * maxU;
          const mu = 1 - u;
          const qx = mu * mu * bx + 2 * mu * u * mx + u * u * tg.x;
          const qy = mu * mu * by + 2 * mu * u * my + u * u * tg.y;
          if (k === 0) ctx.moveTo(qx, qy);
          else ctx.lineTo(qx, qy);
        }
        const grad = ctx.createLinearGradient(bx, by, tg.x, tg.y);
        grad.addColorStop(0, `rgba(${cr},${cg},${cb},${baseAlpha})`);
        grad.addColorStop(1, `rgba(${cr},${cg},${cb},${isWorld ? 0 : baseAlpha * 0.8})`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.2 * Math.max(mapScale, 0.7);
        ctx.stroke();

        // impulsion voyageant le long de l'arc
        if (p > 0.35 && p < 0.8) {
          const u = ((p - 0.35) / 0.45) * maxU;
          const mu = 1 - u;
          const px = mu * mu * bx + 2 * mu * u * mx + u * u * tg.x;
          const py = mu * mu * by + 2 * mu * u * my + u * u * tg.y;
          const halo = ctx.createRadialGradient(px, py, 0, px, py, 7 * mapScale + 3);
          halo.addColorStop(0, `rgba(255,244,214,${0.85 * fade * dim})`);
          halo.addColorStop(0.4, `rgba(${cr},${cg},${cb},${0.4 * fade * dim})`);
          halo.addColorStop(1, `rgba(${cr},${cg},${cb},0)`);
          ctx.fillStyle = halo;
          ctx.beginPath();
          ctx.arc(px, py, 7 * mapScale + 3, 0, Math.PI * 2);
          ctx.fill();
        }

        // anneau d'impact à l'arrivée (villes africaines seulement)
        if (!isWorld && p > 0.72) {
          const rp = Math.min((p - 0.72) / 0.28, 1);
          const rr = (4 + rp * 14) * Math.max(mapScale, 0.7);
          ctx.strokeStyle = `rgba(${cr},${cg},${cb},${(1 - rp) * 0.5 * dim})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(tg.x, tg.y, rr, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = `rgba(210,230,255,${(1 - rp * 0.5) * 0.7 * dim})`;
          ctx.beginPath();
          ctx.arc(tg.x, tg.y, 1.6 * Math.max(mapScale, 0.7), 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    };

    // ── Balise de Ouagadougou ─────────────────────────────────────
    const drawBeacon = (t: number) => {
      const [bx, by] = beacon;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';

      // halo respirant
      const breath = 1 + 0.12 * Math.sin(t * 2.1);
      const R = (13 * mapScale + 6) * breath;
      const halo = ctx.createRadialGradient(bx, by, 0, bx, by, R);
      halo.addColorStop(0, `rgba(255,220,130,${0.75 * dim})`);
      halo.addColorStop(0.35, `rgba(232,178,58,${0.35 * dim})`);
      halo.addColorStop(1, 'rgba(232,178,58,0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(bx, by, R, 0, Math.PI * 2);
      ctx.fill();

      // cœur
      ctx.fillStyle = `rgba(255,240,200,${0.95 * dim})`;
      ctx.beginPath();
      ctx.arc(bx, by, 2.4 * Math.max(mapScale, 0.7), 0, Math.PI * 2);
      ctx.fill();

      // ondes concentriques
      for (let i = 0; i < 2; i++) {
        const rp = ((t * 0.42 + i * 0.5) % 1);
        const rr = rp * (30 * mapScale + 14);
        ctx.strokeStyle = `rgba(232,178,58,${(1 - rp) * 0.45 * dim})`;
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.arc(bx, by, rr, 0, Math.PI * 2);
        ctx.stroke();
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

      // Côtes du continent (trait discret)
      ctx.strokeStyle = `rgba(120,170,255,${0.13 * dim})`;
      ctx.lineWidth = 1;
      for (const poly of [outline, outlineMada]) {
        if (poly.length === 0) continue;
        ctx.beginPath();
        ctx.moveTo(poly[0][0], poly[0][1]);
        for (let i = 1; i < poly.length; i++) ctx.lineTo(poly[i][0], poly[i][1]);
        ctx.closePath();
        ctx.stroke();
      }

      // Continent en pointillés scintillants
      for (const d of dots) {
        const tw = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * d.speed + d.phase));
        const a = (d.gold ? 0.8 : 0.5) * tw * dim;
        ctx.fillStyle = d.gold
          ? `rgba(232,178,58,${a})`
          : `rgba(108,166,255,${a})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }

      drawArcs(t);
      drawBeacon(t);
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
      // composition figée : deux arcs à mi-course
      arcs = [
        { targetIdx: 0, start: -1.6, dur: 4.2, side: 1 },
        { targetIdx: 10, start: -2.2, dur: 5.2, side: -1 },
      ];
      drawFrame(0.4);
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
        if (reducedMotion) drawFrame(0.4);
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

export default AfricaRadianceCanvas;
