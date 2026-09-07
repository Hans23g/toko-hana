# Toko Hana Workspace — Catatan CTO

Project aktif sekarang ada di:

`/home/user/toko-hana/`

## Root project
- `index.html` = app Toko Hana luar Pi Browser / PWA umum.
- `App.jsx` = source React aktif yang sudah memakai branding terbaru.
- `manifest.json` = manifest eksternal pendukung.
- `README_CTO_WORKSPACE.md` = catatan struktur workspace.

## Folder aktif
- `assets/logo/logo_hana_footer_badge_512.png` = logo utama untuk kartu, Jelajah, footer, dan fallback gambar.
- `assets/pwa/icon_install_64.png` = favicon browser/tab cart transparan
- `assets/pwa/icon_install_180.png` = Apple/PWA install icon cart transparan
- `assets/pwa/icon_install_192.png` = PWA install icon cart transparan
- `assets/pwa/icon_install_512.png` = PWA install icon cart transparan
- `assets/pwa/icon_pwa_cart_transparent_source.png` = source icon install PWA cart transparan
- `assets/category/icon_category_cart_transparent_512.png` = icon kategori “Semua” cart transparan.
- `tools/make_cq_compiled.py` = generator build yang sudah dipatch agar tidak balik ke icon/logo lama.

## Archive
- `_archive/backups/` = backup sebelum patch.
- `_archive/unused_icons_and_trials/` = icon lama/percobaan.
- `_archive/previews/` = preview gambar pembanding.
- `_archive/source_duplicates/` = salinan source upload duplikat.
- `_archive/pi_browser_testnet_prototype/` = prototype Pi Browser Testnet untuk nanti.

## Prinsip aman
- App luar Pi Browser: QRIS/Tunai/COD/Rupiah sebagai pembayaran resmi.
- Pi di app luar: “Tukar Koin Pi untuk Potongan”, final tetap Rupiah.
- App Pi Browser resmi/testnet nanti dibuat terpisah dari prototype.

## Update terbaru — Mitra Kurir Lite
- Menu `Admin → Pengiriman` sekarang bisa pilih `Mitra Kurir Aktif` dari data `partners` tipe `courier` berstatus `active`.
- Saat mitra dipilih, tampil ringkasan nama, WA, area, dan catatan.
- Ada tombol `Kirim WA Kurir` untuk mengirim instruksi order ke mitra kurir.
- Form pengiriman punya field `Fee kurir (opsional)`.
- Saat `Catat Pengiriman`, order menyimpan nama kurir, resi/catatan, fee kurir, dan payment note tambahan.
- Status order masih mengikuti alur lama dulu agar aman; status `Dikirim` dan halaman khusus kurir bisa dibuat di fase berikutnya.

## Update terbaru — Mitra Kurir Lite Fase 2
- `Catat Pengiriman` sekarang mengubah status order menjadi `Dikirim`, bukan langsung `Selesai`.
- Menu `Admin → Pengiriman` punya panel `Sedang Dikirim` untuk order status `Dikirim`.
- Order `Dikirim` punya tombol `Tandai Selesai`.
- Badge/status pelanggan dan admin sudah mengenal `Dikirim`.
- Tombol `Kirim` di daftar order admin sekarang membawa data order ke form pengiriman.

## Update terbaru — Alur Rasa Pengiriman
- Status pengiriman sekarang: `Diproses → Dikirim → Kurir Tiba → Selesai`.
- Admin bisa klik `Kurir Tiba` saat kurir sudah sampai di alamat.
- Pelanggan bisa klik `Barang Diterima` dari Riwayat Belanja saat status `Kurir Tiba`.
- Admin tetap bisa klik `Konfirmasi Diterima` sebagai fallback kalau pelanggan belum sempat konfirmasi.
- Pesan status pelanggan sudah diberi rasa Toko Hana dari order diterima, diproses, dikirim, kurir tiba, sampai selesai.
- Tombol struk tersedia di daftar order admin, panel sedang dikirim, dan catatan selesai.

## Update terbaru — DB Kurir Aktif
Berdasarkan cek skema Supabase, tabel `orders` sudah punya kolom kurir lengkap. App sekarang menulis:
- `courier_partner_id`
- `courier_name`
- `courier_phone`
- `courier_status`
- `assigned_courier_at`
- `picked_up_at`
- `delivered_at`
- `customer_confirmed_at`
- `delivery_proof_note`

Mapping status:
- `Catat Pengiriman` → `status = Dikirim`, `courier_status = dikirim`, waktu assign/pickup terisi.
- `Kurir Tiba` → `status = Kurir Tiba`, `courier_status = tiba`, `delivered_at` terisi.
- `Barang Diterima` pelanggan → `status = Selesai`, `courier_status = diterima_pelanggan`, `customer_confirmed_at` terisi.
- `Konfirmasi Diterima` admin → `status = Selesai`, `courier_status = diterima_admin`, `customer_confirmed_at` terisi.

## Update terbaru — Fee Kurir di Keuangan
- Menu `Admin → Keuangan` sekarang menghitung `courier_fee` dari order status `Dikirim`, `Kurir Tiba`, dan `Selesai`.
- Ada kartu `Fee Kurir` untuk fee hari ini, bulan ini, dan fee order yang belum selesai.
- Kartu `Kas bersih hari ini` diganti menjadi `Bersih setelah fee kurir`.
- Nilainya: kas nyata hari ini dikurangi fee kurir hari ini.

## Update terbaru — HanaPoin Kurir Lite
- Form `Admin → Pengiriman` punya field `Bonus HanaPoin Kurir` dengan pilihan cepat `0 / +100 / +250 / +500`.
- Bonus poin kurir bukan uang tunai; ini voucher/poin loyalti yang bisa dipakai kurir belanja seperti member lain.
- Bonus HanaPoin diberikan saat order benar-benar `Selesai` / barang diterima.
- Kurir dicari sebagai member di `customers` via nomor WA/nama. Jika belum ada, app membuat member kurir otomatis dengan poin awal bonus.
- Bonus poin dicatat di `payment_note` / `delivery_proof_note` sebagai `Bonus HanaPoin Kurir +...`.
- Laporan `Admin → Keuangan` punya kartu `Bonus Poin Kurir` dan estimasi nilai voucher berdasarkan 500 poin = Rp 5.000.

