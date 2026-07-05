import { redirect } from "next/navigation";
import { getUserToken } from "./session";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

//ServerFetch -- GET
export const serverFetch = async (path) => {
  const res = await fetch(`${baseUrl}${path}`, { cache: "no-store" });

  if (!res.ok) {
    const errText = await res.text();
    return null;
  }
  return handleStatus(res);
};

export const authHeader = async () => {
  const token = await getUserToken();
  const header = token
    ? {
        authorization: `Bearer ${token}`,
      }
    : {};
  return header;
};

export const protectedFetch = async (path) => {
  const res = await fetch(`${baseUrl}${path}`, {
    headers: await authHeader(),
  });
  return handleStatus(res);
};

//ServerMUtation -- POST can Update ,delete

export const serverMutation = async (path, data, method = "POST") => {
  const res = await fetch(`${baseUrl}${path}`, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      ...(await authHeader()),
    },
    body: JSON.stringify(data),
  });
  if (res.status === 401) {
    redirect("/signin");
  } else if (res.status === 403) {
    redirect("/unauthorized");
  }

  return handleStatus(res);
};

const handleStatus = (res) => {
  if (res.status === 401) {
    redirect("/signin");
  } else if (res.status === 403) {
    redirect("/unauthorized");
  }
  return res.json();
};

// // ServerUpdate  -— UPDATE এর জন্য (PATCH
// পুরনো code যেগুলো এখনো serverUpdate/serverDelete ব্যবহার করছে, তাদের জন্য wrapper

export const serverUpdate = async (path, data) => {
  return serverMutation(path, data, "PATCH");
};

export const serverDelete = async (path) => {
  return serverMutation(path, undefined, "DELETE");
};
