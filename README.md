# Harian

Aplikasi catatan harian **mobile-first** untuk keuangan, tugas, agenda/target, dan kebiasaan. Tampilan desktop hanya berupa shell ponsel selebar 430px di tengah layar — tidak ada layout desktop terpisah.

## Menjalankan

```bash
npm install
npm run dev
```

Buka `http://127.0.0.1:5173`.

Build produksi + PWA:

```bash
npm run build
npm run preview
```

## Fitur

- **Beranda** — saldo bulan ini, perbandingan pengeluaran, grafik 7 hari, tugas hari ini, check-in kebiasaan, agenda terdekat, dan tambah cepat.
- **Keuangan** — pemasukan/pengeluaran, kategori, navigasi bulan, donut chart kategori, filter, detail transaksi, hapus.
- **Tugas** — pita tanggal, progres harian, daftar terlambat, prioritas, tag, aksi selesai/hapus.
- **Kalender** — grid bulanan, agenda & target, indikator per tanggal, tambah/hapus.
- **Kebiasaan** — ring progres, streak, grid 7 hari interaktif, tambah/hapus, pilihan ikon dan warna.
- **Pengaturan** — profil, tema terang/gelap/sistem, pengingat, export JSON, reset data demo.
- **PWA** — manifest, ikon 192/512 + maskable, service worker, bisa di-install ke home screen.

Data demo disimpan di `localStorage` dengan key `harian.app.v1`. Belum ada sinkronisasi cloud.

## Desain

- Flat Design, warna utama teal `#0D9488`, aksen orange, font Plus Jakarta Sans.
- Token warna light/dark di `src/index.css`, ikon Phosphor.
- Bottom navigation, bottom sheet, FAB, safe-area iOS, target sentuh minimal 36px (mayoritas 44px).
- Bundle dipecah per halaman; Recharts hanya dimuat saat membuka Keuangan.

## Struktur

```text
src/
  pages/          Beranda, Keuangan, Tugas, Kalender, Kebiasaan, Pengaturan
  components/     layout, ui, forms, charts, tasks, habits
  store/          AppContext (state + localStorage), seed demo
  lib/            utils, kategori, ikon
scripts/          screenshot, flow test, QA 360px, generator ikon PWA
public/           favicon + ikon PWA
```

## Pengujian

Dengan dev server berjalan:

```bash
npm run test:flow   # alur tambah/hapus/tema/persistensi + cek error console
npm run test:qa     # overflow 360px, target sentuh, screenshot detail
npm run shots       # screenshot semua halaman light/dark
```

Skrip memakai Chrome di `C:/Program Files/Google/Chrome/Application/chrome.exe` dan menyimpan hasil ke folder temp `harian-shots`.

## Langkah Firebase Berikutnya

1. Buat project Firebase, aktifkan **Authentication** (email/password + Google) dan **Firestore** region `asia-southeast2`.
2. Daftarkan web app, lalu simpan config di `.env.local`:
   ```env
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```
3. Ganti persistensi di `src/store/AppContext.tsx` dari localStorage ke Firestore dengan dokumen per user (`users/{uid}`).
4. Tambahkan security rules agar tiap user hanya bisa membaca/menulis datanya sendiri.
5. Pengingat saat aplikasi tertutup menyusul lewat FCM + service worker.
