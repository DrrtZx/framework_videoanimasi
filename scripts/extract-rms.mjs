import fs from "node:fs";
import path from "node:path";

const wavArg = process.argv[2] || "public/audio/vo/asal-usul-bug-vo.wav";
const outArg = process.argv[3] || "src/episodes/asal-usul-bug-rms.ts";
const exportName = process.argv[4] || "ASAL_USUL_BUG_RMS";

const wavPath = path.resolve(process.cwd(), wavArg);
const outPath = path.resolve(process.cwd(), outArg);

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
  const norm = Math.min(1, (r / (maxRms * 0.65)));
  return Math.round(norm * 100);
});

const tsContent = `// Auto-generated 30fps normalized RMS amplitude (0-100) from ${wavArg}
// Used for deterministic frame-accurate lip-sync and audio-reactive HUD animation.
export const ${exportName}: readonly number[] = [
${normalized.join(",")}
];
`;

fs.writeFileSync(outPath, tsContent, "utf8");
console.log(`Generated ${normalized.length} RMS frames -> ${outPath}`);
console.log(`Active speech frames: ${normalized.filter((v) => v > 0).length} / ${normalized.length}`);
