# AGENTS.md — Aturan Kerja Permanen Studio Animasi Fakta

Dokumen ini adalah aturan absolut dan panduan utama bagi AI Agent yang bekerja di repositori `fakta-studio-demo`.

---

## 1. Identitas Proyek & Art Style Lock

- **Nama Proyek**: `fakta-studio-demo`
- **Gaya Visual Dasar (Base Art Style DNA)**: **Tech Blueprint & Cyber Lab** (Skema Teknik Cetak Biru, Grid Koordinat Arsitektur, Lantai Panggung 3D Perspektif, Elemen HUD Audio Reaktif & Vektor Berpendar Lembut).
- **Tipe Konten**:
  - **YouTube Shorts (9:16)**: 1080×1920 @ 30fps
  - **Long Video YouTube (16:9)**: 1920×1080 @ 30fps (4–8 menit, 5–8 chapter)
- **Palet Warna Dasar (Blueprint Lab)**:
  - Background Utama: `#0A192F` (Deep Cyber Blueprint Navy)
  - Sekunder/Gradasi Latar: `#0F2942` (Blueprint Depth)
  - Garis Grid & Cetak Biru: `#38BDF8` (Sky Cyan Blueprint Line) dengan aksen pendar lembut
  - Aksen Cyan Neon: `#00F5FF` (Laser / Highlight Digital)
  - Aksen Kuning Aktif: `#FACC15` (Kata aktif caption & warning tag)
  - Aksen Indigo/Ungu Digital: `#818CF8`
  - Putih Bersih: `#FFFFFF` (Teks judul & kemeja Jokowo kontras tinggi)
  - Tinta/Garis Karakter: `#0F172A` (Slate pekat elegan)
- **Multi-Tema Panggung Dinamis (WAJIB Variasi Antar-Scene)**:
  - Agar video tidak terasa monoton seperti satu latar mati, setiap scene **dianjurkan berganti tema atmosfer** melalui `scene.theme` (`SceneTheme`) yang tetap konsisten dengan DNA Blueprint & Kartun Panggung (memiliki grid cetak biru bergerak, partikel ambient deterministik, dekorasi tematik, dan lantai panggung 3D):
    - `cyber-blueprint` (Blueprint standar cyan-navy)
    - `cyber-crash` (Navy-merah alert, scanline glitch, radar berdenyut)
    - `vintage-1947` (Teal-amber retro, gelombang osiloskop & dial teknik)
    - `spotlight-twist` (Crimson-indigo dramatis, lampu sorot menyapu & garis hazard)
    - `archive-paper` (Slate-emas arsip sejarah, cincin orbit)
    - `edison-1878` (Sepia-amber hangat Victorian, roda gigi kuningan berputar)
    - `neon-coder` (Ungu-cyan cyber modern, cincin neon)
    - *Boleh menambah tema baru di `Scene.tsx` sesuai kebutuhan topik episode!*
  - Pergantian antar-scene **wajib menggunakan transisi panggung non-fade** melalui `scene.sceneTransition` (`slide-left`, `zoom-burst`, `shutter`, `flash`).
- **Google Fonts**:
  - Judul / Caption / SFX: `Fredoka` (Rounded, punchy, ramah)
  - Balon Bicara / Label / Data: `Plus Jakarta Sans` (Sangat terbaca, modern & presisi)

### CHARACTER IDENTITY LOCK (WAJIB)
- **Karakter**: `Jokowo` — karakter original animasi pembawa wawasan ilmiah dengan sedikit kemiripan visual karikatur ramah Joko Widodo (bukan tiruan fotorealistis).
- **Karakteristik Visual**:
  - Kemeja putih santai kontras tinggi dengan aksen saku/kerah batik bermotif cyan blueprint (`#0EA5E9` / `#38BDF8`).
  - Rambut belah samping hitam rapi, senyum bersahabat, postur ramping bersahaja.
  - Komponen visual 100% SVG terstandarisasi di `src/components/Jokowo.tsx`.
- **DILARANG** mendesain ulang karakter dari nol di setiap episode. Gunakan sistem komponen proporsional SVG modular yang sama untuk seluruh episode.

---

## 2. Struktur Output per Episode

