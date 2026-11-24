# CHARACTER REFERENCE SHEET: JOKOWO

Dokumen standar acuan visual dan spesifikasi teknis untuk karakter animasi original **Jokowo**.

---

## 1. Konsep Desain & Identitas
- **Nama Karakter**: Jokowo
- **Deskripsi**: Sosok pembawa wawasan dan fakta ilmiah yang ramah, santun, bersahaja, sedikit karikaturis dengan getaran figur akrab nusantara (bukan tiruan fotorealistis).
- **Format Aset**: 100% Reusable SVG Component (`src/components/Jokowo.tsx`).
- **Dimensi Asli ViewBox**: 200 × 400 unit (rasio tinggi : lebar = 2 : 1).

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
Sistem komponen `Jokowo.tsx` mendukung prop `pose`:

| Pose Key | Deskripsi Visual | Penggunaan Utama |
|---|---|---|
| `idle` | Berdiri tegak rileks, tangan di samping/depan, nafas lembut | Scene transisi, jeda dialog |
| `talking` | Tangan kanan bergerak membuka ke depan secara persuasif | Menyampaikan argumen fakta |
| `pointing` | Tangan kanan menunjuk ke atas / ke arah diagram atau prop | Menyorot data atau teks |
| `thinking` | Tangan di dagu, kepala sedikit miring ke samping | Segmen misteri, pertanyaan, atau refleksi |
| `walking` | Kaki dan tangan berayun ritmis secara bergantian | Transisi antar lokasi/ide |
| `celebrating` | Kedua tangan terangkat ke atas dengan senyum semringah | Fakta mengejutkan, penutup gembira |

---

## 4. Ekspresi Wajah Baku (Minimal 5 Ekspresi)
Sistem komponen `Jokowo.tsx` mendukung prop `expression`:

| Expression Key | Bentuk Mata & Alis | Mulut & Pipi | Suasana Naskah |
|---|---|---|---|
| `neutral` | Mata bulat ramah, alis lurus tenang | Garis senyum santai | Penjelasan umum |
| `curious` | Alis terangkat satu, mata sedikit membesar | Mulut setengah terbuka 'O' | `<curious>` (Hook & misteri) |
| `shocked` | Mata melebar besar, pupil mengecil, alis tinggi | Mulut terbuka lebar oval | `<shocked>` (Fakta tak lazim/twist) |
| `laughing` | Mata menyipit melengkung ke atas, pipi merona | Mulut terbuka tertawa lebar | `<laughing>` (Punchline & humor) |
| `storytelling` | Tatapan hangat dan teduh, alis melengkung bersahabat | Senyum bijak | `<storytelling>` (Kisah sejarah/sains) |
| `amused` | Satu alis terangkat jenaka, senyum tipis di sudut bibir | Senyum asimetris renyah | `<amused>` (Keunikan alamiah) |

---

## 5. Detail Pakaian & Palet Warna Karakter
- **Rambut**: `#1E293B` (Hitam arang kebiruan, belah samping khas, garis sisiran rapi).
- **Warna Kulit**: `#FBBF24` / `#F59E0B` dengan gradasi sawo matang terang Indonesia yang hangat (`#FDE68A` untuk highlight).
- **Baju Kemeja**: `#FFFFFF` (Putih bersih) dengan garis jahitan saku dada kiri dan lipatan lengan khas (rolled up sleeves).
- **Aksen Batik Halus**: Garis motif geometris tipis warna `#0EA5E9` (Sky Blue) di kerah atau tepian saku.
- **Celana**: `#1E293B` (Celana panjang bahan kain warna gelap formal-santai).
- **Sepatu**: `#334155` (Sneakers kasual santai).

---

## 6. Standar Proporsi Tubuh & Wajah
- **Tinggi Total**: 5.5 Head Length (Gaya Semi-Chibi / Stylized Edutainment Cartoon).
- **Proporsi Kepala**:
  - Lebar kepala : Panjang kepala = 0.85 : 1.
  - Hidung berupa kurva siluet minimalis yang khas dan bersahaja.
- **Garis Tepi (Stroke)**:
  - Outline luar karakter: 3px tebal warna `#1E293B`.
  - Detail dalam: 2px warna `#1E293B`.
- **Sinkronisasi Bibir (`mouthOpen`)**:
  - Menerima nilai kontinu 0.0 (tertutup) sampai 1.0 (terbuka penuh), dihubungkan langsung ke analisis gelombang audio / RMS energy voiceover.
