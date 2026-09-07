# CHECKPOINT 2026-07-30 — Visual Gold, Kurir, Zona Antar Ready

Ngopi boleh pindah meja, arah Toko Hana jangan ikut hilang.

## Alasan checkpoint

Chat mulai terasa berat/macet. Checkpoint ini dibuat agar meja ngopi berikutnya bisa lanjut tanpa mulai dari nol.

Project aktif:

```txt
/home/user/toko-hana/
```

File utama:

```txt
/home/user/toko-hana/index.html
/home/user/toko-hana/App.jsx
/home/user/toko-hana/manifest.json
/home/user/toko-hana/README_CTO_WORKSPACE.md
```

Paket tukar meja terbaru:

```txt
/home/user/TOKO_HANA_PAKET_TUKAR_MEJA_2026-07-30.zip
```

---

## Prinsip produk yang sedang dijaga

Toko Hana bukan sistem yang memaksa hidup mengikuti fitur.

Prinsip revolusioner yang sudah dicatat di Nawa Cita:

```txt
Sistem mengikuti hidup,
bukan hidup dipaksa mengikuti sistem.
```

Toko Hana harus bisa memuat:

```txt
pelanggan online
pembeli offline
kasir/admin
mitra resmi
mitra kurir
kurir warga manual
warga tanpa HP
konten Jelajah
info warga
edukasi
relasi lokal
```

Jelajah adalah pembeda ruh produk: sistem warung/kasir yang juga punya ruang konten, edukasi, mitra, info warga, undangan, ucapan, dan cerita.

---

## Status fitur pengiriman / kurir

### Alur pelanggan menjadi Mitra Kurir

Sudah berhasil diuji user:

```txt
Member HANA
→ Ajukan Mitra Kurir
→ Admin approve / sinkronkan
→ Status berubah jadi Mitra Kurir
→ Kartu profil berubah rasa
→ Menu Order muncul Form Pickup
```

### Deteksi Mitra Kurir Aktif

Akun member/customer dikenali sebagai Mitra Kurir Aktif jika cocok dengan:

```txt
partners.type = courier
partners.status = active
```

Pencocokan sudah diperkuat lewat:

```txt
WA / phone
nama
HANA-{id} di notes partner
email member di notes partner
```

### Form Pickup

Untuk Mitra Kurir Aktif, halaman Order berubah menjadi:

```txt
Ruang Order Mitra Kurir
Pickup & Riwayat Pesanan
```

Panel paling atas:

```txt
Form Pickup Mitra Kurir
Meja Pickup Paket
```

Tombol operasional:

```txt
Konfirmasi Pickup
Paket Sampai
WA Pelanggan
```

Riwayat belanja pribadi tetap tampil di bawah.

### Fix paket tidak muncul di Form Pickup

Sudah diperbaiki:

- mapping order dari Supabase membawa field kurir lengkap:

```txt
courier_partner_id
courier_name
courier_phone
courier_status
courier_fee
assigned_courier_at
picked_up_at
delivered_at
customer_confirmed_at
delivery_proof_note
```

- Form Pickup mencocokkan order lewat:

```txt
courier_partner_id
courier_phone
courier_name
courier
kurir
```

- akun kurir refresh order saat buka `Cart/Order` atau `Profil`.
- jika sudah Mitra Kurir Aktif, polling ringan ±15 detik.

### Fix pickup mental balik

Masalah:

```txt
Klik Konfirmasi Pickup → status pickup sebentar → polling DB balik ke Perlu Pickup.
```

Penyebab:

```txt
RLS orders belum mengizinkan member/kurir update order.
```

Fix lite:

```txt
localStorage: toko_hana_courier_local_order_patches
```

Patch lokal digabung saat order refresh agar UI kurir tidak mental balik.

Batasan:

```txt
Untuk sinkron permanen lintas perangkat tetap butuh RPC/RLS khusus kurir.
```

---

## Status Kurir Warga & Zona Antar

### Tarif Zona Antar

Menu:

```txt
Admin → Kategori Produk dan Jasa Pengiriman → Tarif Zona Antar
```

Zona default:

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

Admin bisa mengatur:

```txt
aktif/nonaktif
nama zona
ongkir pelanggan
fee kurir
minimal belanja gratis ongkir
rekomendasi kurir
catatan zona
kata kunci alamat
```

Penyimpanan:

```txt
localStorage: toko_hana_delivery_zones
Supabase settings: delivery_zones
```

Tidak ada migration DB.

### Kurir Warga

Arah Kurir Warga sudah diklarifikasi:

