import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { RiskMap } from "@/components/RiskMap";
import { SystemOverview } from "@/components/SystemOverview";
import { Hardware } from "@/components/Hardware";
import { LocalFocus } from "@/components/LocalFocus";
import { Faq } from "@/components/Faq";
import { FinalCta } from "@/components/FinalCta";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <RiskMap />
        <SystemOverview />
        <Hardware />
        <LocalFocus />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
