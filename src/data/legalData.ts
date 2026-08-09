/**
 * legalData
 * Source unique des informations légales de Kilsi Tech et contenu des
 * documents juridiques du site (mentions légales, politique de
 * confidentialité, conditions générales d'utilisation), en FR et EN.
 *
 * Les identifiants proviennent des pièces officielles délivrées le
 * 31/07/2026 : accusé d'enregistrement et extrait RCCM du Tribunal de
 * commerce de Ouagadougou, et certificat d'Identifiant Financier Unique
 * de la Direction générale des impôts.
 */

export interface Bilingual {
  fr: string;
  en: string;
}

/** Faits légaux réutilisables (footer, mentions, factures…). */
export const company = {
  name: 'KILSI TECH',
  legalForm: {
    fr: 'Société à responsabilité limitée unipersonnelle (SARL unipersonnelle)',
    en: 'Single-member private limited liability company (SARL unipersonnelle)',
  },
  capital: '1 000 000 FCFA (XOF)',
  rccm: 'BF-OUA-01-2026-B13-14579',
  ifu: '00322045Z',
  registryCourt: {
    fr: 'Tribunal de commerce de Ouagadougou',
    en: 'Commercial Court of Ouagadougou',
  },
  registeredOn: { fr: '31 juillet 2026', en: '31 July 2026' },
  address: {
    fr: 'Secteur 49, Ouagadougou, Burkina Faso',
    en: 'Sector 49, Ouagadougou, Burkina Faso',
  },
  postalAddress: 'S/C 1563 Ouaga 09, Ouagadougou, Burkina Faso',
  email: 'contact@kilsi.ai',
  phone: '+226 05 15 07 50',
  director: 'Joshua Juste E. Yun Pei NIKIEMA',
  directorRole: { fr: 'Gérant', en: 'Managing Director' },
  purpose: {
    fr: 'Conception et développement de plateformes web et applicatives, analyse de données, traitement de données satellitaires et spatiales, conseil informatique et développement logiciel.',
    en: 'Design and development of web and application platforms, data analysis, satellite and spatial data processing, IT consulting and software development.',
  },
  taxRegime: {
    fr: 'Impôt sur les sociétés — régime simplifié d\'imposition (Division fiscale de Ouaga 8)',
    en: 'Corporate income tax — simplified tax regime (Ouaga 8 tax division)',
  },
} as const;

/** Blocs de contenu rendus par LegalPage. */
export type LegalBlock =
  | { type: 'p'; fr: string; en: string }
  | { type: 'ul'; fr: string[]; en: string[] }
  | { type: 'facts'; rows: Array<{ label: Bilingual; value: string | Bilingual }> };

export interface LegalSection {
  title: Bilingual;
  blocks: LegalBlock[];
}

export interface LegalDoc {
  slug: string;
  label: Bilingual;
  title: Bilingual;
  intro: Bilingual;
  sections: LegalSection[];
}

/** Dernière mise à jour, affichée en tête de chaque document. */
export const legalUpdatedAt: Bilingual = {
  fr: '9 août 2026',
  en: '9 August 2026',
};

