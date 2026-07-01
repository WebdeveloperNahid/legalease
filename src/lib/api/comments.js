import { serverFetch } from "../core/server";

export const getCommentsByLawyer = async (lawyerId) => {
  if (!lawyerId) return [];
  const data = await serverFetch(`/api/comments/lawyer/${lawyerId}`);
  return data || [];
};

export const getCommentsByUser = async (userId) => {
  if (!userId) return [];
  const data = await serverFetch(`/api/comments/user/${userId}`);
  return data || [];
};