```
out/
├── <slug>/                          # YouTube Shorts (9:16)
│   ├── publikasi.md                 # Metadata publikasi & naskah
│   ├── voiceover.mp3                # Audio sumber / master (atau nama file audio asli)
│   ├── thumbnail.png                # 1080×1920
│   └── video.mp4                    # 1080×1920 @ 30fps (H.264/AAC)
│
└── long/
    └── <slug>/                      # Long Video YouTube (16:9)
        ├── publikasi.md             # Metadata, naskah, dan Chapter Timestamp final
        ├── voiceover/               # Audio master chapter-by-chapter atau utuh
        ├── thumbnail.png            # 1280×720 (atau 1920×1080)
        └── video.mp4                # 1920×1080 @ 30fps (4–8 menit)
```

> **Kebersihan Output**: File still preview sementara (`preview-*.png`, `still-*.png`) **wajib dihapus** setelah verifikasi visual lulus agar folder output hanya berisi aset final yang bersih.

> **Aturan Git (WAJIB setiap kali video selesai dirender)**: Video/gambar hasil render (`out/`, `*.mp4`, `thumbnail*.png`, `preview-*.png`, `still-*.png`, `voiceover.*`) dan VO master (`public/audio/vo/`) **TIDAK BOLEH dikirim ke GitHub**. Setiap selesai render: (1) pastikan `.gitignore` sudah menutup semua file media baru (tambah pola bila ada jenis baru), (2) jalankan `git status --short` dan pastikan tidak ada file media berat yang ter-*stage*/untracked, (3) bila ada yang sudah ter-track, lepas dengan `git rm -r --cached <path>` sebelum commit/push.

---

## 3. Alur Kerja Wajib 2-Tahap (Voice-First Workflow)

### TAHAP 1 — Bahan Dulu (JANGAN RENDER!)
1. Buat folder `out/<slug>/` atau `out/long/<slug>/`.
2. Buat file `publikasi.md` sesuai tipe konten (**Mode YT Shorts** atau **Mode YT Long Video**, mengacu ke Bagian 6) berisi:
   - **Judul Utama Rekomendasi + 2 Opsi Alternatif** (mengikuti standar algoritma di Bagian 6 agar menembus ≥2.000 views & ≥20 likes).
   - **Deskripsi Video Siap Copy-Paste** sesuai formatnya:
     - **YT Shorts**: Deskripsi ringkas *mobile-first* tanpa URL eksternal mati + **4–6 hashtag** (ditutup `#shorts`). Simpan daftar URL sumber valid (`https://...`) di bagian terpisah *"Sumber & Referensi Riset"* di dalam `publikasi.md`.
     - **YT Long Video**: Deskripsi lengkap SEO 5-lapis yang memuat 2 baris pembuka SEO, poin bahasan, **Estimasi Chapter Timestamp (`00:00`)**, **URL sumber ilmiah/teknis aktif (`https://...`)**, dan **3 hashtag utama** (tanpa `#shorts`).
   - **Rekomendasi Pinned Comment** dan **YouTube Studio Tags**.
   - **Naskah Voice-Over Bersih untuk ElevenLabs**:
     - **DILARANG memakai tag XML/kurung sudut** seperti `<curious>` atau `<shocked>` di dalam teks input ElevenLabs (karena akan terbaca secara harfiah oleh AI). Bila memakai `Eleven v3`, boleh menyediakan versi bertag kurung siku `[thoughtful]`, `[curious]`, dll. terpisah dari versi bersih `Eleven Multilingual v2`.
     - Atur emosi menggunakan **tanda baca alami** (`!`, `?`, `...`, `—`, huruf kapital penekanan).
     - Cantumkan rekomendasi Voice Settings ElevenLabs (Model: *Eleven Multilingual v2*, Stability: *35% – 45%*, Similarity: *75% – 85%*, Style Exaggeration: *15% – 25%*).
   - Berikan naskah versi utuh 1 blok dengan jeda `...` dan versi potong per scene/chapter.
3. **BERHENTI**: Laporkan draf ke pengguna dan **tunggu file audio dikirim**. Jangan render animasi sebelum audio ada!

