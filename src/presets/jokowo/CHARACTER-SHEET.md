# CHARACTER REFERENCE SHEET: JOKOWO

Dokumen standar acuan visual dan spesifikasi teknis untuk karakter animasi original **Jokowo** (Preset `#1: jokowo`).

---

## 1. Konsep Desain & Identitas
- **Preset ID**: `jokowo`
- **Nama Karakter**: Jokowo
- **Konsep Visual**: *Tech Blueprint & Cyber Lab*
- **Deskripsi**: Sosok pembawa wawasan dan fakta ilmiah yang ramah, santun, bersahaja, sedikit karikaturis dengan getaran figur akrab nusantara (bukan tiruan fotorealistis).
- **Format Aset**: 100% Reusable SVG Component (`src/presets/jokowo/Mascot.tsx`).
- **Dimensi Asli ViewBox**: `290 × 420` unit (`viewBox="-45 -15 290 420"`).

---

## 2. Sudut Pandang (Angles)
1. **Tampak Depan (Front View)**:
   - Posisi simetris dengan sedikit kemiringan bahu natural.
   - Digunakan untuk momen dialog langsung ke penonton / kamera.
2. **Tampak Tiga Perempat (3/4 View - Default)**:
   - Tubuh menghadap serong 15 derajat, kepala menoleh ke penonton atau ke arah prop/diagram.
   - Sudut paling dinamis untuk video format 16:9 dan 9:16.
3. **Tampak Samping (Profile View)**:
   - Digunakan saat berjalan melintasi scene (`pose='walking'`) atau meneliti objek di meja.

---

## 3. Pose Tubuh Baku (Minimal 6 Pose)
Sistem komponen `Mascot.tsx` mendukung prop `pose`:

| Pose Key | Deskripsi Visual | Penggunaan Utama |
|---|---|---|
| `idle` | Berdiri tegak rileks, tangan di samping/depan, nafas lembut | Scene transisi, jeda dialog |
| `talking` | Tangan kanan bergerak membuka ke depan secara persuasif | Menyampaikan argumen fakta |
| `pointing` | Tangan kanan menunjuk ke atas / ke arah diagram atau prop | Menyorot data atau teks |
| `thinking` | Tangan di dagu, kepala sedikit miring ke samping | Segmen misteri, pertanyaan, atau refleksi |
| `walking` | Kaki dan tangan berayun ritmis secara bergantian | Transisi antar lokasi/ide |
| `celebrating` | Kedua tangan terangkat ke atas dengan senyum semringah | Fakta mengejutkan, penutup gembira |

---

## 4. Ekspresi Wajah Baku (Minimal 6 Ekspresi)
Sistem komponen `Mascot.tsx` mendukung prop `expression`:

| Expression Key | Bentuk Mata & Alis | Mulut & Pipi | Suasana Naskah |
|---|---|---|---|
| `neutral` | Mata bulat ramah, alis lurus tenang | Garis senyum santai | Penjelasan umum |
| `curious` | Alis terangkat satu, mata sedikit membesar | Mulut setengah terbuka 'O' | Hook & misteri |
| `shocked` | Mata melebar besar, pupil mengecil, alis tinggi | Mulut terbuka lebar oval | Fakta tak lazim/twist |
| `laughing` | Mata menyipit melengkung ke atas, pipi merona | Mulut terbuka tertawa lebar | Punchline & humor |
| `storytelling` | Tatapan hangat dan teduh, alis melengkung bersahabat | Senyum bijak | Kisah sejarah/sains |
| `amused` | Satu alis terangkat jenaka, senyum tipis di sudut bibir | Senyum asimetris renyah | Keunikan alamiah |

---

## 5. Detail Pakaian, Kulit & Rig Gerak Humanis
- **Rambut**: `#1E293B` → `#0F172A` (Hitam natural belah samping lembut dengan helaian sisiran).
- **Warna Kulit**: `#F3C69F` → `#E2A578` → `#C78254` (Sawo matang natural hangat Indonesia + bayangan dagu & rona pipi lembut `#E07A5F`).
- **Mata**: Iris cokelat tua `#2A1B12`, pupil `#0B0F19`, refleksi cahaya putih + dukungan `eyeTarget` (`"camera" | "prop" | "left" | "right"`).
- **Baju Kemeja**: `#FFFFFF` → `#E2E8F0` dengan bahu melengkung anatomis, garis jahitan, saku dada kiri batik cyan (`#0EA5E9`), dan lengan 2-segmen (bahu-siku-tangan) dengan interpolasi sendi halus antar-pose (`prevPose` + `poseTransitionProgress`).
- **Celana & Sepatu**: `#0F172A` dengan sambungan pinggul menyatu dan sneakers `#334155`.

---

## 6. Standar Proporsi Tubuh & Mulut
- **Tinggi Total**: 5.5 Head Length (Gaya Semi-Chibi / Stylized Edutainment Cartoon).
- **Garis Tepi (Stroke)**: Outline karakter `2.1px – 2.8px` warna `#0F172A`.
- **Sinkronisasi Bibir (`mouthOpen`)**: Menerima nilai kontinu `0.0` (tertutup) sampai `1.0` (terbuka penuh) dari RMS WAV 30fps, dilengkapi aksen gigi atas halus dan lidah saat terbuka lebar.
