# PANDUAN LENGKAP LONG VIDEO YOUTUBE (16:9)

Dokumen ini mengatur standar produksi video horizontal berdurasi 4–8 menit (1920×1080 @ 30fps) dengan alur cerita berbobot, visual dinamis, dan sinkronisasi audio presisi.

---

## 1. Spesifikasi Teknis Video
- **Resolusi**: 1920 × 1080 piksel (Aspek Rasio 16:9)
- **Frame Rate**: 30 fps konstan
- **Durasi Target**: 4 – 8 menit (7.200 – 14.400 frame)
- **Jumlah Chapter**: 5 – 8 Chapter per episode
- **Thumbnail**: 1280 × 720 piksel (PNG kualitas tinggi)

---

## 2. Struktur Chapter & Alur Cerita
Setiap episode Long Video wajib memiliki minimal 5 chapter dengan struktur baku:

1. **INTRO / HOOK (30–60 detik)**:
   - Menarik perhatian dengan paradoks, misteri, atau pertanyaan provokatif.
   - Pemanfaatan camera zoom halus dan ekspresi Jokowo `<curious>` atau `<shocked>`.
2. **CHAPTER 1: DASAR FAKTA (45–75 detik)**:
   - Fondasi pengetahuan utama.
   - Menampilkan diagram atau ilustrasi prop interaktif.
3. **CHAPTER 2: EKSPLORASI MENDALAM (60–90 detik)**:
   - Bedah data, analogi visual, atau studi kasus sejarah/sains.
4. **CHAPTER 3: TWIST / SUDUT PANDANG LAIN (60–90 detik)**:
   - Patahan persepsi umum atau temuan mutakhir yang mengejutkan.
5. **CLIMAX / INTISARI UTAMA (60–90 detik)**:
   - Jawaban tuntas dari misteri di pembuka. Puncak wawasan.
6. **OUTRO / KESIMPULAN & REFLEKSI (30–45 detik)**:
   - Rangkuman satu kalimat pamungkas, ajakan diskusi di kolom komentar, dan penutup ramah Jokowo.

---

## 3. Komposisi Visual Layar Lebar (16:9)

- **Zona Karakter Jokowo**:
  - Umumnya ditempatkan di sepertiga kiri atau sepertiga kanan (Rule of Thirds).
  - Skala karakter: 450–650px tinggi untuk kenyamanan visual layar desktop/TV.
- **Zona Konten & Diagram**:
  - Disediakan 60% ruang layar untuk infografis animasi (`AnimatedDiagram.tsx`), prop ilmiah, dan balon penjelas.
- **Backdrop Chapter Dinamis**:
  - Setiap chapter menggunakan `ChapterBackdrop.tsx` yang mengadaptasi palet warna lembut dengan partikel floating SVG yang bergerak tenang (menggunakan `interpolate` dan `random("seed")`).
- **Larangan Tampilan Elemen Internal**:
  - `beat.headline` TIDAK DIRENDER di atas layar.
  - Badge kategori/source TIDAK DIRENDER di atas layar.
  - Semua pesan disampaikan murni lewat narasi, caption, balon bicara sesekali, dan diagram.

---

## 4. Standar Teks Caption 16:9
- **Posisi**: `bottom: 110px`, terpusat secara horizontal.
- **Ukuran Font**: 48px – 56px (`Fredoka`).
- **Panjang Teks**: 3 – 6 kata per potongan frasa (pembacaan alami).
- **Efek Teks**:
  - Outline hitam tebal: `-webkit-text-stroke: 12px #000000; paint-order: stroke fill;`.
  - Warna default: `#FFFFFF`.
  - Warna kata aktif saat diucapkan: `#FACC15` (Kuning cerah).
  - Tanpa background pill/box.

---

## 5. Audio Engineering & Auto-Ducking

- **Voice-Over (VO)**: Dikuasai lewat `master-vo.mjs` dengan profil Warm Bass EQ, menghasilkan kehangatan vokal ala siaran radio profesional.
- **RMS Energy Mapping**:
  - Skrip `long-audio-mix.ts` mengekstrak energi RMS audio per frame 30fps.
  - Frame dengan energi di atas ambang batas dianggap sebagai *speech frames* untuk menyinkronkan bukaan bibir (`mouthOpen`) dan men-ducking musik latar.
- **Auto-Ducking BGM**:
  - Normal Level: **12% – 15%** volume.
  - Ducked Level (saat ada suara VO): **3% – 5%** volume dengan *smoothing ramp* (fade down 6 frame, fade up 10 frame).
- **SFX**: Level **35% – 42%**, dipicu pada transisi diagram atau penekanan poin penting.

---

## 6. Format Chapter Timestamps YouTube
Saat merender long video, sistem secara otomatis menghitung durasi frame aktual tiap chapter dan memformatnya ke dalam `publikasi.md`:
```
00:00 - Rahasia yang Tak Pernah Diungkap
00:52 - Babak 1: Titik Awal Mula
02:15 - Babak 2: Kejutan di Bawah Permukaan
04:02 - Babak 3: Data yang Membuktikan
05:30 - Intisari & Penutup
```
Timestamp ini dapat disalin langsung ke kolom deskripsi YouTube untuk memicu fitur Chapters otomatis.
