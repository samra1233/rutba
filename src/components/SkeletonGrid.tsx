/* ============================================================
   [NEW] SkeletonGrid.tsx
   Premium shimmer loading skeleton matching the ProductCard
   layout — image area, text lines, price bar, and button.
   ============================================================ */

interface SkeletonGridProps {
  count?: number;
}

export default function SkeletonGrid({ count = 6 }: SkeletonGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="rounded-xl bg-brand-cream-dark border border-brand-gold/10 p-3 space-y-4"
          role="status"
          aria-label="Loading product"
        >
          {/* Image skeleton */}
          <div className="skeleton aspect-3/4 rounded-lg" />

          {/* Text skeletons */}
          <div className="space-y-2 pt-1">
            {/* Category tag line */}
            <div className="flex justify-between">
              <div className="skeleton skeleton-text-sm w-20" />
              <div className="skeleton skeleton-text-sm w-16" />
            </div>
            {/* Title */}
            <div className="skeleton skeleton-text w-3/4" />
            {/* Description line 1 */}
            <div className="skeleton skeleton-text-sm w-full" />
            {/* Description line 2 */}
            <div className="skeleton skeleton-text-sm w-2/3" />
            {/* Color chips */}
            <div className="flex gap-1.5 pt-1">
              <div className="skeleton w-10 h-5 rounded-sm" />
              <div className="skeleton w-12 h-5 rounded-sm" />
              <div className="skeleton w-8 h-5 rounded-sm" />
            </div>
          </div>

          {/* Price + button row */}
          <div className="pt-3 border-t border-brand-gold/10 flex items-center justify-between">
            <div className="space-y-1">
              <div className="skeleton skeleton-text-sm w-10" />
              <div className="skeleton w-24 h-5 rounded" />
            </div>
            <div className="skeleton w-10 h-10 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
