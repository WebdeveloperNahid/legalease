// src/app/lawyer/[id]/page.jsx
import LawyerDetailsClient from "@/Components/LawyerDetailsClient";
import { getSingleLawyerDetail } from "@/lib/api/add-lawyer";

// import { getSingleLawyerDetail } from "@/lib/api/get-lawyer";
// import LawyerDetailsClient from "./LawyerDetailsClient";

export default async function LawyerDetailsPage({ params }) {
  const { id } = await params;
  const lawyer = await getSingleLawyerDetail(id);

  if (!lawyer) {
    return (
      <div style={{
        minHeight: "100vh", backgroundColor: "#f8f7f4",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>⚖️</div>
          <h2 style={{ color: "#11100C", fontSize: 20, fontWeight: 700, margin: "0 0 8px" }}>
            Lawyer Not Found
          </h2>
          <p style={{ color: "#6b6b6b", fontSize: 14 }}>
            This profile may have been removed or does not exist.
          </p>
        </div>
      </div>
    );
  }

  return <LawyerDetailsClient lawyer={lawyer} />;
}