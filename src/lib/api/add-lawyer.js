import { serverFetch } from "../core/server";

export const getLawyerProfileData = async (lawyerId) => {
  return serverFetch(`/api/my/addLawyers?lawyerId=${lawyerId}`);
};

// সব লয়ারদের ফিল্টারসহ ডাটা আনার জন্য
export const getAllPublicLawyers = async (
  search = "",
  specialty = "",
  availability = "",
) => {
  const params = new URLSearchParams({
    search,
    specialty,
    availability,
  });

  return serverFetch(`/api/public/lawyers?${params.toString()}`);
};

// আইডি দিয়ে সিঙ্গেল লয়ারের ফুল প্রোফাইল আনার জন্য
export const getSingleLawyerDetail = async (id) => {
  return serverFetch(`/api/public/lawyer/${id}`);
};

// ১. ফিচারড ৬ জন লয়ারের ডাটা টানার জন্য
export const getFeaturedLawyers = async () => {
  return serverFetch("/api/public/featured-lawyers");
};

//  serverFetch ফলো করে টপ ৩ জন লয়ার ডাটা আনার ফাংশন
export const getTopExperts = async () => {
  return serverFetch("/api/public/top-experts");
};

// const baseURl = process.env.NEXT_PUBLIC_BASE_URL;

// export const getLawyerProfileData = async (lawyerId) => {
//   const res = await fetch(`${baseURl}/api/my/addLawyers?lawyerId=${lawyerId}`);
//   return res.json();
// };
