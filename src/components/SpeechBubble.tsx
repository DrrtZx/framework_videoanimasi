import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { PALETTE } from "../config";
import { FONTS } from "../fonts";
import { popIn } from "../lib/anim";

export interface SpeechBubbleProps {
  text: string;
  position?: "left" | "right" | "top";
  delay?: number;
  style?: React.CSSProperties;
}

export const SpeechBubble: React.FC<SpeechBubbleProps> = ({
  text,
  position = "top",
  delay = 0,
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = popIn(frame, fps, delay);

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        transform: `scale(${scale})`,
        transformOrigin: position === "top" ? "bottom center" : "center left",
        backgroundColor: "#FFFFFF",
        border: `3px solid ${PALETTE.ink}`,
        borderRadius: "20px",
        padding: "16px 24px",
        boxShadow: "0 8px 0 rgba(30, 41, 59, 0.15)",
        fontFamily: FONTS.speechBubble,
        fontSize: "28px",
        fontWeight: 700,
        color: PALETTE.ink,
        maxWidth: "420px",
        textAlign: "center",
        zIndex: 20,
        ...style,
      }}
    >
      {text}
      {/* Ekor Balon Bicara */}
      <div
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          borderStyle: "solid",
          ...(position === "top"
            ? {
                bottom: "-14px",
                left: "40px",
                borderWidth: "14px 10px 0 10px",
                borderColor: `${PALETTE.ink} transparent transparent transparent`,
              }
            : position === "right"
            ? {
                left: "-14px",
                top: "20px",
                borderWidth: "10px 14px 10px 0",
                borderColor: `transparent ${PALETTE.ink} transparent transparent`,
              }
            : {
                right: "-14px",
                top: "20px",
                borderWidth: "10px 0 10px 14px",
                borderColor: `transparent transparent transparent ${PALETTE.ink}`,
              }),
        }}
      />
    </div>
  );
};
