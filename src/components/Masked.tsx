/**
 * One line of a masked headline. The mask carries the font-size plus the
 * padding/margin pair so caps and descenders are never cropped by the overflow;
 * MotionLayer animates the inner span via `data-word`.
 */
export function MaskLine({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={`mask-line ${className}`}>
      <span data-word>{children}</span>
    </span>
  );
}
