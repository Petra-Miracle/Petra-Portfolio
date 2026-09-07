# Prompt untuk OpenCode — Redesign Hero Section (referensi template)

Copy seluruh isi di bawah ini ke OpenCode. Saya (user) juga akan attach screenshot template
referensi langsung ke OpenCode kalau tool-nya mendukung image input — kalau tidak, deskripsi
di bawah ini sudah mendetail cukup untuk diimplementasikan tanpa gambar.

---

Restyle **Hero section** (`src/components/Hero.tsx`) dan **navbar** (`src/components/Navigation.tsx`)
mengikuti referensi desain berikut. Ini scope-nya cuma section pertama (foto+nama, layar awal) —
**bukan** section "Pengenalan/Tentang" (`About.tsx`), itu tetap section teks bio terpisah, tidak disentuh.

## Deskripsi referensi

**Navbar** (floating pill di atas, sudah ada strukturnya di `Navigation.tsx`, tinggal restyle):

- Container rounded-full/pill, background solid terang (bukan glassmorphism transparan seperti sekarang), sedikit shadow, floating dengan margin dari tepi atas.
- Kiri: logo kecil kotak rounded (bisa pakai inisial nama, misal kotak hitam dengan huruf pertama nama, putih) + nama di sebelahnya, bold, letter-spacing agak lebar.
- Tengah: nav links horizontal, uppercase, ukuran kecil, tracking lebar, warna abu-abu gelap dengan hover state.
- Kanan: (opsional, lihat catatan scope di bawah) tombol toggle theme bulat + tombol CTA pill solid gelap "Hire Me" / bisa diganti teks lain yang relevan (misal "Hubungi Saya"), mengarah ke section kontak/footer.
- Nav links yang dipakai tetap dari `siteConfig.navLinks` yang sudah ada (Beranda, Tentang, Teknologi, Project & Kompetisi, Kontak) — cuma restyle visualnya, isinya tidak berubah.

**Hero content**:

- Background terang/netral (bukan dark), full viewport height.
- Nama (`siteConfig.author.name`) ditampilkan sebagai **typography raksasa dengan outline/stroke saja (tanpa fill)**, memenuhi lebar layar, posisinya di belakang foto (z-index di bawah foto). Teks ini boleh terpotong/overflow di kedua sisi kiri-kanan viewport (efek "bleed") — pastikan pakai `overflow-hidden` di container supaya tidak muncul horizontal scrollbar.
- Foto (`siteConfig.author.image`) ditampilkan **besar, bentuk portrait/rectangular (bukan lingkaran kecil seperti sekarang)**, di-crop dari dada ke atas, posisi center, di atas (z-index lebih tinggi dari) teks outline nama.
- Scroll indicator dipindah dari bounce-chevron di bawah-tengah (yang sekarang) ke: tombol bulat kecil dengan chevron-down di sisi kanan, plus teks vertikal (rotate 90°) "SCROLL DOWN" di ujung kanan viewport.

## Catatan scope

- **Theme toggle (dark/light) itu opsional** — belum ada sistem dark mode di project ini sama sekali (belum ada `next-themes` atau strategi `dark:` class). Kalau mau diimplementasikan penuh itu kerjaan terpisah yang lebih besar (setup provider, persist preference, dsb). Untuk sekarang **boleh di-skip tombolnya dulu**, fokus ke layout utama (navbar shape, typography outline, foto besar, scroll indicator). Kalau saya minta dark mode nanti, itu jadi prompt terpisah.
- Role/deskripsi singkat (`siteConfig.author.role` + teks fokus) yang sekarang ada di Hero boleh tetap ditampilkan (misal sebagai subtitle kecil di bawah/dekat foto), tidak perlu dihapus — template referensi memang tidak menunjukkan itu di area yang ke-capture, tapi tidak ada salahnya tetap ada selama tidak mengganggu layout.
- Foto masih placeholder (`/avatar-placeholder.svg`) sampai saya upload foto asli — pastikan placeholder ini tetap terlihat wajar di layout baru yang lebih besar (tidak pecah/blur parah), saya akan ganti file-nya belakangan tanpa perlu ubah kode.
- Responsive: di mobile, typography outline raksasa + teks vertikal "SCROLL DOWN" kemungkinan tidak muat / terlalu ramai — desain fallback yang masuk akal (misal ukuran font outline diperkecil signifikan via `clamp()`/breakpoint, atau disembunyikan di layar sempit kalau memang tidak bisa dibuat proporsional). Jangan sampai ada horizontal scroll atau elemen overlap berantakan di mobile.

## Fokus kerja kamu

Layout, styling Tailwind, animasi (boleh reuse `Reveal.tsx` yang sudah ada), dan responsivitas. Tidak ada perubahan data/API di scope ini — murni visual.
