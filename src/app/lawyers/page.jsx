// src/app/lawyers/page.jsx
import BrowseLawyersClient from "@/Components/BrowserLawyersClient";
import { getAllPublicLawyers } from "@/lib/api/add-lawyer";
// import { getAllPublicLawyers } from "@/lib/api/add-lawyer";
// import BrowseLawyersClient from "./BrowseLawyersClient";

export default async function BrowseLawyersPage({ searchParams }) {
  const params = await searchParams;
  const search = params?.search || "";
  const specialty = params?.specialty || "";
  const availability = params?.availability || "";

  let lawyers = [];
  try {
    const data = await getAllPublicLawyers(search, specialty, availability);
    lawyers = Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to load lawyers:", error);
  }

  return (
    <BrowseLawyersClient
      initialLawyers={lawyers}
      initialSearch={search}
      initialSpecialty={specialty}
      initialAvailability={availability}
    />
  );
}