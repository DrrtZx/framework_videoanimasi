#!/usr/bin/env node
import { existsSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
import path from "node:path";
import os from "node:os";
import { execSync, execFileSync } from "node:child_process";
import ffmpegPath from "ffmpeg-static";
import { loadPresetManifest } from "./lib/presets.mjs";

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    preset: "jokowo",
    type: "shorts", // "shorts" | "long" | "branding"
    episode: "cpu-igpu-vs-non-igpu",
    composition: "",
    thumbComposition: "",
  };

  for (const arg of args) {
    if (arg.startsWith("--preset=")) {
      options.preset = arg.replace("--preset=", "").trim().toLowerCase();
    } else if (arg.startsWith("--type=")) {
      options.type = arg.replace("--type=", "").trim().toLowerCase();
    } else if (arg.startsWith("--episode=")) {
      options.episode = arg.replace("--episode=", "").trim();
    } else if (arg.startsWith("--composition=")) {
      options.composition = arg.replace("--composition=", "").trim();
    } else if (arg.startsWith("--thumb-composition=")) {
      options.thumbComposition = arg.replace("--thumb-composition=", "").trim();
    }
  }

  return options;
}

function isLegacyMacOS() {
  if (os.platform() !== "darwin") return false;
  const releaseMajor = parseInt(os.release().split(".")[0], 10);
  return releaseMajor < 24;
}

function buildDefaultPublikasi(manifest, slug, isLong) {
  const mascotName = manifest.name || manifest.id;
  const channelName = manifest.branding?.channelName || "FAKTA STUDIO";

  if (isLong) {
    const tags = (manifest.branding?.defaultLongHashtags || ["#Edukasi", "#Sains", "#Teknologi"])
      .filter((t) => t.toLowerCase() !== "#shorts")
      .slice(0, 3)
      .join(" ");

    return `# PUBLIKASI LONG VIDEO (${mascotName}): ${slug}

> **Preset**: \`${manifest.id}\` (${manifest.concept})
> **Channel**: ${channelName}
> **Format**: YouTube Long Video (16:9, 1920×1080 @ 30fps)

---

## 1. Judul Long Video Utama + Alternatif (45–65 karakter, Tanpa Hashtag)
1. Rahasia di Balik ${slug}: Penjelasan Lengkap Bersama ${mascotName}
2. Mengapa ${slug} Terjadi? Fakta dan Cara Kerjanya
3. Mengupas Tuntas ${slug} dari Nol Sampai Akhir

---

## 2. Deskripsi Lengkap SEO Long Video (Siap Copy-Paste)

\`\`\`text
Penjelasan lengkap tentang ${slug} bersama ${mascotName} di ${channelName}. Membedah cara kerja, bukti, dan kesalahpahaman yang sering terjadi.

Poin pembahasan:
- Latar belakang & fenomena utama ${slug}
- Cara kerja & mekanisme di baliknya
- Fakta mengejutkan dan kesimpulan praktis

Chapter:
00:00 - Pembukaan & Paradoks Awal
01:10 - Babak 1: Dasar Fakta & Bukti
02:35 - Babak 2: Eksplorasi Mendalam
04:15 - Babak 3: Patahan Twist
05:40 - Intisari & Penutup Bersama ${mascotName}

Sumber Referensi Terverifikasi:
- https://science.org

Menurut kamu fakta mana yang paling bikin kaget? Tulis di komentar!

${tags}
\`\`\`
`;
  }

  const shortsTags = (manifest.branding?.defaultShortsHashtags || ["#edukasi", "#faktaunik", "#shorts"])
    .slice(0, 6)
    .join(" ");

  return `# PUBLIKASI SHORTS (${mascotName}): ${slug}

> **Preset**: \`${manifest.id}\` (${manifest.concept})
> **Channel**: ${channelName}
> **Format**: YouTube Shorts (9:16, 1080×1920 @ 30fps)

---

## 1. Judul YT Shorts Utama + Alternatif
1. Fakta Menarik Soal ${slug} #shorts
2. Masih Banyak yang Salah Soal ${slug}? Ini Penjelasannya!
3. Ternyata Begini Cara Kerja ${slug}!

---

## 2. Deskripsi YT Shorts Siap Copy-Paste (Ringkas & Bebas Link Mati)

\`\`\`text
Banyak yang belum tahu fakta di balik ${slug}! Bareng ${mascotName}, kita bongkar mekanisme aslinya secara ringkas dan jelas.

Dari fakta awal yang sering bikin salah paham, sampai alasan teknis di baliknya.

Kamu tim yang baru tahu atau sudah paham dari lama? Tulis di komentar! 👇

${shortsTags}
\`\`\`

---

## 3. Sumber & Referensi Riset (Arsip Internal)
- https://science.org
`;
}

