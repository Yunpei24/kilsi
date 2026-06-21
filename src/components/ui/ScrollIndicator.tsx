interface ScrollIndicatorProps {
  className?: string;
}

function ScrollIndicator({ className = '' }: ScrollIndicatorProps) {
  return (
    <div
      className={`absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-slow ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-8 w-8 text-white/40"
        aria-hidden="true"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
      <span className="sr-only">Faire défiler</span>
    </div>
  );
}

export default ScrollIndicator;
