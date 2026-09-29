import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Collection from "./components/Collection";
import CTA from "./components/CTA";
import FAQ from "./components/FAQ";
import Featured from "./components/Featured";
import Features from "./components/Features";
import Hero from "./components/Hero";
import Process from "./components/Process";
import Stats from "./components/Stats";
import Testimonials from "./components/Testimonials";

const Home = () => {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Features />
        <Process />
        <Collection />
        <Featured />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
};

export default Home;
