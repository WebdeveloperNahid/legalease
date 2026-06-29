import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#556B2F] p-6 text-center">
      {/* 401 টেক্সট: রেড কালার এবং বড় সাইজ */}
      <h1 className="text-[12rem] font-black text-red-500 leading-none mb-2 drop-shadow-lg">
        401
      </h1>

      {/* শিরোনাম: গোল্ডেন কালার */}
      <h2 className="text-4xl md:text-5xl font-bold text-[#4a14df] mb-6">
        Unauthorized Access
      </h2>

      {/* ডেসক্রিপশন: সাদা রঙ */}
      <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-lg">
        Sorry, you do not have the necessary permissions to view this page.
        Please contact your administrator or return to the dashboard.
      </p>

      {/* বাটনগুলো */}
      <div className="flex gap-4">
        <Link
          href="/"
          className="px-8 py-3 bg-white text-[#556B2F] font-bold rounded-lg shadow-lg hover:bg-gray-100 transition-all duration-300"
        >
          Go Back Home
        </Link>
        <Link
          href="/signin"
          className="px-8 py-3 bg-[#FFD700] text-[#556B2F] font-bold rounded-lg shadow-lg hover:bg-yellow-400 transition-all duration-300"
        >
          Login Again
        </Link>
      </div>
    </div>
  );
}
