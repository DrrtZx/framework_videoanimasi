import type { MascotComponent, PropType, SceneTheme } from "../core/types";
import type { PresetFonts } from "../core/fonts";

export type PresetStageStyle = "clean-studio" | "blueprint" | "clean-grid" | "minimal";

export interface PresetPalette {
  bg: string;
  bgLight: string;
  bgCenter: string;
  bgOuter: string;
  gridMajor: string;
  gridMinor: string;
  ink: string;
  blueprintCyan: string;
  accentBlue: string;
  accentPurple: string;
  accentYellow: string;
  accentGreen: string;
  white: string;
  captionText: string;
  captionActive: string;
  captionStroke: string;
}

export interface PresetThemeStyle {
  bgCenter: string;
  bgMid: string;
  bgOuter: string;
  gridMinor: string;
  gridMajor: string;
  accent: string;
  accentAlt: string;
  floorTop: string;
  floorBottom: string;
  particleColor: string;
}

export interface PresetCaptionConfig {
  shorts: {
    bottom: number;
    fontSize: number;
    maxWords: number;
    strokeWidth: number;
  };
  long: {
    bottom: number;
    fontSize: number;
    maxWords: number;
    strokeWidth: number;
  };
}

export interface PresetMascotLayout {
  shortsBottom: number;
  shortsDefaultScale: number;
  longRight: number;
  longBottom: number;
  longDefaultScale: number;
  thumbnailShortsScale: number;
  thumbnailLongScale: number;
  bannerScale: number;
  avatarScale: number;
}

export interface PresetAudioLevels {
  vo: number;
  sfx: number;
  bgmNormal: number;
  bgmDucked: number;
}

export interface PresetAudioConfig {
  bgmSrc: string;
  voiceEqName: string;
  voiceEqFilter: string;
  levels: PresetAudioLevels;
}

export interface PresetBrandingConfig {
  channelName: string;
  tagline: string;
  kicker: string;
  coordLabel: string;
  footerKeywords: string;
  defaultShortsThumbnail: {
    title: string;
    subtitle: string;
    floatingProps: [PropType, PropType, PropType, PropType];
  };
  defaultLongThumbnail: {
    title: string;
    badge: string;
  };
  defaultShortsHashtags: string[];
  defaultLongHashtags: string[];
}

export interface PresetConfig {
  id: string;
  name: string;
  concept: string;
  description: string;
  outputDir: string;
  voDir: string;
  stageStyle: PresetStageStyle;
  defaultTheme: SceneTheme;
  Mascot: MascotComponent;
  palette: PresetPalette;
  fonts: PresetFonts;
  themes: Record<SceneTheme, PresetThemeStyle>;
  caption: PresetCaptionConfig;
  mascotLayout: PresetMascotLayout;
  audio: PresetAudioConfig;
  branding: PresetBrandingConfig;
}