## Dokumen Ruh / Visi Produk
- `docs/NAWA_CITA_TOKO_HANA.md` = dokumen ruh, arah, gaya, dan nilai Toko Hana.
- Setiap meja baru wajib baca dokumen ini bersama checkpoint teknis agar pembangunan tidak hanya melanjutkan kode, tetapi juga menjaga rasa warung.

## Update terbaru — Pemulihan Alur Kasir Offline
- Alur kasir offline diprioritaskan sebelum Garansi Barang Sesuai.
- HanaPoin member offline tidak lagi diberikan saat order baru dicatat; poin diberikan saat kasir menutup pembayaran lunas.
- Saat `Bayar & Lunas`, sistem menambahkan catatan `HanaPoin diberikan +...` dan update poin member.
- Saat `Bayar Sebagian`, sisa otomatis masuk Catatan Piutang dan `Order terakhir selesai` sekarang muncul agar kasir bisa cetak struk.
- Catatan piutang menandai bahwa HanaPoin belum diberikan penuh sampai pelunasan.
- Kembalian tetap dicatat di payment_note saat pembayaran tunai lebih besar dari total.

## Update terbaru — Struk Pelunasan Piutang
- Saat pelanggan melunasi catatan piutang (`customer_debts`) sampai status `paid`, app membuat `cashierLastClosedOrder` khusus struk pelunasan.
- Struk pelunasan memakai ID `PIUTANG-{debt.id}`.
- Struk menampilkan baris `Status: LUNAS`.
- Catatan struk memuat: piutang awal, nominal pelunasan, uang diterima, dan kembalian jika ada.
- Jika piutang masih `partial`, struk pelunasan tidak dibuat.
- Semua struk sekarang punya baris `Status` agar jelas apakah `LUNAS`, `Selesai`, dll.

## Update terbaru — Catatan Struk + Share WhatsApp
- Saat kasir/admin mencetak struk, app meminta `Catatan struk opsional`.
- Catatan ini bisa dipakai untuk token listrik, nomor voucher, catatan paket, catatan retur, dll.
- Catatan struk tampil di area catatan struk dan ikut terkirim dalam teks WhatsApp.
- Halaman struk punya tombol `Kirim WA Pelanggan` jika nomor WA pelanggan tersedia.
- Jika nomor WA tidak tersedia, tombol menunjukkan `WA belum ada`.

## Update terbaru — WA Struk untuk Pelanggan Tanpa Nomor
- Tombol `Kirim WA Pelanggan` di halaman struk sekarang tetap aktif walau order tidak punya nomor WA.
- Jika nomor WA kosong, tombol akan meminta kasir memasukkan nomor WA pelanggan.
- Nomor `08...` otomatis dinormalisasi menjadi `62...` sebelum membuka WhatsApp.
- Teks struk dikirim via WhatsApp dalam format ringkas.

## Update terbaru — Kasir Offline Umum + Opsi WA Struk
- Form checkout kasir/admin tanpa member offline tidak lagi otomatis memakai nama/WA/alamat kasir sebagai pelanggan.
- Placeholder kasir menjadi: nama pelanggan opsional, WA pelanggan opsional untuk kirim struk, catatan/alamat opsional.
- Tombol `Kirim WA Pelanggan` di halaman struk sekarang selalu memberi pilihan jika nomor terdaftar ada:
  - OK = pakai nomor terdaftar
  - Batal = masukkan nomor WA baru
- Jika order tidak punya nomor WA, tombol langsung meminta input nomor WA pelanggan.
- Ini mencegah struk pelanggan umum terkirim ke nomor kasir.

## Update terbaru — Identitas Kasir, HanaPoin Member, WA Struk
- Checkout kasir/admin tanpa member tetap tidak memakai nama/WA kasir sebagai pelanggan.
- Identitas kasir/admin sekarang dicatat di `payment_note` sebagai `Dilayani oleh Kasir/Admin: ...`.
- HanaPoin saat `Bayar & Lunas` hanya diberikan jika order punya catatan `Member Offline HANA-{id}`.
- Pelanggan umum/tidak terdaftar tidak mendapat HanaPoin otomatis.
- Tombol `Kirim WA Pelanggan` di struk diganti memakai fungsi `sendReceiptWA()` di halaman struk agar lebih stabil.
- Jika nomor terdaftar ada, kasir bisa pilih pakai nomor itu atau masukkan nomor baru.
- Jika nomor tidak ada, kasir langsung diminta memasukkan nomor WA pelanggan.

## Update terbaru — Perbaikan Tombol WA Struk
- Tombol `Kirim WA Pelanggan` di struk tidak lagi bergantung pada fungsi `<script>` di halaman struk.
- Sekarang tombol memakai `onclick` langsung dengan teks struk yang sudah di-encode.
- Jika ada nomor terdaftar, kasir bisa pilih OK untuk nomor itu atau Batal untuk input nomor baru.
- Jika tidak ada nomor, kasir langsung diminta memasukkan nomor WA pelanggan.

## Update terbaru — WA Struk Tanpa JavaScript
- Tombol `Kirim WA Pelanggan` di struk diganti menjadi form langsung ke `https://api.whatsapp.com/send`.
- Halaman struk sekarang menampilkan input nomor WA pelanggan (`WA pelanggan: 628...`) yang bisa diedit/diisi kasir.
- Ini tidak bergantung pada `onclick` JavaScript, sehingga lebih stabil jika browser/popup memblokir script.
- Catatan: agar paling aman, isi nomor format internasional `628...`.

## Update terbaru — Unduh Struk Lebih Stabil
- Tombol `Unduh Gambar Struk` diganti menjadi `Unduh Struk`.
- Mekanisme unduh sekarang memakai Blob + object URL agar lebih stabil daripada link `data:` biasa.
- Jika download tetap diblokir browser, fallback membuka SVG struk di tab baru.

