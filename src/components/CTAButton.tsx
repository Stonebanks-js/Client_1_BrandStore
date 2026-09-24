import Link from 'next/link';
import type { ReactNode } from 'react';

type Variant = 'gold' | 'ghost' | 'cream';

const base =
  'group relative inline-flex items-center gap-3 overflow-hidden px-6 py-3.5 t-label ' +
  'transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] rounded-[2px]';

const variants: Record<Variant, string> = {
  gold: 'border border-gold/70 text-gold hover:text-ink',
  ghost: 'border border-line text-cream-dim hover:text-cream hover:border-gold/60',
  cream: 'border border-cream/80 text-cream hover:text-ink',
};

const fills: Record<Variant, string> = {
  gold: 'bg-gold',
  ghost: 'bg-char-2',
  cream: 'bg-cream',
};

/**
 * One button, three weights. The hover is a fill that wipes up from the baseline — the same
 * gesture as the page curtain, so the whole site shares one transition idea.
 */
export default function CTAButton({
  href,
  children,
  variant = 'gold',
  external = false,
  className = '',
  ...rest
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  external?: boolean;
  className?: string;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const inner = (
    <>
      <span
        aria-hidden
        className={`absolute inset-0 origin-bottom scale-y-0 transition-transform duration-[320ms] ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-y-100 ${fills[variant]}`}
      />
      <span className="relative z-10 inline-flex items-center gap-3">{children}</span>
    </>
  );

  const cls = `${base} ${variants[variant]} ${className}`;

  if (external || href.startsWith('http') || href.startsWith('tel:')) {
    return (
      <a
        href={href}
        target={href.startsWith('tel:') ? undefined : '_blank'}
        rel="noopener noreferrer"
        className={cls}
        {...rest}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={cls} {...rest}>
      {inner}
    </Link>
  );
}
