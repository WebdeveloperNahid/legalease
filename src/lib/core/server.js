const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

//ServerFetch -- GET
export const serverFetch = async (path) => {
  try {
    const res = await fetch(`${baseUrl}${path}`, { cache: "no-store" });

    if (!res.ok) {
      const errText = await res.text();

      return null;
    }
    return await res.json();
  } catch (error) {
    console.log("CATCH ERROR:", error.message);
    return null;
  }
};

//ServerMUtation -- POST

export const serverMutation = async (path, data, method = "POST") => {
  try {
    const res = await fetch(`${baseUrl}${path}`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      console.error(` Backend response not OK. Status: ${res.status}`);
      return null;
    }
    const result = await res.json();
    return result;
  } catch (error) {
    return null;
  }
};

// // ServerUpdate  -— UPDATE এর জন্য (PATCH)

// export const serverUpdate = async (path, data) => {
//   try {
//     const res = await fetch(`${baseUrl}${path}`, {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(data),
//     });
//     if (!res.ok) return null;
//     return await res.json();
//   } catch (error) {
//     return null;
//   }
// };

//  — DELETE এর জন্য
// export const serverDelete = async (path) => {
//   try {
//     const res = await fetch(`${baseUrl}${path}`, {
//       method: "DELETE",
//     });
//     if (!res.ok) return null;
//     return await res.json();
//   } catch (error) {
//     return null;
//   }
// };



// পুরনো code যেগুলো এখনো serverUpdate/serverDelete ব্যবহার করছে, তাদের জন্য wrapper
export const serverUpdate = async (path, data) => {
  return serverMutation(path, data, "PATCH");
};

export const serverDelete = async (path) => {
  return serverMutation(path, undefined, "DELETE");
};