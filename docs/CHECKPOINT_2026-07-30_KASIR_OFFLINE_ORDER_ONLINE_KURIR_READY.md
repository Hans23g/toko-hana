# CHECKPOINT 2026-07-30 — Kasir Offline, Order Online, Kurir Ready

Checkpoint ini dibuat sebelum masuk tahap **Akun Mitra Kurir**.  
Tujuannya agar jika harus pindah meja ngopi/chat, pembangunan Toko Hana tidak mulai dari nol.

---

## Cara baca di meja baru

Baca berurutan:

```txt
1. README_MULAI_DI_MEJA_BARU.md
2. CHECKPOINT_2026-07-30_KASIR_OFFLINE_ORDER_ONLINE_KURIR_READY.md
3. docs/NAWA_CITA_TOKO_HANA.md
4. db/DB_SCHEMA_RLS_2026-07-30.md
5. App.jsx / index.html jika perlu cek implementasi
```

Panggilan:

```txt
User = kawan
Assistant = CTO
Gaya = ngopi, hangat, konkret, hati-hati, jangan mulai dari nol
```

---

## Project aktif

```txt
/home/user/toko-hana/
```

File aktif:

```txt
index.html
App.jsx
manifest.json
assets/
tools/make_cq_compiled.py
docs/NAWA_CITA_TOKO_HANA.md
db/DB_SCHEMA_RLS_2026-07-30.md
README_CTO_WORKSPACE.md
```

Syntax terakhir sudah dicek:

```txt
node --check ✅
```

---

## Posisi produk saat checkpoint

Toko Hana sekarang berada pada fase:

```txt
Operasional Kasir + Order Online + Kurir Lite sudah mulai menyatu.
Selanjutnya: akun mitra kurir.
```

Visual/branding sudah dianggap cukup matang. Fokus sekarang adalah alur operasional.

---

## Alur Kasir Offline — Sudah dipulihkan

Alur kasir offline aktif:

```txt
Pilih / daftar member offline
→ scan/tambah barang ke keranjang
→ pilih pembayaran Rupiah
→ Catat ke Order Kasir
→ order muncul di tab Offline Kasir
→ Bayar / Sebagian / Potongan
→ struk bisa dicetak
→ histori order bisa cetak ulang
```

### Member offline dan HanaPoin

- Member offline dicari/didaftarkan dari meja kasir.
- Pelanggan umum/tidak terdaftar tidak otomatis mendapat HanaPoin.
- HanaPoin member offline **tidak diberikan saat order dicatat**.
- HanaPoin diberikan saat kasir klik **Bayar** dan pembayaran lunas.
- Order harus punya marker:

```txt
Member Offline HANA-{id}
```

baru `awardHanaPointsForPaidOrder()` memberi poin.

### Pembayaran sebagian / piutang

Jika kasir klik:

```txt
Sebagian
```

maka:

```txt
sisa pembayaran → customer_debts
order ditutup
struk bisa dicetak
HanaPoin belum diberikan penuh; piutang menunggu pelunasan
```

Saat piutang dilunasi:

```txt
Struk status: LUNAS
ID struk: PIUTANG-{id}
```

### Kembalian

Jika pembayaran tunai lebih dari total:

```txt
Tunai diterima ...
Kembalian ...
```

masuk ke `payment_note` dan tampil di struk.

---

## Struk / Receipt

### Logo struk

Struk memakai logo cart transparan:

```txt
BRAND_CATEGORY_LOGO_DATA_URI || BRAND_LOGO_DATA_URI
```

### Kop struk

Struk memakai:

```txt
receiptHeaderAddress || warungAddress || 'Bogor, Indonesia'
```

Admin dapat mengatur:

```txt
Admin → Branding → Alamat Warung → Alamat/Kop Struk (opsional)
```

Setting disimpan:

```txt
localStorage: toko_hana_receipt_header_address
Supabase settings: receipt_header_address
```

### Tombol struk

Halaman struk punya:

```txt
Cetak / Simpan PDF
Kirim WA Pelanggan
Kembali
```

Tombol bawah tidak ikut tercetak karena `.no-print` sudah diperkuat.

### Catatan struk

- Cetak pertama dari panel **Order terakhir selesai** boleh tanya catatan struk opsional.
- Catatan disimpan ke `orders.payment_note` sebagai:

```txt
Catatan kasir: ...
```

- Cetak ulang dari Histori Order Kasir tidak menanyakan catatan lagi.
- Catatan tetap muncul jika sudah tersimpan.

Contoh pemakaian:

```txt
Token PLN: 1234 5678 9012 3456
Nomor voucher
Catatan retur
Catatan paket
```

### WA struk

Tombol WA struk memakai form langsung:

```txt
https://api.whatsapp.com/send
```

Ada input nomor WA:

```txt
WA pelanggan: 628...
```

Kasir dapat mengisi/mengubah nomor sebelum kirim.

Catatan: format terbaik adalah `628...`.

Tombol `Unduh Struk` dihapus karena `Cetak / Simpan PDF` lebih stabil.

---

## Tab Order Kasir

Di halaman Orders kasir sekarang ada tab:

```txt
Offline Kasir
Order Online
```

### Offline Kasir

Untuk transaksi langsung di toko.

Aksi:

```txt
Potongan
Sebagian
Bayar
```

Tombol `Lunas` diganti menjadi `Bayar` karena lunas adalah status, bukan aksi.

### Order Online

Untuk order dari luar meja kasir.

Alur:

```txt
Order online masuk
→ Proses
→ Diproses
→ Pilih Kurir/Resi
→ Catat Paket Dikirim
→ Sedang Dikirim
→ Paket Sampai
→ Paket Diterima
→ Selesai
```

Order online tahap awal tidak memakai tombol:

```txt
Potongan / Sebagian / Lunas
```

Karena order online bisa:

```txt
belum bayar
sudah bayar QRIS tapi belum dicek
COD
```

---

## Konfirmasi Pembayaran Member

Di Riwayat Belanja member, order online status:

```txt
Belum Bayar
Siap Bayar
```

punya panel:

```txt
Konfirmasi Pembayaran
```

Tombol:

```txt
Kirim Bukti / Konfirmasi via WA
```

Membuka WA kasir/admin (`merchantWaNumber`) dengan template rapi:

```txt
*Halo Kasir/Admin Toko Hana,*
Saya mau konfirmasi pembayaran pesanan berikut:
------------------------------------------
🧾 *Order:* HNA-xxxx
👤 *Nama:* ...
📞 *WA:* ...
💳 *Metode:* ...
💰 *Total:* *Rp ...*
------------------------------------------
📎 *Bukti QRIS:* saya lampirkan di chat ini.
📝 *Catatan:* ...
------------------------------------------
Terima kasih ☕
```

Jika bukan QRIS:

```txt
ℹ️ Mohon bantu cek status pembayaran pesanan ini.
```

---

## Order Online / Pengiriman

Bahasa UI untuk order online memakai bahasa paket:

```txt
Dikirim     → tampil sebagai Sedang Dikirim
Kurir Tiba  → tampil sebagai Paket Sampai
Barang Diterima → Paket Diterima
```

Internal DB tetap memakai status text:

```txt
Dikirim
Kurir Tiba
Selesai
```

Agar tidak perlu migration.

### Form Pilih Kurir/Resi

Di tab Order Online, saat order `Diproses`, tombol:

```txt
Pilih Kurir/Resi
```

membuka form inline di halaman kasir.

Pilihan kurir/ekspedisi:

```txt
J&T Express
JNE Reguler
SiCepat Reguler
GoSend / GrabExpress
Mitra Kurir Aktif
Kurir Toko Hana
Kurir Warga
Ambil di Toko
```

Jika pilih `Mitra Kurir Aktif`, muncul dropdown mitra kurir aktif dari `partners`:

```txt
type = courier
status = active
```

Input:

```txt
Nomor resi / catatan paket
```

Tombol:

```txt
Catat Paket Dikirim
```

Setelah klik:

```txt
status = Dikirim
UI = Sedang Dikirim
```

---

## Alur Kurir / Paket

Alur status lengkap:

```txt
Diproses
→ Sedang Dikirim
→ Paket Sampai
→ Paket Diterima
→ Selesai
```

### Admin/kasir

Di histori online/pengiriman:

```txt
Dikirim → Paket Sampai
Kurir Tiba → Konfirmasi Paket Diterima
```

### Pelanggan

Saat status `Kurir Tiba` / UI `Paket Sampai`, pelanggan punya tombol:

```txt
Paket Diterima
```

Jika pelanggan klik:

```txt
status = Selesai
courier_status = diterima_pelanggan
customer_confirmed_at = now
```

Admin tetap bisa fallback:

```txt
Konfirmasi Paket Diterima
```

jika pelanggan belum sempat konfirmasi.

---

## Data kurir yang ditulis ke DB

Saat `Catat Paket Dikirim`, app menulis:

```txt
status = Dikirim
courier
courier_name
courier_phone
courier_status = dikirim
courier_partner_id
courier_fee
assigned_courier_at
picked_up_at
delivery_proof_note
payment_note
resi
```

Saat `Paket Sampai`:

```txt
status = Kurir Tiba
courier_status = tiba
delivered_at = now
delivery_proof_note
payment_note
```

Saat `Paket Diterima`:

```txt
status = Selesai
courier_status = diterima_pelanggan
customer_confirmed_at = now
```

Saat admin fallback:

```txt
status = Selesai
courier_status = diterima_admin
customer_confirmed_at = now
```

---

## HanaPoin Kurir Lite

Form Pengiriman punya:

```txt
Bonus HanaPoin Kurir
0 / +100 / +250 / +500
```

Prinsip:

```txt
Fee kurir = uang nyata
Bonus HanaPoin = voucher/poin loyalti
```

Bonus diberikan saat order `Selesai`, bukan saat baru dikirim.

Karena DB belum punya `courier_bonus_points`, bonus dicatat di:

```txt
payment_note
delivery_proof_note
```

Format:

```txt
Bonus HanaPoin Kurir +250
```

Saat selesai, app membaca catatan itu dan menambahkan poin ke kurir di `customers`.

Jika kurir belum ada di `customers`, app membuat member kurir otomatis.

---

## Keuangan

Menu Keuangan membaca:

```txt
Fee Kurir
Bonus Poin Kurir
Bersih setelah fee kurir
```

### Fee Kurir

Dibaca dari `orders.courier_fee` untuk status:

```txt
Dikirim
Kurir Tiba
Selesai
```

### Bonus Poin Kurir

Dibaca dari catatan:

```txt
Bonus HanaPoin Kurir +...
```

### Bersih Setelah Fee Kurir

```txt
kas nyata hari ini - fee kurir hari ini
```

Bonus poin tidak dihitung sebagai cash out langsung.

---

## DB schema / RLS

Lihat:

```txt
db/DB_SCHEMA_RLS_2026-07-30.md
```

Kesimpulan:

- `orders` sudah punya kolom kurir lengkap.
- `partners` cukup untuk Mitra Kurir Lite.
- `partner_applications` cukup untuk pendaftaran calon mitra kurir.
- RLS `orders` mengizinkan admin/kasir update.

---

## Dokumen ruh produk

Lihat:

```txt
docs/NAWA_CITA_TOKO_HANA.md
```

Meja baru wajib baca Nawa Cita agar yang dilanjutkan bukan cuma kode, tapi juga rasa.

---

## Roadmap berikutnya

Tahap berikutnya setelah checkpoint ini:

```txt
Akun Mitra Kurir
```

Tujuan:

```txt
kurir punya akses/identitas sendiri
kurir bisa melihat paket yang ditugaskan
kurir update status paket
admin tetap punya otoritas penuh
riwayat fee dan HanaPoin kurir jelas
```

Setelah itu:

```txt
Garansi Barang Sesuai Lite
```

Dengan tombol:

```txt
Paket Diterima
Barang Tidak Sesuai
```

---

## Hal yang perlu dijaga

- Jangan bongkar UI yang sudah matang kecuali perlu.
- Jangan campur app luar Pi Browser dengan Pi SDK resmi.
- Jangan minta passphrase wallet.
- Jangan hardcode secret/API key.
- Setiap perubahan DB wajib update `db/DB_SCHEMA_RLS_*.md` dan checkpoint.
- Setiap update penting wajib checkpoint.

---

## Update tambahan — Jasa Pengiriman Bisa Edit & Tambah

Menjawab kebutuhan operasional user:

```txt
Checklist hanya untuk menonaktifkan jasa pengiriman yang sedang tidak bisa dipakai.
Admin juga perlu opsi edit/tambah kalau ingin memakai jasa pengiriman lain untuk mengganti list yang tidak tersedia.
```

