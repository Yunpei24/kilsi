import { useLanguage } from '../../context/LanguageContext';

interface TeamMemberCardProps {
  name: string;
  title: string;
  imageSrc?: string;
  isPlaceholder?: boolean;
  bio?: string;
}

function TeamMemberCard({
  name,
  title,
  imageSrc,
  isPlaceholder = false,
  bio,
}: TeamMemberCardProps) {
  const { t } = useLanguage();
  /* ── Placeholder card ─────────────────────────────────────── */
  if (isPlaceholder) {
    return (
      <div className="glass-card flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/10 p-8 text-center cursor-pointer hover:border-kilsi-gold/30 transition-all duration-300 min-h-[260px]">
        {/* Plus icon */}
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/5">
          <svg
            className="h-7 w-7 text-kilsi-gray"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </div>
        <p className="font-display text-sm font-medium text-kilsi-gray">
          {t('team.join')}
        </p>
      </div>
    );
  }

  /* ── Member card ──────────────────────────────────────────── */
  return (
    <div className="glass-card overflow-hidden rounded-2xl">
      {/* Image */}
      {imageSrc && (
        <div className="p-3 pb-0">
          <div className="overflow-hidden rounded-xl bg-gradient-to-br from-kilsi-blue/20 via-transparent to-kilsi-gold/20 p-[2px]">
            <img
              src={imageSrc}
              alt={name}
              className="aspect-square max-h-64 w-full rounded-xl object-cover"
            />
          </div>
        </div>
      )}

      {/* Info */}
      <div className="p-5">
        <h3 className="font-display text-xl font-bold text-kilsi-light">
          {name}
        </h3>
        <p className="mt-1 text-sm text-kilsi-gold">{title}</p>

        {bio && (
          <p className="mt-2 text-sm leading-relaxed text-kilsi-gray">{bio}</p>
        )}

        {/* Social links */}
        <div className="mt-4 flex gap-3">
          {/* LinkedIn */}
          <a
            href="#"
            aria-label={`${name} LinkedIn`}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-kilsi-gray transition-all duration-300 hover:bg-kilsi-blue/20 hover:text-kilsi-sky"
          >
            <svg
              className="h-4 w-4"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>

          {/* X / Twitter */}
          <a
            href="#"
            aria-label={`${name} X`}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-kilsi-gray transition-all duration-300 hover:bg-kilsi-blue/20 hover:text-kilsi-sky"
          >
            <svg
              className="h-4 w-4"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

export default TeamMemberCard;
