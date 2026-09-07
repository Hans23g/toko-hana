# Update 2026-07-30 — Tarif Zona Antar & Kurir Warga

Ngopi boleh pindah meja, arah Toko Hana jangan ikut hilang.

## Tujuan

Menambahkan pengaturan zona ongkir yang bisa diubah sewaktu-waktu oleh admin.

Arahnya:

```txt
Alamat dekat warung / tetangga sekitar
→ masuk Zona Tetangga Warung
→ ongkir ringan, contoh Rp 2.000
→ cocok untuk Kurir Warga
```

Dengan begitu warga sekitar yang biasa nongkrong di warung bisa ikut mendapat penghasilan kecil/uang jajan dari membantu antar paket ringan jarak dekat.

## Catatan aman

Kurir Warga harus dijaga secara etis dan aman:

- untuk warga sekitar/remaja-dewasa yang mampu,
- jarak dekat,
- paket ringan,
- tidak memaksa,
- tidak mengganggu sekolah/kegiatan utama,
- kalau masih di bawah umur harus seizin orang tua/wali,
- bukan eksploitasi anak.

Bahasa aman di app memakai istilah:

```txt
Kurir Warga
```

bukan mengunci ke anak-anak.

## Lokasi UI

```txt
Admin → Kategori Produk dan Jasa Pengiriman → Tarif Zona Antar
```

Panel berbentuk dropdown/collapsible, setelah:

```txt
Daftar Rak Kategori
Jasa Pengiriman Aktif
```

## Zona default

```txt
Ambil di Toko
Tetangga Warung / RT-RW Dekat
Dekat
Sedang
Jauh
Tanya Admin
```

Zona `Tetangga Warung / RT-RW Dekat` default:

```txt
Ongkir pelanggan: Rp 2.000
Fee kurir: Rp 2.000
Rekomendasi: Kurir Warga
```

## Yang bisa diatur admin

Per zona:

- aktif/nonaktif,
- nama zona,
- ongkir pelanggan,
- fee kurir,
- minimal belanja gratis ongkir,
- rekomendasi kurir:
  - Kurir Warga,
  - Kurir Toko Hana,
  - Mitra Kurir Aktif,
  - Ekspedisi Umum,
  - Ambil di Toko,
  - Admin Konfirmasi,
- catatan zona,
- kata kunci alamat.

Admin juga bisa menambah zona custom.

## Deteksi zona

Deteksi zona membaca:

```txt
kata kunci alamat
RT/RW alamat warung fisik
RT/RW alamat pelanggan
```

Jika alamat warung punya RT/RW dan alamat pelanggan memakai RT/RW yang sama, sistem bisa mendeteksi:

```txt
Tetangga Warung / RT-RW Dekat
```

Kata kunci bisa diisi manual, contoh:

```txt
Jl Melati, Gang Mushola, RT 01, RW 02, depan warung, sebelah warung
```

## Dampak checkout pelanggan

Saat pelanggan checkout:

- zona terdeteksi otomatis,
- ongkir mengikuti tarif zona,
- catatan order membawa rekomendasi kurir,
- pesan WhatsApp order menampilkan zona dan rekomendasi kurir.

Contoh:

```txt
Zona Antar: Tetangga Warung / RT-RW Dekat — ongkir Rp 2.000
Rekomendasi Kurir: Kurir Warga
```

## Dampak admin/kasir saat pilih kurir

Saat order diproses dan admin/kasir klik:

```txt
Pilih Kurir/Resi
```

Sistem membaca rekomendasi kurir dari catatan zona.

Jika zona merekomendasikan:

```txt
Kurir Warga
```

maka pilihan kurir akan diarahkan ke `Kurir Warga`, bukan selalu default ke J&T.

## Penyimpanan

Tidak ada migration DB.

Setting disimpan di:

```txt
localStorage: toko_hana_delivery_zones
Supabase settings: delivery_zones
```

## File disentuh

```txt
App.jsx
index.html
README_CTO_WORKSPACE.md
CHECKPOINT_2026-07-30_KASIR_OFFLINE_ORDER_ONLINE_KURIR_READY.md
docs/UPDATE_2026-07-30_TARIF_ZONA_KURIR_WARGA.md
```

## Tes teknis

```bash
node --check /tmp/tokohana_app_script_check.js
```

Hasil: OK.

---

## Klarifikasi — Kurir Warga bersifat opsional/manual

Kurir Warga tidak wajib menjadi member dan tidak wajib punya HP.

Pemilihan Kurir Warga bersifat lokal dan berbasis kepercayaan kasir/admin:

```txt
orang sekitar yang dikenal,
paham jalan sekitar,
layak membantu antar paket ringan,
dan aman untuk diberi tugas jarak dekat.
```

Jika dipakai, kasir/admin cukup mencatat manual pada catatan paket/resi, contoh:

```txt
Dibawa Adit RT 02, ongkir warga Rp2.000
Dibantu Bang Ujang depan warung, paket ringan
```

Perbedaan penting:

```txt
Mitra Kurir Aktif = partner/member resmi, bisa dapat HanaPoin kurir.
Kurir Warga = fleksibel/manual, fee ongkir bisa diberikan langsung, tidak wajib HanaPoin.
```

Dengan begitu Toko Hana tetap memberi tempat untuk warga sekitar yang belum punya HP/akun, selama aman, dipercaya, dan tidak memaksa.