### TAHAP 2 — Sinkronisasi Audio Verbatim, Koreografi & Render Presisi
1. **Audio Mastering (Warm Bass EQ)**:
   Proses file audio kiriman pengguna melalui:
   ```bash
   node scripts/master-vo.mjs <path-ke-audio> <nama-output.wav>
   ```
   Filter Warm Bass EQ:
   `highpass=f=75,equalizer=f=135:t=q:w=1.1:g=5.0,equalizer=f=240:t=q:w=1.2:g=2.5,equalizer=f=3200:t=q:w=1.4:g=-3.5,equalizer=f=5500:t=q:w=1.5:g=-3.0,acompressor=threshold=-18dB:ratio=3:attack=10:release=100,loudnorm=I=-16:TP=-1.5:LRA=11`
   menghasilkan WAV 44.1 kHz 16-bit PCM mono di `public/audio/vo/`.

2. **Transkripsi Verbatim, Per-Beat Timing & Ekstraksi RMS 30fps (WAJIB)**:
   - **Wajib Verbatim Audio**: Dengarkan/verifikasi isi rekaman audio aktual terlebih dahulu. Seluruh teks `beat.dialogue` wajib **100% cocok kata per kata** dengan ucapan narator asli — **dilarang** menyingkat kalimat, menghilangkan kata, menambah kata ganda, atau mengulang kata yang sama bersamaan di `speechBubble` dan `Caption`.
   - **Wajib `durationInFrames` per Beat**: Jalankan FFmpeg `silencedetect` untuk mengunci `durationInFrames` masing-masing beat sesuai jeda dan tempo bicara asli. **Dilarang** mengandalkan pembagian rata (`scene.durationInFrames / totalBeats`) karena pasti membuat teks melenceng dari suara.
   - **Wajib Ekstraksi RMS per Frame (Shorts & Long)**: Hitung amplitudo energi suara per frame 30fps dari master WAV (misal via `scripts/extract-rms.mjs` atau `extractSpeechFramesFromWav()` di `long-audio-mix.ts`) dan simpan ke `episode.rmsFrames` agar gerak bibir `Jokowo` (`mouthOpen`) dan equalizer HUD bergerak mengikuti silabel dan jeda hening suara asli secara presisi.
   - **Penjadwalan SFX Presisi**: Di `ShortsAudioMix` / `LongAudioMix`, setiap efek suara **wajib dibungkus `<Sequence from={cue.frame}>`** agar bunyi tepat di momen beat-nya (tidak menumpuk di frame 0). Gunakan `beat.sfxLabel` untuk pop-out teks komik kontekstual (`"CRASH!"`, `"ZAP!"`, `"MACET!"`) alih-alih menampilkan nama file SFX mentah.

3. **Quality Gates (Wajib Lulus Sebelum Render Final)**:
   - Wajib lulus tanpa error maupun warning:
     - PowerShell Windows: `npm test ; npm run lint`
     - Bash/Zsh: `npm test && npm run lint`
   - Render preview still (`npx remotion still`) mencakup **seluruh tema yang dipakai**, momen **kamera zoom maksimum**, pose kunci (`thinking`, `celebrating`, `pointing`, `walking`), serta **thumbnail**.
   - Periksa sendiri seluruh gambar still hasil render: pastikan tidak ada teks terpotong, prop menyentuh progress bar/tepi atas, elemen menumpuk di atas teks penting, atau karakter bertabrakan dengan prop/caption.
   - Setelah 100% rapi, hapus file preview still sementara (`preview-*.png` / `still-*.png`).

4. **Render Final Video**:
   ```bash
   npm run render -- --type=shorts --episode=<slug>
   # atau
   npm run render -- --type=long --episode=<slug>
   ```

