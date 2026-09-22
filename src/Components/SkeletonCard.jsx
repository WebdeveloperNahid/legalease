export default function SkeletonCard() {
  return (
    <div
      role="status"
      aria-label="Loading lawyer profile"
      className="relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-[#DCE3EE] bg-white shadow-[0_4px_16px_rgba(11,21,38,0.06)]"
    >
      {/* ---------- Image area (square, Featured card-এর সাথে মেলানো) ---------- */}
      <div className="relative aspect-[5/4] w-full overflow-hidden bg-[#EEF2F9] sm:aspect-square">
        <Shimmer />
      </div>

      {/* ---------- Body ---------- */}
      <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
        {/* Specialization pill */}
        <div className="relative h-6 w-28 overflow-hidden rounded-full bg-[#EAF0F9]">
          <Shimmer />
        </div>

        {/* Name */}
        <div className="relative h-6 w-3/4 overflow-hidden rounded-lg bg-[#EEF2F9]">
          <Shimmer />
        </div>

        {/* Bio lines */}
        <div className="space-y-2 pt-1">
          <div className="relative h-3.5 w-full overflow-hidden rounded-md bg-[#F3F6FB]">
            <Shimmer />
          </div>
          <div className="relative h-3.5 w-4/5 overflow-hidden rounded-md bg-[#F3F6FB]">
            <Shimmer />
          </div>
        </div>

        {/* ---------- Footer ---------- */}
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#DCE3EE] pt-4">
          <div className="space-y-1.5">
            <div className="relative h-2.5 w-16 overflow-hidden rounded bg-[#F3F6FB]">
              <Shimmer />
            </div>
            <div className="relative h-5 w-14 overflow-hidden rounded-md bg-[#EEF2F9]">
              <Shimmer />
            </div>
          </div>
          <div className="relative h-10 w-24 shrink-0 overflow-hidden rounded-xl bg-[#0B1526]/90">
            <Shimmer gold />
          </div>
        </div>
      </div>

      <span className="sr-only">Loading lawyer profile...</span>
    </div>
  );
}

/* বাম থেকে ডানে বয়ে যাওয়া shimmer। gold=true হলে navy button-এর উপর সোনালি shimmer */
function Shimmer({ gold = false }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute inset-0 -translate-x-full animate-[shimmer_1.8s_ease-in-out_infinite] bg-gradient-to-r motion-reduce:animate-none ${
        gold
          ? "from-transparent via-[#E2B93B]/40 to-transparent"
          : "from-transparent via-white/70 to-transparent"
      }`}
    />
  );
}