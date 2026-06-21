import { useEffect, useState, useRef } from 'react';

type ScrollDirection = 'up' | 'down';

interface ScrollState {
  scrollDirection: ScrollDirection;
  scrollY: number;
  isAtTop: boolean;
}

function useScrollDirection(): ScrollState {
  const [scrollState, setScrollState] = useState<ScrollState>({
    scrollDirection: 'down',
    scrollY: 0,
    isAtTop: true,
  });

  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const updateScroll = () => {
      const currentScrollY = window.scrollY;
      const direction: ScrollDirection =
        currentScrollY > lastScrollY.current ? 'down' : 'up';

      setScrollState({
        scrollDirection: direction,
        scrollY: currentScrollY,
        isAtTop: currentScrollY < 50,
      });

      lastScrollY.current = currentScrollY;
      ticking.current = false;
    };

    const handleScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(updateScroll);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return scrollState;
}

export default useScrollDirection;