function main() {
  const opts = parseArgs();
  if (!["shorts", "long", "branding"].includes(opts.type)) {
    console.error(`[render] ERROR: --type harus bernilai shorts, long, atau branding (diterima: '${opts.type}')`);
    process.exit(1);
  }

  const manifest = loadPresetManifest(opts.preset);
  const presetRootOut = path.resolve(process.cwd(), manifest.outputDir || path.join("out", opts.preset));

  console.log("=================================================");
  console.log("🎬 FAKTA STUDIO - MULTI-PRESET RENDER PIPELINE");
  console.log(`Preset         : ${manifest.id} (${manifest.name} — ${manifest.concept})`);
  console.log(`Format         : ${opts.type.toUpperCase()}`);

  if (opts.type === "branding") {
    const brandingDir = path.join(presetRootOut, "branding");
    mkdirSync(brandingDir, { recursive: true });
    const bannerComp = `${opts.preset}-banner`;
    const avatarComp = `${opts.preset}-avatar`;
    const bannerOut = path.join(brandingDir, "banner.png");
    const avatarOut = path.join(brandingDir, "avatar.png");

    console.log(`Output Dir     : ${brandingDir}`);
    console.log("=================================================");

    try {
      console.log(`\n[1/2] Merender banner (${bannerComp})...`);
      execSync(`npx remotion still ${bannerComp} "${bannerOut}"`, { stdio: "inherit" });
      console.log(`✅ Banner tersimpan: ${bannerOut}`);

      console.log(`\n[2/2] Merender avatar (${avatarComp})...`);
      execSync(`npx remotion still ${avatarComp} "${avatarOut}"`, { stdio: "inherit" });
      console.log(`✅ Avatar tersimpan: ${avatarOut}`);
    } catch (err) {
      console.error("❌ Render branding gagal:", err.message);
      process.exit(1);
    }

    console.log("\n🎉 RENDER BRANDING PRESET SELESAI!");
    return;
  }

  const isLong = opts.type === "long";
  const slug = opts.episode;
  const outputBaseDir = path.join(presetRootOut, isLong ? "long" : "shorts", slug);
  mkdirSync(outputBaseDir, { recursive: true });

  const compositionId =
    opts.composition || `${opts.preset}-${isLong ? "long" : "shorts"}-${slug}`;
  const thumbComp =
    opts.thumbComposition || `${opts.preset}-${isLong ? "long" : "shorts"}-thumbnail`;

  const videoOutPath = path.join(outputBaseDir, "video.mp4");
  const thumbOutPath = path.join(outputBaseDir, "thumbnail.png");
  const pubOutPath = path.join(outputBaseDir, "publikasi.md");

  console.log(`Episode Slug   : ${slug}`);
  console.log(`Composition    : ${compositionId}`);
  console.log(`Thumbnail Comp : ${thumbComp}`);
  console.log(`Output Dir     : ${outputBaseDir}`);
  console.log("=================================================");

  const legacyMac = isLegacyMacOS();
  if (legacyMac) {
    console.log("⚠️ Deteksi macOS < 15: Mengaktifkan fallback JPEG Sequence + FFmpeg stitch!");
  }

  // 1. Render Video
  console.log(`\n[1/3] Merender video (${compositionId})...`);
  try {
    if (!legacyMac) {
      const cmd = `npx remotion render ${compositionId} "${videoOutPath}" --codec=h264 --pixel-format=yuv420p --crf=18`;
      console.log(`Menjalankan: ${cmd}`);
      execSync(cmd, { stdio: "inherit" });
    } else {
      const seqDir = path.join(outputBaseDir, "frames");
      if (!existsSync(seqDir)) mkdirSync(seqDir, { recursive: true });
      const seqCmd = `npx remotion render ${compositionId} "${seqDir}" --sequence --image-format=jpeg`;
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
  console.log(`\n[2/3] Merender thumbnail (${thumbComp})...`);
  try {
    const thumbCmd = `npx remotion still ${thumbComp} "${thumbOutPath}"`;
    console.log(`Menjalankan: ${thumbCmd}`);
    execSync(thumbCmd, { stdio: "inherit" });
    console.log(`✅ Thumbnail berhasil dibuat: ${thumbOutPath}`);
  } catch (err) {
    console.error("❌ Render thumbnail gagal:", err.message);
  }

  // 3. Generate / Pertahankan publikasi.md
  console.log(`\n[3/3] Menyinkronkan publikasi.md...`);
  try {
    let pubContent = "";
    if (existsSync(pubOutPath)) {
      pubContent = readFileSync(pubOutPath, "utf8");
    }
    if (!pubContent) {
      pubContent = buildDefaultPublikasi(manifest, slug, isLong);
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