## Update terbaru — Histori Order Kasir
- Tab `Orders` untuk kasir sekarang punya panel `Histori Order Kasir`.
- Menampilkan 20 order terbaru dari daftar `orders`.
- Setiap baris histori menampilkan order, pelanggan, status, metode, total, dan tombol `Struk`.
- Tujuannya agar kasir bisa cetak ulang struk tanpa mengulang transaksi/order, terutama saat testing atau ketika pelanggan minta bukti ulang.

## Update terbaru — Catatan Struk Tersimpan + Unduh Struk Dihapus
- Tombol `Unduh Struk` di halaman struk dihapus karena `Cetak / Simpan PDF` sudah cukup dan lebih stabil.
- Catatan struk opsional dari kasir sekarang disimpan ke `payment_note` order sebagai `Catatan kasir: ...`.
- Saat cetak ulang dari Histori Order Kasir, catatan kasir tetap muncul.
- Untuk struk pelunasan piutang sintetis (`PIUTANG-{id}`), catatan tampil di struk saat dicetak; tidak dipaksa update ke tabel orders.

## Update terbaru — Kop Struk / Alamat Struk Custom
- Struk tidak lagi hardcode `Warungnya Rakyat • Bogor`.
- Struk memakai `receiptHeaderAddress || warungAddress || Bogor, Indonesia`.
- Admin bisa mengatur `Alamat/Kop Struk (opsional)` di menu `Branding → Alamat Warung`.
- Jika kop struk kosong, otomatis mengikuti `Alamat Warung Fisik`.
- Setting disimpan ke localStorage `toko_hana_receipt_header_address` dan Supabase `settings.receipt_header_address`.

## Update terbaru — Cetak Ulang Struk Tanpa Prompt Catatan
- `handlePrintReceipt(order, options)` sekarang menerima `promptNote:false`.
- Tombol Struk di Histori Order Kasir, Daftar Order Admin, Sedang Dikirim, dan Catatan Selesai memakai `promptNote:false` agar tidak menanyakan catatan kasir ulang.
- Tombol Cetak pada panel `Order terakhir selesai` masih boleh menanyakan catatan kasir jika catatan belum pernah tersimpan.
- Jika catatan kasir sudah tersimpan di `payment_note`, tombol Cetak tidak akan menanyakan lagi.
- Penyimpanan catatan struk diperkuat menggunakan update state order + DB update `orders.payment_note`.

## Update terbaru — Tab Order Online di Halaman Order Kasir
- Halaman `Orders` untuk kasir sekarang punya tab:
  - `Offline Kasir`
  - `Order Online`
- Tab tetap muncul walau belum ada order online, jadi kasir bisa memahami pemisahan alur.
- `Offline Kasir` menampilkan order channel/metode offline/toko/ambil.
- `Order Online` menampilkan order dari luar meja kasir.
- Panel `Order terakhir selesai` kembali boleh menanyakan catatan struk ulang selama belum ditutup, agar kasir bisa memperbaiki catatan token/nomor voucher.
- `Histori Order Kasir` tetap cetak ulang tanpa prompt catatan, karena catatan dianggap final setelah masuk histori.

## Update terbaru — Order Online di Kasir
- Tab `Order Online` di halaman Order Kasir sekarang punya aksi `Input Resi` untuk order online berstatus `Diproses`.
- Tombol `Input Resi` memakai alur cepat kasir: pilih/tulis kurir lalu isi resi/catatan antar.
- Setelah input resi, order menjadi `Dikirim` dan kolom kurir DB ikut diisi: `courier`, `courier_name`, `courier_status`, `assigned_courier_at`, `picked_up_at`, `delivery_proof_note`, `resi`.
- Tombol `Pengiriman` dan `Kirim` di daftar order admin sekarang memindahkan admin ke `AdminPage → Pengiriman` agar form pilih kurir/resi terlihat.

## Update terbaru — Bahasa Order Online / Paket
- Untuk order online, bahasa UI disesuaikan menjadi bahasa paket.
- Status internal `Dikirim` tetap dipakai di DB, tetapi ditampilkan sebagai `Sedang Dikirim`.
- Status internal `Kurir Tiba` tetap dipakai di DB, tetapi ditampilkan sebagai `Paket Sampai`.
- Tombol pelanggan `Barang Diterima` diganti menjadi `Paket Diterima`.
- Tombol kasir online `Input Resi` diganti menjadi `Pilih Kurir/Resi`.
- Form pengiriman memakai copy: `Pilih kurir/ekspedisi`, `Nomor resi / catatan paket`, dan tombol `Catat Paket Dikirim`.
- Prompt kasir input resi juga memakai bahasa kurir/ekspedisi dan paket.

## Update terbaru — Form Pilih Kurir/Resi Inline untuk Kasir Online
- Di tab `Order Online`, tombol `Pilih Kurir/Resi` tidak lagi langsung membuka prompt cepat.
- Tombol tersebut sekarang membuka form inline di halaman Order Kasir.
- Form inline menampilkan pilihan kurir/ekspedisi:
  - J&T Express
  - JNE Reguler
  - SiCepat Reguler
  - GoSend / GrabExpress
  - Mitra Kurir Aktif
  - Kurir Toko Hana
  - Kurir Warga
  - Ambil di Toko
- Jika pilih `Mitra Kurir Aktif`, muncul dropdown mitra kurir aktif dari `partners`.
- Kasir mengisi `Nomor resi / catatan paket`, lalu klik `Catat Paket Dikirim`.
- Setelah itu status internal menjadi `Dikirim`, dan UI menampilkan `Sedang Dikirim`.

## Update terbaru — Order Online Tidak Pakai Tombol Lunas di Tahap Awal
- Di tab `Order Online`, order yang belum `Diproses` sekarang menampilkan tombol `Proses`, bukan `Lunas`.
- Tombol `Proses` mengubah status ke `Diproses` dan mencatat bahwa pembayaran dicek sesuai metode/COD sebelum pengiriman.
- Setelah status `Diproses`, tombol berubah menjadi `Pilih Kurir/Resi` dan membuka form pilihan kurir/ekspedisi inline.
- Tombol `Lunas`, `Sebagian`, dan `Potongan` tetap untuk alur `Offline Kasir`.

