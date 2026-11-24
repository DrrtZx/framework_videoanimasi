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
  speechBubble?: string;
  durationInFrames?: number; // Durasi frame spesifik untuk beat ini
  // Koreografi blocking karakter Jokowo
  charX?: number; // Offset horizontal dari tengah (-280 s/d +280)
  charY?: number; // Offset vertikal (negatif = naik / lompat)
  charScale?: number; // Skala karakter (default ~2.05)
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

export interface EpisodeData {
  id: string;
  slug: string;
  title: string;
  facts: Fact[];
  scenes: Scene[];
  voiceoverSrc?: string;
  rmsFrames?: readonly number[]; // Amplitudo suara VO per frame (0-100) untuk lip-sync & HUD
}
