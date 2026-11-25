import type { PresetId } from "../presets";
import type {
  SceneKind,
  SceneTheme,
  SceneTransitionType,
  StagePropType,
  PropType,
  Expression,
  Pose,
  PropFocusMode,
  EyeTarget,
} from "../core/types";

export type {
  SceneKind,
  SceneTheme,
  SceneTransitionType,
  StagePropType,
  PropType,
  Expression,
  Pose,
  PropFocusMode,
  EyeTarget,
};

export interface Beat {
  headline: string; // INTERNAL ONLY - DILARANG DIRENDER DI LAYAR
  dialogue: string;
  expression: Expression;
  pose?: Pose;
  sfx?: string;
  sfxLabel?: string; // Teks komik onomatopoeia opsional (misal: "CRASH!", "ZAP!")
  activeWord?: string;
  prop?: string; // Legacy simple icon prop
  stageProp?: StagePropType; // Prop adegan interaktif multi-elemen
  propVariant?: string; // Sub-state animasi prop (misal: "running" | "crashing" | "taping")
  propFocus?: PropFocusMode; // "normal" | "co-push" (sama-sama maju) | "hero-pop" (maju lewati maskot)
  eyeTarget?: EyeTarget; // Opsional arah lirikan mata ("camera" | "prop" | "left" | "right")
  speechBubble?: string;
  durationInFrames?: number; // Durasi frame spesifik untuk beat ini
  // Koreografi blocking karakter
  charX?: number; // Offset horizontal dari tengah (-280 s/d +280)
  charY?: number; // Offset vertikal (negatif = naik / lompat)
  charScale?: number; // Skala karakter (default ~2.0)
  charFlip?: boolean; // Hadap kiri/kanan
  // Koreografi kamera dinamis per beat
  cameraZoom?: number; // 1.0 = wide, 1.15 = medium, 1.26 = punch close-up
  cameraPanX?: number; // Pan kamera horizontal
  cameraPanY?: number; // Pan kamera vertikal
  shakeIntensity?: number; // Intensitas getar kamera deterministik
}

export interface Scene {
  kind: SceneKind; // INTERNAL ONLY - DILARANG DIRENDER SEBAGAI BADGE
  theme?: SceneTheme;
  sceneTransition?: SceneTransitionType;
  beats: Beat[];
  durationInFrames: number;
}

export interface Fact {
  claim: string;
  source: string; // INTERNAL ONLY - WAJIB HTTPS:// - DILARANG DIRENDER SEBAGAI BADGE
  confidence: "verified" | "likely" | "uncertain"; // INTERNAL ONLY
}

export interface EpisodeThumbnailConfig {
  title: string;
  subtitle: string;
  floatingProps?: [PropType, PropType, PropType, PropType];
}

export interface EpisodeData {
  id: string;
  slug: string;
  title: string;
  preset?: PresetId;
  thumbnail?: EpisodeThumbnailConfig;
  facts: Fact[];
  scenes: Scene[];
  voiceoverSrc?: string;
  rmsFrames?: readonly number[]; // Amplitudo suara VO per frame (0-100) untuk lip-sync & HUD
}
