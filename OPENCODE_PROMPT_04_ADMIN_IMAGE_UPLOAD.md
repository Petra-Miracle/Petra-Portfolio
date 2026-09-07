# Prompt untuk OpenCode — Ganti Form URL Foto Project jadi Upload Foto

Copy seluruh isi di bawah ini ke OpenCode.

---

Di halaman admin, form tambah/edit **Project** (`src/components/admin/ProjectsManager.tsx`) punya field `imageUrl` yang sekarang berupa text input untuk paste URL manual. Ganti jadi **form upload foto langsung** (input file), bukan paste URL.

## Endpoint baru yang tersedia

Backend sudah punya endpoint upload:

```
POST /api/uploads
Auth: Admin (Authorization: Bearer <token>)
Body: multipart/form-data, field name "file" (image, max 5MB)

Response sukses (201): { "url": "https://....public.blob.vercel-storage.com/..." }
Response error (400): { "error": "pesan error" } — misal file kebesaran atau bukan gambar
```

## Yang perlu diubah

1. Tambah fungsi baru di `src/lib/admin-api.ts` untuk hit endpoint ini, contoh signature:

   ```ts
   export async function uploadImage(token: string, file: File): Promise<{ url: string }> {
     const formData = new FormData();
     formData.append("file", file);

     const res = await fetch(`${API_URL}/api/uploads`, {
       method: "POST",
       headers: { Authorization: `Bearer ${token}` }, // JANGAN set Content-Type manual, biarkan browser set boundary multipart-nya sendiri
       body: formData,
     });

     if (res.status === 401) throw new ApiError("Sesi berakhir. Silakan login ulang.", 401);
     if (!res.ok) {
       const data = await res.json().catch(() => null);
       throw new ApiError(data?.error ?? "Upload gagal.", res.status);
     }
     return res.json();
   }
   ```

   (Sesuaikan dengan pola `ApiError`/`authedRequest` yang sudah ada di file itu — reuse helper yang relevan, jangan duplikasi logic yang tidak perlu.)

2. Di `ProjectsManager.tsx`, ganti text input `imageUrl` dengan:
   - `<input type="file" accept="image/*">`.
   - Saat user pilih file: langsung panggil `uploadImage(token, file)`, tampilkan state loading (misal "Mengupload...").
   - Sambil upload berjalan, tampilkan preview lokal instan pakai `URL.createObjectURL(file)` supaya user langsung lihat foto yang dipilih tanpa nunggu upload selesai.
   - Setelah upload sukses, simpan `url` dari response ke state form sebagai `imageUrl` (field ini yang nanti dikirim ke `POST`/`PUT /api/projects` seperti biasa, tidak berubah).
   - Kalau upload gagal (400/401/network error), tampilkan pesan error dari `ApiError.message`, jangan biarkan form submit dengan `imageUrl` kosong/rusak.
   - Untuk mode **edit** project yang sudah punya `imageUrl`, tampilkan foto yang sudah ada sebagai preview default, dengan opsi ganti foto (upload baru menimpa).
   - Disable tombol submit form selama upload sedang berjalan.

## Yang TIDAK berubah

- Field `imageUrl` di `ProjectInput`/`Project` type tetap string biasa (`src/lib/types.ts`) — tidak perlu diubah, cuma cara ngisinya yang berubah (dari ketik manual jadi hasil upload).
- Endpoint `POST`/`PUT /api/projects` tidak berubah, tetap terima `imageUrl` sebagai string URL.
- Section publik yang menampilkan foto project (`ProjectsSection.tsx`) tidak perlu diubah — dia cuma render `imageUrl` apa adanya, dan URL dari Vercel Blob itu valid URL gambar biasa.

## Fokus kerja kamu

UI upload (file picker, preview, loading/error state) dan wiring ke endpoint upload baru. Tidak ada perubahan struktur data lain di luar ini.
