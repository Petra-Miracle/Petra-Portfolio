# Prompt untuk OpenCode — Implementasi Redesign dari pen.dev Mockup

Copy seluruh isi di bawah ini ke OpenCode. Ini adalah spec **presisi**, diekstrak langsung dari
file `Pendev/Petra-Portfolio.pen` (bukan interpretasi/tebakan) — semua warna, ukuran font, spacing,
dan copy text di bawah adalah nilai eksak dari mockup. File `.pen` terenkripsi jadi tidak bisa kamu
baca langsung; anggap dokumen ini sebagai sumber kebenaran visual.

## PENTING — baca dulu sebelum mulai

1. **Design tokens sudah diterapkan** di `src/app/globals.css` dan `src/app/layout.tsx` (palet
   krem/hitam + aksen lime, font Bricolage Grotesque/Inter/JetBrains Mono, radius & spacing scale).
   Jangan diubah lagi, tinggal dipakai.
2. **Sidebar admin sudah diimplementasi ulang** di `src/components/admin/AdminDashboard.tsx` dan
   `src/app/admin/layout.tsx` (passthrough minimal, sidebar cuma untuk dashboard bukan login) —
   sesuai spec di bawah. **Jangan revert ke versi tab-horizontal-blue yang lama.** Kalau ada
   perbaikan/perubahan, lanjutkan dari struktur ini.
3. **Mockup pakai data contoh** ("Rafi Aditya", "rafiaditya.dev", project/tech contoh) — itu
   placeholder dari template, **BUKAN konten asli**. Style/layout-nya yang diikuti, tapi data tetap
   pakai `siteConfig` (nama: Petra Lenggu) dan data dari API (`fetchTechnologies`/`fetchProjects`)
   yang sudah ada — **jangan hardcode data placeholder dari mockup**.
4. Struktur data, endpoint, dan behavior (fetch, submit, validasi) **tidak berubah** — ini murni
   redesign visual di atas logic yang sudah berfungsi.

---

## 1. Design Tokens (referensi — sudah live di kode)

```
Warna:
  ink: #15140F        ink-soft: #26241B      ink-line: #3A382C
  paper: #F7F3E9       paper-dim: #EEE8D8      paper-line: #DED5B9
  muted-on-paper: #726C57    muted-on-ink: #A29C87
  accent: #C7F23C     accent-deep: #9CCB1E    accent-ink: #15140F
  danger: #D6482F     danger-soft: #F6D9CF
  success: #3E7D3A    success-soft: #DCE9CE

Font: display = Bricolage Grotesque, body = Inter, mono = JetBrains Mono
Radius: s=6  m=14  l=28
Spacing: xs=8  s=16  m=24  l=40  xl=64  2xl=96
```

Mapping ke CSS var yang sudah ada: `ink`→`--foreground`/`--dark`, `paper`→`--background`,
`paper-dim`→`--surface-alt`, `paper-line`→`--border`, `ink-line`→`--border-strong`,
`ink-soft`→`--dark-surface`, `muted-on-paper`→`--muted`, `muted-on-ink`→`--dark-muted`.

**Pola ritme warna penting**: section publik berselang-seling gelap/terang —
Hero(gelap) → About(terang) → Tech(gelap) → Projects&Competitions(terang) → Footer(gelap).
Pertahankan pola ini, jangan disamakan semua terang.

## 2. Komponen Inti

### Button (5 variant) — cornerRadius 6 semua

| Variant | fill | text/icon | stroke |
|---|---|---|---|
| Primary | `accent` #C7F23C | `accent-ink` #15140F, weight 600 | - |
| Secondary | `ink` #15140F | `paper` #F7F3E9, weight 600 | - |
| Outline | transparent | `ink` #15140F, weight 600 | `ink-line` #3A382C, 1px |
| Ghost | transparent | `muted-on-paper` #726C57, weight 600 | - |
| Destructive | `danger` #D6482F | `paper` #F7F3E9, weight 600 | - |

Padding: Primary/Secondary/Destructive `12px 22px`, Outline `11px 21px`, Ghost `10px 14px`.
Semua Inter 14px, gap icon-label 8px (Ghost 6px). Icon 16x16 (lucide).

Ini match dengan variant HeroUI yang **sudah dipakai** di `ui.tsx`/`ProjectsManager.tsx`/dll
(`primary`/`outline`/`ghost`/`danger-soft`) — sesuaikan warnanya ke token baru ini, jangan bikin
sistem button baru. Catatan: mockup tidak punya varian `secondary`/`danger-soft` HeroUI yang
sekarang dipakai untuk beberapa tombol — untuk `danger-soft` (dipakai di tombol hapus tabel admin),
ikuti pola icon-button outline dengan warna danger di bawah (section Table Admin).

