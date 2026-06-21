import { Link } from 'react-router-dom';
import RevealOnScroll from '../ui/RevealOnScroll';

interface ServiceCardProps {
  name: string;
  subtitle: string;
  description: string;
  icon: string;
  index: number;
}

/**
 * Splits the service name and applies special styling to the second word.
 * - "AI" gets the gold gradient
 * - All others get kilsi-blue
 */
function renderName(name: string) {
  const words = name.split(' ');
  if (words.length < 2) {
    return <span className="text-kilsi-light">{name}</span>;
  }

  const [first, ...rest] = words;
  const branch = rest.join(' ');
  const branchClass =
    branch === 'AI' ? 'gradient-text-gold' : 'text-kilsi-blue';

  return (
    <>
      <span className="text-kilsi-light">{first} </span>
      <span className={branchClass}>{branch}</span>
    </>
  );
}

const ServiceCard = ({ name, subtitle, description, icon, index }: ServiceCardProps) => {
  const branchId = name.split(' ')[1].toLowerCase();

  return (
    <RevealOnScroll delay={index * 100}>
      <Link to={`/branches/${branchId}`} className="block h-full cursor-pointer">
        <article className="glass-card group rounded-2xl p-6 lg:p-8 h-full flex flex-col hover:scale-[1.02] transition-all duration-300">
          {/* Icon */}
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl border border-kilsi-blue/20 bg-kilsi-blue/10 transition-all duration-300 group-hover:border-kilsi-gold/30 group-hover:bg-kilsi-gold/5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              className="h-7 w-7 stroke-kilsi-blue transition-all duration-300 group-hover:stroke-kilsi-gold group-hover:scale-110 group-hover:rotate-3"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
            </svg>
          </div>

          {/* Subtitle */}
          <p className="mb-1 text-sm uppercase tracking-wider text-kilsi-sky">
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
