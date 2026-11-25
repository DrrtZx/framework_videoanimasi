import { DEFAULT_PRESET_ID } from "../presets";
import type { EpisodeData } from "./types";
import type { LongEpisodeData } from "./long-types";
import { episodeCpuIgpuVsNonIgpu } from "./jokowo/shorts/cpu-igpu-vs-non-igpu/episode";
import { episodeAsalUsulBug } from "./jokowo/shorts/asal-usul-bug/episode";
import { sampleShortsEpisode } from "./jokowo/shorts/sample-shorts";
import { sampleLongEpisode } from "./jokowo/long/sample-long";

export const SHORTS_EPISODES: readonly EpisodeData[] = [
  episodeCpuIgpuVsNonIgpu,
  episodeAsalUsulBug,
  sampleShortsEpisode,
];

export const LONG_EPISODES: readonly LongEpisodeData[] = [sampleLongEpisode];

export const ACTIVE_SHORTS_EPISODE = episodeCpuIgpuVsNonIgpu;
export const ACTIVE_LONG_EPISODE = sampleLongEpisode;

export function getShortsEpisodesByPreset(presetId: string): EpisodeData[] {
  return SHORTS_EPISODES.filter(
    (ep) => (ep.preset ?? DEFAULT_PRESET_ID) === presetId
  );
}

export function getLongEpisodesByPreset(presetId: string): LongEpisodeData[] {
  return LONG_EPISODES.filter(
    (ep) => (ep.preset ?? DEFAULT_PRESET_ID) === presetId
  );
}

export function findShortsEpisode(
  presetId: string,
  slug: string
): EpisodeData | undefined {
  return getShortsEpisodesByPreset(presetId).find((ep) => ep.slug === slug);
}

export function findLongEpisode(
  presetId: string,
  slug: string
): LongEpisodeData | undefined {
  return getLongEpisodesByPreset(presetId).find((ep) => ep.slug === slug);
}
