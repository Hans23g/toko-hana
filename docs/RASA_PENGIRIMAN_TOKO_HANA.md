# RASA PENGIRIMAN TOKO HANA

> Ngopi boleh pindah meja, arah Toko Hana jangan ikut hilang.

Dokumen ini adalah pegangan microcopy / sentuhan rasa untuk seluruh proses pengiriman Toko Hana — Warungnya Rakyat.

Tujuannya agar alur paket tidak terasa seperti status dingin, tetapi terasa seperti warung yang menjaga amanah sampai barang benar-benar sampai ke tangan pelanggan.

---

## Prinsip Rasa Pengiriman

Toko Hana tidak hanya mengubah status order.

Toko Hana ingin pelanggan merasa:

```txt
dikenal
ditenangkan
dibantu
dijaga pesanannya
diberi kabar dengan bahasa manusiawi
```

Bahasa pengiriman harus:

- hangat,
- jelas,
- tidak berlebihan,
- tidak menjanjikan hal yang belum pasti,
- tetap sopan,
- mudah dipahami pelanggan,
- punya rasa kopi/warung,
- tetap operasional.

Gaya bahasa:

```txt
bahasa ngopi
hangat
membumi
bukan korporat
bukan terlalu kaku
```

---

## Status Internal dan Bahasa UI

Status internal di sistem boleh tetap rapi:

```txt
Belum Bayar
Siap Bayar
Diproses
Dikirim
Kurir Tiba
Selesai
```

Tetapi bahasa UI ke pelanggan dibuat lebih manusiawi:

```txt
Dikirim    → Sedang Dikirim
Kurir Tiba → Paket Sampai
Selesai    → Paket Diterima / Selesai
```

---

## Aktor Pengiriman

Toko Hana mendukung beberapa bentuk pengiriman:

```txt
Ekspedisi luar
Kurir Toko Hana
Mitra Kurir Aktif
Kurir Warga
Ambil di Toko
Tanya Admin
```

Perbedaan penting:

```txt
Mitra Kurir Aktif = partner/member resmi, bisa mendapat HanaPoin kurir.
Kurir Warga = fleksibel/manual, dipilih kasir/admin berdasarkan kepercayaan lokal, tidak wajib member dan tidak wajib punya HP.
Ekspedisi luar = jasa pengiriman umum, tidak mendapat HanaPoin.
```

---

# Microcopy Per Tahap

## 1. Order Masuk

Dipakai saat pesanan baru masuk dan belum diproses kasir/admin.

### Untuk pelanggan

```txt
🛎️ Pesanan diterima. Toko Hana sudah mencatat pesananmu, kawan. Kasir akan cek pelan-pelan ☕
```

Alternatif:

```txt
🧾 Pesanan sudah masuk ke meja Toko Hana. Tenang, belanjaanmu akan dicek satu per satu sebelum diproses.
```

### Untuk admin/kasir

```txt
Order baru masuk. Cek pembayaran, stok, catatan pelanggan, dan zona antar sebelum diproses.
```

---

## 2. Menunggu / Konfirmasi Pembayaran

Dipakai untuk order QRIS/transfer/konfirmasi pembayaran.

### Untuk pelanggan

```txt
🧾 Pesanan sudah masuk. Kasir bantu cek belanjaan dan potongan sebelum pembayaran.
```

Jika QRIS:

```txt
📎 Jika sudah bayar QRIS, kirim bukti ke kasir/admin ya kawan. Biar pesanan bisa segera diproses dengan rapi.
```

Jika potongan sudah dikonfirmasi:

```txt
✅ Potongan sudah dikonfirmasi. Sisa bayar bisa diselesaikan lewat metode Rupiah yang dipilih. Kasir akan bantu menutup pesanan dengan senyum ☕
```

---

## 3. Diproses

Dipakai saat kasir/admin sudah mulai menyiapkan pesanan.

```txt
☕ Pesanan mulai kami siapkan. Barang dicek pelan-pelan, biar yang sampai bukan cuma cepat, tapi juga tepat.
```

Alternatif:

```txt
🧺 Belanjaan sedang dirapikan. Toko Hana cek barangnya satu per satu supaya tidak ada yang tertukar.
```

