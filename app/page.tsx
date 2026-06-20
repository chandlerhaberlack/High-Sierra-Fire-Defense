import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { SystemOverview } from "@/components/SystemOverview";
import { LocalFocus } from "@/components/LocalFocus";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <SystemOverview />
        <LocalFocus />
      </main>
      <Footer />
    </>
  );
}
