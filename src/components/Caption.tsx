import React from "react";
import { PALETTE, CAPTION_CONFIG } from "../config";
import { FONTS } from "../fonts";

export interface CaptionProps {
  text: string;
  activeWord?: string;
  variant?: "shorts" | "long";
  style?: React.CSSProperties;
}

export const Caption: React.FC<CaptionProps> = ({
  text,
  activeWord,
  variant = "shorts",
  style = {},
}) => {
  const config = CAPTION_CONFIG[variant];

  // Tampilkan seluruh kata dari dialog beat tanpa pemotongan liar
  const words = text.trim().split(/\s+/).filter(Boolean);

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: `${config.bottom}px`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "0 40px",
        zIndex: 40,
        pointerEvents: "none",
        ...style,
      }}
    >
      <div
        style={{
          fontFamily: FONTS.caption,
          fontSize: `${config.fontSize}px`,
          fontWeight: 900,
          color: "#FFFFFF",
          lineHeight: 1.2,
          letterSpacing: "1px",
          textTransform: "uppercase",
          /* WAJIB: Tanpa kotak background, outline tebal 12px + shadow */
          WebkitTextStroke: `${config.strokeWidth}px #000000`,
          paintOrder: "stroke fill",
          textShadow: "0 8px 0 #000000, 0 12px 20px rgba(0, 0, 0, 0.4)",
          wordBreak: "break-word",
        }}
      >
        {words.map((word, idx) => {
          // Bersihkan tanda baca untuk perbandingan kata aktif presisi
          const cleanWord = word.replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, "").toLowerCase();
          const cleanActive = (activeWord || "").replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, "").toLowerCase();
          const isActive = Boolean(cleanActive && cleanWord === cleanActive);

          return (
            <span
              key={`${word}-${idx}`}
              style={{
                color: isActive ? PALETTE.accentYellow : "#FFFFFF",
                display: "inline-block",
                margin: "0 8px",
                transform: isActive ? "scale(1.08)" : "scale(1.0)",
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </div>
  );
};
