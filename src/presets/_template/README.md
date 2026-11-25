# Panduan Membuat Preset Maskot Baru

Setiap preset mendefinisikan **1 Maskot + 1 Konsep Panggung + 1 Identitas Channel & Output Folder Terpisah** (`out/<preset-id>/`).

---

## Cara Cepat (Otomatis via CLI)

Jalankan perintah berikut dari root repositori:

```bash
npm run preset:new -- <preset-id> --name="Nama Maskot" --channel="NAMA CHANNEL" --concept="Konsep Visual"
```

Contoh:
```bash
npm run preset:new -- cyber-cat --name="Kucing Cyber" --channel="MEONG SAINS" --concept="Neon Pixel Lab"
```

Skrip akan membuat:
- `src/presets/<preset-id>/preset.json` — Konfigurasi palet warna, layout maskot, filter EQ/BGM audio, branding channel, dan path output (`out/<preset-id>`, `public/audio/vo/<preset-id>`).
- `src/presets/<preset-id>/themes.ts` — Variasi tema panggung per scene (`SceneTheme`).
- `src/presets/<preset-id>/Mascot.tsx` — Komponen karakter SVG berartikulasi yang memenuhi kontrak `MascotProps` (`pose`, `expression`, `mouthOpen`, `scale`, `flip`, `showShadow`).
- `src/presets/<preset-id>/index.ts` — Menggabungkan JSON manifest + tema + font + `Mascot` menjadi `PresetConfig`.
- `src/presets/<preset-id>/CHARACTER-SHEET.md` — Dokumentasi identitas visual & proporsi karakter.
- `src/episodes/<preset-id>/shorts/` & `src/episodes/<preset-id>/long/` — Folder episode khusus preset tersebut.

---

## Registrasi Preset di `src/presets/index.ts`

Setelah folder preset dibuat, daftarkan ke `src/presets/index.ts`:

```ts
import { cyberCatPreset } from "./cyber-cat";

export const PRESETS = {
  jokowo: jokowoPreset,
  "cyber-cat": cyberCatPreset,
} as const satisfies Record<string, PresetConfig>;
```

Semua komposisi Remotion (`<Folder name="<preset-id>">`), thumbnail, banner, avatar, validasi episode, serta skrip audio & render otomatis mengenali preset baru!

---

## Cara Pakai Saat Produksi Video

```bash
# 1. Lihat seluruh preset terdaftar
npm run preset:list

# 2. Mastering Voice-Over sesuai preset
node scripts/master-vo.mjs out/<preset-id>/shorts/<slug>/voiceover.mp3 <slug>-vo.wav --preset=<preset-id>

# 3. Ekstrak RMS lip-sync 30fps
node scripts/extract-rms.mjs --preset=<preset-id> --episode=<slug> --type=shorts

# 4. Render Video Shorts / Long / Branding Asset sesuai preset
npm run render -- --preset=<preset-id> --type=shorts --episode=<slug>
npm run render -- --preset=<preset-id> --type=long --episode=<slug>
npm run render -- --preset=<preset-id> --type=branding
```
