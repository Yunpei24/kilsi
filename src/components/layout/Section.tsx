import type { ReactNode } from 'react';

interface SectionProps {
  id: string;
  children: ReactNode;
  className?: string;
  videoSrc?: string;
  overlayOpacity?: number;
  diagonalGradient?: boolean;
}

function Section({
  id,
  children,
  className = '',
  videoSrc,
  overlayOpacity,
  diagonalGradient = false,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`snap-section relative h-screen w-full overflow-hidden ${
        diagonalGradient
          ? 'animated-gradient-bg-diagonal'
          : 'animated-gradient-bg'
      } ${className}`}
    >
      {/* Video background */}
      {videoSrc && (
        <video
          key={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          src={videoSrc}
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden="true"
        />
      )}

      {/* Overlay */}
      <div
        className="video-overlay absolute inset-0 z-[1]"
        style={
          overlayOpacity !== undefined
            ? { opacity: overlayOpacity }
            : undefined
        }
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}

export default Section;
