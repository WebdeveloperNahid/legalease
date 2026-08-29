"use server"

import { protectedFetch } from "../core/server";

export const getHiringRequestById = async (id) => {
  return protectedFetch(`/api/hiring-requests/${id}`);
};


//  নতুন — lawyer-এর সব review আনার জন্য, একই pattern
export const getCommentsByLawyer = async (lawyerId) => {
  return protectedFetch(`/api/comments/lawyer/${lawyerId}`);
};



export const getPublishingStatus = async (email) => {
  return protectedFetch(`/api/users/publishing-status?email=${email}`);
};