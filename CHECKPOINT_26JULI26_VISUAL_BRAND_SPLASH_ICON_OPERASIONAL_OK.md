# CHECKPOINT 26 JULI 2026 — VISUAL BRAND, SPLASH, ICON, OPERASIONAL OK

Checkpoint dibuat karena chat sudah berat dan respons mulai lambat. Gunakan file ini untuk lanjut di chat/meja baru tanpa mengulang dari nol.

## Panggilan & Gaya

- User dipanggil: **kawan**.
- Assistant kadang dipanggil CTO.
- Gaya: santai, hangat, bahasa ngopi, konkret, hemat chat.
- Prinsip produk:

```txt
Catat cepat dulu → rapikan → terapkan saat yakin.
Sistem membaca data. Sistem memberi saran. Manusia tetap memutuskan.
Yang rumit biar sistem yang menanggung, yang mudah biar pengguna yang merasakan.
```

---

## File Utama yang Perlu Dibawa / Download

### CQ aktif terbaru

```txt
/home/user/TOKO_HANA_CQ_UPLOAD_MASSAL.html
```

Ini file yang dipakai untuk upload/deploy.

### Source aktif

```txt
/home/user/recovery-workspace-lama-07juli26/app.jsx
```

Source ini hasil recovery + patch lanjutan. Saat ini dipakai oleh generator.

### Generator aktif

```txt
/home/user/tools/make_cq_compiled.py
```

### Checkpoint ini

```txt
/home/user/CHECKPOINT_26JULI26_VISUAL_BRAND_SPLASH_ICON_OPERASIONAL_OK.md
```

Kalau user tanya “yang mana didownload?”, minimal download:

```txt
1. /home/user/TOKO_HANA_CQ_UPLOAD_MASSAL.html
2. /home/user/CHECKPOINT_26JULI26_VISUAL_BRAND_SPLASH_ICON_OPERASIONAL_OK.md
```

Kalau mau backup source juga:

```txt
3. /home/user/recovery-workspace-lama-07juli26/app.jsx
4. /home/user/tools/make_cq_compiled.py
```

---

## Deploy Workflow

Repo deploy GitHub/Vercel sekarang diarahkan agar praktis.

Live:

```txt
https://tokohana.vercel.app/
```

Repo deploy disarankan hanya berisi:

```txt
index.html
README.md
.github/workflows/auto-index.yml
incoming/
```

Workflow yang diinginkan:

```txt
Upload CQ apa pun ke incoming/ → GitHub Actions copy jadi index.html → Vercel redeploy.
```

Catatan workflow:

- Awalnya workflow hanya berhasil untuk nama:
  ```txt
  incoming/TOKO_HANA_CQ_UPLOAD_MASSAL.html
  ```
- Untuk nama file dengan spasi/kurung seperti:
  ```txt
  TOKO_HANA_CQ_UPLOAD_MASSAL (1).html
  ```
  workflow perlu versi yang pakai `find`, bukan `ls`.

Workflow versi kuat yang disarankan:

```yml
name: Auto Update index.html from CQ

on:
  push:
    paths:
      - "incoming/*.html"
  workflow_dispatch:

permissions:
  contents: write

jobs:
  update-index:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repo
        uses: actions/checkout@v4

      - name: Pick latest uploaded HTML and copy to index.html
        run: |
          latest_file=$(find incoming -maxdepth 1 -type f -name "*.html" -printf "%T@ %p\n" | sort -nr | head -n 1 | cut -d' ' -f2-)
          echo "Latest CQ file: $latest_file"

          if [ -z "$latest_file" ]; then
            echo "No HTML file found in incoming/"
            exit 1
          fi

          cp "$latest_file" index.html

      - name: Commit updated index.html
        run: |
          git config user.name "github-actions"
          git config user.email "github-actions@github.com"
          git add index.html
          git commit -m "Auto update index.html from CQ upload" || echo "No changes to commit"
          git push
```

Pastikan GitHub Actions permission:

```txt
Settings → Actions → General → Workflow permissions → Read and write permissions
```

---

## Operasional yang Sudah OK

### Scanner / Kasir

- Barcode Kemasan pakai Quagga ✅
- Scan produk baru via barcode ✅
- Scan barcode di Meja Kasir ✅
- Default scan kasir = Barcode Kemasan ✅
- Mode QR Toko Hana tetap ada ✅
- Scan kasir produk tanpa tier bisa beep saat masuk keranjang ✅
- Beep pakai WebAudio, bukan file audio tambahan ✅
- Produk bertier tetap minta pilih tier dulu ✅

### Shortcut Profil Kasir

Di Profil khusus kasir sudah ada:

```txt
Akses Cepat Kasir
- Meja Kasir
- Bon Agen
```

Tombol Bon Agen:

```js
setCurrentTab('Cart')
setShowBonAgenDraft(true)
```

### Keranjang Persist

