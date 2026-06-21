// Import videos to resolve path correctly in Vite
import studioVideo from '../assets/videos/studio-bg.mp4';
import aiVideo from '../assets/videos/ai-bg.mp4';
import dataVideo from '../assets/videos/data-bg.mp4';
import droneVideo from '../assets/videos/drone-bg.mp4';
import cloudVideo from '../assets/videos/cloud-bg.mp4';
import academyVideo from '../assets/videos/academy-bg.mp4';

export interface BranchStat {
  value: string;
  label: { fr: string; en: string };
}

export interface BranchService {
  title: { fr: string; en: string };
  desc: { fr: string; en: string };
}

export interface BranchPartner {
  name: string;
  type: { fr: string; en: string };
  desc: { fr: string; en: string };
}

export interface BranchDetails {
  id: string;
  name: string;
  tagline: { fr: string; en: string };
  videoSrc: string;
  overview: { fr: string; en: string };
  stats: BranchStat[];
  services: BranchService[];
  partners: BranchPartner[];
}

export const branchesData: Record<string, BranchDetails> = {
  studio: {
    id: 'studio',
    name: 'Kilsi Studio',
    tagline: {
      fr: 'Ingénierie logicielle et développement sur-mesure.',
      en: 'Software engineering and bespoke development.',
    },
    videoSrc: studioVideo,
    overview: {
      fr: 'Kilsi Studio conçoit et développe des applications web et mobiles robustes, évolutives et adaptées à vos besoins métiers. Nous maîtrisons l\'ensemble du cycle de développement logiciel, de la conception architecturale jusqu\'au déploiement et à la maintenance.',
      en: 'Kilsi Studio designs and builds robust, scalable web and mobile applications tailored to your business needs. We master the entire software development lifecycle, from architectural design to deployment and maintenance.',
    },
    stats: [
      { value: '99.9%', label: { fr: 'Disponibilité des systèmes', en: 'Systems Uptime SLA' } },
      { value: '15+', label: { fr: 'Projets déployés', en: 'Projects Deployed' } },
      { value: '48h', label: { fr: 'Prototype initial rapide', en: 'Fast Initial Prototyping' } },
    ],
    services: [
      {
        title: { fr: 'Applications Web & Mobiles', en: 'Web & Mobile Applications' },
        desc: { fr: 'Développement d\'interfaces modernes, rapides et responsive avec React, React Native et les frameworks récents.', en: 'Building modern, fast, and responsive user interfaces with React, React Native, and current frameworks.' }
      },
      {
        title: { fr: 'Systèmes d\'Information métiers', en: 'Enterprise Information Systems' },
        desc: { fr: 'Conception de bases de données, d\'architectures microservices sécurisées et d\'APIs robustes.', en: 'Designing databases, secure microservices architectures, and robust API endpoints.' }
      },
      {
        title: { fr: 'Audit & Refactoring', en: 'Auditing & Refactoring' },
        desc: { fr: 'Évaluation technique du code existant, correction de dette technique et optimisation des performances.', en: 'Technical assessment of legacy codebases, technical debt reduction, and performance tuning.' }
      }
    ],
    partners: [
      {
        name: 'Sankoré Tech',
        type: { fr: 'Start-up incubée', en: 'Incubated Startup' },
        desc: { fr: 'Refonte complète de leur plateforme de micro-crédits agricoles.', en: 'Complete overhaul of their agricultural micro-credit platform.' }
      },
      {
        name: 'Ouaga Innovation Hub',
        type: { fr: 'Écosystème technologique', en: 'Technology Ecosystem' },
        desc: { fr: 'Partenaire technique pour le développement de prototypes rapides d\'intérêt public.', en: 'Technical partner for developing rapid prototypes of public interest.' }
      }
    ]
  },
  ai: {
    id: 'ai',
    name: 'Kilsi AI',
    tagline: {
      fr: 'L\'intelligence artificielle de pointe, intégrée et industrialisée.',
      en: 'State-of-the-art AI, integrated and industrialised.',
    },
    videoSrc: aiVideo,
    overview: {
      fr: 'Kilsi AI est le cœur de notre dispositif d\'innovation. Nous concevons des modèles d\'apprentissage automatique (Machine Learning) sur-mesure et nous industrialisons leur mise en production via des pipelines MLOps fiables pour répondre aux défis spécifiques de l\'Afrique.',
      en: 'Kilsi AI is the core of our innovation. We design custom machine learning models and industrialize their production deployment through reliable MLOps pipelines to solve African-specific challenges.',
    },
    stats: [
      { value: '10x', label: { fr: 'Accélération des processus', en: 'Process Acceleration Rate' } },
      { value: 'MLOps', label: { fr: 'Industrialisation fiable', en: 'Reliable Industrialisation' } },
      { value: '98%', label: { fr: 'Précision des modèles OCR', en: 'OCR Models Accuracy' } },
    ],
    services: [
      {
        title: { fr: 'Traitement du Langage Naturel (NLP)', en: 'Natural Language Processing (NLP)' },
        desc: { fr: 'Développement d\'agents conversationnels et d\'outils d\'analyse textuelle adaptés aux langues locales.', en: 'Developing conversational agents and textual analytics tools adapted to local languages.' }
      },
      {
        title: { fr: 'Vision par Ordinateur (Computer Vision)', en: 'Computer Vision' },
        desc: { fr: 'Reconnaissance d\'images, classification de défauts et traitement d\'imagerie par réseaux de neurones.', en: 'Image recognition, defect classification, and neural-network-powered image processing.' }
      },
      {
        title: { fr: 'MLOps & Industrialisation', en: 'MLOps & Industrialisation' },
        desc: { fr: 'Automatisation des pipelines d\'entraînement, de test et de mise en production à grande échelle.', en: 'Automation of training, testing, and production deployment pipelines at scale.' }
      }
    ],
    partners: [
      {
        name: 'Alliance IA Afrique',
        type: { fr: 'Think Tank Régional', en: 'Regional Think Tank' },
        desc: { fr: 'Recherche collaborative sur l\'éthique et la souveraineté des données africaines.', en: 'Collaborative research on ethics and sovereignty of African data.' }
      },
      {
        name: 'Sahel Agritech',
        type: { fr: 'Partenaire Industriel', en: 'Industrial Partner' },
        desc: { fr: 'Modèles de détection précoce des maladies des cultures par imagerie mobile.', en: 'Early crop disease detection models using mobile imagery.' }
      }
    ]
  },
  data: {
    id: 'data',
    name: 'Kilsi Data',
    tagline: {
      fr: 'Gouvernance, pipelines automatisés et analytics de vos données.',
      en: 'Data governance, automated pipelines, and analytics.',
    },
    videoSrc: dataVideo,
    overview: {
      fr: 'Kilsi Data transforme vos données brutes en informations stratégiques exploitables. Nous créons des pipelines ETL/ELT robustes, structurons vos bases de données analytiques et fournissons des rapports décisionnels interactifs pour guider vos choix.',
      en: 'Kilsi Data turns raw data into actionable business intelligence. We build robust ETL/ELT pipelines, structure analytical databases, and provide interactive dashboards to guide your business decisions.',
    },
    stats: [
      { value: 'ETL/ELT', label: { fr: 'Pipelines automatisés', en: 'Automated Pipelines' } },
      { value: '10M+', label: { fr: 'Lignes de données traitées', en: 'Data Rows Processed' } },
      { value: '99%', label: { fr: 'Fiabilité des pipelines', en: 'Pipelines Reliability' } },
    ],
    services: [
      {
        title: { fr: 'Pipelines de données (ETL)', en: 'Data Engineering (ETL)' },
        desc: { fr: 'Collecte, nettoyage et chargement automatique de données depuis de multiples sources hétérogènes.', en: 'Automated collection, cleaning, and loading of data from multiple heterogeneous sources.' }
      },
      {
        title: { fr: 'Analytics & Reporting Business', en: 'Analytics & Business Reporting' },
        desc: { fr: 'Conception de tableaux de bord interactifs (PowerBI, Superset) pour un suivi en temps réel de vos KPIs.', en: 'Designing interactive dashboards (PowerBI, Superset) for real-time monitoring of your KPIs.' }
      },
      {
        title: { fr: 'Annotation de données', en: 'Data Labeling & Annotation' },
        desc: { fr: 'Annotation de qualité de jeux de données d\'images et de textes pour l\'entraînement de vos IA.', en: 'High-quality labeling of image and text datasets for training your AI models.' }
      }
    ],
    partners: [
      {
        name: 'Ouaga Agro-Analytics',
        type: { fr: 'Coopérative de données', en: 'Data Cooperative' },
        desc: { fr: 'Mise en place d\'un data warehouse pour centraliser les rendements agricoles régionaux.', en: 'Setup of a data warehouse to centralize regional agricultural yields.' }
      },
      {
        name: 'Afrilogistics',
        type: { fr: 'Entreprise de transport', en: 'Logistics Enterprise' },
        desc: { fr: 'Analyse prédictive des temps de livraison et optimisation des routes logistiques.', en: 'Predictive delivery time analysis and logistics route optimization.' }
      }
    ]
  },
  drone: {
    id: 'drone',
    name: 'Kilsi Drone',
    tagline: {
      fr: 'La couche logicielle intelligente pour l\'exploitation géospatiale.',
      en: 'The intelligent software layer for geospatial exploitation.',
    },
    videoSrc: droneVideo,
    overview: {
      fr: 'Kilsi Drone développe et intègre des solutions logicielles avancées pour exploiter l\'imagerie aérienne capturée par drone. Nous combinons géolocalisation, cartographie 2D/3D et intelligence artificielle pour le suivi agricole, l\'aménagement du territoire et la surveillance.',
      en: 'Kilsi Drone develops and integrates advanced software solutions to leverage drone aerial imagery. We combine geolocation, 2D/3D mapping, and artificial intelligence for agricultural monitoring, land planning, and surveillance.',
    },
    stats: [
      { value: '2cm', label: { fr: 'Précision centimétrique', en: 'Centimetric Accuracy' } },
      { value: 'GIS', label: { fr: 'Intégration géospatiale', en: 'Geospatial Integration' } },
      { value: 'AI-led', label: { fr: 'Analyse d\'image par IA', en: 'AI-powered Image Analysis' } },
    ],
    services: [
      {
        title: { fr: 'Orthomosaïques & Cartographie 3D', en: 'Orthomosaics & 3D Mapping' },
        desc: { fr: 'Création de cartes aériennes de haute précision et de modèles numériques de terrain (MNT).', en: 'Creating high-precision aerial maps and digital terrain models (DTM).' }
      },
      {
        title: { fr: 'Suivi agricole par drone', en: 'Agricultural Monitoring by Drone' },
        desc: { fr: 'Calcul d\'indices de végétation (NDVI) pour estimer la santé des cultures et optimiser les rendements.', en: 'Calculating vegetation indices (NDVI) to estimate crop health and optimize yields.' }
      },
      {
        title: { fr: 'Surveillance et Sécurité logicielle', en: 'Surveillance & Software Security' },
        desc: { fr: 'Détection automatisée d\'intrusions ou d\'anomalies sur de larges étendues à l\'aide d\'algorithmes IA.', en: 'Automated detection of intrusions or anomalies over large areas using AI algorithms.' }
      }
    ],
    partners: [
      {
        name: 'Sahel Drone Service',
        type: { fr: 'Opérateur Aérien', en: 'Aerial Operator' },
        desc: { fr: 'Fourniture de la couche logicielle d\'analyse pour leurs inspections d\'infrastructures.', en: 'Providing the analysis software layer for their infrastructure inspections.' }
      },
      {
        name: 'Institut de Cartographie du Faso',
        type: { fr: 'Organisme Public', en: 'Public Institute' },
        desc: { fr: 'Projet pilote d\'aménagement cadastral numérique par imagerie aérienne.', en: 'Pilot digital cadastre project using aerial imagery.' }
      }
    ]
  },
  cloud: {
    id: 'cloud',
    name: 'Kilsi Cloud',
    tagline: {
      fr: 'Infrastructure souveraine, DevOps et déploiement d\'applications à l\'échelle.',
      en: 'Sovereign infrastructure, DevOps, and scalable deployment.',
    },
    videoSrc: cloudVideo,
    overview: {
      fr: 'Kilsi Cloud conçoit, déploie et administre des architectures d\'hébergement hautement disponibles et sécurisées. Nous accompagnons nos clients dans l\'intégration de pratiques DevOps et le passage à l\'échelle de leurs services.',
      en: 'Kilsi Cloud designs, deploys, and manages highly available and secure hosting architectures. We guide our clients in integrating DevOps practices and scaling their services.',
    },
    stats: [
      { value: '99.99%', label: { fr: 'Taux de disponibilité', en: 'Target Availability' } },
      { value: 'DevOps', label: { fr: 'Déploiement continu', en: 'Continuous Deployment' } },
      { value: 'SecOps', label: { fr: 'Sécurité renforcée', en: 'Hardened Security' } },
    ],
    services: [
      {
        title: { fr: 'Architectures Cloud & Dockerization', en: 'Cloud Architectures & Dockerisation' },
        desc: { fr: 'Conteneurisation d\'applications (Docker, Kubernetes) pour garantir la portabilité et l\'élasticité.', en: 'Application containerization (Docker, Kubernetes) to guarantee portability and elasticity.' }
      },
      {
        title: { fr: 'Pipelines CI/CD (DevOps)', en: 'CI/CD Pipelines (DevOps)' },
        desc: { fr: 'Automatisation des tests et des déploiements pour livrer du code de manière fiable et rapide.', en: 'Automating tests and deployments to release code reliably and fast.' }
      },
      {
        title: { fr: 'Hébergement & Infogérance', en: 'Hosting & Managed Services' },
        desc: { fr: 'Surveillance 24/7, sauvegardes automatisées et optimisation des coûts d\'infrastructure cloud.', en: '24/7 monitoring, automated backups, and cloud infrastructure cost optimization.' }
      }
    ],
    partners: [
      {
        name: 'Sahel Cloud Server',
        type: { fr: 'Hébergeur Local', en: 'Local Hosting Provider' },
        desc: { fr: 'Partenariat technologique pour favoriser l\'hébergement souverain en Afrique de l\'Ouest.', en: 'Tech partnership to promote sovereign hosting in West Africa.' }
      },
      {
        name: 'Ouaga EdTech Startup',
        type: { fr: 'Client Infrastructure', en: 'Infrastructure Client' },
        desc: { fr: 'Mise en place de l\'architecture cloud auto-scalable pour supporter 100 000 utilisateurs.', en: 'Setup of self-scalable cloud architecture to support 100,000 users.' }
      }
    ]
  },
  academy: {
    id: 'academy',
    name: 'Kilsi Academy',
    tagline: {
      fr: 'Formation technologique d\'excellence pour les professionnels et entreprises.',
      en: 'Tech excellence training for professionals and corporations.',
    },
    videoSrc: academyVideo,
    overview: {
      fr: 'Kilsi Academy comble le fossé entre la formation académique et les besoins du marché de l\'emploi technologique. Nous formons les professionnels, étudiants et équipes d\'entreprises aux technologies les plus recherchées (Développement, Data, IA et DevOps).',
      en: 'Kilsi Academy bridges the gap between academic training and tech job market needs. We train professionals, students, and corporate teams in the most demanded technologies (Development, Data, AI, and DevOps).',
    },
    stats: [
      { value: '100%', label: { fr: 'Projets pratiques réels', en: 'Real-world Practical Projects' } },
      { value: '5+', label: { fr: 'Cursus certifiants', en: 'Certified Curriculums' } },
      { value: '150+', label: { fr: 'Professionnels formés', en: 'Professionals Trained' } },
    ],
    services: [
      {
        title: { fr: 'Formations sur-mesure en entreprise', en: 'Bespoke Corporate Training' },
        desc: { fr: 'Programmes de montée en compétences conçus pour vos équipes techniques (IA, Data, Dev, DevOps).', en: 'Upskilling programs designed for your technical teams (AI, Data, Dev, DevOps).' }
      },
      {
        title: { fr: 'Bootcamps intensifs de reconversion', en: 'Intensive Career Bootcamps' },
        desc: { fr: 'Cursus accélérés de 3 à 6 mois basés sur la pratique pour devenir développeur ou data analyst.', en: 'Accelerated 3 to 6-month practice-based courses to become a developer or data analyst.' }
      },
      {
        title: { fr: 'Mentorat individuel d\'excellence', en: 'Individual Mentorship' },
        desc: { fr: 'Accompagnement par des professionnels expérimentés du réseau Kilsi AI.', en: 'Coaching by experienced professionals from the Kilsi AI network.' }
      }
    ],
    partners: [
      {
        name: 'Université Polytechnique de Ouaga',
        type: { fr: 'Partenaire Académique', en: 'Academic Partner' },
        desc: { fr: 'Modules de spécialisation en intelligence artificielle intégrés à leur cursus Master.', en: 'AI specialization modules integrated into their Master\'s curriculum.' }
      },
      {
        name: 'Start-ups du Faso',
        type: { fr: 'Réseau de Recrutement', en: 'Recruitment Network' },
        desc: { fr: 'Insertion directe de nos meilleurs diplômés au sein des startups Burkinabè.', en: 'Direct placement of our top graduates into Burkina Faso startups.' }
      }
    ]
  }
};
