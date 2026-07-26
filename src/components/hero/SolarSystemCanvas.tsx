import { useEffect, useRef } from 'react';

/**
 * SolarSystemCanvas
 * Fond animé du hero : la Voie lactée en toile de fond (champ d'étoiles,
 * bande galactique, galaxies lointaines), un soleil luminescent parcouru
 * d'éruptions solaires, et les huit planètes du système solaire — chacune
 * texturée (cratères de Mercure, bandes de Jupiter, anneaux de Saturne,
 * Terre + Lune…) — en orbite elliptique inclinée autour du soleil.
 *
 * Tout est rendu en Canvas 2D : sprites pré-calculés hors écran, éclairage
 * jour/nuit orienté vers le soleil, ceinture d'astéroïdes, comètes.
 * Respecte prefers-reduced-motion (rendu statique) et se met en pause
 * quand le hero sort du viewport.
 */

// ── Réglages généraux ─────────────────────────────────────────────
const ORBIT_TILT = 0.4;          // ry / rx des ellipses orbitales
const BASE_PERIOD = 16;          // période orbitale de Mercure (s)
const SPRITE_OVERSAMPLE = 4;     // sur-échantillonnage des textures planètes
const MAX_DPR = 2;

interface PlanetDef {
  name: string;
  radius: number;                 // rayon (px) pour un soleil de référence 130px
  phase: number;                  // angle initial sur l'orbite
  rings?: boolean;                // anneaux (Saturne)
  moon?: boolean;                 // lune (Terre)
  paint: (ctx: CanvasRenderingContext2D, R: number) => void;
}

interface PlanetRuntime {
  def: PlanetDef;
  sprite: HTMLCanvasElement;
  half: number;                   // demi-taille du sprite (px)
  drawR: number;                  // rayon dessiné (px)
  rx: number;
  ry: number;
  omega: number;                  // vitesse angulaire (rad/s)
}

interface FlareSlot {
  baseAngle: number;
  span: number;
  height: number;
  period: number;
  offset: number;
}

interface CoronaStreamer {
  angle: number;                  // direction du jet
  width: number;                  // épaisseur relative au rayon solaire
  lenBase: number;                // longueur de base (× sunR)
  lenAmp: number;                 // amplitude de respiration
  speed: number;                  // vitesse de respiration
  phase: number;
  alpha: number;
  drift: number;                  // lente rotation individuelle
}

interface TwinkleStar {
  x: number;
  y: number;
  r: number;
  alpha: number;
  speed: number;
  phase: number;
  gold: boolean;
}

interface Asteroid {
  angle: number;
  omega: number;
  rJit: number;
  size: number;
  alpha: number;
}

// ── Aides dessin ──────────────────────────────────────────────────

/** Dégradé sphérique de base (volume). */
function sphereBase(ctx: CanvasRenderingContext2D, R: number, inner: string, outer: string) {
  const g = ctx.createRadialGradient(R * 0.72, R * 0.7, R * 0.1, R, R, R);
  g.addColorStop(0, inner);
  g.addColorStop(1, outer);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(R, R, R, 0, Math.PI * 2);
  ctx.fill();
}

