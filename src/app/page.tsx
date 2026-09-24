import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import ShowroomStory from '@/components/ShowroomStory';
import SaleSection from '@/components/SaleSection';
import FeaturedCollection from '@/components/FeaturedCollection';
import LocationSection from '@/components/LocationSection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <ShowroomStory />
      <SaleSection />
      <FeaturedCollection />
      <LocationSection />
    </>
  );
}
