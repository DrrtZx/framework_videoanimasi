import React from "react";
import { useCurrentFrame, random, AbsoluteFill } from "remotion";
import { PALETTE } from "../config";
import type { ChapterKind } from "../episodes/long-types";

export interface ChapterBackdropProps {
  kind?: ChapterKind;
  seed?: string;
}

export const ChapterBackdrop: React.FC<ChapterBackdropProps> = ({
  kind = "CHAPTER",
  seed = "blueprint-backdrop",
}) => {
  const frame = useCurrentFrame();

  const getGradient = () => {
    switch (kind) {
      case "INTRO":
        return "radial-gradient(circle at 50% 40%, #0F2F57 0%, #0A192F 75%, #050E1A 100%)";
      case "CLIMAX":
        return "radial-gradient(circle at 60% 50%, #1E1B4B 0%, #0A192F 75%, #030712 100%)";
      case "OUTRO":
        return "radial-gradient(circle at 50% 60%, #0C4A6E 0%, #0A192F 75%, #020617 100%)";
      case "INTERLUDE":
        return "radial-gradient(circle at 40% 40%, #1E293B 0%, #0A192F 80%, #020617 100%)";
      case "CHAPTER":
      default:
        return "radial-gradient(circle at 50% 50%, #0E2A47 0%, #0A192F 70%, #050E1A 100%)";
    }
  };

  // Garis scan laser biru cyan halus yang bergerak vertikal
  const scanLineY = (frame * 3) % 1080;

  // Rotasi cincin HUD skematik blueprint (deterministik berbasis frame)
  const hudRotate = (frame * 0.4) % 360;
  const hudReverseRotate = -(frame * 0.25) % 360;

  // Titik koordinat data cyan yang berdenyut lembut
  const nodes = Array.from({ length: 6 }).map((_, i) => {
    const pSeed = `${seed}-node-${i}`;
    const x = 120 + random(`${pSeed}-x`) * 1680;
    const y = 100 + random(`${pSeed}-y`) * 880;
    const pulse = Math.sin((frame * 0.08) + i) * 0.3 + 0.5;

    return { id: i, x, y, pulse };
  });

  return (
    <AbsoluteFill
      style={{
        background: getGradient(),
        overflow: "hidden",
        zIndex: 0,
      }}
    >
      {/* 1. Technical Blueprint Grid Arsitektur (Major: 100px, Minor: 20px) */}
      <svg width="100%" height="100%" style={{ position: "absolute", zIndex: 1 }}>
        <defs>
          {/* Grid mikro 20px */}
          <pattern id="blueprintSmallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#0284C7" strokeWidth="0.75" opacity="0.25" />
          </pattern>
          {/* Grid utama 100px */}
          <pattern id="blueprintMajorGrid" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="url(#blueprintSmallGrid)" />
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#38BDF8" strokeWidth="1.5" opacity="0.45" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#blueprintMajorGrid)" />

        {/* 2. Cincin Skematik Blueprint HUD Berputar Lembut di Latar */}
        <g transform="translate(1400, 540)" opacity="0.25">
          <circle cx="0" cy="0" r="320" fill="none" stroke="#38BDF8" strokeWidth="2" strokeDasharray="16 12" transform={`rotate(${hudRotate})`} />
          <circle cx="0" cy="0" r="240" fill="none" stroke="#00F5FF" strokeWidth="1.5" strokeDasharray="8 8" transform={`rotate(${hudReverseRotate})`} />
          <circle cx="0" cy="0" r="160" fill="none" stroke="#38BDF8" strokeWidth="1" strokeDasharray="4 6" />
          <line x1="-340" y1="0" x2="340" y2="0" stroke="#38BDF8" strokeWidth="1" strokeDasharray="6 6" />
          <line x1="0" y1="-340" x2="0" y2="340" stroke="#38BDF8" strokeWidth="1" strokeDasharray="6 6" />
        </g>

        {/* 3. Corner Crop Marks (+) di 4 Sudut Layar */}
        <g stroke="#38BDF8" strokeWidth="2" opacity="0.6">
          {/* Kiri Atas */}
          <line x1="40" y1="30" x2="40" y2="50" />
          <line x1="30" y1="40" x2="50" y2="40" />
          {/* Kanan Atas */}
          <line x1="1880" y1="30" x2="1880" y2="50" />
          <line x1="1870" y1="40" x2="1890" y2="40" />
          {/* Kiri Bawah */}
          <line x1="40" y1="1030" x2="40" y2="1050" />
          <line x1="30" y1="1040" x2="50" y2="1040" />
          {/* Kanan Bawah */}
          <line x1="1880" y1="1030" x2="1880" y2="1050" />
          <line x1="1870" y1="1040" x2="1890" y2="1040" />
        </g>

        {/* 4. Technical Blueprint Labels */}
        <g fill="#38BDF8" opacity="0.45" fontSize="12" fontFamily="monospace" letterSpacing="2">
          <text x="60" y="44">SYS.BLUEPRINT // v2.0</text>
          <text x="60" y="1044">SCALE 1:1 · TECH LAB // FAKTA</text>
          <text x="1720" y="1044">COORD: 1920×1080</text>
        </g>
      </svg>

      {/* 5. Scanning Laser Line Halus Cyan */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: `${scanLineY}px`,
          height: "2px",
          background: "linear-gradient(90deg, transparent 0%, #00F5FF 50%, transparent 100%)",
          boxShadow: "0 0 12px #00F5FF",
          opacity: 0.35,
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

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
            backgroundColor: PALETTE.blueprintCyan,
            boxShadow: `0 0 10px ${PALETTE.blueprintCyan}`,
            opacity: n.pulse,
            pointerEvents: "none",
            zIndex: 2,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};