5. **Wajib Tampilkan Paket Siap Upload di Chat Setiap Selesai Render (WAJIB TANPA KECUALI — Bedakan Shorts vs Long Video)**:
   - Setiap kali selesai menjalankan render final, AI Agent **WAJIB** menyinkronkan versi final `publikasi.md` lalu **menampilkan langsung di balasan chat** blok siap *copy-paste* sesuai tipe video yang dirender:
     - **Jika Render YouTube Shorts (`--type=shorts`)**:
       1. **Judul YT Shorts** (38–58 karakter inti, boleh diakhiri `#shorts`, + 2 opsi alternatif A/B test).
       2. **Deskripsi Ringkas YT Shorts** (2–3 paragraf pendek padat kata kunci entitas + pertanyaan komentar, **TANPA URL eksternal `https://...`** karena link mati/tidak bisa diklik di Shorts, ditutup **4–6 hashtag** berakhiran `#shorts`).
       3. **Pinned Comment** pemicu like/komentar (+ Studio Tags singkat opsional).
     - **Jika Render YouTube Long / Normal Video (`--type=long`)**:
       1. **Judul Long Video** (45–65 karakter, **TANPA hashtag sama sekali di judul**, + 2 opsi alternatif A/B test).
       2. **Deskripsi Lengkap SEO Long Video** (2 baris *Above the Fold* SEO, ringkasan poin bahasan, **Chapter Timestamp final mulai `00:00`**, **daftar URL sumber valid `https://...` yang bisa diklik**, pertanyaan diskusi + CTA Subscribe, dan **3 hashtag utama** tanpa `#shorts`).
       3. **Pinned Comment** & **YouTube Studio Tags** (8–12 frasa pencarian *long-tail* dipisah koma).
   - **DILARANG** mencampur format deskripsi/hashtag Shorts dengan Long Video, dan **DILARANG** hanya menyuruh pengguna membuka `publikasi.md` sendiri tanpa menampilkan Judul + Deskripsi langsung di chat!

---

## 4. Aturan Visual, Caption & Determinisme Mutlak

1. **DILARANG MERENDER METADATA INTERNAL**:
   - DILARANG menampilkan badge `scene.kind` ("HOOK", "FAKTA", "TWIST", "PENUTUP").
   - DILARANG menampilkan badge `fact.source` atau `fact.confidence`.
   - DILARANG menampilkan banner headline atas `beat.headline` di layar Long Video maupun Shorts.
   - Semua elemen di atas hanya metadata internal untuk validasi alur naskah!
2. **Gaya Caption Wajib**:
   - **Tanpa kotak background / tanpa border**.
   - **Render di Luar Layer Zoom Kamera**: `Caption` wajib diletakkan di luar transform `scale()` kamera agar teks tidak ikut membesar atau terpotong tepi layar saat kamera melakukan close-up.
   - Huruf: `Fredoka`, warna putih tebal.
   - Outline hitam pekat tebal (`WebkitTextStroke: 12px #000000`, `paintOrder: "stroke fill"`).
   - Bayangan tajam (`textShadow` / `drop-shadow`).
   - Kata aktif diberi warna kuning (`#FACC15`) dengan **pencocokan eksak (`cleanWord === cleanActive`)**, bukan `.includes()`, agar tidak terjadi highlight ganda yang keliru.
   - **Tanpa pemotongan kata paksa (`slice`)** di komponen `Caption.tsx` — kendalikan panjang baris langsung saat memecah beat:
     - Shorts: 2–4 kata per baris (maksimal 5 kata pendek).
     - Long Video: 3–6 kata per baris.
   - Posisi aman:
     - Shorts: `bottom: 380px` (aman dari UI TikTok/Reels/Shorts).
     - Long Video: `bottom: 110px` (aman dari scrubber bar YouTube).
3. **Larangan `Math.random()` & Aturan Remotion ESLint**:
   - **HARAM** menggunakan `Math.random()` atau `Date.now()` di dalam direktori `src/`.
   - Wajib gunakan `random("seed-string")` bawaan Remotion dan fungsi deterministik berbasis `useCurrentFrame()`.
   - **Hindari nama prop/field `transition`** di komponen React/data episode agar tidak memicu warning `@remotion/non-pure-animation` dari ESLint; gunakan nama eksplisit seperti `sceneTransition`.
4. **Audio Mixing Standard**:
   - Voice-Over (VO): **100%** (0 dB, dominan & renyah).
   - Sound Effects (SFX): **35% – 45%** (punchy, renyah, terjadwal per frame via `<Sequence>`).
   - Background Music (BGM): **10% – 15%** (fondasi hangat).
   - **Auto-Ducking**: BGM otomatis turun ke **3% – 5%** saat narator berbicara pada Long Video.

