import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 — page inexistante :", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-dark px-6 text-center">
      <Logo />
      <div>
        <p className="font-display text-8xl font-semibold text-gold">404</p>
        <p className="mt-2 text-dark-foreground/70">Cette page n'existe pas.</p>
      </div>
      <Button asChild variant="gold" size="lg">
        <Link to="/">Retour à l'accueil</Link>
      </Button>
    </div>
  );
};

export default NotFound;
