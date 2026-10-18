// src/app/lawyers/page.jsx
import BrowseLawyersClient from "@/Components/BrowserLawyersClient";
import { getAllPublicLawyers } from "@/lib/api/add-lawyer";

const PAGE_SIZE = 9;

export default async function BrowseLawyersPage({ searchParams }) {
  const params = await searchParams;
  const search = params?.search || "";
  const specialty = params?.specialty || "";
  const availability = params?.availability || "";
  const page = Math.max(parseInt(params?.page) || 1, 1);

  let lawyers = [];
  let totalCount = 0;
  let totalPages = 1;

  try {
    const data = await getAllPublicLawyers(
      search,
      specialty,
      availability,
      page,
      PAGE_SIZE
    );

    // নতুন backend response: { lawyers, totalCount, totalPages, currentPage }
    lawyers = Array.isArray(data?.lawyers) ? data.lawyers : [];
    totalCount = data?.totalCount || 0;
    totalPages = data?.totalPages || 1;
  } catch (error) {
    console.error("Failed to load lawyers:", error);
  }

  return (
    <BrowseLawyersClient
      initialLawyers={lawyers}
      initialSearch={search}
      initialSpecialty={specialty}
      initialAvailability={availability}
      currentPage={page}
      totalPages={totalPages}
      totalCount={totalCount}
    />
  );
}