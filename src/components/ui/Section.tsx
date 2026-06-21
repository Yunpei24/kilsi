import type { ReactNode } from 'react';

interface SectionProps {
  id: string;
  children: ReactNode;
  className?: string;
}

const Section = ({ id, children, className = '' }: SectionProps) => {
  return (
    <section
      id={id}
      className={`snap-section relative min-h-screen flex flex-col justify-center px-6 lg:px-16 xl:px-24 py-20 lg:py-28 ${className}`}
    >
      {children}
    </section>
  );
};

export default Section;
