# Update 2026-07-30 — Icon Kategori “Semua” Gold

Ngopi boleh pindah meja, arah Toko Hana jangan ikut hilang.

## Tujuan

Setelah icon PWA premium gold cocok dengan rasa Toko Hana, desain yang sama diterapkan ke icon kategori utama:

```txt
Kategori: Semua
```

Alasannya:

```txt
Background batik di ukuran kecil kurang terbaca.
Background emas lebih jelas, lebih premium, dan nyambung dengan UI ungu-emas Toko Hana.
```

## Perubahan aset

Source icon gold kategori disimpan di:

```txt
assets/category/icon_category_gold_hana_cart_source.png
```

Icon kategori aktif diperbarui:

```txt
assets/category/icon_category_cart_transparent_512.png
assets/category/icon_category_tas_bg_cleanpad_512.png
```

`App.jsx` diperbarui pada:

```txt
CTO_HANA_CATEGORY_ICON_DATA_URI
```

`index.html` diperbarui pada:

```txt
window.BRAND_CATEGORY_LOGO_DATA_URI
```

## Backup

Icon lama dibackup di:

```txt
_archive/backups/category_icon_before_gold_*/
```

## Dampak UI

- Kategori `Semua` memakai icon gold premium.
- Lebih konsisten dengan PWA icon/install.
- Lebih terbaca di ukuran kecil.
- Lebih menyatu dengan identitas visual Toko Hana: ungu, emas, keranjang, dan huruf H.

## Tes teknis

```bash
node --check /tmp/tokohana_app_script_check.js
```

Hasil: OK.
