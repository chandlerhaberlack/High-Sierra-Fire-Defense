import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Problem } from "@/components/Problem";
import { SystemOverview } from "@/components/SystemOverview";
import { HowItWorks } from "@/components/HowItWorks";
import { LocalFocus } from "@/components/LocalFocus";
import { WaitlistForm } from "@/components/WaitlistForm";
import { Engineering } from "@/components/Engineering";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Problem />
        <SystemOverview />
        <HowItWorks />
        <LocalFocus />
        <WaitlistForm />
        <Engineering />
      </main>
      <Footer />
    </>
  );
}
