import ParticleCanvas from './ParticleCanvas';
import GlowButton from '../ui/GlowButton';
import ScrollIndicator from '../ui/ScrollIndicator';
import Section from '../layout/Section';
import kilsiLogo from '../../assets/logos/kilsi_logo_complet_blanc.svg';
import heroVideo from '../../assets/videos/hero-bg.mp4';
import { useLanguage } from '../../context/LanguageContext';

/**
 * HeroSection
 * Full-viewport, SpaceX-inspired hero — the very first thing visitors see.
 * Animated particle background, brand logo, tagline, CTA.
 */
const HeroSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <Section id="hero" videoSrc={heroVideo}>

      {/* ── Particle field ─────────────────────────────────────── */}
      <ParticleCanvas />

      {/* ── Foreground content ─────────────────────────────────── */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        {/* Logo */}
        <img
          src={kilsiLogo}
          alt="Kilsi AI"
          className="mb-10 w-[200px] animate-fade-in opacity-0 md:w-[280px] lg:w-[300px]"
          style={{ animationDelay: '0.2s' }}
        />

        {/* Tagline */}
        <p
          className="mb-8 max-w-2xl font-display text-xl leading-relaxed text-kilsi-gray opacity-0 animate-fade-in md:text-2xl lg:text-3xl"
          style={{ animationDelay: '0.6s' }}
        >
          {t('hero.tagline')}
        </p>

        {/* Gold separator line */}
        <div
          className="mx-auto mb-8 h-[2px] w-[60px] rounded-full bg-kilsi-gold opacity-0 shadow-[0_0_12px_rgba(232,178,58,0.5)] animate-fade-in"
          style={{ animationDelay: '1s' }}
        />

        {/* Service keywords */}
        <p
          className="mb-12 text-sm tracking-[0.3em] uppercase text-kilsi-gray/60 opacity-0 animate-fade-in"
          style={{ animationDelay: '1.3s' }}
        >
          {t('hero.keywords')}
        </p>

        {/* CTA */}
        <div
          className="opacity-0 animate-fade-in"
          style={{ animationDelay: '1.6s' }}
        >
          <GlowButton href="#services" variant="gold">
            {t('hero.cta')}
          </GlowButton>
        </div>
      </div>

      {/* ── Scroll indicator pinned to bottom ──────────────────── */}
      <div
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 opacity-0 animate-fade-in"
        style={{ animationDelay: '2.2s' }}
      >
        <ScrollIndicator />
      </div>
    </Section>
  );
};

export default HeroSection;
