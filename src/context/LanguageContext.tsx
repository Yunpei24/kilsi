import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  fr: {
    // Navbar
    'nav.home': 'Accueil',
    'nav.about': 'À Propos',
    'nav.services': 'Branches',
    'nav.team': 'Équipe',
    'nav.contact': 'Contact',
    'nav.blog': 'Insights',
    'nav.toggle': 'Changer de langue',

    // Hero
    'hero.tagline': 'Intelligence built in Africa, designed for the world.',
    'hero.keywords': 'IA · Logiciel · Data · Drone · Cloud · Formation',
    'hero.cta': 'Découvrir nos solutions',

    // About
    'about.label': 'À propos',
    'about.heading': 'Kilsi — La marche en avant',
    'about.p1': 'En mooré, kilsi signifie « acclamer », « glorifier » — une idée que l\'on retrouve ailleurs en Afrique de l\'Ouest sous le sens du progrès, de la marche en avant.',
    'about.p2': 'Studio à taille humaine pensé pour grandir, Kilsi Tech accompagne entreprises, institutions et porteurs de projets sur l\'ensemble de la chaîne de valeur logicielle et data — du développement web à l\'intelligence artificielle.',
    'about.p3': 'Notre ambition : ancrer une excellence technologique en Afrique de l\'Ouest et la faire rayonner bien au-delà.',
    'about.stat.projects': 'Projets livrés',
    'about.stat.solutions': 'Solutions technologiques',
    'about.stat.tech': 'Technologies maîtrisées',
    'about.stat.africa': 'Engagement Afrique',

    // Services
    'services.label': 'NOS SOLUTIONS',
    'services.heading': 'Une offre complète, de bout en bout',
    'services.subheading': 'De l\'architecture jusqu\'au déploiement, Kilsi Tech conçoit des solutions robustes, élégantes et prêtes à passer à l\'échelle.',

    // Team
    'team.label': 'NOTRE ÉQUIPE',
    'team.heading.prefix': 'Les visionnaires derrière ',
    'team.heading.highlight': 'Kilsi',
    'team.founder.title': 'PhD en Intelligence Artificielle — CEO & Fondateur',
    'team.founder.bio': 'Passionné par l\'intelligence artificielle et son potentiel transformateur pour l\'Afrique, Joshua est le visionnaire derrière Kilsi Tech. Son ambition : bâtir une excellence technologique en Afrique de l\'Ouest et la faire rayonner dans le monde.',
    'team.join': 'Rejoignez l\'aventure Kilsi',

    // Contact
    'contact.label': 'CONTACT',
    'contact.heading.prefix': 'Construisons ',
    'contact.heading.highlight': 'ensemble',
    'contact.subheading': 'Vous avez un projet ? Une idée ? Parlons-en.',
    'contact.form.name': 'Nom',
    'contact.form.name.placeholder': 'Votre nom',
    'contact.form.email': 'Email',
    'contact.form.email.placeholder': 'votre@email.com',
    'contact.form.subject': 'Objet',
    'contact.form.subject.placeholder': 'Sujet de votre message',
    'contact.form.message': 'Message',
    'contact.form.message.placeholder': 'Décrivez votre projet ou votre idée…',
    'contact.form.submit': 'Envoyer le message',

    // Footer
    'footer.copyright': 'Tous droits réservés.',
    'footer.slogan': 'Intelligence built in Africa, designed for the world.',

    // FasoLabel
    'fasolabel.title': 'Projet FasoLabel — Annotation Souveraine',
    'fasolabel.tagline': 'Participez à la création de l\'IA de demain, en langues locales.',
    'fasolabel.desc': 'FasoLabel est une initiative souveraine d\'annotation de données conçue, opérée et hébergée au Burkina Faso dans le cadre de la stratégie nationale « zéro donnée à l\'extérieur ». Nous concevons des jeux de données d\'entraînement de qualité pour l\'IA, notamment pour le Mooré et le Dioula, en s\'appuyant sur une communauté locale rémunérée équitablement.',
    'fasolabel.req.title': 'Profils recherchés',
    'fasolabel.req.1': 'Niveau d\'études Baccalauréat minimum.',
    'fasolabel.req.2': 'Maîtrise parlée et écrite du Mooré ou du Dioula (langues locales).',
    'fasolabel.req.3': 'Aisance avec les outils numériques (ordinateur, internet).',
    'fasolabel.form.title': 'Formulaire de Candidature',
    'fasolabel.form.lastname': 'Nom',
    'fasolabel.form.lastname.placeholder': 'Votre nom de famille',
    'fasolabel.form.firstname': 'Prénom',
    'fasolabel.form.firstname.placeholder': 'Votre prénom',
    'fasolabel.form.whatsapp': 'Numéro WhatsApp',
    'fasolabel.form.whatsapp.placeholder': '+226 XX XX XX XX',
    'fasolabel.form.email': 'Adresse Email',
    'fasolabel.form.email.placeholder': 'votre@email.com',
    'fasolabel.form.studies': 'Niveau d\'études',
    'fasolabel.form.langs': 'Langues locales maîtrisées (sélectionnez au moins une)',
    'fasolabel.form.cv': 'Votre Curriculum Vitae (format PDF, max 5 Mo)',
    'fasolabel.form.cv.select': 'Sélectionner un fichier',
    'fasolabel.form.cv.selected': 'Fichier sélectionné',
    'fasolabel.form.motivation': 'Motivation et expérience d\'annotation',
    'fasolabel.form.motivation.placeholder': 'Décrivez brièvement pourquoi vous souhaitez rejoindre FasoLabel...',
    'fasolabel.form.submit': 'Soumettre ma candidature',
    'fasolabel.form.submitting': 'Envoi en cours...',
    'fasolabel.form.success': 'Votre candidature a été envoyée avec succès ! L\'équipe FasoLabel vous contactera sur WhatsApp ou par email sous peu.'
  },
  en: {
    // Navbar
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.services': 'Branches',
    'nav.team': 'Team',
    'nav.contact': 'Contact',
    'nav.blog': 'Insights',
    'nav.toggle': 'Change language',

    // Hero
    'hero.tagline': 'Intelligence built in Africa, designed for the world.',
    'hero.keywords': 'AI · Software · Data · Drone · Cloud · Training',
    'hero.cta': 'Discover our solutions',

    // About
    'about.label': 'About us',
    'about.heading': 'Kilsi — Moving Forward',
    'about.p1': 'In Mooré, kilsi means "to acclaim" or "to glorify"—an idea found elsewhere in West Africa representing progress and moving forward.',
    'about.p2': 'A human-sized studio designed to grow, Kilsi Tech supports companies, institutions, and project holders across the entire software and data value chain—from web development to artificial intelligence.',
    'about.p3': 'Our ambition: to anchor technological excellence in West Africa and make it shine far beyond.',
    'about.stat.projects': 'Delivered projects',
    'about.stat.solutions': 'Tech solutions',
    'about.stat.tech': 'Mastered technologies',
    'about.stat.africa': 'Africa commitment',

    // Services
    'services.label': 'OUR SOLUTIONS',
    'services.heading': 'A complete offering, from end to end',
    'services.subheading': 'From architecture to deployment, Kilsi Tech designs robust, elegant, and scale-ready solutions.',

    // Team
    'team.label': 'OUR TEAM',
    'team.heading.prefix': 'The visionaries behind ',
    'team.heading.highlight': 'Kilsi',
    'team.founder.title': 'PhD in Artificial Intelligence — CEO & Founder',
    'team.founder.bio': 'Passionate about artificial intelligence and its transformative potential for Africa, Joshua is the visionary behind Kilsi Tech. His ambition: to build technological excellence in West Africa and make it shine across the world.',
    'team.join': 'Join the Kilsi adventure',

    // Contact
    'contact.label': 'CONTACT',
    'contact.heading.prefix': 'Let\'s build ',
    'contact.heading.highlight': 'together',
    'contact.subheading': 'Have a project? An idea? Let\'s talk.',
    'contact.form.name': 'Name',
    'contact.form.name.placeholder': 'Your name',
    'contact.form.email': 'Email',
    'contact.form.email.placeholder': 'your@email.com',
    'contact.form.subject': 'Subject',
    'contact.form.subject.placeholder': 'Subject of your message',
    'contact.form.message': 'Message',
    'contact.form.message.placeholder': 'Describe your project or idea...',
    'contact.form.submit': 'Send message',

    // Footer
    'footer.copyright': 'All rights reserved.',
    'footer.slogan': 'Intelligence built in Africa, designed for the world.',

    // FasoLabel
    'fasolabel.title': 'FasoLabel Project — Sovereign Annotation',
    'fasolabel.tagline': 'Join us in building tomorrow\'s AI, in local languages.',
    'fasolabel.desc': 'FasoLabel is a sovereign data annotation initiative designed, operated, and hosted in Burkina Faso as part of the national \'zero data outside\' strategy. We create high-quality training datasets for AI, focusing on Mooré and Dioula, powered by a fairly compensated local community.',
    'fasolabel.req.title': 'Required Profiles',
    'fasolabel.req.1': 'Minimum Baccalaureate education level.',
    'fasolabel.req.2': 'Spoken and written mastery of Mooré or Dioula (local languages).',
    'fasolabel.req.3': 'Comfortable with digital tools (computer and internet access).',
    'fasolabel.form.title': 'Application Form',
    'fasolabel.form.lastname': 'Last Name',
    'fasolabel.form.lastname.placeholder': 'Your last name',
    'fasolabel.form.firstname': 'First Name',
    'fasolabel.form.firstname.placeholder': 'Your first name',
    'fasolabel.form.whatsapp': 'WhatsApp Number',
    'fasolabel.form.whatsapp.placeholder': '+226 XX XX XX XX',
    'fasolabel.form.email': 'Email Address',
    'fasolabel.form.email.placeholder': 'your@email.com',
    'fasolabel.form.studies': 'Level of Studies',
    'fasolabel.form.langs': 'Mastered local languages (select at least one)',
    'fasolabel.form.cv': 'Your Curriculum Vitae (PDF format, max 5MB)',
    'fasolabel.form.cv.select': 'Select a file',
    'fasolabel.form.cv.selected': 'Selected file',
    'fasolabel.form.motivation': 'Motivation & annotation experience',
    'fasolabel.form.motivation.placeholder': 'Briefly describe why you want to join FasoLabel...',
    'fasolabel.form.submit': 'Submit Application',
    'fasolabel.form.submitting': 'Submitting...',
    'fasolabel.form.success': 'Your application has been submitted successfully! The FasoLabel team will contact you on WhatsApp or email shortly.'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('fr');

  useEffect(() => {
    const savedLang = localStorage.getItem('kilsi-lang') as Language;
    if (savedLang === 'fr' || savedLang === 'en') {
      setLanguageState(savedLang);
    } else {
      // Auto-detect browser language
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'en') {
        setLanguageState('en');
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('kilsi-lang', lang);
    // Update HTML lang attribute for SEO
    document.documentElement.lang = lang;
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