## Update terbaru — Tombol Bayar Offline + Histori Online
- Di tab `Offline Kasir`, tombol aksi pembayaran utama diganti dari `Lunas` menjadi `Bayar`.
- `Lunas` diperlakukan sebagai status/hasil, bukan label aksi awal.
- Panel histori bawah di halaman Order Kasir sekarang dinamis:
  - Tab `Offline Kasir` → `Histori Order Kasir`, fokus cetak ulang struk.
  - Tab `Order Online` → `Histori Order Online`, fokus pantau paket.
- Histori Order Online menampilkan status `Sedang Dikirim`, `Paket Sampai`, `Diterima/Selesai`.
- Di histori online, order `Dikirim` punya aksi `Paket Sampai`; order `Kurir Tiba` punya aksi `Konfirmasi`.

## Update terbaru — Konfirmasi Pembayaran Member untuk Order Online
- Di Riwayat Belanja member, order status `Belum Bayar` / `Siap Bayar` punya panel `Konfirmasi Pembayaran`.
- Tombol `Kirim Bukti / Konfirmasi via WA` membuka WhatsApp kasir/admin (`merchantWaNumber`).
- Pesan WA berisi order ID, nama, WA, metode pembayaran, total, dan instruksi lampirkan bukti pembayaran QRIS jika metode QRIS.
- Ini dipakai sebelum kasir menekan `Proses` di tab Order Online.

## Checkpoint Terbaru
- `CHECKPOINT_2026-07-30_KASIR_OFFLINE_ORDER_ONLINE_KURIR_READY.md` mencatat pemulihan alur kasir offline, order online, struk, kurir, HanaPoin kurir, dan keuangan.

## Update terbaru — Checklist Jasa Pengiriman Aktif
- Menu `Admin → Kategori` sekarang punya panel `Jasa Pengiriman Aktif`.
- Admin bisa centang/nonaktifkan jasa pengiriman umum:
  - J&T Express
  - JNE Reguler
  - SiCepat Reguler
  - GoSend / GrabExpress
  - Kurir Toko Hana
  - Kurir Warga
  - Ambil di Toko
- Checklist ini disimpan ke localStorage `toko_hana_shipping_services` dan Supabase settings `shipping_services`.
- Form pilih kurir/resi di kasir online dan menu pengiriman admin membaca daftar aktif ini.
- `Mitra Kurir Aktif` tetap menjadi opsi khusus terpisah yang membaca `partners.type=courier` dan `status=active`.

## Update terbaru — Jasa Pengiriman Bisa Edit & Tambah
- Panel `Admin → Kategori → Jasa Pengiriman Aktif` sekarang bukan hanya checklist aktif/nonaktif.
- Admin bisa edit langsung nama jasa pengiriman bawaan, misalnya `JNE Reguler` diganti menjadi `Lion Parcel`.
- Admin bisa tambah jasa pengiriman custom lewat kolom `Tambah jasa lain`, misalnya `Ninja Xpress`, `AnterAja`, `Paxel`, dll.
- Jasa tambahan/custom punya tombol `Hapus`; jasa bawaan cukup diedit/nonaktifkan agar aman dan bisa dipulihkan dengan `Reset`.
- Penyimpanan tetap memakai `localStorage: toko_hana_shipping_services` dan Supabase settings `shipping_services`.
- Tidak ada perubahan DB/migration.
- Form `Pilih Kurir/Resi` di kasir online dan `Admin → Pengiriman` otomatis membaca daftar jasa yang aktif dan sudah diedit/ditambah.
- Catatan detail ada di `docs/UPDATE_2026-07-30_JASA_PENGIRIMAN_EDIT_TAMBAH.md`.

## Update terbaru — Posisi Dropdown Jasa Pengiriman
- Panel `Jasa Pengiriman Aktif` dipindah dari atas `Daftar Rak Kategori` ke posisi bawah setelah daftar rak.
- Bentuknya sekarang menjadi dropdown/collapsible: saat tertutup hanya tampil ringkasan jumlah jasa aktif dan tombol `Atur`.
- Isi edit/tambah/nonaktif jasa pengiriman baru muncul setelah dropdown dibuka.
- Tujuannya agar menu `Kategori` tetap fokus: tambah rak → lihat/susun daftar rak → baru atur jasa pengiriman jika diperlukan.

## Update terbaru — Daftar Rak Kategori Jadi Dropdown
- Panel `Daftar Rak Kategori` di `Admin → Kategori` sekarang dibuat dropdown/collapsible.
- Saat tertutup hanya tampil jumlah rak dan tombol `Atur`.
- Saat dibuka, admin tetap bisa ubah urutan, edit, dan hapus kategori seperti sebelumnya.
- Urutan panel Kategori sekarang lebih hemat ruang:
  1. `Tambah/Ubah Rak Barang`
  2. dropdown `Daftar Rak Kategori`
  3. dropdown `Jasa Pengiriman Aktif`
- Tujuan UI ini untuk menyiapkan ruang bagi panel berikutnya: `Kategori Mitra`, yaitu daftar mitra beserta statusnya; jika tipe mitra adalah kurir, akan tampil sebagai mitra kurir.

## Update terbaru — Pelanggan Punya Submenu Pelanggan / Mitra
- Arah `Kategori Mitra` dibatalkan dari menu `Kategori` karena mitra bukan rak barang.
- Menu `Admin → Pelanggan` sekarang punya submenu seperti Branding:
  - `Pelanggan`
  - `Mitra`
- Tab `Pelanggan` tetap memuat CRM/Sahabat Warung seperti sebelumnya.
- Tab `Mitra` memuat halaman `Kemitraan Warung` untuk menyusun relasi mitra:
  - total mitra,
  - jumlah mitra kurir,
  - mitra aktif,
  - mitra yang perlu dicek,
  - tambah/edit data mitra,
  - status `Aktif / Nonaktif / Pending / Suspend / Blokir`,
  - daftar mitra dengan badge tipe dan status.
