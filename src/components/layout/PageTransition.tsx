import { useEffect, useState } from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
}

function PageTransition({ children }: PageTransitionProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  return (
    <div
      className={`transition-opacity duration-500 ease-in-out ${
        isMounted ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {children}
    </div>
  );
}

export default PageTransition;
