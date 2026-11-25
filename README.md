# framework_videoanimasi

Studio Animasi Video Edukasi Multi-Preset berbasis **Remotion + React 19 + TypeScript + SVG + FFmpeg** untuk produksi **YouTube Shorts (9:16)** dan **Long Video YouTube (16:9)** dengan alur kerja **Voice-First**.

## Arsitektur Multi-Preset Maskot

Setiap maskot dan konsep channel dikemas dalam folder preset terisolasi di `src/presets/<preset-id>/`, sehingga memanggil `--preset=<id>` otomatis mengganti **Maskot SVG**, **palet warna**, **tema panggung**, **konfigurasi audio**, **branding channel**, dan **folder output (`out/<preset-id>/`)**:

```text
src/
├── core/                         # Engine bersama (config, fonts, shared types)
├── presets/
│   ├── index.ts                  # Registry & resolver getPreset(id)
│   ├── types.ts                  # Kontrak PresetConfig
│   ├── _template/                # Panduan membuat preset baru
│   └── jokowo/                   # Preset #1: Jokowo (Tech Blueprint & Cyber Lab)
│       ├── preset.json
│       ├── Mascot.tsx
│       ├── themes.ts
│       ├── CHARACTER-SHEET.md
│       └── index.ts
├── episodes/
│   ├── registry.ts               # Katalog episode terindeks per preset
│   └── jokowo/                   # Episode khusus preset jokowo
│       ├── shorts/
│       └── long/
└── components/                   # Renderer netral preset (Episode, Scene, Caption, Banner, Avatar)

public/audio/vo/<preset>/         # Master WAV VO per preset
out/<preset>/
├── shorts/<slug>/                # video.mp4, thumbnail.png, publikasi.md
├── long/<slug>/                  # video.mp4, thumbnail.png, publikasi.md
└── branding/                     # banner.png & avatar.png per preset
```

## Fitur Utama

- **Multi-Preset Maskot Modular (`src/presets/`)**: Pindah maskot, tema warna, font, profil EQ, dan branding channel cukup lewat `--preset=<id>` atau field `preset` pada data episode.
- **Preset `#1: jokowo` (Tech Blueprint & Cyber Lab)**: 7 tema panggung dinamis (`cyber-blueprint`, `cyber-crash`, `vintage-1947`, `spotlight-twist`, `archive-paper`, `edison-1878`, `neon-coder`) dengan transisi non-fade (`slide-left`, `zoom-burst`, `shutter`, `flash`).
- **Rig SVG Ekspresif + Lip-Sync RMS 30fps**: 6 pose (`idle`, `talking`, `pointing`, `thinking`, `walking`, `celebrating`), 6 ekspresi, kedipan mata deterministik, blocking posisi aktif, serta sinkronisasi bibir dari energi WAV 30fps.
- **Audio Pipeline Presisi**: EQ mastering per preset (`scripts/master-vo.mjs`), 12 SFX prosedural (`scripts/generate-sfx.mjs`), penjadwalan `<Sequence>` per frame, dan auto-ducking BGM untuk Long Video.
- **Aset Branding Otomatis per Preset**: Thumbnail Shorts (`1080×1920`), Thumbnail Long (`1280×720`), Channel Banner (`2560×1440`), dan Profile Avatar (`1080×1080`).

## Instalasi & Perintah Utama

```bash
# 1. Install dependencies & generate SFX
npm install
npm run generate:sfx

# 2. Lihat atau buat preset maskot baru
npm run preset:list
npm run preset:new -- <preset-id> --name="Nama Maskot" --channel="NAMA CHANNEL" --concept="Konsep"

# 3. Preview di Remotion Studio
npm run dev

# 4. Quality Gates (TypeScript, Unit Test & ESLint)
npx tsc --noEmit && npm test && npm run lint

# 5. Tahap 2 Produksi Audio (Mastering VO & Ekstrak RMS 30fps)
node scripts/master-vo.mjs out/<preset>/shorts/<slug>/voiceover.mp3 <slug>-vo.wav --preset=<preset>
node scripts/extract-rms.mjs --preset=<preset> --episode=<slug> --type=shorts

# 6. Render Final per Preset (Shorts / Long / Branding Banner+Avatar)
npm run render -- --preset=<preset> --type=shorts --episode=<slug>
npm run render -- --preset=<preset> --type=long --episode=<slug>
npm run render -- --preset=<preset> --type=branding
```

## Dokumentasi & Aturan Kerja

- [AGENTS.md](./AGENTS.md) — Aturan kerja permanen, standar multi-preset, dan alur 2-tahap (Voice-First Workflow).
- [src/presets/jokowo/CHARACTER-SHEET.md](./src/presets/jokowo/CHARACTER-SHEET.md) — Standar proporsi & referensi karakter `Jokowo`.
- [src/presets/_template/README.md](./src/presets/_template/README.md) — Panduan membuat preset maskot baru.
- [docs/LONG-VIDEO-RULES.md](./docs/LONG-VIDEO-RULES.md) — Pedoman produksi Long Video 16:9.
- [.agents/skills/fakta-motion/SKILL.md](./.agents/skills/fakta-motion/SKILL.md) — Standar penyutradaraan motion graphic anti-PPT.
