import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { popIn, wobble } from "../lib/anim";
import { getPreset } from "../presets";
import type { PresetConfig } from "../presets/types";

export interface SfxProps {
  text: string;
  delay?: number;
  duration?: number;
  color?: string;
  fontSize?: number;
  preset?: PresetConfig;
  style?: React.CSSProperties;
}

export const Sfx: React.FC<SfxProps> = ({
  text,
  delay = 0,
  duration = 25,
  color,
  fontSize = 72,
  preset = getPreset(),
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Hanya tampil dalam rentang delay sampai delay + duration
  if (frame < delay || frame > delay + duration) {
    return null;
  }

  const scale = popIn(frame, fps, delay, 10, 220);
  const rot = wobble(frame, delay, duration, 12, 0.4);
  const activeColor = color ?? preset.palette.accentYellow;

  return (
    <div
      style={{
        position: "absolute",
        transform: `scale(${scale}) rotate(${rot}deg)`,
        transformOrigin: "center center",
        fontFamily: preset.fonts.sfx,
        fontSize: `${fontSize}px`,
        fontWeight: 900,
        color: activeColor,
        WebkitTextStroke: `8px ${preset.palette.ink}`,
        paintOrder: "stroke fill",
        textShadow: "0 6px 0 #1E293B",
        letterSpacing: "2px",
        pointerEvents: "none",
        zIndex: 50,
        ...style,
      }}
    >
      {text.toUpperCase()}
    </div>
  );
};
