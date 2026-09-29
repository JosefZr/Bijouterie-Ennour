import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Remonte en haut à chaque changement de page, ou va à l'ancre (#collections…) si l'URL en a une.
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
