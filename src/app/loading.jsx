import SkeletonCard from "@/Components/SkeletonCard";

const headingFont = {
  fontFamily: "var(--font-heading, Georgia, 'Times New Roman', serif)",
};

export default function Loading() {
  return (
    <section
      aria-busy="true"
      aria-live="polite"
      className="bg-[linear-gradient(180deg,#FFFFFF_0%,#F3F6FB_35%,#EEF2F9_100%)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ---------- Section header skeleton ---------- */}
        <div className="mx-auto mb-14 max-w-md text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#E2B93B]/40" aria-hidden="true" />
            <div className="relative h-3.5 w-32 overflow-hidden rounded-full bg-[#EAF0F9]">
              <span
                aria-hidden="true"
                className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/70 to-transparent motion-reduce:animate-none"
              />
            </div>
            <span className="h-px w-8 bg-[#E2B93B]/40" aria-hidden="true" />
          </div>

          <div className="relative mx-auto mt-4 h-9 w-64 max-w-full overflow-hidden rounded-xl bg-[#EEF2F9] sm:h-11">
            <span
              aria-hidden="true"
              className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/70 to-transparent motion-reduce:animate-none"
            />
          </div>

          <p
            className="mt-4 text-sm font-medium text-[#8A6A1C]/70"
            style={headingFont}
          >
            Finding the best lawyers for you...
          </p>
        </div>

        {/* ---------- Cards ---------- */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}