/** Bandes horizontales ondulées, clippées dans le disque. */
function paintBands(ctx: CanvasRenderingContext2D, R: number, colors: string[], waviness = 0.06) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(R, R, R * 0.995, 0, Math.PI * 2);
  ctx.clip();
  const n = colors.length;
  const bandH = (2 * R) / n;
  for (let i = 0; i < n; i++) {
    ctx.fillStyle = colors[i];
    ctx.beginPath();
    const y0 = i * bandH + Math.sin(i * 2.1) * R * waviness;
    ctx.moveTo(-R, y0);
    for (let x = 0; x <= 2 * R; x += R / 6) {
      ctx.lineTo(x, y0 + Math.sin(x / R * 3 + i * 1.7) * R * waviness);
    }
    ctx.lineTo(2 * R + R, y0);
    ctx.lineTo(2 * R + R, y0 + bandH * 1.3);
    ctx.lineTo(-R, y0 + bandH * 1.3);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

/** Mouchetis (cratères, maria, nuages…) dans le disque. */
function paintSpeckles(
  ctx: CanvasRenderingContext2D,
  R: number,
  count: number,
  color: string,
  minR: number,
  maxR: number,
  rng: () => number,
) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(R, R, R * 0.98, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = color;
  for (let i = 0; i < count; i++) {
    const a = rng() * Math.PI * 2;
    const d = Math.sqrt(rng()) * R * 0.92;
    const r = (minR + rng() * (maxR - minR)) * R;
    ctx.beginPath();
    ctx.arc(R + Math.cos(a) * d, R + Math.sin(a) * d, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/** Petit générateur pseudo-aléatoire déterministe (textures stables). */
function makeRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

// ── Définition des 8 planètes ─────────────────────────────────────
const PLANET_DEFS: PlanetDef[] = [
  {
    name: 'Mercure', radius: 5, phase: 3.7,
    paint: (ctx, R) => {
      const rng = makeRng(11);
      sphereBase(ctx, R, '#A79A88', '#5E5348');
      paintSpeckles(ctx, R, 16, 'rgba(60,52,44,0.35)', 0.05, 0.16, rng);
      paintSpeckles(ctx, R, 10, 'rgba(200,190,175,0.18)', 0.03, 0.08, rng);
    },
  },
  {
    name: 'Vénus', radius: 8.5, phase: 4.5,
    paint: (ctx, R) => {
      sphereBase(ctx, R, '#F2E0B2', '#C09A5A');
      paintBands(ctx, R, [
        'rgba(233,209,160,0.55)', 'rgba(214,180,120,0.5)', 'rgba(240,222,180,0.55)',
        'rgba(205,168,105,0.5)', 'rgba(235,214,168,0.55)', 'rgba(210,175,115,0.45)',
      ], 0.09);
      // voile nuageux
      const haze = ctx.createRadialGradient(R, R, R * 0.5, R, R, R);
      haze.addColorStop(0, 'rgba(255,245,220,0.1)');
      haze.addColorStop(1, 'rgba(255,245,220,0)');
      ctx.fillStyle = haze;
      ctx.beginPath();
      ctx.arc(R, R, R, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  {
    name: 'Terre', radius: 9.5, phase: 5.35, moon: true,
    paint: (ctx, R) => {
      const rng = makeRng(42);
      sphereBase(ctx, R, '#3F7FE8', '#173C8F');
      // continents
      ctx.save();
      ctx.beginPath();
      ctx.arc(R, R, R * 0.98, 0, Math.PI * 2);
      ctx.clip();
      for (let i = 0; i < 7; i++) {
        const cx = R + (rng() - 0.5) * R * 1.5;
        const cy = R + (rng() - 0.5) * R * 1.5;
        const col = rng() > 0.45 ? 'rgba(72,142,66,0.9)' : 'rgba(120,150,70,0.9)';
        ctx.fillStyle = col;
        for (let b = 0; b < 5; b++) {
          ctx.beginPath();
          ctx.arc(cx + (rng() - 0.5) * R * 0.5, cy + (rng() - 0.5) * R * 0.4, R * (0.1 + rng() * 0.16), 0, Math.PI * 2);
          ctx.fill();
        }
      }
      // calottes polaires
      ctx.fillStyle = 'rgba(245,250,255,0.85)';
      ctx.beginPath();
      ctx.ellipse(R, R * 0.16, R * 0.42, R * 0.16, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(R * 1.05, R * 1.86, R * 0.38, R * 0.14, 0, 0, Math.PI * 2);
      ctx.fill();
      // nuages
      ctx.fillStyle = 'rgba(255,255,255,0.32)';
      for (let i = 0; i < 9; i++) {
        ctx.beginPath();
        ctx.ellipse(
          R + (rng() - 0.5) * R * 1.7, R + (rng() - 0.5) * R * 1.6,
          R * (0.16 + rng() * 0.2), R * (0.05 + rng() * 0.05),
          rng() * Math.PI, 0, Math.PI * 2,
        );
        ctx.fill();
      }
      ctx.restore();
      // atmosphère
      ctx.strokeStyle = 'rgba(140,195,255,0.55)';
      ctx.lineWidth = R * 0.07;
      ctx.shadowColor = 'rgba(120,180,255,0.9)';
      ctx.shadowBlur = R * 0.3;
      ctx.beginPath();
      ctx.arc(R, R, R * 0.985, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
    },
  },
  {
    name: 'Mars', radius: 6.5, phase: 4.05,
    paint: (ctx, R) => {
      const rng = makeRng(7);
      sphereBase(ctx, R, '#D4703F', '#7E3418');
      paintSpeckles(ctx, R, 12, 'rgba(90,35,15,0.3)', 0.06, 0.2, rng);
      paintSpeckles(ctx, R, 8, 'rgba(235,160,110,0.22)', 0.04, 0.1, rng);
      // calotte polaire
      ctx.fillStyle = 'rgba(250,250,250,0.9)';
      ctx.beginPath();
      ctx.ellipse(R * 0.95, R * 0.14, R * 0.34, R * 0.12, -0.2, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  {
    name: 'Jupiter', radius: 22, phase: 4.85,
    paint: (ctx, R) => {
      sphereBase(ctx, R, '#E9DABB', '#A5764A');
      paintBands(ctx, R, [
        'rgba(226,206,168,0.9)', 'rgba(190,146,98,0.9)', 'rgba(238,222,190,0.9)',
        'rgba(166,118,74,0.9)', 'rgba(222,198,158,0.9)', 'rgba(178,132,88,0.9)',
        'rgba(234,216,182,0.9)', 'rgba(158,110,70,0.85)', 'rgba(214,190,152,0.9)',
      ], 0.045);
      // Grande Tache Rouge
      ctx.save();
      ctx.beginPath();
      ctx.arc(R, R, R * 0.98, 0, Math.PI * 2);
      ctx.clip();
      ctx.fillStyle = 'rgba(196,85,59,0.95)';
      ctx.beginPath();
      ctx.ellipse(R * 1.38, R * 1.32, R * 0.24, R * 0.13, -0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(150,55,35,0.8)';
      ctx.lineWidth = R * 0.025;
      ctx.beginPath();
      ctx.ellipse(R * 1.38, R * 1.32, R * 0.24, R * 0.13, -0.15, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    },
  },
  {
    name: 'Saturne', radius: 18, phase: 5.75, rings: true,
    paint: (ctx, R) => {
      sphereBase(ctx, R, '#EBDCB4', '#B99A62');
      paintBands(ctx, R, [
        'rgba(233,217,178,0.8)', 'rgba(212,188,138,0.8)', 'rgba(240,227,196,0.8)',
        'rgba(203,177,126,0.8)', 'rgba(228,210,168,0.8)', 'rgba(196,168,116,0.75)',
      ], 0.04);
    },
  },
  {
    name: 'Uranus', radius: 12, phase: 4.2,
    paint: (ctx, R) => {
      sphereBase(ctx, R, '#BFF0F0', '#4FA3BC');
      paintBands(ctx, R, ['rgba(190,235,235,0.35)', 'rgba(140,205,215,0.35)', 'rgba(200,240,240,0.35)', 'rgba(130,195,210,0.3)'], 0.05);
    },
  },
  {
    name: 'Neptune', radius: 11.5, phase: 5.05,
    paint: (ctx, R) => {
      const rng = makeRng(30);
      sphereBase(ctx, R, '#5B85F0', '#233FA8');
      paintBands(ctx, R, ['rgba(100,140,240,0.35)', 'rgba(60,90,200,0.4)', 'rgba(120,160,250,0.3)'], 0.06);
      // grande tache sombre + nuages filants
      ctx.save();
      ctx.beginPath();
      ctx.arc(R, R, R * 0.98, 0, Math.PI * 2);
      ctx.clip();
      ctx.fillStyle = 'rgba(20,35,110,0.45)';
      ctx.beginPath();
      ctx.ellipse(R * 0.75, R * 0.85, R * 0.2, R * 0.11, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(240,248,255,0.5)';
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.ellipse(R + (rng() - 0.5) * R, R + (rng() - 0.5) * R, R * 0.22, R * 0.03, -0.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    },
  },
];

/** Texture de la Lune. */
function paintMoon(ctx: CanvasRenderingContext2D, R: number) {
  const rng = makeRng(5);
  sphereBase(ctx, R, '#E0E0E0', '#8F8F93');
  paintSpeckles(ctx, R, 8, 'rgba(90,90,95,0.4)', 0.08, 0.2, rng);
}

/** Pré-calcule le sprite d'une planète (sur-échantillonné). */
function buildSprite(paint: (c: CanvasRenderingContext2D, R: number) => void, drawR: number): { canvas: HTMLCanvasElement; half: number } {
  const R = Math.max(drawR, 2) * SPRITE_OVERSAMPLE;
  const pad = R * 0.45; // marge pour lueurs (atmosphère…)
  const size = Math.ceil((R + pad) * 2);
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d');
  if (ctx) {
    ctx.translate(pad, pad);
    paint(ctx, R);
  }
  return { canvas: c, half: (size / 2) / SPRITE_OVERSAMPLE };
}

// ── Soleil réaliste : photosphère, taches, couronne ───────────────

/**
 * Photosphère pré-calculée : assombrissement centre-bord réel (limb
 * darkening), granulation convective et groupes de taches solaires.
 * Deux textures (graines différentes) tournent l'une sur l'autre pour
 * donner l'impression que la surface bouillonne.
 */
function buildSunTexture(sunR: number, seed: number, withSpots: boolean): HTMLCanvasElement {
  const S = Math.ceil(sunR * 2 * 2); // sur-échantillonné ×2
  const R = S / 2;
  const c = document.createElement('canvas');
  c.width = S;
  c.height = S;
  const ctx = c.getContext('2d');
  if (!ctx) return c;
  const rng = makeRng(seed);

  // Base : limb darkening (centre blanc-chaud → bord orange profond)
  const base = ctx.createRadialGradient(R, R, 0, R, R, R);
  base.addColorStop(0, '#FFFEF8');
  base.addColorStop(0.35, '#FFF3C8');
  base.addColorStop(0.62, '#FFDD7A');
  base.addColorStop(0.82, '#FFB53E');
  base.addColorStop(0.95, '#F58A1A');
  base.addColorStop(1, '#D96A0C');
  ctx.fillStyle = base;
  ctx.beginPath();
  ctx.arc(R, R, R, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.beginPath();
  ctx.arc(R, R, R * 0.996, 0, Math.PI * 2);
  ctx.clip();

  // Granulation convective : cellules claires et sillons sombres
  for (let i = 0; i < 950; i++) {
    const a = rng() * Math.PI * 2;
    const d = Math.sqrt(rng()) * R * 0.985;
    const x = R + Math.cos(a) * d;
    const y = R + Math.sin(a) * d;
    const r = R * (0.012 + rng() * 0.03);
    const bright = rng() > 0.52;
    ctx.fillStyle = bright
      ? `rgba(255,248,215,${0.05 + rng() * 0.07})`
      : `rgba(205,110,25,${0.05 + rng() * 0.08})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  // Quelques super-granules plus larges, très diffuses
  for (let i = 0; i < 26; i++) {
    const a = rng() * Math.PI * 2;
    const d = Math.sqrt(rng()) * R * 0.9;
    const x = R + Math.cos(a) * d;
    const y = R + Math.sin(a) * d;
    const r = R * (0.07 + rng() * 0.09);
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    const dark = rng() > 0.5;
    g.addColorStop(0, dark ? 'rgba(190,95,15,0.07)' : 'rgba(255,250,225,0.06)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Groupes de taches solaires (ombre + pénombre), aux latitudes moyennes
  const spotGroups = withSpots ? 2 : 0;
  for (let gI = 0; gI < spotGroups; gI++) {
    const ga = rng() * Math.PI * 2;
    const gd = R * (0.3 + rng() * 0.35);
    const gx = R + Math.cos(ga) * gd;
    const gy = R + Math.sin(ga) * gd;
    const n = 1 + Math.floor(rng() * 3);
    for (let sI = 0; sI < n; sI++) {
      const sx = gx + (rng() - 0.5) * R * 0.16;
      const sy = gy + (rng() - 0.5) * R * 0.1;
      const sr = R * (0.014 + rng() * 0.026) * (sI === 0 ? 1.5 : 1);
      // pénombre
      const pen = ctx.createRadialGradient(sx, sy, sr * 0.4, sx, sy, sr * 2.1);
      pen.addColorStop(0, 'rgba(120,55,10,0.5)');
      pen.addColorStop(0.55, 'rgba(160,80,15,0.22)');
      pen.addColorStop(1, 'rgba(160,80,15,0)');
      ctx.fillStyle = pen;
      ctx.beginPath();
      ctx.arc(sx, sy, sr * 2.1, 0, Math.PI * 2);
      ctx.fill();
      // ombre
      const umb = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr);
      umb.addColorStop(0, 'rgba(45,18,4,0.85)');
      umb.addColorStop(0.7, 'rgba(70,30,6,0.55)');
      umb.addColorStop(1, 'rgba(70,30,6,0)');
      ctx.fillStyle = umb;
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Facules brillantes près du limbe (visibles sur le vrai Soleil)
  for (let i = 0; i < 30; i++) {
    const a = rng() * Math.PI * 2;
    const d = R * (0.82 + rng() * 0.15);
    ctx.fillStyle = `rgba(255,240,190,${0.06 + rng() * 0.08})`;
    ctx.beginPath();
    ctx.arc(R + Math.cos(a) * d, R + Math.sin(a) * d, R * (0.01 + rng() * 0.02), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Renforcement final de l'assombrissement du bord
  ctx.save();
  ctx.globalCompositeOperation = 'source-atop';
  const edge = ctx.createRadialGradient(R, R, R * 0.6, R, R, R);
  edge.addColorStop(0, 'rgba(0,0,0,0)');
  edge.addColorStop(0.8, 'rgba(150,60,0,0.1)');
  edge.addColorStop(1, 'rgba(110,40,0,0.42)');
  ctx.fillStyle = edge;
  ctx.beginPath();
  ctx.arc(R, R, R, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  return c;
}

/** Faisceau doux réutilisé pour les jets de la couronne solaire. */
function buildStreamerSprite(): HTMLCanvasElement {
  const W = 256;
  const H = 80;
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const ctx = c.getContext('2d');
  if (!ctx) return c;
  const lg = ctx.createLinearGradient(0, 0, W, 0);
  lg.addColorStop(0, 'rgba(255,225,170,0.6)');
  lg.addColorStop(0.35, 'rgba(255,195,115,0.24)');
  lg.addColorStop(1, 'rgba(255,170,80,0)');
  ctx.fillStyle = lg;
  ctx.fillRect(0, 0, W, H);
  // atténuation verticale (faisceau fuselé)
  const vg = ctx.createLinearGradient(0, 0, 0, H);
  vg.addColorStop(0, 'rgba(0,0,0,0)');
  vg.addColorStop(0.5, 'rgba(0,0,0,1)');
  vg.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.globalCompositeOperation = 'destination-in';
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, W, H);
  return c;
}

// ── Fond : Voie lactée + champ d'étoiles ──────────────────────────
function buildBackground(w: number, h: number, dpr: number): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.floor(w * dpr));
  c.height = Math.max(1, Math.floor(h * dpr));
  const ctx = c.getContext('2d');
  if (!ctx) return c;
  ctx.scale(dpr, dpr);

  // Espace profond
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, '#03081A');
  bg.addColorStop(0.55, '#071026');
  bg.addColorStop(1, '#0A1733');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  const rng = makeRng(2024);

  // Bande galactique diagonale (nuages laiteux superposés)
  const bandY = (x: number) => h * 0.34 - (x / w) * h * 0.22;
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 26; i++) {
    const x = (i / 25) * w * 1.1 - w * 0.05;
    const y = bandY(x) + (rng() - 0.5) * h * 0.08;
    const r = (0.05 + rng() * 0.09) * Math.max(w, h);
    const tint = rng();
    const color = tint < 0.5
      ? '150,175,235' // bleuté
      : tint < 0.8
        ? '190,205,245' // laiteux
        : '235,205,160'; // chaud
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(${color},${0.05 + rng() * 0.035})`);
    g.addColorStop(1, `rgba(${color},0)`);
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  // cœur plus dense de la bande
  for (let i = 0; i < 12; i++) {
    const x = (i / 11) * w;
    const y = bandY(x) + (rng() - 0.5) * h * 0.03;
    const r = (0.025 + rng() * 0.04) * Math.max(w, h);
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(220,228,255,${0.06 + rng() * 0.04})`);
    g.addColorStop(1, 'rgba(220,228,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  ctx.restore();

  // Étoiles : denses le long de la bande + dispersées partout
  const drawStar = (x: number, y: number, r: number, a: number) => {
    const tint = rng();
    ctx.fillStyle = tint < 0.68
      ? `rgba(255,255,255,${a})`
      : tint < 0.88
        ? `rgba(185,214,255,${a})`
        : `rgba(255,224,176,${a})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  };
  const scatterCount = Math.round((w * h) / 3500);
  for (let i = 0; i < scatterCount; i++) {
    drawStar(rng() * w, rng() * h, 0.3 + rng() * 0.9, 0.2 + rng() * 0.55);
  }
  const bandCount = Math.round(scatterCount * 0.9);
  for (let i = 0; i < bandCount; i++) {
    const x = rng() * w;
    const gauss = (rng() + rng() + rng() - 1.5) / 1.5; // ≈ gaussienne
    const y = bandY(x) + gauss * h * 0.09;
    drawStar(x, y, 0.3 + rng() * 1.1, 0.25 + rng() * 0.6);
  }
  // Quelques étoiles brillantes à croix de diffraction
  for (let i = 0; i < 9; i++) {
    const x = rng() * w;
    const y = rng() * h * 0.75;
    const r = 0.9 + rng() * 1;
    drawStar(x, y, r, 0.9);
    ctx.strokeStyle = 'rgba(255,255,255,0.22)';
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(x - r * 4, y);
    ctx.lineTo(x + r * 4, y);
    ctx.moveTo(x, y - r * 4);
    ctx.lineTo(x, y + r * 4);
    ctx.stroke();
  }

  // Deux galaxies lointaines
  for (let i = 0; i < 2; i++) {
    const x = w * (0.15 + rng() * 0.7);
    const y = h * (0.1 + rng() * 0.35);
    const r = 14 + rng() * 18;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rng() * Math.PI);
    ctx.scale(1, 0.35);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
    g.addColorStop(0, 'rgba(235,230,255,0.35)');
    g.addColorStop(0.4, 'rgba(190,190,240,0.12)');
    g.addColorStop(1, 'rgba(190,190,240,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Vignettage léger
  const vg = ctx.createRadialGradient(w / 2, h * 0.45, Math.min(w, h) * 0.45, w / 2, h * 0.5, Math.max(w, h) * 0.85);
  vg.addColorStop(0, 'rgba(0,0,0,0)');
  vg.addColorStop(1, 'rgba(2,5,14,0.4)');
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, w, h);

  return c;
}

// ── Composant ─────────────────────────────────────────────────────
const SolarSystemCanvas: React.FC = () => {
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

    // État de scène (reconstruit au resize)
    let w = 0;
    let h = 0;
    let dpr = 1;
    let bgCanvas: HTMLCanvasElement | null = null;
    let planets: PlanetRuntime[] = [];
    let moonSprite: { canvas: HTMLCanvasElement; half: number } | null = null;
    let flares: FlareSlot[] = [];
    let twinkles: TwinkleStar[] = [];
    let belt: Asteroid[] = [];
    let sunX = 0;
    let sunY = 0;
    let sunR = 0;
    let sunTexA: HTMLCanvasElement | null = null;
    let sunTexB: HTMLCanvasElement | null = null;
    let streamerSprite: HTMLCanvasElement | null = null;
    let streamers: CoronaStreamer[] = [];
    let moonDrawR = 0;
    let comet: { x0: number; y0: number; vx: number; vy: number; start: number; dur: number } | null = null;
    let nextCometAt = 4;

    const rebuild = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, Math.round(rect.width));
      h = Math.max(1, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const isMobile = w < 768;

      // Soleil en bas à gauche — composition asymétrique, le texte reste lisible
      sunR = Math.min(Math.max(Math.min(w, h) * 0.14, 64), 170);
      sunX = Math.max(w * 0.16, sunR * 0.9);
      sunY = h * 0.82;

      bgCanvas = buildBackground(w, h, dpr);

      // Planètes : orbites réparties entre le soleil et le bord droit
      const scale = sunR / 130;
      const rxMin = sunR * 1.85;
      const rxMax = w * 0.8;
      planets = PLANET_DEFS.map((def, i) => {
        const t = i / (PLANET_DEFS.length - 1);
        const rx = rxMin + (rxMax - rxMin) * Math.pow(t, 1.12);
        const drawR = Math.max(def.radius * scale, isMobile ? 2.2 : 3);
        const sprite = buildSprite(def.paint, drawR);
        return {
          def,
          sprite: sprite.canvas,
          half: sprite.half,
          drawR,
          rx,
          ry: rx * ORBIT_TILT,
          omega: (Math.PI * 2) / (BASE_PERIOD * Math.pow(rx / rxMin, 1.5)),
        };
      });

      moonDrawR = Math.max(2.6 * scale, 1.4);
      moonSprite = buildSprite(paintMoon, moonDrawR);

      // Photosphère (deux textures qui bouillonnent l'une sur l'autre —
      // taches solaires sur la première seulement)
      sunTexA = buildSunTexture(sunR, 3001, true);
      sunTexB = buildSunTexture(sunR, 7411, false);

      // Jets de la couronne
      streamerSprite = buildStreamerSprite();
      const strRng = makeRng(555);
      const streamerCount = isMobile ? 8 : 13;
      streamers = Array.from({ length: streamerCount }, (_, i) => ({
        angle: (Math.PI * 2 * i) / streamerCount + strRng() * 0.5,
        width: 0.5 + strRng() * 0.55,
        lenBase: 1.25 + strRng() * 0.8,
        lenAmp: 0.18 + strRng() * 0.3,
        speed: 0.12 + strRng() * 0.3,
        phase: strRng() * Math.PI * 2,
        alpha: 0.08 + strRng() * 0.1,
        drift: (strRng() - 0.5) * 0.012,
      }));

      // Éruptions solaires : créneaux répartis sur le limbe
      const flareCount = isMobile ? 3 : 5;
      const flareRng = makeRng(99);
      flares = Array.from({ length: flareCount }, (_, i) => ({
        baseAngle: -Math.PI * 0.05 - (Math.PI * 1.15 * i) / flareCount - flareRng() * 0.3,
        span: 0.11 + flareRng() * 0.14,
        height: 0.22 + flareRng() * 0.34,
        period: 7 + flareRng() * 6,
        offset: flareRng() * 20,
      }));

      // Étoiles scintillantes
      const twinkleRng = makeRng(777);
      const twinkleCount = isMobile ? 36 : 80;
      twinkles = Array.from({ length: twinkleCount }, () => ({
        x: twinkleRng() * w,
        y: twinkleRng() * h,
        r: 0.5 + twinkleRng() * 1,
        alpha: 0.3 + twinkleRng() * 0.5,
        speed: 0.6 + twinkleRng() * 1.6,
        phase: twinkleRng() * Math.PI * 2,
        gold: twinkleRng() < 0.12,
      }));

      // Ceinture d'astéroïdes entre Mars (3) et Jupiter (4)
      const beltRng = makeRng(1234);
      const beltCount = isMobile ? 60 : 120;
      const rxBelt = (planets[3].rx + planets[4].rx) / 2;
      const beltSpread = (planets[4].rx - planets[3].rx) * 0.3;
      belt = Array.from({ length: beltCount }, () => ({
        angle: beltRng() * Math.PI * 2,
        omega: (Math.PI * 2) / (BASE_PERIOD * Math.pow(rxBelt / rxMin, 1.5)) * (0.85 + beltRng() * 0.3),
        rJit: rxBelt + (beltRng() - 0.5) * 2 * beltSpread,
        size: 0.4 + beltRng() * 0.9,
        alpha: 0.25 + beltRng() * 0.45,
      }));
    };

    // ── Dessins par frame ─────────────────────────────────────────
    const drawPlanet = (p: PlanetRuntime, t: number) => {
      const theta = p.def.phase + p.omega * t;
      const sin = Math.sin(theta);
      const px = sunX + p.rx * Math.cos(theta);
      const py = sunY + p.ry * sin;
      if (px < -60 || px > w + 60 || py < -60 || py > h + 80) return;

      const depth = 1 + 0.2 * sin; // plus proche ⇒ légèrement plus grand
      const r = p.drawR * depth;
      const ratio = r / p.drawR;

      // Anneaux de Saturne — moitié arrière
      const ringTilt = -0.42;
      if (p.def.rings) {
        drawSaturnRings(px, py, r, ringTilt, true);
      }

      ctx.drawImage(p.sprite, px - p.half * ratio, py - p.half * ratio, p.half * 2 * ratio, p.half * 2 * ratio);

      // Ombre côté opposé au soleil
      const lightAng = Math.atan2(sunY - py, sunX - px);
      const sh = ctx.createRadialGradient(
        px + Math.cos(lightAng) * r * 0.65, py + Math.sin(lightAng) * r * 0.65, r * 0.2,
        px, py, r * 1.08,
      );
      sh.addColorStop(0, 'rgba(3,7,18,0)');
      sh.addColorStop(0.6, 'rgba(3,7,18,0.14)');
      sh.addColorStop(1, 'rgba(2,5,14,0.7)');
      ctx.fillStyle = sh;
      ctx.beginPath();
      ctx.arc(px, py, r * 1.02, 0, Math.PI * 2);
      ctx.fill();

      if (p.def.rings) {
        drawSaturnRings(px, py, r, ringTilt, false);
      }

      // Lune de la Terre
      if (p.def.moon && moonSprite) {
        const mAng = t * (Math.PI * 2 / 7);
        const mr = r * 2.5;
        const mx = px + Math.cos(mAng) * mr;
        const my = py + Math.sin(mAng) * mr * ORBIT_TILT;
        const mR = moonDrawR * depth;
        const mRatio = mR / moonDrawR;
        ctx.drawImage(moonSprite.canvas, mx - moonSprite.half * mRatio, my - moonSprite.half * mRatio, moonSprite.half * 2 * mRatio, moonSprite.half * 2 * mRatio);
      }
    };

    const drawSaturnRings = (px: number, py: number, r: number, tilt: number, backHalf: boolean) => {
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(tilt);
      ctx.scale(1, 0.34);
      const ringDefs: Array<[number, string, number]> = [
        [1.55, 'rgba(216,192,138,0.55)', r * 0.3],
        [1.95, 'rgba(190,166,116,0.4)', r * 0.22],
        [2.28, 'rgba(160,140,100,0.28)', r * 0.14],
      ];
      for (const [k, color, lw] of ringDefs) {
        ctx.strokeStyle = color;
        ctx.lineWidth = lw;
        ctx.beginPath();
        if (backHalf) {
          ctx.arc(0, 0, r * k, Math.PI, Math.PI * 2);
        } else {
          ctx.arc(0, 0, r * k, 0, Math.PI);
        }
        ctx.stroke();
      }
      ctx.restore();
    };

    const drawSun = (t: number) => {
      // ── Couronne : halo doux + jets (streamers) qui respirent ──
      const pulse = 1 + 0.03 * Math.sin(t * 0.55) + 0.012 * Math.sin(t * 1.7);
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const glowR = sunR * 2.9 * pulse;
      const glow = ctx.createRadialGradient(sunX, sunY, sunR * 0.55, sunX, sunY, glowR);
      glow.addColorStop(0, 'rgba(255,208,125,0.42)');
      glow.addColorStop(0.3, 'rgba(255,165,75,0.15)');
      glow.addColorStop(1, 'rgba(255,140,50,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(sunX, sunY, glowR, 0, Math.PI * 2);
      ctx.fill();

      if (streamerSprite) {
        for (const s of streamers) {
          const breathe = 0.55 + 0.45 * Math.sin(t * s.speed + s.phase);
          const len = sunR * (s.lenBase + s.lenAmp * Math.sin(t * s.speed * 1.7 + s.phase * 2));
          const wpx = sunR * s.width;
          ctx.save();
          ctx.translate(sunX, sunY);
          ctx.rotate(s.angle + t * s.drift);
          ctx.globalAlpha = s.alpha * breathe;
          ctx.drawImage(streamerSprite, sunR * 0.78, -wpx / 2, len, wpx);
          ctx.restore();
        }
      }
      ctx.restore();

      // ── Photosphère bouillonnante : deux textures contrarotatives ──
      if (sunTexA && sunTexB) {
        ctx.save();
        ctx.translate(sunX, sunY);
        ctx.rotate(t * 0.011);
        ctx.drawImage(sunTexA, -sunR, -sunR, sunR * 2, sunR * 2);
        ctx.rotate(-t * 0.011 - t * 0.019);
        ctx.globalAlpha = 0.42 + 0.1 * Math.sin(t * 0.65);
        ctx.drawImage(sunTexB, -sunR, -sunR, sunR * 2, sunR * 2);
        ctx.restore();
      }

      // ── Chromosphère : fin liseré rouge-orangé au ras du limbe ──
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const chromo = ctx.createRadialGradient(sunX, sunY, sunR * 0.955, sunX, sunY, sunR * 1.045);
      chromo.addColorStop(0, 'rgba(255,90,35,0)');
      chromo.addColorStop(0.55, 'rgba(255,100,42,0.38)');
      chromo.addColorStop(1, 'rgba(255,90,35,0)');
      ctx.fillStyle = chromo;
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunR * 1.045, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // ── Protubérances : arches de plasma ondulantes ──
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      for (const f of flares) {
        const p = ((t + f.offset) % f.period) / f.period;
        const env = Math.sin(Math.PI * Math.min(p * 1.35, 1));
        if (env <= 0.02) continue;
        const a1 = f.baseAngle - f.span;
        const a2 = f.baseAngle + f.span;
        const x1 = sunX + Math.cos(a1) * sunR * 0.985;
        const y1 = sunY + Math.sin(a1) * sunR * 0.985;
        const x2 = sunX + Math.cos(a2) * sunR * 0.985;
        const y2 = sunY + Math.sin(a2) * sunR * 0.985;
        const reach = sunR * (1 + f.height * env);
        const cxp = sunX + Math.cos(f.baseAngle) * reach * 1.22;
        const cyp = sunY + Math.sin(f.baseAngle) * reach * 1.22;

        // Échantillonnage de l'arche + ondulation perpendiculaire (plasma vivant)
        const N = 16;
        const pts: number[] = [];
        for (let k = 0; k <= N; k++) {
          const u = k / N;
          const mu = 1 - u;
          const qx = mu * mu * x1 + 2 * mu * u * cxp + u * u * x2;
          const qy = mu * mu * y1 + 2 * mu * u * cyp + u * u * y2;
          const txv = 2 * mu * (cxp - x1) + 2 * u * (x2 - cxp);
          const tyv = 2 * mu * (cyp - y1) + 2 * u * (y2 - cyp);
          const tl = Math.hypot(txv, tyv) || 1;
          const wob =
            Math.sin(u * 9.5 + t * 2.6 + f.offset) *
            sunR * 0.024 * env * Math.sin(Math.PI * u);
          pts.push(qx + (-tyv / tl) * wob, qy + (txv / tl) * wob);
        }
        const strokePts = (width: number, style: string, blur: number) => {
          ctx.strokeStyle = style;
          ctx.lineWidth = width;
          if (blur > 0) {
            ctx.shadowColor = 'rgba(255,110,50,0.85)';
            ctx.shadowBlur = blur;
          }
          ctx.beginPath();
          ctx.moveTo(pts[0], pts[1]);
          for (let k = 1; k <= N; k++) ctx.lineTo(pts[k * 2], pts[k * 2 + 1]);
          ctx.stroke();
          ctx.shadowBlur = 0;
        };
        // filaments : lueur H-alpha rougeâtre → cœur pâle
        strokePts(sunR * 0.05, `rgba(255,100,45,${0.2 * env})`, 15);
        strokePts(sunR * 0.02, `rgba(255,160,80,${0.45 * env})`, 0);
        strokePts(sunR * 0.008, `rgba(255,236,195,${0.85 * env})`, 0);

        // Pieds lumineux ancrés dans la chromosphère
        for (const [fx, fy] of [[x1, y1], [x2, y2]] as const) {
          const foot = ctx.createRadialGradient(fx, fy, 0, fx, fy, sunR * 0.085);
          foot.addColorStop(0, `rgba(255,215,140,${0.5 * env})`);
          foot.addColorStop(1, 'rgba(255,215,140,0)');
          ctx.fillStyle = foot;
          ctx.beginPath();
          ctx.arc(fx, fy, sunR * 0.085, 0, Math.PI * 2);
          ctx.fill();
        }

        // Éjection de plasma qui se détache au sommet en fin de vie
        if (p > 0.5) {
          const drift = (p - 0.5) * 2;
          const apexX = 0.25 * x1 + 0.5 * cxp + 0.25 * x2;
          const apexY = 0.25 * y1 + 0.5 * cyp + 0.25 * y2;
          const ex = apexX + Math.cos(f.baseAngle) * drift * sunR * 0.55;
          const ey = apexY + Math.sin(f.baseAngle) * drift * sunR * 0.55;
          ctx.fillStyle = `rgba(255,190,120,${0.45 * (1 - drift)})`;
          ctx.beginPath();
          ctx.arc(ex, ey, sunR * 0.022 * (1 - drift * 0.5), 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    };

    const drawComet = (t: number) => {
      if (!comet && t >= nextCometAt) {
        const rng = makeRng(Math.floor(t * 997));
        const fromLeft = rng() > 0.5;
        const y0 = h * (0.08 + rng() * 0.3);
        const speed = w / (2.6 + rng() * 1.4);
        comet = {
          x0: fromLeft ? -40 : w + 40,
          y0,
          vx: fromLeft ? speed : -speed,
          vy: speed * (0.12 + rng() * 0.15),
          start: t,
          dur: 3,
        };
        nextCometAt = t + 9 + rng() * 9;
      }
      if (!comet) return;
      const p = (t - comet.start) / comet.dur;
      if (p >= 1) {
        comet = null;
        return;
      }
      const env = Math.sin(Math.PI * p);
      const cx = comet.x0 + comet.vx * (t - comet.start);
      const cy = comet.y0 + comet.vy * (t - comet.start);
      const len = 90;
      const nx = -comet.vx;
      const ny = -comet.vy;
      const nl = Math.hypot(nx, ny) || 1;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const tail = ctx.createLinearGradient(cx, cy, cx + (nx / nl) * len, cy + (ny / nl) * len);
      tail.addColorStop(0, `rgba(220,235,255,${0.75 * env})`);
      tail.addColorStop(1, 'rgba(220,235,255,0)');
      ctx.strokeStyle = tail;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + (nx / nl) * len, cy + (ny / nl) * len);
      ctx.stroke();
      ctx.fillStyle = `rgba(255,255,255,${0.85 * env})`;
      ctx.beginPath();
      ctx.arc(cx, cy, 1.7, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const drawFrame = (t: number) => {
      if (!bgCanvas) return;
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(bgCanvas, 0, 0, w, h);

      // Étoiles scintillantes
      for (const s of twinkles) {
        const a = s.alpha * (0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * s.speed + s.phase)));
        ctx.fillStyle = s.gold ? `rgba(232,178,58,${a})` : `rgba(255,255,255,${a})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      drawComet(t);

      // Lignes d'orbites
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 1;
      for (const p of planets) {
        ctx.beginPath();
        ctx.ellipse(sunX, sunY, p.rx, p.ry, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Ceinture d'astéroïdes
      for (const a of belt) {
        const ang = a.angle + a.omega * t;
        const ax = sunX + a.rJit * Math.cos(ang);
        const ay = sunY + a.rJit * ORBIT_TILT * Math.sin(ang);
        if (ax < -10 || ax > w + 10 || ay < -10 || ay > h + 10) continue;
        ctx.fillStyle = `rgba(185,195,215,${a.alpha})`;
        ctx.fillRect(ax, ay, a.size, a.size);
      }

      // Planètes côté lointain (derrière le soleil)
      for (const p of planets) {
        if (Math.sin(p.def.phase + p.omega * t) < 0) drawPlanet(p, t);
      }

      drawSun(t);

      // Planètes côté proche (devant le soleil)
      for (const p of planets) {
        if (Math.sin(p.def.phase + p.omega * t) >= 0) drawPlanet(p, t);
      }
    };

    // ── Boucle ────────────────────────────────────────────────────
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
      drawFrame(12); // composition figée mais riche
    } else {
      start();
    }

    // Pause quand le hero sort de l'écran
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
        if (reducedMotion) drawFrame(12);
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

export default SolarSystemCanvas;
