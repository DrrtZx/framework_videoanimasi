import React from "react";
import { AbsoluteFill } from "remotion";
import { Jokowo } from "./Jokowo";
import { Prop } from "./Prop";
import { PALETTE } from "../config";
import { FONTS } from "../fonts";

export interface ChannelBannerProps {
  channelName?: string;
  tagline?: string;
  showSafeGuide?: boolean;
}

/**
 * YouTube Channel Banner — 2560 × 1440 px (memenuhi syarat minimal 2048×1152, < 6 MB)
 *
 * Zona Aman Resmi YouTube pada 2560×1440:
 * - TV Full Canvas        : 2560 × 1440 (x: 0..2560, y: 0..1440)
 * - Desktop Strip         : 2560 × 423  (x: 0..2560, y: 508..931)
 * - All-Device Safe Area  : 1546 × 423  (x: 507..2053, y: 508..931)
 *
 * Seluruh elemen krusial (maskot Jokowo, judul channel, tagline, ikon utama)
 * dikunci 100% di dalam All-Device Safe Area agar tidak pernah terpotong di HP, Tablet, Desktop, maupun TV.
 */
export const ChannelBanner: React.FC<ChannelBannerProps> = ({
  channelName = "FAKTA STUDIO",
  tagline = "EDUKASI SAINS & TEKNOLOGI",
  showSafeGuide = false,
}) => {
  return (
    <AbsoluteFill
      style={{
        width: "2560px",
        height: "1440px",
        background: `radial-gradient(circle at 50% 50%, #123663 0%, ${PALETTE.bg} 58%, #030814 100%)`,
        overflow: "hidden",
      }}
    >
      {/* ================= 1. LATAR BELAKANG TECH BLUEPRINT & CYBER LAB (2560×1440 TV FULL) ================= */}
      <svg
        width="2560"
        height="1440"
        viewBox="0 0 2560 1440"
        style={{ position: "absolute", inset: 0, zIndex: 0 }}
      >
        <defs>
          <pattern id="bannerGridSmall" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#0284C7" strokeWidth="1" opacity="0.24" />
          </pattern>
          <pattern id="bannerGridMajor" width="160" height="160" patternUnits="userSpaceOnUse">
            <rect width="160" height="160" fill="url(#bannerGridSmall)" />
            <path d="M 160 0 L 0 0 0 160" fill="none" stroke="#38BDF8" strokeWidth="1.8" opacity="0.38" />
          </pattern>
          <linearGradient id="desktopBandGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#020617" stopOpacity="0.6" />
            <stop offset="22%" stopColor="#0C2A4D" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#123A69" stopOpacity="0.38" />
            <stop offset="78%" stopColor="#0C2A4D" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="cyanNeonLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0" />
            <stop offset="20%" stopColor="#38BDF8" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#00F5FF" stopOpacity="0.95" />
            <stop offset="80%" stopColor="#38BDF8" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="mascotGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00F5FF" stopOpacity="0.34" />
            <stop offset="65%" stopColor="#38BDF8" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#0A192F" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Grid Blueprint Penuh 2560×1440 */}
        <rect width="2560" height="1440" fill="url(#bannerGridMajor)" />

        {/* Cincin Radar Skematik Besar di Latar TV */}
        <circle cx="1280" cy="720" r="610" fill="none" stroke="#38BDF8" strokeWidth="2.5" strokeDasharray="24 18" opacity="0.22" />
        <circle cx="1280" cy="720" r="460" fill="none" stroke="#00F5FF" strokeWidth="2" strokeDasharray="10 14" opacity="0.18" />
        <circle cx="280" cy="720" r="240" fill="none" stroke="#818CF8" strokeWidth="2" strokeDasharray="14 12" opacity="0.24" />
        <circle cx="2280" cy="720" r="240" fill="none" stroke="#818CF8" strokeWidth="2" strokeDasharray="14 12" opacity="0.24" />

        {/* Pita Horizontal Desktop (Y: 508..931) */}
        <rect x="0" y="508" width="2560" height="423" fill="url(#desktopBandGrad)" />
        <line x1="0" y1="508" x2="2560" y2="508" stroke="url(#cyanNeonLine)" strokeWidth="4" />
        <line x1="0" y1="931" x2="2560" y2="931" stroke="url(#cyanNeonLine)" strokeWidth="4" />

        {/* Garis Sirkuit Sayap Kiri & Kanan (Tampak Keren di Desktop & TV) */}
        <g stroke="#38BDF8" strokeWidth="3" fill="none" opacity="0.55">
          {/* Sayap Kiri */}
          <path d="M 60 630 L 210 630 L 250 670 L 460 670" />
          <path d="M 90 720 L 430 720" stroke="#00F5FF" strokeWidth="3.5" />
          <path d="M 60 810 L 210 810 L 250 770 L 460 770" />
          <circle cx="460" cy="670" r="7" fill="#00F5FF" />
          <circle cx="430" cy="720" r="9" fill="#FACC15" />
          <circle cx="460" cy="770" r="7" fill="#00F5FF" />
          {/* Sayap Kanan */}
          <path d="M 2500 630 L 2350 630 L 2310 670 L 2100 670" />
          <path d="M 2470 720 L 2130 720" stroke="#00F5FF" strokeWidth="3.5" />
          <path d="M 2500 810 L 2350 810 L 2310 770 L 2100 770" />
          <circle cx="2100" cy="670" r="7" fill="#00F5FF" />
          <circle cx="2130" cy="720" r="9" fill="#FACC15" />
          <circle cx="2100" cy="770" r="7" fill="#00F5FF" />
        </g>

        {/* Pendar Cahaya di Belakang Maskot Jokowo */}
        <circle cx="725" cy="725" r="245" fill="url(#mascotGlow)" />
        {/* Bingkai Lingkaran Blueprint Maskot */}
        <circle cx="725" cy="722" r="184" fill="#071930" stroke="#00F5FF" strokeWidth="6" />
        <circle cx="725" cy="722" r="198" fill="none" stroke="#FACC15" strokeWidth="3.5" strokeDasharray="18 14" opacity="0.85" />

        {/* Tanda Crop Sudut Blueprint (+) */}
        <g stroke="#38BDF8" strokeWidth="3" opacity="0.6">
          <line x1="60" y1="40" x2="60" y2="80" />
          <line x1="40" y1="60" x2="80" y2="60" />
          <line x1="2500" y1="40" x2="2500" y2="80" />
          <line x1="2480" y1="60" x2="2520" y2="60" />
          <line x1="60" y1="1360" x2="60" y2="1400" />
          <line x1="40" y1="1380" x2="80" y2="1380" />
          <line x1="2500" y1="1360" x2="2500" y2="1400" />
          <line x1="2480" y1="1380" x2="2520" y2="1380" />
        </g>

        {/* Bracket Sudut All-Device Safe Zone (Dekoratif HUD Presisi) */}
        <g stroke="#00F5FF" strokeWidth="4" opacity="0.7" fill="none">
          <path d="M 520 555 L 520 524 L 555 524" />
          <path d="M 2040 555 L 2040 524 L 2005 524" />
          <path d="M 520 885 L 520 916 L 555 916" />
          <path d="M 2040 885 L 2040 916 L 2005 916" />
        </g>

        {/* Label Koordinat TV Atas & Bawah */}
        <text x="105" y="72" fill="#38BDF8" opacity="0.45" fontSize="22" fontFamily="monospace" letterSpacing="4">
          TECH.BLUEPRINT // LAB.01
        </text>
        <text x="2455" y="72" fill="#38BDF8" opacity="0.45" fontSize="22" fontFamily="monospace" letterSpacing="4" textAnchor="end">
          2560 × 1440 // HD
        </text>
        <text x="1280" y="1390" fill="#38BDF8" opacity="0.35" fontSize="20" fontFamily="monospace" letterSpacing="6" textAnchor="middle">
          SAINS · TEKNOLOGI · SEJARAH KOMPUTASI · FAKTA UNIK
        </text>

        {/* Panduan Garis Safe Area Opsional (debug saja) */}
        {showSafeGuide && (
          <rect x="507" y="508" width="1546" height="423" fill="none" stroke="#F43F5E" strokeWidth="4" strokeDasharray="12 8" />
        )}
      </svg>

      {/* ================= 2. PROP DEKORATIF LUAR (DESKTOP & TV) ================= */}
      <div style={{ position: "absolute", top: "635px", left: "160px", opacity: 0.88, zIndex: 8 }}>
        <Prop type="moth" size={165} animate={false} />
      </div>
      <div style={{ position: "absolute", top: "640px", right: "160px", opacity: 0.88, zIndex: 8 }}>
        <Prop type="relay" size={160} animate={false} />
      </div>
      {/* Aksen TV Atas/Bawah Halus */}
      <div style={{ position: "absolute", top: "170px", left: "620px", opacity: 0.25, zIndex: 5 }}>
        <Prop type="lightbulb" size={130} animate={false} />
      </div>
      <div style={{ position: "absolute", top: "170px", right: "620px", opacity: 0.25, zIndex: 5 }}>
        <Prop type="flask" size={130} animate={false} />
      </div>
      <div style={{ position: "absolute", bottom: "160px", left: "720px", opacity: 0.22, zIndex: 5 }}>
        <Prop type="book" size={130} animate={false} />
      </div>
      <div style={{ position: "absolute", bottom: "160px", right: "720px", opacity: 0.22, zIndex: 5 }}>
        <Prop type="magnifier" size={130} animate={false} />
      </div>

      {/* ================= 3. KONTEN UTAMA DI ALL-DEVICE SAFE AREA (X: 507..2053, Y: 508..931) ================= */}

      {/* 3A. Maskot Jokowo dalam Medali Lingkaran Cyber (X: 541..909, Y: 538..906) */}
      <div
        style={{
          position: "absolute",
          left: "547px",
          top: "544px",
          width: "356px",
          height: "356px",
          borderRadius: "50%",
          overflow: "hidden",
          zIndex: 20,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        {/* Potret setengah badan Jokowo (kepala, ekspresi penasaran-ramah, kemeja putih & saku batik cyan!) */}
        <div style={{ marginTop: "-36px" }}>
          <Jokowo
            pose="pointing"
            expression="curious"
            mouthOpen={0.28}
            scale={1.48}
            showShadow={false}
            style={{ transformOrigin: "top center" }}
          />
        </div>
      </div>

      {/* 3B. Blok Teks Utama Channel + Tagline (X: 940..1860, Y: 545..895) */}
      <div
        style={{
          position: "absolute",
          left: "945px",
          top: "538px",
          width: "900px",
          height: "365px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          zIndex: 25,
        }}
      >
        {/* Kicker Kecil Cyber */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "10px",
            padding: "6px 20px",
            borderRadius: "999px",
            backgroundColor: "rgba(0, 245, 255, 0.14)",
            border: "2.5px solid #00F5FF",
            fontFamily: FONTS.label,
            fontSize: "24px",
            fontWeight: 800,
            color: "#00F5FF",
            letterSpacing: "3px",
          }}
        >
          <span>●</span>
          <span>CHANNEL ANIMASI EDUKASI</span>
        </div>

        {/* Nama Channel Raksasa (Fredoka Tebal + Stroke Hitam Tajam) */}
        <div
          style={{
            fontFamily: FONTS.title,
            fontSize: "112px",
            fontWeight: 900,
            lineHeight: 1.02,
            letterSpacing: "2px",
            textTransform: "uppercase",
            WebkitTextStroke: "14px #000000",
            paintOrder: "stroke fill",
            textShadow: "0 10px 0 #000000, 0 16px 28px rgba(0, 0, 0, 0.55)",
            marginBottom: "18px",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ color: "#FFFFFF" }}>
            {channelName.split(" ")[0] || "FAKTA"}{" "}
          </span>
          <span style={{ color: PALETTE.accentYellow }}>
            {channelName.split(" ").slice(1).join(" ") || "STUDIO"}
          </span>
        </div>

        {/* Pill Tagline Kontras Tinggi */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "14px",
            background: "linear-gradient(90deg, #0284C7 0%, #6366F1 100%)",
            color: "#FFFFFF",
            fontFamily: FONTS.label,
            fontSize: "34px",
            fontWeight: 900,
            padding: "12px 34px",
            borderRadius: "18px",
            border: "4px solid #000000",
            boxShadow: "0 7px 0 #000000",
            letterSpacing: "1.5px",
          }}
        >
          <span>⚡</span>
          <span>{tagline}</span>
        </div>
      </div>

      {/* 3C. Ikon Tematik Kanan di Dalam Safe Area (X: 1855..2025, Y: 550..890) */}
      <div style={{ position: "absolute", left: "1865px", top: "558px", zIndex: 22 }}>
        <Prop type="lightbulb" size={145} animate={false} />
      </div>
      <div style={{ position: "absolute", left: "1875px", top: "742px", zIndex: 22 }}>
        <Prop type="question-mark" size={125} animate={false} />
      </div>
    </AbsoluteFill>
  );
};
