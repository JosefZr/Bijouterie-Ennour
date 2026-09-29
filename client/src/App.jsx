import { Route, Routes } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import FicheClient from "@/pages/FicheClient";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Formulaire réservé à la boutique : enregistre chaque acheteur dans Google Sheets */}
        <Route path="/fiche-client" element={<FicheClient />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
