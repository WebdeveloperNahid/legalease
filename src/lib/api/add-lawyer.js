import { serverFetch } from "../core/server"


export const getLawyerProfileData = async (lawyerId) => {
    return serverFetch(`/api/my/addLawyers?lawyerId=${lawyerId}`)
}


// const baseURl = process.env.NEXT_PUBLIC_BASE_URL;

// export const getLawyerProfileData = async (lawyerId) => {
//   const res = await fetch(`${baseURl}/api/my/lawyers?lawyerId=${lawyerId}`);
//   return res.json();
// };
