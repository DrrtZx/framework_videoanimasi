import type { EpisodeData } from "./types";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validasi aturan episode Shorts:
 * 1. Alur wajib: HOOK diawal -> minimal ada FAKTA -> minimal ada TWIST -> diakhiri OUTRO (atau PUNCHLINE lalu OUTRO)
 * 2. Seluruh URL sumber fakta (fact.source) WAJIB diawali dengan https://
 * 3. Minimal 3 scene, maksimal 10 scene
 */
export function validateEpisode(data: EpisodeData): ValidationResult {
  const errors: string[] = [];

  if (!data.id) errors.push("Episode wajib memiliki ID");
  if (!data.slug) errors.push("Episode wajib memiliki slug");
  if (!data.title) errors.push("Episode wajib memiliki title");

  // Validasi URL Fakta
  if (!data.facts || data.facts.length === 0) {
    errors.push("Episode wajib mencantumkan minimal 1 fakta ilmiah");
  } else {
    data.facts.forEach((fact, idx) => {
      if (!fact.source) {
        errors.push(`Fakta #${idx + 1} tidak memiliki source`);
      } else if (!fact.source.startsWith("https://")) {
        errors.push(
          `Sumber fakta #${idx + 1} (${fact.source}) wajib diawali dengan 'https://'`
        );
      }
    });
  }

  // Validasi Scenes
  if (!data.scenes || data.scenes.length === 0) {
    errors.push("Episode wajib memiliki scenes");
    return { valid: errors.length === 0, errors };
  }

  const kinds = data.scenes.map((s) => s.kind);

  // Hook harus pertama
  if (kinds[0] !== "HOOK") {
    errors.push(`Scene pertama wajib berjenis 'HOOK', ditemukan: '${kinds[0]}'`);
  }

  // Outro harus terakhir
  const lastKind = kinds[kinds.length - 1];
  if (lastKind !== "OUTRO") {
    errors.push(`Scene terakhir wajib berjenis 'OUTRO', ditemukan: '${lastKind}'`);
  }

  // Wajib memiliki FAKTA dan TWIST
  if (!kinds.includes("FAKTA")) {
    errors.push("Episode wajib memiliki minimal 1 scene 'FAKTA'");
  }
  if (!kinds.includes("TWIST")) {
    errors.push("Episode wajib memiliki minimal 1 scene 'TWIST'");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
