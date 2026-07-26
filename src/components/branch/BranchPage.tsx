import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { branchesData } from '../../data/branchesData';
import Section from '../layout/Section';
import GlowButton from '../ui/GlowButton';
import RevealOnScroll from '../ui/RevealOnScroll';
import ScrollIndicator from '../ui/ScrollIndicator';
import { supabase } from '../../lib/supabaseClient';

function BranchPage() {
  const { id } = useParams<{ id: string }>();
  const { language, t } = useLanguage();

  const branch = id ? branchesData[id] : null;

  // FasoLabel Form State
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    whatsapp: '',
    email: '',
    studies: 'bac',
    moore: false,
    dioula: false,
    motivation: '',
  });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCvFile(e.target.files[0]);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      let cvUrl = '';
      if (cvFile) {
        const fileExt = cvFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('cv-uploads')
          .upload(fileName, cvFile);

        if (uploadError) {
          throw new Error(language === 'fr' 
            ? "Erreur lors de l'envoi du CV dans le cloud." 
            : "Error uploading CV file to cloud storage.");
        }

        if (uploadData) {
          const { data: { publicUrl } } = supabase.storage
            .from('cv-uploads')
            .getPublicUrl(fileName);
          cvUrl = publicUrl;
        }
      }

      const langs: string[] = [];
      if (formData.moore) langs.push('Mooré');
      if (formData.dioula) langs.push('Dioula');

      const { error: insertError } = await supabase
        .from('fasolabel_applications')
        .insert([{
          last_name: formData.lastName,
          first_name: formData.firstName,
          whatsapp: formData.whatsapp,
          email: formData.email,
          studies: formData.studies,
          languages: langs,
          motivation: formData.motivation,
          cv_url: cvUrl
        }]);

      if (insertError) {
        throw new Error(language === 'fr'
          ? "Erreur lors de l'enregistrement de votre candidature."
          : "Error recording your application in database.");
      }

      setFormSubmitted(true);
      setFormData({
        lastName: '',
        firstName: '',
        whatsapp: '',
        email: '',
        studies: 'bac',
        moore: false,
        dioula: false,
        motivation: '',
      });
      setCvFile(null);
    } catch (err: any) {
      setSubmitError(err.message || 'Error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (branch) {
      const pageTitle = `${branch.name} — Kilsi Tech`;
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
                  <div className="glass-card group p-6 sm:p-8 rounded-2xl h-full border border-white/5 hover:border-kilsi-blue/20 transition-all duration-300">
                    <h3 className="font-display text-lg font-bold text-kilsi-light mb-3 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-kilsi-blue transition-all duration-300 group-hover:scale-125 group-hover:bg-kilsi-gold" />
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

      {/* ── 2.5. FasoLabel Section (Only for Kilsi Data) ── */}
      {branch.id === 'data' && (
        <section id="fasolabel" className="py-24 border-t border-white/5 bg-kilsi-night-light/20 relative">
          <div className="max-w-7xl mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              
              {/* Left Column: Project Presentation & Info */}
              <div className="lg:col-span-5">
                <RevealOnScroll direction="left">
                  <span className="text-xs font-semibold uppercase tracking-widest text-kilsi-gold block mb-4">
                    {language === 'fr' ? 'PROJET STRATÉGIQUE' : 'STRATEGIC PROJECT'}
                  </span>
                  <h2 className="font-display text-4xl font-extrabold text-kilsi-light mb-2">
                    Faso<span className="gradient-text-gold">Label</span>
                  </h2>
                  <p className="text-sm text-kilsi-sky/80 uppercase tracking-widest font-semibold mb-6">
                    {t('fasolabel.tagline')}
                  </p>
                  
                  <p className="text-kilsi-gray text-sm leading-relaxed mb-8">
                    {t('fasolabel.desc')}
                  </p>
                  
                  {/* Requirements Card */}
                  <div className="glass-card p-6 rounded-2xl border border-white/5 bg-white/2">
                    <h3 className="font-display text-base font-bold text-kilsi-light mb-4 flex items-center gap-2">
                      <svg className="h-5 w-5 text-kilsi-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {t('fasolabel.req.title')}
                    </h3>
                    <ul className="flex flex-col gap-3.5 text-xs text-kilsi-gray">
                      <li className="flex items-start gap-2.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-kilsi-gold mt-1.5 shrink-0" />
                        <span>{t('fasolabel.req.1')}</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-kilsi-gold mt-1.5 shrink-0" />
                        <span><strong>{t('fasolabel.req.2')}</strong></span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-kilsi-gold mt-1.5 shrink-0" />
                        <span>{t('fasolabel.req.3')}</span>
                      </li>
                    </ul>
                  </div>
                </RevealOnScroll>
              </div>

              {/* Right Column: Application Form */}
              <div className="lg:col-span-7">
                <RevealOnScroll direction="right">
                  <div className="glass-card p-8 rounded-2xl border border-white/5 shadow-[0_15px_40px_rgba(0,0,0,0.3)] bg-kilsi-night/50">
                    <h3 className="font-display text-xl font-bold text-kilsi-light mb-6 flex items-center gap-2">
                      <svg className="h-5 w-5 text-kilsi-sky" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      {t('fasolabel.form.title')}
                    </h3>
                    
                    {formSubmitted ? (
                      <div className="py-8 px-4 text-center animate-fade-in">
                        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-kilsi-gold/10 border border-kilsi-gold/25">
                          <svg className="h-8 w-8 text-kilsi-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="text-sm text-kilsi-light font-medium leading-relaxed max-w-md mx-auto">
                          {t('fasolabel.form.success')}
                        </p>
                        <button
                          type="button"
                          onClick={() => setFormSubmitted(false)}
                          className="mt-6 text-xs text-kilsi-sky hover:text-kilsi-gold transition-colors font-semibold uppercase tracking-wider underline focus:outline-none"
                        >
                          {language === 'fr' ? 'Soumettre un autre profil' : 'Submit another application'}
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleFormSubmit} className="flex flex-col gap-5">
                        
                        {submitError && (
                          <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl font-medium">
                            {submitError}
                          </div>
                        )}
                        
                        {/* Last Name & First Name */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold tracking-wider text-kilsi-gray uppercase">{t('fasolabel.form.lastname')}</label>
                            <input
                              type="text"
                              name="lastName"
                              required
                              value={formData.lastName}
                              onChange={handleInputChange}
                              placeholder={t('fasolabel.form.lastname.placeholder')}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-kilsi-light placeholder-kilsi-gray/40 focus:border-kilsi-gold focus:outline-none transition"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold tracking-wider text-kilsi-gray uppercase">{t('fasolabel.form.firstname')}</label>
                            <input
                              type="text"
                              name="firstName"
                              required
                              value={formData.firstName}
                              onChange={handleInputChange}
                              placeholder={t('fasolabel.form.firstname.placeholder')}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-kilsi-light placeholder-kilsi-gray/40 focus:border-kilsi-gold focus:outline-none transition"
                            />
                          </div>
                        </div>

                        {/* WhatsApp & Email */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold tracking-wider text-kilsi-gray uppercase">{t('fasolabel.form.whatsapp')}</label>
                            <input
                              type="tel"
                              name="whatsapp"
                              required
                              value={formData.whatsapp}
                              onChange={handleInputChange}
                              placeholder={t('fasolabel.form.whatsapp.placeholder')}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-kilsi-light placeholder-kilsi-gray/40 focus:border-kilsi-gold focus:outline-none transition"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold tracking-wider text-kilsi-gray uppercase">{t('fasolabel.form.email')}</label>
                            <input
                              type="email"
                              name="email"
                              required
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder={t('fasolabel.form.email.placeholder')}
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-kilsi-light placeholder-kilsi-gray/40 focus:border-kilsi-gold focus:outline-none transition"
                            />
                          </div>
                        </div>

                        {/* Studies Level (Dropdown) */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold tracking-wider text-kilsi-gray uppercase">{t('fasolabel.form.studies')}</label>
                          <select
                            name="studies"
                            value={formData.studies}
                            onChange={handleInputChange}
                            className="w-full bg-kilsi-night border border-white/10 rounded-xl px-4 py-2.5 text-sm text-kilsi-light focus:border-kilsi-gold focus:outline-none transition cursor-pointer"
                          >
                            <option value="bac">{language === 'fr' ? 'Baccalauréat (Bac)' : 'High School (Baccalaureate)'}</option>
                            <option value="bac2">{language === 'fr' ? 'Bac + 2 (BTS, DUT, classes prépas...)' : 'Associate Degree (Bac + 2)'}</option>
                            <option value="bac3">{language === 'fr' ? 'Licence (Bac + 3)' : "Bachelor's Degree (Bac + 3)"}</option>
                            <option value="master">{language === 'fr' ? 'Master / Diplôme d\'Ingénieur (Bac + 5)' : "Master's Degree (Bac + 5)"}</option>
                            <option value="doctorat">{language === 'fr' ? 'Doctorat / PhD' : 'Doctorate / PhD'}</option>
                            <option value="autre">{language === 'fr' ? 'Autre niveau' : 'Other Level'}</option>
                          </select>
                        </div>

                        {/* Local Languages Checked (Mooré / Dioula) */}
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-semibold tracking-wider text-kilsi-gray uppercase">{t('fasolabel.form.langs')}</label>
                          <div className="flex gap-6 items-center mt-1">
                            <label className="flex items-center gap-2.5 text-sm text-kilsi-light cursor-pointer group">
                              <input
                                type="checkbox"
                                name="moore"
                                checked={formData.moore}
                                onChange={handleCheckboxChange}
                                className="h-4 w-4 rounded border border-white/10 bg-white/5 text-kilsi-gold focus:ring-0 focus:ring-offset-0 focus:outline-none cursor-pointer"
                              />
                              <span className="group-hover:text-kilsi-gold transition-colors">Mooré</span>
                            </label>
                            <label className="flex items-center gap-2.5 text-sm text-kilsi-light cursor-pointer group">
                              <input
                                type="checkbox"
                                name="dioula"
                                checked={formData.dioula}
                                onChange={handleCheckboxChange}
                                className="h-4 w-4 rounded border border-white/10 bg-white/5 text-kilsi-gold focus:ring-0 focus:ring-offset-0 focus:outline-none cursor-pointer"
                              />
                              <span className="group-hover:text-kilsi-gold transition-colors">Dioula</span>
                            </label>
                          </div>
                        </div>

                        {/* CV File Attachment Selector */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold tracking-wider text-kilsi-gray uppercase">{t('fasolabel.form.cv')}</label>
                          <div className="relative w-full">
                            <input
                              type="file"
                              accept=".pdf"
                              required
                              onChange={handleFileChange}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="w-full bg-white/5 border border-dashed border-white/10 rounded-xl px-4 py-3 text-sm text-kilsi-gray flex items-center justify-between hover:border-kilsi-sky/30 hover:bg-white/7 transition">
                              <span className={cvFile ? 'text-kilsi-light font-medium' : 'text-kilsi-gray/50'}>
                                {cvFile ? cvFile.name : t('fasolabel.form.cv.select')}
                              </span>
                              <svg className="h-5 w-5 text-kilsi-sky" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                              </svg>
                            </div>
                          </div>
                        </div>

                        {/* Motivation Textarea */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold tracking-wider text-kilsi-gray uppercase">{t('fasolabel.form.motivation')}</label>
                          <textarea
                            name="motivation"
                            rows={3}
                            value={formData.motivation}
                            onChange={handleInputChange}
                            placeholder={t('fasolabel.form.motivation.placeholder')}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-kilsi-light placeholder-kilsi-gray/40 focus:border-kilsi-gold focus:outline-none transition resize-none"
                          />
                        </div>

                        {/* Submit Button */}
                        <div className="mt-2">
                          <button
                            type="submit"
                            disabled={isSubmitting || (!formData.moore && !formData.dioula)}
                            className="w-full relative flex items-center justify-center gap-2 rounded-full py-3.5 text-xs font-bold uppercase tracking-widest text-kilsi-night bg-kilsi-gold shadow-[0_4px_20px_rgba(232,178,58,0.3)] hover:shadow-[0_4px_25px_rgba(232,178,58,0.5)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none transition-all duration-300 cursor-pointer font-display"
                          >
                            {isSubmitting ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-kilsi-night" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={4} />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                {t('fasolabel.form.submitting')}
                              </>
                            ) : (
                              t('fasolabel.form.submit')
                            )}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </RevealOnScroll>
              </div>
              
            </div>
          </div>
        </section>
      )}

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
