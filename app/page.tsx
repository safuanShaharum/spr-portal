import { Hero } from '@/components/homepage/Hero';
import { FactTicker } from '@/components/homepage/FactTicker';
import { StorytellingCarousel } from '@/components/homepage/StorytellingCarousel';
import { CategoryCards } from '@/components/homepage/CategoryCards';
import { SorotanData } from '@/components/homepage/SorotanData';
import { DataDalamAngka } from '@/components/homepage/DataDalamAngka';
import { TerkiniPortal } from '@/components/homepage/TerkiniPortal';
import { PautanServisSPR } from '@/components/homepage/PautanServisSPR';

export default function HomePage() {
  return (
    <div className="relative">
      <Hero />
      <FactTicker />
      <StorytellingCarousel />
      <CategoryCards />
      <SorotanData />
      <DataDalamAngka />
      <TerkiniPortal />
      <PautanServisSPR />
    </div>
  );
}
