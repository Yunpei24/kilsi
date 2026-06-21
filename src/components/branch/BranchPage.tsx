import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { branchesData } from '../../data/branchesData';
import Section from '../layout/Section';
import GlowButton from '../ui/GlowButton';
import RevealOnScroll from '../ui/RevealOnScroll';
import ScrollIndicator from '../ui/ScrollIndicator';

function BranchPage() {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();

  const branch = id ? branchesData[id] : null;

  useEffect(() => {
    if (branch) {
      const pageTitle = `${branch.name} — Kilsi AI`;
      const description = branch.tagline[language];
      document.title = pageTitle;
      document.querySelector('meta[name="description"]')?.setAttribute('content', description);
      document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
      document.documentElement.setAttribute('lang', language);
    }
  }, [branch, language]);

  if (!branch) {
    return (
      <div className="min-h-screen bg-kilsi-night flex flex-col items-center justify-center text-center p-6">
        <h1 className="font-display text-4xl font-bold text-kilsi-light mb-4">404</h1>
        <p className="text-kilsi-gray mb-8">Branche non trouvée / Branch not found</p>
        <GlowButton href="/" variant="blue">
          Retour à l'accueil / Back Home
        </GlowButton>
      </div>
    );
  }

  return (
    <div className="bg-kilsi-night text-kilsi-light min-h-screen">
      {/* ── 1. Hero Section (SpaceX Style) ── */}
      <Section id={`${branch.id}-hero`} videoSrc={branch.videoSrc} overlayOpacity={0.65}>
        <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center max-w-5xl mx-auto">
          {/* Back button */}
          <Link
            to="/"
            className="absolute top-28 left-6 md:left-12 inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-kilsi-light/50 hover:text-kilsi-gold transition-colors duration-300 uppercase border border-white/5 bg-white/5 px-3 py-2 rounded-lg"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {language === 'fr' ? 'Accueil' : 'Home'}
          </Link>

          {/* Label */}
          <span className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-kilsi-gold animate-fade-in">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-kilsi-gold" />
            {branch.name}
          </span>

          {/* Heading */}
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-kilsi-light mb-6 opacity-0 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {branch.name.split(' ').map((word, i) => i === 1 ? <span key={word} className="gradient-text">{word}</span> : word + ' ')}
          </h1>

          {/* Tagline */}
          <p className="max-w-2xl font-display text-lg md:text-xl text-kilsi-gray mb-12 leading-relaxed opacity-0 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {branch.tagline[language]}
          </p>

          {/* SpaceX style specs/stats bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl border-t border-b border-white/10 py-8 opacity-0 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            {branch.stats.map((stat) => (
              <div key={stat.label[language]} className="text-center">
                <span className="block font-display text-3xl md:text-4xl font-extrabold text-kilsi-gold-deep tracking-tight mb-1">
                  {stat.value}
                </span>
                <span className="text-xs uppercase tracking-wider text-kilsi-gray/70">
                  {stat.label[language]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 opacity-0 animate-fade-in" style={{ animationDelay: '1s' }}>
          <ScrollIndicator />
        </div>
      </Section>

      {/* ── 2. Content Details Section ── */}
      <section className="py-24 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          
          {/* Left Block: Overview */}
          <div className="lg:col-span-1">
            <RevealOnScroll direction="left">
              <span className="text-xs font-semibold uppercase tracking-widest text-kilsi-sky block mb-4">
                {language === 'fr' ? 'Présentation' : 'Overview'}
              </span>
              <h2 className="font-display text-3xl font-bold text-kilsi-light mb-6">
                {language === 'fr' ? 'La vision d\'excellence Kilsi' : 'The Kilsi Vision of Excellence'}
              </h2>
              <p className="text-kilsi-gray text-base leading-relaxed">
                {branch.overview[language]}
              </p>
              
              <div className="mt-10">
                <Link to="/#contact">
                  <GlowButton variant="gold">
                    {language === 'fr' ? 'Lancer un projet' : 'Start a project'}
                  </GlowButton>
                </Link>
              </div>
            </RevealOnScroll>
          </div>

          {/* Right Block: Services Grid */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <RevealOnScroll direction="right">
              <span className="text-xs font-semibold uppercase tracking-widest text-kilsi-gold block mb-4">
                {language === 'fr' ? 'Services & Offres' : 'Services & Scope'}
              </span>
              <h2 className="font-display text-3xl font-bold text-kilsi-light mb-8">
                {language === 'fr' ? 'Ce que nous offrons' : 'What we deliver'}
              </h2>
            </RevealOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {branch.services.map((service, index) => (
                <RevealOnScroll key={service.title[language]} direction="right" delay={index * 100}>
                  <div className="glass-card p-6 sm:p-8 rounded-2xl h-full border border-white/5 hover:border-kilsi-blue/20 transition-all duration-300">
                    <h3 className="font-display text-lg font-bold text-kilsi-light mb-3 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-kilsi-blue" />
                      {service.title[language]}
                    </h3>
                    <p className="text-sm text-kilsi-gray leading-relaxed">
                      {service.desc[language]}
                    </p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Partners / Ecosystem Section ── */}
      <section className="py-24 border-t border-white/5 bg-kilsi-night-light/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <RevealOnScroll direction="up">
            <div className="text-center mb-16">
              <span className="text-xs font-semibold uppercase tracking-widest text-kilsi-gold block mb-4">
                {language === 'fr' ? 'PARTENAIRES & ÉCOSYSTÈME' : 'PARTNERS & ECOSYSTEM'}
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-kilsi-light">
                {language === 'fr' ? 'Ils nous font confiance' : 'Trusted by Innovators'}
              </h2>
              <p className="text-kilsi-gray max-w-xl mx-auto mt-4 text-sm">
                {language === 'fr' 
                  ? 'Écosystème de collaborations stratégiques en Afrique de l\'Ouest pour maximiser l\'impact technologique.' 
                  : 'Collaborative ecosystem driving technology growth and digital empowerment across West Africa.'}
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {branch.partners.map((partner, index) => (
              <RevealOnScroll key={partner.name} direction="up" delay={index * 150}>
                <div className="glass-card p-6 rounded-2xl flex flex-col justify-between h-full hover:bg-white/8 transition-all">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-kilsi-sky border border-kilsi-sky/20 rounded-full px-2 py-0.5 bg-kilsi-blue/5 inline-block mb-4">
                      {partner.type[language]}
                    </span>
                    <h3 className="font-display text-lg font-bold text-kilsi-light mb-2">
                      {partner.name}
                    </h3>
                    <p className="text-xs text-kilsi-gray leading-relaxed">
                      {partner.desc[language]}
                    </p>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. CTA / Footer Area ── */}
      <section className="py-16 text-center border-t border-white/5">
        <div className="max-w-xl mx-auto px-6">
          <RevealOnScroll>
            <h3 className="font-display text-2xl font-bold text-kilsi-light mb-4">
              {language === 'fr' ? 'Prêt à passer à l\'échelle ?' : 'Ready to scale up?'}
            </h3>
            <p className="text-sm text-kilsi-gray mb-8">
              {language === 'fr' 
                ? 'Prenez contact avec nos experts pour concevoir votre infrastructure.' 
                : 'Connect with our team to architect and scale your digital systems.'}
            </p>
            <Link to="/#contact">
              <GlowButton variant="gold" size="lg">
                {language === 'fr' ? 'Nous Contacter' : 'Get in Touch'}
              </GlowButton>
            </Link>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  );
}

export default BranchPage;
