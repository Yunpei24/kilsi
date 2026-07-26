import { Link } from 'react-router-dom';
import RevealOnScroll from '../ui/RevealOnScroll';

interface ServiceCardProps {
  name: string;
  subtitle: string;
  description: string;
  icon: string;
  /** Couleur de la branche — même code couleur que les satellites orbitaux */
  color: string;
  index: number;
}

/** #RRGGBB → rgba(r,g,b,a) */
function hexToRgba(hex: string, alpha: number): string {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
}

/**
 * Splits the service name and applies special styling to the second word.
 * - "AI" keeps the gold gradient (flagship)
 * - All others take their branch colour
 */
function renderName(name: string) {
  const words = name.split(' ');
  if (words.length < 2) {
    return <span className="text-kilsi-light">{name}</span>;
  }

  const [first, ...rest] = words;
  const branch = rest.join(' ');

  return (
    <>
      <span className="text-kilsi-light">{first} </span>
      {branch === 'AI' ? (
        <span className="gradient-text-gold">{branch}</span>
      ) : (
        <span style={{ color: 'var(--branch)' }}>{branch}</span>
      )}
    </>
  );
}

const ServiceCard = ({ name, subtitle, description, icon, color, index }: ServiceCardProps) => {
  const branchId = name.split(' ')[1].toLowerCase();

  // Variables CSS consommées par la carte et par .glass-card:hover
  const cardVars = {
    '--branch': color,
    '--branch-10': hexToRgba(color, 0.1),
    '--branch-16': hexToRgba(color, 0.16),
    '--branch-25': hexToRgba(color, 0.25),
    '--branch-45': hexToRgba(color, 0.45),
    '--branch-soft': hexToRgba(color, 0.82),
    '--branch-hover': hexToRgba(color, 0.32),
    '--branch-glow': hexToRgba(color, 0.12),
  } as React.CSSProperties;

  return (
    <RevealOnScroll delay={index * 100}>
      <Link to={`/branches/${branchId}`} className="block h-full cursor-pointer">
        <article
          className="glass-card group rounded-2xl p-6 lg:p-8 h-full flex flex-col hover:scale-[1.02] transition-all duration-300"
          style={cardVars}
        >
          {/* Icon */}
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl border border-(--branch-25) bg-(--branch-10) transition-all duration-300 group-hover:border-(--branch-45) group-hover:bg-(--branch-16)">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              className="h-7 w-7 stroke-(--branch) transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
            </svg>
          </div>

          {/* Subtitle */}
          <p className="mb-1 text-sm uppercase tracking-wider text-(--branch-soft)">
            {subtitle}
          </p>

          {/* Name */}
          <h3 className="font-display text-lg font-semibold lg:text-xl">
            {renderName(name)}
          </h3>

          {/* Description */}
          <p className="mt-3 text-sm leading-relaxed text-kilsi-gray">
            {description}
          </p>
        </article>
      </Link>
    </RevealOnScroll>
  );
};

export default ServiceCard;
