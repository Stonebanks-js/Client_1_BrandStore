import Link from 'next/link';

import { featuredProducts, type Product } from '@/data/products';
import ProductCard from '@/components/ProductCard';

/**
 * The product grid. Used on the home page as "In store now" and again at the foot of
 * the sale page as "More from the rail".
 */
export default function Featured({
  eyebrow = 'On the rail',
  title = 'In store now',
  items = featuredProducts,
}: {
  eyebrow?: string;
  title?: string;
  items?: Product[];
}) {
  return (
    <section className="shell py-[clamp(56px,7vw,112px)]">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div data-scroll3d className="will-change-transform">
          <p className="t-eyebrow">{eyebrow}</p>
          <h2
            className="t-display mt-3"
            style={{ fontSize: 'clamp(2.8rem, 6.4vw, 6.4rem)' }}
          >
            {title}
          </h2>
        </div>
        <Link href="/catalog" className="t-btn text-[11px] text-accent">
          Shop everything →
        </Link>
      </div>

      <div
        className="mt-[clamp(32px,4vw,64px)] grid"
        style={{
          gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(150px, 40vw, 280px), 1fr))',
          gap: 'clamp(28px, 3vw, 48px) clamp(12px, 2vw, 28px)',
        }}
      >
        {items.map((p) => (
          <div key={p.id} data-reveal>
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
