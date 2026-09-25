import Hero from '@/components/Hero';
import SaleTicker from '@/components/SaleTicker';
import HomeSaleBand from '@/components/HomeSaleBand';
import Featured from '@/components/Featured';
import Editorial from '@/components/Editorial';
import CategoriesCard from '@/components/CategoriesCard';
import LocationBlock from '@/components/LocationBlock';

export default function HomePage() {
  return (
    <>
      <Hero />
      <SaleTicker />
      <HomeSaleBand />
      <Featured />
      <Editorial />
      <CategoriesCard />
      <LocationBlock />
    </>
  );
}
