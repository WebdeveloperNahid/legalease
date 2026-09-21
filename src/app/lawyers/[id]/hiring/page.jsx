import { getUserSession } from "@/lib/core/session";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FaLock, FaMagnifyingGlass } from "react-icons/fa6";
import HiringRequestClient from "./HiringRequest";
import { getSingleLawyerDetail } from "@/lib/api/add-lawyer";
import { getUserHiringHistory } from "@/lib/api/hiring";

const headingFont = {
  fontFamily: "var(--font-heading, Georgia, 'Times New Roman', serif)",
};

const linkBase =
  "inline-flex h-12 w-full items-center justify-center rounded-xl px-6 text-sm font-semibold transition-all duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2B93B]";

function MessageCard({ icon: Icon, title, text, children }) {
  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-gradient-to-br from-[#0B1526] via-[#14213D] to-[#0B1526] px-4 py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 top-10 h-72 w-72 rounded-full bg-[#E2B93B]/15 blur-[110px]"
      />
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#E2B93B]/30 bg-white text-center shadow-[0_24px_60px_rgba(0,0,0,0.4)]">
        <div
          aria-hidden="true"
          className="h-1.5 bg-gradient-to-r from-[#F3D98B] via-[#E2B93B] to-[#C99A12]"
        />
        <div className="p-8 sm:p-9">
          <span
            aria-hidden="true"
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#E2B93B]/60 bg-[#0B1526] text-2xl text-[#E2B93B]"
          >
            <Icon />
          </span>
          <h1
            className="mt-6 text-2xl font-bold tracking-[-0.01em] text-[#0B1526] sm:text-3xl"
            style={headingFont}
          >
            {title}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
            {text}
          </p>
          <div className="mt-8 flex flex-col gap-3">{children}</div>
        </div>
      </div>
    </section>
  );
}

const HiringPage = async ({ params }) => {
  const { id } = await params;
  const user = await getUserSession();
  if (!user) {
    redirect(`/signin?redirect=lawyers/${id}/hiring`);
  }

  if (user.role !== "user") {
    return (
      <MessageCard
        icon={FaLock}
        title="Client account required"
        text="Only client accounts can send hiring requests. You are signed in with a different account type."
      >
        <Link
          href={`/lawyers/${id}`}
          className={`${linkBase} bg-gradient-to-b from-[#F3D98B] via-[#E2B93B] to-[#C99A12] font-bold text-[#0B1526] shadow-[0_8px_24px_rgba(226,185,59,0.35)] hover:-translate-y-0.5`}
        >
          Back to lawyer profile
        </Link>
        <Link
          href="/lawyers"
          className={`${linkBase} border border-[#0B1526]/25 text-[#0B1526] hover:border-[#0B1526] hover:bg-[#0B1526] hover:text-[#FBF6EA]`}
        >
          Browse lawyers
        </Link>
      </MessageCard>
    );
  }

  const lawyerHiringInfo = await getSingleLawyerDetail(id);

  if (!lawyerHiringInfo) {
    return (
      <MessageCard
        icon={FaMagnifyingGlass}
        title="Lawyer not found"
        text="We could not find this lawyer. The profile may have been removed."
      >
        <Link
          href="/lawyers"
          className={`${linkBase} bg-gradient-to-b from-[#F3D98B] via-[#E2B93B] to-[#C99A12] font-bold text-[#0B1526] shadow-[0_8px_24px_rgba(226,185,59,0.35)] hover:-translate-y-0.5`}
        >
          Browse lawyers
        </Link>
      </MessageCard>
    );
  }

  const history = await getUserHiringHistory(user?.id);
  const existingRequest = history?.find(
    (req) => req.lawyerId === lawyerHiringInfo?.lawyerId
  );

  return (
    <HiringRequestClient
      lawyerHiringInfo={lawyerHiringInfo}
      ClientUser={user || {}}
      existingRequest={existingRequest || {}}
      backHref={`/lawyers/${id}`}
    />
  );
};

export default HiringPage;