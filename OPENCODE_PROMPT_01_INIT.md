# Prompt untuk OpenCode — Scaffold Frontend Portfolio

Copy seluruh isi di bawah ini ke OpenCode.

---

Buatkan project frontend portfolio programmer di direktori ini (`D:\Petra-Portfolio`) menggunakan:

- Next.js (App Router) + TypeScript
- Tailwind CSS
- HeroUI dan Base UI sebagai component library
- Deploy target: Vercel

## Struktur Halaman (single page, scroll-based)

1. **Hero** — foto saya dan nama saya sebagai fokus utama (full viewport pertama kali dibuka).
2. **Pengenalan** — deskripsi singkat tentang diri saya, keahlian, dan fokus sebagai programmer. (Konten statis dulu, nanti saya isi teksnya sendiri — buat placeholder yang jelas.)
3. **Teknologi yang Digunakan** — menampilkan daftar teknologi, dikelompokkan jadi dua: teknologi umum (bahasa/DB/framework) dan "Teknologi AI" (tools AI yang dipakai). **Data ini HARUS diambil dari API backend, bukan hardcoded** (lihat bagian Integrasi API di bawah).
4. **Project dan Kompetisi** — daftar project dan daftar kompetisi/lomba, masing-masing dengan deskripsi, badge teknologi yang dipakai, link demo (jika ada), link repository (jika ada). **Data ini juga HARUS diambil dari API backend.**
5. **Footer** — informasi kontak, link media sosial/platform profesional, link repository/informasi umum.

## Integrasi API (backend sudah jadi, terpisah di project lain)

Backend Express + PostgreSQL sudah tersedia dengan endpoint berikut (base URL akan di-set lewat env var `NEXT_PUBLIC_API_URL`, contoh lokal: `http://localhost:4000`):

### GET /api/technologies (publik)

Response: array of

```json
{
  "id": "string",
  "name": "string",
  "category": "GENERAL" | "AI",
  "icon": "string | null",
  "order": 0
}
```

### GET /api/projects (publik, optional query `?type=PROJECT` atau `?type=COMPETITION`)

Response: array of

```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "type": "PROJECT" | "COMPETITION",
  "techStack": ["string"],
  "demoUrl": "string | null",
  "repoUrl": "string | null",
  "imageUrl": "string | null",
  "result": "string | null",
  "year": 2024,
  "order": 0
}
```

Untuk section "Project dan Kompetisi", fetch dua kali (`?type=PROJECT` dan `?type=COMPETITION`) atau fetch semua lalu split di client — pilih pendekatan yang lebih rapi untuk kode kamu.

Gunakan Server Components / fetch di server (Next.js App Router) untuk data ini kalau memungkinkan, supaya section render dengan data ter-load (bukan spinner kosong). Tambahkan state kosong yang wajar (misal "Belum ada project" ) untuk kondisi API belum ada data / gagal fetch, jangan sampai crash halaman.

Buat file `.env.example` dengan isi:

```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Yang TIDAK perlu dikerjakan sekarang

- Halaman admin (login + CRUD form untuk Technologies dan Projects) — itu prompt terpisah menyusul setelah struktur dasar ini jadi.
- Konten teks final (bio, daftar project asli, dll) — pakai placeholder yang jelas ditandai, saya isi belakangan.

## Fokus kerja kamu

Struktur project, routing, layout responsif, styling (Tailwind + HeroUI/Base UI), animasi scroll yang halus antar section (boleh pakai library ringan kalau perlu), dan wiring fetch ke API di atas. Logic backend, auth admin, dan database sepenuhnya saya (Claude) yang urus di project terpisah — kamu fokus di frontend saja.
