# Analisa Cara Pembawaan & Produksi Video — Batch 01

Dokumen ini mensintesis teknik penyampaian narasi (*storytelling & delivery*) serta produksi visual/audio dari 5 video referensi ([01](../analisa-video/01-kamar-kos-3x3.md) s/d [05](../analisa-video/05-lubang-tanah-kolam-renang.md)), lalu memetakannya langsung ke komponen kode `fakta-studio-demo`.

---

## 1. Perbandingan Gaya Pembawaan Dua Format Utama

Dari batch pertama terlihat dua pendekatan yang sangat mirip DNA-nya namun berbeda panjang durasi:

| Aspek | Format Padat (~41 detik) — `Zona Gimana?` (Video 01) | Format "Bongkar Dari Nol" (119–180 detik) — `akutahu_id` (Video 02–05) |
|---|---|---|
| **Durasi & Panjang Naskah** | ~41 detik (~112 kata) | 119–180 detik (~280–430 kata) |
| **Struktur Inti** | Pertanyaan → Jawaban cepat (detik 9) → Perluasan ekosistem → Joke relatable → Loop | Hook simulasi → Siklus berulang *(Masalah → Solusi → Istilah → Masalah baru)* → Recap → Reframing → End-card CTA |
| **Ganti Babak Visual** | Setiap **1.5–2.5 detik** ada objek/label baru muncul | Setiap **2–4 detik** ada aksi 3D atau ikon/callout baru |
| **Kelebihan Utama** | *Completion rate* tinggi, mudah di-loop, cocok untuk Shorts < 60 detik | Penonton merasa benar-benar paham mekanisme teknik kompleks tanpa terasa digurui |
| **Risiko yang Terlihat** | Terbatas untuk topik yang punya >5 sub-sistem mekanis | Jika mendekati batas keras 180 detik, ujung kalimat bisa terpotong (terjadi di Video 02!) |

---

## 2. Tujuh Teknik Pembawaan yang Terbukti Efektif

### A. Metode "Build-From-Zero" dengan Orang Kedua (`Kamu`)
Narator tidak berkata *"Tower crane terdiri dari mast, jib, dan counterweight."* Melainkan mengajak penonton **membangunnya bersama-sama**:
- *"Mulai dari satu kamar..."* (`01`)
- *"Kalau kamu ikat batu pakai tali..."* (`02`)
- *"Jadi anjungannya kamu apungin..."* (`03`)
- *"Jadi di atas kolam kamu pasang pengaduk..."* (`04`)
- *"Jadi kamu bikin kerangka besi di sekeliling lubangnya..."* (`05`)

Setiap komponen hanya hadir karena **ada masalah sebelumnya yang memaksa kita menciptakannya**.

### B. Rantai Kausalitas "Tapi / Masalahnya → Jadi → Ini Namanya"
Hampir semua transisi antar-beat menggunakan 3 kata penghubung sederhana:
1. **Patahan Masalah**: `"Tapi..."` / `"Masalahnya..."` / `"Eh..."`
2. **Aksi Solusi**: `"Jadi kamu..."`
3. **Penamaan Resmi**: `"Ini namanya [istilah]"` (istilah teknis selalu muncul **di belakang** setelah fungsinya dipahami, tidak pernah di depan).

### C. Analogi "Explain Like I'm 5" dengan Benda Rumah Tangga
Konsep rekayasa atau fisika berat selalu diterjemahkan menjadi benda yang langsung terbayang dalam 1 detik:
- Resonansi gelombang laut → *"jembatan gantung yang diinjak barisan tentara kompak"* (`03`)
- Piston hidrolik *tensioner* → *"joran pancing yang ngelentur pas ikan narik"* (`03`)
- Pembekuan lilin minyak mentah → *"minyak kelapa yang jadi putih kalau kena dingin"* (`03`)
- Defleksi menara *crane* → *"melengkung ditiup angin kayak batang bambu"* (`02`)
- Momen beban tidak seimbang → *"oleng kayak jungkat-jungkit yang cuma diduduki satu orang"* (`02`)

### D. Visualisasi Sifat Fisik Lewat Aksi Ringan (Show, Don't Explain)
- Kerak kotoran keras → bola jatuh memantul di atas kerak (`04`).
- Beton kasar bikin kulit lecet → bola pantai memantul lalu meletus kempes (`05`).
- Biaya operasional tinggi → struk tagihan yang angkanya terus berputar naik ke warna merah (`04`: `Rp 18.750.000`, `05`: `Rp 1.384.559`).

### E. Micro-Humor di Tengah Penjelasan Serius
Ke-5 video menjaga suasana tetap ringan lewat selipan kecil:
- Tawa singkat narator (`heh`) saat pekerja menarik balok baja pakai tangan atau saat dahan patah (`02`), atau saat membahas pohon natal di dasar laut (`03`).
- Detail jenaka: `kamar 6: nunggak` (`01`), emoji wajah mual saat gas kandang keluar (`04`), pipis di kolam (`05`).

