import { getUserSession } from "@/lib/core/session";
// import { submitReview } from "@/lib/actions/comments";
import { getHiringRequestById } from "@/lib/api/payments";
import ReviewForm from "@/Components/ReviewForm";

const PaidInfo = async ({ searchParams }) => {
  const { hiringRequestId } = await searchParams;

  if (!hiringRequestId) {
    throw new Error("hiringRequestId is required");
  }

  const session = await getUserSession();

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f7f4] p-6">
        <p className="text-[#6b6b6b]">Please log in to view this page.</p>
      </div>
    );
  }

  const data = await getHiringRequestById(hiringRequestId);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f7f4] p-6">
        <p className="text-[#6b6b6b]">No payment information found.</p>
      </div>
    );
  }

  const isUser = session.id === data.userId;
  const isLawyer = session.id === data.lawyerId;
  const isAdmin = session.role === "admin";

  if (!isUser && !isLawyer && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f7f4] p-6">
        <div className="max-w-md text-center">
          <h2 className="text-xl font-bold text-[#556B2F] mb-2">
            Access Denied
          </h2>
          <p className="text-[#6b6b6b] text-sm">
            You do not have permission to view this receipt.
          </p>
        </div>
      </div>
    );
  }

  const rows = [
    { label: "Lawyer Name", value: data.lawyerName },
    { label: "Specialization", value: data.specialization },
    { label: "Client Name", value: data.userName },
    { label: "Client Email", value: data.userEmail },
    { label: "Fee Paid", value: `$${data.fee}` },
    {
      label: "Payment Status",
      value: data.paymentStatus === "paid" ? "Paid" : "Unpaid",
      highlight: data.paymentStatus === "paid",
    },
    {
      label: "Paid At",
      value: data.paidAt ? new Date(data.paidAt).toLocaleString() : "—",
    },
    { label: "Transaction ID", value: data.transactionId },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f7f4] p-6 ">
      <div className="max-w-lg w-full bg-white p-8 md:p-10 rounded-[32px] border-2 border-[#556B2F]/20 shadow-2xl relative overflow-hidden ">
        <div className="absolute  top-0 left-0 w-full h-2 bg-[#556B2F]"></div>

        <div className="text-center mb-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FFD500]/20 mb-4">
            <svg
              className="h-8 w-8 text-[#556B2F]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="font-[Georgia,_serif] text-2xl font-extrabold text-[#556B2F]">
            Payment Receipt
          </h2>
          <p className="text-sm text-[#9b9b9b] mt-1">
            Hiring Transaction Summary
          </p>
        </div>

        <div className="rounded-2xl  border border-[#556B2F]/10 overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.label}
                  className={`${i % 2 === 0 ? "bg-[#f8f7f4]/50" : "bg-white"} border-b border-[#556B2F]/5`}
                >
                  <td className="py-4 px-5 text-[#556B2F]/80 font-medium w-1/2">
                    {row.label}
                  </td>
                  <td
                    className={`py-4 px-5 font-bold break-all ${row.highlight ? "text-[#556B2F]" : "text-[#11100C]"}`}
                  >
                    {row.value || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {data.paymentStatus === "paid" && session.id === data.userId && (
          <div className="mt-8 pt-8 border-t border-[#556B2F]/10">
            <h3 className="font-bold text-[#556B2F] mb-4 text-center">
              Leave a Review
            </h3>
            <ReviewForm data={data} session={session}></ReviewForm>

            {/* <form action={submitReview} className="space-y-4">
              <input type="hidden" name="lawyerId" value={data.lawyerId} />
              <input type="hidden" name="hiringRequestId" value={data._id} />
              <input type="hidden" name="userId" value={session.id} />
              <input
                type="hidden"
                name="userName"
                value={session.name || session.email}
              />

              <textarea
                name="comment"
                rows="3"
                className="w-full p-4 rounded-xl border border-[#556B2F]/20 focus:outline-none focus:ring-2 focus:ring-[#556B2F]/20 transition"
                placeholder="Share your experience with this lawyer..."
                required
              />

              <button
                type="submit"
                className="w-full bg-[#556B2F] text-white py-3 rounded-xl font-semibold hover:bg-[#3e4d22] transition-all shadow-md"
              >
                Submit Review
              </button>
            </form> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaidInfo;