```txt
Tidak wajib member.
Tidak wajib punya HP.
Dipilih kasir/admin berdasarkan saling kenal dan kepercayaan.
Bisa dicatat manual di catatan paket/resi.
```

Contoh catatan:

```txt
Dibawa Adit RT 02, ongkir warga Rp2.000
Dibantu Bang Ujang depan warung, paket ringan
```

Perbedaan:

```txt
Mitra Kurir Aktif = partner/member resmi, bisa dapat HanaPoin kurir.
Kurir Warga = fleksibel/manual, fee langsung, tidak wajib HanaPoin.
```

Prinsip aman:

```txt
jarak dekat
paket ringan
aman
sukarela/tidak memaksa
kalau masih di bawah umur harus seizin orang tua/wali
tidak mengganggu sekolah/kegiatan utama
```

---

## Jasa Pengiriman Aktif

Menu:

```txt
Admin → Kategori Produk dan Jasa Pengiriman → Jasa Pengiriman Aktif
```

Sudah berupa dropdown/collapsible.

Admin bisa:

```txt
aktif/nonaktif jasa pengiriman
edit nama jasa
 tambah jasa baru
hapus jasa custom
reset default
```

Penyimpanan:

```txt
localStorage: toko_hana_shipping_services
Supabase settings: shipping_services
```

`Mitra Kurir Aktif` tetap opsi khusus terpisah dari ekspedisi umum.

---

## Menu Pelanggan / Mitra

Menu:

```txt
Admin → Pelanggan
```

Submenu:

```txt
Pelanggan
Mitra
```

Tab `Mitra` memuat:

```txt
Kemitraan Warung
Pengajuan Mitra Masuk
Daftar Mitra
Tambah/Edit Mitra
```

Status mitra:

```txt
Aktif
Nonaktif
Pending
Suspend
Blokir
```

Admin bisa klik:

```txt
Jadikan Kurir
Jadikan Mitra
Sinkronkan Kurir
Sinkronkan Mitra
```

untuk pengajuan yang sudah/akan disetujui.

---

## Visual branding terbaru

### PWA Icon

User mengirim:

```txt
/home/user/uploads/iconpwa1.png
```

Dipakai sebagai icon PWA/install premium gold.

Aktif:

```txt
assets/pwa/icon_install_180.png
assets/pwa/icon_install_192.png
assets/pwa/icon_install_512.png
manifest.json
```

Source:

```txt
assets/pwa/icon_pwa_gold_hana_cart_source.png
```

### Favicon

Keputusan visual:

```txt
Favicon browser/tab tetap pakai transparan lama
```

Karena lebih jelas di ukuran sangat kecil.

File:

```txt
assets/pwa/icon_install_64.png
```

### Kategori “Semua”

Kategori `Semua` memakai icon gold premium yang sama rasa dengan PWA.

Aktif:

```txt
assets/category/icon_category_cart_transparent_512.png
assets/category/icon_category_tas_bg_cleanpad_512.png
```

Source:

```txt
assets/category/icon_category_gold_hana_cart_source.png
```

`App.jsx` dan `index.html` sudah membawa data URI gold untuk kategori `Semua`.

### Palet emas hasil eksplorasi

```txt
#B8860B = emas matang / golden brown
#FFE8A8 = krem emas muda
#FFD784 = emas muda loading splash
#D4AF37 = gold medium
#FFD700 = kuning emas terang, dipakai seperlunya sebagai lampu/focus
```

Prinsip:

```txt
#B8860B cocok untuk area terang / kategori aktif / search icon.
#FFE8A8 cocok untuk area ungu gelap / tombol tengah.
#FFD700 jangan dominan agar tidak nyengat; cocok untuk efek aktif/lampu.
```

### Kategori aktif

Efek aktif kategori memakai emas matang:

```txt
#B8860B
```

Meliputi:

```txt
border
ring
shadow
garis bawah
teks aktif light mode
dropdown aktif
```

### Tombol QRIS tengah navbar

Tombol QRIS tengah sudah menjadi gradasi emas 3D.

Border gradient:

```txt
#B8860B → #FFE8A8 → #FFD784 → #D4AF37 → #B8860B
```

Inner tombol tetap ungu/gelap sesuai mode.

Shadow tombol sudah diubah agar tidak ring simetris, tapi terasa seperti bayangan tombol:

```txt
0 7px/8px shadow bawah
emas matang turun
inset highlight atas
inset shadow bawah
```

Tujuan:

```txt
tombol terlihat di atas ungu dan di atas halaman putih,
terasa seperti medali emas 3D kecil di navbar.
```

