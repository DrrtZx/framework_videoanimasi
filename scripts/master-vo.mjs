#!/usr/bin/env node
import { existsSync, mkdirSync, renameSync, unlinkSync } from "node:fs";
import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import ffmpegPath from "ffmpeg-static";
import { loadPresetManifest } from "./lib/presets.mjs";

const DEFAULT_WARM_BASS_FILTER =
  "highpass=f=75," +
  "equalizer=f=135:t=q:w=1.1:g=5.0," +
  "equalizer=f=240:t=q:w=1.2:g=2.5," +
  "equalizer=f=3200:t=q:w=1.4:g=-3.5," +
  "equalizer=f=5500:t=q:w=1.5:g=-3.0," +
  "acompressor=threshold=-18dB:ratio=3:attack=10:release=100," +
  "loudnorm=I=-16:TP=-1.5:LRA=11";

function resolveFfmpegBin() {
  if (typeof ffmpegPath === "string" && existsSync(ffmpegPath)) {
    return ffmpegPath;
  }
  return "ffmpeg";
}

function parseCliArgs(rawArgs) {
  let presetId = "jokowo";
  const positional = [];

  for (const arg of rawArgs) {
    if (arg.startsWith("--preset=")) {
      presetId = arg.replace("--preset=", "").trim().toLowerCase() || "jokowo";
    } else {
      positional.push(arg);
    }
  }

  return {
    presetId,
    inputArg: positional[0],
    outputArg: positional[1],
  };
}

function main() {
  const { presetId, inputArg, outputArg } = parseCliArgs(process.argv.slice(2));
  const manifest = loadPresetManifest(presetId);
  const outDir = path.resolve(
    process.cwd(),
    manifest.voDir || path.join("public/audio/vo", presetId)
  );
  const eqName = manifest.audio?.voiceEqName || "Warm Bass EQ";
  const eqFilter = manifest.audio?.voiceEqFilter || DEFAULT_WARM_BASS_FILTER;

  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }

  if (!inputArg) {
    console.log("Usage: node scripts/master-vo.mjs <input-audio-file> [output-filename.wav] [--preset=<id>]");
    console.log(`Contoh: node scripts/master-vo.mjs out/${presetId}/shorts/episode-baru/voiceover.mp3 episode-baru-vo.wav --preset=${presetId}`);
    console.log(`[master-vo] Preset aktif: ${manifest.id} (${eqName})`);
    console.log(`[master-vo] Direktori target siap: ${outDir}`);
    return;
  }

  const inputPath = path.resolve(process.cwd(), inputArg);
  if (!existsSync(inputPath)) {
    console.error(`[master-vo] ERROR: File input tidak ditemukan: ${inputPath}`);
    process.exit(1);
  }

  const baseName =
    outputArg || `${path.basename(inputPath, path.extname(inputPath))}-mastered.wav`;
  const outputPath = path.join(outDir, baseName.endsWith(".wav") ? baseName : `${baseName}.wav`);
  const samePath =
    process.platform === "win32"
      ? inputPath.toLowerCase() === outputPath.toLowerCase()
      : inputPath === outputPath;
  const tempOutputPath = `${outputPath}.tmp.wav`;
  const targetWritePath = samePath ? tempOutputPath : outputPath;
  const ffmpegBin = resolveFfmpegBin();

  console.log(`[master-vo] Preset : ${manifest.id} (${eqName})`);
  console.log(`[master-vo] Input  : ${inputPath}`);
  console.log(`[master-vo] Output : ${outputPath}`);
  console.log(`[master-vo] Menerapkan ${eqName} chain...`);

  try {
    const ffmpegArgs = [
      "-y",
      "-i",
      inputPath,
      "-af",
      eqFilter,
      "-ar",
      "44100",
      "-ac",
      "1",
      "-c:a",
      "pcm_s16le",
      targetWritePath,
    ];

    execFileSync(ffmpegBin, ffmpegArgs, { stdio: "inherit" });
    if (samePath) {
      renameSync(tempOutputPath, outputPath);
    }
    console.log(`[master-vo] BERHASIL! Audio master disimpan di: ${outputPath}`);

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
    const detectResult = spawnSync(ffmpegBin, detectArgs, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    if (detectResult.error) {
      throw detectResult.error;
    }
    if (detectResult.status !== 0) {
      throw new Error(
        `silencedetect keluar dengan kode ${detectResult.status}: ${detectResult.stderr || ""}`
      );
    }

    const detectOutput = `${detectResult.stdout ?? ""}\n${detectResult.stderr ?? ""}`;
    const silenceLines = detectOutput
      .split(/[\r\n]+/)
      .filter((l) => l.includes("silence_start") || l.includes("silence_end"))
      .map((l) => l.trim());
    console.log(`[master-vo] Analisis keheningan selesai (${silenceLines.length} baris):`);
    console.log(silenceLines.join("\n") || "Tidak ada hening panjang terdeteksi.");
  } catch (error) {
    if (samePath && existsSync(tempOutputPath)) {
      try {
        unlinkSync(tempOutputPath);
      } catch {
        // Abaikan kegagalan pembersihan file sementara
      }
    }
    console.error("[master-vo] Gagal memproses audio:", error.message);
    process.exit(1);
  }
}

main();