---

## 5. Standar Animasi Panggung, Blocking Karakter & Properti Interaktif (Anti-Statis)

Video wajib hidup di setiap detik seperti animasi kartun panggung profesional (selaras dengan skill `fakta-motion`) — **dilarang** membuat karakter berdiri kaku di satu titik dengan ikon statis kecil!

1. **Blocking & Gerakan Karakter Aktif (`Jokowo`)**:
   - **Dilarang statis di tengah sepanjang video**: Variasikan posisi horizontal `beat.charX` (kiri `-165px`, tengah `0px`, kanan `+165px`), arah hadap `beat.charFlip`, reaksi lompat/kaget `beat.charY`, dan skala `beat.charScale` (`1.92× – 2.08×`).
   - **Berjalan Otomatis Antar-Posisi**: Perpindahan `charX` yang signifikan otomatis memicu `pose: "walking"` dengan ayunan kaki/tangan dan pantulan tubuh di atas **lantai panggung 3D berbayangan** (`Scene.tsx`). Di awal episode, buka dengan Jokowo berjalan masuk ke panggung.
   - **Rig Ekspresif**: Gunakan lengan terartikulasi (pose `thinking` tangan di dagu, `talking` gestur dua tangan sinkron suara, `pointing` menunjuk tegas ke prop, `celebrating` kedua lengan terangkat tinggi ke atas, kedipan mata deterministik alami, serta anggukan kepala mengikuti irama suara).

2. **Properti Adegan Interaktif Multi-Elemen (`src/components/StageProp.tsx`)**:
   - Setiap episode **wajib menghadirkan properti adegan ilustratif multi-elemen yang bergerak** (`beat.stageProp` + `beat.propVariant`) yang memerankan langsung makna kalimat narasi (misal: aplikasi crash ber-glitch, kalender flip berputar, mesin komputer meledak berasap, selotip menempel di logbook + stempel membanting, kartu perbandingan VS, RAM dengan serangga kejepit, kartu komentar interaktif).
   - Gunakan `propVariant` agar satu `stageProp` yang sama bisa berevolusi secara kontinu lintas beberapa beat berturut-turut tanpa me-reset animasi dasarnya.
   - Hindari hanya mengandalkan 1 ikon kecil generik (`Prop.tsx`) untuk episode utama.

3. **Koreografi Kamera & Safe-Zone Vertikal Shorts (1080×1920)**:
   - Variasikan framing per beat: Wide (`1.0×`), Medium (`1.06×–1.10×`), hingga Punch Close-Up (`1.12×–1.15×`, `transformOrigin: "center 28%"`) + `shakeIntensity` pada momen crash/twist, lalu rileks kembali.
   - Patuhi jalur vertikal aman berikut agar elemen tidak pernah bertabrakan meski saat kamera zoom:
     - **Top HUD (Equalizer Audio Reaktif + Progress Bar)**: `Y = 58px – 98px`
     - **Zona `StageProp` Interaktif**: `top: 190px` (`width: 820px`, `height: 460px` → `Y = 190px – 650px`)
     - **Zona Pop-Out `Sfx`**: `top: 665px`, margin sisi minimal `115px` dari tepi kiri/kanan
     - **Zona Karakter `Jokowo` & Lantai 3D**: `bottom: 450px` (`Y ≈ 755px – 1410px`, garis cakrawala lantai panggung di `Y = 1395px`)
     - **Zona `Caption`**: `bottom: 380px` (`Y ≈ 1465px – 1540px`, dirender di luar layer zoom kamera)

---

## 6. Standar Algoritma Judul, Deskripsi & Hashtag: YT Shorts vs YT Long Video (Target ≥2.000 Views & ≥20 Likes)

Berdasarkan sistem rekomendasi YouTube (*Creator Insider* — *Viewed vs. Swiped Away*, *CTR*, *Satisfaction*, & *Contextual Discovery*) serta benchmark kanal edukasi sains/teknologi Indonesia (rasio like sehat **1,3% – 4,5%** atau **26–90 likes per 2.000 penonton**), **format Deskripsi dan Cara Hashtag WAJIB DIBEDAKAN** antara **YouTube Shorts** dan **YouTube Long / Normal Video**:

