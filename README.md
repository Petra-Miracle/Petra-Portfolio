# Petra Portfolio

Frontend portfolio programmer — single page, scroll-based. Dibangun dengan **Next.js (App Router)**, **TypeScript**, **Tailwind CSS v4**, **HeroUI v3**, dan **Base UI**.

## Requirements

- Node.js 18+ (direkomendasikan 20+)
- Backend API Express + PostgreSQL (project terpisah)

## Setup

```bash
npm install
cp .env.example .env.local   # pada Windows: copy .env.example .env.local
npm run dev
```

Set `NEXT_PUBLIC_API_URL` di `.env.local` menunjuk ke backend (default: `http://localhost:4000`).

## Scripts

| Command           | Deskripsi                          |
| ----------------- | ---------------------------------- |
| `npm run dev`     | Jalankan development server        |
| `npm run build`   | Production build                   |
| `npm run start`   | Jalankan hasil build               |
| `npm run lint`    | ESLint                             |

## Integrasi API

Section **Teknologi** dan **Project & Kompetisi** mengambil data dari backend melalui Server Components:

- `GET /api/technologies`
- `GET /api/projects?type=PROJECT` dan `GET /api/projects?type=COMPETITION`

Semua fetch ada di `src/lib/api.ts`. Jika backend mati atau data kosong, section menampilkan *empty state* (tidak crash).

## Struktur

```
src/
├── app/               # layout + halaman utama
├── components/        # Section UI (Hero, About, Technologies, Projects, Footer, Navigation, Reveal)
├── config/site.ts     # Nama, nav links, socials (placeholder — isi sendiri)
└── lib/
    ├── api.ts         # Fetch client ke backend
    └── types.ts       # Tipe Technology & Project
```

## Catatan

- Placeholder teks/bio/avatar ditandai `TODO:` atau `[PLACEHOLDER: ...]` — isi sebelum deploy.
- Admin CRUD (`/admin`) mengelola Technologies & Projects lewat backend. Login di `/admin/login`; token disimpan di localStorage.