'use client';

import { useRevealGroup } from '@/lib/motion';

/**
 * Wraps a server-rendered section so its `[data-rv]` children reveal on entry. Keeps the
 * observer client-side without forcing the whole page into a client component.
 */
export default function RevealSection({
  children,
  className = '',
  as: Tag = 'section',
  ...rest
}: {
  children: React.ReactNode;
  className?: string;
  as?: 'section' | 'div';
} & React.HTMLAttributes<HTMLElement>) {
  const ref = useRevealGroup<HTMLDivElement>();

  return (
    <Tag className={className} {...rest}>
      <div ref={ref}>{children}</div>
    </Tag>
  );
}
