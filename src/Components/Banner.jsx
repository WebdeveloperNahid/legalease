"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Keyboard } from "swiper/modules";
import { motion, useReducedMotion } from "framer-motion";
import {
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaUserCheck,
  FaScaleBalanced,
  FaCreditCard,
  FaLock,
  FaHandshake,
  FaBriefcase,
  FaCircleCheck,
  FaShieldHalved,
  FaMagnifyingGlass,
  FaBuildingColumns,
  FaFileSignature,
  FaUsers,
  FaGavel,
  FaPause,
} from "react-icons/fa6";

import "swiper/css";
import "swiper/css/effect-fade";

/* ---------- Config ---------- */
const SLIDE_DELAY = 3000; // 3 সেকেন্ড
const NAVBAR_HEIGHT = 72; // Navbar.jsx-এর উচ্চতার সাথে একই রাখুন

const ROUTES = {
  browse: "/lawyers", // আপনার Browse Lawyers route
  register: "/signup", // আপনার Signup route
};

/*
  Palette: Navy + Gold
  Deep Navy #0B1526 | Navy #14213D | Gold #E2B93B | Gold Light #F3D98B
  Cream #FBF6EA     | Beige #E8DCC8 | Warm tint #793915
*/

/* ছবির মাপ অনুযায়ী আলাদা আলাদা সাইজ লোড হবে (মোবাইলে ছোট, ডেস্কটপে বড়) */
const unsplash = (photo, width) =>
  `https://images.unsplash.com/${photo}?auto=format&fit=crop&q=75&w=${width}`;

/*
  position: ছবির কোন অংশ সবসময় ফ্রেমে থাকবে (CSS object-position)।
  ছবির গুরুত্বপূর্ণ অংশ কেটে গেলে এখান থেকে বদলান, যেমন "70% center", "center top"।
*/
const SLIDES = [
  {
    id: 1,
    tag: "Verified Legal Experts",
    title: "Find & Hire Expert Legal Counsel",
    highlight: "In Minutes",
    description:
      "Browse verified lawyers by specialization, fee and availability, then send a hiring request in a few clicks.",
    photo: "photo-1589829545856-d10d557cf95f",
    position: "center",
    primary: { text: "Browse Lawyers", href: ROUTES.browse },
    secondary: { text: "Join as a Lawyer", href: ROUTES.register },
    perks: ["Free to browse", "Verified profiles"],
    points: [
      { icon: FaUserCheck, title: "Verified Lawyers", text: "Every lawyer passes a one-time verification." },
      { icon: FaScaleBalanced, title: "Every Legal Category", text: "Criminal, Corporate, Family and more." },
      { icon: FaHandshake, title: "Simple Hiring", text: "Send a request, get a response, then pay." },
    ],
  },
  {
    id: 2,
    tag: "Smart Search",
    title: "Find the Right Lawyer",
    highlight: "For Your Case",
    description:
      "Search by name or specialization and filter by fee range and availability to shortlist the best match quickly.",
    photo: "photo-1505664194779-8beaceb93744",
    position: "center",
    primary: { text: "Browse Lawyers", href: ROUTES.browse },
    secondary: { text: "Join as a Lawyer", href: ROUTES.register },
    perks: ["Search by specialization", "Filter by fee"],
    points: [
      { icon: FaMagnifyingGlass, title: "Search Instantly", text: "Find lawyers by name or specialization." },
      { icon: FaScaleBalanced, title: "Filter by Fee", text: "Stay within your budget with fee filters." },
      { icon: FaUserCheck, title: "Check Availability", text: "See who is available right now." },
    ],
  },
  {
    id: 3,
    tag: "Secure Payments",
    title: "Transparent Fees, Protected by Stripe",
    highlight: "No Hidden Costs",
    description:
      "See the lawyer's fee upfront. You pay only after your request is accepted, through secure Stripe checkout.",
    photo: "photo-1450101499163-c8848c66ca85",
    position: "center",
    primary: { text: "Browse Lawyers", href: ROUTES.browse },
    secondary: { text: "Join as a Lawyer", href: ROUTES.register },
    perks: ["Pay after acceptance", "Stripe secured"],
    points: [
      { icon: FaCreditCard, title: "Pay After Acceptance", text: "No payment until the lawyer accepts." },
      { icon: FaLock, title: "Secure Checkout", text: "Card details are handled by Stripe." },
      { icon: FaShieldHalved, title: "Payment History", text: "Every transaction is recorded for you." },
    ],
  },
  {
    id: 4,
    tag: "Every Legal Need",
    title: "Criminal, Corporate, Family",
    highlight: "One Platform",
    description:
      "Whatever your legal matter, explore categories and discover lawyers who specialize exactly in it.",
    photo: "photo-1479142506502-19b3a3b7ff33",
    position: "center",
    primary: { text: "Browse Lawyers", href: ROUTES.browse },
    secondary: { text: "Join as a Lawyer", href: ROUTES.register },
    perks: ["Many practice areas", "Public browsing"],
    points: [
      { icon: FaBuildingColumns, title: "Corporate & Business", text: "Contracts, compliance and disputes." },
      { icon: FaUsers, title: "Family & Personal", text: "Sensitive matters handled with care." },
      { icon: FaGavel, title: "Criminal Defense", text: "Experienced counsel when it matters most." },
    ],
  },
  {
    id: 5,
    tag: "Track Your Requests",
    title: "Send a Request,",
    highlight: "Track Every Step",
    description:
      "Follow each hiring request from Pending to Accepted right from your personal dashboard.",
    photo: "photo-1521791055366-0d553872125f",
    position: "center",
    primary: { text: "Browse Lawyers", href: ROUTES.browse },
    secondary: { text: "Join as a Lawyer", href: ROUTES.register },
    perks: ["Clear request status", "Manage your reviews"],
    points: [
      { icon: FaFileSignature, title: "Hiring Requests", text: "Pending, Accepted or Rejected, always clear." },
      { icon: FaCreditCard, title: "Pay When Ready", text: "Pay right after your request is accepted." },
      { icon: FaCircleCheck, title: "Leave a Review", text: "Share feedback after you hire a lawyer." },
    ],
  },
  {
    id: 6,
    tag: "For Legal Professionals",
    title: "Grow Your Practice and Reach Clients",
    highlight: "Online",
    description:
      "Create your professional profile, get verified once, and receive hiring requests from clients directly.",
    photo: "photo-1436450412740-6b988f486c6b",
    position: "center",
    primary: { text: "Join as a Lawyer", href: ROUTES.register },
    secondary: { text: "Browse Lawyers", href: ROUTES.browse },
    perks: ["One-time verification", "Manage requests easily"],
    points: [
      { icon: FaBriefcase, title: "Your Own Profile", text: "Showcase bio, fee and specialization." },
      { icon: FaHandshake, title: "Accept or Reject", text: "You decide which cases to take." },
      { icon: FaCreditCard, title: "Get Paid Online", text: "Fees arrive through secure payments." },
    ],
  },
];