### Input

Label (Inter 13/500/`ink`) → Box (fill `paper-dim`, stroke `paper-line`, radius 6, padding
`10px 14px`, isi Inter 14/normal/`muted-on-paper` sbg placeholder atau `ink` kalau ada value) →
Helper text opsional (Inter 12/normal/`muted-on-paper`). State error: stroke Box jadi `danger`,
helper text jadi `danger` + warna value jadi `ink`.

### Badge / Tag

- **Tag/Tech** (teknologi umum, default): fill `paper-dim`, stroke `paper-line`, padding `6px 12px`, teks JetBrains Mono 12 `ink`.
- **Tag/AI** (untuk kategori AI): fill `ink` solid, teks JetBrains Mono 12 warna `accent` (#C7F23C) — AI tools menonjol dengan chip gelap+lime.
- **Tag di atas section gelap** (mis. techStack di Tech section pada dark bg): fill `ink-soft`, stroke `ink-line`, teks `paper`.
- **Badge/Success** (hasil kompetisi, mis. "Juara 1"): fill `success-soft`, teks+icon `success` weight 600, ada icon trophy.
- **Badge/Neutral** (tahun, dll): transparent, stroke `ink-line`, teks JetBrains Mono 12 `ink`.

### Card & Empty State

- **Card**: fill `paper-dim`, stroke `paper-line`, radius 14. Slot: Header(padding 20, title Bricolage 18/600 + description Inter 13 muted), Content(padding), Actions(padding 20, gap 12, tombol outline+primary).
- **Empty State**: stroke `paper-line`, radius 14, padding 56, center-aligned, gap 12: icon wrap (48x48, fill `paper`) → title Bricolage 16/600 → description Inter 13 muted → tombol CTA primary dengan icon plus. Contoh copy: "Belum ada project" / "Tambahkan project pertama untuk menampilkannya di sini." — sesuaikan teks per section (Technologies vs Projects).

## 3. Halaman Publik

### Navbar (`Navigation.tsx`)

Pill mengambang, fill `ink` (#15140F, gelap — solid bukan glassmorphism), radius penuh (pill),
padding `12px 12px 12px 24px`, gap 32.
- Logo: inisial + titik dalam JetBrains Mono 15/600 warna `accent` (contoh mockup "RA." → punya kita jadi sesuai `siteConfig`, hitung inisial dari nama).
- Nav links: Inter 14/500 warna `muted-on-ink` (#A29C87), gap 24. Label: Tentang, Teknologi, Karya (map ke "Project & Kompetisi"), Kontak.
- CTA kanan: Button Primary "Hubungi Saya", padding `10px 18px`, tanpa icon.

### Hero (`Hero.tsx`)

Section fill **`ink`** (gelap!), padding `140px 80px 80px 80px`, gap 40, height ~920 desktop.

- **Hero Left**: Role tag (pill outline stroke `ink-line`, dot lime 6px + label JetBrains Mono 11 `muted-on-ink` letter-spacing 0.8, teks "FULL-STACK DEVELOPER" → sesuaikan role Anda) → Headline nama, Bricolage Grotesque **128px**/600, warna `paper`, 2 baris (nama depan \n nama belakang) → Subhead Inter 18 `muted-on-ink` → CTA row gap 16: Button Primary "Lihat Karya" (icon arrow-right) + Button Outline "Unduh CV" (icon download, teks/icon putih karena di atas bg gelap — override warna outline jadi `paper` bukan `ink` khusus di Hero).
- **Hero Right**: foto dengan accent shape lime di belakang (offset 24,24, radius 28, ukuran sama persis dengan foto 400x520) menciptakan efek "bingkai" lime di belakang foto → Stat chip mengambang di foto (fill `paper`, stroke `ink-line`, icon sparkles + teks "5+ TAHUN PENGALAMAN" JetBrains Mono 11 — sesuaikan angka).
- Scroll cue kiri-bawah: teks vertikal "SCROLL" + icon arrow-down, `muted-on-ink`.
- Mobile: headline turun ke 56px, foto di atas (bukan di samping), CTA row jadi 2 tombol full-width stacked.

### Tentang / About (`About.tsx`)

Section fill `paper` (terang), padding `140px 80px`, gap 100, 2 kolom.

- **Kiri**: Eyebrow "TENTANG" (JetBrains Mono 12 `muted-on-paper`) → Headline Bricolage 40/600 `ink` ("Developer yang berpikir seperti product owner." — ganti sesuai positioning Anda) → Bio paragraph Inter 17 `muted-on-paper`.
- **Kanan**: 3 highlight row (bukan card grid!) dipisah garis atas `paper-line`, tiap row: nomor "01"/"02"/"03" JetBrains Mono 14 warna `accent-deep` (#9CCB1E) + title Bricolage 17/600 `ink` + deskripsi Inter 14 `muted-on-paper`. Ini **beda dari card grid yang sekarang** — ganti jadi list bernomor dengan divider, bukan 3 box terpisah.

### Teknologi (`Technologies.tsx`)

Section fill **`ink`** (gelap), padding `100px 80px 140px 80px`, gap 56.

- Header: Eyebrow "TUMPUKAN TEKNOLOGI" + Headline Bricolage 36/600 `paper`.
- **Teknologi Umum** (kategori GENERAL dari API): label Inter 13/600 `muted-on-ink`, lalu tag-tag wrap dalam row(s) — tiap tag pakai gaya "tag di atas gelap" (fill `ink-soft`, stroke `ink-line`, teks `paper`, JetBrains Mono 12).
- **Tools AI** (kategori AI dari API): label sama, tag pakai gaya default **terang** (fill `paper-dim`, teks `ink`) — supaya AI tools menonjol kontras dari bg gelap. Ini pembeda visual sengaja antara dua kategori.

### Project & Kompetisi (`ProjectsSection.tsx`)

Header section (fill `paper`, padding `140px 80px 56px 80px`): Eyebrow "KARYA & KOMPETISI" + Headline Bricolage 36/600 `ink` + motion note kecil JetBrains Mono 12 muted ("◂ berjalan otomatis, tanpa jeda").

Konten-nya berupa **dua marquee horizontal auto-scroll terpisah** (bukan grid statis) — reuse
mekanisme `.animate-marquee` yang sudah ada di `globals.css` (dipakai di Hero untuk nama), styling
mask fade di kiri-kanan (`Fade Left`/`Fade Right`, gradient transparent→solid).

- **Projects Marquee** (data `type=PROJECT`, fill section `paper`): tiap card 300x354, **Project Marquee Card**: fill `paper-dim`, stroke `paper-line`, radius 14 — image slot (170px tinggi, top) → body (padding 18, gap 10): title Bricolage 17/600, description Inter 13 muted 2 baris, tags row (2 chip tech), links row (2 icon-button 30x30 outline: external-link untuk demo, github untuk repo).
- **Competitions Marquee** (data `type=COMPETITION`, fill section `paper` juga tapi card gelap): tiap card 300x210, **Competition Marquee Card**: fill `ink-soft` (#26241B), radius 14, padding 20, gap 14 — head row (icon wrap 40x40 fill `ink` + icon trophy `accent`, lalu badge hasil kompetisi mis. "Juara 1") → title Bricolage 17/600 `paper` → description Inter 13 `muted-on-ink` → foot row (tag tech stack + tahun JetBrains Mono 12 `muted-on-ink`).
- Kalau data kosong untuk salah satu tipe, tampilkan Empty State (lihat komponen di atas) alih-alih marquee kosong.

### Footer (`Footer.tsx`)

Fill **`ink`** (gelap), padding `120px 80px 48px 80px`, gap 64.

- Eyebrow "KONTAK" → Headline besar Bricolage **56px**/600 `paper` ("Punya proyek yang\ningin dibangun?") → Email row: teks email Bricolage 26/500 warna `accent`, underline stroke `accent`, icon arrow-up-right — bukan tombol biasa, jadi link email besar bergaya.
- Social row (border-top `ink-line`): tiap social jadi pill outline (stroke `ink-line`, padding `10px 16px`, gap 8): icon + label ("GitHub", "LinkedIn", "Twitter / X", "Instagram") warna `paper`.
- Bottom bar (border-top `ink-line`): copyright kiri + "Dibangun dengan Next.js & Tailwind CSS" kanan, keduanya JetBrains Mono 12 `muted-on-ink`.

## 4. Admin Panel

### Sidebar — SUDAH DIIMPLEMENTASI, jangan diulang dari nol

Referensi kalau perlu cross-check `AdminDashboard.tsx`: fill `ink` (dark, width 260px), Header
(logo mono `{inisial}.` warna accent + "Admin"), nav item aktif fill `ink-soft` + icon `accent` +
teks `paper` bold, nav item default icon+teks `muted-on-ink`, Footer border-top `ink-line` berisi
"Lihat Website" (muted) + "Keluar" (warna `danger`).

### Login (`admin/login/page.tsx`)

**Ganti dari card tunggal center jadi split-screen 2 panel** (mengikuti pola sama seperti Brand
Panel di public site punya rasa berbeda tapi konsisten dark/light):

- **Brand Panel** (kiri, 560px lebar desktop, fill `ink`, padding 56): logo mono `{inisial}.` warna
  accent (top) → tengah: eyebrow "PANEL ADMIN" JetBrains Mono 12 `muted-on-ink` + headline besar
  Bricolage 40/600 `paper` ("Kelola teknologi\ndan karya Anda\ndi satu tempat.") → bawah: teks
  kecil JetBrains Mono 11 `muted-on-ink` (mis. domain + "— dashboard internal").
- **Form Panel** (kanan, sisa lebar, fill `paper`): card berisi judul "Masuk ke Admin" Bricolage
  26/600, subtext Inter 14 muted, input Email + Password (pakai style Input di atas, TANPA
  helper text di sini), Button Primary full-width "Masuk".
- Mobile: Brand Panel jadi block ringkas di atas (bukan panel penuh), Form Panel di bawahnya.

### Kelola Teknologi & Kelola Project — GANTI DARI FORM INLINE JADI MODAL

**Perubahan struktural penting**: form tambah/edit yang sekarang selalu tampil di atas tabel
(`TechnologiesManager.tsx`/`ProjectsManager.tsx`) di-**pindah ke modal** yang muncul saat klik
tombol "Tambah" atau icon edit di baris tabel. Tabel jadi elemen utama yang langsung terlihat.

**Page Header**: judul section Bricolage 24/600 `ink` + subtitle Inter 13 muted (kiri), Button
Primary "Tambah Teknologi"/"Tambah Karya" dengan icon plus (kanan).

**Table**: header row (stroke bottom `paper-line`, padding `14px 20px`, label kolom JetBrains Mono
11 `muted-on-paper` uppercase-style) lalu data row (stroke bottom `paper-line`, padding
`14px 20px` atau `12px 20px` untuk row dengan foto). Kolom Teknologi: Nama, Kategori (badge),
Icon, Urutan, Aksi. Kolom Project: Foto (thumbnail 44x44 rounded), Judul (+ tech stack kecil di
bawahnya), Tipe (badge), Tahun, Aksi. Aksi = 2 icon-button 30x30: edit (outline, icon pencil `ink`)
+ hapus (outline warna `danger`, stroke+icon `danger`, icon trash-2).

**Modal** (overlay fill `paper`, stroke `paper-line`, radius 14 — dengan scrim gelap di belakang):
header (judul Bricolage 18/600 + tombol close 'x'), body (padding 24, gap 18, field-field sesuai
form yang sudah ada — untuk Project modal termasuk: Tipe (segmented control 2 pilihan seperti
Kategori di Modal Teknologi), Judul, Deskripsi (textarea fill `paper-dim`), **Foto** (preview 72x72
+ tombol "Ganti Foto"/"Hapus" — ini sudah sama persis dengan yang kamu implementasi sebelumnya di
`ProjectsManager.tsx`, cuma dipindah ke dalam modal), Tech Stack (tag input dengan chip
removable), Link Demo, Link Repo, Hasil Kompetisi, Tahun, Urutan), footer (padding 24, gap 12:
Button Outline "Batal" + Button Primary "Simpan").

Field kategori/tipe pakai **segmented control** (2 opsi bersebelahan, opsi aktif fill `ink` teks
`paper`, opsi tidak aktif stroke `paper-line` teks muted) — ganti dari `<select>` dropdown yang
sekarang.

Mobile: modal jadi full-screen bukan overlay card, top bar dengan tombol back + judul + (untuk
list, bukan modal) tombol tambah cepat di kanan.

## Fokus kerja kamu

Semua visual/styling di atas untuk public site + admin (login, table, modal). Data fetching,
validasi, auth, dan endpoint API **tidak berubah** — cuma dibungkus tampilan baru sesuai spec ini.
Kalau ada detail yang tidak disebutkan di sini (misal microcopy atau spacing kecil), pakai
judgement desain yang konsisten dengan sistem token di atas.
