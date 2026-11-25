import type React from "react";

export type SceneKind = "HOOK" | "FAKTA" | "TWIST" | "PUNCHLINE" | "OUTRO";

export type SceneTheme =
  | "cyber-blueprint"
  | "cyber-crash"
  | "vintage-1947"
  | "spotlight-twist"
  | "archive-paper"
  | "edison-1878"
  | "neon-coder";

export type SceneTransitionType =
  | "none"
  | "slide-left"
  | "zoom-burst"
  | "shutter"
  | "flash";

export type StagePropType =
  | "app-crash"
  | "bug-radar"
  | "calendar-1947"
  | "harvard-mark2"
  | "hopper-inspect"
  | "relay-moth-trap"
  | "logbook-tape"
  | "debugging-globe"
  | "time-rewind"
  | "edison-1878"
  | "vs-compare"
  | "ram-mosquito"
  | "cta-comment"
  | "pc-no-signal"
  | "cpu-igpu-office"
  | "cpu-f-disabled"
  | "igpu-two-secrets"
  | "cpu-vs-cta";

export type PropType =
  | "book"
  | "magnifier"
  | "lightbulb"
  | "star"
  | "arrow"
  | "question-mark"
  | "flask"
  | "atom"
  | "moth"
  | "relay"
  | "cpu"
  | "gpu";

export type Expression =
  | "neutral"
  | "curious"
  | "shocked"
  | "laughing"
  | "storytelling"
  | "amused";

export type Pose =
  | "idle"
  | "talking"
  | "pointing"
  | "thinking"
  | "walking"
  | "celebrating";

export type PropFocusMode = "normal" | "co-push" | "hero-pop";

export type EyeTarget = "camera" | "prop" | "left" | "right";

export interface MascotProps {
  pose?: Pose;
  prevPose?: Pose;
  poseTransitionProgress?: number; // 0..1 interpolasi halus antar-pose
  expression?: Expression;
  eyeTarget?: EyeTarget;
  mouthOpen?: number; // 0.0 (tutup) s/d 1.0 (buka penuh)
  scale?: number;
  flip?: boolean;
  showShadow?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export type MascotComponent = React.FC<MascotProps>;
