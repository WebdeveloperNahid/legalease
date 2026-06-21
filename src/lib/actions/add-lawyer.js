"use server";

import { serverMutation } from "../core/server";

export const createNewLawyer = async (newLawyerData) => {
  return serverMutation("/api/addLawyers", newLawyerData);
};

// const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

// export const createNewLawyer = async (newLawyerData) => {
//   const res = await fetch(`${baseUrl}/api/addLawyers`, {
//     method: "POST",
//     headers: {
//       "content-Type": "application/json",
//     },
//     body: JSON.stringify(newLawyerData),
//   });
//   return res.json();
//  } ;
