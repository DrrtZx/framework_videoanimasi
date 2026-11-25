import React from "react";
import { useCurrentFrame, random, AbsoluteFill } from "remotion";
import { getPreset } from "../presets";
import type { PresetConfig } from "../presets/types";
import type { ChapterKind } from "../episodes/long-types";

export interface ChapterBackdropProps {
  kind?: ChapterKind;
  seed?: string;
  preset?: PresetConfig;
}

export const ChapterBackdrop: React.FC<ChapterBackdropProps> = ({
  kind = "CHAPTER",
  seed = "blueprint-backdrop",
  preset = getPreset(),
}) => {
  const frame = useCurrentFrame();
  const pal = preset.palette;
  const isCleanStudio =
    preset.stageStyle === "clean-studio" || preset.stageStyle === "minimal";

  const getGradient = () => {
    switch (kind) {
      case "INTRO":
        return `radial-gradient(circle at 50% 40%, ${pal.bgCenter} 0%, ${pal.bg} 75%, ${pal.bgOuter} 100%)`;
      case "CLIMAX":
        return `radial-gradient(circle at 60% 50%, #1E1B4B 0%, ${pal.bg} 75%, #030712 100%)`;
      case "OUTRO":
        return `radial-gradient(circle at 50% 60%, #0C4A6E 0%, ${pal.bg} 75%, ${pal.bgOuter} 100%)`;
      case "INTERLUDE":
        return `radial-gradient(circle at 40% 40%, #1E293B 0%, ${pal.bg} 80%, ${pal.bgOuter} 100%)`;
      case "CHAPTER":
      default:
        return `radial-gradient(circle at 50% 50%, ${pal.bgLight} 0%, ${pal.bg} 70%, ${pal.bgOuter} 100%)`;
    }
  };

  // Garis scan laser halus yang bergerak vertikal
  const scanLineY = (frame * 3) % 1080;

  // Rotasi cincin HUD skematik (deterministik berbasis frame)
  const hudRotate = (frame * 0.4) % 360;
  const hudReverseRotate = -(frame * 0.25) % 360;

  // Titik koordinat data yang berdenyut lembut
  const nodes = Array.from({ length: 6 }).map((_, i) => {
    const pSeed = `${seed}-node-${i}`;
    const x = 120 + random(`${pSeed}-x`) * 1680;
    const y = 100 + random(`${pSeed}-y`) * 880;
    const pulse = Math.sin(frame * 0.08 + i) * 0.3 + 0.5;

    return { id: i, x, y, pulse };
  });

  const gridIdPrefix = `${preset.id}-${seed}`;

  return (
    <AbsoluteFill
      style={{
        background: getGradient(),
        overflow: "hidden",
        zIndex: 0,
      }}
    >
      {/* 1. Studio Ambient / Blueprint Grid */}
      <svg width="100%" height="100%" style={{ position: "absolute", zIndex: 1 }}>
        <defs>
          {!isCleanStudio && (
            <>
              <pattern id={`blueprintSmallGrid-${gridIdPrefix}`} width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke={pal.gridMinor} strokeWidth="0.75" opacity="0.25" />
              </pattern>
              <pattern id={`blueprintMajorGrid-${gridIdPrefix}`} width="100" height="100" patternUnits="userSpaceOnUse">
                <rect width="100" height="100" fill={`url(#blueprintSmallGrid-${gridIdPrefix})`} />
                <path d="M 100 0 L 0 0 0 100" fill="none" stroke={pal.gridMajor} strokeWidth="1.5" opacity="0.45" />
              </pattern>
            </>
          )}
          <radialGradient id={`studioOrbL-${gridIdPrefix}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={pal.blueprintCyan} stopOpacity="0.16" />
            <stop offset="100%" stopColor={pal.bg} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`studioOrbR-${gridIdPrefix}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={pal.accentPurple} stopOpacity="0.14" />
            <stop offset="100%" stopColor={pal.bg} stopOpacity="0" />
          </radialGradient>
        </defs>

        {isCleanStudio ? (
          <g>
            <circle cx="480" cy="420" r="460" fill={`url(#studioOrbL-${gridIdPrefix})`} />
            <circle cx="1450" cy="600" r="500" fill={`url(#studioOrbR-${gridIdPrefix})`} />
          </g>
        ) : (
          <>
            <rect width="100%" height="100%" fill={`url(#blueprintMajorGrid-${gridIdPrefix})`} />
            <g transform="translate(1400, 540)" opacity="0.25">
              <circle cx="0" cy="0" r="320" fill="none" stroke={pal.gridMajor} strokeWidth="2" strokeDasharray="16 12" transform={`rotate(${hudRotate})`} />
              <circle cx="0" cy="0" r="240" fill="none" stroke={pal.blueprintCyan} strokeWidth="1.5" strokeDasharray="8 8" transform={`rotate(${hudReverseRotate})`} />
              <circle cx="0" cy="0" r="160" fill="none" stroke={pal.gridMajor} strokeWidth="1" strokeDasharray="4 6" />
              <line x1="-340" y1="0" x2="340" y2="0" stroke={pal.gridMajor} strokeWidth="1" strokeDasharray="6 6" />
              <line x1="0" y1="-340" x2="0" y2="340" stroke={pal.gridMajor} strokeWidth="1" strokeDasharray="6 6" />
            </g>
            <g stroke={pal.gridMajor} strokeWidth="2" opacity="0.6">
              <line x1="40" y1="30" x2="40" y2="50" />
              <line x1="30" y1="40" x2="50" y2="40" />
              <line x1="1880" y1="30" x2="1880" y2="50" />
              <line x1="1870" y1="40" x2="1890" y2="40" />
              <line x1="40" y1="1030" x2="40" y2="1050" />
              <line x1="30" y1="1040" x2="50" y2="1040" />
              <line x1="1880" y1="1030" x2="1880" y2="1050" />
              <line x1="1870" y1="1040" x2="1890" y2="1040" />
            </g>
            <g fill={pal.gridMajor} opacity="0.45" fontSize="12" fontFamily="monospace" letterSpacing="2">
              <text x="60" y="44">{preset.branding.coordLabel}</text>
              <text x="60" y="1044">{`PRESET: ${preset.id.toUpperCase()} // ${preset.branding.channelName}`}</text>
              <text x="1720" y="1044">COORD: 1920×1080</text>
            </g>
          </>
        )}
      </svg>

      {/* 5. Scanning Laser Line Halus (hanya di mode non-clean-studio) */}
      {!isCleanStudio && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: `${scanLineY}px`,
            height: "2px",
            background: `linear-gradient(90deg, transparent 0%, ${pal.blueprintCyan} 50%, transparent 100%)`,
            boxShadow: `0 0 12px ${pal.blueprintCyan}`,
            opacity: 0.35,
            pointerEvents: "none",
            zIndex: 2,
          }}
        />
      )}

      {/* 6. Nodes Data Berdenyut */}
      {nodes.map((n) => (
        <div
          key={`node-${n.id}`}
          style={{
            position: "absolute",
            left: `${n.x}px`,
            top: `${n.y}px`,
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            backgroundColor: pal.blueprintCyan,
            boxShadow: `0 0 10px ${pal.blueprintCyan}`,
            opacity: n.pulse,
            pointerEvents: "none",
            zIndex: 2,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};
