import Section from '../layout/Section';
import ServiceCard from './ServiceCard';
import { services } from '../../data/services';
import RevealOnScroll from '../ui/RevealOnScroll';
import servicesVideo from '../../assets/videos/services-bg.mp4';
import { useLanguage } from '../../context/LanguageContext';

const ServicesSection = () => {
  const { language, t } = useLanguage();

  return (
    <Section id="services" videoSrc={servicesVideo}>
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-12">
        {/* Section header */}
        <div className="mb-16 text-center">
          {/* Label */}
          <RevealOnScroll>
            <div className="mb-6 flex items-center justify-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-kilsi-gold" />
              <span className="text-sm font-semibold uppercase tracking-widest text-kilsi-gray">
                {t('services.label')}
              </span>
            </div>
          </RevealOnScroll>

          {/* Heading */}
          <RevealOnScroll delay={100}>
            <h2 className="font-display text-4xl font-bold text-kilsi-light lg:text-5xl">
              {t('services.heading')}
            </h2>
          </RevealOnScroll>

          {/* Subheading */}
          <RevealOnScroll delay={200}>
            <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-kilsi-gray">
              {t('services.subheading')}
            </p>
          </RevealOnScroll>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <ServiceCard 
              key={service.name} 
              name={service.name}
              subtitle={service.subtitle[language]}
              description={service.description[language]}
              icon={service.icon}
              index={index} 
            />
          ))}
        </div>
      </div>
    </Section>
  );
};

export default ServicesSection;
