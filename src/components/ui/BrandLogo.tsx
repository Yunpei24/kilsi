import symbol from '../../assets/logos/kilsi_symbole_blanc.svg';

interface BrandLogoProps {
  /** 'nav' — compact navbar variant · 'hero' — large hero variant */
  variant?: 'nav' | 'hero';
  className?: string;
}

/**
 * BrandLogo
 * Kilsi Tech wordmark: brand symbol + "Kilsi" (white) / "Tech" (gold),
 * rendered in the display font so the group name stays editable in code.
 */
const BrandLogo: React.FC<BrandLogoProps> = ({ variant = 'nav', className = '' }) => {
  const isHero = variant === 'hero';

  return (
    <span className={`inline-flex items-center ${isHero ? 'gap-4 md:gap-5' : 'gap-2'} ${className}`}>
      <img
        src={symbol}
        alt=""
        aria-hidden="true"
        className={isHero ? 'h-14 w-auto md:h-20 lg:h-24' : 'h-8 w-auto lg:h-9'}
      />
      <span
        className={`font-display font-bold tracking-tight leading-none text-kilsi-light ${
          isHero ? 'text-5xl md:text-6xl lg:text-7xl' : 'text-xl lg:text-2xl'
        }`}
      >
        Kilsi <span className="text-kilsi-gold">Tech</span>
      </span>
    </span>
  );
};

export default BrandLogo;
