import Section from '../layout/Section';
import RevealOnScroll from '../ui/RevealOnScroll';
import AnimatedCounter from '../ui/AnimatedCounter';
import aboutVideo from '../../assets/videos/about-bg.mp4';
import { useLanguage } from '../../context/LanguageContext';

function AboutSection() {
  const { t } = useLanguage();

  const stats = [
    { end: 50, suffix: '+', label: t('about.stat.projects') },
    { end: 6, label: t('about.stat.solutions') },
    { end: 10, suffix: '+', label: t('about.stat.tech') },
    { end: 100, suffix: '%', label: t('about.stat.africa') },
  ] as const;

  return (
    <Section id="about" diagonalGradient videoSrc={aboutVideo}>
      <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-start lg:gap-16 xl:gap-20">
        {/* ── Left Column — Text (60%) ── */}
        <div className="w-full lg:w-[60%]">
          <RevealOnScroll direction="left">
            {/* Section label */}
            <div className="mb-6 flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-kilsi-gold" />
              <span className="text-xs font-semibold uppercase tracking-widest text-kilsi-gold">
                {t('about.label')}
              </span>
            </div>

            {/* Heading */}
            <h2 className="font-display text-4xl font-bold leading-tight text-kilsi-light lg:text-5xl">
              {t('about.heading')}
            </h2>

            {/* Paragraphs */}
            <div className="mt-8 space-y-5 text-base leading-relaxed text-kilsi-gray lg:text-lg">
              <p>
                {t('about.p1')}
              </p>
              <p>
                {t('about.p2')}
              </p>
              <p>
                {t('about.p3')}
              </p>
            </div>
          </RevealOnScroll>
        </div>

        {/* ── Right Column — Counters (40%) ── */}
        <div className="w-full lg:w-[40%]">
          <RevealOnScroll direction="right" delay={200}>
            <div className="grid grid-cols-2 gap-5 sm:gap-6">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="glass-card flex items-center justify-center rounded-2xl px-4 py-8 sm:px-6 sm:py-10"
                >
                  <AnimatedCounter
                    end={stat.end}
                    suffix={'suffix' in stat ? stat.suffix : undefined}
                    label={stat.label}
                  />
                </div>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </Section>
  );
}

export default AboutSection;