Keranjang sudah auto-save ke localStorage:

```txt
toko_hana_cart
```

Jadi kalau app ketutup mendadak, keranjang tidak langsung hilang di browser/perangkat yang sama.

---

## Bon Agen & Catat Cepat

Bon Agen sekarang fleksibel:

```txt
Foto kamera
Unggah foto dari galeri
Ketik manual langsung
Hasil kamera mentah
Format saring bon
Pilih baris hasil saring
Editor baris barang
Kirim admin review
Admin review/edit
Terapkan Restok & Selesai
```

Stok tidak berubah sebelum admin klik:

```txt
Terapkan Restok & Selesai
```

### Mode filter

```txt
Normal — saran baris barang
Catatan Manual Kasir — qty unit nama harga
Stok Manual Tanpa Harga — qty unit nama
Struk Agen 2 Baris — nama + harga
Ketat — harus ada qty + unit + harga
Ada satuan — dus/renceng/pcs/kg
Ada harga — lebih longgar
Semua teks — edit manual
```

### Alias satuan sudah dikenali

```txt
bks = bungkus
rcg = renceng
sac = sachet
ltr = liter
pt  = peti
krg = karung
lbr = lembar
krt = karton
btg = batang
pc  = pcs
lsn = lusin
```

### Tombol Rapikan

Di editor Bon Agen kasir ada tombol:

```txt
Rapikan
```

Contoh input:

```txt
3 bks evo 16
2 rcg kopi kapal api
5 sac sampo
12 lbr plastik
10 btg rokok contoh
```

Hasil setelah Rapikan:

```txt
evo 16 3 bungkus
kopi kapal api 2 renceng
sampo 5 sachet
plastik 12 lembar
rokok contoh 10 batang
```

---

## Upload Stok Massal / Pendataan Rak

Admin bisa:

- Upload CSV ✅
- Foto Catatan Rak ✅
- Unggah Catatan dari Galeri ✅
- Ketik manual langsung ✅
- Editor Catatan Produk / Ketik Manual ✅
- Terapkan ke Preview Produk ✅

Format manual cukup:

```txt
2 dus Aqua 600ml
1 dus Le mineral 1500ml
3 dus Teh gelas cup 150ml
```

Tidak wajib harga. Harga/barcode/tier dilengkapi di preview.

### Scan barcode per baris preview

Di Preview Upload Stok Massal, tiap baris punya tombol:

```txt
Scan
```

Fungsinya:

```txt
Scan barcode → field Barcode/QR baris itu terisi sebelum import.
```

---

## Update Harga Cepat

Lokasi:

```txt
Admin → Restok → Update Harga Cepat
```

Fitur:

- Cari produk
- Lihat harga lama
- Isi harga jual baru
- Modal baru opsional
- Catatan opsional
- Simpan real-time

Update:

```txt
products.price
products.cost_price jika diisi
```

---

## Update Stok Cepat

Lokasi:

```txt
Admin → Restok → Update Stok Cepat
```

Mode:

```txt
Tambah
Kurangi
Set Fisik
```

Fungsi:

- sales datang / barang masuk
- barang rusak/expired/dipakai sendiri
- koreksi stok fisik rak

Update:

```txt
products.stock
stock_movements dicoba dicatat jika RLS/policy mengizinkan
```

---

## HanaPoin Offline

Info poin member offline sudah dipasang ulang versi sederhana dan aman:

```txt
poin = floor(total belanja / 1000) x pointsPerThousand
```

Tampil di bawah total belanja kalau kasir/admin memilih member offline:

```txt
⭐ Nama Member akan mendapat ± X HanaPoin dari belanja ini.
```

Tidak mengubah tier/level.

Jangan ulang patch lama yang bikin blank:

```txt
renderCartPointsEstimateNotice
calcPointsEarnedForCustomer
getLoyaltyMultiplierByPoints
renderAdminSafePanelOverlay
adminSafePanel
```

---

## Visual / Tema

### Header & Overlay

Header memakai konsep “lampu sambutan”:

```txt
Embos
Diagonal
Halo
V / Gunungan
```

Mode:

```txt
Ikut Waktu
Random tiap buka aplikasi
Tetap pilihan admin
```

Header utama/admin memakai overlay dinamis. Kartu sapaan/hero memakai overlay ambient yang lebih lembut agar tidak terlalu ramai.

### Mode malam

- Border putih/abu di mode malam dibuat lembut.
- Border emas solid tetap menyala.
- Navbar malam tanpa garis kuning 2px.
- Mask navbar tengah dibuat lebih halus.
- Tombol tengah navbar posisi:
  ```txt
  top: -18px
  ```
- Back to Top dark mode dibuat lebih transparan.

### Dropdown Kategori

Panel dropdown kategori:

- background glass/transparan
- border panel emas tipis
- item menu punya border emas tipis
- item aktif emas lebih jelas
- tidak pakai border putih menyengat

