import Hero from "./components/Hero";
import TrustStrip from "./components/TrustStrip";
import PromoTiles from "./components/PromoTiles";
import ShopTheRange from "./components/ShopTheRange";
import ResultsByNumbers from "./components/ResultsByNumbers";
import HowV34Works from "./components/HowV34Works";
import RealResults from "./components/RealResults";
import CompareTable from "./components/CompareTable";
import CompleteSets from "./components/CompleteSets";
import UgcReels from "./components/UgcReels";
import GuaranteeBand from "./components/GuaranteeBand";
import FAQ from "./components/FAQ";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { getServerCountry } from "@/lib/market-server";

export const metadata = {
  alternates: { canonical: '/' },
};

// Conversion order: promise → reassurance → choose → buy → understand →
// proof → compare → upsell to sets → social proof → risk reversal → objections.
export default async function Home() {
  const country = await getServerCountry();
  return (
    <div className="min-h-screen bg-white">
      <Header country={country} />
      <main id="main-content">
        <Hero />
        <TrustStrip />
        <PromoTiles />
        <ShopTheRange />
        <HowV34Works />
        <ResultsByNumbers />
        <RealResults />
        <CompareTable />
        <CompleteSets />
        <UgcReels />
        <GuaranteeBand />
        <FAQ withSchema />
      </main>
      <Footer country={country} />
    </div>
  );
}
