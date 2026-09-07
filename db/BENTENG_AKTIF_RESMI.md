# 🛡️ BENTENG AKTIF RESMI — Keamanan Database Toko Hana
> Dokumen SATU-SATUNYA rujukan keamanan DB yang berlaku.
> CTO/meja baru: BACA INI DULU sebelum menyentuh SQL apapun.

## Status Terkini (per September 2026)
- ✅ RLS AKTIF di 6 tabel: products, categories, banners, settings, customers, orders
- ✅ Policy benteng era CTO1 terpasang & lolos uji penetrasi 7/7
- ✅ 4 RPC "Pintu Kecil" terpasang (era CTO3) — kurir & pelanggan update status via loket aman
- ✅ Aplikasi live lancar: https://tokohana.vercel.app/

## Arsitektur Keamanan (bahasa warung)
| Lapisan | Analogi | Detail |
|---|---|---|
| Anon key di kode | Kunci pintu depan | Boleh publik — aman karena benteng |
| RLS Policy | Lemari kaca terkunci | Publik: lihat etalase saja. Tulis: admin only. PII pelanggan/orders: tertutup dari anon |
| RPC SECURITY DEFINER | Loket khusus | Kurir/pelanggan lakukan SATU aksi spesifik tanpa kunci lemari |
| Supabase Auth | Buku tamu resmi | Password admin TIDAK ada di kode — verifikasi server |

## Loket RPC yang Terpasang (file di db/RPC_*.sql — SUDAH dijalankan)
1. `courier_claim_pickup_job` — kurir ambil job (order 'Diproses' tanpa kurir)
2. `courier_start_pickup` — kurir menuju toko (order 'Dikirim')
3. `courier_confirm_pickup` — kurir bawa paket (order 'Dikirim')
4. `courier_confirm_arrived` — paket sampai → 'Kurir Tiba'
5. `customer_confirm_order_delivered` — pelanggan tutup order ('Kurir Tiba' → 'Selesai')

## ⛔ PERINGATAN KERAS
- `_archive/audit_opencode_jangan_dijalankan/SECURE_RLS_TOKO_HANA.sql.JANGAN-DIJALANKAN`
  = hasil audit robot OpenCode. Syntax error + membuka celah (anon baca orders,
  anon hapus order). JANGAN PERNAH dijalankan. Disimpan hanya sebagai arsip audit.
- `_archive/api_proxy_nonaktif/supabase-proxy.js.NONAKTIF`
  = proxy service_role TANPA autentikasi + CORS bebas. Dinonaktifkan.
  Jika kelak butuh proxy, WAJIB: auth check + origin whitelist + rate limit.

## Aturan Emas untuk CTO Berikutnya
1. Jangan pernah DISABLE ROW LEVEL SECURITY di tabel manapun
2. Jangan pernah commit service_role key ke repo
3. Kalau fitur baru butuh akses tulis untuk role non-admin → buat RPC loket sempit, JANGAN longgarkan policy
4. Setiap perubahan policy → uji penetrasi ulang (pola uji: lihat riwayat CTO1 — tes anon SELECT/UPDATE/DELETE tiap tabel)