export const legalDocs: LegalDoc[] = [
  // ───────────────────────────── Mentions légales ─────────────────
  {
    slug: 'mentions-legales',
    label: { fr: 'Mentions légales', en: 'Legal Notice' },
    title: { fr: 'Mentions légales', en: 'Legal Notice' },
    intro: {
      fr: "Informations relatives à l'éditeur du site kilsi.ai, à son hébergement et aux conditions d'utilisation de son contenu.",
      en: 'Information about the publisher of kilsi.ai, its hosting, and the conditions of use of its content.',
    },
    sections: [
      {
        title: { fr: 'Éditeur du site', en: 'Site publisher' },
        blocks: [
          {
            type: 'facts',
            rows: [
              { label: { fr: 'Dénomination sociale', en: 'Company name' }, value: company.name },
              { label: { fr: 'Forme juridique', en: 'Legal form' }, value: company.legalForm },
              { label: { fr: 'Capital social', en: 'Share capital' }, value: company.capital },
              { label: { fr: 'Siège social', en: 'Registered office' }, value: company.address },
              { label: { fr: 'Adresse postale', en: 'Postal address' }, value: company.postalAddress },
              { label: { fr: 'N° RCCM', en: 'Trade register no. (RCCM)' }, value: company.rccm },
              { label: { fr: 'N° IFU', en: 'Tax ID no. (IFU)' }, value: company.ifu },
              { label: { fr: 'Immatriculation', en: 'Registration' }, value: { fr: `${company.registryCourt.fr}, le ${company.registeredOn.fr}`, en: `${company.registryCourt.en}, ${company.registeredOn.en}` } },
              { label: { fr: 'Régime fiscal', en: 'Tax regime' }, value: company.taxRegime },
              { label: { fr: 'Téléphone', en: 'Phone' }, value: company.phone },
              { label: { fr: 'Courriel', en: 'Email' }, value: company.email },
            ],
          },
          {
            type: 'p',
            fr: `Objet social : ${company.purpose.fr}`,
            en: `Corporate purpose: ${company.purpose.en}`,
          },
        ],
      },
      {
        title: { fr: 'Directeur de la publication', en: 'Publication director' },
        blocks: [
          {
            type: 'p',
            fr: `La direction de la publication du site est assurée par ${company.director}, ${company.directorRole.fr} de Kilsi Tech. Toute demande relative au contenu du site peut lui être adressée à ${company.email}.`,
            en: `Publication of this website is directed by ${company.director}, ${company.directorRole.en} of Kilsi Tech. Any request regarding the site's content may be sent to ${company.email}.`,
          },
        ],
      },
      {
        title: { fr: 'Hébergement', en: 'Hosting' },
        blocks: [
          {
            type: 'p',
            fr: "Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis — vercel.com. Les données applicatives (formulaires, publications, pièces jointes) sont hébergées par Supabase Inc., 970 Toa Payoh North, Singapour — supabase.com.",
            en: 'This site is hosted by Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, United States — vercel.com. Application data (forms, publications, attachments) is hosted by Supabase Inc., 970 Toa Payoh North, Singapore — supabase.com.',
          },
        ],
      },
      {
        title: { fr: 'Propriété intellectuelle', en: 'Intellectual property' },
        blocks: [
          {
            type: 'p',
            fr: "L'ensemble du site — sa structure, ses textes, ses illustrations, ses animations, son code source, la marque Kilsi Tech, celles de ses branches (Kilsi Studio, Kilsi AI, Kilsi Data, Kilsi Drone, Kilsi Cloud, Kilsi Academy) et leurs logos — est la propriété exclusive de Kilsi Tech, sauf mention contraire explicite.",
            en: 'The entire site — its structure, texts, illustrations, animations, source code, the Kilsi Tech trademark, those of its branches (Kilsi Studio, Kilsi AI, Kilsi Data, Kilsi Drone, Kilsi Cloud, Kilsi Academy) and their logos — is the exclusive property of Kilsi Tech, unless explicitly stated otherwise.',
          },
          {
            type: 'p',
            fr: "Toute reproduction, représentation, adaptation ou exploitation, totale ou partielle, par quelque procédé que ce soit, sans autorisation écrite préalable de Kilsi Tech, est interdite et susceptible de constituer une contrefaçon au sens de l'Annexe VII de l'Accord de Bangui révisé et des textes en vigueur au Burkina Faso.",
            en: 'Any reproduction, representation, adaptation, or exploitation, in whole or in part, by any means whatsoever, without prior written authorisation from Kilsi Tech, is prohibited and may constitute infringement under Annex VII of the revised Bangui Agreement and applicable Burkina Faso law.',
          },
          {
            type: 'p',
            fr: "Une courte citation accompagnée d'un lien vers kilsi.ai reste naturellement possible dans un cadre journalistique ou pédagogique.",
            en: 'Short quotations accompanied by a link to kilsi.ai naturally remain possible for journalistic or educational purposes.',
          },
        ],
      },
      {
        title: { fr: 'Responsabilité et liens', en: 'Liability and links' },
        blocks: [
          {
            type: 'p',
            fr: "Kilsi Tech s'efforce de maintenir les informations publiées exactes et à jour, sans pouvoir garantir leur exhaustivité ni leur permanence. Les indicateurs chiffrés présentés sur le site ont une valeur indicative et ne constituent pas un engagement contractuel.",
            en: 'Kilsi Tech strives to keep published information accurate and up to date, without being able to guarantee its completeness or permanence. Figures presented on the site are indicative and do not constitute a contractual commitment.',
          },
          {
            type: 'p',
            fr: "Le site peut renvoyer vers des sites tiers dont Kilsi Tech ne maîtrise ni le contenu ni les pratiques : leur consultation relève de la seule responsabilité de l'utilisateur.",
            en: 'The site may link to third-party sites whose content and practices Kilsi Tech does not control: visiting them is the user\'s sole responsibility.',
          },
        ],
      },
      {
        title: { fr: 'Signalement', en: 'Reporting' },
        blocks: [
          {
            type: 'p',
            fr: `Pour signaler un contenu inexact, une atteinte à vos droits ou une difficulté technique, écrivez à ${company.email} ou appelez le ${company.phone}. Nous accusons réception sous cinq (5) jours ouvrés.`,
            en: `To report inaccurate content, an infringement of your rights, or a technical issue, write to ${company.email} or call ${company.phone}. We acknowledge receipt within five (5) business days.`,
          },
        ],
      },
    ],
  },

  // ────────────────────── Politique de confidentialité ────────────
  {
    slug: 'confidentialite',
    label: { fr: 'Confidentialité', en: 'Privacy' },
    title: { fr: 'Politique de confidentialité', en: 'Privacy Policy' },
    intro: {
      fr: "Comment Kilsi Tech collecte, utilise et protège vos données à caractère personnel — et comment exercer vos droits.",
      en: 'How Kilsi Tech collects, uses, and protects your personal data — and how to exercise your rights.',
    },
    sections: [
      {
        title: { fr: 'Responsable du traitement', en: 'Data controller' },
        blocks: [
          {
            type: 'p',
            fr: `${company.name}, ${company.address.fr}, RCCM ${company.rccm}, est responsable des traitements de données réalisés depuis ce site. Toute question relative à vos données peut être adressée à ${company.email}.`,
            en: `${company.name}, ${company.address.en}, trade register ${company.rccm}, is the controller of the data processing carried out through this site. Any question about your data may be sent to ${company.email}.`,
          },
          {
            type: 'p',
            fr: "Ces traitements sont soumis à la loi n° 001-2021/AN du 30 mars 2021 portant protection des personnes à l'égard du traitement des données à caractère personnel au Burkina Faso, sous le contrôle de l'Autorité de protection des données personnelles (APDP).",
            en: 'This processing is governed by Burkina Faso Law no. 001-2021/AN of 30 March 2021 on the protection of individuals with regard to the processing of personal data, under the supervision of the Personal Data Protection Authority (APDP).',
          },
        ],
      },
      {
        title: { fr: 'Données collectées', en: 'Data we collect' },
        blocks: [
          {
            type: 'p',
            fr: "Nous ne collectons que les données que vous nous transmettez volontairement, plus un minimum de données techniques nécessaires au fonctionnement du site :",
            en: 'We only collect the data you voluntarily provide, plus the minimum technical data required for the site to work:',
          },
          {
            type: 'ul',
            fr: [
              "Formulaire de contact : nom, adresse électronique, objet et contenu de votre message.",
              "Candidature au programme FasoLabel : nom, prénom, numéro WhatsApp, adresse électronique, niveau d'études, langues locales maîtrisées, curriculum vitæ (PDF) et texte de motivation.",
              "Données techniques : journaux de connexion de nos hébergeurs (adresse IP, date et heure, pages consultées, type de navigateur), conservés à des fins de sécurité et de mesure d'audience agrégée.",
              "Préférence de langue : enregistrée dans le stockage local de votre navigateur (clé « kilsi-lang »), sans identification ni transmission à un tiers.",
            ],
            en: [
              'Contact form: name, email address, subject and content of your message.',
              'FasoLabel programme application: last name, first name, WhatsApp number, email address, education level, local languages spoken, curriculum vitae (PDF), and motivation text.',
              'Technical data: our hosts\' connection logs (IP address, date and time, pages visited, browser type), kept for security purposes and aggregate audience measurement.',
              'Language preference: stored in your browser\'s local storage (key "kilsi-lang"), without identification or transmission to any third party.',
            ],
          },
          {
            type: 'p',
            fr: "Nous ne collectons aucune donnée sensible et n'utilisons ni traceur publicitaire, ni profilage, ni décision automatisée produisant des effets juridiques à votre égard.",
            en: 'We collect no sensitive data and use no advertising trackers, profiling, or automated decision-making producing legal effects concerning you.',
          },
        ],
      },
      {
        title: { fr: 'Finalités et bases légales', en: 'Purposes and legal bases' },
        blocks: [
          {
            type: 'ul',
            fr: [
              "Répondre à vos demandes de contact et assurer le suivi de la relation commerciale — base légale : votre consentement et l'intérêt légitime de Kilsi Tech à répondre aux sollicitations reçues.",
              "Instruire les candidatures FasoLabel : évaluation du profil, échanges avec le candidat, constitution du vivier de recrutement — base légale : votre consentement et les mesures précontractuelles.",
              "Garantir la sécurité, la disponibilité et l'amélioration du site — base légale : intérêt légitime.",
              "Respecter nos obligations comptables, fiscales et légales — base légale : obligation légale.",
            ],
            en: [
              'Responding to your enquiries and managing the commercial relationship — legal basis: your consent and Kilsi Tech\'s legitimate interest in answering the requests it receives.',
              'Reviewing FasoLabel applications: profile assessment, exchanges with the applicant, building the recruitment pool — legal basis: your consent and pre-contractual measures.',
              'Ensuring the security, availability, and improvement of the site — legal basis: legitimate interest.',
              'Complying with our accounting, tax, and legal obligations — legal basis: legal obligation.',
            ],
          },
        ],
      },
      {
        title: { fr: 'Durées de conservation', en: 'Retention periods' },
        blocks: [
          {
            type: 'ul',
            fr: [
              "Messages reçus via le formulaire de contact : trois (3) ans à compter du dernier échange.",
              "Candidatures FasoLabel non retenues : deux (2) ans à compter de la candidature, sauf demande de suppression anticipée.",
              "Documents comptables et contractuels : dix (10) ans, conformément aux obligations légales.",
              "Journaux techniques : douze (12) mois au maximum.",
            ],
            en: [
              'Messages received via the contact form: three (3) years from the last exchange.',
              'Unsuccessful FasoLabel applications: two (2) years from the application, unless earlier deletion is requested.',
              'Accounting and contractual documents: ten (10) years, in accordance with legal obligations.',
              'Technical logs: twelve (12) months maximum.',
            ],
          },
        ],
      },
      {
        title: { fr: 'Destinataires et sous-traitants', en: 'Recipients and processors' },
        blocks: [
          {
            type: 'p',
            fr: "Vos données sont accessibles aux seuls membres habilités de Kilsi Tech qui en ont besoin pour traiter votre demande. Nous faisons appel aux prestataires techniques suivants, liés par des engagements de confidentialité et de sécurité :",
            en: 'Your data is accessible only to authorised Kilsi Tech staff who need it to handle your request. We rely on the following technical providers, bound by confidentiality and security commitments:',
          },
          {
            type: 'ul',
            fr: [
              "Vercel Inc. (États-Unis) — hébergement et diffusion du site.",
              "Supabase Inc. (Singapour) — base de données et stockage des pièces jointes (curriculum vitæ).",
            ],
            en: [
              'Vercel Inc. (United States) — site hosting and delivery.',
              'Supabase Inc. (Singapore) — database and attachment storage (curricula vitae).',
            ],
          },
          {
            type: 'p',
            fr: "Vos données ne sont ni vendues, ni louées, ni cédées à des fins commerciales. Elles peuvent être communiquées à une autorité judiciaire ou administrative sur réquisition légale.",
            en: 'Your data is never sold, rented, or transferred for commercial purposes. It may be disclosed to a judicial or administrative authority upon lawful request.',
          },
        ],
      },
      {
        title: { fr: 'Transferts hors du Burkina Faso', en: 'Transfers outside Burkina Faso' },
        blocks: [
          {
            type: 'p',
            fr: "Nos prestataires d'hébergement étant établis hors du Burkina Faso, certaines données peuvent être traitées à l'étranger. Nous privilégions les prestataires offrant des garanties contractuelles de confidentialité et de sécurité conformes aux standards internationaux. Le projet FasoLabel, lui, s'inscrit dans une démarche de souveraineté : les données d'annotation qu'il produit sont traitées et conservées au Burkina Faso.",
            en: 'As our hosting providers are established outside Burkina Faso, some data may be processed abroad. We favour providers offering contractual confidentiality and security guarantees aligned with international standards. The FasoLabel project, for its part, follows a data-sovereignty approach: the annotation data it produces is processed and stored in Burkina Faso.',
          },
        ],
      },
      {
        title: { fr: 'Sécurité', en: 'Security' },
        blocks: [
          {
            type: 'p',
            fr: "Le site est intégralement servi en HTTPS. L'accès aux données est restreint par authentification et par des règles de sécurité au niveau de la base. Nous appliquons le principe de minimisation : nous ne demandons que les informations strictement utiles à la finalité poursuivie.",
            en: 'The site is served entirely over HTTPS. Access to data is restricted by authentication and database-level security rules. We apply the minimisation principle: we only ask for information strictly useful for the intended purpose.',
          },
        ],
      },
      {
        title: { fr: 'Vos droits', en: 'Your rights' },
        blocks: [
          {
            type: 'p',
            fr: "Vous disposez d'un droit d'accès, de rectification, d'effacement, d'opposition, de limitation du traitement et de retrait de votre consentement à tout moment.",
            en: 'You have the right to access, rectify, erase, object to, and restrict processing of your data, and to withdraw your consent at any time.',
          },
          {
            type: 'p',
            fr: `Pour les exercer, écrivez à ${company.email} en précisant votre demande. Nous répondons dans un délai maximum de trente (30) jours. En cas de réponse insatisfaisante, vous pouvez saisir l'Autorité de protection des données personnelles (APDP) du Burkina Faso.`,
            en: `To exercise them, write to ${company.email} specifying your request. We reply within a maximum of thirty (30) days. If our response is unsatisfactory, you may refer the matter to Burkina Faso's Personal Data Protection Authority (APDP).`,
          },
        ],
      },
      {
        title: { fr: 'Cookies et stockage local', en: 'Cookies and local storage' },
        blocks: [
          {
            type: 'p',
            fr: "Ce site n'utilise aucun cookie publicitaire ni traceur tiers à des fins de suivi comportemental. Seul le stockage local de votre navigateur est utilisé pour mémoriser votre préférence de langue ; vous pouvez l'effacer à tout moment depuis les réglages de votre navigateur. La carte affichée sur la page de contact est fournie par Google Maps, susceptible de déposer ses propres cookies lors de son chargement.",
            en: 'This site uses no advertising cookies or third-party behavioural trackers. Only your browser\'s local storage is used, to remember your language preference; you may clear it at any time from your browser settings. The map shown on the contact page is provided by Google Maps, which may set its own cookies when it loads.',
          },
        ],
      },
      {
        title: { fr: 'Évolution de la politique', en: 'Policy changes' },
        blocks: [
          {
            type: 'p',
            fr: "Cette politique peut être amenée à évoluer avec nos services ou le cadre réglementaire. La date de dernière mise à jour figure en tête de page ; nous vous invitons à la consulter périodiquement.",
            en: 'This policy may evolve alongside our services or the regulatory framework. The date of last update appears at the top of this page; we invite you to review it periodically.',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────── CGU ────────────────────────────
  {
    slug: 'cgu',
    label: { fr: "Conditions d'utilisation", en: 'Terms of Use' },
    title: { fr: "Conditions générales d'utilisation", en: 'Terms of Use' },
    intro: {
      fr: "Les règles qui encadrent l'accès au site kilsi.ai et l'usage de ses contenus et formulaires.",
      en: 'The rules governing access to kilsi.ai and the use of its content and forms.',
    },
    sections: [
      {
        title: { fr: 'Objet', en: 'Purpose' },
        blocks: [
          {
            type: 'p',
            fr: "Les présentes conditions définissent les modalités d'accès et d'utilisation du site kilsi.ai, édité par Kilsi Tech. Le site a une vocation de présentation institutionnelle : il expose nos activités, nos branches et nos publications, et met à disposition des formulaires de contact et de candidature.",
            en: 'These terms define how kilsi.ai, published by Kilsi Tech, may be accessed and used. The site serves an institutional purpose: it presents our activities, branches, and publications, and provides contact and application forms.',
          },
        ],
      },
      {
        title: { fr: 'Acceptation', en: 'Acceptance' },
        blocks: [
          {
            type: 'p',
            fr: "La consultation du site vaut acceptation pleine et entière des présentes conditions. Si vous ne les acceptez pas, il vous appartient de ne pas utiliser le site.",
            en: 'Browsing the site constitutes full acceptance of these terms. If you do not accept them, you should refrain from using the site.',
          },
        ],
      },
      {
        title: { fr: 'Accès au service', en: 'Access to the service' },
        blocks: [
          {
            type: 'p',
            fr: "Le site est accessible gratuitement, en tout lieu, à tout utilisateur disposant d'un accès à Internet — les frais de connexion restant à sa charge. Kilsi Tech peut interrompre l'accès pour maintenance, mise à jour ou pour toute raison technique, sans préavis ni indemnité.",
            en: 'The site is freely accessible, anywhere, to any user with an internet connection — connection costs remain the user\'s responsibility. Kilsi Tech may suspend access for maintenance, updates, or any technical reason, without notice or compensation.',
          },
        ],
      },
      {
        title: { fr: 'Usage attendu', en: 'Expected use' },
        blocks: [
          {
            type: 'p',
            fr: "L'utilisateur s'engage à faire du site un usage loyal et conforme au droit en vigueur. Sont notamment proscrits :",
            en: 'Users undertake to make fair use of the site, in compliance with applicable law. The following are prohibited:',
          },
          {
            type: 'ul',
            fr: [
              "toute tentative d'intrusion, d'altération ou de saturation des systèmes (y compris l'extraction automatisée massive de contenu) ;",
              "l'envoi, via les formulaires, de contenus illicites, diffamatoires, frauduleux ou de données appartenant à un tiers sans son accord ;",
              "l'usurpation d'identité et la transmission d'informations volontairement inexactes ;",
              "la reprise du contenu du site à des fins commerciales sans autorisation écrite préalable.",
            ],
            en: [
              'any attempt to intrude into, alter, or overload the systems (including massive automated content extraction);',
              'submitting, through the forms, unlawful, defamatory, or fraudulent content, or third-party data without their consent;',
              'identity misrepresentation and the submission of knowingly inaccurate information;',
              'reusing the site\'s content for commercial purposes without prior written authorisation.',
            ],
          },
        ],
      },
      {
        title: { fr: 'Propriété intellectuelle', en: 'Intellectual property' },
        blocks: [
          {
            type: 'p',
            fr: "Les contenus du site sont protégés au titre du droit d'auteur et du droit des marques. Aucune disposition des présentes ne saurait être interprétée comme conférant à l'utilisateur un droit de propriété ou une licence sur ces contenus, au-delà du simple droit de consultation.",
            en: 'The site\'s content is protected by copyright and trademark law. Nothing in these terms may be construed as granting users any ownership right or licence over that content, beyond the mere right to view it.',
          },
        ],
      },
      {
        title: { fr: 'Responsabilité', en: 'Liability' },
        blocks: [
          {
            type: 'p',
            fr: "Kilsi Tech met en œuvre les moyens raisonnables pour assurer l'exactitude des informations publiées et la disponibilité du site, sans obligation de résultat. Sa responsabilité ne saurait être engagée à raison d'un dommage indirect, d'une indisponibilité temporaire, d'une erreur typographique, ni de l'usage que l'utilisateur ferait des informations mises à disposition.",
            en: 'Kilsi Tech takes reasonable steps to ensure the accuracy of published information and the availability of the site, without any obligation of result. It may not be held liable for indirect damage, temporary unavailability, typographical errors, or the use a visitor makes of the information provided.',
          },
          {
            type: 'p',
            fr: "Les échanges initiés via les formulaires du site ne constituent ni un devis, ni un engagement contractuel : toute prestation fait l'objet d'un contrat distinct signé entre les parties.",
            en: 'Exchanges initiated through the site\'s forms constitute neither a quotation nor a contractual commitment: any engagement is subject to a separate contract signed by the parties.',
          },
        ],
      },
      {
        title: { fr: 'Données personnelles', en: 'Personal data' },
        blocks: [
          {
            type: 'p',
            fr: "Le traitement des données transmises via le site est décrit dans notre politique de confidentialité, qui fait partie intégrante des présentes conditions.",
            en: 'The processing of data submitted through the site is described in our privacy policy, which forms an integral part of these terms.',
          },
        ],
      },
      {
        title: { fr: 'Modification des conditions', en: 'Changes to these terms' },
        blocks: [
          {
            type: 'p',
            fr: "Kilsi Tech se réserve le droit de modifier les présentes conditions à tout moment afin de les adapter à l'évolution du site ou de la réglementation. La version applicable est celle publiée à la date de votre visite.",
            en: 'Kilsi Tech reserves the right to amend these terms at any time to reflect changes to the site or to regulations. The applicable version is the one published on the date of your visit.',
          },
        ],
      },
      {
        title: { fr: 'Droit applicable et juridiction', en: 'Governing law and jurisdiction' },
        blocks: [
          {
            type: 'p',
            fr: `Les présentes conditions sont régies par le droit burkinabè. À défaut de résolution amiable — que les parties s'engagent à rechercher en priorité —, tout litige relatif à leur interprétation ou à leur exécution relève de la compétence du ${company.registryCourt.fr}.`,
            en: `These terms are governed by the law of Burkina Faso. Failing an amicable settlement — which the parties undertake to seek first — any dispute concerning their interpretation or performance falls under the jurisdiction of the ${company.registryCourt.en}.`,
          },
        ],
      },
    ],
  },
];

export function getLegalDoc(slug?: string): LegalDoc {
  return legalDocs.find((d) => d.slug === slug) ?? legalDocs[0];
}
