# Prompt untuk OpenCode — Integrasi API + Halaman Admin

Copy seluruh isi di bawah ini ke OpenCode.

---

Backend sudah live di production dan sudah saya verifikasi jalan (`GET /api/health` → 200, `GET /api/technologies` → `[]`). Sekarang kerjakan dua hal: (1) pastikan section publik benar-benar konsisten mengambil data dari API ini, dan (2) bangun halaman admin untuk CRUD data.

## 1. Konfirmasi env var

`NEXT_PUBLIC_API_URL` sudah ada di `.env.local` (untuk dev, arahkan ke backend lokal `http://localhost:4000` kalau saya jalankan backend-nya lokal). Untuk **production**, base URL backend adalah:

```
https://petraportfoliobackend.vercel.app
```

Jangan hardcode URL ini di kode — selalu baca dari `process.env.NEXT_PUBLIC_API_URL`. Saya yang akan set env var ini di Vercel dashboard project frontend.

## 2. Section publik (Teknologi & Project/Kompetisi)

Kalau section ini sudah dibuat di prompt sebelumnya, cek lagi dan pastikan:

- Fetch ke `GET /api/technologies` dan render dua grup berdasarkan field `category` (`"GENERAL"` vs `"AI"`), urutkan berdasarkan field `order` lalu `name`.
- Fetch ke `GET /api/projects?type=PROJECT` dan `GET /api/projects?type=COMPETITION` (dua request terpisah, atau satu fetch + filter di client — pilih yang lebih rapi), urutkan berdasarkan `order` lalu tanggal terbaru.
- **Database saat ini kosong** (`[]` untuk kedua endpoint) — pastikan ada empty state yang wajar untuk tiap section (misal "Belum ada data" / skeleton yang hilang begitu ada data), bukan section kosong yang terlihat rusak. Ini kondisi normal untuk sekarang, bukan bug.
- Field opsional (`icon`, `demoUrl`, `repoUrl`, `imageUrl`, `result`, `year`) bisa `null` — jangan crash kalau null, sembunyikan elemen terkait kalau field-nya kosong.

## 3. Halaman Admin

Buat route baru, misalnya `/admin`, dengan:

### a. Halaman login (`/admin/login` atau halaman admin redirect ke form login kalau belum auth)

- Form email + password.
- `POST /api/auth/login` dengan body `{ email, password }`.
- Response sukses: `{ token, admin: { id, email } }`. Response gagal: `401` dengan `{ error: "Invalid email or password" }`.
- Simpan token di client (localStorage cukup untuk use case single-admin ini — tidak perlu httpOnly cookie/refresh token, ini bukan sistem multi-user). Redirect ke dashboard admin setelah login sukses.
- Semua route di bawah `/admin` (selain halaman login) harus cek token ada di localStorage; kalau tidak ada, redirect ke halaman login.

### b. Dashboard admin — kelola Technologies

- Tabel/list semua technology dari `GET /api/technologies`.
- Form tambah baru → `POST /api/technologies` dengan `{ name, category: "GENERAL" | "AI", icon?, order? }`.
- Edit inline atau form edit → `PUT /api/technologies/:id`, body sama (semua field boleh partial).
- Tombol hapus → `DELETE /api/technologies/:id`.
- Semua request tulis (POST/PUT/DELETE) kirim header `Authorization: Bearer <token>` dari localStorage. Kalau backend balas `401` (token invalid/expired), hapus token dan redirect ke login.

### c. Dashboard admin — kelola Projects & Kompetisi

- Tabel/list dari `GET /api/projects` (tanpa filter type, tampilkan semua, tandai badge PROJECT/COMPETITION).
- Form tambah/edit dengan field: `title`, `description`, `type` (`"PROJECT"` | `"COMPETITION"`, pakai select/radio), `techStack` (input tag/chip, dikirim sebagai array string), `demoUrl?`, `repoUrl?`, `imageUrl?`, `result?` (khusus kompetisi, misal "Juara 1"), `year?`, `order?`.
- Endpoint sama seperti Technologies: `POST /api/projects`, `PUT /api/projects/:id`, `DELETE /api/projects/:id`, semua butuh `Authorization: Bearer <token>`.

### d. Validasi & error handling

Backend pakai Zod dan akan balas `400` dengan bentuk `{ error: "Validation error", details: {...} }` kalau body tidak valid (misal `demoUrl` bukan URL valid, `name` kosong). Tampilkan pesan error yang cukup jelas ke user dari response ini, tidak perlu detail teknis lengkap — cukup misal "Data tidak valid, cek kembali form".

## Fokus kerja kamu

Semua UI, form, state management, routing `/admin`, dan wiring fetch ke endpoint di atas. Logic backend (validasi, auth, database) sepenuhnya sudah jadi dan live — kamu tidak perlu ubah apapun di luar repo frontend ini. Kalau ada kebutuhan endpoint baru atau perubahan response shape, kasih tahu saya dulu jangan diasumsikan sendiri.
