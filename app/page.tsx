import { CommunitySection } from "@/components/layout/sections/community";
import { FAQSection } from "@/components/layout/sections/faq";
import { FooterSection } from "@/components/layout/sections/footer";
import { HeroSection } from "@/components/layout/sections/hero";

export default function Home() {
  return (
    <>
      <HeroSection />
      <CommunitySection />
      <FAQSection />
      <FooterSection />
    </>
  );
}
