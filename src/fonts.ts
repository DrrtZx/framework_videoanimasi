import { loadFont as loadFredoka } from "@remotion/google-fonts/Fredoka";
import { loadFont as loadPlusJakartaSans } from "@remotion/google-fonts/PlusJakartaSans";

export const fredokaFont = loadFredoka("normal", {
  ignoreTooManyRequestsWarning: true,
});

export const plusJakartaSansFont = loadPlusJakartaSans("normal", {
  ignoreTooManyRequestsWarning: true,
});

export const FONTS = {
  title: fredokaFont.fontFamily,
  caption: fredokaFont.fontFamily,
  sfx: fredokaFont.fontFamily,
  speechBubble: plusJakartaSansFont.fontFamily,
  label: plusJakartaSansFont.fontFamily,
} as const;
