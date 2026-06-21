const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

export const serverFetch = async (path) => {
  try {
    const res = await fetch(`${baseUrl}${path}`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null; 
  }
};

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


