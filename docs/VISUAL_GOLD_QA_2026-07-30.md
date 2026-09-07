# Visual Gold QA — 2026-07-30

## Baseline

Audit dilanjutkan dari checkpoint Visual Gold dengan koreksi baseline terbaru:

```txt
Header Bell + Cart = gradient senada navbar
Compiled app = node check OK
```

Source kiriman sempat satu patch di belakang (Bell masih putih dan Cart belum `nav: true`). Patch tersebut direkonstruksi ke:

```txt
App.jsx
index.html
```

Backup sebelum perubahan:

```txt
_archive/backups/2026-07-30_visual_gold_header_gradient_rebuild/
```

## Patch header

### Bell

- Bell header sekarang memakai `WarungIcon type="bell"`.
- Mode `nav: true` memakai satu sistem gradient dengan navbar.
- Gradient:

```txt
#FFE8A8 → #FFD784 / #D4AF37 → #B8860B
```

- Bell memakai state aktif saat panel notifikasi terbuka atau ada notifikasi belum dibaca.
- Badge merah tetap berada di atas icon dan tidak masuk ke gradient.

### Cart

- Cart header tetap memakai bentuk keranjang warung.
- Ditambahkan `nav: true` agar gradient sama dengan Home/Jelajah/Saya.
- State aktif mengikuti `currentTab === 'Cart'`.
- Badge jumlah barang tetap amber dengan teks deep purple.

## Matriks QA visual statis

| Area | Light | Dark | Focus/aktif | Status |
|---|---:|---:|---:|---|
| Search header | gradient gold 3D | inner ungu gelap + gradient gold | glow `#FFD700` | Lolos audit kode |
| Bell header | gradient navbar | gradient navbar | lebih terang saat aktif/unread | Lolos |
| Cart header | gradient navbar | gradient navbar | lebih terang saat tab Cart | Lolos |
| Tombol QRIS tengah | border gold 3D | inner gelap | shadow jatuh ke bawah | Lolos |
| Navbar Home/Jelajah/Saya | SVG gradient | SVG gradient | stroke lebih tebal | Lolos |
| Navbar Order | gold medium / krem aktif | tetap terbaca | aktif `#FFE8A8` | Lolos |
| Kategori aktif | emas matang `#B8860B` | kontras hangat | ring/shadow aktif | Lolos audit kode |
| Icon kategori Semua | data URI gold | tetap sama | drop-shadow matang | Lolos audit kode |
| Favicon | data URI PNG transparan | browser-dependent | — | Terpasang di compiled HTML |
| PWA icon | manifest data URI | OS-dependent | — | Terpasang di compiled HTML |

## Pemeriksaan konflik search dark mode

Urutan CSS compiled sudah benar:

1. style input global dark,
2. `input.hana-header-search:focus`,
3. `.dark-mode-root input.hana-header-search`,
4. `.dark-mode-root input.hana-header-search:focus`.

Rule khusus search memakai selector lebih spesifik dan `!important`, sehingga tidak kembali ke outline kuning polos lama.

## Pemeriksaan teknis

Compiled script diekstrak dari `index.html` ke:

```txt
/tmp/tokohana_index_app_script_check.js
```

Lalu diperiksa:

```bash
node --check /tmp/tokohana_index_app_script_check.js
```

Hasil:

```txt
OK
```

Invariant yang ditemukan di `App.jsx` dan `index.html`:

```txt
WarungIcon bell gradient       ✅
Header Bell nav:true           ✅
Header Cart nav:true           ✅
Search dark normal             ✅
Search dark focus              ✅
QRIS border gradient gold 3D   ✅
```

Tidak ada perubahan database, schema, RLS, atau data Supabase.

## Koreksi Search Mode Malam — Border Saja

User memperjelas bahwa isi search mode malam sudah pas. Percobaan membuat inner putih/cream dibatalkan.

Kondisi terbaru:

```txt
inner: ungu gelap asli
teks/placeholder/caret: emas hangat asli
shadow: rasa malam asli
border normal: gradient persis mode terang
border focus: gradient terang + glow #FFD700
```

Audit cascade menemukan dua rule global malam yang berpotensi mencampuri border input. Karena itu border dipindahkan dari input ke shell khusus tanpa class `border-*`:

```txt
.hana-header-search-shell[data-hana-search-shell="night"]
```

Input tetap `border: 0`. Pseudo-element `::after` menggambar ring gradient melalui mask, sehingga rule global input maupun selector `[class*="border-"]` tidak bisa mengubahnya.

Palet normal dan focus disamakan dengan border mode terang. Gradient normal diberikan lewat custom property inline pada shell; bagian tengah pseudo-element dipotong menggunakan `mask-composite`/`-webkit-mask-composite`.

Hasil gate tambahan:

```txt
node --check compiled app       OK
python compile builder          OK
dark inner unchanged            PASS
normal gradient match light     PASS
focus gradient match light      PASS
masked pseudo-ring              PASS
Bell/Cart gradient preserved    PASS
```

