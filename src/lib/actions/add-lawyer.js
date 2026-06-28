"use server";

import { serverDelete, serverMutation, serverUpdate } from "../core/server";


export const createNewLawyer = async (newLawyerData) => {
  return serverMutation("/api/addLawyers", newLawyerData);
};

//UPDATE

export const updateLawyer = async (id, updateData) => {
  return serverUpdate(`/api/addLawyers/${id}`, updateData);
};

// — DELETE 
export const deleteLawyer = async (id) => {
  return serverDelete(`/api/addLawyers/${id}`);
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