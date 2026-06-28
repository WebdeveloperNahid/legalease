import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#556B2F] p-4 text-center overflow-hidden">
      
      {/* 404 টেক্সট: সর্বোচ্চ সম্ভব সাইজ এবং গোল্ডেন কালার */}
      <h1 className="text-[18rem] md:text-[25rem] font-black text-[#FFD700] leading-none mb-0 drop-shadow-2xl select-none">
        404
      </h1>
      
      {/* শিরোনাম এবং ডেসক্রিপশন */}
      <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
        Oops! Page Not Found
      </h2>
      
      <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-lg">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>

      {/* বাটন */}
      <Link 
        href="/" 
        className="px-10 py-4 bg-[#FFD700] text-[#556B2F] font-black text-lg uppercase tracking-widest rounded-full shadow-2xl hover:bg-white transition-all duration-300 transform hover:scale-110"
      >
        Go Back Home
      </Link>
    </div>
  );
}