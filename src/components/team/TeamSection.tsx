import Section from '../layout/Section';
import RevealOnScroll from '../ui/RevealOnScroll';
import TeamMemberCard from './TeamMemberCard';
import founderImg from '../../assets/images/founder.png';
import teamVideo from '../../assets/videos/team-bg.mp4';
import { useLanguage } from '../../context/LanguageContext';

/**
 * TeamSection
 * Fourth section — founder spotlight & team grid.
 * Asymmetric 2-column layout on desktop: large founder card + recruitment grid.
 */
const TeamSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Section id="team" videoSrc={teamVideo}>
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        {/* Section header */}
        <RevealOnScroll direction="up">
          <div className="mb-16 text-center lg:text-left">
            <span className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-kilsi-gray">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-kilsi-gold" />
              {t('team.label')}
            </span>
            <h2 className="font-display text-3xl font-bold text-kilsi-light md:text-4xl lg:text-5xl">
              {t('team.heading.prefix')}
              <span className="gradient-text">{t('team.heading.highlight')}</span>
            </h2>
          </div>
        </RevealOnScroll>

        {/* Two-column layout */}
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
          {/* ── Founder card (takes more space) ─────────────────── */}
          <RevealOnScroll direction="left" className="lg:w-3/5">
            <div className="glass-card overflow-hidden rounded-2xl">
              <div className="flex flex-col md:flex-row">
                {/* Founder image */}
                <div className="p-4 md:w-2/5 md:p-5">
                  <div className="overflow-hidden rounded-xl bg-gradient-to-br from-kilsi-blue/20 via-transparent to-kilsi-gold/20 p-[2px]">
                    <img
                      src={founderImg}
                      alt="Joshua Juste E. Yun Pei NIKIEMA"
                      className="aspect-square w-full rounded-xl object-cover"
                    />
                  </div>
                </div>

                {/* Founder info */}
                <div className="flex flex-col justify-center p-6 md:w-3/5 md:py-8 md:pr-8 md:pl-2">
                  <h3 className="font-display text-2xl font-bold leading-tight text-kilsi-light lg:text-3xl">
                    Joshua Juste E. Yun Pei NIKIEMA
                  </h3>
                  <p className="mt-2 text-sm font-medium text-kilsi-gold">
                    {t('team.founder.title')}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-kilsi-gray">
                    {t('team.founder.bio')}
                  </p>

                  {/* Social links */}
                  <div className="mt-6 flex gap-3">
                    {/* LinkedIn */}
                    <a
                      href="#"
                      aria-label="LinkedIn"
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-kilsi-gray transition-all duration-300 hover:bg-kilsi-blue/20 hover:text-kilsi-sky"
                    >
                      <svg
                        className="h-5 w-5"
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
                      aria-label="X (Twitter)"
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-kilsi-gray transition-all duration-300 hover:bg-kilsi-blue/20 hover:text-kilsi-sky"
                    >
                      <svg
                        className="h-5 w-5"
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
            </div>
          </RevealOnScroll>

          {/* ── Team grid (placeholder cards) ───────────────────── */}
          <RevealOnScroll direction="right" className="lg:w-2/5">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <TeamMemberCard
                name=""
                title=""
                isPlaceholder
              />
              <TeamMemberCard
                name=""
                title=""
                isPlaceholder
              />
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </Section>
  );
};

export default TeamSection;