### F. Penanda Waktu & Ruang Permanen
Untuk video dengan lompatan waktu/jarak, selalu dipasang jangkar visual kecil di layar:
- Skala kedalaman `0 m — 1.500 m` di sisi kiri layar (`03`).
- Pill waktu kuning: `HARI INI`, `MINGGU DEPAN`, `SEBULAN KEMUDIAN` (`03`), `MINGGU 3 → MINGGU 6` (`02`).

### G. Recap Cepat + Reframing Punchline di Akhir
Sebelum CTA:
- **Recap** daftar komponen dalam 4–6 detik (`03`: *"Pelampung, tali mooring, christmas tree, ROV, riser, tensioner, semuanya kerja bareng."*).
- **Reframing** 1 kalimat yang mengubah definisi (*"Bukan bangunan yang berdiri, dia kapal yang diikat."* — `03`; *"Padahal awalnya ini sama sekali nggak ada harganya."* — `04`).
- **CTA interaktif**: *"Habis ini mau kita bongkar apa? Tulis di kolom komentar."* (`01`–`05`).

---

## 3. Peta Adaptasi Konkret ke `fakta-studio-demo`

Bagaimana menerjemahkan pola terbaik Batch 01 ke arsitektur Remotion di proyek ini (sambil tetap patuh penuh pada [AGENTS.md](../../AGENTS.md) dan skill [fakta-motion](../../.agents/skills/fakta-motion/SKILL.md))?

| Teknik Referensi | Implementasi di `fakta-studio-demo` | File / Field Terkait |
|---|---|---|
| **Alur "Masalah → Solusi → Istilah"** | Pecah tiap babak menjadi 2–3 `Beat` berurutan yang berbagi `stageProp` yang sama, dengan `propVariant` berbeda (misal `"building"` → `"cracking"` → `"fixed"`). | [types.ts](../../src/episodes/types.ts) (`stageProp`, `propVariant`), `Episode.tsx` (`propElapsedFrame`) |
| **Jangkar Data & Callout Label 3D** | Tampilkan label panah/garis tipis, gauge meter, atau struk angka animasi langsung di dalam SVG `StageProp`, **bukan** sebagai `beat.headline` di atas layar (karena `AGENTS.md` melarang `beat.headline` agar bebas gaya PPT). | `src/components/StageProp.tsx` |
| **Jebakan Asumsi + Kegagalan Dramatis** | Pada beat asumsi salah: pasang `pose: "thinking"` atau `"talking"`, lalu di beat kegagalan pindahkan tema ke `cyber-crash` atau `spotlight-twist` dengan `shakeIntensity: 8`, `cameraZoom: 1.14`, dan `sfxLabel: "RETAK!"` / `"CRASH!"`. | `Scene.tsx` (`SceneTheme`), `Episode.tsx` (`shakeIntensity`, `cameraZoom`) |
| **Analogi Benda Sehari-hari** | Gunakan `stageProp: "vs-compare"` atau varian prop khusus untuk menyandingkan konsep rumit (kiri) dengan analogi rumah tangga (kanan), sementara `Jokowo` menunjuk (`pose: "pointing"`, `charX: -165` atau `+165`). | `Jokowo.tsx`, `StageProp.tsx`, `Beat.charX` / `Beat.charFlip` |
| **Atmosfer Berubah (Siang → Malam / Normal → Bahaya)** | Manfaatkan pergantian `scene.theme` dan `scene.sceneTransition` (`slide-left`, `zoom-burst`, `shutter`, `flash`) antar-scene agar setiap perubahan kondisi punya suasana latar baru. | `Episode.tsx`, `Scene.tsx` |
| **Pacing Padat Tanpa Beat Mati** | Untuk Shorts 45–60 detik: target **100–150 kata**, setiap `Beat` berdurasi ~2–4 detik (60–120 frame @ 30fps), dikunci presisi dari `silencedetect` dan `extract-rms.mjs`. | `scripts/master-vo.mjs`, `scripts/extract-rms.mjs` |
| **Keterbacaan Caption** | Pertahankan format wajib kita: 2–4 kata per baris di `bottom: 380px` (Shorts) / `bottom: 110px` (Long), font `Fredoka` putih outline hitam `12px`, kata aktif `#FACC15`, di luar layer zoom kamera. | `Caption.tsx`, `Episode.tsx` |
| **Penutup Reframing + CTA Interaktif** | Gunakan `stageProp: "cta-comment"` dengan tombol interaksi + `Jokowo` pose `celebrating` + pertanyaan pancingan *"Habis ini mau kita bongkar apa?"* atau pertanyaan relevan topik. | `StageProp.tsx`, `Jokowo.tsx` |
