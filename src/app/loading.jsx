import SkeletonCard from "@/Components/SkeletonCard";

export default function Loading() {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}