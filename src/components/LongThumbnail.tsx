import React from "react";
import { AbsoluteFill } from "remotion";
import { Prop } from "./Prop";
import { DEFAULT_PRESET_ID, getPreset } from "../presets";

export type LongThumbnailProps = {
  presetId?: string;
  title?: string;
  badge?: string;
};

export const LongThumbnail: React.FC<LongThumbnailProps> = ({
  presetId = DEFAULT_PRESET_ID,
  title,
  badge,
}) => {
  const preset = getPreset(presetId);
  const Mascot = preset.Mascot;
  const pal = preset.palette;
  const defaults = preset.branding.defaultLongThumbnail;

  const activeTitle = title ?? defaults.title;
  const activeBadge = badge ?? defaults.badge;
  const gridPrefix = `longThumb-${preset.id}`;
  const isCleanStudio =
    preset.stageStyle === "clean-studio" || preset.stageStyle === "minimal";

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 65% 50%, ${pal.bgCenter} 0%, ${pal.bg} 80%, ${pal.bgOuter} 100%)`,
        overflow: "hidden",
        width: 1280,
        height: 720,
      }}
    >
      {/* Background Studio Ambient / Blueprint Grid */}
      <svg width="1280" height="720" style={{ position: "absolute", zIndex: 0 }}>
        <defs>
          {!isCleanStudio && (
            <>
              <pattern id={`${gridPrefix}-GridSmall`} width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke={pal.gridMinor} strokeWidth="0.75" opacity="0.3" />
              </pattern>
              <pattern id={`${gridPrefix}-GridMajor`} width="100" height="100" patternUnits="userSpaceOnUse">
                <rect width="100" height="100" fill={`url(#${gridPrefix}-GridSmall)`} />
                <path d="M 100 0 L 0 0 0 100" fill="none" stroke={pal.gridMajor} strokeWidth="1.5" opacity="0.45" />
              </pattern>
            </>
          )}
          <radialGradient id={`${gridPrefix}-Orb`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={pal.blueprintCyan} stopOpacity="0.22" />
            <stop offset="100%" stopColor={pal.bg} stopOpacity="0" />
          </radialGradient>
        </defs>
        {isCleanStudio ? (
          <g>
            <circle cx="960" cy="400" r="420" fill={`url(#${gridPrefix}-Orb)`} />
            <circle cx="1000" cy="420" r="290" fill="none" stroke={pal.gridMajor} strokeWidth="2" strokeDasharray="14 12" opacity="0.18" />
          </g>
        ) : (
          <>
            <rect width="1280" height="720" fill={`url(#${gridPrefix}-GridMajor)`} />
            <circle cx="1000" cy="420" r="300" fill="none" stroke={pal.gridMajor} strokeWidth="2.5" strokeDasharray="14 10" opacity="0.4" />
            <circle cx="1000" cy="420" r="220" fill="none" stroke={pal.blueprintCyan} strokeWidth="1.5" strokeDasharray="6 6" opacity="0.3" />
          </>
        )}

        {/* Corner Crop Marks (+) */}
        {preset.stageStyle === "blueprint" && (
          <g stroke={pal.gridMajor} strokeWidth="2.5" opacity="0.6">
            <line x1="30" y1="20" x2="30" y2="45" />
            <line x1="18" y1="32" x2="42" y2="32" />
            <line x1="1250" y1="20" x2="1250" y2="45" />
            <line x1="1238" y1="32" x2="1262" y2="32" />
            <line x1="30" y1="675" x2="30" y2="700" />
            <line x1="18" y1="688" x2="42" y2="688" />
            <line x1="1250" y1="675" x2="1250" y2="700" />
            <line x1="1238" y1="688" x2="1262" y2="688" />
          </g>
        )}
      </svg>

      {/* Area Teks Judul Utama di Kiri */}
      <div
        style={{
          position: "absolute",
          left: "70px",
          top: "120px",
          width: "740px",
          zIndex: 30,
        }}
      >
        {/* Badge Pengait */}
        <div
          style={{
            display: "inline-block",
            backgroundColor: pal.accentPurple,
            color: "#FFFFFF",
            fontFamily: preset.fonts.title,
            fontSize: "36px",
            fontWeight: 900,
            padding: "10px 28px",
            borderRadius: "20px",
            border: "4px solid #000000",
            boxShadow: "0 6px 0 #000000",
            transform: "rotate(-2deg)",
            marginBottom: "24px",
          }}
        >
          {activeBadge}
        </div>

        {/* Headline Judul Besar Kontras */}
        <div
          style={{
            fontFamily: preset.fonts.title,
            fontSize: "76px",
            fontWeight: 900,
            color: pal.accentYellow,
            WebkitTextStroke: "14px #000000",
            paintOrder: "stroke fill",
            textShadow: "0 10px 0 #000000, 0 16px 24px rgba(0,0,0,0.5)",
            lineHeight: 1.12,
            textTransform: "uppercase",
          }}
        >
          {activeTitle}
        </div>
      </div>

      {/* Floating Props */}
      <div style={{ position: "absolute", left: "680px", top: "80px", zIndex: 15 }}>
        <Prop type="magnifier" size={130} />
      </div>
      <div style={{ position: "absolute", left: "540px", bottom: "90px", zIndex: 15 }}>
        <Prop type="atom" size={120} />
      </div>

      {/* Karakter Maskot Sesuai Preset di Kanan */}
      <div
        style={{
          position: "absolute",
          right: "120px",
          bottom: "10px",
          zIndex: 25,
        }}
      >
        <Mascot
          pose="pointing"
          expression="curious"
          scale={preset.mascotLayout.thumbnailLongScale}
        />
      </div>
    </AbsoluteFill>
  );
};
