import type { ReactNode } from 'react';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';

type RevealDirection = 'up' | 'left' | 'right';

interface RevealOnScrollProps {
  children: ReactNode;
  direction?: RevealDirection;
  className?: string;
  delay?: number;
}

const animationMap: Record<RevealDirection, string> = {
  up: 'animate-reveal-up',
  left: 'animate-reveal-left',
  right: 'animate-reveal-right',
};

const RevealOnScroll = ({
  children,
  direction = 'up',
  className = '',
  delay = 0,
}: RevealOnScrollProps) => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.15, triggerOnce: true });

  return (
    <div
      ref={ref}
      className={`${isVisible ? animationMap[direction] : 'opacity-0'} ${className}`}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
};

export default RevealOnScroll;
