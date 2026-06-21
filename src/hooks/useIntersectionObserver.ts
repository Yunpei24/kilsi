import { useEffect, useRef, useState, useCallback } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

function useIntersectionObserver({
  threshold = 0.15,
  rootMargin = '0px',
  triggerOnce = true,
}: UseIntersectionObserverOptions = {}): [React.RefCallback<Element>, boolean] {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const ref = useCallback(
    (node: Element | null) => {
      // Clean up previous observer
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      if (!node) return;

      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          const entering = entry.isIntersecting;
          setIsIntersecting(entering);

          if (entering && triggerOnce && observerRef.current) {
            observerRef.current.disconnect();
            observerRef.current = null;
          }
        },
        { threshold, rootMargin }
      );

      observerRef.current.observe(node);
    },
    [threshold, rootMargin, triggerOnce]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return [ref, isIntersecting];
}

export default useIntersectionObserver;
