#!/usr/bin/env node
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import ffmpegPath from "ffmpeg-static";

/**
 * Filter Chain Warm Bass EQ:
 * highpass=f=75,equalizer=f=135:t=q:w=1.1:g=5.0,equalizer=f=240:t=q:w=1.2:g=2.5,equalizer=f=3200:t=q:w=1.4:g=-3.5,equalizer=f=5500:t=q:w=1.5:g=-3.0,acompressor=threshold=-18dB:ratio=3:attack=10:release=100,loudnorm=I=-16:TP=-1.5:LRA=11
 */
const WARM_BASS_FILTER =
  "highpass=f=75," +
  "equalizer=f=135:t=q:w=1.1:g=5.0," +
  "equalizer=f=240:t=q:w=1.2:g=2.5," +
  "equalizer=f=3200:t=q:w=1.4:g=-3.5," +
  "equalizer=f=5500:t=q:w=1.5:g=-3.0," +
  "acompressor=threshold=-18dB:ratio=3:attack=10:release=100," +
  "loudnorm=I=-16:TP=-1.5:LRA=11";

function main() {
  const args = process.argv.slice(2);
  const inputArg = args[0];

  if (!inputArg) {
    console.log("Usage: node scripts/master-vo.mjs <input-audio-file> [output-filename.wav]");
    console.log("Contoh: node scripts/master-vo.mjs out/kopi-luwak/voiceover.mp3");
    console.log("Defaulting to sample check...");
  }

  const outDir = path.resolve(process.cwd(), "public/audio/vo");
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }

  if (!inputArg) {
    console.log(`[master-vo] Menyiapkan direktori target: ${outDir}`);
    console.log("[master-vo] Siap memproses audio saat file dikirimkan pengguna.");
    return;
  }

  const inputPath = path.resolve(process.cwd(), inputArg);
  if (!existsSync(inputPath)) {
    console.error(`[master-vo] ERROR: File input tidak ditemukan: ${inputPath}`);
    process.exit(1);
  }

  const baseName = args[1] || `${path.basename(inputPath, path.extname(inputPath))}-mastered.wav`;
  const outputPath = path.join(outDir, baseName.endsWith(".wav") ? baseName : `${baseName}.wav`);

  console.log(`[master-vo] Memproses: ${inputPath}`);
  console.log(`[master-vo] Output: ${outputPath}`);
  console.log(`[master-vo] Menerapkan Warm Bass EQ chain...`);

  try {
    const ffmpegArgs = [
      "-y",
      "-i",
      inputPath,
      "-af",
      WARM_BASS_FILTER,
      "-ar",
      "44100",
      "-ac",
      "1",
      "-c:a",
      "pcm_s16le",
      outputPath,
    ];

    execFileSync(ffmpegPath, ffmpegArgs, { stdio: "inherit" });
    console.log(`[master-vo] BERHASIL! Audio master disimpan di: ${outputPath}`);

    // Jalankan silencedetect untuk informasi sinkronisasi
    console.log(`[master-vo] Menganalisis jeda bicara (silencedetect)...`);
    const detectArgs = [
      "-i",
      outputPath,
      "-af",
      "silencedetect=noise=-30dB:d=0.3",
      "-f",
      "null",
      "-",
    ];
    const detectOutput = execFileSync(ffmpegPath, detectArgs, { encoding: "utf8" });
    console.log("[master-vo] Analisis keheningan selesai:");
    const silenceLines = detectOutput
      .split("\n")
      .filter((l) => l.includes("silence_start") || l.includes("silence_end"));
    console.log(silenceLines.slice(0, 10).join("\n") || "Tidak ada hening panjang terdeteksi.");
  } catch (error) {
    console.error("[master-vo] Gagal memproses audio:", error.message);
    process.exit(1);
  }
}

main();
