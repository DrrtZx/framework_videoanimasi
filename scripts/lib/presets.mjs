import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const PRESETS_ROOT = path.resolve(process.cwd(), "src/presets");

/**
 * Mengembalikan seluruh manifest preset.json yang valid di src/presets/<id>/preset.json
 */
export function listPresetManifests() {
  if (!existsSync(PRESETS_ROOT)) {
    return [];
  }

  const entries = readdirSync(PRESETS_ROOT, { withFileTypes: true });
  const manifests = [];

  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith("_")) {
      continue;
    }
    const manifestPath = path.join(PRESETS_ROOT, entry.name, "preset.json");
    if (!existsSync(manifestPath)) {
      continue;
    }
    const raw = readFileSync(manifestPath, "utf8");
    manifests.push(JSON.parse(raw));
  }

  return manifests.sort((a, b) => a.id.localeCompare(b.id));
}

/**
 * Memuat manifest preset tertentu (default: "jokowo")
 */
export function loadPresetManifest(presetId = "jokowo", options = {}) {
  const { throwOnError = false } = options;
  const manifestPath = path.join(PRESETS_ROOT, presetId, "preset.json");

  if (!existsSync(manifestPath)) {
    const available = listPresetManifests().map((m) => m.id);
    const msg =
      `Preset '${presetId}' tidak ditemukan (${manifestPath}). ` +
      `Preset tersedia: ${available.length > 0 ? available.join(", ") : "(kosong)"}`;
    if (throwOnError) {
      throw new Error(msg);
    }
    console.error(`[presets] ERROR: ${msg}`);
    process.exit(1);
  }

  return JSON.parse(readFileSync(manifestPath, "utf8"));
}