### Icon navbar

`WarungIcon` punya mode khusus:

```txt
nav: true
```

Icon navbar Home/Jelajah/Saya memakai gradient SVG:

```txt
#FFE8A8 → #FFD784 → #B8860B
```

Icon Order (Lucide):

```txt
aktif: #FFE8A8
nonaktif: #D4AF37
```

### Search box

Search header sudah dicoba border gradasi emas 3D.

Normal:

```txt
inner putih/cream transparan
border gradasi emas 3D
shadow turun tipis agar melayang
```

Focus/aktif:

```txt
glow emas lebih menyala
#FFD700 masuk sebagai lampu warung
```

Mode malam:

CSS sudah diperbarui agar tidak balik ke outline kuning lama, tetapi user baru melaporkan:

```txt
mode malam belum ikut seperti tombol QRIS
```

### Pending visual terakhir

Terakhir CTO baru sempat cek/grep search style dan belum patch final:

```txt
Masalah: search box mode malam belum ikut efek gradasi/focus dengan benar.
Kemungkinan: inline style/CSS dark-mode override masih beradu.
Rencana: bikin state focus langsung di React atau revisi CSS agar darkMode search pasti ikut, seperti tombol QRIS.
```

Jangan anggap pending ini sudah selesai. Ini tugas lanjutan pertama jika mau lanjut visual.

---

## Docs penting yang sudah dibuat/diupdate

```txt
docs/NAWA_CITA_TOKO_HANA.md
docs/UPDATE_2026-07-30_JASA_PENGIRIMAN_EDIT_TAMBAH.md
docs/UPDATE_2026-07-30_MITRA_KURIR_PICKUP_LITE.md
docs/UPDATE_2026-07-30_TARIF_ZONA_KURIR_WARGA.md
docs/UPDATE_2026-07-30_PWA_ICON_PREMIUM_GOLD.md
docs/UPDATE_2026-07-30_ICON_KATEGORI_SEMUA_GOLD.md
```

Checkpoint lama masih ada:

```txt
CHECKPOINT_2026-07-30_KASIR_OFFLINE_ORDER_ONLINE_KURIR_READY.md
```

Checkpoint baru ini:

```txt
CHECKPOINT_2026-07-30_VISUAL_GOLD_KURIR_ZONA_READY.md
```

---

## Testing teknis terakhir

Terakhir syntax check berulang kali lolos:

```bash
node --check /tmp/tokohana_app_script_check.js
```

Hasil terakhir sebelum checkpoint:

```txt
OK
```

---

## Next step paling dekat

Kalau lanjut dari sini:

1. Bereskan search box mode malam agar benar-benar ikut gradasi/focus seperti tombol QRIS.
2. Setelah visual stabil, test lagi:
   - PWA icon gold,
   - kategori Semua gold,
   - favicon transparan,
   - tombol QRIS tengah,
   - navbar icon gradient,
   - search normal/focus light/dark.
3. Setelah itu baru lanjut penyempurnaan alur pengiriman / garansi barang sesuai.

---

## Prinsip aman/legal tetap berlaku

- QRIS/Tunai/COD/Rupiah adalah pembayaran resmi.
- Pi hanya `Tukar Koin Pi untuk Potongan`, edukasi/komunitas, final tetap Rupiah.
- Jangan minta passphrase/secrets.
- Jangan dorong real Mainnet Pi testing dari app luar Pi Browser.
- Kurir Warga berbasis kepercayaan lokal dan harus aman/manusiawi.


---

## Update setelah checkpoint — Dokumen Rasa Pengiriman Dibuat

File yang sebelumnya belum ada sekarang sudah dibuat:

```txt
docs/RASA_PENGIRIMAN_TOKO_HANA.md
```

Isi dokumen:

- prinsip rasa pengiriman,
- status internal vs bahasa UI,
- microcopy per tahap pengiriman,
- copy khusus Mitra Kurir Aktif,
- copy khusus Kurir Warga,
- copy khusus Ekspedisi Luar,
- catatan implementasi UI,
- prinsip copy yang harus dihindari.

Tahap yang dicakup:

```txt
Order Masuk
Konfirmasi Pembayaran
Diproses
Deteksi Zona / Pilih Kurir
Paket Ditugaskan
Pickup Kurir
Sedang Dikirim
Paket Sampai
Paket Diterima
Barang Tidak Sesuai
```

Ini menjawab permintaan meja baru yang meminta file:

```txt
RASA_PENGIRIMAN_TOKO_HANA.md
```


