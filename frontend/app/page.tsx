"use client";

import { useEffect, useState } from "react";
import { templates } from "@/lib/templates";
import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
import TemplateGallery from "@/components/TemplateGallery";
import HowItWorks from "@/components/HowItWorks";
import FeaturesSection from "@/components/FeaturesSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased">
      <HeroSection loaded={loaded} />
      <CategorySection />
      <TemplateGallery templates={templates} />
      <HowItWorks />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </div>
  );
}
