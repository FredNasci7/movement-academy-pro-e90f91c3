import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CTASection } from "@/components/home/CTASection";

const Home = () => {
  return (
    <Layout>
      <HeroSection />
      <ServicesSection />
      <TestimonialsSection />
      <CTASection />
    </Layout>
  );
};

export default Home;
