import { type FormEvent } from 'react';
import Section from '../layout/Section';
import RevealOnScroll from '../ui/RevealOnScroll';
import GlowButton from '../ui/GlowButton';
import Footer from '../layout/Footer';
import contactVideo from '../../assets/videos/contact-bg.mp4';
import { useLanguage } from '../../context/LanguageContext';

/**
 * ContactSection
 * Fifth section — contact form + info cards.
 * Split layout: form on the left, contact info on the right.
 */
const ContactSection: React.FC = () => {
  const { t } = useLanguage();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <Section id="contact" videoSrc={contactVideo}>
      <div className="relative z-10 mx-auto w-full max-w-7xl">
        {/* Section header */}
        <RevealOnScroll direction="up">
          <div className="mb-16 text-center lg:text-left">
            <span className="mb-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-kilsi-gray">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-kilsi-gold" />
              {t('contact.label')}
            </span>
            <h2 className="font-display text-3xl font-bold text-kilsi-light md:text-4xl lg:text-5xl">
              {t('contact.heading.prefix')}
              <span className="gradient-text">{t('contact.heading.highlight')}</span>
            </h2>
            <p className="mt-4 max-w-lg text-base text-kilsi-gray lg:text-lg">
              {t('contact.subheading')}
            </p>
          </div>
        </RevealOnScroll>

        {/* Two-column layout */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-stretch lg:gap-16">
          {/* ── Left: Contact form ──────────────────────────────── */}
          <div className="w-full lg:w-3/5">
            <RevealOnScroll direction="left" className="h-full flex flex-col">
              <form
                onSubmit={handleSubmit}
                className="glass-card space-y-6 rounded-2xl p-6 sm:p-8 flex-1 flex flex-col justify-between"
              >
                {/* Nom */}
                <div>
                  <label
                    htmlFor="contact-name"
                    className="mb-1 block text-sm font-medium text-kilsi-gray"
                  >
                    {t('contact.form.name')}
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    placeholder={t('contact.form.name.placeholder')}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-kilsi-light placeholder-kilsi-gray/50 transition focus:border-kilsi-blue focus:outline-none focus:ring-1 focus:ring-kilsi-blue/50"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="contact-email"
                    className="mb-1 block text-sm font-medium text-kilsi-gray"
                  >
                    {t('contact.form.email')}
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    placeholder={t('contact.form.email.placeholder')}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-kilsi-light placeholder-kilsi-gray/50 transition focus:border-kilsi-blue focus:outline-none focus:ring-1 focus:ring-kilsi-blue/50"
                  />
                </div>

                {/* Objet */}
                <div>
                  <label
                    htmlFor="contact-subject"
                    className="mb-1 block text-sm font-medium text-kilsi-gray"
                  >
                    {t('contact.form.subject')}
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    placeholder={t('contact.form.subject.placeholder')}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-kilsi-light placeholder-kilsi-gray/50 transition focus:border-kilsi-blue focus:outline-none focus:ring-1 focus:ring-kilsi-blue/50"
                  />
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="contact-message"
                    className="mb-1 block text-sm font-medium text-kilsi-gray"
                  >
                    {t('contact.form.message')}
                  </label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    placeholder={t('contact.form.message.placeholder')}
                    className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-kilsi-light placeholder-kilsi-gray/50 transition focus:border-kilsi-blue focus:outline-none focus:ring-1 focus:ring-kilsi-blue/50"
                  />
                </div>

                {/* Submit */}
                <GlowButton variant="gold">
                  {t('contact.form.submit')}
                </GlowButton>
              </form>
            </RevealOnScroll>
          </div>

          {/* ── Right: Contact info & Map ─────────────────────────── */}
          <div className="w-full lg:w-2/5 flex flex-col gap-4 justify-between">
            {/* Grid of contact items */}
            <RevealOnScroll direction="right">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Location */}
                <ContactInfoItem
                  icon={
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  }
                  label="Ouagadougou, Burkina Faso"
                />

                {/* Email */}
                <ContactInfoItem
                  icon={
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0119.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  }
                  label="contact@kilsi.ai"
                  href="mailto:contact@kilsi.ai"
                />

                {/* LinkedIn */}
                <ContactInfoItem
                  icon={
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  }
                  label="LinkedIn"
                  href="#"
                />

                {/* X / Twitter */}
                <ContactInfoItem
                  icon={
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  }
                  label="X (Twitter)"
                  href="#"
                />
              </div>
            </RevealOnScroll>

            {/* Map Card */}
            <RevealOnScroll direction="right" className="flex-1 flex flex-col">
              <div className="glass-card overflow-hidden rounded-2xl flex-1 min-h-[300px] relative group">
                <iframe
                  title="Kilsi Tech Office Location"
                  src="https://maps.google.com/maps?q=Kilsi%20AI,%20Ouagadougou,%20Burkina%20Faso&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  className="absolute inset-0 w-full h-full border-none transition-all duration-700"
                  style={{ filter: 'grayscale(1) invert(90%) hue-rotate(180deg) contrast(1.2) opacity(0.5)' }}
                  allowFullScreen={false}
                  loading="lazy"
                ></iframe>
                <div className="absolute inset-0 bg-kilsi-night/50 group-hover:bg-kilsi-night/20 flex items-center justify-center transition-all duration-300">
                  <a
                    href="https://goo.gl/maps/3UbLLkDgj7m7wVib7?g_st=aw"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-kilsi-gold hover:bg-kilsi-gold-deep text-kilsi-night font-bold text-xs uppercase tracking-widest px-4 py-2.5 rounded-xl shadow-lg transition-transform duration-300 hover:scale-105 active:scale-95 z-20"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Google Maps
                  </a>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </Section>
  );
};

/* ── Small helper component for contact info items ───────────── */
interface ContactInfoItemProps {
  icon: React.ReactNode;
  label: string;
  href?: string;
}

function ContactInfoItem({ icon, label, href }: ContactInfoItemProps) {
  const content = (
    <div className="flex items-center gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-kilsi-blue/10 text-kilsi-sky">
        {icon}
      </div>
      <span className="text-sm font-medium text-kilsi-light">{label}</span>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        className="group rounded-xl p-3 transition-all duration-300 hover:bg-white/5"
        target={href.startsWith('mailto:') ? undefined : '_blank'}
        rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
      >
        {content}
      </a>
    );
  }

  return <div className="rounded-xl p-3">{content}</div>;
}

export default ContactSection;