### Implementasi

Lokasi:

```txt
Admin → Kategori → Jasa Pengiriman Aktif
```

Fitur sekarang:

- Checklist aktif/nonaktif sementara tetap ada.
- Nama jasa pengiriman bisa diedit langsung di kolom tiap baris.
- Ada form `Tambah jasa lain` untuk ekspedisi baru/custom.
- Jasa custom bisa dihapus.
- Jasa bawaan tidak dihapus permanen; bisa diedit/nonaktifkan, lalu `Reset` memulihkan daftar standar.

### Penyimpanan

Tetap memakai:

```txt
localStorage: toko_hana_shipping_services
Supabase settings: shipping_services
```

Tidak ada perubahan DB.

### Dampak

Daftar aktif/diedit/custom dipakai oleh:

```txt
Kasir → Orders → Order Online → Pilih Kurir/Resi
Admin → Pengiriman → Pilih kurir/ekspedisi
```

`Mitra Kurir Aktif` tetap opsi khusus yang membaca mitra kurir aktif dari tabel `partners`.

### File terkait

```txt
App.jsx
index.html
README_CTO_WORKSPACE.md
docs/UPDATE_2026-07-30_JASA_PENGIRIMAN_EDIT_TAMBAH.md
```

### Tes teknis

Script aplikasi dari `index.html` lolos:

```bash
node --check /tmp/tokohana_app_script_check.js
```

### Tes manual berikutnya

- Edit `JNE Reguler` menjadi jasa lain, cek muncul di pilihan kurir/resi.
- Tambah jasa baru, cek muncul di pilihan kurir/resi.
- Nonaktifkan salah satu jasa, cek hilang dari pilihan kurir/resi.
- Reset, cek daftar kembali standar.


---

## Update tambahan — Posisi Dropdown Jasa Pengiriman

Permintaan user:

```txt
Form Jasa Pengiriman Aktif diletakkan di bawah Daftar Rak Kategori
dan bentuknya dibuat seperti dropdown.
```

Implementasi:

- `Jasa Pengiriman Aktif` tidak lagi tampil sebelum `Daftar Rak Kategori`.
- Sekarang posisinya setelah panel `Daftar Rak Kategori`.
- Bentuknya memakai dropdown/collapsible `<details>`.
- Saat tertutup hanya tampil judul, ringkasan jumlah jasa aktif, dan tombol `Atur`.
- Saat dibuka, admin bisa:
  - aktif/nonaktif jasa pengiriman,
  - edit nama jasa,
  - tambah jasa lain,
  - hapus jasa custom,
  - reset daftar bawaan.

Tidak ada perubahan DB.

Tes teknis:

```bash
node --check /tmp/tokohana_app_script_check.js
```

Hasil: OK.

---

## Update tambahan — Daftar Rak Kategori Jadi Dropdown

Permintaan user:

```txt
Form Daftar Rak Kategori juga dibuat dropdown,
karena menu Kategori perlu ruang untuk Kategori Mitra.
```

Implementasi:

- `Daftar Rak Kategori` sekarang menjadi dropdown/collapsible `<details>`.
- Saat tertutup tampil:
  - judul `Daftar Rak Kategori`,
  - jumlah rak,
  - tombol `Atur`.
- Saat dibuka, fitur lama tetap ada:
  - geser urutan rak,
  - edit rak,
  - hapus rak.
- `Jasa Pengiriman Aktif` tetap berada di bawahnya sebagai dropdown juga.

Urutan baru di `Admin → Kategori`:

```txt
Tambah/Ubah Rak Barang
Daftar Rak Kategori (dropdown)
Jasa Pengiriman Aktif (dropdown)
```

Arah berikutnya yang disiapkan:

```txt
Kategori Mitra
```

Isi awal yang direncanakan:

- daftar nama mitra,
- tipe mitra,
- status aktif/nonaktif/suspended,
- jika tipe mitra `courier`, tampil sebagai `Mitra Kurir`,
- nanti bisa menjadi pintu untuk Akun Mitra Kurir.

Tidak ada perubahan DB.

Tes teknis:

```bash
node --check /tmp/tokohana_app_script_check.js
```

Hasil: OK.

---

## Update tambahan — Kemitraan Dipindah ke Pelanggan / Relasi

Catatan arah user:

```txt
Mitra tidak enak jika diletakkan di rak warung/kategori.
Lebih tepat masuk menu Pelanggan/Relasi, dibuat seperti Branding yang punya submenu.
```

Implementasi:

- `Admin → Pelanggan` sekarang memiliki dua submenu:

```txt
Pelanggan
Mitra
```

- Submenu `Pelanggan` tetap menampilkan halaman Sahabat Warung / CRM pelanggan.
- Submenu `Mitra` menampilkan halaman baru `Kemitraan Warung`.

Isi halaman `Mitra`:

- ringkasan total mitra,
- jumlah mitra kurir,
- jumlah mitra aktif,
- jumlah mitra yang perlu dicek,
- form tambah/edit mitra,
- pilihan tipe mitra, dengan `courier` ditampilkan sebagai `Mitra Kurir`,
- pilihan status:

```txt
Aktif
Nonaktif
Pending
Suspend
Blokir
```

- daftar mitra dengan badge tipe/status,
- tombol WA, Edit, Hapus.

Relasi penting:

```txt
partners.type = courier
partners.status = active
```

tetap menjadi sumber `Mitra Kurir Aktif` pada form pengiriman.

Tidak ada perubahan DB/migration karena tabel `partners` sudah punya kolom `type` dan `status`.

Tes teknis:

```bash
node --check /tmp/tokohana_app_script_check.js
```

Hasil: OK.

Arah berikutnya:

```txt
Akun Mitra Kurir
```

setelah halaman kemitraan ini terasa cukup rapi sebagai pondasi relasi.

---

## Update kecil — Judul Menu Kategori

Permintaan user:

```txt
Judul halaman menu Kategori perlu disesuaikan dari "Rak Warung"
menjadi "Kategori Produk dan Jasa Pengiriman".
```

Implementasi:

- Meta header admin untuk `kategori` diubah menjadi:

```txt
Kategori Produk dan Jasa Pengiriman
```

- Subjudul kecil:

```txt
Penata Kategori
```

