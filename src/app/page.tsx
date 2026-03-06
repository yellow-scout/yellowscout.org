import { HeroSection } from '@/components/HeroSection';
import { LiveStats } from '@/components/LiveStats';
import { FeatureGrid } from '@/components/FeatureCard';
import { Footer } from '@/components/Footer';

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <LiveStats />
      <FeatureGrid />
      <Footer />
    </>
  );
}
