import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { branchesData } from '../../data/branchesData';
import Section from '../layout/Section';
import GlowButton from '../ui/GlowButton';
import RevealOnScroll from '../ui/RevealOnScroll';
import ScrollIndicator from '../ui/ScrollIndicator';

/**
 * KilsiAIPage
 * Interface dédiée de la branche phare Kilsi AI (l'ex-marque principale,
 * devenue la branche intelligence artificielle de Kilsi Tech).
 * Hero vidéo, domaines d'expertise, méthode de delivery, stack, partenaires.
 */

interface Expertise {
  title: { fr: string; en: string };
  desc: { fr: string; en: string };
  tags: string[];
  icon: string; // path SVG (stroke)
}

const EXPERTISES: Expertise[] = [
  {
    title: { fr: 'NLP & Langues locales', en: 'NLP & Local Languages' },
    desc: {
      fr: 'Agents conversationnels, analyse de texte et technologies vocales adaptés aux langues africaines, dont le Mooré et le Dioula.',
      en: 'Conversational agents, text analytics, and speech technologies adapted to African languages, including Mooré and Dioula.',
    },
    tags: ['Chatbots', 'Speech-to-Text', 'Mooré · Dioula'],
    icon: 'M8 10h8M8 14h5M21 12a9 9 0 1 1-4.4-7.7L21 3l-1 4.6A8.96 8.96 0 0 1 21 12Z',
  },
  {
    title: { fr: 'Vision par Ordinateur', en: 'Computer Vision' },
    desc: {
      fr: 'OCR de documents, détection d\'objets et contrôle qualité par imagerie — des modèles robustes même sur des données terrain difficiles.',
      en: 'Document OCR, object detection, and image-based quality control — models that stay robust on challenging field data.',
    },
    tags: ['OCR 98%', 'Object Detection', 'Imaging'],
    icon: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  },
  {
    title: { fr: 'IA Générative & Agents', en: 'Generative AI & Agents' },
    desc: {
      fr: 'Assistants métiers fondés sur les LLMs, pipelines RAG sur vos documents et agents autonomes qui automatisent vos processus.',
      en: 'LLM-powered business assistants, RAG pipelines over your documents, and autonomous agents that automate your workflows.',
    },
    tags: ['LLM', 'RAG', 'Agents'],
    icon: 'M12 3v3m0 12v3M3 12h3m12 0h3M7.8 7.8l2 2m4.4 4.4 2 2m0-8.4-2 2m-4.4 4.4-2 2M12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z',
  },
  {
    title: { fr: 'MLOps & Industrialisation', en: 'MLOps & Industrialisation' },
    desc: {
      fr: 'De l\'entraînement au monitoring en production : pipelines reproductibles, déploiement cloud ou edge, coûts maîtrisés.',
      en: 'From training to production monitoring: reproducible pipelines, cloud or edge deployment, controlled costs.',
    },
    tags: ['CI/CD ML', 'Monitoring', 'Edge & Cloud'],
    icon: 'M4 17V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10M2 17h20M8 21h8M9 9l2 2-2 2M13 13h3',
  },
];

const METHOD_STEPS = [
  {
    num: '01',
    title: { fr: 'Cadrage & audit des données', en: 'Scoping & data audit' },
    desc: {
      fr: 'Compréhension du métier, évaluation de la maturité data et définition de cas d\'usage à fort impact mesurable.',
      en: 'Business understanding, data-maturity assessment, and definition of high-impact, measurable use cases.',
    },
  },
  {
    num: '02',
    title: { fr: 'Prototype rapide', en: 'Rapid prototyping' },
    desc: {
      fr: 'Un POC fonctionnel en 4 à 6 semaines pour valider la valeur avant tout investissement d\'échelle.',
      en: 'A working POC in 4 to 6 weeks to validate value before any at-scale investment.',
    },
  },
  {
    num: '03',
    title: { fr: 'Industrialisation MLOps', en: 'MLOps industrialisation' },
    desc: {
      fr: 'Pipelines d\'entraînement et de déploiement automatisés, tests, sécurité et gouvernance des modèles.',
      en: 'Automated training and deployment pipelines, testing, security, and model governance.',
    },
  },
  {
    num: '04',
    title: { fr: 'Opération & amélioration continue', en: 'Operation & continuous improvement' },
    desc: {
      fr: 'Monitoring de la dérive, ré-entraînements planifiés et optimisation des performances comme des coûts.',
      en: 'Drift monitoring, scheduled retraining, and optimization of both performance and costs.',
    },
  },
];