/* ---------- Reusable styles ---------- */
const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F3D98B]";

const btnBase = `inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl px-7 text-sm font-semibold tracking-wide transition-all duration-200 active:scale-[0.98] sm:w-auto ${focusRing}`;

const btnPrimary = `${btnBase} bg-gradient-to-b from-[#F3D98B] via-[#E2B93B] to-[#C99A12] font-bold text-[#0B1526] shadow-[0_10px_30px_rgba(226,185,59,0.35)] hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(226,185,59,0.5)]`;

const btnSecondary = `${btnBase} border border-[#FBF6EA]/40 bg-[#0B1526]/30 text-[#FBF6EA] backdrop-blur-sm hover:border-[#E2B93B] hover:bg-[#0B1526]/60 hover:text-[#F3D98B]`;

const navBtn = `flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#FBF6EA]/30 bg-[#0B1526]/40 text-[#FBF6EA] backdrop-blur-sm transition-all hover:border-[#E2B93B] hover:text-[#F3D98B] active:scale-95 sm:h-11 sm:w-11 ${focusRing}`;

const headingFont = {
  fontFamily: "var(--font-heading, Georgia, 'Times New Roman', serif)",
};

/* ---------- Slide content ---------- */
function SlideContent({ slide, active, reduceMotion }) {
  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  };
  const item = reduceMotion
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
      };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate={active ? "visible" : "hidden"}
      className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 pb-32 pt-12 sm:px-6 sm:pt-16 lg:grid-cols-12 lg:px-8"
    >
      {/* Left: text */}
      <div className="lg:col-span-7">
        <motion.div variants={item} className="flex items-center gap-3">
          <span className="h-px w-8 bg-[#E2B93B] sm:w-10" aria-hidden="true" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#F3D98B] sm:text-xs sm:tracking-[0.22em]">
            {slide.tag}
          </span>
        </motion.div>

        <motion.h1
          variants={item}
          style={headingFont}
          className="mt-5 text-[32px] font-bold leading-[1.1] tracking-[-0.015em] text-[#FBF6EA] sm:mt-6 sm:text-5xl lg:text-[64px] lg:leading-[1.08]"
        >
          {slide.title}{" "}
          <span className="block bg-gradient-to-r from-[#F3D98B] via-[#E2B93B] to-[#C99A12] bg-clip-text italic text-transparent">
            {slide.highlight}
          </span>
        </motion.h1>

        <motion.div
          variants={item}
          className="mt-5 h-[3px] w-20 rounded-full bg-gradient-to-r from-[#E2B93B] to-transparent sm:mt-6"
          aria-hidden="true"
        />

        <motion.p
          variants={item}
          className="mt-5 max-w-xl text-[15px] leading-[1.75] text-[#E8DCC8] sm:mt-6 sm:text-lg"
        >
          {slide.description}
        </motion.p>

        <motion.div
          variants={item}
          className="mt-8 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
        >
          <Link href={slide.primary.href} className={btnPrimary}>
            {slide.primary.text} <FaArrowRight aria-hidden="true" className="text-xs" />
          </Link>
          <Link href={slide.secondary.href} className={btnSecondary}>
            {slide.secondary.text}
          </Link>
        </motion.div>

        <motion.ul
          variants={item}
          className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#E8DCC8] sm:mt-8 sm:gap-x-7"
        >
          {slide.perks.map((perk) => (
            <li key={perk} className="flex items-center gap-2">
              <FaCircleCheck aria-hidden="true" className="text-[#E2B93B]" />
              {perk}
            </li>
          ))}
        </motion.ul>
      </div>

      {/* Right: slim glass panel (শুধু বড় screen-এ) */}
      <motion.div variants={item} className="hidden lg:col-span-5 lg:block">
        <div className="ml-auto max-w-md rounded-2xl border border-[#E2B93B]/25 bg-[#0B1526]/45 p-3 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-md">
          {slide.points.map(({ icon: Icon, title, text }, i) => (
            <div
              key={title}
              className={`flex items-start gap-4 rounded-xl p-4 transition-colors hover:bg-[#E2B93B]/10 ${
                i !== slide.points.length - 1 ? "border-b border-[#FBF6EA]/10" : ""
              }`}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#E2B93B]/40 text-[#F3D98B]">
                <Icon aria-hidden="true" />
              </span>
              <div>
                <h3 className="text-[15px] font-semibold text-[#FBF6EA]">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-[#E8DCC8]/90">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ---------- Banner ---------- */
export default function Banner() {
  const [swiper, setSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const holdingRef = useRef(false);
  const reduceMotion = useReducedMotion();

  // "reduce motion" অন থাকলে auto-slide বন্ধ
  useEffect(() => {
    if (!swiper?.autoplay) return;
    if (reduceMotion) swiper.autoplay.stop();
    else swiper.autoplay.start();
  }, [reduceMotion, swiper]);

  /* চেপে ধরলে slide থামবে, ছাড়লে আবার চলবে (hover-এ কিছু হবে না) */
  const release = useCallback(() => {
    if (!holdingRef.current) return;
    holdingRef.current = false;
    setIsHolding(false);
    if (!reduceMotion) {
      swiper?.autoplay?.start();
      setProgressKey((k) => k + 1); // progress bar শুরু থেকে চলবে
    }
  }, [swiper, reduceMotion]);

  const hold = useCallback(
    (e) => {
      if (reduceMotion || holdingRef.current) return;
      // mouse-এর ডান/মাঝের বোতাম ধরলে pause হবে না
      if (e.pointerType === "mouse" && e.button !== 0) return;
      holdingRef.current = true;
      setIsHolding(true);
      swiper?.autoplay?.stop();
    },
    [swiper, reduceMotion]
  );

  // ধরে রাখা অবস্থায় ছাড়া হলো কিনা (banner-এর বাইরে ছাড়লেও) শোনা
  useEffect(() => {
    if (!isHolding) return;
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
    window.addEventListener("contextmenu", release);
    window.addEventListener("blur", release);
    return () => {
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
      window.removeEventListener("contextmenu", release);
      window.removeEventListener("blur", release);
    };
  }, [isHolding, release]);

  const fullHeight = { minHeight: `calc(100svh - ${NAVBAR_HEIGHT}px)` };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="LegalEase highlights"
      onPointerDown={hold}
      className="relative w-full select-none overflow-hidden bg-[#0B1526] [-webkit-touch-callout:none]"
      style={fullHeight}
    >
      <style>{`
        @keyframes bannerProgress { from { width: 0% } to { width: 100% } }
      `}</style>

      {/* ধরে রাখলে ছোট "Paused" চিহ্ন */}
      {isHolding && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-4 z-30 flex items-center gap-2 rounded-full border border-[#E2B93B]/50 bg-[#0B1526]/70 px-3 py-1.5 text-xs font-semibold text-[#F3D98B] backdrop-blur-sm"
        >
          <FaPause className="text-[10px]" /> Paused
        </div>
      )}

      <Swiper
        modules={[Autoplay, EffectFade, Keyboard]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={900}
        loop
        simulateTouch={false}
        keyboard={{ enabled: true }}
        autoplay={{ delay: SLIDE_DELAY, disableOnInteraction: false }}
        onSwiper={setSwiper}
        onSlideChange={(s) => setActiveIndex(s.realIndex)}
        className="w-full"
        style={fullHeight}
      >
        {SLIDES.map((slide, idx) => (
          <SwiperSlide key={slide.id}>
            <div className="relative flex items-center" style={fullHeight}>
              {/* Background layers */}
              <div className="absolute inset-0" aria-hidden="true">
                {/* ছবি লোড না হলেও navy থাকবে */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0B1526] via-[#14213D] to-[#0B1526]" />

                {/* Background photo: সব screen-এ পুরো ফ্রেম ভরে, ধীর zoom */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={unsplash(slide.photo, 1600)}
                  srcSet={`${unsplash(slide.photo, 800)} 800w, ${unsplash(
                    slide.photo,
                    1280
                  )} 1280w, ${unsplash(slide.photo, 1920)} 1920w`}
                  sizes="100vw"
                  alt=""
                  draggable={false}
                  decoding="async"
                  loading={idx === 0 ? "eager" : "lazy"}
                  fetchPriority={idx === 0 ? "high" : "auto"}
                  onError={(e) => (e.currentTarget.style.display = "none")}
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{
                    objectPosition: slide.position,
                    transform: activeIndex === idx && !reduceMotion ? "scale(1.1)" : "scale(1)",
                    transition: "transform 4s ease-out",
                  }}
                />

                {/* খুব হালকা warm tint (#793915) */}
                <div className="absolute inset-0 bg-[#793915]/15 mix-blend-multiply" />

                {/* ছোট ও মাঝারি screen: লেখা পুরো ছবির উপরে, তাই সবখানে হালকা navy */}
                <div className="absolute inset-0 bg-[#0B1526]/70 lg:hidden" />

                {/* বড় screen: শুধু বাম দিকে গাঢ়, ডানে ছবি স্পষ্ট */}
                <div className="absolute inset-0 hidden bg-gradient-to-r from-[#0B1526] via-[#0B1526]/80 via-40% to-transparent to-75% lg:block" />

                {/* উপর ও নিচে সামান্য গাঢ়, Navbar ও controls-এর জন্য */}
                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#0B1526]/60 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0B1526] to-transparent" />

                {/* Gold glow */}
                <div className="absolute -right-20 top-1/3 hidden h-[380px] w-[380px] rounded-full bg-[#E2B93B]/15 blur-[130px] lg:block" />

                {/* নিচে gold রেখা */}
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#E2B93B]/80 to-transparent" />
              </div>

              <div className="relative z-10 w-full">
                <SlideContent
                  slide={slide}
                  active={activeIndex === idx}
                  reduceMotion={reduceMotion}
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Controls: counter + progress + arrows */}
      <div className="absolute inset-x-0 bottom-0 z-20 pb-6 sm:pb-8">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 sm:gap-5 sm:px-6 lg:px-8">
          <span
            className="hidden text-sm font-semibold tabular-nums text-[#E8DCC8] sm:block"
            aria-hidden="true"
          >
            <span className="text-[#F3D98B]">{String(activeIndex + 1).padStart(2, "0")}</span>
            {" / "}
            {String(SLIDES.length).padStart(2, "0")}
          </span>

          <div
            className="flex min-w-0 flex-1 items-center gap-1.5 sm:gap-2"
            role="group"
            aria-label="Choose slide"
          >
            {SLIDES.map((slide, index) => {
              const isActive = activeIndex === index;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => swiper?.slideToLoop(index)}
                  aria-label={`Go to slide ${index + 1}: ${slide.tag}`}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative h-6 min-w-0 max-w-[88px] flex-1 ${focusRing}`}
                >
                  <span className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 overflow-hidden rounded-full bg-[#FBF6EA]/25">
                    {isActive && (
                      <span
                        key={`progress-${activeIndex}-${progressKey}`}
                        className="block h-full rounded-full bg-[#E2B93B]"
                        style={{
                          animation: reduceMotion
                            ? "none"
                            : `bannerProgress ${SLIDE_DELAY}ms linear forwards`,
                          animationPlayState: isHolding ? "paused" : "running",
                          width: reduceMotion ? "100%" : undefined,
                        }}
                      />
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => swiper?.slidePrev()}
              aria-label="Previous slide"
              className={navBtn}
            >
              <FaChevronLeft aria-hidden="true" className="text-sm" />
            </button>
            <button
              type="button"
              onClick={() => swiper?.slideNext()}
              aria-label="Next slide"
              className={navBtn}
            >
              <FaChevronRight aria-hidden="true" className="text-sm" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}