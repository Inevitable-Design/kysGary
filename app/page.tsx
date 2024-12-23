import { BenefitsSection } from "@/components/layout/sections/benefits";
import { CommunitySection } from "@/components/layout/sections/community";
import { ContactSection } from "@/components/layout/sections/contact";
import { FAQSection } from "@/components/layout/sections/faq";
import { FeaturesSection } from "@/components/layout/sections/features";
import { FooterSection } from "@/components/layout/sections/footer";
import { HeroSection } from "@/components/layout/sections/hero";
import { PricingSection } from "@/components/layout/sections/pricing";
import { ServicesSection } from "@/components/layout/sections/services";
import { SponsorsSection } from "@/components/layout/sections/sponsors";
import { TeamSection } from "@/components/layout/sections/team";
import { TestimonialSection } from "@/components/layout/sections/testimonial";

export const metadata = {
  title: "KysGarry - Save Me From The Edge",
  description: "A Web3 game where you try to save KysGarry from jumping. Connect your wallet, join the conversation, and win the prize pool!",
  openGraph: {
    type: "website",
    title: "KysGarry - Save Me From The Edge",
    description: "A Web3 game where you try to save KysGarry from jumping. Connect your wallet, join the conversation, and win the prize pool!",
    images: [
      {
        url: "https://res.cloudinary.com/dbzv9xfjp/image/upload/v1723499276/og-images/shadcn-vue.jpg",
        width: 1200,
        height: 630,
        alt: "Shadcn - Landing template",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "https://github.com/nobruf/shadcn-landing-page.git",
    title: "KysGarry - Save Me From The Edge",
    description: "A Web3 game where you try to save KysGarry from jumping. Connect your wallet, join the conversation, and win the prize pool!",
    images: [
      "https://res.cloudinary.com/dbzv9xfjp/image/upload/v1723499276/og-images/shadcn-vue.jpg",
    ],
  },
};

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
