---
name: fakta-motion
description: Pedoman penyutradaraan motion graphic sinematik dan animasi kartun panggung berbasis Remotion + React + SVG di fakta-studio-demo. Digunakan setiap kali merancang adegan, koreografi kamera (zoom/pan), animasi karakter Jokowo, transisi visual dinamis, dan tata letak teks agar video bergerak hidup seperti video profesional — bukan presentasi slide/PPT.
---

# Fakta Motion — Standar Penyutradaraan Animasi Sinematik (Anti-PPT)

Pedoman ini mengadaptasi hukum dan resep motion graphic sinematik terbaik dari *Bang Motion*, yang telah disesuaikan secara khusus untuk arsitektur **Remotion + React 19 + TypeScript + SVG** di studio `fakta-studio-demo`.

---

## 1. Hukum Anti-PPT (Ini Video, Bukan Slide Presentasi!)

Penyakit paling umum pada video edukasi adalah adegan yang terasa seperti "slide deck": judul di atas, deretan bullet point/kartu di tengah, lalu berganti adegan hanya dengan efek *fade in/out* (opacity).

### Aturan Wajib Adegan Hidup:
1. **Dilarang Berganti Adegan Hanya dengan Fade Opacity**:
   - Adegan berganti karena **kamera bergerak** (push-through, pan, zoom ke instrumen), **transisi panggung**, atau **aksi objek** di dalam dunia.
   - Pengecualian sah: *Kartun Panggung* (cut/geser antar panggung yang masing-masing hidup penuh).
2. **Satu Kalimat/Gagasan Utama per Beat**:
   - Jangan menumpuk 3 level teks (kicker + judul besar + paragraf penjelasan).
   - Maksimum dua: satu frasa caption punchy + satu label infografis/diagram.
3. **Resep 3–5 Elemen per Adegan**:
   - Setiap adegan memiliki 3–5 elemen visual yang masuk secara bertahap mengikuti frasa suara narasi (karakter Jokowo + prop/diagram + caption + SFX + partikel latar).
4. **Gerak di Setiap Detik (Tidak Ada Frame Mati)**:
   - Karakter memiliki gerakan nafas/gestur (`breathing`, `armSwing`, `mouthOpen`).
   - Latar memiliki gerakan partikel mengambang lembut berbasis `useCurrentFrame()`.
   - Prop/diagram tumbuh elastis menggunakan `popIn()` (`spring()`).

---

## 2. Koreografi Kamera & Ukuran Shot (Bukan Sekadar Napas Mikro)

Bila adegan terasa kaku, jangan hanya memberi zoom 1–2% yang tidak terlihat. Gunakan perubahan ukuran shot yang disengaja:

| Ukuran Shot | Kapan Digunakan | Implementasi di Remotion |
|---|---|---|
| **Wide Shot (1.0×)** | Pengenalan adegan baru, pembukaan babak, menampilkan diagram penuh bersama Jokowo | `cameraZoomAt: undefined` (skala normal) |
| **Medium Close-Up (1.15× – 1.25×)** | Poin penjelasan mendalam, saat Jokowo menyampaikan argumen persuasif | `cameraZoomAt: { frame: F, scale: 1.2, duration: 20 }` |
| **Punch Close-Up / Shock (1.3× – 1.4×)** | Momen Twist, fakta mencengangkan, atau punchline lucu | `cameraZoomAt` cepat + `shakeAt: { frame: F, intensity: 8, duration: 15 }` |

*Aturan*: Setelah momen close-up selesai, kamera rileks mundur kembali ke framing stabil.

---

## 3. Resep "Kartun Panggung" untuk Karakter Jokowo

Untuk menjaga konsistensi karakter kartun edukasi di seluruh episode:

1. **Skala Karakter yang Pas (Bukan Miniatur)**:
   - **Shorts (9:16)**: Skala `2.0× – 2.4×`, ditempatkan di tengah-bawah (`bottom: 460px`).
   - **Long Video (16:9)**: Skala `1.3× – 1.5×` (tinggi ~500–600px), ditempatkan di sepertiga kanan atau kiri layar (Rule of Thirds).
   - Dilarang membuat karakter mengecil sebesar ibu jari di tengah layar kosong.
2. **Sinkronisasi Ekspresi dengan Tag Emosi Naskah**:
   - `<curious>`: Alis terangkat, mata sedikit membesar, mulut 'O', pose `thinking`.
   - `<shocked>`: Mata melebar bulat, pupil mengecil, mulut terbuka, pose `talking` / `celebrating`.
   - `<laughing>`: Mata melengkung ke atas, pipi merona, mulut tertawa lebar, pose `celebrating`.
   - `<storytelling>`: Tatapan hangat, senyum bijak, pose `talking`.
   - `<amused>`: Senyum tipis asimetris, pose `talking` / `pointing`.
3. **Rig Tubuh Modular**:
   - Ayunan tangan dan kaki bergantian pada pose `walking`.
   - Gerak bibir (`mouthOpen`) dikontrol kontinu dari energi suara VO atau simulasi ritme bicara.

---

## 4. Prinsip "Teks Hidup, Latar Tunduk"

1. **Latar Belakang Minimal 2 Lapis**:
   - Lapis 1: Gradasi warna lembut (`ChapterBackdrop.tsx` / `#EEF5FF`).
   - Lapis 2: Tekstur grid halus / partikel floating blur lembut.
   - Dilarang menggunakan latar flat 1 warna mati tanpa kedalaman.
2. **Keterbacaan Caption Mutlak**:
   - Di zona aman caption (`bottom: 380px` Shorts, `bottom: 110px` Long), area harus bebas dari elemen grafis yang menutupi teks.
   - Huruf putih tebal (`Fredoka`) dengan outline hitam pekat 12px (`-webkit-text-stroke: 12px #000000; paint-order: stroke fill;`) dan bayangan tajam.
   - Kata aktif diberi warna kuning cerah (`#FACC15`).

---

## 5. Hukum Determinisme Mutlak

- **HARAM** menggunakan `Math.random()` atau `Date.now()` di dalam folder `src/`.
- Seluruh animasi, getaran kamera, dan partikel floating wajib menggunakan:
  - `useCurrentFrame()` dan fungsi trigonometri deterministik (`Math.sin(frame * freq)`).
  - Remotion `random("seed-string")` untuk angka acak yang terkunci per benih.
- Hal ini menjamin proses render multi-thread di Remotion menghasilkan frame yang 100% konsisten tanpa jitter atau frame drop.

---

## 6. Checklist Verifikasi Adegan Sebelum Render Final

- [ ] Tidak ada adegan yang hanya berupa slide diam yang di-fade.
- [ ] Karakter Jokowo berada pada skala proporsional yang pas (tidak terlalu kecil).
- [ ] Ukuran shot bervariasi (ada momen wide dan momen penekanan close-up).
- [ ] Teks caption tidak tertutup oleh prop atau tangan karakter.
- [ ] Seluruh animasi berjalan mulus berbasis frame rate 30fps konstan.
- [ ] Lulus pengujian otomatis: `npm test && npm run lint`.
