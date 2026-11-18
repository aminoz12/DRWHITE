import Hero from "./components/Hero";
import FreeFromBar from "./components/FreeFromBar";
import TrustStrip from "./components/TrustStrip";
import ShopTheRange from "./components/ShopTheRange";
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

// Conversion order: promise → choose → buy → proof → compare → upsell to sets
// → social proof → reassurance → risk reversal → objections.
export default async function Home() {
  const country = await getServerCountry();
  return (
    <div className="min-h-screen bg-white">
      <Header country={country} />
      <main id="main-content">
        <Hero />
        <FreeFromBar />
        <ShopTheRange />
        <RealResults />
        <CompareTable />
        <CompleteSets />
        <UgcReels />
        <TrustStrip />
        <GuaranteeBand promises={false} />
        <FAQ withSchema />
      </main>
      <Footer country={country} />
    </div>
  );
}
