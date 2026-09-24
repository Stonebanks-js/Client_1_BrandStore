import Hero from '@/components/Hero';
import CategoryDiscovery from '@/components/CategoryDiscovery';
import EditorialBlock from '@/components/EditorialBlock';
import SaleSection from '@/components/SaleSection';
import LocationSection from '@/components/LocationSection';
import { categoryImage } from '@/data/catalog';
import { site } from '@/data/site';

export default function HomePage() {
  const oversized = categoryImage('oversized-t-shirts');

  return (
    <>
      <Hero />

      {/* Discovery comes straight after the door: what the shop sells, in pictures. */}
      <CategoryDiscovery />

      <EditorialBlock
        title="Everyday menswear, chosen properly"
        body="The floor is arranged the way you actually get dressed — tops on one side, bottoms on the other, and room to hold both up together before you decide."
        image={{ src: '/brand/showroom.jpg' }}
        imageAlt="The BRAND STORE floor: lit shelving of folded shirts and a rail of hanging tees"
        link={{ href: '/about', label: 'About the store' }}
        side="left"
      />

      <SaleSection />

      {oversized && (
        <EditorialBlock
          title="Back print, front and centre"
          body="The oversized cut is a silhouette, not a size up — the shoulder seam drops on purpose and the print sits across the back where it belongs."
          image={oversized}
          imageAlt="Three BRAND STORE oversized t-shirts with back prints, in black, cream and forest green"
          link={{ href: '/catalog/oversized-t-shirts', label: 'See oversized tees' }}
          side="right"
        />
      )}

      {/* The brand's own line, given a dark band of its own and nothing else. */}
      <section className="bg-ink">
        <div className="shell py-[clamp(4rem,9vw,7rem)] text-center">
          <p className="t-phrase mx-auto max-w-[16ch] text-[clamp(2rem,5vw,3.75rem)] text-on-ink">
            {site.phrase}
          </p>
        </div>
      </section>

      <LocationSection />
    </>
  );
}