- Jika tipe mitra `courier` dan status `active`, mitra tersebut tetap menjadi sumber `Mitra Kurir Aktif` di form pengiriman.
- Tidak ada perubahan DB; memakai tabel `partners` yang sudah ada.

## Update terbaru — Judul Menu Kategori Disesuaikan
- Judul halaman admin untuk menu `Kategori` diganti dari `Rak Warung` menjadi `Kategori Produk dan Jasa Pengiriman`.
- Subjudul kecilnya disesuaikan menjadi `Penata Kategori`.
- Deskripsi halaman sekarang menjelaskan bahwa menu ini mengatur kategori produk dan jasa pengiriman agar operasional warung rapi.

## Update terbaru — Alur Pelanggan Menjadi Mitra
- Pengajuan mitra sekarang diarahkan setelah user daftar/login sebagai `Pelanggan`.
- Di form `Jelajah → Mitra`, jika belum login sebagai pelanggan, tombol kirim berubah menjadi `Daftar/Login Member Dulu`.
- Jika sudah login sebagai pelanggan, form menampilkan info akun member yang dipakai untuk pengajuan.
- Nomor WA pada pengajuan mengikuti akun member agar relasi mitra dan HanaPoin bisa ditautkan ke pelanggan yang benar.
- Pengajuan masuk ke `partner_applications` dengan catatan member dan kebijakan poin.
- Admin membuka `Admin → Pelanggan → Mitra → Pengajuan Mitra Masuk`, lalu bisa klik:
  - `Jadikan Kurir` untuk pengajuan tipe courier,
  - `Jadikan Mitra` untuk tipe lain.
- Saat disetujui, data masuk/terbarui di tabel `partners` dengan status `active`.
- Hanya `partners.type = courier` dan `partners.status = active` yang menjadi `Mitra Kurir Aktif` di pengiriman.
- Bonus HanaPoin kurir hanya aktif untuk `Mitra Kurir Aktif`; ekspedisi luar/JNE/J&T/dll tidak mendapat poin.
- Tidak ada perubahan DB/migration; relasi member sementara ditautkan lewat WA/nama dan catatan internal.

## Update terbaru — Mitra Kurir Pickup Lite
- Halaman order sekarang mulai menyesuaikan peran.
- Jika akun pelanggan cocok dengan `partners.type = courier` dan `partners.status = active`, akun tersebut dikenali sebagai `Mitra Kurir Aktif` secara lite.
- Pencocokan tahap ini lewat WA/nama, belum role auth khusus.
- Untuk Mitra Kurir Aktif, header halaman order berubah menjadi `Ruang Order Mitra Kurir` dan `Pickup & Riwayat Pesanan`.
- Di paling atas halaman order muncul panel `Form Pickup Mitra Kurir / Meja Pickup Paket`.
- Panel pickup berisi mini kartu mitra kurir, catatan pickup opsional, dan paket yang ditugaskan ke kurir tersebut.
- Tombol operasional kurir:
  - `Konfirmasi Pickup` → update `courier_status = pickup`, `picked_up_at`, dan catatan.
  - `Paket Sampai` → memakai alur lama `Kurir Tiba`.
  - `WA` → hubungi pelanggan.
- Riwayat belanja pribadi tetap tampil di bawah panel pickup.
- Kartu profil member otomatis memakai rasa `Kartu Mitra Kurir Toko Hana` jika akun tersebut adalah Mitra Kurir Aktif.
- Bonus HanaPoin tetap hanya untuk Mitra Kurir Aktif, masuk saat paket selesai/diterima; ekspedisi luar tidak mendapat poin.
- Tidak ada perubahan DB/migration.
- Catatan detail ada di `docs/UPDATE_2026-07-30_MITRA_KURIR_PICKUP_LITE.md`.

## Fix terbaru — RLS Partner Applications Insert
- Error yang muncul: `new row violates row-level security policy for table "partner_applications"` saat kirim form mitra.
- Penyebab app: `insertPartnerApplication()` memakai `.insert(...).select()`.
- RLS tabel `partner_applications` memang seharusnya mengizinkan public/user INSERT tetapi tidak mengizinkan public SELECT agar data pendaftar mitra tidak terbaca umum.
- Fix app: public submission sekarang hanya `insert([application])` tanpa `.select()`.
- Admin tetap membaca pengajuan lewat policy admin di menu `Admin → Pelanggan → Mitra` / pendaftaran mitra.
- Jika error masih muncul setelah deploy patch ini, berarti policy INSERT di Supabase perlu dicek ulang: harus ada policy INSERT `with check (true)` untuk anon/authenticated/public.

## Fix terbaru — Sinkron Status Member Menjadi Mitra Kurir
- Kasus: member `HANA-5` / email tertentu sudah mengajukan Mitra Kurir dan status pengajuan di-approve admin, tetapi halaman member belum berubah menjadi Mitra Kurir.
- Penyebab: status `partner_applications.approved` hanya status berkas pengajuan; halaman member membaca `partners.type = courier` dan `partners.status = active`.
- Pencocokan sebelumnya hanya WA/nama sehingga bisa gagal jika data tidak identik.
- Fix:
  - Deteksi `currentCourierPartner` sekarang juga membaca token `HANA-{id}` dan email member dari `partners.notes`.
  - Pengajuan mitra baru menyimpan email member ke notes.
  - Jika admin mengubah pengajuan menjadi `approved`, app mencoba otomatis membuat/update row `partners` aktif.
  - Tombol pengajuan yang sudah `approved` tetapi belum menjadi partner tetap menampilkan aksi `Sinkronkan Kurir` / `Sinkronkan Mitra`.
  - Halaman member me-refresh data partners saat membuka `Profil` atau `Cart/Order`, supaya perubahan admin lebih cepat terbaca.
