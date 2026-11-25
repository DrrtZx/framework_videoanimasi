import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { popIn } from "../lib/anim";
import { getPreset } from "../presets";
import type { PresetConfig } from "../presets/types";

export interface ChapterCardProps {
  title: string;
  chapterNumber: number;
  durationInFrames?: number;
  preset?: PresetConfig;
}

export const ChapterCard: React.FC<ChapterCardProps> = ({
  title,
  chapterNumber,
  durationInFrames = 60,
  preset = getPreset(),
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Hanya tampil di awal babak
  if (frame > durationInFrames) {
    return null;
  }

  const enterScale = popIn(frame, fps, 0, 14, 180);
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        position: "absolute",
        top: "60px",
        left: "80px",
        zIndex: 35,
        opacity: fadeOut,
        transform: `scale(${enterScale})`,
        transformOrigin: "top left",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          flexDirection: "column",
          backgroundColor: "#FFFFFF",
          border: `3px solid ${preset.palette.ink}`,
          borderRadius: "16px",
          padding: "16px 28px",
          boxShadow: "0 8px 0 rgba(30, 41, 59, 0.2)",
        }}
      >
        <span
          style={{
            fontFamily: preset.fonts.label,
            fontSize: "18px",
            fontWeight: 800,
            color: preset.palette.accentBlue,
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            marginBottom: "4px",
          }}
        >
          BABAK #{chapterNumber}
        </span>
        <span
          style={{
            fontFamily: preset.fonts.title,
            fontSize: "32px",
            fontWeight: 900,
            color: preset.palette.ink,
          }}
        >
          {title}
        </span>
      </div>
    </div>
  );
};
