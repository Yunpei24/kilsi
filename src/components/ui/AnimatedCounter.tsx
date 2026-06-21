import { useEffect, useRef, useState } from 'react';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function AnimatedCounter({
  end,
  duration = 2000,
  prefix = '',
  suffix = '',
  label,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const [ref, isIntersecting] = useIntersectionObserver({
    threshold: 0.3,
    triggerOnce: true,
  });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isIntersecting || hasAnimated.current) return;
    hasAnimated.current = true;

    let startTime: number | null = null;
    let animationId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);

      setCount(Math.round(easedProgress * end));

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isIntersecting, end, duration]);

  return (
    <div ref={ref} className="flex flex-col items-center gap-2">
      <span className="font-display text-5xl font-bold tracking-tight gradient-text-gold md:text-6xl lg:text-7xl">
        {prefix}
        {count.toLocaleString()}
        {suffix}
      </span>
      <span className="text-sm font-medium uppercase tracking-widest text-kilsi-gray md:text-base">
        {label}
      </span>
    </div>
  );
}

export default AnimatedCounter;
