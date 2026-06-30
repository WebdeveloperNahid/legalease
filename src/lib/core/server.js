const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

//ServerFetch -- GET
export const serverFetch = async (path) => {
  try {
    console.log("FETCHING URL:", `${baseUrl}${path}`); // ← add করো
    const res = await fetch(`${baseUrl}${path}`, { cache: "no-store" });
    console.log("RESPONSE STATUS:", res.status); // ← add করো
    if (!res.ok) {
      const errText = await res.text();
      console.log("ERROR BODY:", errText); // ← add করো
      return null;
    }
    return await res.json();
  } catch (error) {
    console.log("CATCH ERROR:", error.message); // ← add করো
    return null;
  }
};

//ServerMUtation -- POST

export const serverMutation = async (path, data) => {
  try {
    const res = await fetch(`${baseUrl}${path}`, {
      method: "POST",
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

    // console.log(" Actual Backend Response inside serverMutation:", result);

    return result;
  } catch (error) {
    // console.error(" Server Mutation Error:", error.message);
    return null;
  }
};

// ServerUpdate  -— UPDATE এর জন্য (PATCH)

export const serverUpdate = async (path, data) => {
  try {
    const res = await fetch(`${baseUrl}${path}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null;
  }
};

//  — DELETE এর জন্য
export const serverDelete = async (path) => {
  try {
    const res = await fetch(`${baseUrl}${path}`, {
      method: "DELETE",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null;
  }
};
