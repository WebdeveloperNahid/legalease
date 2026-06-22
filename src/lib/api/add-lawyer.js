import { serverFetch } from "../core/server"


export const getLawyerProfileData = async (lawyerId) => {
    return serverFetch(`/api/my/addLawyers?lawyerId=${lawyerId}`)
}


// সব লয়ারদের ফিল্টারসহ ডাটা আনার জন্য
export const getAllPublicLawyers = async (search = "", specialty = "", availability = "") => {
    return serverFetch(`/api/public/lawyers?search=${search}&specialty=${specialty}&availability=${availability}`);
}


// আইডি দিয়ে সিঙ্গেল লয়ারের ফুল প্রোফাইল আনার জন্য
export const getSingleLawyerDetail = async (id) => {
    return serverFetch(`/api/public/lawyer/${id}`);
}

// const baseURl = process.env.NEXT_PUBLIC_BASE_URL;

// export const getLawyerProfileData = async (lawyerId) => {
//   const res = await fetch(`${baseURl}/api/my/addLawyers?lawyerId=${lawyerId}`);
//   return res.json();
// };
