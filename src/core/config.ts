export const PROJECT_NAME = "fakta-studio-demo";

export const SHORTS_CONFIG = {
  width: 1080,
  height: 1920,
  fps: 30,
} as const;

export const LONG_CONFIG = {
  width: 1920,
  height: 1080,
  fps: 30,
} as const;

export const STROKE_WIDTH = {
  thick: 4,
  standard: 3,
  thin: 2,
} as const;

export const CAPTION_CONFIG = {
  shorts: {
    bottom: 380,
    fontSize: 58,
    maxWords: 4,
    strokeWidth: 12,
  },
  long: {
    bottom: 110,
    fontSize: 50,
    maxWords: 6,
    strokeWidth: 12,
  },
} as const;

export const AUDIO_LEVELS = {
  vo: 1.0, // 100%
  sfx: 0.4, // 35-45%
  bgmNormal: 0.12, // 10-15%
  bgmDucked: 0.04, // Auto-ducking level saat suara narator aktif
} as const;
