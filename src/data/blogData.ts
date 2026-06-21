export interface Article {
  id: string;
  title: { fr: string; en: string };
  date: string;
  author: { fr: string; en: string };
  readTime: { fr: string; en: string };
  summary: { fr: string; en: string };
  content: { fr: string[]; en: string[] }; // Array of paragraphs
}

export const blogArticles: Article[] = [
  {
    id: 'souverainete-numerique-afrique-ia',
    title: {
      fr: 'Souveraineté Numérique : Pourquoi l\'Afrique doit labelliser ses propres données d\'IA',
      en: 'Digital Sovereignty: Why Africa Must Label Its Own AI Data',
    },
    date: '2026-06-20',
    author: {
      fr: 'Dr. Joshua Juste E. Yun Pei NIKIEMA',
      en: 'Dr. Joshua Juste E. Yun Pei NIKIEMA',
    },
    readTime: {
      fr: '5 min de lecture',
      en: '5 min read',
    },
    summary: {
      fr: 'L\'essor de l\'intelligence artificielle en Afrique nécessite des données d\'entraînement représentatives. Découvrez comment le projet FasoLabel s\'inscrit dans cette souveraineté tout en créant des opportunités locales.',
      en: 'The rise of AI in Africa requires representative training data. Discover how the FasoLabel project fits into this digital sovereignty while creating local opportunities.',
    },
    content: {
      fr: [
        'L\'intelligence artificielle moderne repose sur un carburant essentiel : la donnée. Cependant, la grande majorité des modèles d\'IA actuels sont entraînés sur des données provenant d\'Europe, d\'Asie ou d\'Amérique. Cette situation crée un biais culturel et linguistique profond, rendant ces technologies moins efficaces pour répondre aux réalités africaines.',
        'Les langues locales comme le Mooré, le Dioula ou le Fulfuldé sont quasiment absentes des jeux de données mondiaux. C\'est pour combler cet angle mort que nous avons lancé l\'initiative FasoLabel au sein de la branche Kilsi Data. Notre objectif est de concevoir, opérer et héberger une plateforme souveraine d\'annotation de données au Burkina Faso, en parfaite adéquation avec la stratégie nationale « zéro donnée à l\'extérieur ».',
        'La labellisation souveraine ne répond pas seulement à un défi technique ; c\'est aussi un enjeu de sécurité nationale et d\'éthique. En gardant nos données sur notre sol, nous protégeons les informations sensibles de nos institutions tout en valorisant économiquement le travail de notre jeunesse.',
        'FasoLabel s\'appuie sur un modèle de crowdsourcing où des contributeurs locaux (niveau Bac et supérieur) sont formés et rémunérés équitablement pour annoter du texte, de la voix et des images. C\'est l\'illustration parfaite de notre slogan : "Intelligence built in Africa, designed for the world".'
      ],
      en: [
        'Modern artificial intelligence relies on one essential fuel: data. However, the vast majority of current AI models are trained on datasets originating from Europe, Asia, or America. This creates a deep cultural and linguistic bias, making these technologies less effective for African realities.',
        'Local languages such as Mooré, Dioula, or Fulfuldé are virtually absent from global training datasets. To address this blind spot, we launched the FasoLabel initiative within the Kilsi Data branch. Our goal is to design, operate, and host a sovereign data annotation platform in Burkina Faso, aligning directly with the national "zero data outside" strategy.',
        'Sovereign labeling is not just a technical challenge; it is a matter of national security and ethics. By keeping our data on our soil, we protect sensitive institutional information while economically empowering our local youth.',
        'FasoLabel operates as a crowdsourcing platform where local contributors (Baccalaureate level and above) are trained and fairly compensated to annotate text, voice, and imagery. It is the perfect illustration of our slogan: "Intelligence built in Africa, designed for the world".'
      ]
    }
  },
  {
    id: 'mlops-industrialiser-ia-sahel',
    title: {
      fr: 'De l\'architecture au MLOps : Industrialiser l\'Intelligence Artificielle au Sahel',
      en: 'From Architecture to MLOps: Industrialising AI in the Sahel',
    },
    date: '2026-06-15',
    author: {
      fr: 'Dr. Joshua Juste E. Yun Pei NIKIEMA',
      en: 'Dr. Joshua Juste E. Yun Pei NIKIEMA',
    },
    readTime: {
      fr: '6 min de lecture',
      en: '6 min read',
    },
    summary: {
      fr: 'Entraîner un modèle d\'IA est une chose, le mettre en production à grande échelle en est une autre. Analyse des défis et solutions d\'infrastructure Cloud et MLOps dans le contexte sahélien.',
      en: 'Training an AI model is one thing, deploying it at scale is another. An analysis of Cloud infrastructure and MLOps challenges and solutions in the Sahelian context.',
    },
    content: {
      fr: [
        'Dans le monde de la recherche, la précision d\'un modèle d\'IA sur un jeu de données de test est souvent le but ultime. Mais dans le monde réel, un modèle qui reste dans un laboratoire n\'a aucun impact. L\'industrialisation (ou MLOps) est la discipline qui permet de déployer, surveiller et réentraîner automatiquement des modèles en production.',
        'Au Sahel, les défis d\'infrastructure (connectivité, latence, coût du cloud public international) obligent à repenser l\'architecture des systèmes d\'IA. Chez Kilsi Cloud et Kilsi AI, nous concevons des architectures auto-scalables et conteneurisées (Docker, Kubernetes) adaptées aux datacenters locaux.',
        'L\'inauguration récente de datacenters nationaux au Burkina Faso offre une opportunité historique : déployer des modèles d\'IA sur un cloud souverain à faible latence. Cela permet de répondre à des cas d\'usage critiques, de la détection précoce des maladies agricoles par imagerie drone à la supervision automatisée d\'infrastructures.',
        'La transition vers l\'industrialisation exige également de nouvelles compétences. C\'est pourquoi, à travers Kilsi Academy, nous formons la prochaine génération d\'ingénieurs DevOps et MLOps ouest-africains, prêts à relever les défis de demain.'
      ],
      en: [
        'In the research world, a model\'s accuracy on a test dataset is often the ultimate goal. But in the real world, a model that remains in a lab has zero impact. Industrialization (or MLOps) is the discipline that allows for the automated deployment, monitoring, and retraining of models in production.',
        'In the Sahel, infrastructure challenges (connectivity, latency, international public cloud costs) force us to rethink AI system architectures. At Kilsi Cloud and Kilsi AI, we design auto-scalable and containerized (Docker, Kubernetes) architectures tailored for local datacenters.',
        'The recent inauguration of national datacenters in Burkina Faso offers a historic opportunity: deploying AI models on a low-latency sovereign cloud. This solves critical use cases, from early agricultural crop disease detection via drone imagery to automated infrastructure monitoring.',
        'The transition to industrialization also demands new skillsets. This is why, through Kilsi Academy, we train the next generation of West African DevOps and MLOps engineers, ready to tackle tomorrow\'s challenges.'
      ]
    }
  }
];