- Deskripsi:

```txt
Susun kategori produk dan jasa pengiriman agar operasional warung rapi.
```

Tidak ada perubahan DB.

Tes teknis:

```bash
node --check /tmp/tokohana_app_script_check.js
```

Hasil: OK.

---

## Update tambahan — Proses Pelanggan Menjadi Mitra

Permintaan user:

```txt
Pengajuan mitra dilakukan setelah proses pendaftaran pelanggan,
agar bisa mendapatkan poin.
Yang mendapat poin saat ini hanya mitra kategori kurir.
Ekspedisi luar tidak ada poin.
```

### Alur baru

```txt
Pelanggan daftar/login sebagai member
→ buka Jelajah → Mitra
→ isi pengajuan mitra
→ pengajuan masuk ke Admin → Pelanggan → Mitra
→ admin cek dan klik Jadikan Mitra / Jadikan Kurir
→ data masuk ke partners
```

### Implementasi user/member

- Form pengajuan mitra sekarang memeriksa `currentUser.role === 'customer'`.
- Jika belum login sebagai pelanggan, form tidak bisa dikirim dan tombol berubah menjadi:

```txt
Daftar/Login Member Dulu
```

- Jika sudah login sebagai pelanggan, form menampilkan info akun member.
- Nomor WA pengajuan mengikuti akun member agar bonus HanaPoin kurir bisa masuk ke member yang benar.
- Payload `partner_applications.notes` diberi catatan member dan kebijakan poin.

### Implementasi admin

Di:

```txt
Admin → Pelanggan → Mitra
```

ada dropdown/list:

```txt
Pengajuan Mitra Masuk
```

Admin bisa:

- ubah status pengajuan,
- klik `Jadikan Kurir` untuk pengajuan tipe `courier`,
- klik `Jadikan Mitra` untuk tipe lain.

Saat disetujui:

- data dibuat/diperbarui ke tabel `partners`,
- status partner dibuat `active`,
- pengajuan diberi status `approved`.

### Kebijakan poin kurir

Bonus HanaPoin operasional hanya untuk:

```txt
partners.type = courier
partners.status = active
```

Dengan kata lain:

```txt
Mitra Kurir Aktif = bisa dapat bonus HanaPoin kurir
Ekspedisi luar / jasa pengiriman umum = tidak dapat HanaPoin
```

Form bonus HanaPoin di pengiriman sekarang dinonaktifkan kalau pilihan pengiriman bukan `Mitra Kurir Aktif`.

### DB

Tidak ada perubahan DB/migration.

Relasi member → mitra saat ini ditautkan secara lite lewat:

```txt
phone / WA
name
notes internal
```

Nanti kalau butuh lebih kuat, bisa ditambah kolom khusus seperti:

```txt
partners.customer_id
partner_applications.customer_id
hanapoin_ledger
```

Tapi untuk tahap ini belum perlu.

### Tes teknis

```bash
node --check /tmp/tokohana_app_script_check.js
```

Hasil: OK.

---

## Update tambahan — Mitra Kurir Pickup Lite

Permintaan user:

```txt
Halaman order nantinya sesuai peran.
Jika akun adalah Mitra Kurir, selain status order belanja sendiri,
ada form paling atas untuk pickup dan punya kartu mitra seperti kartu yang sudah dirancang.
```

### Implementasi

Akun pelanggan dikenali sebagai `Mitra Kurir Aktif` jika cocok dengan:

```txt
partners.type = courier
partners.status = active
```

Pencocokan tahap lite memakai:

```txt
WA / phone
nama
```

Belum memakai role auth khusus.

### Halaman order

Untuk Mitra Kurir Aktif:

- Header berubah menjadi:

```txt
Ruang Order Mitra Kurir
Pickup & Riwayat Pesanan
```

- Panel paling atas:

```txt
Form Pickup Mitra Kurir
Meja Pickup Paket
```

- Panel menampilkan:
  - mini kartu Mitra Kurir,
  - nama/area/WA kurir,
  - status aktif,
  - saldo HanaPoin,
  - catatan pickup opsional,
  - daftar order yang ditugaskan ke kurir.

### Tombol operasional kurir

```txt
Konfirmasi Pickup
```

mengubah:

```txt
orders.courier_status = pickup
orders.picked_up_at = now
orders.delivery_proof_note += catatan pickup
orders.payment_note += catatan pickup
```

```txt
Paket Sampai
```

memakai alur lama:

```txt
status = Kurir Tiba
courier_status = tiba
```

```txt
WA
```

membuka WhatsApp pelanggan.

### Riwayat belanja pribadi

Tetap tampil di bawah panel pickup sebagai:

```txt
Riwayat Belanja Saya
```

Jadi satu akun bisa punya dua sisi:

```txt
Pelanggan/member
Mitra Kurir aktif
```

### Kartu mitra

Jika akun adalah Mitra Kurir Aktif, kartu profil menggunakan meta:

```txt
Kartu Mitra Kurir Toko Hana
🛵 Mitra Kurir Toko Hana
```

Tetap mempertahankan saldo HanaPoin member.

### HanaPoin

Bonus HanaPoin tetap hanya untuk:

```txt
Mitra Kurir Aktif
```

Ekspedisi luar / jasa pengiriman umum tetap tidak mendapat poin.

Poin masuk saat order selesai/diterima, bukan saat pickup.

### DB

Tidak ada perubahan DB/migration.

Kolom lama yang dipakai:

```txt
orders.courier_status
orders.picked_up_at
orders.delivery_proof_note
orders.payment_note
partners.type
partners.status
```

### Tes teknis

```bash
node --check /tmp/tokohana_app_script_check.js
```

Hasil: OK.


---

## Fix tambahan — RLS Pengajuan Mitra

User menemukan error saat kirim form mitra:

```txt
Form belum terkirim ke database.
Detail: new row violates row-level security policy for table "partner_applications"
```

Penyebab di app:

```js
client.from('partner_applications').insert([application]).select()
```

Padahal desain RLS yang aman:

```txt
Publik/user boleh INSERT pengajuan mitra.
Publik/user tidak boleh SELECT semua pengajuan mitra.
Admin boleh SELECT.
```

Karena `.select()` meminta data row dibaca balik setelah insert, RLS bisa menolak request walau INSERT policy ada.

### Fix

`insertPartnerApplication()` sekarang hanya:

```js
client.from('partner_applications').insert([application])
```

tanpa `.select()`.

Untuk UX lokal, function mengembalikan data lokal sementara agar toast/list lokal tetap bisa update.

### Catatan jika masih error

Jika setelah patch/deploy error tetap muncul, cek SQL policy Supabase:

```sql
create policy public_insert_partner_applications
on public.partner_applications
for insert
to anon, authenticated
with check (true);
```

Atau jika role policy lama memakai `public`, pastikan benar-benar aktif dan RLS tabel tidak punya constraint lain yang menolak.

Tidak ada perubahan schema.

Tes teknis:

```bash
node --check /tmp/tokohana_app_script_check.js
```

Hasil: OK.

---

## Fix tambahan — Member HANA Approved Tapi Belum Jadi Mitra Kurir

Kasus user:

```txt
Member HANA-5 / email misaly@gmail.com sudah mengajukan Mitra Kurir dari halaman member.
Admin sudah approve.
Namun status/kartu member belum berubah menjadi Mitra Kurir.
```

### Penyebab

Ada dua lapisan status:

```txt
partner_applications.status = approved
```

berarti berkas pengajuan disetujui.

Sedangkan halaman member berubah menjadi Mitra Kurir jika ada row:

```txt
partners.type = courier
partners.status = active
```

yang cocok dengan akun member.

Sebelumnya pencocokan akun kurir aktif hanya via:

```txt
WA / phone
nama
```

Jadi bisa gagal jika WA/nama tidak identik, atau jika admin hanya mengubah status pengajuan menjadi `approved` tanpa membuat row `partners`.

### Fix kode

- Deteksi `currentCourierPartner` sekarang cocok lewat:

```txt
WA / phone
nama
HANA-{id} di notes partner
email member di notes partner
```

- Form pengajuan mitra baru menyimpan:

```txt
Member HANA-{id}
Email member: ...
```

ke `partner_applications.notes`.

- Jika admin mengubah pengajuan ke status:

```txt
approved
```

app akan mencoba otomatis menjalankan promosi ke `partners`.

- Jika pengajuan sudah telanjur `approved` tetapi belum ada partner aktif, tombol di daftar pengajuan tetap tersedia sebagai:

```txt
Sinkronkan Kurir
Sinkronkan Mitra
```

- Halaman member me-refresh data `partners` saat membuka:

```txt
Profil
Cart / Order
```

agar perubahan admin cepat terbaca.

### Langkah memperbaiki data HANA-5 yang sudah terlanjur approved

Setelah patch/deploy:

```txt
Admin → Pelanggan → Mitra → Pengajuan Mitra Masuk
```

Cari pengajuan HANA-5 / email terkait, lalu klik:

```txt
Sinkronkan Kurir
```

Jika tombol belum muncul, ubah status:

```txt
approved → contacted → approved
```

atau klik aksi sinkron yang tersedia.

Setelah itu member HANA-5 perlu refresh/buka ulang halaman Profil/Order.

### DB

Tidak ada perubahan schema.

Relasi masih lite lewat:

```txt
partners.notes
partner_applications.notes
phone
name
email
HANA-ID
```

Nanti fase kuat bisa tambah kolom eksplisit:

```txt
partners.customer_id
partner_applications.customer_id
```

Tes teknis:

```bash
node --check /tmp/tokohana_app_script_check.js
```

Hasil: OK.

---

## Fix tambahan — Paket Mitra Kurir Tidak Muncul di Form Pickup

Kasus user:

```txt
Sudah memilih Mitra Kurir Aktif dan menugaskan kurir,
tapi paket belum tampil di Form Pickup akun kurir.
```

### Penyebab

Saat daftar order diambil ulang dari Supabase, mapping order lama hanya membawa:

```txt
courier/resi sederhana
```

Belum membawa field kurir lengkap:

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

Akibatnya Form Pickup tidak punya tanda kuat untuk mencocokkan order dengan akun Mitra Kurir.

### Fix

- Mapping order dari Supabase sekarang membawa kolom kurir lengkap.
- Form Pickup mencocokkan paket lewat:

```txt
courier_partner_id
courier_phone
courier_name
courier
kurir
```

- Akun member/kurir refresh order saat membuka:

```txt
Cart / Order
Profil
```

- Jika akun sudah Mitra Kurir Aktif, app melakukan polling ringan order setiap ±15 detik saat di halaman tersebut.
- `handleShipOrder` sekarang mencegah admin/kasir menyimpan `Mitra Kurir` tanpa memilih nama mitra kurir aktif.

### Langkah test ulang

```txt
1. Admin/Kasir pilih order status Diproses.
2. Klik Pilih Kurir/Resi.
3. Pilih kurir/ekspedisi = Mitra Kurir Aktif.
4. Pilih nama mitra kurir aktif di dropdown.
5. Isi catatan/resi.
6. Klik Catat Paket Dikirim.
7. Login/buka akun kurir → menu Order.
8. Paket muncul di Form Pickup.
```

Jika belum muncul, refresh akun kurir atau tunggu polling ±15 detik.

Tes teknis:

```bash
node --check /tmp/tokohana_app_script_check.js
```

Hasil: OK.

---

## Fix tambahan — Konfirmasi Pickup Kurir Mental Balik

Kasus user:

```txt
Saat klik Konfirmasi Pickup, status sempat menjadi pickup.
Setelah beberapa saat kembali menjadi Perlu Pickup dan tombol Konfirmasi muncul lagi.
```

### Penyebab

Bukan karena order berasal dari akun kurir yang sama.

Penyebab teknis:

```txt
Akun Mitra Kurir saat ini masih role customer/member.
RLS orders hanya mengizinkan update oleh admin/kasir.
```

Alurnya:

```txt
Kurir klik Konfirmasi Pickup
→ state lokal berubah jadi pickup
→ update DB ditolak RLS
→ polling/refresh mengambil data DB lama
→ courier_status kembali dikirim
→ tombol Perlu Pickup muncul lagi
```

### Fix lite di app

- Ditambah local overlay untuk status kurir:

```txt
localStorage: toko_hana_courier_local_order_patches
```

- Saat kurir klik:

```txt
Konfirmasi Pickup
```

app menyimpan patch lokal:

```txt
courier_status = pickup
picked_up_at = now
delivery_proof_note += catatan pickup
payment_note += catatan pickup
```