- Untuk data lama yang sudah approved tapi belum berubah, admin perlu buka `Admin → Pelanggan → Mitra → Pengajuan Mitra Masuk` lalu klik `Sinkronkan Kurir` pada pengajuan tersebut, atau ubah status dari approved ke contacted lalu approved lagi.

## Fix terbaru — Paket Ditugaskan Belum Muncul di Form Pickup Kurir
- Kasus: admin/kasir memilih `Mitra Kurir Aktif` dan menugaskan kurir, tetapi paket belum muncul di Form Pickup akun kurir.
- Penyebab utama: saat app mengambil ulang order dari Supabase, mapping order belum membawa kolom kurir lengkap (`courier_partner_id`, `courier_name`, `courier_phone`, `courier_status`, `picked_up_at`, `delivery_proof_note`, `courier_fee`, dll).
- Fix:
  - Mapping `fetchOrders` sekarang membawa kolom kurir lengkap.
  - Form pickup mencocokkan order lewat `courier_partner_id`, `courier_phone`, `courier_name`, `courier`, atau `kurir`.
  - Akun member/kurir me-refresh daftar order saat membuka `Cart/Order` atau `Profil`.
  - Jika sudah terdeteksi sebagai Mitra Kurir Aktif, app polling ringan order tiap ±15 detik saat berada di halaman tersebut.
  - Penugasan `Mitra Kurir` sekarang diberi guard: admin/kasir wajib memilih nama mitra kurir aktif, bukan hanya label umum.
- Jika paket lama belum muncul, buka ulang/refresh akun kurir lalu buka menu Order. Pastikan order status sudah `Dikirim` dan `courier_partner_id`/nama kurir tercatat.

## Fix terbaru — Pickup Kurir Mental Balik ke Perlu Pickup
- Kasus: Kurir klik `Konfirmasi Pickup`, status sempat berubah menjadi pickup, lalu setelah refresh/polling kembali menjadi `Perlu Pickup` dan tombol muncul lagi.
- Penyebab: akun Mitra Kurir saat ini masih role member/customer, sementara RLS `orders` hanya mengizinkan update oleh admin/kasir. Update lokal berhasil, tapi update DB ditolak; polling lalu menarik status lama dari DB.
- Fix lite:
  - Update pickup/paket sampai sekarang disimpan juga ke localStorage `toko_hana_courier_local_order_patches`.
  - Saat app refresh order dari DB, patch lokal kurir digabung kembali agar UI tidak mental balik.
  - Jika DB menolak update, toast menjelaskan bahwa pickup tercatat di HP kurir dan admin tetap bisa sinkronkan.
- Catatan penting: ini menjaga UX di perangkat kurir, tetapi sinkron permanen lintas perangkat tetap butuh policy/RPC khusus kurir di DB.
- Bukan karena order dibuat oleh akun yang sama; pickup paket sendiri saat testing memang bisa terlihat lucu, tapi bukan penyebab teknis tombol balik.

## Update terbaru — Tarif Zona Antar & Kurir Warga
- Menu `Admin → Kategori` sekarang punya dropdown baru `Tarif Zona Antar`.
- Tujuannya mengatur zona ongkir secara fleksibel dari patokan alamat warung fisik, jalan, gang, RT/RW, dan kata kunci alamat.
- Zona default baru:
  - `Ambil di Toko`
  - `Tetangga Warung / RT-RW Dekat`
  - `Dekat`
  - `Sedang`
  - `Jauh`
  - `Tanya Admin`
- Zona `Tetangga Warung / RT-RW Dekat` default ongkir pelanggan Rp 2.000 dan fee kurir Rp 2.000 dengan rekomendasi `Kurir Warga`.
- Admin bisa edit per zona:
  - aktif/nonaktif,
  - nama zona,
  - ongkir pelanggan,
  - fee kurir,
  - minimal belanja gratis ongkir,
  - rekomendasi kurir,
  - catatan,
  - kata kunci alamat.
- Admin bisa tambah zona custom.
- Deteksi zona membaca kata kunci alamat dan RT/RW alamat warung vs alamat pelanggan.
- Saat checkout, order menyimpan catatan rekomendasi kurir, misalnya `Rekomendasi kurir: Kurir Warga`.
- Pesan WA order juga menampilkan zona antar dan rekomendasi kurir.
- Saat admin/kasir klik `Pilih Kurir/Resi`, pilihan kurir otomatis diarahkan dari rekomendasi zona jika ada, misalnya `Kurir Warga`.
- Penyimpanan:
  - localStorage `toko_hana_delivery_zones`
  - Supabase settings `delivery_zones`
- Tidak ada perubahan DB/migration.
- Catatan etis: Kurir Warga untuk warga sekitar/remaja-dewasa yang mampu, jarak dekat, paket ringan, aman, tidak memaksa, dan jika masih di bawah umur harus seizin orang tua/wali. Bukan eksploitasi anak.
- Detail ada di `docs/UPDATE_2026-07-30_TARIF_ZONA_KURIR_WARGA.md`.

## Catatan arah — Kurir Warga Fleksibel Berbasis Kepercayaan
- Kurir Warga tidak harus terdaftar sebagai member dan tidak harus punya HP.
- Kurir Warga bisa warga sekitar yang dipercaya kasir/admin, dikenal baik, paham jalan sekitar, dan layak membantu antar paket ringan jarak dekat.
- Jika dipilih, kasir/admin cukup mencatat manual di `Nomor resi / catatan paket`, misalnya `Dibawa Adit RT 02, bayar ongkir Rp2.000`.
- Kurir Warga berbeda dari Mitra Kurir Aktif:
  - Mitra Kurir Aktif = partner terdaftar/member, bisa mendapat HanaPoin kurir.
  - Kurir Warga = fleksibel/manual, fee ongkir bisa diberikan langsung, tidak wajib HanaPoin.
- Sistem sengaja fleksibel agar orang sekitar warung tetap punya tempat, termasuk yang belum punya HP/akun, selama aman dan dipercaya.
- Keputusan siapa yang layak menjadi Kurir Warga tetap di tangan kasir/admin karena faktor kepercayaan lokal.