const TECH_STACK = [
  'PyTorch', 'TensorFlow', 'Hugging Face', 'LangChain', 'MLflow',
  'ONNX', 'FastAPI', 'Docker', 'Kubernetes', 'PostgreSQL',
];

function KilsiAIPage() {
  const { language } = useLanguage();
  const branch = branchesData.ai;

  useEffect(() => {
    document.title = 'Kilsi AI — Kilsi Tech';
    const description = branch.tagline[language];
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
    document.documentElement.setAttribute('lang', language);
  }, [branch, language]);

  return (
    <div className="bg-kilsi-night text-kilsi-light min-h-screen">
      {/* ── 1. Hero ── */}
      <Section id="ai-hero" videoSrc={branch.videoSrc} overlayOpacity={0.65}>
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
            {language === 'fr' ? 'Branche phare de Kilsi Tech' : 'Kilsi Tech flagship branch'}
          </span>

          {/* Heading */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-kilsi-light mb-6 opacity-0 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Kilsi <span className="gradient-text">AI</span>
          </h1>

          {/* Tagline */}
          <p className="max-w-2xl font-display text-lg md:text-xl text-kilsi-gray mb-10 leading-relaxed opacity-0 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {branch.tagline[language]}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12 opacity-0 animate-fade-in" style={{ animationDelay: '0.55s' }}>
            <Link to="/#contact">
              <GlowButton variant="gold">
                {language === 'fr' ? 'Lancer un projet IA' : 'Start an AI project'}
              </GlowButton>
            </Link>
            <GlowButton href="#ai-expertise" variant="blue">
              {language === 'fr' ? 'Explorer nos expertises' : 'Explore our expertise'}
            </GlowButton>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl border-t border-b border-white/10 py-8 opacity-0 animate-fade-in" style={{ animationDelay: '0.7s' }}>
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

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 opacity-0 animate-fade-in" style={{ animationDelay: '1s' }}>
          <ScrollIndicator />
        </div>
      </Section>

      {/* ── 2. Vision + Expertises ── */}
      <section id="ai-expertise" className="py-24 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 mb-4">
          <div className="lg:col-span-1">
            <RevealOnScroll direction="left">
              <span className="text-xs font-semibold uppercase tracking-widest text-kilsi-sky block mb-4">
                {language === 'fr' ? 'La branche IA' : 'The AI branch'}
              </span>
              <h2 className="font-display text-3xl font-bold text-kilsi-light mb-6">
                {language === 'fr' ? 'L\'IA utile, du prototype à la production' : 'Useful AI, from prototype to production'}
              </h2>
              <p className="text-kilsi-gray text-base leading-relaxed">
                {branch.overview[language]}
              </p>
              <div className="mt-10">
                <Link to="/#contact">
                  <GlowButton variant="gold">
                    {language === 'fr' ? 'Discuter avec un expert' : 'Talk to an expert'}
                  </GlowButton>
                </Link>
              </div>
            </RevealOnScroll>
          </div>

          {/* Expertise cards */}
          <div className="lg:col-span-2">
            <RevealOnScroll direction="right">
              <span className="text-xs font-semibold uppercase tracking-widest text-kilsi-gold block mb-4">
                {language === 'fr' ? 'Domaines d\'expertise' : 'Areas of expertise'}
              </span>
              <h2 className="font-display text-3xl font-bold text-kilsi-light mb-8">
                {language === 'fr' ? 'Ce que nous construisons' : 'What we build'}
              </h2>
            </RevealOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {EXPERTISES.map((exp, index) => (
                <RevealOnScroll key={exp.title.en} direction="right" delay={index * 100}>
                  <div className="glass-card group p-6 sm:p-8 rounded-2xl h-full border border-white/5 hover:border-kilsi-blue/20 transition-all duration-300 flex flex-col">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-kilsi-blue/10 border border-kilsi-blue/20 text-kilsi-sky group-hover:text-kilsi-gold group-hover:border-kilsi-gold/30 transition-colors duration-300">
                      <svg className="h-5.5 w-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={exp.icon} />
                      </svg>
                    </div>
                    <h3 className="font-display text-lg font-bold text-kilsi-light mb-3">
                      {exp.title[language]}
                    </h3>
                    <p className="text-sm text-kilsi-gray leading-relaxed mb-5 flex-1">
                      {exp.desc[language]}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {exp.tags.map((tag) => (
                        <span key={tag} className="text-[10px] font-bold uppercase tracking-wider text-kilsi-sky border border-kilsi-sky/20 rounded-full px-2.5 py-1 bg-kilsi-blue/5">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Méthode ── */}
      <section className="py-24 border-t border-white/5 bg-kilsi-night-light/20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <RevealOnScroll direction="up">
            <div className="text-center mb-16">
              <span className="text-xs font-semibold uppercase tracking-widest text-kilsi-gold block mb-4">
                {language === 'fr' ? 'NOTRE MÉTHODE' : 'OUR METHOD'}
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-kilsi-light">
                {language === 'fr' ? 'Un chemin maîtrisé vers la production' : 'A controlled path to production'}
              </h2>
              <p className="text-kilsi-gray max-w-xl mx-auto mt-4 text-sm">
                {language === 'fr'
                  ? 'Chaque projet suit quatre étapes courtes et mesurables — la valeur est démontrée avant d\'être industrialisée.'
                  : 'Every project follows four short, measurable stages — value is proven before it is industrialised.'}
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {METHOD_STEPS.map((step, index) => (
              <RevealOnScroll key={step.num} direction="up" delay={index * 120}>
                <div className="glass-card relative p-6 rounded-2xl h-full border border-white/5 overflow-hidden">
                  <span className="absolute -top-3 -right-1 font-display text-7xl font-extrabold text-white/4 select-none">
                    {step.num}
                  </span>
                  <span className="inline-block font-display text-sm font-extrabold text-kilsi-gold mb-4 border border-kilsi-gold/25 bg-kilsi-gold/5 rounded-lg px-2.5 py-1">
                    {step.num}
                  </span>
                  <h3 className="font-display text-base font-bold text-kilsi-light mb-3">
                    {step.title[language]}
                  </h3>
                  <p className="text-xs text-kilsi-gray leading-relaxed">
                    {step.desc[language]}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>

          {/* Tech stack */}
          <RevealOnScroll direction="up" delay={200}>
            <div className="mt-16 text-center">
              <span className="text-xs font-semibold uppercase tracking-widest text-kilsi-sky block mb-6">
                {language === 'fr' ? 'Technologies maîtrisées' : 'Technologies we master'}
              </span>
              <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
                {TECH_STACK.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-semibold tracking-wide text-kilsi-light/70 border border-white/10 bg-white/5 rounded-full px-4 py-2 hover:border-kilsi-gold/40 hover:text-kilsi-gold transition-colors duration-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ── 4. Partenaires ── */}
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

      {/* ── 5. CTA final ── */}
      <section className="py-16 text-center border-t border-white/5">
        <div className="max-w-xl mx-auto px-6">
          <RevealOnScroll>
            <h3 className="font-display text-2xl font-bold text-kilsi-light mb-4">
              {language === 'fr' ? 'Un cas d\'usage IA en tête ?' : 'Have an AI use case in mind?'}
            </h3>
            <p className="text-sm text-kilsi-gray mb-8">
              {language === 'fr'
                ? 'Parlons-en : nous cadrons votre besoin et estimons la faisabilité en une semaine.'
                : 'Let\'s talk: we scope your need and assess feasibility within a week.'}
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

export default KilsiAIPage;
