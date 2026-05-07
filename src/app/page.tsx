import Hero from "./components/Hero";
import BestSellers from "./components/BestSellers";
import WhyDrDent from "./components/WhyDrDent";
import HowItWorks from "./components/HowItWorks";
import Bundles from "./components/Bundles";
import WhyItWorks from "./components/WhyItWorks";
import Reviews from "./components/Reviews";
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
        <WhyDrDent />
        <HowItWorks />
        <Bundles />
        <WhyItWorks />
        <Reviews />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