---

## 📝 TAMBAHAN 2026-08-08 — RASA PENGIRIMAN PASS 1 (Rata Tipis 3 Alur)

Workspace dibersihkan: 166 MB → 18 MB (arsip lama & paket kembar diangkat, zip master 07-30 tetap jadi ban serep).

15 microcopy hangat dari `docs/RASA_PENGIRIMAN_TOKO_HANA.md` diterapkan ke `App.jsx` + `index.html` (masing-masing 15 titik, terverifikasi):

- **Pembeli:** statusNote Diproses/Dikirim/Kurir Tiba/Selesai → rasa kopi (mis. "Kopi belum dingin, barang sudah mulai jalan", "Cek pelan-pelan dulu ya kawan, kalau sudah pas baru tekan Paket Diterima").
- **Kurir:** header Meja Pickup ("titipan warga... jangan sampai kopinya tumpah 🛵☕"), chip "Sabar menunggu pelanggan buka pintu ☕", WA kurir→pelanggan lebih hangat.
- **Kasir/Admin:** helper form Antar Pesanan, panel Sedang Dikirim, panel Selesai, template WA admin→kurir ("Bawa pelan-pelan, ini titipan warga ☕🛵").
- **Notifikasi realtime pelanggan:** Diproses/Dikirim/Kurir Tiba/Selesai semua ber-rasa.

Cek: `node --check` script app di `index.html` ✅. Badge status singkat (Sedang Dikirim/Paket Sampai) sengaja tidak diubah.
Belum: pass 2 perdalaman per alur (WA template lengkap pelanggan, struk, empty states) + fix search mode malam.

---

## 💍 TAMBAHAN 2026-08-08 (sore) — PERNIKAHAN MEJA SEBELAH + RASA PASS 1 RE-POUR

Versi visual baru dari meja sebelah diadopsi UTUH (App.jsx, index.html, manifest identik): tombol 3D baru, kartu produk baru, semua sisa fix visual beres, logo struk hitam-putih (receiptLogoBw via CTO_HANA_RECEIPT_LOGO_DATA_URI, PNG source: assets/logo/logo_struk_bw_512.png).

Prosedur adopsi aman: uji /tmp dulu (node-check LULUS) → adopsi → tuang ulang 15 rasa pass 1 → node-check final LULUS → zip master baru TOKO_HANA_PAKET_TUKAR_MEJA_2026-08-08.zip (zip 07-30 pensiun) → meja uploads disapu.

Oleh-oleh masuk: docs/VISUAL_GOLD_QA_2026-07-30.md, docs/README_MULAI_DI_MEJA_BARU.md, CHECKPOINT_26JULI26_VISUAL_BRAND_SPLASH_ICON_OPERASIONAL_OK.md (root). NAWA_CITA identik, skip.

Belum: pass 2 perdalaman rasa per alur (WA pelanggan lengkap, struk rasa, empty states).

---

## 🗝️ TAMBAHAN 2026-08-08 (petang) — PAKET DITERIMA PELANGGAN TEMBUS DB

Temuan: tombol "Paket Diterima" pelanggan mental balik karena RLS orders (memang sengaja dikunci — hanya staf boleh UPDATE).

Perbaikan: RPC SECURITY DEFINER `customer_confirm_order_delivered(text)` (hanya tutup order 'Kurir Tiba' → 'Selesai', kolom lain mustahil disentuh) + app RPC-first dengan fallback toast rasa. File: db/RPC_KONFIRMASI_PELANGGAN_DITERIMA_2026-08-08.sql. Edit: App.jsx + index.html (fungsi identik, 1 titik per file). node-check LULUS. DB doc diperbarui.

Wajib: kawan paste SQL di Supabase → SQL Editor → Run, baru pintu aktif. Tanpa itu app tetap sopan (toast catatan + kasir tutup manual), tidak silent mental balik lagi.

---

## 🛵 TAMBAHAN 2026-08-09 — GERBONG KURIR RESMI TEMBUS (PICKUP & TIBA)

Temuan: kurir konfirmasi sampai → DB menolak (RLS) → pelanggan stuck "Sedang Dikirim", tombol diterima belum muncul.

Perbaikan: RPC `courier_confirm_pickup` + `courier_confirm_arrived` (SECURITY DEFINER, guard status 'Dikirim'), app RPC-first di handleCourierPickupOrder & handleCourierArrivedOrder; cabang staf tidak disentuh, overlay lokal tetap pelapis. File: db/RPC_KURIR_PICKUP_TIBA_2026-08-09.sql. node-check LULUS.

