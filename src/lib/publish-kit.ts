export interface ChapterInfo {
  title: string;
  durationInFrames: number;
}

export interface PublishMetadataInput {
  slug: string;
  titles: [string, string, string];
  description: string;
  sources: string[];
  hashtags: string[];
  scriptVoiceover: string;
  scriptPerScene?: { label: string; text: string }[];
  chapters?: ChapterInfo[];
  fps?: number;
  isLongVideo?: boolean;
}

/**
 * Format detik ke format menit:detik YouTube (MM:SS atau HH:MM:SS)
 */
export function formatFrameToTimestamp(frame: number, fps: number = 30): string {
  const totalSeconds = Math.floor(frame / fps);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");

  if (hours > 0) {
    return `${hours}:${mm}:${ss}`;
  }
  return `${mm}:${ss}`;
}

/**
 * Menghasilkan daftar Chapter Timestamp YouTube dari durasi frame chapter
 */
export function generateChapterTimestamps(
  chapters: ChapterInfo[],
  fps: number = 30
): string[] {
  let currentFrame = 0;
  return chapters.map((ch, idx) => {
    // YouTube wajib mulai chapter pertama di 00:00
    const ts = idx === 0 ? "00:00" : formatFrameToTimestamp(currentFrame, fps);
    currentFrame += ch.durationInFrames;
    return `${ts} - ${ch.title}`;
  });
}

/**
 * Generator isi dokumen publikasi.md terstandarisasi untuk Tahap 1 & Tahap 2
 */
export function generatePublikasiMarkdown(input: PublishMetadataInput): string {
  const fps = input.fps ?? 30;
  const isLong = Boolean(input.isLongVideo);

  let chapterSection = "";
  if (isLong && input.chapters && input.chapters.length > 0) {
    const timestamps = generateChapterTimestamps(input.chapters, fps);
    chapterSection = `## 3. Chapter Timestamps YouTube (Final)
\`\`\`text
${timestamps.join("\n")}
\`\`\`
`;
  }

  const sourcesList = input.sources
    .map((src) => `- ${src}`)
    .join("\n");

  const hashtagsStr = input.hashtags
    .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`))
    .join(" ");

  let perSceneSection = "";
  if (input.scriptPerScene && input.scriptPerScene.length > 0) {
    const lines = input.scriptPerScene.map(
      (s) => `### ${s.label}\n> ${s.text}\n`
    );
    perSceneSection = `## 5. Naskah per Scene/Chapter\n${lines.join("\n")}`;
  }

  return `# DOKUMEN PUBLIKASI: ${input.slug}
Format: ${isLong ? "YouTube Long Video (16:9)" : "YouTube Shorts (9:16)"}

---

## 1. Tiga Opsi Judul
1. ${input.titles[0]}
2. ${input.titles[1]}
3. ${input.titles[2]}

---

## 2. Deskripsi & Sumber Ilmiah Terverifikasi
${input.description}

### Sumber Ilmiah Terverifikasi:
${sourcesList}

---

${chapterSection ? `${chapterSection}\n---` : ""}

## 4. Hashtags
${hashtagsStr}

---

## 5. Naskah Voice-Over Siap Salin ElevenLabs
> *Rekomendasi Settings ElevenLabs:*
> - Model: **Eleven Multilingual v2**
> - Stability: **35% – 45%** (Ekspresif & dinamis untuk kartun)
> - Similarity: **75% – 85%**
> - Style Exaggeration: **15% – 25%**

\`\`\`text
${input.scriptVoiceover.replace(/<[^>]+>/g, "").replace(/\s{2,}/g, " ").trim()}
\`\`\`

---

${perSceneSection}

`;
}
