#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { loadPresetManifest } from "./lib/presets.mjs";

function parseArgs(rawArgs) {
  let preset = "";
  let episode = "";
  let type = "shorts";
  const positional = [];

  for (const arg of rawArgs) {
    if (arg.startsWith("--preset=")) {
      preset = arg.replace("--preset=", "").trim().toLowerCase();
    } else if (arg.startsWith("--episode=")) {
      episode = arg.replace("--episode=", "").trim();
    } else if (arg.startsWith("--type=")) {
      type = arg.replace("--type=", "").trim().toLowerCase();
    } else {
      positional.push(arg);
    }
  }

  if (episode) {
    const activePreset = preset || "jokowo";
    const manifest = loadPresetManifest(activePreset);
    const voDir = manifest.voDir || `public/audio/vo/${activePreset}`;
    const preferredWav = `${voDir}/${episode}-vo.wav`;
    const fallbackWav = `${voDir}/${episode}.wav`;
    const wavRel = fs.existsSync(path.resolve(process.cwd(), preferredWav))
      ? preferredWav
      : fallbackWav;

    const cleanExport = `${episode
      .replace(/[^a-zA-Z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .toUpperCase()}_RMS`;

    return {
      wavArg: fs.existsSync(path.resolve(process.cwd(), wavRel)) ? wavRel : preferredWav,
      outArg: `src/episodes/${activePreset}/${type}/${episode}/rms.ts`,
      exportName: positional[0] || cleanExport,
    };
  }

  return {
    wavArg: positional[0] || "public/audio/vo/jokowo/asal-usul-bug-vo.wav",
    outArg: positional[1] || "src/episodes/jokowo/shorts/asal-usul-bug/rms.ts",
    exportName: positional[2] || "ASAL_USUL_BUG_RMS",
  };
}

const { wavArg, outArg, exportName } = parseArgs(process.argv.slice(2));

const wavPath = path.resolve(process.cwd(), wavArg);
const outPath = path.resolve(process.cwd(), outArg);

if (!fs.existsSync(wavPath)) {
  console.error(`[extract-rms] ERROR: File WAV tidak ditemukan: ${wavPath}`);
  process.exit(1);
}

const buf = fs.readFileSync(wavPath);
let dataOffset = 44;
for (let i = 0; i < Math.min(buf.length - 8, 256); i++) {
  if (buf[i] === 0x64 && buf[i + 1] === 0x61 && buf[i + 2] === 0x74 && buf[i + 3] === 0x61) {
    dataOffset = i + 8;
    break;
  }
}

const sampleRate = 44100;
const fps = 30;
const samplesPerFrame = Math.floor(sampleRate / fps); // 1470
const totalSamples = Math.floor((buf.length - dataOffset) / 2);
const totalFrames = Math.ceil(totalSamples / samplesPerFrame);

const rawRms = [];
let maxRms = 0.001;

for (let f = 0; f < totalFrames; f++) {
  const start = f * samplesPerFrame;
  const end = Math.min(totalSamples, start + samplesPerFrame);
  let sumSq = 0;
  let count = 0;
  for (let s = start; s < end; s++) {
    const val = buf.readInt16LE(dataOffset + s * 2) / 32768.0;
    sumSq += val * val;
    count++;
  }
  const rms = count > 0 ? Math.sqrt(sumSq / count) : 0;
  rawRms.push(rms);
  if (rms > maxRms) maxRms = rms;
}

// Normalize to 0..100 with noise gate below 0.025 and slight boost for expressive cartoon mouth
const normalized = rawRms.map((r) => {
  if (r < 0.025) return 0;
  const norm = Math.min(1, r / (maxRms * 0.65));
  return Math.round(norm * 100);
});

fs.mkdirSync(path.dirname(outPath), { recursive: true });

const tsContent = `// Auto-generated 30fps normalized RMS amplitude (0-100) from ${wavArg}
// Used for deterministic frame-accurate lip-sync and audio-reactive HUD animation.
export const ${exportName}: readonly number[] = [
${normalized.join(",")}
];
`;

fs.writeFileSync(outPath, tsContent, "utf8");
console.log(`Generated ${normalized.length} RMS frames -> ${outPath} (export: ${exportName})`);
console.log(`Active speech frames: ${normalized.filter((v) => v > 0).length} / ${normalized.length}`);
