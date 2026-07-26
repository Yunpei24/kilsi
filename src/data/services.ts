export interface Service {
  name: string;
  subtitle: {
    fr: string;
    en: string;
  };
  description: {
    fr: string;
    en: string;
  };
  icon: string;
  /** Couleur de la branche (code partagé avec les satellites de SolutionsOrbitCanvas) */
  color: string;
}

export const services: Service[] = [
  {
    name: 'Kilsi Studio',
    subtitle: {
      fr: 'Ingénierie logicielle & web',
      en: 'Software & web engineering',
    },
    description: {
      fr: "Plateformes, applications métiers et systèmes sur-mesure, de l'architecture au déploiement.",
      en: 'Bespoke platforms, business applications, and systems, from architecture to deployment.',
    },
    icon: 'M8 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3M7 8l4 4-4 4M13 16h4',
    color: '#2F7BFF',
  },
  {
    name: 'Kilsi AI',
    subtitle: {
      fr: 'Intelligence artificielle & MLOps',
      en: 'Artificial Intelligence & MLOps',
    },
    description: {
      fr: "Conception de modèles d'IA et industrialisation pour une mise en production fiable.",
      en: 'AI model design and industrialization for reliable production deployment.',
    },
    icon: 'M12 2a4 4 0 0 1 4 4c0 1.5-.8 2.8-2 3.4V11h3a3 3 0 0 1 3 3v1.6c1.2.6 2 1.9 2 3.4a4 4 0 0 1-8 0c0-1.5.8-2.8 2-3.4V14a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v1.6c1.2.6 2 1.9 2 3.4a4 4 0 0 1-8 0c0-1.5.8-2.8 2-3.4V14a3 3 0 0 1 3-3h3V9.4C8.8 8.8 8 7.5 8 6a4 4 0 0 1 4-4Z',
    color: '#E8B23A',
  },
  {
    name: 'Kilsi Data',
    subtitle: {
      fr: 'Data engineering & analytics',
      en: 'Data engineering & analytics',
    },
    description: {
      fr: 'Pipelines automatisés, analytics, reporting et annotation de jeux de données.',
      en: 'Automated pipelines, analytics, reporting, and dataset annotation.',
    },
    icon: 'M3 3v18h18M7 16l4-6 4 4 4-8',
    color: '#3ED6C0',
  },
  {
    name: 'Kilsi Drone',
    subtitle: {
      fr: 'Imagerie drone & géospatial',
      en: 'Drone imagery & geospatial',
    },
    description: {
      fr: "Traitement d'imagerie, cartographie et exploitation géospatiale.",
      en: 'Image processing, mapping, and geospatial exploitation.',
    },
    icon: 'M12 2L4 7v4c0 5.5 3.4 10.7 8 12 4.6-1.3 8-6.5 8-12V7l-8-5Zm-1 14 6-6-1.4-1.4L11 13.2 8.4 10.6 7 12l4 4Z',
    color: '#9470FF',
  },
  {
    name: 'Kilsi Cloud',
    subtitle: {
      fr: 'Infrastructure & déploiement',
      en: 'Infrastructure & deployment',
    },
    description: {
      fr: "Hébergement, infrastructure et déploiement de solutions à l'échelle.",
      en: 'Hosting, infrastructure, and deployment of solutions at scale.',
    },
    icon: 'M6.5 19a4.5 4.5 0 0 1-.4-9A6 6 0 0 1 18 10a4 4 0 0 1-1.5 7.7',
    color: '#67D4FF',
  },
  {
    name: 'Kilsi Academy',
    subtitle: {
      fr: 'Formation & compétences',
      en: 'Training & skills development',
    },
    description: {
      fr: "Formation et montée en compétences des professionnels sur le développement, la data et l'IA.",
      en: 'Professional training and upskilling for teams in development, data, and AI.',
    },
    icon: 'M12 3L2 9l10 6 8-4.8V17h2V9L12 3ZM4 11.4V16l8 5 8-5v-4.6l-8 4.8-8-4.8Z',
    color: '#FF8A5C',
  },
];