## Uji mata yang masih perlu dilakukan

Static QA dan syntax check sudah lolos. Uji pixel terakhir tetap perlu dilihat di perangkat/preview karena workspace ini tidak memiliki browser headless.

Checklist singkat:

1. Light mode: Bell dan Cart terbaca di header ungu/batik.
2. Dark mode: Bell dan Cart tidak redup atau berubah putih polos.
3. Buka panel notifikasi: Bell menjadi sedikit lebih terang tanpa merusak badge.
4. Buka Cart: Cart menjadi aktif tanpa badge tertutup.
5. Fokus search light/dark: border menyala seperti lampu, bukan outline kuning rata.
6. Cek iPhone kecil/Android: search tidak terjepit oleh dua tombol header.

## Update UI Lega — Tinggi Foto Card Produk

Tinggi container foto pada card produk Home diturunkan:

```txt
h-40 / 160 px → h-24 / 96 px
```

Acuan `h-24` berasal dari banner promo dinamis di atas footer. Hanya tinggi foto yang berubah; grid, lebar, radius, detail card, dan foto modal detail tetap.

Skeleton loading juga memakai `h-24`.

```txt
product photo h-24    PASS
skeleton h-24         PASS
card width/shape      tetap PASS
detail photo h-48     tetap PASS
node check            OK
```

## Label Kategori Foto — Baseline + Optical Shift

Kertas label tetap memakai baseline `py-[1.5px]`, font `7.5 px`, serta line-height bawaan. Hanya teks label pada card Home yang digeser naik `0.5 px` melalui `position: relative; top: -0.5px`.

Tinggi kertas tidak berubah dan label modal detail tidak disentuh.

```txt
label box baseline preserved  PASS
text optical shift -0.5px     PASS
detail label unchanged        PASS
photo/body compact preserved  PASS
node check                    OK
```

## Update UI Lega — Body Card Produk Compact

Bagian kertas di bawah foto dirapatkan:

```txt
body padding: px-2.5 pt-2 pb-2.5
nama: 12.5 px / leading 1.15
keterangan: 9.5 px / mt-0.5
area harga: mt-1
stok + tombol: mt-0.5
```

Harga utama dan tombol quick-add tidak dikecilkan. Spacer harga normal diselaraskan dengan baris harga coret versi compact agar posisi harga tetap seimbang.

```txt
compact body              PASS
name/description spacing  PASS
price area moves up       PASS
main price preserved      PASS
quick-add preserved       PASS
card width/shape          tetap PASS
node check                OK
```

## Update Motion — Globe Online 24 Jam

Hanya icon Globe pada badge kartu sapaan `Online 24 Jam` yang diberi animasi putar linear 7 detik. Icon Globe lain tetap statis.

Eksperimen hijau dibatalkan setelah diuji berdampingan dengan status warung pagi. Cangkang, Globe, dan teks kembali gold; hanya Globe yang tetap berputar. Badge online tidak berkedip dan pulse hijau tetap khusus status warung fisik.

```txt
targeted globe only       PASS
7s linear infinite        PASS
gold color restored       PASS
online blink absent       PASS
physical pulse preserved  PASS
reduced motion fallback   PASS
node check                OK
builder synced            PASS
```

## Update Profil — Switch Bahasa ID–EN

Kontrol dual bahasa dikembalikan ke Pengaturan Profil sebagai switch segmented `ID–EN`, tanpa icon Globe. State dan penyimpanan lama tetap digunakan.

```txt
ID-EN switch rendered       PASS
language persistence        PASS
HTML lang sync              PASS
no extra globe              PASS
theme switch preserved      PASS
node check                  OK
```

## Update Santai — Empty State & Stok

Microcopy produk kosong tersedia dalam ID/EN dan baris stok memakai separator titik tengah:

```txt
Belum ketemu di rak ini, kawan ☕
Terjual 12 • Stok 8
```

```txt
empty state ID/EN       PASS
stock separator compact PASS
layout preserved        PASS
node check              OK
```

## Fix Quick Add — Hit Area

Tombol quick-add mempertahankan visual `26 × 26 px`, tetapi memiliki area sentuh `36 × 36 px` dengan margin negatif agar tinggi card tidak bertambah. Stacking row/tombol dan propagation diperkuat.

```txt
full hit area           PASS
visual 26px preserved   PASS
non-tier direct add     PASS
tier flow preserved     PASS
card layout preserved   PASS
node check              OK
```

## Catatan paket

`index.html` bersifat self-contained dan siap dipreview. Paket upload ini tidak menyertakan seluruh folder `assets/` dan `libs/` dari workspace asli. Karena itu jangan menjalankan rebuild builder dari paket ramping ini sebelum aset/library asli dipulihkan. Source dan compiled HTML sudah sama-sama membawa patch header terbaru.