### A. Prinsip Dasar Judul & Gate Algoritma Awal (*Seed Audience Routing*)
1. **Ketepatan Penonton Uji Awal (*Seed Pool* 500–2.500 Views)**:
   - Pada jam pertama setelah upload, AI YouTube membaca **Judul + kalimat pembuka Deskripsi + Transkrip Audio (ASR) + Hashtag** untuk menentukan siapa 1.000–2.500 penonton uji pertama.
   - **Wajib menaruh *Entity Keyword* utama di 4–5 kata pertama judul** (misal: `CPU iGPU vs Seri F`, `Rakit PC Layar Hitam`, `Cara Kerja Biodigester`) agar video diuji tepat ke peminat topik, bukan penonton acak yang langsung melewatkan video.
2. **Format Penulisan & 4 Pola Judul Pemicu Klik/Like**:
   - Gunakan **Title Case** bersih dan berwibawa (**DILARANG** HURUF KAPITAL SEMUA satu kalimat penuh; hanya singkatan teknis seperti `CPU`, `iGPU`, `VGA`, `RAM`, atau 1 kata penekanan pendek).
   - Janji atau konflik di judul harus langsung terbukti di **0–3 detik pertama** video.
   - Gunakan salah satu dari 4 pola terbukti:
     1. **Paradoks / Kontra-Intuitif + Cara Kerja**: `[Entitas] Ternyata [Fakta Tak Terduga]? Begini Cara Kerjanya`
     2. **Pertanyaan Relatable (`Kenapa...` / `...Gimana?`)**: `Rakit PC Kok Layar Hitam? Beda CPU iGPU vs Tanpa iGPU`
     3. **Skala Angka + Pertanyaan Fungsi**: `[Angka Konkret] [Objek], Buat Apa? (Cara Kerja [Sistem])`
     4. **Konflik Pilihan / Anti-Salah Beli**: `[Opsi A] vs [Opsi B]: Harga Beda Tipis, Fungsi Jauh Beda?`

---

### B. MODE 1 — Standar Khusus YOUTUBE SHORTS (9:16)
Distribusi utama berasal dari **Shorts Feed** (layar vertikal HP) yang mengutamakan kecepatan baca, kecocokan topik *Seed Pool*, rasio *Viewed vs. Swiped Away* ≥70%–80%, dan komentar cepat.

1. **Judul YT Shorts**:
   - Panjang ideal: **38 – 58 karakter** untuk kalimat inti (maksimal ~65 karakter bila ditambah `#shorts` di ujung) agar **tidak terpotong (`...`)** di layar HP & Shorts Shelf.
2. **Deskripsi YT Shorts (Ringkas, *Mobile-First* & Tanpa Link Mati)**:
   - **DILARANG menaruh URL eksternal (`https://...`) di dalam blok Deskripsi Copy-Paste Shorts**, karena kebijakan resmi YouTube membuat link eksternal di deskripsi & komentar Shorts **tidak bisa diklik (*non-clickable*)** dan hanya memenuhi layar HP secara percuma. *(Simpan daftar URL sumber ilmiah/teknis valid di seksi terpisah dalam `publikasi.md` sebagai arsip riset & validasi fakta).*
   - Buat **ringkas 2–3 paragraf pendek** (±250–550 karakter total):
     - **Paragraf 1 (1–2 kalimat Hook Konteks)**: Ulangi konflik/masalah akrab + kata kunci entitas utama tanpa membocorkan twist akhir.
     - **Paragraf 2 (1 kalimat Padatan Entitas)**: Rangkum komponen/istilah nyata yang dibedah di video (*"Dari [komponen A], [mekanisme B], sampai [fungsi rahasia C]..."*) untuk pengindeksan topik AI & pencarian Shorts.
     - **Paragraf 3 (1 kalimat Pancingan Interaksi)**: Pertanyaan pilihan kubu/pengalaman singkat pemicu komentar & like (selaras dengan **Pinned Comment**).
