# GraphMath — Tahap 3: Implementasi Web Game

Prototipe GraphMath berbasis HTML, CSS, dan JavaScript. Game dirancang untuk siswa SMP/MTs, dimainkan oleh satu pemain, serta tidak memerlukan layanan server atau koneksi internet untuk fitur inti. Seluruh aset video disertakan secara lokal di folder `media/`.

## Cara menjalankan

1. Ekstrak `GraphMath_Tahap3.zip` ke sebuah folder.
2. Buka Visual Studio Code.
3. Pilih **File → Open Folder**, lalu buka folder `GraphMath_Tahap3`.
4. Buka file `index.html`.
5. Cara yang direkomendasikan: instal ekstensi **Live Server** di VS Code, lalu klik **Go Live**. Alternatifnya, buka `index.html` langsung dengan browser modern; jika file video lokal tidak dimuat di browser tertentu, gunakan Live Server.

> Penting: jangan memindahkan `index.html` sendirian. Folder `css`, `js`, dan `media` harus tetap berada di sampingnya sesuai struktur di bawah.

## Struktur folder

```text
GraphMath_Tahap3/
├── index.html
├── README.md
├── make_videos.py
├── css/
│   └── style.css
├── js/
│   ├── levels.js
│   ├── world.js
│   └── app.js
└── media/
    ├── materi-dasar.mp4
    ├── materi-poster.jpg
    ├── tutorial-gameplay.mp4
    └── tutorial-poster.jpg
```

## Fitur implementasi

- Lobby dengan Mulai Petualangan, Materi, Tutorial, Pilih Level, Lanjutkan, dan Pengaturan.
- Video materi dasar dan video tutorial gameplay sebagai MP4 lokal tanpa narasi suara.
- Peta enam level: koordinat Kartesius, fungsi, gradien, fungsi dari dua titik, fungsi dan grafik, serta tantangan gabungan.
- Dunia gameplay 2D dengan latar bergaya petualangan, platform, karakter, portal, bidang koordinat, dan grafik fungsi.
- Jenis jawaban berbeda mengikuti level: koordinat, nilai fungsi, gradien, atau persamaan fungsi linear.
- Pemeriksaan jawaban, feedback benar/salah, petunjuk, animasi grafik, dan animasi perjalanan ke portal.
- Skor, pembukaan level, checkpoint, dan progres yang disimpan dengan `localStorage`.
- Layout responsif untuk desktop dan layar ponsel.

## Format jawaban yang didukung

- Koordinat: `4,4` atau `(4,4)`
- Nilai numerik: `4`, `-2`, `3.5`
- Fungsi linear: `2x-1`, `2*x-1`, `x+3`, `-x+5`, `2x`

Parser fungsi pada prototipe ini hanya mendukung bentuk linear sederhana `mx + b`, bukan fungsi nonlinear atau ekspresi matematika arbitrer.

## Catatan pembelajaran dan desain

Urutan keenam level mengikuti pembagian dalam dokumen Materi GraphMath. Variasi misi dan aturan pemeriksaan dijelaskan di `js/levels.js`. Level 1 dan Level 4 menggunakan variasi koordinat/fungsi yang dibentuk saat level dimulai. Video merupakan video pembelajaran berbasis slide visual dan teks, belum memiliki suara/narasi.

Tahap 3 ini adalah implementasi awal, bukan versi final. Tahap berikutnya baru dilakukan setelah hasil ini ditinjau dan disetujui.
