# Prompt untuk OpenCode — Redesign Total Admin Panel (Sidebar Layout)

Copy seluruh isi di bawah ini ke OpenCode.

---

Admin panel (`/admin`) sekarang fungsional (login, CRUD Teknologi & Project/Kompetisi semua sudah jalan end-to-end ke backend) tapi tampilannya masih sangat basic: header tipis + tab horizontal pill di atas konten. Redesign total jadi dashboard modern dengan **sidebar**, kualitas visual naik signifikan — anggap ini brief "upgrade dari prototype ke produk jadi".

## File yang terlibat

- `src/app/admin/layout.tsx` — saat ini cuma header tipis (judul "Admin Panel" + link "Lihat Website"). Ini titik awal restructure ke shell sidebar+konten.
- `src/app/admin/page.tsx` — render `<AdminDashboard>` setelah auth check.
- `src/components/admin/AdminDashboard.tsx` — saat ini: judul + tombol Keluar di baris atas, lalu tab pill horizontal ("Teknologi" / "Project & Kompetisi") untuk switch section. **Restructure ini jadi sidebar.**
- `src/components/admin/TechnologiesManager.tsx` dan `ProjectsManager.tsx` — form + tabel CRUD masing-masing section. **Logic-nya JANGAN diubah** (fetch, submit, delete, validasi semua sudah benar dan sudah tervalidasi jalan di production) — cuma boleh disentuh untuk penyesuaian visual/spacing kalau perlu menyesuaikan lebar konten baru, bukan logic-nya.
- `src/components/admin/ui.tsx` — primitives yang sudah ada (`Field`, `TextInput`, `SelectInput`, `TextArea`, `SubmitButton`, `SecondaryButton`, `IconButton`, `ErrorBanner`, `Badge`) sudah pakai HeroUI `Button` dengan variant (`primary`/`outline`/`danger-soft`/`ghost`) — **reuse ini**, jangan bikin sistem tombol baru dari nol supaya konsisten.

## Yang diinginkan

### Layout shell (`admin/layout.tsx` + `AdminDashboard.tsx`)

- **Sidebar kiri, persistent di desktop**, berisi:
  - Branding kecil di atas (logo/inisial + "Admin Panel", mirip yang sekarang di header tapi dipindah ke sidebar).
  - Nav item: **Teknologi** dan **Project & Kompetisi** (ganti dari tab horizontal pill ke nav vertikal di sidebar, dengan icon + label, active state yang jelas).
  - Bagian bawah sidebar: link "Lihat Website" (buka tab baru/navigasi ke `/`) dan tombol "Keluar" (logout) — dipisah jelas dari nav utama (misal ada divider atau grup terpisah).
- **Konten utama di kanan** — beri padding/max-width yang nyaman, tempat `TechnologiesManager`/`ProjectsManager` di-render sesuai section aktif.
- **Mobile**: sidebar jadi drawer/off-canvas yang bisa dibuka lewat tombol hamburger (pola serupa dengan mobile nav di halaman publik, tapi ini konteks admin terpisah) — jangan sampai admin panel tidak bisa dipakai di layar kecil.

### Kualitas visual ("50x lebih baik")

- Ini brief terbuka untuk polish signifikan, bukan sekadar pasang sidebar mentah. Beberapa ide yang boleh dieksplorasi (pilih yang pas, tidak harus semua):
  - Opsional: tambahkan ringkasan singkat di atas tiap section (misal jumlah data — "12 Teknologi", "5 Project") sebagai konteks, kalau tidak mengganggu kompleksitas.
  - Perbaiki visual tabel data (row hover, spacing, empty state yang lebih menarik dari teks polos "Belum ada data").
  - Perbaiki visual form (grouping, spacing antar field, label style) — tapi field/struktur form yang sudah ada (nama field, tipe input) tidak perlu diubah, cuma tampilannya.
  - Konsisten pakai variant `Button` yang sudah ada (`primary` untuk submit, `outline` untuk aksi sekunder/edit, `danger-soft` untuk hapus, `ghost` untuk aksi minor) — jangan improvisasi warna baru di luar itu.
  - Tunjukkan info admin yang sedang login kalau relevan (misal email admin, dari `getToken`/response login — cek apakah datanya sudah tersedia di state, kalau tidak ada dengan mudah, skip saja, jangan bikin API baru).

### Yang TIDAK boleh berubah

- Endpoint API, request/response shape, alur auth (localStorage token, redirect ke `/admin/login` saat 401) — semua logic di `admin-api.ts` dan handler-handler di `TechnologiesManager.tsx`/`ProjectsManager.tsx` tetap sama persis, cuma dibungkus tampilan baru.
- Field-field form (nama, kategori, tech stack, demo/repo URL, upload foto, dll) — struktur data yang dikirim ke backend tidak berubah.

## Fokus kerja kamu

Struktur layout (sidebar + shell), visual design system untuk admin panel, responsivitas mobile, dan polish keseluruhan. Tidak ada perubahan ke backend atau ke logic fetch/submit yang sudah ada.