- Saat order di-refresh dari DB, patch lokal digabung kembali sehingga UI kurir tidak mental balik.
- `Paket Sampai` dari akun kurir juga diberi patch lokal jika DB menolak update.
- Jika DB menolak update, toast memberi tahu bahwa status tercatat di HP kurir dan admin tetap bisa sinkronkan.

### Batasan

Fix ini menjaga UX di perangkat kurir, tetapi belum membuat update pickup permanen lintas semua perangkat jika RLS DB masih menolak update.

Agar operasional penuh, fase berikutnya perlu salah satu:

```txt
1. RPC Security Definer khusus kurir untuk update courier_status terbatas
2. Policy RLS kurir yang aman berbasis auth user/phone/customer_id
3. Kolom relasi eksplisit partners.customer_id / partner_applications.customer_id
```

Untuk sekarang, admin masih bisa menjadi otoritas final/sinkron.

Tes teknis:

```bash
node --check /tmp/tokohana_app_script_check.js
```

Hasil: OK.

---

## Update tambahan — Tarif Zona Antar & Kurir Warga

Permintaan user:

```txt
Perlu pengaturan tarif zona di menu kategori.
Selain Mitra Kurir ada Kurir Warga dan Kurir Toko.
Zona dekat/tetangga warung bisa ongkir Rp 2.000,
dan fee ini bisa diberikan ke warga sekitar yang bantu antar paket ringan.
```

### Implementasi UI

Lokasi:

```txt
Admin → Kategori Produk dan Jasa Pengiriman → Tarif Zona Antar
```

Panel dibuat dropdown/collapsible setelah:

```txt
Daftar Rak Kategori
Jasa Pengiriman Aktif
```

### Zona default

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
Rekomendasi kurir: Kurir Warga
```

### Field yang bisa diatur admin

Per zona:

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

Rekomendasi kurir pilihan:

```txt
Kurir Warga
Kurir Toko Hana
Mitra Kurir Aktif
Ekspedisi Umum
Ambil di Toko
Admin Konfirmasi
```

Admin juga bisa tambah zona custom.

### Deteksi zona

Deteksi zona membaca:

```txt
kata kunci alamat pelanggan
RT/RW alamat warung fisik
RT/RW alamat pelanggan
```

Jika alamat warung dan pelanggan memiliki RT/RW sama, sistem bisa masuk ke:

```txt
Tetangga Warung / RT-RW Dekat
```

Kata kunci bisa diatur seperti:

```txt
Jl Melati, Gang Mushola, RT 01, RW 02, depan warung, sebelah warung
```

### Dampak checkout

Saat pelanggan checkout:

- zona terdeteksi otomatis,
- ongkir mengikuti tarif zona,
- order menyimpan catatan rekomendasi kurir,
- pesan WhatsApp order menampilkan:

```txt
Zona Antar: ...
Rekomendasi Kurir: ...
```

### Dampak admin/kasir

Saat order diproses dan admin/kasir klik:

```txt
Pilih Kurir/Resi
```

sistem membaca rekomendasi kurir dari catatan zona.

Contoh:

```txt
Zona Tetangga Warung → default pilihan Kurir Warga
```

### Penyimpanan

Tidak ada perubahan DB/migration.

Setting disimpan di:

```txt
localStorage: toko_hana_delivery_zones
Supabase settings: delivery_zones
```

### Catatan etis Kurir Warga

Kurir Warga adalah konsep pemberdayaan warga sekitar, bukan eksploitasi anak.

Batas aman:

```txt
jarak dekat
paket ringan
aman
sukarela/tidak memaksa
jika masih di bawah umur harus seizin orang tua/wali
tidak mengganggu sekolah/kegiatan utama
```

### Tes teknis

```bash
node --check /tmp/tokohana_app_script_check.js
```

Hasil: OK.

---

## Catatan arah — Kurir Warga Tidak Wajib Member

User memperjelas maksud Kurir Warga:

```txt
Kurir Warga tidak harus terdaftar sebagai member.
Tidak harus punya HP.
Dipilih kasir/admin berdasarkan saling kenal dan kepercayaan.
```

Artinya sistem sengaja fleksibel:

```txt
Mitra Kurir Aktif = partner/member resmi, bisa dapat HanaPoin kurir.
Kurir Warga = bantuan lokal/manual, fee ongkir bisa diberikan langsung, tidak wajib HanaPoin.
```

Contoh catatan manual di form pengiriman:

```txt
Dibawa Adit RT 02, ongkir warga Rp2.000
Dibantu Bang Ujang depan warung, paket ringan
```

Prinsip aman:

- kasir/admin menentukan kelayakan,
- saling kenal dan dipercaya,
- jarak dekat,
- paket ringan,
- tidak memaksa,
- kalau masih di bawah umur harus seizin orang tua/wali,
- tidak mengganggu sekolah/kegiatan utama.

UI copy di panel `Tarif Zona Antar` diperbarui untuk menyatakan Kurir Warga tidak wajib member/punya HP dan bisa dicatat manual.

Tes teknis:

```bash
node --check /tmp/tokohana_app_script_check.js
```

Hasil: OK.

---

## Catatan Nawa Cita — Sistem Mengikuti Hidup, Bukan Sebaliknya

Percakapan ngopi menegaskan satu prinsip besar:

```txt
Toko Hana bukan sistem yang memaksa pengguna menyesuaikan diri.
Toko Hana adalah sistem yang menyesuaikan diri dengan kenyataan warung.
```

User menyebut ini bagian dari:

```txt
Nawa Cita Revolusioner Toko Hana
```

Poin inti:

- Banyak sistem besar/kecil mengharuskan pengguna cocokologi agar fitur bisa dipakai.
- Toko Hana justru dirancang agar fleksibel terhadap kebutuhan nyata.
- Pembeli online, pembeli offline, kasir, admin, mitra, kurir warga, warga tanpa HP, semua tetap punya tempat.
- Jelajah menjadi contoh unik: sistem warung/kasir yang memuat ruang konten, edukasi, mitra, info warga, undangan, ucapan, dan cerita hampir tidak umum ditemukan.
- Ini bukan sekadar fitur, tapi pembeda ruh produk.

Catatan ini sudah ditambahkan ke:

```txt
docs/NAWA_CITA_TOKO_HANA.md
```

Bagian:

```txt
Catatan Revolusioner — Sistem Mengikuti Hidup, Bukan Hidup Dipaksa Mengikuti Sistem
```


---

## Update tambahan — PWA Icon Premium Gold

User mengirim icon baru:

```txt
/home/user/uploads/iconpwa1.png
```

Tujuan:

```txt
dipakai sebagai icon PWA/install agar tidak polos dan lebih cocok dengan rasa Toko Hana.
```

### Implementasi

Source disimpan di:

```txt
assets/pwa/icon_pwa_gold_hana_cart_source.png
```

Icon install dibuat ulang:

```txt
assets/pwa/icon_install_64.png
assets/pwa/icon_install_180.png
assets/pwa/icon_install_192.png
assets/pwa/icon_install_512.png
```

`manifest.json` diperbarui memakai icon baru.

`index.html` diperbarui pada:

```txt
<link rel="icon">
<link rel="apple-touch-icon">
<link rel="manifest">
```

### Backup

Icon lama dibackup di:

```txt
_archive/backups/pwa_icons_before_gold_*/
```

### Catatan PWA cache

Jika icon belum berubah di HP setelah deploy:

```txt
uninstall PWA lama
clear cache bila perlu
install ulang Toko Hana
```

### Tes teknis

```bash
node --check /tmp/tokohana_app_script_check.js
```

Hasil: OK.


---

## Update tambahan — Icon Kategori “Semua” Gold

User menemukan insight desain:

```txt
Background batik bagus untuk suasana besar,
tapi untuk icon kecil logo jadi kurang terlihat.
Background emas lebih terbaca dan mewakili UI Toko Hana yang ungu-emas.
```

Setelah icon PWA gold cocok, desain yang sama diterapkan ke kategori:

```txt
Semua
```

### Implementasi

Source:

```txt
assets/category/icon_category_gold_hana_cart_source.png
```

Aset aktif diperbarui:

```txt
assets/category/icon_category_cart_transparent_512.png
assets/category/icon_category_tas_bg_cleanpad_512.png
```

Source code diperbarui:

```txt
App.jsx → CTO_HANA_CATEGORY_ICON_DATA_URI
index.html → window.BRAND_CATEGORY_LOGO_DATA_URI
```

Backup icon lama:

```txt
_archive/backups/category_icon_before_gold_*/
```

### Tes teknis

```bash
node --check /tmp/tokohana_app_script_check.js
```

Hasil: OK.


---

## Update tambahan — Favicon Transparan, PWA/Kategori Gold

User mengevaluasi visual:

```txt
PWA icon dan kategori “Semua” cocok memakai background emas.
Namun favicon browser/tab lebih jelas memakai logo transparan lama.
```

Implementasi:

- `assets/pwa/icon_install_64.png` dikembalikan dari backup sebelum gold.
- `index.html` `<link rel="icon" sizes="64x64">` diperbarui memakai favicon transparan.
- PWA/install tetap gold:

```txt
assets/pwa/icon_install_180.png
assets/pwa/icon_install_192.png
assets/pwa/icon_install_512.png
manifest.json
```

- Kategori `Semua` tetap gold:

```txt
assets/category/icon_category_cart_transparent_512.png
App.jsx CTO_HANA_CATEGORY_ICON_DATA_URI
index.html window.BRAND_CATEGORY_LOGO_DATA_URI
```

Tes teknis:

```bash
node --check /tmp/tokohana_app_script_check.js
```

Hasil: OK.

---

## Update kecil — Efek Aktif Kategori Pakai Warna Search Icon

User bertanya warna icon kaca pembesar dan mic di kotak search.

Warna utama:

```txt
#B8860B
```

Nama rasa:

```txt
emas tua / golden brown
```

Hover mic:

```txt
#FFD700
```

Implementasi:

- Efek aktif kategori horizontal memakai `#B8860B` untuk border, ring, shadow, teks light mode, dan garis bawah.
- Drop-shadow icon kategori `Semua` aktif juga memakai nuansa `rgba(184,134,11,...)`.
- Dropdown kategori aktif juga diselaraskan ke `#B8860B`.

