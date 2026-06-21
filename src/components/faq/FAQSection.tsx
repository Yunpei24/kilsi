import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import RevealOnScroll from '../ui/RevealOnScroll';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

function FAQItem({ question, answer, isOpen, onClick }: FAQItemProps) {
  return (
    <div className="border-b border-white/5 py-4 last:border-0">
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center text-left py-3 focus:outline-none group cursor-pointer"
      >
        <span className={`font-display text-base font-semibold transition-colors duration-300 ${isOpen ? 'text-kilsi-gold' : 'text-kilsi-light group-hover:text-kilsi-gold/80'}`}>
          {question}
        </span>
        <span className={`ml-4 shrink-0 transition-transform duration-300 text-kilsi-gray/60 group-hover:text-kilsi-gold ${isOpen ? 'rotate-180 text-kilsi-gold' : ''}`}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-60 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}
      >
        <p className="text-sm text-kilsi-gray leading-relaxed pr-6">
          {answer}
        </p>
      </div>
    </div>
  );
}

function FAQSection() {
  const { language } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqData = {
    fr: [
      {
        q: "Qu'est-ce que Kilsi AI ?",
        a: "Kilsi AI est une start-up technologique ouest-africaine qui propose une offre d'excellence complète couvrant l'ingénierie logicielle, l'intelligence artificielle, le traitement de données, l'exploitation géospatiale par drone, les infrastructures cloud souveraines et la formation technique."
      },
      {
        q: "Comment fonctionne le projet FasoLabel ?",
        a: "FasoLabel est notre plateforme souveraine d'annotation de données. Nous recrutons et formons des annotateurs locaux (niveau Bac et plus) s'exprimant en langues nationales (Mooré, Dioula) pour labelliser des données d'IA. Aucune donnée ne quitte le territoire, conformément à la stratégie « zéro donnée à l'extérieur »."
      },
      {
        q: "Pourquoi Kilsi Cloud met-il l'accent sur la souveraineté ?",
        a: "La souveraineté numérique protège l'économie et la sécurité nationale. En hébergeant les architectures et les pipelines d'IA sur des serveurs et datacenters locaux au Burkina Faso, nous évitons la dépendance technologique étrangère et garantissons le respect de la confidentialité des données."
      },
      {
        q: "Qui est le fondateur de Kilsi AI ?",
        a: "Le fondateur et CEO est Joshua Juste E. Yun Pei NIKIEMA, PhD en Intelligence Artificielle. Sa vision est d'ancrer une expertise technologique de pointe en Afrique de l'Ouest et de la faire rayonner à l'échelle internationale."
      }
    ],
    en: [
      {
        q: "What is Kilsi AI?",
        a: "Kilsi AI is a West African technology startup offering a complete range of services covering software engineering, artificial intelligence, data engineering, geospatial drone imaging, sovereign cloud infrastructure, and technical training."
      },
      {
        q: "How does the FasoLabel project work?",
        a: "FasoLabel is our sovereign data annotation platform. We recruit and train local annotators (Baccalaureate level and above) who speak local languages (Mooré, Dioula) to label AI training data. No data leaves the country, adhering to the 'zero data outside' national strategy."
      },
      {
        q: "Why does Kilsi Cloud emphasize digital sovereignty?",
        a: "Digital sovereignty protects both national security and the economy. By hosting AI architectures and pipelines on local datacenters in Burkina Faso, we eliminate foreign technological dependency and ensure total data privacy."
      },
      {
        q: "Who is the founder of Kilsi AI?",
        a: "The founder and CEO is Joshua Juste E. Yun Pei NIKIEMA, PhD in Artificial Intelligence. His vision is to anchor cutting-edge technological expertise in West Africa and make it shine globally."
      }
    ]
  };

  const currentFAQ = faqData[language] || faqData.fr;

  const handleItemClick = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 border-t border-white/5 bg-kilsi-night relative">
      <div className="max-w-4xl mx-auto px-6">
        <RevealOnScroll direction="up">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-kilsi-gold block mb-4">
              F.A.Q.
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-kilsi-light">
              {language === 'fr' ? 'Questions Fréquentes' : 'Frequently Asked Questions'}
            </h2>
          </div>
        </RevealOnScroll>

        <RevealOnScroll direction="up" delay={200}>
          <div className="glass-card p-6 sm:p-8 rounded-2xl border border-white/5 bg-white/2">
            {currentFAQ.map((item, index) => (
              <FAQItem
                key={index}
                question={item.q}
                answer={item.a}
                isOpen={openIndex === index}
                onClick={() => handleItemClick(index)}
              />
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}

export default FAQSection;