Wajib: paste SQL baru di Supabase → SQL Editor → Run (pintu kemarin tetap hidup, ini tambahan). Setelah itu rantai resmi: Pickup → Tiba → Pelanggan konfirmasi → Selesai, semua tembus database ☕

---

## 🛵📦 TAMBAHAN 2026-08-09 — RITUAL JEMPUT–SERAH TERIMA–ANTAR (tahap terlewati)

Tahap baru lengkap: Kasir tugaskan (Kurir Ditugaskan) → Kurir "🛵 Berangkat Jemput" (Kurir Menuju Toko) → Kasir "📦 Serahkan Paket ke Kurir" (Siap Berangkat) → Kurir "Bawa Paket & Antar" (Sedang Dikirim) → Paket Sampai → Pelanggan Diterima → Selesai.

Teknis: helper getOrderStatusLabel menggantikan ternarian label di 6 titik; statusNote pelanggan + notif realtime ikut tiap tahap; handleShipOrder (Mitra) kirim 'ditugaskan'; RPC baru courier_start_pickup (db/RPC_KURIR_MENUJU_TOKO_2026-08-09.sql); tombol admin "Serahkan Paket" di panel pengiriman; badge & tombol utama kurir stage-aware. Ekspedisi & jalur cepat kasir tetap fleksibel langsung "Sedang Dikirim".

14 titik bedah × 2 file, node-check LULUS. Wajib Run SQL baru di Supabase agar tombol jemput kurir resmi tembus; tanpa itu overlay + toast jujur tetap menopang.

---

## 🙋 TAMBAHAN 2026-08-09 — SERAH TERIMA "DITERIMA OLEH SIAPA"

Kurir konfirmasi Paket Sampai kini mencatat penerima (pemesan / keluarga / titip tetangga atas permintaan pelanggan) via prompt; catatan itu mengalir: kartu pelanggan menampilkan "Tercatat diterima oleh X (catatan kurir)", notifikasi Paket Sampai menyebut penerima, dan status Selesai ditutup "Barang diterima oleh X (sesuai catatan kurir) dan dikonfirmasi pelanggan". RPC pelanggan naik ke V2 (p_note) — WAJIB Run ulang file sql yang sama. 8 titik × 2 file, node-check LULUS.

---

## 🙋 TAMBAHAN 2026-08-09 — PICKUP LIST (Ambil Job Sendiri, default)

Mitra Kurir aktif kini punya papan "Pickup List • Ambil Job Sendiri": semua order 'Diproses' ber-alamat yang belum berkurir bisa diklaim mandiri tanpa menunggu ditunjuk kasir/admin — default saat orderan & kurir aktif sama-sama banyak. RPC courier_claim_pickup_job dengan guard atomik anti-rebutan (satu yang duluan yang resmi dapat; satunya dapat toast jujur + refresh). Order terklaim langsung masuk ritual: Ditugaskan → Jemput → Serah Terima → Antar → Sampai → Diterima → Selesai. Ekspedisi & Kurir Toko/Warga tidak ikut list ini (jalur kasir/admin tetap). SQL baru: db/RPC_KURIR_AMBIL_JOB_PICKUP_2026-08-09.sql (Run di Supabase). node-check LULUS.

---

## 🧾🔐 TAMBAHAN 2026-08-09 — STRUK IJAZAH PAKET (Bukti Autentik Anti-Ngarang)

- Kurir (Meja Pickup) kini punya tombol "🧾 Lihat Pesanan & Struk Bukti" per order tugas → membuka struk siap-cetak (tanpa prompt catatan kasir).
- Struk semua order berkurir kini membawa blok PENGIRIMAN: nama kurir, WA kurir, jejak waktu (Ditugaskan/Dibawa/Sampai/Diterima konfirmasi), kolom Alamat, dan "Tercatat diterima oleh X (catatan kurir)" bila ada.
- Kode Bukti TH-XXXXXX: hash deterministik (id|total|created_at|kurir|waktu terima) dicetak di kaki struk + stempel "Dicetak [tanggal] oleh [aktor]" — struk sah hanya jika kode & jejak cocok data app. Struk ngarang tak punya kode/jejak. Anti paket tertukar: identitas kurir + penerima tertulis jelas di bukti cetak.
- Berlaku universal (kasir/admin ikut dapat blok Pengiriman saat order punya kurir).
- Tanpa perubahan DB. 4 titik × 2 file, node-check LULUS. Catatan: file mix-escape (closing tag pakai \<\/div>), penanda anchor penyuntingan struk di masa depan.
