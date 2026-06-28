export default function SkeletonCard() {
  return (
    <div className="w-full p-5 bg-[#3C4A20] rounded-3xl shadow-2xl border border-[#FFD700]/20 animate-pulse flex flex-col gap-4">
      {/* ইমেজ এরিয়া */}
      <div className="w-full h-44 bg-[#6A7F41] rounded-2xl"></div>
      
      {/* টাইটেল */}
      <div className="w-3/4 h-6 bg-[#6A7F41] rounded-xl"></div>
      
      {/* ডেসক্রিপশন */}
      <div className="w-full h-16 bg-[#6A7F41] rounded-xl"></div>
      
      {/* ছোট বাটন বা ফুটনোট */}
      <div className="w-1/3 h-8 bg-[#FFD700]/20 rounded-lg"></div>
    </div>
  );
}