Untuk admin/kasir:

```txt
Pesanan sedang diproses. Pastikan item, jumlah, pembayaran, dan catatan pelanggan sudah sesuai sebelum pilih kurir.
```

---

## 4. Deteksi Zona / Pilih Kurir

Dipakai saat sistem membaca zona dan admin/kasir memilih kurir.

```txt
🛵 Kurir sedang dipilih sesuai jarak dan kondisi. Untuk tetangga dekat, Kurir Warga bisa bantu antar dengan hangat.
```

Jika zona tetangga warung:

```txt
🏘️ Alamat dekat warung terdeteksi. Ongkir ringan bisa memakai Kurir Warga jika kasir/admin menilai aman dan cocok.
```

Jika perlu admin konfirmasi:

```txt
☕ Area belum otomatis dikenali. Admin akan bantu cek ongkir dan kurir yang paling pas lewat WA.
```

---

## 5. Paket Ditugaskan ke Kurir

Dipakai setelah admin/kasir klik `Catat Paket Dikirim`.

```txt
📦 Paket sudah diberi kurir. Barang mulai jalan pelan-pelan menuju alamat kawan.
```

Jika Mitra Kurir:

```txt
🛵 Paket ditugaskan ke Mitra Kurir Toko Hana. Kurir akan mengambil dan mengantar paket dengan amanah.
```

Jika Kurir Warga:

```txt
👣 Paket dibantu Kurir Warga sekitar warung. Jarak dekat, paket ringan, dan tetap dicatat oleh kasir/admin.
```

Jika ekspedisi luar:

```txt
🚚 Paket diserahkan ke jasa pengiriman. Nomor resi/catatan paket akan membantu kawan memantau kiriman.
```

---

## 6. Pickup Kurir

Dipakai saat Mitra Kurir klik `Konfirmasi Pickup`.

```txt
📦 Paket sudah dijemput kurir. Kopi belum dingin, barang sudah mulai jalan.
```

Alternatif:

```txt
🛵 Kurir sudah mengambil paket dari Toko Hana. Semoga perjalanan singkat dan aman sampai alamat.
```

Untuk kurir:

```txt
Pickup dicatat. Pastikan paket sesuai order, alamat terbaca jelas, dan hubungi pelanggan jika perlu.
```

Catatan batasan saat ini:

```txt
Jika update pickup belum tersimpan permanen karena RLS, status tetap dicatat lokal di perangkat kurir dan admin bisa sinkronkan.
```

---

## 7. Sedang Dikirim

Status internal: `Dikirim`  
Bahasa UI: `Sedang Dikirim`

```txt
🚚 Paket sedang menuju rumah kawan. Semoga sampai seperti kopi sore: hangat dan bikin lega.
```

Alternatif:

```txt
🛵 Paket sedang di jalan. Toko Hana ikut menjaga kabarnya sampai tiba di alamat.
```

Jika ada catatan/resi:

```txt
🚚 Paket sedang dikirim. Catatan/resi: {resi}. Semoga sampai dengan aman dan hangat ☕
```

---

## 8. Paket Sampai

Status internal: `Kurir Tiba`  
Bahasa UI: `Paket Sampai`

```txt
📍 Kurir sudah sampai di alamat. Silakan cek barangnya pelan-pelan sebelum dikonfirmasi diterima.
```

Alternatif:

```txt
📦 Paket sudah sampai. Kalau barang sudah diterima dan sesuai, tekan Paket Diterima agar pesanan ditutup rapi.
```

Untuk admin/kurir:

```txt
Paket ditandai sampai. Menunggu pelanggan memastikan barang diterima.
```

---

## 9. Paket Diterima

Status internal: `Selesai`  
Bahasa UI: `Paket Diterima / Selesai`

```txt
✅ Paket diterima. Terima kasih sudah percaya pada Toko Hana — semoga belanja hari ini meninggalkan rasa manis seperti kopi yang pas gulanya.
```

Alternatif:

```txt
✅ Pesanan selesai, kawan. Semoga yang sampai bukan cuma barang, tapi juga sedikit rasa hangat dari warung dekat rumah ☕
```