3. **Cara Hashtag YT Shorts**:
   - **Di Judul**: Boleh menaruh **maksimal 1 hashtag `#shorts`** di paling akhir judul (opsional; **dilarang** menaruh hashtag topik banyak-banyak di judul karena memakan batas karakter judul di HP).
   - **Di Baris Paling Bawah Deskripsi**: Wajib **4 – 6 hashtag spesifik** dalam satu baris dengan rumus:
     - **2–3 hashtag entitas spesifik topik** (misal: `#rakitpc #igpu #prosesor`) → mengunci *Seed Audience* niche.
     - **1–2 hashtag kategori** (`#teknologi`, `#sains`, `#edukasi`, atau `#faktaunik`).
     - **1 hashtag format wajib**: `#shorts` (taruh paling ujung).
   - **Larangan**: Dilarang spam >8–10 hashtag umum (`#fyp #viral #trending`) yang mengaburkan sinyal niche algoritma.

---

### C. MODE 2 — Standar Khusus YOUTUBE LONG / NORMAL VIDEO (16:9)
Distribusi utama berasal dari **Home / Browse Features**, **Suggested Videos**, serta **YouTube & Google Search** yang sangat mengandalkan **CTR Thumbnail + Judul**, struktur SEO deskripsi panjang, navigasi *Chapters*, dan kredibilitas referensi.

1. **Judul YT Long Video**:
   - Panjang ideal: **45 – 65 karakter** (maksimal 70 karakter agar utuh di beranda desktop & mobile), saling melengkapi (*tidak mengulang teks persis*) dengan teks Thumbnail 16:9.
   - **0 Hashtag di Judul**: **DILARANG** menaruh `#shorts` maupun hashtag apa pun di judul Long Video karena menurunkan CTR dan terlihat spammy di beranda YouTube.
2. **Deskripsi YT Long Video (Lengkap 5-Lapis SEO + Chapter + Sumber Klik-Aktif)**:
   - **Lapis 1 — *Above the Fold* SEO (2 Baris Awal / 120–160 Karakter Pertama)**: Muncul di hasil pencarian YouTube/Google sebelum tombol *"Lainnya / Show More"*. Wajib memuat **kata kunci pencarian utama (*primary search query*)** + janji pembahasan utama.
   - **Lapis 2 — Ringkasan Mendalam & Bullet Points *Long-Tail***: 1 paragraf pengantar diikuti 3–5 poin peluru istilah/konsep teknis untuk menangkap trafik *YouTube Search* jangka panjang.
   - **Lapis 3 — Chapter Timestamp Wajib (`00:00`)**: Wajib diawali `00:00`, minimal 3–8 chapter (durasi tiap chapter ≥10 detik) dengan judul chapter mengandung kata kunci agar muncul sebagai *Key Moments* di Google Search.
   - **Lapis 4 — Link Sumber Ilmiah/Teknis Aktif (`https://...`) & CTA**: Karena link eksternal di deskripsi Long Video **bisa diklik penuh**, wajib cantumkan URL jurnal/dokumentasi resmi yang valid untuk membangun otoritas kanal, diikuti pertanyaan diskusi mendalam + ajakan Subscribe.
   - **Lapis 5 — Baris Hashtag Long Video** (lihat aturan di bawah).
3. **Cara Hashtag YT Long Video**:
   - **Di Judul**: **0 hashtag** (bersih tanpa `#`).
   - **Di Baris Paling Bawah Deskripsi**: Gunakan **tepat 3 hashtag paling relevan** (maksimal 3–5 hashtag topik/kategori, misal `#Prosesor #RakitPC #Teknologi`).
   - **Alasan Algoritma & UI**: Pada video normal (16:9), YouTube mengambil **3 hashtag pertama dari deskripsi untuk ditampilkan sebagai tautan aktif tepat di atas/dekat judul video**. Karena itu, pilih hanya 3 kata kunci topik paling presisi — dan **HARAM mencantumkan `#shorts`** pada Long Video agar tidak salah diklasifikasikan sistem.
   - **YouTube Studio Tags**: Wajib isi **8–12 frasa pencarian *long-tail*** & variasi sinonim/salah ketik (dipisah koma, total <400 karakter).
