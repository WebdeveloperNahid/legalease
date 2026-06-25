import LawyerDetailsClient from "@/Components/LawyerDetailsClient";
import { getSingleLawyerDetail } from "@/lib/api/add-lawyer";
import React from "react";

const LawyerDetailsPage = async ({ params }) => {
  const { id } = await params;

  const lawyer = await getSingleLawyerDetail(id);
  return (
    <div>
      <LawyerDetailsClient id={id} lawyer={lawyer}></LawyerDetailsClient>
    </div>
  );
};

export default LawyerDetailsPage;
