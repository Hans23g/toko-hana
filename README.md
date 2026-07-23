# Toko Hana — Warungnya Rakyat

Aplikasi live Toko Hana berjalan dari file utama:

```txt
index.html
```

File `index.html` adalah CQ single-file bundle: semua logic aplikasi, library frontend, scanner barcode/QR, dan asset penting sudah berada di dalam satu file.

## Live

```txt
https://tokohana.vercel.app/
```

## Catatan Deploy

Repo ini dipakai sebagai repo deploy/static hosting.

Untuk update aplikasi:

1. Siapkan CQ terbaru yang sudah aman.
2. Rename/copy menjadi `index.html`.
3. Replace `index.html` di repo ini.
4. Vercel akan redeploy otomatis.

## Penting

- Jangan upload `.env` atau secret key.
- Jangan upload Supabase `service_role` key.
- Supabase publishable/anon key boleh berada di frontend selama RLS/policy database aktif.
- Jangan rebuild dari source lama jika belum disinkronkan.

## Prinsip Toko Hana

Sistem membaca data. Sistem memberi saran. Manusia tetap memutuskan.

Yang rumit biar sistem yang menanggung, yang mudah biar pengguna yang merasakan.
