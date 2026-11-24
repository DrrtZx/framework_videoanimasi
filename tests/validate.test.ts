import { describe, it, expect } from "vitest";
import { validateEpisode } from "../src/episodes/validate";
import { validateLongEpisode } from "../src/episodes/long-validate";
import { sampleShortsEpisode } from "../src/episodes/sample-shorts";
import { episodeAsalUsulBug } from "../src/episodes/episode-asal-usul-bug";
import { episodeCpuIgpuVsNonIgpu } from "../src/episodes/episode-cpu-igpu-vs-non-igpu";
import { sampleLongEpisode } from "../src/episodes/sample-long";
import type { EpisodeData } from "../src/episodes/types";
import type { LongEpisodeData } from "../src/episodes/long-types";

describe("Validasi Episode Shorts", () => {
  it("harus meloloskan sampleShortsEpisode", () => {
    const res = validateEpisode(sampleShortsEpisode);
    expect(res.valid).toBe(true);
    expect(res.errors).toHaveLength(0);
  });

  it("harus meloloskan episodeAsalUsulBug", () => {
    const res = validateEpisode(episodeAsalUsulBug);
    expect(res.valid).toBe(true);
    expect(res.errors).toHaveLength(0);
  });

  it("harus meloloskan episodeCpuIgpuVsNonIgpu dengan durasi beat sinkron", () => {
    const res = validateEpisode(episodeCpuIgpuVsNonIgpu);
    expect(res.valid).toBe(true);
    expect(res.errors).toHaveLength(0);
    episodeCpuIgpuVsNonIgpu.scenes.forEach((sc) => {
      const beatSum = sc.beats.reduce((acc, b) => acc + (b.durationInFrames ?? 0), 0);
      expect(beatSum).toBe(sc.durationInFrames);
    });
  });

  it("harus menolak jika scene pertama bukan HOOK", () => {
    const invalid: EpisodeData = {
      ...sampleShortsEpisode,
      scenes: [
        { ...sampleShortsEpisode.scenes[1], kind: "FAKTA" },
        ...sampleShortsEpisode.scenes.slice(1),
      ],
    };
    const res = validateEpisode(invalid);
    expect(res.valid).toBe(false);
    expect(res.errors.some((e) => e.includes("HOOK"))).toBe(true);
  });

  it("harus menolak jika scene terakhir bukan OUTRO", () => {
    const invalid: EpisodeData = {
      ...sampleShortsEpisode,
      scenes: [
        ...sampleShortsEpisode.scenes.slice(0, -1),
        { ...sampleShortsEpisode.scenes[0], kind: "HOOK" },
      ],
    };
    const res = validateEpisode(invalid);
    expect(res.valid).toBe(false);
    expect(res.errors.some((e) => e.includes("OUTRO"))).toBe(true);
  });

  it("harus menolak jika sumber fakta bukan https://", () => {
    const invalid: EpisodeData = {
      ...sampleShortsEpisode,
      facts: [
        {
          claim: "Uji coba",
          source: "http://sumber-tidak-aman.com",
          confidence: "verified",
        },
      ],
    };
    const res = validateEpisode(invalid);
    expect(res.valid).toBe(false);
    expect(res.errors.some((e) => e.includes("https://"))).toBe(true);
  });
});

describe("Validasi Long Episode (16:9)", () => {
  it("harus meloloskan sampleLongEpisode", () => {
    const res = validateLongEpisode(sampleLongEpisode);
    expect(res.valid).toBe(true);
    expect(res.errors).toHaveLength(0);
  });

  it("harus menolak jika chapter kurang dari 5", () => {
    const invalid: LongEpisodeData = {
      ...sampleLongEpisode,
      chapters: sampleLongEpisode.chapters.slice(0, 4),
    };
    const res = validateLongEpisode(invalid);
    expect(res.valid).toBe(false);
    expect(res.errors.some((e) => e.includes("antara 5 sampai 8"))).toBe(true);
  });

  it("harus menolak jika durasi kurang dari 4 menit (7200 frame)", () => {
    const invalid: LongEpisodeData = {
      ...sampleLongEpisode,
      chapters: sampleLongEpisode.chapters.map((ch) => ({
        ...ch,
        durationInFrames: 300, // total 1500 frame
      })),
    };
    const res = validateLongEpisode(invalid);
    expect(res.valid).toBe(false);
    expect(res.errors.some((e) => e.includes("7200-14400"))).toBe(true);
  });

  it("harus menolak jika chapter pertama bukan INTRO", () => {
    const invalid: LongEpisodeData = {
      ...sampleLongEpisode,
      chapters: [
        { ...sampleLongEpisode.chapters[1], kind: "CHAPTER" },
        ...sampleLongEpisode.chapters.slice(1),
      ],
    };
    const res = validateLongEpisode(invalid);
    expect(res.valid).toBe(false);
    expect(res.errors.some((e) => e.includes("INTRO"))).toBe(true);
  });
});
