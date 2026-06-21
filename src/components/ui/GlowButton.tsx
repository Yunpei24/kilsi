import type { ReactNode } from 'react';

interface GlowButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: 'gold' | 'blue';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses: Record<NonNullable<GlowButtonProps['size']>, string> = {
  sm: 'px-5 py-2 text-sm',
  md: 'px-8 py-3 text-base',
  lg: 'px-10 py-4 text-lg',
};

const variantClasses: Record<NonNullable<GlowButtonProps['variant']>, string> = {
  gold: [
    'bg-kilsi-gold text-kilsi-night',
    'shadow-[0_0_20px_rgba(232,178,58,0.4)]',
    'hover:shadow-[0_0_35px_rgba(232,178,58,0.6)]',
    'hover:bg-kilsi-gold-deep',
    'focus-visible:ring-kilsi-gold',
  ].join(' '),
  blue: [
    'bg-kilsi-blue text-white',
    'shadow-[0_0_20px_rgba(31,91,255,0.35)]',
    'hover:shadow-[0_0_35px_rgba(31,91,255,0.55)]',
    'hover:bg-kilsi-sky',
    'focus-visible:ring-kilsi-sky',
  ].join(' '),
};

function GlowButton({
  children,
  onClick,
  href,
  variant = 'gold',
  size = 'md',
  className = '',
}: GlowButtonProps) {
  const baseClasses = [
    'inline-flex items-center justify-center',
    'rounded-full font-display font-semibold tracking-wide',
    'transition-all duration-300 ease-out',
    'hover:scale-105 active:scale-[0.98]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-kilsi-night',
    'animate-glow-pulse',
    'cursor-pointer',
    sizeClasses[size],
    variantClasses[variant],
    className,
  ].join(' ');

  if (href) {
    return (
      <a href={href} className={baseClasses}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={baseClasses}>
      {children}
    </button>
  );
}

export default GlowButton;
