import { getUserSession } from "@/lib/core/session";
import { redirect, notFound } from "next/navigation";
import PaymentClient from "@/Components/PaymentClient";
import { getHiringRequestById } from "@/lib/api/hiring";


const PayPage = async ({ params }) => {
  const { id } = await params;
  const user = await getUserSession();

  if (!user) redirect(`/signin?redirect=pay/${id}`);
  // console.log(user)

  const hiringRequest = await getHiringRequestById(id);
  console.log(hiringRequest,"ar it you hiringRequest By ID")

  // if (!hiringRequest) notFound();
  // if (hiringRequest.userId !== user?.id) redirect("/dashboard/user/hiring-history");
  // if (hiringRequest.status !== "accepted") redirect("/dashboard/user/hiring-history");

  return <PaymentClient hiringRequest={hiringRequest} />;
};

export default PayPage;