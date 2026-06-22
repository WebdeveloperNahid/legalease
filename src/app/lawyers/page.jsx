"use client"

import { getAllPublicLawyers } from "@/lib/api/add-lawyer";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function BrowseLawyersContent() {
  const searchParams = useSearchParams();
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState(searchParams?.get('specialty') || '');
  const [availability, setAvailability] = useState('');

  useEffect(() => {
    const fetchFilteredData = async () => {
      setLoading(true);
      try {
        const data = await getAllPublicLawyers(search, specialty, availability);
        setLawyers(data || []);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFilteredData();
  }, [search, specialty, availability]);

  return (
    <div style={{ backgroundColor: "#f8f7f4", minHeight: "100vh", padding: "56px 24px", fontFamily: "'Segoe UI', sans-serif" }}>

      {/* ── Page Header ───────────────────────────────── */}
      <div style={{ textAlign: "center", maxWidth: 600, margin: "0 auto 52px" }}>
        <span style={{
          fontSize: 10, fontWeight: 800, letterSpacing: 3,
          textTransform: "uppercase", color: "#AF8752",
          backgroundColor: "rgba(175,135,82,0.08)",
          padding: "5px 16px", borderRadius: 999,
          border: "1px solid rgba(175,135,82,0.25)",
          display: "inline-block", marginBottom: 18,
        }}>
          ⚖ Verified Legal Network
        </span>
        <h1 style={{
          fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 800,
          color: "#11100C", margin: "0 0 14px",
          fontFamily: "Georgia, serif", lineHeight: 1.2,
          letterSpacing: -1,
        }}>
          Find Your Legal Expert
        </h1>
        <div style={{ width: 52, height: 3, background: "linear-gradient(90deg, #FFD500, #AF8752)", margin: "0 auto 18px", borderRadius: 2 }} />
        <p style={{ color: "#6b6b6b", fontSize: 15, lineHeight: 1.7, margin: 0 }}>
          Browse verified legal professionals across all practice areas. Hire with confidence.
        </p>
      </div>

      {/* ── Search & Filter ───────────────────────────── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 14, maxWidth: 860, margin: "0 auto 52px",
        backgroundColor: "#fff",
        padding: "20px 24px",
        borderRadius: 18,
        boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
        border: "1px solid #ebebeb",
      }}>
        <div style={{ position: "relative" }}>
          <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#AF8752", fontSize: 15 }}>🔍</span>
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%", padding: "11px 14px 11px 38px",
              border: "1.5px solid #e8e8e8", borderRadius: 12,
              fontSize: 13, color: "#11100C", outline: "none",
              backgroundColor: "#fafafa", boxSizing: "border-box",
              transition: "border-color 0.2s",
            }}
            onFocus={e => e.target.style.borderColor = "#AF8752"}
            onBlur={e => e.target.style.borderColor = "#e8e8e8"}
          />
        </div>
        <select
          value={specialty}
          onChange={e => setSpecialty(e.target.value)}
          style={{
            width: "100%", padding: "11px 14px",
            border: "1.5px solid #e8e8e8", borderRadius: 12,
            fontSize: 13, color: "#11100C", outline: "none",
            backgroundColor: "#fafafa", cursor: "pointer",
            boxSizing: "border-box",
          }}
        >
          <option value="">All Specializations</option>
          <option value="Criminal Law">Criminal Law</option>
          <option value="Corporate Law">Corporate Law</option>
          <option value="Family Law">Family Law</option>
          <option value="Tax Law">Tax Law</option>
          <option value="Civil Law">Civil Law</option>
          <option value="Immigration Law">Immigration Law</option>
          <option value="Real Estate Law">Real Estate Law</option>
          <option value="Labor Law">Labor Law</option>
        </select>
        <select
          value={availability}
          onChange={e => setAvailability(e.target.value)}
          style={{
            width: "100%", padding: "11px 14px",
            border: "1.5px solid #e8e8e8", borderRadius: 12,
            fontSize: 13, color: "#11100C", outline: "none",
            backgroundColor: "#fafafa", cursor: "pointer",
            boxSizing: "border-box",
          }}
        >
          <option value="">All Availability</option>
          <option value="Available">Available</option>
          <option value="Busy">Currently Busy</option>
        </select>
      </div>

      {/* ── Results Count ─────────────────────────────── */}
      {!loading && lawyers.length > 0 && (
        <div style={{ maxWidth: 1200, margin: "0 auto 24px", paddingLeft: 4 }}>
          <p style={{ color: "#6b6b6b", fontSize: 13 }}>
            Showing <strong style={{ color: "#11100C" }}>{lawyers.length}</strong> legal professionals
          </p>
        </div>
      )}

      {/* ── Loading Skeleton ──────────────────────────── */}
      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24, maxWidth: 1200, margin: "0 auto" }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{
              backgroundColor: "#fff", borderRadius: 20,
              padding: 28, border: "1px solid #f0f0f0",
              boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
            }}>
              <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
                <div style={{ width: 80, height: 80, borderRadius: "50%", backgroundColor: "#f0f0f0", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ height: 16, backgroundColor: "#f0f0f0", borderRadius: 6, marginBottom: 10 }} />
                  <div style={{ height: 12, backgroundColor: "#f0f0f0", borderRadius: 6, width: "70%" }} />
                </div>
              </div>
              <div style={{ height: 12, backgroundColor: "#f0f0f0", borderRadius: 6, marginBottom: 8 }} />
              <div style={{ height: 12, backgroundColor: "#f0f0f0", borderRadius: 6, width: "85%", marginBottom: 20 }} />
              <div style={{ height: 44, backgroundColor: "#f0f0f0", borderRadius: 12 }} />
            </div>
          ))}
        </div>

      ) : lawyers.length === 0 ? (

        /* ── Empty State ──────────────────────────────── */
        <div style={{
          textAlign: "center", padding: "80px 24px",
          backgroundColor: "#fff", borderRadius: 20,
          border: "1px solid #f0f0f0",
          boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
          maxWidth: 480, margin: "0 auto",
        }}>
          <div style={{ fontSize: 52, marginBottom: 16 }}>⚖️</div>
          <h3 style={{ color: "#11100C", fontSize: 17, fontWeight: 700, margin: "0 0 8px" }}>
            No Lawyers Found
          </h3>
          <p style={{ color: "#9b9b9b", fontSize: 13, margin: 0 }}>
            Try adjusting your filters or search differently.
          </p>
        </div>

      ) : (

        /* ══════════════════════════════════════════════
           PROFESSIONAL LAWYER CARDS
        ══════════════════════════════════════════════ */
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 24, maxWidth: 1200, margin: "0 auto",
        }}>
          {lawyers.map(lawyer => (
            <LawyerCard key={lawyer._id} lawyer={lawyer} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   LAWYER CARD COMPONENT
══════════════════════════════════════════════════════ */
function LawyerCard({ lawyer }) {
  const [hovered, setHovered] = useState(false);

  const isBusy = lawyer.status === "Busy";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        backgroundColor: "#fff",
        borderRadius: 20,
        border: hovered ? "1.5px solid #FFD500" : "1.5px solid #f0f0f0",
        boxShadow: hovered
          ? "0 16px 48px rgba(255,213,0,0.12), 0 4px 16px rgba(0,0,0,0.06)"
          : "0 2px 16px rgba(0,0,0,0.05)",
        transition: "all 0.3s ease",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* ── Gold top accent bar ───────────────────────── */}
      <div style={{
        height: 4,
        background: hovered
          ? "linear-gradient(90deg, #FFD500, #AF8752)"
          : "linear-gradient(90deg, #AF8752, #FFD500)",
        transition: "background 0.3s",
      }} />

      <div style={{ padding: "24px 24px 20px" }}>

        {/* ── Header: Photo + Name + Status ─────────────── */}
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 18 }}>

          {/* Photo with gold ring on hover */}
          <div style={{
            flexShrink: 0, position: "relative",
            padding: 3,
            borderRadius: "50%",
            background: hovered
              ? "linear-gradient(135deg, #FFD500, #AF8752)"
              : "linear-gradient(135deg, #e8e8e8, #d0d0d0)",
            transition: "background 0.3s",
          }}>
            <img
              src={lawyer.image || "https://i.ibb.co/4ZQZ6q0/default-avatar.png"}
              alt={lawyer.name}
              style={{
                width: 76, height: 76, borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid #fff",
                display: "block",
              }}
            />
            {/* Status dot */}
            <span style={{
              position: "absolute", bottom: 4, right: 4,
              width: 14, height: 14, borderRadius: "50%",
              backgroundColor: isBusy ? "#ef4444" : "#22c55e",
              border: "2.5px solid #fff",
            }} />
          </div>

          {/* Name + Specialization */}
          <div style={{ flex: 1, minWidth: 0, paddingTop: 4 }}>
            <h3 style={{
              color: "#11100C", fontWeight: 800, fontSize: 17,
              margin: "0 0 6px", fontFamily: "Georgia, serif",
              lineHeight: 1.2,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {lawyer.name}
            </h3>

            {/* Specialization pill */}
            <span style={{
              display: "inline-block",
              backgroundColor: "rgba(175,135,82,0.08)",
              border: "1px solid rgba(175,135,82,0.25)",
              color: "#AF8752", fontSize: 10, fontWeight: 800,
              letterSpacing: 1.5, textTransform: "uppercase",
              padding: "4px 10px", borderRadius: 999,
              marginBottom: 8,
            }}>
              {lawyer.specialization || lawyer.specialty || "Legal Expert"}
            </span>

            {/* Availability */}
            <div>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                fontSize: 11, fontWeight: 600,
                color: isBusy ? "#dc2626" : "#16a34a",
                backgroundColor: isBusy ? "#fef2f2" : "#f0fdf4",
                border: `1px solid ${isBusy ? "#fecaca" : "#bbf7d0"}`,
                padding: "3px 10px", borderRadius: 999,
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: "50%",
                  backgroundColor: isBusy ? "#dc2626" : "#16a34a",
                  display: "inline-block",
                }} />
                {isBusy ? "Currently Busy" : "Available Now"}
              </span>
            </div>
          </div>
        </div>

        {/* ── Divider ───────────────────────────────────── */}
        <div style={{ height: 1, backgroundColor: "#f4f4f4", margin: "0 0 16px" }} />

        {/* ── Bio ───────────────────────────────────────── */}
        <p style={{
          color: "#6b6b6b", fontSize: 13, lineHeight: 1.75,
          margin: "0 0 18px",
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          minHeight: 46,
        }}>
          {lawyer.bio || "Experienced legal professional committed to delivering expert, results-driven counsel for every client."}
        </p>

        {/* ── Fee + Experience Row ──────────────────────── */}
        <div style={{
          display: "flex", gap: 12, marginBottom: 20,
        }}>
          {/* Fee box */}
          <div style={{
            flex: 1, backgroundColor: "#fffbeb",
            border: "1px solid rgba(255,213,0,0.35)",
            borderRadius: 12, padding: "12px 14px", textAlign: "center",
          }}>
            <p style={{ color: "#AF8752", fontSize: 9, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", margin: "0 0 4px" }}>
              Consultation Fee
            </p>
            <p style={{ color: "#11100C", fontSize: 22, fontWeight: 800, margin: 0, lineHeight: 1 }}>
              ${lawyer.fee}
              <span style={{ color: "#AF8752", fontSize: 11, fontWeight: 500 }}>/hr</span>
            </p>
          </div>

          {/* Since box */}
          <div style={{
            flex: 1, backgroundColor: "#f9f9f9",
            border: "1px solid #efefef",
            borderRadius: 12, padding: "12px 14px", textAlign: "center",
          }}>
            <p style={{ color: "#9b9b9b", fontSize: 9, fontWeight: 800, letterSpacing: 1.5, textTransform: "uppercase", margin: "0 0 4px" }}>
              Member Since
            </p>
            <p style={{ color: "#11100C", fontSize: 22, fontWeight: 800, margin: 0, lineHeight: 1 }}>
              {lawyer.createdAt ? new Date(lawyer.createdAt).getFullYear() : "2024"}
            </p>
          </div>
        </div>

        {/* ── View Profile Button ───────────────────────── */}
        <Link
          href={`/lawyers/${lawyer._id}`}
          style={{
            display: "block", textAlign: "center",
            backgroundColor: hovered ? "#FFD500" : "#11100C",
            color: hovered ? "#11100C" : "#fff",
            fontWeight: 800, fontSize: 12,
            letterSpacing: 1.5, textTransform: "uppercase",
            padding: "14px 0", borderRadius: 12,
            textDecoration: "none",
            transition: "all 0.3s ease",
            border: "2px solid transparent",
          }}
        >
          {hovered ? "⚖ View Full Profile →" : "View Profile"}
        </Link>
      </div>
    </div>
  );
}

export default function BrowseLawyers() {
  return (
    <Suspense fallback={
      <div style={{
        textAlign: "center", padding: 80, color: "#AF8752",
        backgroundColor: "#f8f7f4", minHeight: "100vh",
        fontSize: 14,
      }}>
        Loading legal experts...
      </div>
    }>
      <BrowseLawyersContent />
    </Suspense>
  );
}