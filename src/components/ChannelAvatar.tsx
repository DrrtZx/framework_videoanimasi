import React from "react";
import { AbsoluteFill } from "remotion";
import { Jokowo } from "./Jokowo";
import { Prop } from "./Prop";
import { PALETTE } from "../config";

export interface ChannelAvatarProps {
  showCircleGuide?: boolean;
}

/**
 * YouTube Channel Profile Picture (Avatar) — 1080 × 1080 px (1:1)
 *
 * Dirancang khusus untuk potongan lingkaran (circular crop) YouTube:
 * - Seluruh wajah, rambut belah samping, kemeja putih, dan saku batik cyan maskot Jokowo
 *   berada nyaman di dalam zona aman lingkaran tengah agar tetap tajam dan langsung dikenali
 *   bahkan pada ukuran ikon komentar kecil (32×32 px).
 */
export const ChannelAvatar: React.FC<ChannelAvatarProps> = ({
  showCircleGuide = false,
}) => {
  return (
    <AbsoluteFill
      style={{
        width: "1080px",
        height: "1080px",
        background: `radial-gradient(circle at 50% 44%, #16447A 0%, ${PALETTE.bg} 66%, #020612 100%)`,
        overflow: "hidden",
      }}
    >
      {/* ================= 1. LATAR BELAKANG BLUEPRINT BADGE (1080×1080) ================= */}
      <svg
        width="1080"
        height="1080"
        viewBox="0 0 1080 1080"
        style={{ position: "absolute", inset: 0, zIndex: 0 }}
      >
        <defs>
          <pattern id="avatarGridSmall" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#0284C7" strokeWidth="1" opacity="0.28" />
          </pattern>
          <pattern id="avatarGridMajor" width="120" height="120" patternUnits="userSpaceOnUse">
            <rect width="120" height="120" fill="url(#avatarGridSmall)" />
            <path d="M 120 0 L 0 0 0 120" fill="none" stroke="#38BDF8" strokeWidth="2" opacity="0.45" />
          </pattern>
          <radialGradient id="avatarHalo" cx="50%" cy="46%" r="48%">
            <stop offset="0%" stopColor="#00F5FF" stopOpacity="0.38" />
            <stop offset="60%" stopColor="#38BDF8" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#0A192F" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Grid Blueprint */}
        <rect width="1080" height="1080" fill="url(#avatarGridMajor)" />

        {/* Halo Pendar Belakang Kepala Jokowo */}
        <circle cx="540" cy="495" r="460" fill="url(#avatarHalo)" />

        {/* Cincin HUD Konsentris Presisi di Dalam Potongan Lingkaran YouTube */}
        <circle cx="540" cy="540" r="498" fill="none" stroke="#00F5FF" strokeWidth="14" opacity="0.92" />
        <circle cx="540" cy="540" r="466" fill="none" stroke="#FACC15" strokeWidth="6" strokeDasharray="34 22" opacity="0.88" />
        <circle cx="540" cy="540" r="395" fill="none" stroke="#38BDF8" strokeWidth="3" strokeDasharray="10 14" opacity="0.45" />

        {/* Titik Aksen Kardinal (Utara, Timur, Barat) */}
        <circle cx="540" cy="74" r="11" fill="#FACC15" stroke="#0F172A" strokeWidth="4" />
        <circle cx="74" cy="540" r="10" fill="#00F5FF" stroke="#0F172A" strokeWidth="4" />
        <circle cx="1006" cy="540" r="10" fill="#00F5FF" stroke="#0F172A" strokeWidth="4" />

        {/* Panduan Potongan Lingkaran Opsional */}
        {showCircleGuide && (
          <circle cx="540" cy="540" r="538" fill="none" stroke="#F43F5E" strokeWidth="4" strokeDasharray="14 10" />
        )}
      </svg>

      {/* ================= 2. PROP IKONIK PENGAPIT BAHU (DI DALAM ZONA AMAN LINGKARAN) ================= */}
      <div style={{ position: "absolute", top: "245px", left: "165px", zIndex: 15 }}>
        <Prop type="lightbulb" size={140} animate={false} />
      </div>
      <div style={{ position: "absolute", top: "250px", right: "160px", zIndex: 15 }}>
        <Prop type="question-mark" size={130} animate={false} />
      </div>

      {/* ================= 3. MASKOT JOKOWO CLOSE-UP PORTRAIT (100% CHARACTER IDENTITY LOCK) ================= */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "-70px",
          transform: "translateX(-50%)",
          zIndex: 25,
          filter: "drop-shadow(0 20px 30px rgba(0, 0, 0, 0.55))",
        }}
      >
        <Jokowo
          pose="thinking"
          expression="curious"
          mouthOpen={0.32}
          scale={4.0}
          showShadow={false}
          style={{ transformOrigin: "top center" }}
        />
      </div>
    </AbsoluteFill>
  );
};
