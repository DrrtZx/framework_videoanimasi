import React from "react";
import { AbsoluteFill } from "remotion";
import { Prop } from "./Prop";
import { DEFAULT_PRESET_ID, getPreset } from "../presets";

export type ChannelBannerProps = {
  presetId?: string;
  channelName?: string;
  tagline?: string;
  showSafeGuide?: boolean;
};

/**
 * YouTube Channel Banner — 2560 × 1440 px (All-Device Safe Area 1546 × 423)
 * Memenuhi syarat YouTube minimal 2048×1152 px dan < 6 MB.
 * Seluruh aset visual (maskot, warna, label, tagline) mengikuti preset yang dipilih.
 */
export const ChannelBanner: React.FC<ChannelBannerProps> = ({
  presetId = DEFAULT_PRESET_ID,
  channelName,
  tagline,
  showSafeGuide = false,
}) => {
  const preset = getPreset(presetId);
  const Mascot = preset.Mascot;
  const pal = preset.palette;

  const activeChannelName = channelName ?? preset.branding.channelName;
  const activeTagline = tagline ?? preset.branding.tagline;
  const idPrefix = `banner-${preset.id}`;
  const isCleanStudio =
    preset.stageStyle === "clean-studio" || preset.stageStyle === "minimal";

  return (
    <AbsoluteFill
      style={{
        width: "2560px",
        height: "1440px",
        background: `radial-gradient(circle at 50% 50%, ${pal.bgCenter} 0%, ${pal.bg} 58%, ${pal.bgOuter} 100%)`,
        overflow: "hidden",
      }}
    >
      {/* ================= 1. LATAR BELAKANG SESUAI PRESET (2560×1440 TV FULL) ================= */}
      <svg
        width="2560"
        height="1440"
        viewBox="0 0 2560 1440"
        style={{ position: "absolute", inset: 0, zIndex: 0 }}
      >
        <defs>
          {!isCleanStudio && (
            <>
              <pattern id={`${idPrefix}-GridSmall`} width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M 32 0 L 0 0 0 32" fill="none" stroke={pal.gridMinor} strokeWidth="1" opacity="0.24" />
              </pattern>
              <pattern id={`${idPrefix}-GridMajor`} width="160" height="160" patternUnits="userSpaceOnUse">
                <rect width="160" height="160" fill={`url(#${idPrefix}-GridSmall)`} />
                <path d="M 160 0 L 0 0 0 160" fill="none" stroke={pal.gridMajor} strokeWidth="1.8" opacity="0.38" />
              </pattern>
            </>
          )}
          <linearGradient id={`${idPrefix}-desktopBandGrad`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#020617" stopOpacity="0.6" />
            <stop offset="22%" stopColor={pal.bgLight} stopOpacity="0.45" />
            <stop offset="50%" stopColor={pal.bgCenter} stopOpacity="0.38" />
            <stop offset="78%" stopColor={pal.bgLight} stopOpacity="0.45" />
            <stop offset="100%" stopColor="#020617" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id={`${idPrefix}-cyanNeonLine`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={pal.gridMajor} stopOpacity="0" />
            <stop offset="20%" stopColor={pal.gridMajor} stopOpacity="0.7" />
            <stop offset="50%" stopColor={pal.blueprintCyan} stopOpacity="0.95" />
            <stop offset="80%" stopColor={pal.gridMajor} stopOpacity="0.7" />
            <stop offset="100%" stopColor={pal.gridMajor} stopOpacity="0" />
          </linearGradient>
          <radialGradient id={`${idPrefix}-mascotGlow`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={pal.blueprintCyan} stopOpacity="0.36" />
            <stop offset="65%" stopColor={pal.gridMajor} stopOpacity="0.1" />
            <stop offset="100%" stopColor={pal.bg} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${idPrefix}-orbCyan`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={pal.gridMajor} stopOpacity="0.24" />
            <stop offset="55%" stopColor={pal.gridMajor} stopOpacity="0.06" />
            <stop offset="100%" stopColor={pal.bg} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${idPrefix}-orbPurple`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={pal.accentPurple} stopOpacity="0.22" />
            <stop offset="55%" stopColor={pal.accentPurple} stopOpacity="0.06" />
            <stop offset="100%" stopColor={pal.bg} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${idPrefix}-orbWarm`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={pal.accentYellow} stopOpacity="0.11" />
            <stop offset="60%" stopColor={pal.accentYellow} stopOpacity="0.02" />
            <stop offset="100%" stopColor={pal.bg} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${idPrefix}-medalBorder`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={pal.blueprintCyan} />
            <stop offset="100%" stopColor={pal.gridMajor} />
          </linearGradient>
        </defs>

        {isCleanStudio ? (
          /* === CLEAN STUDIO AMBIENT ORBS (TANPA GARIS GRID / CIRCUIT) === */
          <g>
            <circle cx="725" cy="725" r="560" fill={`url(#${idPrefix}-orbCyan)`} />
            <circle cx="1650" cy="720" r="640" fill={`url(#${idPrefix}-orbPurple)`} />
            <circle cx="1280" cy="260" r="440" fill={`url(#${idPrefix}-orbWarm)`} />
            <circle cx="250" cy="720" r="240" fill={`url(#${idPrefix}-orbCyan)`} opacity="0.65" />
            <circle cx="2310" cy="720" r="240" fill={`url(#${idPrefix}-orbPurple)`} opacity="0.65" />
          </g>
        ) : (
          <>
            <rect width="2560" height="1440" fill={`url(#${idPrefix}-GridMajor)`} />
            <circle cx="1280" cy="720" r="610" fill="none" stroke={pal.gridMajor} strokeWidth="2.5" strokeDasharray="24 18" opacity="0.22" />
            <circle cx="1280" cy="720" r="460" fill="none" stroke={pal.blueprintCyan} strokeWidth="2" strokeDasharray="10 14" opacity="0.18" />
            <circle cx="280" cy="720" r="240" fill="none" stroke={pal.accentPurple} strokeWidth="2" strokeDasharray="14 12" opacity="0.24" />
            <circle cx="2280" cy="720" r="240" fill="none" stroke={pal.accentPurple} strokeWidth="2" strokeDasharray="14 12" opacity="0.24" />
          </>
        )}

        {/* Pita Horizontal Desktop (Y: 508..931) */}
        <rect x="0" y="508" width="2560" height="423" fill={`url(#${idPrefix}-desktopBandGrad)`} />
        <line
          x1="0"
          y1="508"
          x2="2560"
          y2="508"
          stroke={`url(#${idPrefix}-cyanNeonLine)`}
          strokeWidth={isCleanStudio ? "3" : "4"}
          opacity={isCleanStudio ? "0.55" : "1"}
        />
        <line
          x1="0"
          y1="931"
          x2="2560"
          y2="931"
          stroke={`url(#${idPrefix}-cyanNeonLine)`}
          strokeWidth={isCleanStudio ? "3" : "4"}
          opacity={isCleanStudio ? "0.55" : "1"}
        />

        {/* Garis Sirkuit Sayap Kiri & Kanan (Khusus Blueprint) */}
        {!isCleanStudio && (
          <g stroke={pal.gridMajor} strokeWidth="3" fill="none" opacity="0.55">
            <path d="M 60 630 L 210 630 L 250 670 L 460 670" />
            <path d="M 90 720 L 430 720" stroke={pal.blueprintCyan} strokeWidth="3.5" />
            <path d="M 60 810 L 210 810 L 250 770 L 460 770" />
            <circle cx="460" cy="670" r="7" fill={pal.blueprintCyan} />
            <circle cx="430" cy="720" r="9" fill={pal.accentYellow} />
            <circle cx="460" cy="770" r="7" fill={pal.blueprintCyan} />
            <path d="M 2500 630 L 2350 630 L 2310 670 L 2100 670" />
            <path d="M 2470 720 L 2130 720" stroke={pal.blueprintCyan} strokeWidth="3.5" />
            <path d="M 2500 810 L 2350 810 L 2310 770 L 2100 770" />
            <circle cx="2100" cy="670" r="7" fill={pal.blueprintCyan} />
            <circle cx="2130" cy="720" r="9" fill={pal.accentYellow} />
            <circle cx="2100" cy="770" r="7" fill={pal.blueprintCyan} />
          </g>
        )}

        {/* Pendar Cahaya di Belakang Maskot */}
        <circle cx="725" cy="725" r="245" fill={`url(#${idPrefix}-mascotGlow)`} />

        {/* Bingkai Lingkaran Maskot */}
        {isCleanStudio ? (
          <>
            <circle cx="725" cy="722" r="196" fill="none" stroke={pal.gridMajor} strokeWidth="2.5" opacity="0.28" />
            <circle cx="725" cy="722" r="184" fill={pal.bg} stroke={`url(#${idPrefix}-medalBorder)`} strokeWidth="6" />
          </>
        ) : (
          <>
            <circle cx="725" cy="722" r="184" fill={pal.bg} stroke={pal.blueprintCyan} strokeWidth="6" />
            <circle cx="725" cy="722" r="198" fill="none" stroke={pal.accentYellow} strokeWidth="3.5" strokeDasharray="18 14" opacity="0.85" />
          </>
        )}

        {/* Tanda Crop Sudut & HUD Blueprint (Khusus Blueprint) */}
        {!isCleanStudio && (
          <>
            <g stroke={pal.gridMajor} strokeWidth="3" opacity="0.6">
              <line x1="60" y1="40" x2="60" y2="80" />
              <line x1="40" y1="60" x2="80" y2="60" />
              <line x1="2500" y1="40" x2="2500" y2="80" />
              <line x1="2480" y1="60" x2="2520" y2="60" />
              <line x1="60" y1="1360" x2="60" y2="1400" />
              <line x1="40" y1="1380" x2="80" y2="1380" />
              <line x1="2500" y1="1360" x2="2500" y2="1400" />
              <line x1="2480" y1="1380" x2="2520" y2="1380" />
            </g>
            <g stroke={pal.blueprintCyan} strokeWidth="4" opacity="0.7" fill="none">
              <path d="M 520 555 L 520 524 L 555 524" />
              <path d="M 2040 555 L 2040 524 L 2005 524" />
              <path d="M 520 885 L 520 916 L 555 916" />
              <path d="M 2040 885 L 2040 916 L 2005 916" />
            </g>
            <text x="105" y="72" fill={pal.gridMajor} opacity="0.45" fontSize="22" fontFamily="monospace" letterSpacing="4">
              {preset.branding.coordLabel}
            </text>
            <text x="2455" y="72" fill={pal.gridMajor} opacity="0.45" fontSize="22" fontFamily="monospace" letterSpacing="4" textAnchor="end">
              2560 × 1440 // HD
            </text>
            <text x="1280" y="1390" fill={pal.gridMajor} opacity="0.35" fontSize="20" fontFamily="monospace" letterSpacing="6" textAnchor="middle">
              {preset.branding.footerKeywords}
            </text>
          </>
        )}

        {/* Panduan Garis Safe Area Opsional */}
        {showSafeGuide && (
          <rect x="507" y="508" width="1546" height="423" fill="none" stroke="#F43F5E" strokeWidth="4" strokeDasharray="12 8" />
        )}
      </svg>

      {/* Vignette Studio Halus untuk Kedalaman */}
      {isCleanStudio && (
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(circle at 50% 50%, transparent 55%, rgba(2, 6, 18, 0.42) 100%)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
      )}

      {/* ================= 2. PROP DEKORATIF LUAR (DESKTOP & TV) ================= */}
      <div style={{ position: "absolute", top: "635px", left: isCleanStudio ? "170px" : "160px", opacity: isCleanStudio ? 0.78 : 0.88, zIndex: 8 }}>
        <Prop type={isCleanStudio ? "cpu" : "moth"} size={165} animate={false} />
      </div>
      <div style={{ position: "absolute", top: "640px", right: isCleanStudio ? "170px" : "160px", opacity: isCleanStudio ? 0.85 : 0.88, zIndex: 8 }}>
        <Prop type={isCleanStudio ? "gpu" : "relay"} size={160} animate={false} />
      </div>
      <div style={{ position: "absolute", top: "170px", left: "620px", opacity: isCleanStudio ? 0.16 : 0.25, zIndex: 5 }}>
        <Prop type="lightbulb" size={130} animate={false} />
      </div>
      <div style={{ position: "absolute", top: "170px", right: "620px", opacity: isCleanStudio ? 0.16 : 0.25, zIndex: 5 }}>
        <Prop type="flask" size={130} animate={false} />
      </div>
      <div style={{ position: "absolute", bottom: "160px", left: "720px", opacity: isCleanStudio ? 0.14 : 0.22, zIndex: 5 }}>
        <Prop type="book" size={130} animate={false} />
      </div>
      <div style={{ position: "absolute", bottom: "160px", right: "720px", opacity: isCleanStudio ? 0.14 : 0.22, zIndex: 5 }}>
        <Prop type="magnifier" size={130} animate={false} />
      </div>

      {/* ================= 3. KONTEN UTAMA DI ALL-DEVICE SAFE AREA ================= */}
      {/* 3A. Maskot Preset dalam Medali Lingkaran */}
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
        <div style={{ marginTop: "-36px" }}>
          <Mascot
            pose="pointing"
            expression="amused"
            eyeTarget="right"
            mouthOpen={0.2}
            scale={preset.mascotLayout.bannerScale}
            showShadow={false}
            style={{ transformOrigin: "top center" }}
          />
        </div>
      </div>

      {/* 3B. Blok Teks Utama Channel + Tagline */}
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
        {/* Kicker Kecil */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "10px",
            padding: "6px 20px",
            borderRadius: "999px",
            backgroundColor: "rgba(0, 245, 255, 0.14)",
            border: `2.5px solid ${pal.blueprintCyan}`,
            fontFamily: preset.fonts.label,
            fontSize: "24px",
            fontWeight: 800,
            color: pal.blueprintCyan,
            letterSpacing: "3px",
          }}
        >
          <span>●</span>
          <span>{preset.branding.kicker}</span>
        </div>

        {/* Nama Channel Raksasa */}
        <div
          style={{
            fontFamily: preset.fonts.title,
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
            {activeChannelName.split(" ")[0] || "FAKTA"}{" "}
          </span>
          <span style={{ color: pal.accentYellow }}>
            {activeChannelName.split(" ").slice(1).join(" ") || "STUDIO"}
          </span>
        </div>

        {/* Pill Tagline Kontras Tinggi (Pure SVG lightning bolt) */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "14px",
            background: `linear-gradient(90deg, ${pal.gridMinor} 0%, ${pal.accentPurple} 100%)`,
            color: "#FFFFFF",
            fontFamily: preset.fonts.label,
            fontSize: "34px",
            fontWeight: 900,
            padding: "12px 34px",
            borderRadius: "18px",
            border: "4px solid #000000",
            boxShadow: "0 7px 0 #000000",
            letterSpacing: "1.5px",
          }}
        >
          <svg width="26" height="30" viewBox="0 0 24 28" fill="none">
            <path d="M14 1L2 16H11L9 27L22 12H13L14 1Z" fill={pal.accentYellow} stroke="#000000" strokeWidth="2" strokeLinejoin="round" />
          </svg>
          <span>{activeTagline}</span>
        </div>
      </div>

      {/* 3C. Ikon Tematik Kanan di Dalam Safe Area */}
      <div style={{ position: "absolute", left: "1865px", top: "558px", zIndex: 22 }}>
        <Prop type="lightbulb" size={145} animate={false} />
      </div>
      <div style={{ position: "absolute", left: "1875px", top: "742px", zIndex: 22 }}>
        <Prop type="question-mark" size={125} animate={false} />
      </div>
    </AbsoluteFill>
  );
};
