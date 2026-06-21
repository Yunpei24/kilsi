import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      
      const scrollToElement = () => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          return true;
        }
        return false;
      };

      // Try scrolling immediately
      if (!scrollToElement()) {
        // If not found, it might still be mounting. Poll for a short time.
        let attempts = 0;
        const interval = setInterval(() => {
          attempts++;
          if (scrollToElement() || attempts >= 10) {
            clearInterval(interval);
          }
        }, 100);
        return () => clearInterval(interval);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

export default ScrollToTop;

