// import { getFeaturedLawyers } from "@/lib/api/add-lawyer";
import { getFeaturedLawyers } from "@/lib/api/add-lawyer";
import FeaturedLawyersClient from "./FeaturedLawyersClient";

export default async function FeaturedLawyers() {
  let featured = [];
  try {
    const data = await getFeaturedLawyers();
    if (data && Array.isArray(data)) {
      featured = data.slice(0, 6);
    }
  } catch (error) {
    console.error("Failed to load featured lawyers:", error);
  }

  return <FeaturedLawyersClient featured={featured} />;
} 