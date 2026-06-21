import { useEffect, useRef, useCallback } from 'react';

// ── Color palette ──────────────────────────────────────────────
const COLORS = {
  blue: '#1F5BFF',
  sky: '#4F9CFF',
  gold: '#E8B23A',
} as const;

// ── Particle config ────────────────────────────────────────────
const CONNECTION_DISTANCE = 150;
const PARTICLE_COUNT_DESKTOP = 80;
const PARTICLE_COUNT_MOBILE = 40;
const MOBILE_BREAKPOINT = 768;
const GOLD_RATIO = 0.15;
const BASE_SPEED = 0.3;

// ── Types ──────────────────────────────────────────────────────
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  opacity: number;
}

/** Creates a single particle with random position, velocity, and color. */
function createParticle(width: number, height: number): Particle {
  const isGold = Math.random() < GOLD_RATIO;
  const color = isGold
    ? COLORS.gold
    : Math.random() < 0.5
      ? COLORS.blue
      : COLORS.sky;

  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * BASE_SPEED * 2,
    vy: (Math.random() - 0.5) * BASE_SPEED * 2,
    radius: Math.random() * 2 + 1,
    color,
    opacity: Math.random() * 0.5 + 0.3,
  };
}

/** Resolves particle count based on viewport width. */
function getParticleCount(): number {
  return window.innerWidth < MOBILE_BREAKPOINT
    ? PARTICLE_COUNT_MOBILE
    : PARTICLE_COUNT_DESKTOP;
}

// ── Component ──────────────────────────────────────────────────

/**
 * ParticleCanvas
 * A full-screen, absolutely-positioned canvas that renders a
 * slowly-moving neural-network-style particle field.
 */
const ParticleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);

  /** Initialise / re-initialise particles for the current viewport. */
  const initParticles = useCallback((width: number, height: number) => {
    const count = getParticleCount();
    particlesRef.current = Array.from({ length: count }, () =>
      createParticle(width, height),
    );
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // ── Sizing helper ────────────────────────────────────────
    const setSize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    setSize();
    initParticles(window.innerWidth, window.innerHeight);

    // ── Resize handler ───────────────────────────────────────
    const handleResize = () => {
      setSize();
      initParticles(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // ── Draw loop ────────────────────────────────────────────
    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const particles = particlesRef.current;

      ctx.clearRect(0, 0, w, h);

      // Update positions & bounce off edges
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        // Clamp inside viewport
        p.x = Math.max(0, Math.min(w, p.x));
        p.y = Math.max(0, Math.min(h, p.y));
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DISTANCE) {
            const alpha = (1 - dist / CONNECTION_DISTANCE) * 0.12;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(79, 156, 255, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    animationFrameRef.current = requestAnimationFrame(draw);

    // ── Cleanup ──────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0"
    />
  );
};

export default ParticleCanvas;
