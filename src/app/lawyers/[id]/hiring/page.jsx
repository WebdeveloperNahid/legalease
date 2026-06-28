// import { getLawyerProfileData } from "@/lib/api/add-lawyer";
import { getUserSession } from "@/lib/core/session";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import HiringRequestClient from "./HiringRequest";
import { getSingleLawyerDetail } from "@/lib/api/add-lawyer";
import { getUserHiringHistory } from "@/lib/api/hiring";

const HiringPage = async ({ params }) => {
  const { id } = await params;
  const user = await getUserSession();
  if (!user) {
    redirect(`/signin?redirect=lawyers/${id}/hiring`);
  }
  // console.log("form hiring from ", user);

  if (user.role !== "user") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full border-t-8 border-red-500">
          <h2 className="text-3xl font-bold text-red-600 mb-4">
            Unauthorized Access
          </h2>
          <p className="text-gray-600 mb-6">
            You are not logged in as a client. Please log in with your Client ID
            to access this page.
          </p>

          {/* Yahan window.location ki jagah Link use karein */}
          <Link
            href="/"
            className="block w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-center"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const history = await getUserHiringHistory(user?.id);
  const existingRequest = history?.find((req) => req.lawyerId === id);

  const lawyerHiringInfo = await getSingleLawyerDetail(id);
  //  const existingRequest = await checkExistingHiringRequest(user.id, id);

  return (
    <div>
      <h2 className="text-3xl font-extrabold text-center mt-10 text-[#172ca1]">
        hiring Lawyer
      </h2>
      <HiringRequestClient
        lawyerHiringInfo={lawyerHiringInfo || {}}
        ClientUser={user || {}}
        existingRequest={existingRequest || {}}
      ></HiringRequestClient>
    </div>
  );
};

export default HiringPage;
