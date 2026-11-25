export {
  PROJECT_NAME,
  SHORTS_CONFIG,
  LONG_CONFIG,
  STROKE_WIDTH,
  CAPTION_CONFIG,
  AUDIO_LEVELS,
} from "./core/config";

import { jokowoPreset } from "./presets/jokowo";

export const PALETTE = {
  ...jokowoPreset.palette,
  charSkin: "#FBBF24",
  charSkinDark: "#F59E0B",
  charHair: "#0F172A",
  charShirt: "#FFFFFF",
  charPants: "#0F172A",
  charShoes: "#334155",
} as const;