---

## Splash / Logo / Icon

### Splash

Splash baru menggunakan file optimized:

```txt
/home/user/recovery-workspace-lama-07juli26/assets/logo/splash_tokohana_belanja_optimized.jpg
```

Sumber terakhir dari:

```txt
/home/user/uploads/splash_tokohana.png
```

Ukuran optimized kira-kira:

```txt
720 x 1289
± 235 KB
```

Splash di app:

```txt
BRAND_SPLASH_DATA_URI
```

Animasi:

- gambar diam/full cover
- fade lembut
- loading bar coklat-emas jalan 1 kali saja
- teks:
  ```txt
  Menyiapkan Warung Digital
  Catat cepat • Rapikan nanti • Belanja hangat
  ```

Loading bar:

```txt
2.62s 1 forwards
```

### Favicon

Favicon transparan final yang dipasang:

```txt
/home/user/favicon_tokohana_512_cropped_edge_final.png
```

Dicopy ke:

```txt
/home/user/recovery-workspace-lama-07juli26/assets/logo/favicon_hana_th_512.png
```

Karakter:

```txt
512 x 512
logo size 516 x 493
posisi x -2, y 9
```

### Install Icon

Icon install/PWA yang dipasang:

```txt
/home/user/icon_tokohana_install_512_original_crop_plus.png
```

Dicopy ke:

```txt
/home/user/recovery-workspace-lama-07juli26/assets/logo/logo_hana_app_icon_512.png
```

Karakter:

- pakai background asli icon
- crop tipis
- tanpa background tambahan
- cocok untuk install app

### Footer Logo / Badge

Logo bulat test footer:

```txt
/home/user/logobulat_tokohana_clean_512.png
```

Dipakai sebagai:

```txt
BRAND_FOOTER_LOGO_DATA_URI
```

Dicopy ke:

```txt
/home/user/recovery-workspace-lama-07juli26/assets/logo/logo_hana_footer_badge_512.png
```

Catatan: file `logobulat.png` masih punya checkerboard yang sudah jadi gambar, sehingga pembersihan otomatis bisa memotong bagian tertentu. Untuk footer test sudah oke menurut user.

---

## Logo / Brand Roles

Pembagian yang disepakati:

```txt
Splash        → splash_tokohana
Install icon  → icon_tokohana original crop
Favicon       → favicon cropped edge final
Footer/badge  → logobulat medal
Logo lama     → manajemen/backoffice/resmi
```

Logo lama tidak dibuang; dipakai untuk:

```txt
manajemen
backoffice
proposal mitra
dokumen resmi
```

Logo baru lebih cocok untuk:

```txt
aplikasi belanja
splash
install icon
favicon
footer/badge
```

---

## Rencana Mitra Kurir

Catatan lama menunjukkan roadmap Mitra Kurir sudah ada:

- `partners.sql` sudah mendukung tipe `courier/kurir`.
- `orders_delivery_fields.sql` ada field:
  ```txt
  delivery_zone
  delivery_fee_customer
  courier_fee
  courier_partner_id
  delivery_note
  ```
- Menu Order sudah dipisah role:
  ```txt
  member/customer
  kasir
  admin
  ```
- Next rencana:
  ```txt
  admin assign kurir ke order
  halaman order khusus mitra kurir
  kurir update status antar
  fee kurir/laporan
  ```

Belum dikerjakan penuh.

---

## Ide Baru Terakhir

User upload `icontas2.png`, tas belanja dari keranjang/logo baru.

Rencana:

- Cek apakah bisa jadi icon galeri/kategori “Semua” atau icon alternatif yang lebih simpel.
- Belum diproses karena user meminta checkpoint dulu.

File:

```txt
/home/user/uploads/icontas2.png
```

---

## Hal yang Perlu Dihindari

- Jangan patch besar di blok React.createElement raksasa kalau tidak wajib.
- Jangan generate dari source lama GitHub yang tidak sinkron.
- Jangan taruh `service_role` di frontend/chat/GitHub.
- Jangan ulang patch HanaPoin estimate lama yang bikin blank.
- Jangan memperbesar CQ tanpa perlu; optimasi asset gambar kalau dipakai.

---

## Next Aman

Jika lanjut di meja baru, urutan aman:

1. Pastikan CQ terbaru tidak blank.
2. Test fitur penting:
   - kasir scan barcode + beep
   - Bon Agen manual alias + Rapikan
   - Upload Stok Massal manual + scan barcode per row
   - Update Harga Cepat
   - Update Stok Cepat
3. Baru sentuh visual kecil / mitra kurir / kartu member.

Prioritas visual berikutnya yang belum selesai:

```txt
Coba icon tas icontas2 untuk kategori Semua / galeri.
```

Prioritas fitur berikutnya:

```txt
Produk Perlu Dilengkapi
+ Produk Baru dari Bon
Admin assign Mitra Kurir
```
