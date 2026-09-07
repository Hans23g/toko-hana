# DB Schema + RLS Toko Hana — Checkpoint 2026-07-30

Dokumen ini mencatat skema DB yang sudah dibaca bersama CTO. Tujuannya agar meja baru tidak menebak-nebak.

## Kesimpulan cepat

### `orders`
Sudah punya pondasi lengkap untuk alur kurir:

```txt
id
status
resi
courier
courier_fee
courier_partner_id
delivery_zone
delivery_fee_customer
delivery_note
payment_note
courier_name
courier_phone
courier_status
assigned_courier_at
picked_up_at
delivered_at
customer_confirmed_at
delivery_proof_note
```

### `partners`
Cukup untuk Mitra Kurir Lite:

```txt
id
name
type
status
phone
area
address
image_url
description
notes
is_public
show_phone_public
sort_order
```

### `partner_applications`
Cukup untuk calon mitra/kurir:

```txt
partner_type
status
name
owner_name
phone
area
address
has_driver_license
driver_license_type
driver_license_image_url
vehicle_type
vehicle_plate
active_hours
```

### `customers`
Sudah menjadi sumber HanaPoin:

```txt
id
name
phone
address
total_spending
loyalty_points
referred_by
profile_photo_url
```

## Catatan penting

Belum ada kolom khusus:

```txt
courier_bonus_points
```

Karena itu **Bonus HanaPoin Kurir** saat ini dicatat di:

```txt
orders.payment_note
orders.delivery_proof_note
```

Format:

```txt
Bonus HanaPoin Kurir +250
```

Aplikasi membaca format ini untuk memberi poin dan laporan keuangan.

## RLS / Policy yang sudah dibaca

```csv
schemaname,tablename,policyname,permissive,roles,cmd,qual,with_check
public,orders,admin_delete_orders,PERMISSIVE,{public},DELETE,is_staff_admin(),null
public,orders,admin_update_orders,PERMISSIVE,{public},UPDATE,is_staff_admin(),is_staff_admin()
public,orders,auth_read_orders,PERMISSIVE,{public},SELECT,(auth.role() = 'authenticated'::text),null
public,orders,cashier_update_orders,PERMISSIVE,{public},UPDATE,is_staff_cashier_or_admin(),is_staff_cashier_or_admin()
public,orders,public_insert_orders,PERMISSIVE,{public},INSERT,null,true
public,partner_applications,admin_read_partner_applications,PERMISSIVE,{public},SELECT,is_staff_admin(),null
public,partner_applications,admin_write_partner_applications,PERMISSIVE,{public},ALL,is_staff_admin(),is_staff_admin()
public,partner_applications,public_insert_partner_applications,PERMISSIVE,{public},INSERT,null,true
public,partners,admin_write_partners,PERMISSIVE,{public},ALL,is_staff_admin(),is_staff_admin()
public,partners,public_read_active_public_partners,PERMISSIVE,{public},SELECT,((is_public = true) AND (status = 'active'::text)),null
```

## Implikasi

- Admin/kasir dapat update `orders`.
- Admin dapat kelola `partners`.
- Publik dapat insert `partner_applications`.
- Order online/offline dan kurir bisa dilanjutkan tanpa migration besar.

## Jika nanti tambah DB

Jika menambah tabel/kolom baru, wajib update dokumen ini dan checkpoint.

Calon tabel masa depan:

```txt
order_issues
admin_audit_logs
hanapoin_ledger
```

---

## ➕ TAMBAHAN 2026-08-08 — RPC Pintu Kecil Konfirmasi Pelanggan

- Fungsi: `public.customer_confirm_order_delivered(p_order_id text) → boolean`
- Sifat: SECURITY DEFINER, idempotent-ish (hanya jalan saat `status = 'Kurir Tiba'` → `'Selesai'`; selain itu tidak menyentuh apa pun).
- Kolom yang disentuh: `status`, `courier_status` ('diterima_pelanggan'), `customer_confirmed_at`, `delivery_proof_note` (append catatan).
- RLS `orders` TIDAK berubah — UPDATE langsung dari pelanggan tetap ditutup rapat.
- Berkas SQL: `db/RPC_KONFIRMASI_PELANGGAN_DITERIMA_2026-08-08.sql` (paste di Supabase SQL Editor → Run).
- App: `handleCompleteDeliveredOrder` cabang pelanggan kini RPC-first, fallback toast rasa jika RPC belum terpasang.
- Belum (next): RPC resmi pickup & tiba untuk Mitra Kurir (saat ini masih overlay lokal + update via kasir/admin).

---

## ➕ TAMBAHAN 2026-08-09 — RPC Pintu Kecil Mitra Kurir (Pickup & Tiba)

