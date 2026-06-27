import LawyerDetailsClient from "@/Components/LawyerDetailsClient";
import { getSingleLawyerDetail } from "@/lib/api/add-lawyer";
import { getCommentsByLawyer } from "@/lib/api/payments";
import React from "react";

const LawyerDetailsPage = async ({ params }) => {
  const { id } = await params;

  const lawyer = await getSingleLawyerDetail(id);
  const reviews = await getCommentsByLawyer(id);
  return (
    <div>
      <LawyerDetailsClient id={id} lawyer={lawyer}  reviews={reviews || []} ></LawyerDetailsClient>
    </div>
  );
};

export default LawyerDetailsPage;
