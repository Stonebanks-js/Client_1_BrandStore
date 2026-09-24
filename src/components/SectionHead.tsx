import Link from 'next/link';

/**
 * Every section title on the site, and the only place gold appears outside the sale: a
 * short rule under the heading. No eyebrow label, no number, no em-dash fragment — the
 * heading says what the section is and the rule marks it.
 */
export default function SectionHead({
  title,
  lead,
  link,
  tone = 'paper',
  className = '',
}: {
  title: string;
  lead?: string;
  link?: { href: string; label: string };
  tone?: 'paper' | 'ink';
  className?: string;
}) {
  const dark = tone === 'ink';

  return (
    <div className={`flex flex-wrap items-end justify-between gap-x-10 gap-y-4 ${className}`}>
      <div>
        <h2 className={`t-h2 section-head ${dark ? 'text-on-ink' : 'text-on-paper'}`}>{title}</h2>
        {lead && (
          <p className={`t-body mt-5 ${dark ? 'text-on-ink-dim' : 'text-on-paper-dim'}`}>{lead}</p>
        )}
      </div>

      {link && (
        <Link
          href={link.href}
          className={`t-small shrink-0 border-b pb-1 font-semibold transition-colors ${
            dark
              ? 'border-on-ink/35 text-on-ink hover:border-on-ink'
              : 'border-on-paper/30 text-on-paper hover:border-on-paper'
          }`}
        >
          {link.label}
        </Link>
      )}
    </div>
  );
}
