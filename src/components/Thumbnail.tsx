import React from "react";
import { AbsoluteFill } from "remotion";
import { Jokowo } from "./Jokowo";
import { Prop } from "./Prop";
import type { PropType } from "./Prop";
import { PALETTE } from "../config";
import { FONTS } from "../fonts";

export interface ThumbnailProps {
  title?: string;
  subtitle?: string;
  floatingProps?: [PropType, PropType, PropType, PropType];
}

export const Thumbnail: React.FC<ThumbnailProps> = ({
  title = "KENAPA ERROR KOMPUTER DISEBUT BUG?",
  subtitle = "KASUS NYATA 1947!",
  floatingProps = ["moth", "relay", "question-mark", "lightbulb"],
}) => {
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 35%, #0F325E 0%, ${PALETTE.bg} 85%, #020612 100%)`,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Technical Blueprint Grid Pattern */}
      <svg width="1080" height="1920" style={{ position: "absolute", zIndex: 0 }}>
        <defs>
          <pattern id="thumbGridSmall" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#0284C7" strokeWidth="0.75" opacity="0.3" />
          </pattern>
          <pattern id="thumbGridMajor" width="120" height="120" patternUnits="userSpaceOnUse">
            <rect width="120" height="120" fill="url(#thumbGridSmall)" />
            <path d="M 120 0 L 0 0 0 120" fill="none" stroke="#38BDF8" strokeWidth="1.5" opacity="0.45" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#thumbGridMajor)" />

        {/* Blueprint Decorative Concentric Circles */}
        <circle cx="540" cy="850" r="420" fill="none" stroke="#38BDF8" strokeWidth="3" strokeDasharray="16 12" opacity="0.35" />
        <circle cx="540" cy="850" r="600" fill="none" stroke="#00F5FF" strokeWidth="2" strokeDasharray="8 8" opacity="0.25" />

        {/* Corner Crop Marks (+) */}
        <g stroke="#38BDF8" strokeWidth="3" opacity="0.7">
          <line x1="40" y1="30" x2="40" y2="60" />
          <line x1="25" y1="45" x2="55" y2="45" />
          <line x1="1040" y1="30" x2="1040" y2="60" />
          <line x1="1025" y1="45" x2="1055" y2="45" />
          <line x1="40" y1="1860" x2="40" y2="1890" />
          <line x1="25" y1="1875" x2="55" y2="1875" />
          <line x1="1040" y1="1860" x2="1040" y2="1890" />
          <line x1="1025" y1="1875" x2="1055" y2="1875" />
        </g>
      </svg>

      {/* Floating Props Blueprint */}
      <div style={{ position: "absolute", top: "540px", left: "80px", zIndex: 35 }}>
        <Prop type={floatingProps[0]} size={200} animate={false} />
      </div>
      <div style={{ position: "absolute", top: "540px", right: "80px", zIndex: 35 }}>
        <Prop type={floatingProps[1]} size={190} animate={false} />
      </div>
      <div style={{ position: "absolute", top: "900px", left: "60px", zIndex: 35 }}>
        <Prop type={floatingProps[2]} size={160} animate={false} />
      </div>
      <div style={{ position: "absolute", top: "900px", right: "60px", zIndex: 35 }}>
        <Prop type={floatingProps[3]} size={150} animate={false} />
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
            fontFamily: FONTS.title,
            fontSize: "80px",
            fontWeight: 900,
            color: PALETTE.accentYellow,
            WebkitTextStroke: "16px #000000",
            paintOrder: "stroke fill",
            textShadow: "0 14px 0 #000000, 0 20px 30px rgba(0,0,0,0.5)",
            lineHeight: 1.15,
            textTransform: "uppercase",
            marginBottom: "20px",
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "inline-block",
            backgroundColor: PALETTE.accentPurple,
            color: "#FFFFFF",
            fontFamily: FONTS.title,
            fontSize: "44px",
            fontWeight: 900,
            padding: "12px 36px",
            borderRadius: "30px",
            border: "5px solid #000000",
            boxShadow: "0 8px 0 #000000",
            transform: "rotate(-2deg)",
          }}
        >
          {subtitle}
        </div>
      </div>

      {/* Karakter Jokowo Pose Kaget / Menunjuk Besar di Bawah */}
      <div
        style={{
          position: "absolute",
          bottom: "30px",
          zIndex: 25,
        }}
      >
        <Jokowo
          pose="celebrating"
          expression="shocked"
          scale={3.0}
        />
      </div>
    </AbsoluteFill>
  );
};
