import type { PresetId } from "../presets";
import type { Expression, Pose, Fact } from "./types";

export type ChapterKind =
  | "INTRO"
  | "CHAPTER"
  | "INTERLUDE"
  | "CLIMAX"
  | "OUTRO";

export interface DiagramData {
  type: "bar" | "pie" | "flow" | "comparison";
  title?: string;
  labels: string[];
  values: number[];
}

export interface LongBeat {
  headline: string; // INTERNAL ONLY - DILARANG DIRENDER DI LAYAR LONG VIDEO
  narration: string;
  expression: Expression;
  pose?: Pose;
  sfx?: string;
  activeWord?: string;
  prop?: string;
  speechBubble?: string;
  diagram?: DiagramData;
}

export interface Chapter {
  kind: ChapterKind;
  title: string;
  beats: LongBeat[];
  durationInFrames: number;
}

export interface LongEpisodeThumbnailConfig {
  title: string;
  badge: string;
}

export interface LongEpisodeData {
  id: string;
  slug: string;
  title: string;
  preset?: PresetId;
  thumbnail?: LongEpisodeThumbnailConfig;
  facts: Fact[];
  chapters: Chapter[];
  voiceoverSrc?: string;
}
