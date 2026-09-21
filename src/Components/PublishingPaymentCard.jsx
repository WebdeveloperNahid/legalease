import Link from "next/link";
import {
  FaArrowRight,
  FaInbox,
  FaInfinity,
  FaLock,
  FaMagnifyingGlass,
  FaScaleBalanced,
  FaUserPen,
} from "react-icons/fa6";

/*
  Palette
  Deep Navy #0B1526 | Navy #14213D | Gold #E2B93B (#F3D98B / #C99A12)
  Cream #FBF6EA | Beige #E8DCC8 | Border #DCE3EE | Tint #F3F6FB
  সাদা background-এ gold লেখা #8A6A1C
*/

const headingFont = {
  fontFamily: "var(--font-heading, Georgia, 'Times New Roman', serif)",
};

const benefits = [
  { Icon: FaUserPen, text: "Create your professional profile" },
  { Icon: FaMagnifyingGlass, text: "Appear in Browse Lawyers" },
  { Icon: FaInbox, text: "Receive hiring requests from clients" },
  { Icon: FaInfinity, text: "Lifetime access, pay only once" },
];

export default function PublishingPaymentCard() {
  return (
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center bg-[#F3F6FB] px-4 py-10 sm:px-6">
      <section
        aria-labelledby="publishing-title"
        className="w-full max-w-4xl overflow-hidden rounded-2xl border border-[#DCE3EE] bg-white shadow-[0_10px_40px_rgba(11,21,38,0.12)]"
      >
        {/* ---------- Header ---------- */}
        <header className="relative overflow-hidden bg-gradient-to-br from-[#0B1526] via-[#14213D] to-[#0B1526] px-6 py-8 sm:px-10 sm:py-10">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#F3D98B] via-[#E2B93B] to-[#C99A12]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 right-0 h-56 w-80 rounded-full bg-[#E2B93B]/10 blur-[90px]"
          />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
            <span
              aria-hidden="true"
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-[#E2B93B]/60 bg-[#0B1526] text-2xl text-[#E2B93B] shadow-[0_0_0_6px_rgba(226,185,59,0.08)]"
            >
              <FaScaleBalanced />
            </span>

            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#E2B93B]" aria-hidden="true" />
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#F3D98B]">
                  One step left
                </span>
              </div>
              <h1
                id="publishing-title"
                className="mt-3 text-3xl font-bold tracking-[-0.015em] text-[#FBF6EA] sm:text-4xl"
                style={headingFont}
              >
                Activate your lawyer profile
              </h1>
              <div
                aria-hidden="true"
                className="mt-3 h-[3px] w-14 rounded-full bg-gradient-to-r from-[#E2B93B] to-transparent"
              />
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#E8DCC8]/85 sm:text-base">
                Make a one-time publishing payment to unlock your dashboard and go
                live on LegalEase.
              </p>
            </div>
          </div>
        </header>

        {/* ---------- Body ---------- */}
        <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-5 md:gap-8">
          {/* Left: why + benefits */}
          <div className="md:col-span-3">
            <div className="rounded-xl border border-[#DCE3EE] bg-[#F3F6FB] p-5">
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8A6A1C]">
                Why is this required?
              </h2>
              <p className="mt-2 text-sm leading-[1.8] text-slate-600 sm:text-base">
                To keep LegalEase a trusted marketplace, every lawyer completes a
                one-time publishing payment before their profile becomes public.
              </p>
            </div>

            <h2 className="mt-6 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              What you get
            </h2>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {benefits.map(({ Icon, text }) => (
                <li
                  key={text}
                  className="flex items-center gap-3 rounded-xl border border-[#DCE3EE] bg-white p-4 transition-colors duration-200 hover:border-[#E2B93B] motion-reduce:transition-none"
                >
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#14213D] text-sm text-[#E2B93B]"
                  >
                    <Icon />
                  </span>
                  <span className="text-sm font-medium leading-snug text-[#0B1526]">
                    {text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: price + pay */}
          <div className="md:col-span-2">
            <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#E2B93B]/40 bg-gradient-to-br from-[#0B1526] to-[#14213D] p-6 text-center shadow-[0_10px_30px_rgba(11,21,38,0.25)] sm:p-7">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-20 left-1/2 h-48 w-64 -translate-x-1/2 rounded-full bg-[#E2B93B]/10 blur-[80px]"
              />

              <div className="relative flex flex-1 flex-col">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#E8DCC8]/85">
                  One-time publishing fee
                </p>

                <p
                  className="mt-3 text-6xl font-bold leading-none tracking-[-0.02em] text-[#E2B93B]"
                  style={headingFont}
                >
                  $25
                </p>

                <p className="mx-auto mt-3 max-w-[16rem] text-sm leading-relaxed text-[#E8DCC8]/85">
                  Pay once and publish your lawyer profile permanently.
                </p>

                <div
                  aria-hidden="true"
                  className="mx-auto my-6 h-px w-full bg-gradient-to-r from-transparent via-[#E2B93B]/40 to-transparent"
                />

                <form action="/api/checkout_sessions" method="POST" className="mt-auto">
                  <input type="hidden" name="paymentType" value="publishing" />
                  <button
                    type="submit"
                    className="group inline-flex h-14 w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-b from-[#F3D98B] via-[#E2B93B] to-[#C99A12] px-6 text-base font-bold tracking-wide text-[#0B1526] shadow-[0_8px_24px_rgba(226,185,59,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(226,185,59,0.5)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F3D98B] active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100"
                  >
                    Pay &amp; continue
                    <FaArrowRight
                      aria-hidden="true"
                      className="text-sm transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
                    />
                  </button>
                </form>

                <p className="mt-4 flex items-center justify-center gap-2 text-xs text-[#E8DCC8]/85">
                  <FaLock aria-hidden="true" className="text-[#E2B93B]" />
                  Secure checkout powered by Stripe
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- Footer ---------- */}
        <footer className="flex flex-col items-center justify-between gap-2 border-t border-[#DCE3EE] bg-[#F3F6FB] px-6 py-4 text-xs text-slate-500 sm:flex-row sm:px-10">
          <p>Your card details are handled by Stripe and never stored on LegalEase.</p>
          <Link
            href="/"
            className="font-semibold text-[#8A6A1C] underline-offset-4 transition-colors hover:text-[#0B1526] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E2B93B]"
          >
            Back to home
          </Link>
        </footer>
      </section>
    </div>
  );
}