Untuk admin:

```txt
Order selesai. Jika ada fee kurir atau bonus HanaPoin Mitra Kurir, pastikan catatan sudah rapi.
```

---

## 10. Barang Tidak Sesuai / Garansi Barang Sesuai Lite

Ini untuk fase berikutnya.

```txt
☕ Kalau ada yang belum sesuai, jangan sungkan. Warung yang baik bukan yang tidak pernah salah, tapi yang mau membenahi dengan hati.
```

Alternatif:

```txt
🧺 Ada barang yang kurang cocok? Kabari Toko Hana. Kita cek pelan-pelan agar pelanggan dan warung sama-sama enak hati.
```

Tombol yang direncanakan:

```txt
Paket Diterima
Barang Tidak Sesuai
```

---

# Microcopy Khusus Jenis Kurir

## Mitra Kurir Aktif

```txt
Mitra Kurir Toko Hana adalah bagian dari ekosistem warung. Fee dan bonus HanaPoin dicatat saat paket selesai diterima.
```

```txt
Bonus HanaPoin kurir masuk saat paket benar-benar selesai, bukan saat pickup.
```

## Kurir Warga

```txt
Kurir Warga dipilih kasir/admin berdasarkan saling kenal dan kepercayaan. Tidak wajib member atau punya HP; cukup dicatat manual.
```

```txt
Kurir Warga cocok untuk paket ringan, jarak dekat, dan lingkungan yang sudah dikenal warung.
```

```txt
Fee Kurir Warga bisa diberikan langsung sebagai uang jajan/upah bantu antar.
```

Catatan aman:

```txt
Jika masih di bawah umur, harus seizin orang tua/wali, tidak dipaksa, tidak mengganggu sekolah, dan hanya untuk jarak dekat/paket ringan.
```

## Ekspedisi Luar

```txt
Ekspedisi luar membantu pengiriman umum, tetapi tidak masuk sistem HanaPoin kurir Toko Hana.
```

```txt
Nomor resi/catatan paket dipakai agar pelanggan bisa memantau kiriman.
```

---

# Alur Rasa Utama

Ringkasan rasa yang ingin dijaga:

```txt
Order masuk        → pelanggan ditenangkan
Diproses           → barang dicek dengan hati
Pilih kurir        → jarak dan kepercayaan dipertimbangkan
Pickup             → paket mulai jalan
Sedang dikirim     → pelanggan ditemani kabarnya
Paket sampai       → pelanggan diminta cek pelan-pelan
Paket diterima     → ditutup dengan manis
Tidak sesuai       → dibenahi dengan hati
```

---

## Prinsip Copy yang Harus Dihindari

Hindari bahasa yang terlalu kaku:

```txt
Order Anda telah diproses.
Pengiriman berhasil.
Transaksi selesai.
```

Hindari janji berlebihan:

```txt
Pasti sampai cepat.
Pasti tidak ada masalah.
Selalu aman 100%.
```

Ganti dengan bahasa warung yang jujur:

```txt
Kami cek pelan-pelan.
Semoga sampai dengan aman.
Kalau ada yang belum sesuai, kabari kami.
```

---

## Catatan Implementasi UI

Copy ini bisa ditanam bertahap di:

```txt
renderCustomerOrdersPage()
Form Pickup Mitra Kurir
Admin → Pengiriman
Kasir → Order Online
Histori Order Online
WA template order/pengiriman
Garansi Barang Sesuai Lite
```

Jangan tanam semuanya sekaligus jika membuat UI terlalu panjang.

Utamakan titik penting:

```txt
Diproses
Sedang Dikirim
Paket Sampai
Paket Diterima
Barang Tidak Sesuai
```

---

## Penutup Rasa

Toko Hana ingin pengiriman terasa seperti warung yang mengantar titipan dengan hati.

```txt
Diproses dengan tenang.
Diantar dengan amanah.
Diterima dengan lega.
Selesai dengan manis.
```

Warung kecil, rasa besar.  
Teknologi rapi, hati tetap membumi.  
Toko Hana — Warungnya Rakyat.