- `public.courier_confirm_pickup(p_order_id text, p_note text default '') → boolean` — hanya saat order 'Dikirim': set `courier_status='pickup'`, `picked_up_at`, append `delivery_proof_note`.
- `public.courier_confirm_arrived(p_order_id text, p_note text default ...) → boolean` — hanya saat order 'Dikirim' → 'Kurir Tiba': set `courier_status='tiba'`, `delivered_at`, append catatan ke `delivery_proof_note` + `payment_note`.
- SECURITY DEFINER; RLS orders tidak berubah — UPDATE langsung non-staf tetap ditutup.
- Berkas: `db/RPC_KURIR_PICKUP_TIBA_2026-08-09.sql` (paste di Supabase SQL Editor → Run).
- App: `handleCourierPickupOrder` & `handleCourierArrivedOrder` cabang kurir kini RPC-first (toast resmi saat sukses, fallback jujur saat pintu belum dipasang); cabang staf tidak berubah. Overlay lokal tetap sebagai pelapis UX kurir.
- Rantai resmi lengkap: Kurir tiba (RPC) → realtime pelanggan "Paket Sampai" → tombol Paket Diterima muncul → pelanggan nutup (RPC kemarin) → Selesai ☕
- Masih opsional next: kait server-side kurir↔akun (partner.customer_id) agar RPC bisa memastikan kurir yang bener memegang order.

---

## ➕ TAMBAHAN 2026-08-09 — RPC "Berangkat Jemput" + Ritual Serah Terima

- `public.courier_start_pickup(p_order_id text, p_note text default '') → boolean` — hanya saat order 'Dikirim' & paket belum dibawa/terserah: set `courier_status='menuju_toko'` + catatan.
- Berkas: `db/RPC_KURIR_MENUJU_TOKO_2026-08-09.sql`.
- Tahap resmi baru (sub-state `courier_status` selama `status='Dikirim'`):
  `ditugaskan` (kasir tugaskan) → `menuju_toko` (kurir: Berangkat Jemput, RPC) → `diserahkan` (kasir/admin: Serahkan Paket, UPDATE staf langsung) → `pickup` (kurir: Bawa Paket & Antar, RPC lama) → `tiba` → `diterima_pelanggan`.
- Label tampil via helper `getOrderStatusLabel(o)`: Kurir Ditugaskan / Kurir Menuju Toko / Siap Berangkat / Sedang Dikirim / Paket Sampai.
- handleShipOrder: Mitra Kurir → courier_status 'ditugaskan', picked_up_at null; ekspedisi/jalur cepat kasir tetap langsung 'dikirim'.
- handleCourierHandoverOrder: staf menandai serah terima (tanpa RPC, RLS staf).
- Notif realtime & statusNote pelanggan mengikuti tiap tahap (ditugaskan/menuju_toko/diserahkan/jalan).

---

## ➕ TAMBAHAN 2026-08-09 — Rantai "Diterima Oleh" (Serah Terima Manusiawi)

- RPC `customer_confirm_order_delivered` → V2: signature baru `(p_order_id text, p_note text default '')`. File db/RPC_KONFIRMASI_PELANGGAN_DITERIMA_2026-08-08.sql mengandung DROP + create ulang (jalankan lagi, aman).
- Konvensi catatan (kolom notes, tanpa kolom baru):
  - Kurir "Paket Sampai" → prompt "Diterima oleh siapa?" → `Paket telah sampai & diterima oleh: X. Menunggu konfirmasi paket diterima pelanggan.` masuk delivery_proof_note + payment_note.
  - Pelanggan "Paket Diterima" → penutup: `Barang diterima oleh X (sesuai catatan kurir) dan dikonfirmasi pelanggan melalui aplikasi.`
  - Kartu pelanggan & notifikasi "Paket Sampai" menampilkan "Tercatat diterima oleh X (catatan kurir)".
  - X diekstrak dari regex `Diterima oleh:\s*([^|]+)` pada delivery_proof_note; fallback "pelanggan yang bersangkutan" untuk order lama.
- Jalur staf (kasir/admin tandai sampai) tetap kalimat dasar tanpa prompt.

---

## ➕ TAMBAHAN 2026-08-09 — RPC Ambil Job Pickup Sendiri (Pickup List)

- `public.courier_claim_pickup_job(p_order_id text, p_courier_name text, p_courier_phone text default '', p_courier_partner_id bigint default null, p_courier_fee numeric default 0, p_note text default '') → boolean`
- Guard atomik anti-rebutan: hanya order `status='Diproses'` TANPA kurir (`courier_partner_id` null + `courier` kosong + `courier_status` kosong). Dua kurir menekan bersamaan → hanya satu TRUE.
- Klaim mengisi: courier*, `courier_status='ditugaskan'`, `assigned_courier_at`, catatan; status → 'Dikirim' → masuk ritual pengiriman standar.
- Berkas: `db/RPC_KURIR_AMBIL_JOB_PICKUP_2026-08-09.sql`.
- App: panel Mitra Kurir punya sub-panel "Pickup List • Ambil Job Sendiri" (pool = order 'Diproses' ber-alamat, tanpa kurir, bukan ambil-diri; urut antrian terlama). Tombol "🙋 Ambil Job Pickup Ini" → konfirmasi → RPC → toast resmi/gagal jujur + fetchOrders.
- Ekspedisi & Kurir Toko/Warga: tidak ikut Pickup List — konfirmasi tetap jalur kasir/admin.

---

## ➕ TAMBAHAN 2026-08-09 — (tanpa perubahan DB) Struk Bukti Pengiriman

Fitur struk bukti (kurir/WA/jejak waktu/penerima/kode TH) murni lapisan app di handlePrintReceipt; tidak ada kolom/tabel/fungsi DB baru. Kode TH = hash deterministik dari kolom orders yang sudah ada.
