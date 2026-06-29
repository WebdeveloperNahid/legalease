"use server"

import { serverFetch } from "../core/server";

export const getHiringRequestById = async (id) => {
  return serverFetch(`/api/hiring-requests/${id}`);
};


//  নতুন — lawyer-এর সব review আনার জন্য, একই pattern
export const getCommentsByLawyer = async (lawyerId) => {
  return serverFetch(`/api/comments/lawyer/${lawyerId}`);
};



export const getPublishingStatus = async (email) => {
  return serverFetch(`/api/users/publishing-status?email=${email}`);
};