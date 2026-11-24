# Pusat Referensi Video & Analisa (`referensi/`)

Folder ini menyimpan koleksi video referensi beserta analisa mendalam mengenai **hook**, **cara pembawaan (storytelling & delivery)**, dan **teknik produksi visual-audio** sebagai bahan pengembangan episode di studio `fakta-studio-demo`.

---

## Struktur Direktori

```text
referensi/
├── README.md                          # Indeks utama & panduan struktur referensi
├── videos/                            # Arsip video (.mp4), metadata (.info.json), & subtitle (.vtt)
├── analisa-video/                     # Bedah detail individual (timeline, hook, pembawaan, takeaway)
├── hook/                              # Bank pola & formula hook 0–15 detik
└── produksi-video/                    # Bank teknik pembawaan, visualisasi, pacing, & adaptasi ke Remotion
```

---

## Indeks Video Referensi — Batch 01

| # | Topik & Judul | Channel | Durasi | Views | Video Lokal | Analisa Detail |
|---|---|---|---|---|---|---|
| **01** | [Kenapa Kamar Kos Selalu 3×3 Meter? #shorts](https://www.youtube.com/shorts/JSi6ZQ6iRwk) | Zona Gimana? | 41s | 1.662.110 | [video.mp4](videos/01-kamar-kos-3x3/video.mp4) | [01-kamar-kos-3x3.md](analisa-video/01-kamar-kos-3x3.md) |
| **02** | [Crane di Puncak Gedung Turunnya Gimana? #shorts](https://www.youtube.com/shorts/Kw9jnENik-U) | akutahu_id | 180s | 65.505 | [video.mp4](videos/02-crane-puncak-gedung/video.mp4) | [02-crane-puncak-gedung.md](analisa-video/02-crane-puncak-gedung.md) |
| **03** | [Anjungan Minyak Ternyata Ngapung? Begini Cara Kerjanya #shorts](https://www.youtube.com/shorts/xPfuZ55aILI) | akutahu_id | 175s | 503.427 | [video.mp4](videos/03-anjungan-minyak-ngapung/video.mp4) | [03-anjungan-minyak-ngapung.md](analisa-video/03-anjungan-minyak-ngapung.md) |
| **04** | [15 Ton Kotoran Sapi Tiap Hari, Buat Apa? (Cara Kerja Biodigester) #shorts](https://www.youtube.com/shorts/7Wuu0tIDRTg) | akutahu_id | 123s | 134.471 | [video.mp4](videos/04-biodigester-kotoran-sapi/video.mp4) | [04-biodigester-kotoran-sapi.md](analisa-video/04-biodigester-kotoran-sapi.md) |
| **05** | [Dari Lubang Tanah Jadi Kolam Renang!](https://www.youtube.com/shorts/eC1pSW-48yg) | akutahu_id | 119s | 106.028 | [video.mp4](videos/05-lubang-tanah-kolam-renang/video.mp4) | [05-lubang-tanah-kolam-renang.md](analisa-video/05-lubang-tanah-kolam-renang.md) |

---

## Ringkasan Lintas-Video (Sintesis Batch 01)

- **Analisa Hook & Bank Formula**: [hook/analisa-hook-batch-01.md](hook/analisa-hook-batch-01.md) (indeks: [hook/README.md](hook/README.md))
- **Analisa Cara Pembawaan & Peta Adaptasi ke Fakta Studio**: [produksi-video/analisa-pembawaan-batch-01.md](produksi-video/analisa-pembawaan-batch-01.md) (indeks: [produksi-video/README.md](produksi-video/README.md))

---

## Konvensi Penambahan Referensi Baru

Untuk menjaga kerapian saat menambah analisa di masa mendatang:
1. **Video Mentah**: Simpan di `referensi/videos/<NN>-<slug-pendek>/` (`video.mp4`, `video.info.json`, `video.id-orig.vtt`).
2. **Analisa Per-Video**: Buat file `referensi/analisa-video/<NN>-<slug-pendek>.md`.
3. **Analisa Tematik / Lintas-Video**:
   - Pola pembuka & retensi awal → tambah file baru di `referensi/hook/` (misal `analisa-hook-batch-02.md` atau kategori khusus).
   - Gaya visual, transisi, audio, atau struktur naskah → tambah file baru di `referensi/produksi-video/`.
   - Boleh menambahkan folder kategori baru di bawah `referensi/` (misal `referensi/naskah/`, `referensi/sfx-bgm/`, `referensi/long-video/`) lalu daftarkan pada indeks ini.