## Catatan Nawa Cita — Sistem Mengikuti Hidup
- User menegaskan prinsip revolusioner Toko Hana: sistem tidak memaksa pengguna menyesuaikan diri dengan keterbatasan fitur.
- Sistem Toko Hana harus lentur mengikuti kebutuhan nyata warung, tapi tetap rapi menjaga data.
- Contoh arah unik:
  - online/offline hidup bersama,
  - mitra resmi dan Kurir Warga manual sama-sama punya tempat,
  - warga tanpa HP tetap bisa terlibat,
  - Jelajah menjadi bagian dari sistem toko, bukan sekadar blog/tempelan.
- Prinsip ini dicatat di `docs/NAWA_CITA_TOKO_HANA.md` bagian `Catatan Revolusioner — Sistem Mengikuti Hidup, Bukan Hidup Dipaksa Mengikuti Sistem`.

## Update terbaru — PWA Icon Premium Gold
- User membawa file `/home/user/uploads/iconpwa1.png` sebagai kandidat icon PWA.
- Icon tersebut dipakai sebagai icon install/PWA baru agar tampilan aplikasi tidak polos.
- Source disimpan di `assets/pwa/icon_pwa_gold_hana_cart_source.png`.
- File yang diperbarui:
  - `assets/pwa/icon_install_64.png`
  - `assets/pwa/icon_install_180.png`
  - `assets/pwa/icon_install_192.png`
  - `assets/pwa/icon_install_512.png`
  - `manifest.json`
  - `index.html` head icon/manifest inline
- Backup icon lama ada di `_archive/backups/pwa_icons_before_gold_*/`.
- Catatan: browser/HP sering cache icon PWA. Jika belum berubah setelah deploy, uninstall PWA lama lalu install ulang.
- Detail ada di `docs/UPDATE_2026-07-30_PWA_ICON_PREMIUM_GOLD.md`.

## Update terbaru — Icon Kategori “Semua” Gold
- Setelah icon PWA gold terasa cocok, desain yang sama diterapkan ke icon kategori utama `Semua`.
- Alasan desain: background batik pada ukuran kecil kurang terbaca, sedangkan background emas membuat logo/keranjang lebih jelas dan tetap nyambung dengan UI ungu-emas.
- Source kategori gold disimpan di `assets/category/icon_category_gold_hana_cart_source.png`.
- Aset aktif diperbarui:
  - `assets/category/icon_category_cart_transparent_512.png`
  - `assets/category/icon_category_tas_bg_cleanpad_512.png`
- `App.jsx` diperbarui pada `CTO_HANA_CATEGORY_ICON_DATA_URI`.
- `index.html` diperbarui pada `window.BRAND_CATEGORY_LOGO_DATA_URI`.
- Backup icon kategori lama ada di `_archive/backups/category_icon_before_gold_*/`.
- Detail ada di `docs/UPDATE_2026-07-30_ICON_KATEGORI_SEMUA_GOLD.md`.

## Update terbaru — Favicon Kembali Transparan, PWA & Kategori Tetap Gold
- Setelah test visual, favicon browser/tab lebih jelas memakai icon transparan lama karena ukurannya sangat kecil.
- Khusus favicon `assets/pwa/icon_install_64.png` dikembalikan dari backup sebelum icon gold.
- PWA/install icon tetap memakai gold premium:
  - `assets/pwa/icon_install_180.png`
  - `assets/pwa/icon_install_192.png`
  - `assets/pwa/icon_install_512.png`
- Kategori `Semua` tetap memakai gold premium.
- `index.html` diperbarui hanya pada `<link rel="icon" sizes="64x64">`; apple-touch-icon dan manifest tetap gold.

## Update terbaru — Efek Aktif Kategori Pakai Emas Matang Search Icon
- Warna icon kaca pembesar dan mic di kotak search adalah `#B8860B` (emas tua/golden brown), dengan hover mic ke `#FFD700`.
- Efek aktif kategori sekarang memakai `#B8860B` agar nyambung dengan search icon dan tidak terlalu kuning polos.
- Area yang diperbarui:
  - border kategori aktif,
  - ring kategori aktif,
  - shadow kategori aktif,
  - garis bawah kategori aktif,
  - drop-shadow icon `Semua` aktif,
  - teks kategori aktif light mode,
  - border/warna aktif di dropdown kategori.
- Icon PWA dan kategori `Semua` tetap gold premium; ini hanya penyelarasan efek aktif/selected state.

## Update terbaru — Tombol Tengah Navbar Pakai Emas Matang
- Setelah efek aktif kategori terasa lebih kalem dengan `#B8860B`, warna yang sama dicoba ke tombol tengah navbar/QRIS.
- Aksen yang diperbarui:
  - border tombol tengah dari `#FFD700` ke `#B8860B`,
  - shadow/glow tombol dari kuning terang ke `rgba(184,134,11,...)`,
  - icon QR di tombol tengah dari `#FFD700` ke `#B8860B` dengan drop-shadow halus.
- Tujuan: tombol tengah tetap premium tapi tidak terlalu nyengat/kuning polos.

## Update terbaru — Tombol Tengah Navbar Kembali ke Krem Emas Muda
- Percobaan `#B8860B` pada tombol tengah navbar terasa terlalu berat di atas background ungu pekat.
- Tombol tengah navbar/QRIS disesuaikan ke warna loading splash/krem emas muda:
  - border/icon: `#FFE8A8`
  - shadow: `rgba(255,216,132,...)`
- Kategori aktif tetap memakai `#B8860B` karena berada di konteks background putih/gold dan lebih kalem.
- Kesimpulan desain:
  - `#B8860B` cocok untuk efek aktif kategori/search icon.
  - `#FFE8A8` lebih cocok untuk tombol tengah navbar di atas ungu pekat.

## Update terbaru — Icon Navbar Gradient Krem Emas → Emas Matang
- `WarungIcon` sekarang mendukung mode `nav` khusus untuk icon navbar.
- Icon navbar Home/Jelajah/Saya memakai gradient SVG:
  - `#FFE8A8` krem emas muda
  - `#FFD784` emas muda loading splash
  - `#B8860B` emas matang