Tujuan:

```txt
kategori aktif terasa lebih matang, premium, dan nyambung dengan search bar.
```

Tes teknis:

```bash
node --check /tmp/tokohana_app_script_check.js
```

Hasil: OK.

---

## Update kecil — Tombol Tengah Navbar Pakai Emas Matang

Setelah warna aktif kategori memakai:

```txt
#B8860B
```

user ingin mencoba warna yang sama ke icon/tombol induk tengah navbar.

Implementasi:

- Border tombol tengah navbar/QRIS:

```txt
#FFD700 → #B8860B
```

- Shadow/glow tombol:

```txt
rgba(255,215,0,...) → rgba(184,134,11,...)
```

- Icon QR tombol tengah:

```txt
#FFD700 → #B8860B
```

plus drop-shadow halus agar tetap terbaca.

Tujuan:

```txt
lebih kalem, lebih emas matang, tidak terlalu nyengat.
```

Tes teknis:

```bash
node --check /tmp/tokohana_app_script_check.js
```

Hasil: OK.

---

## Update kecil — Tombol Tengah Navbar Pakai Krem Emas Muda

Percobaan `#B8860B` pada tombol tengah navbar terasa terlalu berat di warna ungu.

Keputusan:

```txt
Kategori aktif/search icon = #B8860B
Tombol tengah navbar = #FFE8A8
```

Alasan:

```txt
#B8860B enak di background terang/gold.
#FFE8A8 lebih terbaca di background ungu pekat.
```

Implementasi tombol tengah navbar/QRIS:

```txt
border/icon: #FFE8A8
shadow: rgba(255,216,132,...)
```

Tes teknis:

```bash
node --check /tmp/tokohana_app_script_check.js
```

Hasil: OK.

---

## Update kecil — Icon Navbar Gradient Krem Emas ke Emas Matang

Permintaan user:

```txt
Coba icon navbar pakai krem emas gradasi emas matang,
agar tetap terlihat kalau ada area putih/terang.
```

Implementasi:

- `WarungIcon` diberi prop khusus:

```txt
nav: true
```

- Jika `nav` aktif, stroke/fill icon memakai gradient SVG:

```txt
#FFE8A8 → #FFD784 → #B8860B
```

- Berlaku untuk icon navbar:

```txt
Home
Jelajah
Saya
```

- Icon `Order` yang memakai Lucide diselaraskan:

