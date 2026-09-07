# Update 2026-07-30 — Mitra Kurir Pickup Lite

Ngopi boleh pindah meja, arah Toko Hana jangan ikut hilang.

## Tujuan

Menyiapkan halaman order yang bisa berubah sesuai peran.

Untuk pelanggan biasa:

```txt
Halaman order menampilkan status/riwayat belanja sendiri.
```

Untuk pelanggan yang juga sudah menjadi `Mitra Kurir Aktif`:

```txt
Halaman order menampilkan form pickup di paling atas,
baru di bawahnya tetap ada riwayat belanja pribadi.
```

## Deteksi Mitra Kurir

Tahap lite ini belum membuat role auth baru.

Akun dianggap sebagai Mitra Kurir Aktif jika:

```txt
currentUser.role = customer
```

dan cocok dengan data:

```txt
partners.type = courier
partners.status = active
```

Pencocokan dilakukan lewat:

```txt
nomor WA / phone
atau nama
```

## Perubahan UI halaman order

Untuk akun pelanggan yang cocok dengan Mitra Kurir Aktif, header halaman order berubah menjadi:

```txt
Ruang Order Mitra Kurir
Pickup & Riwayat Pesanan
```

Bagian paling atas berisi:

```txt
Form Pickup Mitra Kurir
Meja Pickup Paket
```

Isi panel:

- mini Kartu Mitra Kurir,
- nama mitra,
- area/WA,
- status aktif,
- saldo HanaPoin,
- catatan pickup opsional,
- daftar paket yang ditugaskan ke kurir tersebut,
- tombol:
  - `Konfirmasi Pickup`,
  - `Paket Sampai`,
  - `WA` pelanggan.

Di bawah panel pickup, `Riwayat Belanja Saya` tetap tampil seperti biasa.

## Perubahan kartu profil

Jika akun pelanggan cocok sebagai Mitra Kurir Aktif, kartu profil memakai rasa:

```txt
Kartu Mitra Kurir Toko Hana
🛵 Mitra Kurir Toko Hana
```

Tetap mempertahankan HanaPoin member karena kurir juga pelanggan/member.

## Status operasional

Saat kurir klik:

```txt
Konfirmasi Pickup
```

order diperbarui:

```txt
courier_status = pickup
picked_up_at = now()
delivery_proof_note += Paket di-pickup/dibawa oleh Mitra Kurir...
payment_note += Catatan pickup...
```

Saat kurir klik:

```txt
Paket Sampai
```

menggunakan alur yang sudah ada:

```txt
status = Kurir Tiba
courier_status = tiba
```

Pelanggan/admin tetap menutup order dengan `Paket Diterima` / konfirmasi selesai.

## Kebijakan HanaPoin

Bonus HanaPoin tetap hanya untuk:

```txt
Mitra Kurir Aktif
```

Ekspedisi luar / jasa pengiriman umum tidak mendapat poin.

Poin masuk saat order selesai/diterima, bukan saat pickup.

## DB

Tidak ada migration.

Kolom yang sudah ada dan dipakai:

```txt
orders.courier_status
orders.picked_up_at
orders.delivery_proof_note
orders.payment_note
partners.type
partners.status
```

## Tes teknis

```bash
node --check /tmp/tokohana_app_script_check.js
```

Hasil: OK.

## Catatan arah berikutnya

Ini pondasi untuk fase berikutnya:

```txt
Akun Mitra Kurir
```

Nanti bisa diperkuat dengan:

- role/auth khusus mitra kurir,
- partner/customer ID eksplisit,
- halaman paket ditugaskan,
- ledger fee kurir,
- ledger HanaPoin kurir.

---

## Fix — Paket Ditugaskan Belum Tampil di Form Pickup

Masalah saat test:

```txt
Admin/kasir sudah menugaskan order ke Mitra Kurir Aktif,
tetapi akun kurir belum melihat paket di Form Pickup.
```

Fix:

- Mapping order dari Supabase sekarang membawa kolom kurir lengkap.
- Form Pickup membaca `courier_partner_id`, `courier_phone`, `courier_name`, `courier`, dan `kurir`.
- Akun kurir refresh order saat membuka halaman Order/Profil.
- Jika sudah terdeteksi sebagai Mitra Kurir Aktif, app polling ringan tiap ±15 detik.
- Penugasan Mitra Kurir sekarang wajib memilih nama mitra aktif, tidak cukup hanya memilih label `Mitra Kurir Aktif`.

Checklist test:

```txt
Pilih Mitra Kurir Aktif
→ pilih nama mitra di dropdown
→ Catat Paket Dikirim
→ akun kurir buka/refresh menu Order
→ paket muncul di Form Pickup
```

---

## Fix — Status Pickup Mental Balik

Masalah:

```txt
Kurir klik Konfirmasi Pickup.
Status berubah sesaat, lalu kembali menjadi Perlu Pickup.
```

Penyebab:

```txt
Update lokal berhasil, tetapi update database ditolak RLS karena akun kurir masih role customer/member.
Polling kemudian menarik data lama dari DB.
```

Fix lite:

- Status pickup/paket sampai dari kurir disimpan di localStorage:

```txt
toko_hana_courier_local_order_patches
```

- Saat daftar order di-refresh dari DB, patch lokal digabung kembali.
- Ini mencegah UI kurir mental balik di perangkat kurir.

Batasan:

```txt
Belum sinkron permanen lintas perangkat jika RLS DB belum mengizinkan update kurir.
```

Fase berikutnya perlu DB/RPC khusus kurir agar update pickup benar-benar tercatat secara resmi di Supabase dengan aman.
