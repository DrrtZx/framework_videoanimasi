import { loadFont as loadFredoka } from "@remotion/google-fonts/Fredoka";
import { loadFont as loadPlusJakartaSans } from "@remotion/google-fonts/PlusJakartaSans";

export const fredokaFont = loadFredoka("normal", {
  weights: ["500", "600", "700"],
  subsets: ["latin"],
  ignoreTooManyRequestsWarning: true,
});

export const plusJakartaSansFont = loadPlusJakartaSans("normal", {
  weights: ["500", "600", "700", "800"],
  subsets: ["latin"],
  ignoreTooManyRequestsWarning: true,
});

export interface PresetFonts {
  title: string;
  caption: string;
  sfx: string;
  speechBubble: string;
  label: string;
}

export const FONTS: PresetFonts = {
  title: fredokaFont.fontFamily,
  caption: fredokaFont.fontFamily,
  sfx: fredokaFont.fontFamily,
  speechBubble: plusJakartaSansFont.fontFamily,
  label: plusJakartaSansFont.fontFamily,
} as const;
