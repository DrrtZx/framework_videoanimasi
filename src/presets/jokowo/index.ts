import { FONTS } from "../../core/fonts";
import type { PropType } from "../../core/types";
import type { PresetConfig, PresetStageStyle } from "../types";
import type { SceneTheme } from "../../core/types";
import presetJson from "./preset.json";
import { Jokowo } from "./Mascot";
import { JOKOWO_THEMES } from "./themes";

const [prop1, prop2, prop3, prop4] = presetJson.branding.defaultShortsThumbnail
  .floatingProps as PropType[];

const defaultFloatingProps: [PropType, PropType, PropType, PropType] = [
  prop1,
  prop2,
  prop3,
  prop4,
];

export const jokowoPreset: PresetConfig = {
  id: presetJson.id,
  name: presetJson.name,
  concept: presetJson.concept,
  description: presetJson.description,
  outputDir: presetJson.outputDir,
  voDir: presetJson.voDir,
  stageStyle: presetJson.stageStyle as PresetStageStyle,
  defaultTheme: presetJson.defaultTheme as SceneTheme,
  Mascot: Jokowo,
  palette: presetJson.palette,
  fonts: FONTS,
  themes: JOKOWO_THEMES,
  caption: presetJson.caption,
  mascotLayout: presetJson.mascotLayout,
  audio: presetJson.audio,
  branding: {
    ...presetJson.branding,
    defaultShortsThumbnail: {
      title: presetJson.branding.defaultShortsThumbnail.title,
      subtitle: presetJson.branding.defaultShortsThumbnail.subtitle,
      floatingProps: defaultFloatingProps,
    },
  },
};
