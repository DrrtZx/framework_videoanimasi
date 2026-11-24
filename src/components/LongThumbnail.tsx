import React from "react";
import { AbsoluteFill } from "remotion";
import { Jokowo } from "./Jokowo";
import { Prop } from "./Prop";
import { PALETTE } from "../config";
import { FONTS } from "../fonts";

export interface LongThumbnailProps {
  title?: string;
  badge?: string;
}

export const LongThumbnail: React.FC<LongThumbnailProps> = ({
  title = "DARI MANA ASAL OKSIGEN BUMI?",
  badge = "BUKAN HUTAN AMAZON!",
}) => {
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 65% 50%, #0F325E 0%, ${PALETTE.bg} 80%, #030814 100%)`,
        overflow: "hidden",
        width: 1280,
        height: 720,
      }}
    >
      {/* Background Graphic Blueprint Grid & Concentric Schematics */}
      <svg width="1280" height="720" style={{ position: "absolute", zIndex: 0 }}>
        <defs>
          <pattern id="longThumbGridSmall" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#0284C7" strokeWidth="0.75" opacity="0.3" />
          </pattern>
          <pattern id="longThumbGridMajor" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="url(#longThumbGridSmall)" />
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#38BDF8" strokeWidth="1.5" opacity="0.45" />
          </pattern>
        </defs>
        <rect width="1280" height="720" fill="url(#longThumbGridMajor)" />

        {/* Blueprint HUD Schematics */}
        <circle cx="1000" cy="420" r="300" fill="none" stroke="#38BDF8" strokeWidth="2.5" strokeDasharray="14 10" opacity="0.4" />
        <circle cx="1000" cy="420" r="220" fill="none" stroke="#00F5FF" strokeWidth="1.5" strokeDasharray="6 6" opacity="0.3" />

        {/* Corner Crop Marks (+) */}
        <g stroke="#38BDF8" strokeWidth="2.5" opacity="0.6">
          <line x1="30" y1="20" x2="30" y2="45" />
          <line x1="18" y1="32" x2="42" y2="32" />
          <line x1="1250" y1="20" x2="1250" y2="45" />
          <line x1="1238" y1="32" x2="1262" y2="32" />
          <line x1="30" y1="675" x2="30" y2="700" />
          <line x1="18" y1="688" x2="42" y2="688" />
          <line x1="1250" y1="675" x2="1250" y2="700" />
          <line x1="1238" y1="688" x2="1262" y2="688" />
        </g>
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
            backgroundColor: PALETTE.accentPurple,
            color: "#FFFFFF",
            fontFamily: FONTS.title,
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
          {badge}
        </div>

        {/* Headline Judul Besar Kontras */}
        <div
          style={{
            fontFamily: FONTS.title,
            fontSize: "76px",
            fontWeight: 900,
            color: PALETTE.accentYellow,
            WebkitTextStroke: "14px #000000",
            paintOrder: "stroke fill",
            textShadow: "0 10px 0 #000000, 0 16px 24px rgba(0,0,0,0.5)",
            lineHeight: 1.12,
            textTransform: "uppercase",
          }}
        >
          {title}
        </div>
      </div>

      {/* Floating Props */}
      <div style={{ position: "absolute", left: "680px", top: "80px", zIndex: 15 }}>
        <Prop type="magnifier" size={130} />
      </div>
      <div style={{ position: "absolute", left: "540px", bottom: "90px", zIndex: 15 }}>
        <Prop type="atom" size={120} />
      </div>

      {/* Karakter Jokowo di Kanan (Pose Menunjuk / Curious) */}
      <div
        style={{
          position: "absolute",
          right: "120px",
          bottom: "10px",
          zIndex: 25,
        }}
      >
        <Jokowo
          pose="pointing"
          expression="curious"
          scale={2.1}
        />
      </div>
    </AbsoluteFill>
  );
};