```txt
aktif: #FFE8A8
nonaktif: #D4AF37
```

- Tombol tengah QR tetap memakai:

```txt
#FFE8A8
```

- Icon WarungIcon di luar navbar tidak berubah karena gradient hanya dipakai saat `nav: true`.

Tes teknis:

```bash
node --check /tmp/tokohana_app_script_check.js
```

Hasil: OK.

---

## Update kecil — Tombol QRIS Tengah Navbar Lebih Kontras di Putih

User mengoreksi:

```txt
Tombol navbar QRIS perlu kelihatan saat berada di atas halaman putih,
karena warna krem sebelumnya terlalu terang.
```

Implementasi:

```txt
outer border: #B8860B
inner ring/glow: #FFE8A8
icon QR: #FFD784
```

Detail style:

- Border luar emas matang agar terlihat di background putih.
- Glow/ring krem emas muda agar tetap hidup di background ungu.
- Icon QR memakai emas muda loading-splash yang lebih terbaca.

Tes teknis:

```bash
node --check /tmp/tokohana_app_script_check.js
```

Hasil: OK.

---

## Update kecil — Border Gradasi Tombol QRIS Tengah Navbar

User bertanya apakah border tombol QRIS tengah bisa dibuat gradasi, atau jika tidak coba orange.

Implementasi berhasil memakai teknik:

```txt
background inner padding-box + gradient border-box
border-transparent
```

Gradasi border:

```txt
#FFE8A8 → #FFD784 → #B8860B → #F97316
```

Jadi ada sentuhan orange hangat, tapi bukan orange polos.

Tujuan:

```txt
lebih terlihat di halaman putih,
tetap hidup di navbar ungu,
dan tidak terlalu nyengat.
```

Tes teknis:

```bash
node --check /tmp/tokohana_app_script_check.js
```

Hasil: OK.

---

## Update kecil — Border Tombol QRIS Gradasi Emas 3D

User mengoreksi arah warna:

```txt
Bukan orange.
Maksudnya gradasi emas matang + emas muda agar terlihat seperti emas 3D.
```

Implementasi:

```txt
#B8860B → #FFE8A8 → #FFD784 → #D4AF37 → #B8860B
```

Orange `#F97316` dihapus dari gradasi.

Tujuan:

```txt
lebih premium,
lebih emas,
tetap terlihat di putih dan ungu,
tidak terasa panas/orange.
```

Tes teknis:

```bash
node --check /tmp/tokohana_app_script_check.js
```

Hasil: OK.

---

## Update kecil — Ring Tipis Tombol QRIS Jadi Bayangan

User meminta lingkar tipis di atas bulatan tombol QRIS dibuat lebih tua sedikit agar terasa seperti bayangan tombol.

Implementasi:

```txt
ring luar: rgba(255,232,168,0.62) → rgba(111,80,20,0.42)
```

Ditambah rasa 3D dengan inset:

```txt
inset 0 1px 0 rgba(255,232,168,0.42)
inset 0 -2px 4px rgba(45,18,66,0.28)
```

Tujuan:

```txt
lebih senada dengan icon kategori “Semua”,
lebih terasa seperti bayangan tombol,
dan tidak terlalu krem terang.
```

Tes teknis:

```bash
node --check /tmp/tokohana_app_script_check.js
```

Hasil: OK.

---

## Update kecil — Bayangan Tombol QRIS Tidak Simetris

User meminta lingkar luar tombol QRIS tidak terlihat seperti lingkaran simetris, tapi lebih seperti bayangan tombol.

Implementasi:

- Ring luar simetris dihapus:

```txt
0 0 0 2px rgba(...)
```

- Diganti kombinasi shadow yang jatuh ke bawah:

```txt
0 7px 14px rgba(45,18,66,0.26)
0 4px 10px rgba(184,134,11,0.30)
0 2px 0 rgba(111,80,20,0.46)
inset 0 1px 0 rgba(255,232,168,0.44)
inset 0 -2px 4px rgba(45,18,66,0.30)
```

Tujuan:

```txt
lebih terasa seperti bayangan tipis tombol,
lebih 3D,
tidak sekadar lingkaran rata mengikuti bentuk tombol.
```

Tes teknis:

```bash
node --check /tmp/tokohana_app_script_check.js
```

Hasil: OK.

---

## Update kecil — Kotak Search Border Gradasi Emas 3D

User ingin mencoba kotak search dengan gradasi emas matang + emas muda.

Implementasi:

- Isi input tidak dibuat full emas agar tetap nyaman dibaca.
- Border search memakai teknik gradient border:

```txt
background inner padding-box + gradient border-box
border-transparent
```

Gradasi:

```txt
#B8860B → #FFE8A8 → #FFD784 → #D4AF37 → #B8860B
```

Mode terang:

```txt
inner: putih/cream transparan
```

Mode malam:

```txt
inner: ungu gelap transparan
```

CSS dark mode khusus `hana-header-search` diperbarui agar tidak lagi memaksa outline kuning terang lama.

`tools/make_cq_compiled.py` juga dipatch supaya build ulang aman.

Tes teknis:

```bash
node --check /tmp/tokohana_app_script_check.js
```

Hasil: OK.

---

## Update kecil — Search Box Melayang dan Focus Jadi Lampu

User mengarahkan:

```txt
Efek aktif boleh warna menyala agar jadi lampu.
Search box juga cocok pakai bayangan tipis seperti tombol QRIS agar terasa melayang.
```

Implementasi:

### State normal

Search box memakai:

```txt
border gradasi emas 3D
shadow turun tipis
inset highlight halus
```

Tujuan:

```txt
kotak search terasa sedikit melayang, bukan flat.
```

### State focus / aktif

Saat search aktif/focus, gradasi dibuat lebih menyala dengan highlight:

```txt
#FFD700
```

di tengah gradasi, plus glow:

```txt
0 0 18px/20px rgba(255,215,0,...)
```

Tujuan:

```txt
search aktif terasa seperti lampu warung.
```

### Mode malam

CSS dark mode `input.hana-header-search` ikut diselaraskan:

- normal tetap gradasi emas 3D,
- focus tetap menyala hangat,
- tidak kembali ke outline kuning polos lama.

`tools/make_cq_compiled.py` juga diperbarui agar build ulang aman.

Tes teknis:

```bash
node --check /tmp/tokohana_app_script_check.js
```

Hasil: OK.
