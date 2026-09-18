# Design Brief untuk pen.dev — Redesign Total Portfolio (User + Admin)

Copy seluruh isi di bawah ini sebagai prompt ke pen.dev.

---

Saya punya portfolio programmer yang sudah live dan fungsional (Next.js + Tailwind + HeroUI),
tapi tampilannya masih terasa seperti prototype/template generik. Saya mau redesign total dari
sisi visual — bukan cuma poles kecil, tapi angkat kualitas desainnya jadi setara produk/portfolio
studio desain profesional. Scope-nya mencakup **seluruh halaman publik DAN panel admin**.

## Konteks & Tujuan

- **Untuk siapa:** portfolio ini dipakai untuk memperkenalkan diri ke startup yang mencari
  developer. Audiens-nya adalah founder/CTO/hiring manager teknis yang akan menilai kemampuan
  saya sebagian dari kualitas portfolio ini sendiri — jadi desainnya harus mencerminkan
  ketelitian dan selera, bukan cuma "cukup rapi".
- **Kesan yang ingin dibangun:** profesional, percaya diri, modern, tidak generik/templated.
  Boleh berani secara visual (tipografi besar, layout tidak simetris, micro-interaction) selama
  tetap mudah dibaca dan tidak norak.
- **Kondisi sekarang:** monokrom (krem/putih + hitam), tipografi outline besar di Hero,
  navbar pill mengambang. Boleh dievolusikan dari arah ini atau diusulkan arah baru yang lebih
  kuat — beri sudut pandang desain yang jelas, jangan serba tanggung.

## Scope 1 — Halaman Publik (single-page, scroll, urutan section tetap)

### Hero (layar pertama)
Foto + nama sebagai fokus utama, ini first impression yang paling menentukan. Perlu terasa
seperti pembuka portfolio studio desain kelas atas, bukan template generik "foto bulat + nama
+ tagline". Boleh eksplorasi: tipografi ekspresif, layout foto tidak konvensional, interaksi
scroll/parallax halus.

### Pengenalan / Tentang
Bio singkat + highlight keahlian (3 poin: keahlian teknis, fokus kerja, value yang dibawa).
Desain ulang supaya terasa personal, bukan sekadar card grid template.

### Teknologi
Menampilkan daftar teknologi yang dikuasai, dikelompokkan jadi dua: teknologi umum
(bahasa/DB/framework) dan teknologi AI (tools AI yang dipakai sehari-hari). Data ini
dynamic/berubah-ubah (dikelola lewat admin panel), jadi desainnya harus tetap kuat baik saat
datanya banyak maupun sedikit (termasuk desain empty state kalau belum ada data).

### Project & Kompetisi
Daftar project dan daftar kompetisi/lomba yang pernah diikuti, masing-masing dengan deskripsi,
badge tech stack yang dipakai, link demo, link repo, dan untuk kompetisi ada info hasil (mis.
"Juara 1") dan tahun. Ini section paling penting untuk "menjual" kemampuan — desain card/list-nya
harus membuat tiap project terasa substantial, bukan list generik. Sama seperti Teknologi, ini
data-driven (dikelola dari admin), jadi rancang untuk kondisi 1 item sampai puluhan item, dan
untuk kondisi kosong.

### Footer
Ajakan kontak/kolaborasi, link sosial media/profesional, copyright. Ini juga jadi closing
impression, jangan didesain sebagai afterthought.

## Scope 2 — Admin Panel (khusus saya sebagai pemilik, bukan untuk publik)

Panel ini dipakai untuk tambah/edit/hapus data Teknologi dan Project & Kompetisi tanpa perlu
ubah kode. Audiensnya cuma saya sendiri, tapi tetap ingin terasa seperti dashboard produk yang
matang (bukan admin panel bawaan CRUD generator), karena ini juga mencerminkan kemampuan saya.

- **Login**: form email + password sederhana (satu akun admin saja, tidak ada registrasi).
- **Dashboard shell**: navigasi sidebar (bukan tab horizontal) — menu ke section Teknologi dan
  Project & Kompetisi, plus akses "Lihat Website" dan "Keluar" yang jelas terpisah dari menu
  utama.
- **Kelola Teknologi**: form tambah/edit (nama, kategori GENERAL/AI, icon opsional, urutan
  tampil) + tabel/list data yang ada dengan aksi edit & hapus.
- **Kelola Project & Kompetisi**: form tambah/edit yang lebih kompleks (judul, deskripsi, tipe
  PROJECT/KOMPETISI, tech stack berupa tag-tag, link demo, link repo, **upload foto** langsung
  dari device — bukan paste URL, hasil bisa ganti-nama/hapus foto, hasil kompetisi, tahun,
  urutan) + tabel/list data dengan aksi edit & hapus.
- Desain harus tetap nyaman dipakai di mobile (sidebar jadi drawer), karena saya kadang update
  data dari HP.

## Sistem Desain yang diharapkan sebagai output

- Palet warna (bisa evolusi dari monokrom sekarang atau arah baru — beri rekomendasi konkret,
  termasuk aksen warna kalau dipakai).
- Pasangan tipografi (heading + body) yang punya karakter, bukan default system font.
- Bahasa komponen konsisten: tombol (primer/sekunder/destruktif/ghost), input form, badge/tag,
  card, empty state — dipakai konsisten di seluruh halaman publik maupun admin, dua konteks ini
  boleh punya nuansa berbeda (publik = showcase/ekspresif, admin = fungsional/efisien) tapi tetap
  terasa satu keluarga desain.
- Perilaku responsif jelas untuk mobile, tablet, desktop di kedua scope (publik & admin).

## Catatan penting

- Ini murni brief desain visual — struktur data, field form, dan behavior (apa yang tersimpan,
  validasi, dsb) sudah final dan tidak perlu diubah, cuma dibungkus ulang secara visual.
- Hasil desain ini nantinya akan diimplementasikan ke codebase Next.js + Tailwind + HeroUI yang
  sudah ada, jadi akan sangat membantu kalau breakdown desainnya jelas per breakpoint (mobile/
  desktop) dan per komponen, bukan cuma satu mockup statis.