- Tujuannya agar icon tetap terlihat jika area navbar/pattern mendekati terang/putih, tapi tetap cocok di ungu.
- Icon Order (Lucide) diselaraskan:
  - aktif `#FFE8A8`
  - nonaktif `#D4AF37`
- Icon/tombol tengah QR tetap `#FFE8A8`.
- Icon WarungIcon di luar navbar tidak ikut berubah karena mode gradient hanya aktif saat prop `nav: true`.

## Update terbaru — Tombol QRIS Tengah Navbar Lebih Terlihat di Halaman Putih
- Tombol QRIS tengah navbar sebelumnya memakai border/icon krem `#FFE8A8`, enak di ungu tapi terlalu terang saat tombol naik di atas area halaman putih.
- Aksen tombol QRIS tengah diperbaiki menjadi kombinasi:
  - outer border: `#B8860B` agar terbaca di area putih,
  - inner glow/ring: `#FFE8A8` agar tetap hidup di ungu,
  - icon QR: `#FFD784` dengan drop-shadow ungu halus.
- Tujuan: tombol tetap terlihat baik di dua konteks — navbar ungu dan halaman putih.

## Update terbaru — Border Gradasi Tombol QRIS Tengah Navbar
- Tombol QRIS tengah navbar sekarang memakai teknik gradient border: `background ... padding-box, linear-gradient(...) border-box` dengan `border-transparent`.
- Gradasi border:
  - `#FFE8A8` krem emas muda
  - `#FFD784` emas muda
  - `#B8860B` emas matang
  - `#F97316` orange hangat di ujung
- Inner tombol tetap memakai gradient ungu/gelap sesuai mode.
- Tujuan: tombol QRIS tetap terlihat saat berada di atas halaman putih maupun navbar ungu, tanpa memakai orange polos yang terlalu keras.

## Update terbaru — Border Tombol QRIS Jadi Gradasi Emas 3D
- Orange pada border gradasi tombol QRIS tengah navbar diganti menjadi emas matang.
- Gradasi baru:
  - `#B8860B` emas matang
  - `#FFE8A8` krem emas highlight
  - `#FFD784` emas muda
  - `#D4AF37` gold medium
  - `#B8860B` emas matang
- Tujuannya memberi rasa emas 3D: ada sisi gelap, highlight, dan balik ke emas matang, tanpa nuansa orange panas.

## Update terbaru — Ring Tipis Tombol QRIS Jadi Bayangan Emas Tua
- Ring tipis luar tombol QRIS tengah navbar sebelumnya terlalu terang.
- Ring luar diganti menjadi bayangan emas-coklat:
  - `rgba(111,80,20,0.42)`
- Ditambah highlight inset halus:
  - `inset 0 1px 0 rgba(255,232,168,0.42)`
  - `inset 0 -2px 4px rgba(45,18,66,0.28)`
- Tujuannya agar tombol terasa lebih 3D: ada bayangan tepi + highlight, senada dengan background gold icon kategori `Semua`.

## Update terbaru — Bayangan Tombol QRIS Tidak Lagi Ring Simetris
- Lingkar luar tombol QRIS tengah navbar sebelumnya masih terasa seperti ring simetris.
- Ring simetris dihapus dan diganti kombinasi bayangan offset turun:
  - shadow blur bawah ungu tua,
  - shadow emas matang turun,
  - garis bawah tipis emas-coklat,
  - highlight inset bagian atas,
  - shadow inset bawah.
- Tujuan: tombol QRIS terasa punya kedalaman/3D seperti bayangan tombol, bukan lingkaran rata.

## Update terbaru — Kotak Search Pakai Border Gradasi Emas 3D
- Kotak search header dicoba dengan sentuhan gradasi emas matang + emas muda.
- Yang dibuat gold bukan seluruh isi input, tetapi border/tepi input agar teks tetap nyaman dibaca.
- Gradasi border search:
  - `#B8860B`
  - `#FFE8A8`
  - `#FFD784`
  - `#D4AF37`
  - `#B8860B`
- Isi search tetap putih/cream transparan pada mode terang dan ungu gelap transparan pada mode malam.
- CSS dark mode `input.hana-header-search` ikut diperbarui agar tidak memaksa balik ke outline kuning terang lama.
- `tools/make_cq_compiled.py` ikut dipatch supaya build ulang tidak mengembalikan search dark mode lama.

## Update terbaru — Search Box Melayang + Focus Jadi Lampu Warung
- Search box sebelumnya sudah memakai border gradasi emas 3D.
- Update ini menambahkan dua state visual:
  - Normal: bayangan turun tipis agar search terasa melayang seperti tombol QRIS.
  - Focus/aktif: glow emas lebih menyala agar terasa seperti lampu warung.
- Focus mode terang memakai gradient yang memasukkan `#FFD700` di tengah untuk efek menyala.
- Mode malam juga diselaraskan agar tidak kembali ke kuning polos, tetapi tetap gradasi emas 3D dengan glow hangat.
- `tools/make_cq_compiled.py` ikut diperbarui agar build ulang tidak menghapus efek search baru.

## Dokumen baru — Rasa Pengiriman Toko Hana
- File `docs/RASA_PENGIRIMAN_TOKO_HANA.md` dibuat untuk menyimpan microcopy/sentuhan rasa seluruh proses pengiriman.
- Isi mencakup tahap:
  - Order Masuk
  - Konfirmasi Pembayaran
  - Diproses
  - Deteksi Zona / Pilih Kurir
  - Paket Ditugaskan
  - Pickup Kurir
  - Sedang Dikirim
  - Paket Sampai
  - Paket Diterima
  - Barang Tidak Sesuai / Garansi Lite
- Dokumen juga membedakan rasa untuk Mitra Kurir Aktif, Kurir Warga, dan Ekspedisi Luar.
- Ini menjawab kebutuhan meja baru yang meminta `RASA_PENGIRIMAN_TOKO_HANA.md`.
