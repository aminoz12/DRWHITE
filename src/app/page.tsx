import Hero from "./components/Hero";
import BestSellers from "./components/BestSellers";
import WhyCliniWhite from "./components/WhyCliniWhite";
import HowItWorks from "./components/HowItWorks";
import Bundles from "./components/Bundles";
import WhyItWorks from "./components/WhyItWorks";
import Worldwide from "./components/Worldwide";
import FAQ from "./components/FAQ";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default async function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <BestSellers />
        <HowItWorks />
        <WhyCliniWhite />
        <Bundles />
        <WhyItWorks />
        <Worldwide />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
