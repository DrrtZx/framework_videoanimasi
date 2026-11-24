import { staticFile } from "remotion";

export type SfxKey =
  | "whoosh"
  | "pop"
  | "bloop"
  | "boing"
  | "swish"
  | "ding"
  | "duar"
  | "radar"
  | "giggle"
  | "yeay"
  | "footstep"
  | "stinger";

export const SFX_MAP: Record<SfxKey, string> = {
  whoosh: "audio/sfx/whoosh.wav",
  pop: "audio/sfx/pop.wav",
  bloop: "audio/sfx/bloop.wav",
  boing: "audio/sfx/boing.wav",
  swish: "audio/sfx/swish.wav",
  ding: "audio/sfx/ding.wav",
  duar: "audio/sfx/duar.wav",
  radar: "audio/sfx/radar.wav",
  giggle: "audio/sfx/giggle.wav",
  yeay: "audio/sfx/yeay.wav",
  footstep: "audio/sfx/footstep.wav",
  stinger: "audio/sfx/stinger.wav",
};

/**
 * Mendapatkan URL/path statis SFX berdasarkan kata kunci
 */
export function getSfxStaticPath(cue: string): string {
  const normalized = cue.toLowerCase().trim().replace(/[!?.#]/g, "");

  // Pencocokan langsung
  if (normalized in SFX_MAP) {
    return staticFile(SFX_MAP[normalized as SfxKey]);
  }

  // Pencocokan fuzzy / substring
  if (normalized.includes("pop") || normalized.includes("klik")) {
    return staticFile(SFX_MAP.pop);
  }
  if (normalized.includes("duar") || normalized.includes("boom") || normalized.includes("ledakan")) {
    return staticFile(SFX_MAP.duar);
  }
  if (normalized.includes("whoosh") || normalized.includes("wush") || normalized.includes("cepat")) {
    return staticFile(SFX_MAP.whoosh);
  }
  if (normalized.includes("ding") || normalized.includes("tring") || normalized.includes("benar")) {
    return staticFile(SFX_MAP.ding);
  }
  if (normalized.includes("boing") || normalized.includes("pantul") || normalized.includes("kaget")) {
    return staticFile(SFX_MAP.boing);
  }
  if (normalized.includes("yeay") || normalized.includes("hore") || normalized.includes("sukses")) {
    return staticFile(SFX_MAP.yeay);
  }
  if (normalized.includes("tawa") || normalized.includes("giggle") || normalized.includes("lucu")) {
    return staticFile(SFX_MAP.giggle);
  }
  if (normalized.includes("shock") || normalized.includes("stinger") || normalized.includes("jeng")) {
    return staticFile(SFX_MAP.stinger);
  }

  // Fallback default
  return staticFile(SFX_MAP.pop);
}

/**
 * Daftar semua SFX yang valid
 */
export const AVAILABLE_SFX_KEYS = Object.keys(SFX_MAP) as SfxKey[];
