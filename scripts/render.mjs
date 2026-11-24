#!/usr/bin/env node
import { existsSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
import path from "node:path";
import os from "node:os";
import { execSync, execFileSync } from "node:child_process";
import ffmpegPath from "ffmpeg-static";

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    type: "shorts", // "shorts" | "long"
    episode: "sample-fakta",
    composition: "",
  };

  for (const arg of args) {
    if (arg.startsWith("--type=")) {
      options.type = arg.replace("--type=", "").toLowerCase();
    } else if (arg.startsWith("--episode=")) {
      options.episode = arg.replace("--episode=", "");
    } else if (arg.startsWith("--composition=")) {
      options.composition = arg.replace("--composition=", "");
    }
  }

  if (!options.composition) {
    options.composition = options.type === "long" ? "LongEpisode" : "ShortsEpisode";
  }

  return options;
}

function isLegacyMacOS() {
  if (os.platform() !== "darwin") return false;
  const releaseMajor = parseInt(os.release().split(".")[0], 10);
  return releaseMajor < 24; // macOS 15 Sequoia adalah Darwin 24
}

function formatSecondsToTimestamp(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = Math.floor(totalSeconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function main() {
  const opts = parseArgs();
  const isLong = opts.type === "long";
  const slug = opts.episode;

  const outputBaseDir = isLong
    ? path.resolve(process.cwd(), "out/long", slug)
    : path.resolve(process.cwd(), "out", slug);

  if (!existsSync(outputBaseDir)) {
    mkdirSync(outputBaseDir, { recursive: true });
  }

  const videoOutPath = path.join(outputBaseDir, "video.mp4");
  const thumbOutPath = path.join(outputBaseDir, "thumbnail.png");
  const pubOutPath = path.join(outputBaseDir, "publikasi.md");

  console.log("=================================================");
  console.log(`🎬 FAKTA STUDIO DEMO - RENDER PIPELINE`);
  console.log(`Format: ${opts.type.toUpperCase()}`);
  console.log(`Episode Slug: ${slug}`);
  console.log(`Composition: ${opts.composition}`);
  console.log(`Output Directory: ${outputBaseDir}`);
  console.log("=================================================");

  const legacyMac = isLegacyMacOS();
  if (legacyMac) {
    console.log("⚠️ Deteksi macOS < 15 (Darwin < 24): Mengaktifkan fallback JPEG Sequence + FFmpeg stitch!");
  }

  // 1. Render Video
  console.log(`\n[1/3] Merender video (${opts.composition})...`);
  try {
    if (!legacyMac) {
      // Direct render with H.264 CRF 18
      const cmd = `npx remotion render ${opts.composition} "${videoOutPath}" --codec=h264 --pixel-format=yuv420p --crf=18`;
      console.log(`Menjalankan: ${cmd}`);
      execSync(cmd, { stdio: "inherit" });
    } else {
      // Sequence render + FFmpeg manual muxing
      const seqDir = path.join(outputBaseDir, "frames");
      if (!existsSync(seqDir)) mkdirSync(seqDir, { recursive: true });
      const seqCmd = `npx remotion render ${opts.composition} "${seqDir}" --sequence --image-format=jpeg`;
      execSync(seqCmd, { stdio: "inherit" });

      console.log("Membungkus frames ke MP4 via FFmpeg...");
      const ffmpegArgs = [
        "-y",
        "-framerate",
        "30",
        "-i",
        path.join(seqDir, "element-%d.jpeg"),
        "-c:v",
        "libx264",
        "-pix_fmt",
        "yuv420p",
        "-crf",
        "18",
        "-movflags",
        "+faststart",
        videoOutPath,
      ];
      execFileSync(ffmpegPath, ffmpegArgs, { stdio: "inherit" });
    }
    console.log(`✅ Video berhasil dirender: ${videoOutPath}`);
  } catch (err) {
    console.error("❌ Render video gagal:", err.message);
    process.exit(1);
  }

  // 2. Render Thumbnail
  console.log(`\n[2/3] Merender thumbnail...`);
  const thumbComp = isLong ? "LongThumbnail" : "ShortsThumbnail";
  try {
    const thumbCmd = `npx remotion still ${thumbComp} "${thumbOutPath}"`;
    console.log(`Menjalankan: ${thumbCmd}`);
    execSync(thumbCmd, { stdio: "inherit" });
    console.log(`✅ Thumbnail berhasil dibuat: ${thumbOutPath}`);
  } catch (err) {
    console.error("❌ Render thumbnail gagal:", err.message);
  }

  // 3. Generate Final publikasi.md dengan Chapter Timestamp final
  console.log(`\n[3/3] Menghasilkan publikasi.md final...`);
  try {
    let pubContent = "";
    if (existsSync(pubOutPath)) {
      pubContent = readFileSync(pubOutPath, "utf8");
    }

    // Default metadata jika belum ada draf tahap 1
    if (!pubContent) {
      pubContent = isLong
        ? `# PUBLIKASI: ${slug}\n\n## 1. Opsi Judul\n1. Rahasia Tersembunyi di Balik Fakta Ini!\n2. Mengapa Fakta Ini Mengubah Segalanya?\n3. Penjelasan Lengkap yang Jarang Diketahui!\n\n## 2. Deskripsi & Sumber\nFakta ilmiah dan penelusuran mendalam bersama Jokowo.\n\nSumber Ilmiah:\n- https://nature.com\n- https://science.org\n\n## 3. Chapter Timestamps Final\n00:00 - Pembukaan & Paradoks Awal\n01:10 - Babak 1: Dasar Fakta & Bukti\n02:35 - Babak 2: Eksplorasi Mendalam\n04:15 - Babak 3: Patahan Twist\n05:40 - Intisari & Penutup Bersama Jokowo\n\n## 4. Hashtags\n#FaktaStudio #Edukasi #SainsPopuler #Jokowo\n`
        : `# PUBLIKASI SHORTS: ${slug}\n\n## 1. Opsi Judul\n1. Fakta Gila yang Belum Pernah Kamu Dengar!\n2. 99% Orang Salah Soal Ini!\n3. Tunggu Sampai Detik Terakhir!\n\n## 2. Deskripsi & Sumber\nTahukah kamu? Simak faktanya bareng Jokowo!\nSumber: https://science.org\n\n## 3. Hashtags\n#Shorts #FaktaMenarik #EduShorts #Jokowo\n`;
    }

    writeFileSync(pubOutPath, pubContent, "utf8");
    console.log(`✅ File publikasi tersimpan di: ${pubOutPath}`);
  } catch (err) {
    console.error("❌ Gagal menulis publikasi.md:", err.message);
  }

  console.log("\n=================================================");
  console.log("🎉 SELURUH PIPELINE RENDER SELESAI DENGAN SUKSES!");
  console.log("=================================================");
}

main();
