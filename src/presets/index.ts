import type { PresetConfig } from "./types";
import { jokowoPreset } from "./jokowo";

export const PRESETS = {
  jokowo: jokowoPreset,
} as const satisfies Record<string, PresetConfig>;

export type PresetId = keyof typeof PRESETS;

export const DEFAULT_PRESET_ID: PresetId = "jokowo";

export function isValidPresetId(id: string): id is PresetId {
  return Object.prototype.hasOwnProperty.call(PRESETS, id);
}

export function resolvePreset(
  id?: string,
  registry: Record<string, PresetConfig> = PRESETS,
  fallbackId: string = DEFAULT_PRESET_ID
): PresetConfig {
  if (id && Object.prototype.hasOwnProperty.call(registry, id)) {
    return registry[id];
  }
  if (Object.prototype.hasOwnProperty.call(registry, fallbackId)) {
    return registry[fallbackId];
  }
  const first = Object.values(registry)[0];
  if (!first) {
    throw new Error("Registry preset kosong");
  }
  return first;
}

export function getPreset(id?: string): PresetConfig {
  return resolvePreset(id, PRESETS, DEFAULT_PRESET_ID);
}

export function listPresets(): PresetConfig[] {
  return Object.values(PRESETS);
}
