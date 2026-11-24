# framework_videoanimasi

Studio Animasi Video Edukasi Otomatis berbasis **Remotion + React 19 + TypeScript + SVG + FFmpeg** untuk produksi **YouTube Shorts (9:16)** dan **Long Video YouTube (16:9)** dengan alur kerja **Voice-First**.

## Fitur Utama

- **Base Art Style DNA**: *Tech Blueprint & Cyber Lab* dengan dukungan **multi-tema panggung dinamis** (`cyber-blueprint`, `cyber-crash`, `vintage-1947`, `spotlight-twist`, `archive-paper`, `edison-1878`, `neon-coder`) dan transisi sinematik non-fade (`slide-left`, `zoom-burst`, `shutter`, `flash`).
- **Karakter Modular SVG (`Jokowo`)**: 6 pose terartikulasi (`idle`, `talking`, `pointing`, `thinking`, `walking`, `celebrating`), ekspresi wajah lengkap, kedipan mata alami deterministik, blocking posisi aktif, serta **lip-sync RMS 30fps** dari audio master WAV.
- **Properti Adegan Interaktif (`StageProp.tsx`)**: Ilustrasi multi-elemen beranimasi penuh yang memerankan langsung setiap kalimat narasi.
- **Audio Pipeline Presisi**: Warm Bass EQ mastering (`scripts/master-vo.mjs`), 12 SFX prosedural + BGM loop (`scripts/generate-sfx.mjs`), penjadwalan SFX `<Sequence>` per frame, serta auto-ducking BGM untuk Long Video.
- **Aset Branding YouTube**: Komposisi bawaan untuk Thumbnail Shorts (`1080×1920`), Thumbnail Long (`1280×720`), Channel Banner (`2560×1440`), dan Profile Avatar (`1080×1080`).

## Instalasi & Perintah Utama

```bash
# 1. Install dependencies
npm install

# 2. Generate SFX & BGM prosedural
npm run generate:sfx

# 3. Jalankan preview Remotion Studio
npm run dev

# 4. Quality Gates (Unit Test & ESLint)
npm test
npm run lint

# 5. Mastering Voice-Over (Warm Bass EQ)
node scripts/master-vo.mjs <path-ke-audio> <nama-output.wav>

# 6. Render Video Final & Thumbnail
npm run render -- --type=shorts --episode=<slug>
npm run render -- --type=long --episode=<slug>
```

## Dokumentasi & Aturan Kerja

- [AGENTS.md](./AGENTS.md) — Aturan kerja permanen & alur 2-tahap (Voice-First Workflow).
- [docs/CHARACTER-SHEET.md](./docs/CHARACTER-SHEET.md) — Standar proporsi & referensi karakter `Jokowo`.
- [docs/LONG-VIDEO-RULES.md](./docs/LONG-VIDEO-RULES.md) — Pedoman produksi Long Video 16:9.
- [.agents/skills/fakta-motion/SKILL.md](./.agents/skills/fakta-motion/SKILL.md) — Standar penyutradaraan motion graphic anti-PPT.
