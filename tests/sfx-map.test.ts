import { describe, it, expect } from "vitest";
import { SFX_MAP, getSfxStaticPath, AVAILABLE_SFX_KEYS } from "../src/lib/sfx-events";

describe("SFX Events Mapping", () => {
  it("wajib memiliki minimal 12 sound effects prosedural", () => {
    expect(AVAILABLE_SFX_KEYS.length).toBeGreaterThanOrEqual(12);

    const requiredKeys = [
      "whoosh",
      "pop",
      "bloop",
      "boing",
      "swish",
      "ding",
      "duar",
      "radar",
      "giggle",
      "yeay",
      "footstep",
      "stinger",
    ];

    requiredKeys.forEach((key) => {
      expect(SFX_MAP).toHaveProperty(key);
      expect(SFX_MAP[key as keyof typeof SFX_MAP]).toMatch(/^audio\/sfx\/.+\.wav$/);
    });
  });

  it("getSfxStaticPath harus mengembalikan path file yang benar untuk kata kunci", () => {
    const whooshPath = getSfxStaticPath("whoosh");
    expect(whooshPath).toContain("whoosh.wav");

    const popPath = getSfxStaticPath("pop!");
    expect(popPath).toContain("pop.wav");

    const duarPath = getSfxStaticPath("DUAR!!");
    expect(duarPath).toContain("duar.wav");
  });

  it("getSfxStaticPath harus mengembalikan fallback untuk cue yang tidak dikenal", () => {
    const unknownPath = getSfxStaticPath("suara_aneh_tak_dikenal");
    expect(unknownPath).toContain("pop.wav");
  });
});
