import React from "react";
import { AbsoluteFill } from "remotion";
import { Prop } from "./Prop";
import type { PropType } from "./Prop";
import { DEFAULT_PRESET_ID, getPreset } from "../presets";

export type ThumbnailProps = {
  presetId?: string;
  title?: string;
  subtitle?: string;
  floatingProps?: [PropType, PropType, PropType, PropType];
};

export const Thumbnail: React.FC<ThumbnailProps> = ({
  presetId = DEFAULT_PRESET_ID,
  title,
  subtitle,
  floatingProps,
}) => {
  const preset = getPreset(presetId);
  const Mascot = preset.Mascot;
  const pal = preset.palette;
  const thumbDefaults = preset.branding.defaultShortsThumbnail;

  const activeTitle = title ?? thumbDefaults.title;
  const activeSubtitle = subtitle ?? thumbDefaults.subtitle;
  const activeProps = floatingProps ?? thumbDefaults.floatingProps;
  const gridPrefix = `thumb-${preset.id}`;
  const isCleanStudio =
    preset.stageStyle === "clean-studio" || preset.stageStyle === "minimal";

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 35%, ${pal.bgCenter} 0%, ${pal.bg} 85%, ${pal.bgOuter} 100%)`,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Clean Studio Ambient Glow / Blueprint Grid Pattern */}
      <svg width="1080" height="1920" style={{ position: "absolute", zIndex: 0 }}>
        <defs>
          {!isCleanStudio && (
            <>
              <pattern id={`${gridPrefix}-GridSmall`} width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M 24 0 L 0 0 0 24" fill="none" stroke={pal.gridMinor} strokeWidth="0.75" opacity="0.3" />
              </pattern>
              <pattern id={`${gridPrefix}-GridMajor`} width="120" height="120" patternUnits="userSpaceOnUse">
                <rect width="120" height="120" fill={`url(#${gridPrefix}-GridSmall)`} />
                <path d="M 120 0 L 0 0 0 120" fill="none" stroke={pal.gridMajor} strokeWidth="1.5" opacity="0.45" />
              </pattern>
            </>
          )}
          <radialGradient id={`${gridPrefix}-OrbA`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={pal.blueprintCyan} stopOpacity="0.24" />
            <stop offset="100%" stopColor={pal.bg} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${gridPrefix}-OrbB`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={pal.accentPurple} stopOpacity="0.2" />
            <stop offset="100%" stopColor={pal.bg} stopOpacity="0" />
          </radialGradient>
        </defs>

        {isCleanStudio ? (
          <g>
            <circle cx="240" cy="480" r="440" fill={`url(#${gridPrefix}-OrbA)`} />
            <circle cx="840" cy="960" r="460" fill={`url(#${gridPrefix}-OrbB)`} />
            <circle cx="540" cy="880" r="460" fill="none" stroke={pal.gridMajor} strokeWidth="2" strokeDasharray="16 14" opacity="0.16" />
          </g>
        ) : (
          <>
            <rect width="100%" height="100%" fill={`url(#${gridPrefix}-GridMajor)`} />
            <circle cx="540" cy="850" r="420" fill="none" stroke={pal.gridMajor} strokeWidth="3" strokeDasharray="16 12" opacity="0.35" />
            <circle cx="540" cy="850" r="600" fill="none" stroke={pal.blueprintCyan} strokeWidth="2" strokeDasharray="8 8" opacity="0.25" />
          </>
        )}

        {/* Corner Crop Marks (+) */}
        {preset.stageStyle === "blueprint" && (
          <g stroke={pal.gridMajor} strokeWidth="3" opacity="0.7">
            <line x1="40" y1="30" x2="40" y2="60" />
            <line x1="25" y1="45" x2="55" y2="45" />
            <line x1="1040" y1="30" x2="1040" y2="60" />
            <line x1="1025" y1="45" x2="1055" y2="45" />
            <line x1="40" y1="1860" x2="40" y2="1890" />
            <line x1="25" y1="1875" x2="55" y2="1875" />
            <line x1="1040" y1="1860" x2="1040" y2="1890" />
            <line x1="1025" y1="1875" x2="1055" y2="1875" />
          </g>
        )}
      </svg>

      {/* Floating Props Blueprint */}
      <div style={{ position: "absolute", top: "540px", left: "80px", zIndex: 35 }}>
        <Prop type={activeProps[0]} size={200} animate={false} />
      </div>
      <div style={{ position: "absolute", top: "540px", right: "80px", zIndex: 35 }}>
        <Prop type={activeProps[1]} size={190} animate={false} />
      </div>
      <div style={{ position: "absolute", top: "900px", left: "60px", zIndex: 35 }}>
        <Prop type={activeProps[2]} size={160} animate={false} />
      </div>
      <div style={{ position: "absolute", top: "900px", right: "60px", zIndex: 35 }}>
        <Prop type={activeProps[3]} size={150} animate={false} />
      </div>

      {/* Judul Besar Menarik di Atas */}
      <div
        style={{
          position: "absolute",
          top: "140px",
          width: "960px",
          textAlign: "center",
          zIndex: 30,
        }}
      >
        <div
          style={{
            fontFamily: preset.fonts.title,
            fontSize: "80px",
            fontWeight: 900,
            color: pal.accentYellow,
            WebkitTextStroke: "16px #000000",
            paintOrder: "stroke fill",
            textShadow: "0 14px 0 #000000, 0 20px 30px rgba(0,0,0,0.5)",
            lineHeight: 1.15,
            textTransform: "uppercase",
            marginBottom: "20px",
          }}
        >
          {activeTitle}
        </div>
        <div
          style={{
            display: "inline-block",
            backgroundColor: pal.accentPurple,
            color: "#FFFFFF",
            fontFamily: preset.fonts.title,
            fontSize: "44px",
            fontWeight: 900,
            padding: "12px 36px",
            borderRadius: "30px",
            border: "5px solid #000000",
            boxShadow: "0 8px 0 #000000",
            transform: "rotate(-2deg)",
          }}
        >
          {activeSubtitle}
        </div>
      </div>

      {/* Karakter Maskot Sesuai Preset */}
      <div
        style={{
          position: "absolute",
          bottom: "30px",
          zIndex: 25,
        }}
      >
        <Mascot
          pose="celebrating"
          expression="shocked"
          scale={preset.mascotLayout.thumbnailShortsScale}
        />
      </div>
    </AbsoluteFill>
  );
};
