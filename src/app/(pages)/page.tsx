import FeaturesSection from "@/components/landing/FeaturesSection";
import HeroSection from "@/components/landing/HeroSection";
import PricingSection from "@/components/landing/PricingSection";
import AboutSection from "@/app/(pages)/aboutUs/page";

export default function Home() {
  return (
    <main className="flex flex-col gap-9 bg-[#f4f4f4] pb-9">

      <HeroSection />

      <FeaturesSection />

      <AboutSection />

      <PricingSection />

    </main>
  );
}