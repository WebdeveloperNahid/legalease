
import { getTopExperts } from "@/lib/api/add-lawyer";
import TopExpertsClient from "./TopExpertsClient";
// import TopExpertsClient from "./TopExpertsClient";


export default async function TopExperts() {
  const data = await getTopExperts();
  const topExperts = Array.isArray(data) ? data : [];

  return <TopExpertsClient topExperts={topExperts} />;
}