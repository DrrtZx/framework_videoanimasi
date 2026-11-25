import React from "react";
import { AbsoluteFill } from "remotion";
import { DEFAULT_PRESET_ID, getPreset } from "../presets";

export type ChannelAvatarProps = {
  presetId?: string;
  showCircleGuide?: boolean;
};

const CombinedIdeaQuestionIcon: React.FC<{ idPrefix: string; size?: number }> = ({
  idPrefix,
  size = 240,
}) => {
  return (
    <svg
      width={size}
      height={Math.round(size * (240 / 220))}
      viewBox="0 0 220 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id={`${idPrefix}-bulbAura`} cx="50%" cy="44%" r="50%">
          <stop offset="0%" stopColor="#FDE047" stopOpacity="0.46" />
          <stop offset="55%" stopColor="#FACC15" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#FACC15" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${idPrefix}-bulbGlass`} x1="0" y1="0" x2="0.2" y2="1">
          <stop offset="0%" stopColor="#FEF9C3" />
          <stop offset="42%" stopColor="#FACC15" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
        <linearGradient id={`${idPrefix}-bulbMetal`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#94A3B8" />
          <stop offset="50%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#64748B" />
        </linearGradient>
      </defs>

      {/* Pendar cahaya hangat di belakang bohlam */}
      <circle cx="110" cy="106" r="102" fill={`url(#${idPrefix}-bulbAura)`} />

      {/* 5 Sinar cahaya cerah memancar */}
      <g stroke="#FDE047" strokeWidth="8.5" strokeLinecap="round">
        <line x1="110" y1="12" x2="110" y2="28" />
        <line x1="42" y1="38" x2="55" y2="50" />
        <line x1="178" y1="38" x2="165" y2="50" />
        <line x1="18" y1="98" x2="34" y2="100" />
        <line x1="202" y1="98" x2="186" y2="100" />
      </g>

      {/* Kaca bohlam emas menyala */}
      <path
        d="M 110 42 C 70 42 48 70 48 102 C 48 128 65 144 76 164 L 144 164 C 155 144 172 128 172 102 C 172 70 150 42 110 42 Z"
        fill={`url(#${idPrefix}-bulbGlass)`}
        stroke="#0F172A"
        strokeWidth="7"
        strokeLinejoin="round"
      />

      {/* Kilau kaca melengkung di kiri atas */}
      <path
        d="M 66 94 C 66 74 79 60 95 57"
        stroke="#FFFFFF"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.72"
      />

      {/* Tanda Tanya (?) Tebal Terpadu di Tengah Bohlam */}
      <path
        d="M 91 84 C 91 65 130 63 130 85 C 130 101 110 103 110 120"
        stroke="#0F172A"
        strokeWidth="14"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="110" cy="140" r="8.5" fill="#0F172A" />

      {/* Dudukan Ulir Logam & Kontak Bawah */}
      <rect
        x="79"
        y="164"
        width="62"
        height="18"
        rx="7"
        fill={`url(#${idPrefix}-bulbMetal)`}
        stroke="#0F172A"
        strokeWidth="6"
      />
      <rect
        x="83"
        y="182"
        width="54"
        height="17"
        rx="7"
        fill={`url(#${idPrefix}-bulbMetal)`}
        stroke="#0F172A"
        strokeWidth="6"
      />
      <path
        d="M 93 199 L 127 199 C 125 212 118 219 110 219 C 102 219 95 212 93 199 Z"
        fill="#475569"
        stroke="#0F172A"
        strokeWidth="6"
        strokeLinejoin="round"
      />
    </svg>
  );
};

/**
 * YouTube Channel Profile Picture (Avatar) — 1080 × 1080 px (1:1)
 * Dirancang aman untuk potongan lingkaran (circular crop) YouTube dengan 1 ikon terpadu Bohlam + ?.
 */
export const ChannelAvatar: React.FC<ChannelAvatarProps> = ({
  presetId = DEFAULT_PRESET_ID,
  showCircleGuide = false,
}) => {
  const preset = getPreset(presetId);
  const Mascot = preset.Mascot;
  const pal = preset.palette;
  const idPrefix = `avatar-${preset.id}`;
  const isCleanStudio =
    preset.stageStyle === "clean-studio" || preset.stageStyle === "minimal";

  return (
    <AbsoluteFill
      style={{
        width: "1080px",
        height: "1080px",
        background: `radial-gradient(circle at 50% 44%, ${pal.bgCenter} 0%, ${pal.bg} 66%, ${pal.bgOuter} 100%)`,
        overflow: "hidden",
      }}
    >
      {/* ================= 1. LATAR BELAKANG BADGE (1080×1080) ================= */}
      <svg
        width="1080"
        height="1080"
        viewBox="0 0 1080 1080"
        style={{ position: "absolute", inset: 0, zIndex: 0 }}
      >
        <defs>
          {!isCleanStudio && (
            <>
              <pattern id={`${idPrefix}-GridSmall`} width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M 24 0 L 0 0 0 24" fill="none" stroke={pal.gridMinor} strokeWidth="1" opacity="0.28" />
              </pattern>
              <pattern id={`${idPrefix}-GridMajor`} width="120" height="120" patternUnits="userSpaceOnUse">
                <rect width="120" height="120" fill={`url(#${idPrefix}-GridSmall)`} />
                <path d="M 120 0 L 0 0 0 120" fill="none" stroke={pal.gridMajor} strokeWidth="2" opacity="0.45" />
              </pattern>
            </>
          )}
          <radialGradient id={`${idPrefix}-Halo`} cx="50%" cy="46%" r="48%">
            <stop offset="0%" stopColor={pal.blueprintCyan} stopOpacity="0.38" />
            <stop offset="60%" stopColor={pal.gridMajor} stopOpacity="0.12" />
            <stop offset="100%" stopColor={pal.bg} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Grid Latar (hanya di mode blueprint) */}
        {!isCleanStudio && (
          <rect width="1080" height="1080" fill={`url(#${idPrefix}-GridMajor)`} />
        )}

        {/* Halo Pendar Belakang Kepala Maskot */}
        <circle cx="485" cy="495" r="460" fill={`url(#${idPrefix}-Halo)`} />

        {/* Bingkai Lingkaran Aman YouTube */}
        {isCleanStudio ? (
          <>
            <circle cx="540" cy="540" r="498" fill="none" stroke={pal.blueprintCyan} strokeWidth="12" opacity="0.92" />
            <circle cx="540" cy="540" r="468" fill="none" stroke={pal.gridMajor} strokeWidth="3" opacity="0.32" />
          </>
        ) : (
          <>
            <circle cx="540" cy="540" r="498" fill="none" stroke={pal.blueprintCyan} strokeWidth="14" opacity="0.92" />
            <circle cx="540" cy="540" r="466" fill="none" stroke={pal.accentYellow} strokeWidth="6" strokeDasharray="34 22" opacity="0.88" />
            <circle cx="540" cy="540" r="395" fill="none" stroke={pal.gridMajor} strokeWidth="3" strokeDasharray="10 14" opacity="0.45" />
            <circle cx="540" cy="74" r="11" fill={pal.accentYellow} stroke={pal.ink} strokeWidth="4" />
            <circle cx="74" cy="540" r="10" fill={pal.blueprintCyan} stroke={pal.ink} strokeWidth="4" />
            <circle cx="1006" cy="540" r="10" fill={pal.blueprintCyan} stroke={pal.ink} strokeWidth="4" />
          </>
        )}

        {/* Panduan Potongan Lingkaran Opsional */}
        {showCircleGuide && (
          <circle cx="540" cy="540" r="538" fill="none" stroke="#F43F5E" strokeWidth="4" strokeDasharray="14 10" />
        )}
      </svg>

      {/* ================= 2. IKON GABUNGAN BESAR: BOHLAM + TANDA TANYA (?) ================= */}
      <div
        style={{
          position: "absolute",
          top: "195px",
          left: "645px",
          transform: "rotate(10deg)",
          zIndex: 28,
          filter: "drop-shadow(0 14px 26px rgba(0, 0, 0, 0.45))",
        }}
      >
        <CombinedIdeaQuestionIcon idPrefix={idPrefix} size={235} />
      </div>

      {/* ================= 3. MASKOT PRESET CLOSE-UP PORTRAIT ================= */}
      <div
        style={{
          position: "absolute",
          left: "43%",
          top: "-65px",
          transform: "translateX(-50%)",
          zIndex: 25,
          filter: "drop-shadow(0 20px 30px rgba(0, 0, 0, 0.55))",
        }}
      >
        <Mascot
          pose="thinking"
          expression="amused"
          eyeTarget="camera"
          mouthOpen={0.18}
          scale={preset.mascotLayout.avatarScale}
          showShadow={false}
          style={{ transformOrigin: "top center" }}
        />
      </div>
    </AbsoluteFill>
  );
};
