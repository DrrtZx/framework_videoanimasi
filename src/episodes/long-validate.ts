import type { LongEpisodeData } from "./long-types";
import type { ValidationResult } from "./validate";

/**
 * Validasi Long Video (16:9):
 * 1. Jumlah chapter wajib antara 5 sampai 8 chapter
 * 2. Chapter pertama wajib berjenis 'INTRO'
 * 3. Chapter terakhir wajib berjenis 'OUTRO'
 * 4. Durasi total wajib antara 4 sampai 8 menit (7200 sampai 14400 frames @ 30fps)
 * 5. Seluruh URL fakta wajib diawali 'https://'
 */
export function validateLongEpisode(data: LongEpisodeData): ValidationResult {
  const errors: string[] = [];

  if (!data.id) errors.push("Long episode wajib memiliki ID");
  if (!data.slug) errors.push("Long episode wajib memiliki slug");
  if (!data.title) errors.push("Long episode wajib memiliki title");

  // Validasi Fakta
  if (!data.facts || data.facts.length === 0) {
    errors.push("Long episode wajib mencantumkan minimal 1 fakta ilmiah");
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

  // Validasi Chapters
  if (!data.chapters || data.chapters.length === 0) {
    errors.push("Long episode wajib memiliki chapters");
    return { valid: errors.length === 0, errors };
  }

  if (data.chapters.length < 5 || data.chapters.length > 8) {
    errors.push(
      `Jumlah chapter wajib antara 5 sampai 8, ditemukan: ${data.chapters.length}`
    );
  }

  const firstKind = data.chapters[0].kind;
  if (firstKind !== "INTRO") {
    errors.push(`Chapter pertama wajib berjenis 'INTRO', ditemukan: '${firstKind}'`);
  }

  const lastKind = data.chapters[data.chapters.length - 1].kind;
  if (lastKind !== "OUTRO") {
    errors.push(`Chapter terakhir wajib berjenis 'OUTRO', ditemukan: '${lastKind}'`);
  }

  // Validasi Durasi (4-8 menit @ 30fps -> 7200-14400 frames)
  const totalFrames = data.chapters.reduce(
    (acc, ch) => acc + (ch.durationInFrames || 0),
    0
  );
  if (totalFrames < 7200 || totalFrames > 14400) {
    errors.push(
      `Durasi total (${totalFrames} frame / ${(totalFrames / 1800).toFixed(
        2
      )} menit) harus berada di rentang 4-8 menit (7200-14400 frame)`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
