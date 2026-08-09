import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { getLegalDoc, legalDocs, legalUpdatedAt, company, type LegalBlock } from '../../data/legalData';
import RevealOnScroll from '../ui/RevealOnScroll';
import Footer from '../layout/Footer';

/**
 * LegalPage
 * Les documents juridiques du site (mentions légales, politique de
 * confidentialité, conditions générales d'utilisation), servis depuis
 * une source unique bilingue et sélectionnables par /legal/:doc.
 */

function BlockView({ block, lang }: { block: LegalBlock; lang: 'fr' | 'en' }) {
  if (block.type === 'p') {
    return (
      <p className="text-sm leading-relaxed text-kilsi-gray lg:text-base">
        {block[lang]}
      </p>
    );
  }

  if (block.type === 'ul') {
    return (
      <ul className="flex flex-col gap-3">
        {block[lang].map((item) => (
          <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-kilsi-gray lg:text-base">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-kilsi-gold" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <dl className="glass-card grid grid-cols-1 gap-x-8 gap-y-4 rounded-2xl p-5 sm:grid-cols-[minmax(0,13rem)_1fr] sm:p-6">
      {block.rows.map((row) => (
        <div key={row.label.en} className="contents">
          <dt className="text-xs font-semibold uppercase tracking-wider text-kilsi-sky/80">
            {row.label[lang]}
          </dt>
          <dd className="-mt-2 text-sm text-kilsi-light sm:mt-0">
            {typeof row.value === 'string' ? row.value : row.value[lang]}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function LegalPage() {
  const { doc: slug } = useParams<{ doc: string }>();
  const { language } = useLanguage();
  const doc = getLegalDoc(slug);

  useEffect(() => {
    document.title = `${doc.title[language]} — Kilsi Tech`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', doc.intro[language]);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', doc.intro[language]);
    document.documentElement.setAttribute('lang', language);
  }, [doc, language]);

  return (
    <div className="min-h-screen bg-kilsi-night text-kilsi-light">
      {/* ── En-tête ── */}
      <header className="relative overflow-hidden border-b border-white/5 bg-kilsi-night-light/20 pt-32 pb-14">
        {/* filet décoratif */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(79,156,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(79,156,255,0.6) 1px, transparent 1px)',
            backgroundSize: '54px 54px',
            maskImage: 'radial-gradient(ellipse at 50% 0%, #000 20%, transparent 72%)',
            WebkitMaskImage: 'radial-gradient(ellipse at 50% 0%, #000 20%, transparent 72%)',
          }}
        />
        <div className="relative mx-auto max-w-5xl px-6 lg:px-12">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-kilsi-light/50 transition-colors duration-300 hover:text-kilsi-gold"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {language === 'fr' ? 'Accueil' : 'Home'}
          </Link>

          <span className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-kilsi-gold">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-kilsi-gold" />
            {language === 'fr' ? 'Informations légales' : 'Legal information'}
          </span>

          <h1 className="font-display text-3xl font-bold tracking-tight text-kilsi-light md:text-5xl">
            {doc.title[language]}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-kilsi-gray">
            {doc.intro[language]}
          </p>
          <p className="mt-6 text-xs uppercase tracking-wider text-kilsi-gray/50">
            {language === 'fr' ? 'Dernière mise à jour' : 'Last updated'} : {legalUpdatedAt[language]}
          </p>
        </div>
      </header>

      {/* ── Corps ── */}
      <div className="mx-auto max-w-5xl px-6 py-14 lg:px-12 lg:py-20">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-14">
          {/* Navigation entre documents */}
          <nav className="lg:w-56 lg:shrink-0">
            <div className="lg:sticky lg:top-28">
              <span className="mb-4 block text-xs font-semibold uppercase tracking-widest text-kilsi-gray/50">
                {language === 'fr' ? 'Documents' : 'Documents'}
              </span>
              <ul className="flex flex-col gap-1.5">
                {legalDocs.map((d) => {
                  const active = d.slug === doc.slug;
                  return (
                    <li key={d.slug}>
                      <Link
                        to={`/legal/${d.slug}`}
                        className={`block rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-all duration-300 ${
                          active
                            ? 'border-kilsi-gold/30 bg-kilsi-gold/10 text-kilsi-gold'
                            : 'border-white/5 bg-white/2 text-kilsi-light/60 hover:border-white/10 hover:bg-white/5 hover:text-kilsi-light'
                        }`}
                      >
                        {d.label[language]}
                      </Link>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-8 rounded-xl border border-white/5 bg-white/2 p-4">
                <p className="text-[11px] leading-relaxed text-kilsi-gray/60">
                  {language === 'fr'
                    ? 'Une question sur ces documents ?'
                    : 'A question about these documents?'}
                </p>
                <a
                  href={`mailto:${company.email}`}
                  className="mt-1.5 inline-block text-xs font-semibold text-kilsi-sky transition-colors hover:text-kilsi-gold"
                >
                  {company.email}
                </a>
              </div>
            </div>
          </nav>

          {/* Contenu du document */}
          <article className="min-w-0 flex-1">
            <div className="flex flex-col gap-12">
              {doc.sections.map((section, index) => (
                <RevealOnScroll key={section.title.en} direction="up" delay={Math.min(index, 4) * 60}>
                  <section className="flex flex-col gap-4">
                    <h2 className="font-display text-xl font-bold text-kilsi-light lg:text-2xl">
                      <span aria-hidden="true" className="mr-3 font-mono text-sm text-kilsi-gold/70">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      {section.title[language]}
                    </h2>
                    {section.blocks.map((block, k) => (
                      <BlockView key={k} block={block} lang={language} />
                    ))}
                  </section>
                </RevealOnScroll>
              ))}
            </div>

            {/* Pied de document */}
            <div className="mt-16 rounded-2xl border border-white/5 bg-kilsi-night-light/30 p-6">
              <p className="text-xs leading-relaxed text-kilsi-gray/60">
                {language === 'fr'
                  ? `${company.name} — ${company.legalForm.fr} au capital de ${company.capital}. RCCM ${company.rccm} · IFU ${company.ifu} · ${company.address.fr}.`
                  : `${company.name} — ${company.legalForm.en} with share capital of ${company.capital}. Trade register ${company.rccm} · Tax ID ${company.ifu} · ${company.address.en}.`}
              </p>
            </div>
          </article>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <Footer />
      </div>
    </div>
  );
}

export default LegalPage;
