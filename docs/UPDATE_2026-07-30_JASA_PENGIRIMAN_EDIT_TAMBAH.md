# Update 2026-07-30 — Jasa Pengiriman Bisa Edit & Tambah

Ngopi boleh pindah meja, arah Toko Hana jangan ikut hilang.

## Tujuan

Fitur `Jasa Pengiriman Aktif` di `Admin → Kategori` sebelumnya hanya untuk centang aktif/nonaktif sementara.

Update ini menambah kebutuhan operasional:

```txt
Kalau ekspedisi bawaan sedang tidak cocok / tidak tersedia,
admin bisa mengganti nama jasa pengiriman atau menambah jasa pengiriman lain.
```

## Perubahan aplikasi

Lokasi UI:

```txt
Admin → Kategori → Jasa Pengiriman Aktif
```

Sekarang panel memiliki:

1. Checklist aktif/nonaktif sementara.
2. Kolom edit nama jasa pengiriman langsung di tiap baris.
3. Form `Tambah jasa lain`, contoh:
   - Lion Parcel
   - Ninja Xpress
   - AnterAja
   - Paxel
4. Tombol `Hapus` untuk jasa pengiriman tambahan/custom.
5. Tombol `Reset` untuk mengembalikan daftar bawaan.

## Perilaku operasional

- Checklist dipakai untuk menyembunyikan sementara jasa yang sedang tidak bisa dipakai.
- Edit nama dipakai untuk mengganti jasa bawaan, misalnya `JNE Reguler` diganti menjadi `Lion Parcel`.
- Tambah dipakai kalau Toko Hana ingin memakai jasa baru tanpa mengorbankan daftar bawaan.
- Jasa bawaan tidak dihapus permanen; bisa diedit/nonaktifkan, dan `Reset` akan mengembalikan semuanya.
- Jasa tambahan/custom bisa dihapus.

## Penyimpanan

Tetap memakai setting yang sama:

```txt
localStorage: toko_hana_shipping_services
Supabase settings: shipping_services
```

Tidak ada perubahan DB / migration.

## Dampak ke form kurir/resi

Daftar aktif langsung dipakai oleh:

```txt
Kasir → Orders → Order Online → Pilih Kurir/Resi
Admin → Pengiriman → Pilih kurir/ekspedisi
```

`Mitra Kurir Aktif` tetap opsi khusus terpisah yang membaca:

```txt
partners.type = courier
partners.status = active
```

## File disentuh

```txt
/home/user/toko-hana/App.jsx
/home/user/toko-hana/index.html
/home/user/toko-hana/README_CTO_WORKSPACE.md
/home/user/toko-hana/CHECKPOINT_2026-07-30_KASIR_OFFLINE_ORDER_ONLINE_KURIR_READY.md
/home/user/toko-hana/docs/UPDATE_2026-07-30_JASA_PENGIRIMAN_EDIT_TAMBAH.md
```

## Tes teknis

Syntax script `index.html` sudah dicek dengan:

```bash
node --check /tmp/tokohana_app_script_check.js
```

Hasil: OK.

## Tes manual yang disarankan

1. Buka `Admin → Kategori`.
2. Coba nonaktifkan `JNE Reguler`.
3. Pastikan `JNE Reguler` hilang dari form `Pilih Kurir/Resi`.
4. Edit salah satu nama jasa, misal `JNE Reguler` → `Lion Parcel`.
5. Pastikan `Lion Parcel` muncul di form kurir/resi.
6. Tambah jasa baru, misal `Ninja Xpress`.
7. Pastikan jasa baru muncul di form kurir/resi.
8. Coba tombol `Reset` untuk mengembalikan daftar bawaan.

---

## Penyesuaian posisi UI

Atas arahan user, panel `Jasa Pengiriman Aktif` dipindah ke bawah `Daftar Rak Kategori`.

Bentuk panel juga dibuat sebagai dropdown/collapsible agar halaman kategori tidak terlalu ramai.

Urutan menu sekarang:

```txt
Admin → Kategori
1. Tambah/Ubah Rak Barang
2. Daftar Rak Kategori
3. Dropdown Jasa Pengiriman Aktif
```

Saat dropdown tertutup, admin hanya melihat ringkasan jumlah jasa aktif. Saat dibuka, form edit/tambah/nonaktif jasa pengiriman tampil lengkap.

---

## Penyesuaian ruang menu Kategori

Panel `Daftar Rak Kategori` juga sudah dibuat dropdown/collapsible.

Urutan ringkas sekarang:

```txt
Admin → Kategori
1. Tambah/Ubah Rak Barang
2. Dropdown Daftar Rak Kategori
3. Dropdown Jasa Pengiriman Aktif
```

Alasan:

```txt
Menu Kategori perlu ruang untuk panel berikutnya: Kategori Mitra.
```

Rencana `Kategori Mitra`:

- menampilkan daftar mitra,
- menampilkan tipe/status mitra,
- jika tipe mitra adalah `courier`, tampil sebagai `Mitra Kurir`.

---

## Koreksi arah — Mitra tidak masuk Kategori

Setelah evaluasi rasa UI, `Kategori Mitra` tidak dilanjutkan di menu `Kategori` karena mitra bukan rak barang.

Arah baru:

```txt
Admin → Pelanggan → Mitra
```

Alasannya:

```txt
Mitra adalah relasi warung: kurir, UMKM, supplier, sponsor, dan sahabat sistem.
Relasi lebih dekat dengan Pelanggan/Sahabat Warung daripada Rak Kategori.
```

Menu `Pelanggan` sekarang punya submenu:

```txt
Pelanggan
Mitra
```

Halaman `Mitra` memakai tabel `partners` yang sudah ada. Tidak ada perubahan DB.

---

## Catatan kebijakan HanaPoin Kurir

Pengajuan mitra sekarang wajib melalui akun pelanggan/member terlebih dahulu.

Alur:

```txt
Daftar/Login Pelanggan
→ Ajukan Mitra
→ Admin setujui sebagai Mitra
→ Jika tipe courier + aktif, menjadi Mitra Kurir Aktif
```

Bonus HanaPoin operasional hanya berlaku untuk:

```txt
Mitra Kurir Aktif
```

Ekspedisi luar seperti JNE/J&T/SiCepat/Lion Parcel/Ninja Xpress dan jasa pengiriman umum tidak mendapat HanaPoin.

Tujuannya agar poin hanya diberikan ke relasi yang benar-benar terdaftar sebagai bagian dari ekosistem Toko Hana, bukan ke ekspedisi eksternal.
