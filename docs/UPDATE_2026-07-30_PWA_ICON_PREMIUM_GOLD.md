# Update 2026-07-30 — PWA Icon Premium Gold

Ngopi boleh pindah meja, arah Toko Hana jangan ikut hilang.

## Tujuan

User membawa oleh-oleh icon baru:

```txt
/home/user/uploads/iconpwa1.png
```

Icon ini dipakai sebagai icon PWA/install agar tampilan aplikasi tidak polos dan terasa lebih premium.

## Perubahan

Source disimpan ke:

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

`manifest.json` diperbarui agar memakai icon baru.

`index.html` juga diperbarui pada:

```txt
<link rel="icon">
<link rel="apple-touch-icon">
<link rel="manifest">
```

Manifest inline di `index.html` sekarang berisi icon 192 dan 512 baru.

## Catatan cache PWA

Browser/HP sering menyimpan icon PWA di cache.

Jika icon belum berubah setelah deploy:

```txt
hapus/uninstall PWA lama
clear cache browser jika perlu
install ulang Toko Hana
```

## File disentuh

```txt
index.html
manifest.json
assets/pwa/icon_install_64.png
assets/pwa/icon_install_180.png
assets/pwa/icon_install_192.png
assets/pwa/icon_install_512.png
assets/pwa/icon_pwa_gold_hana_cart_source.png
```

## Backup

Icon lama disimpan di:

```txt
_archive/backups/pwa_icons_before_gold_*/
```

## Tes teknis

```bash
node --check /tmp/tokohana_app_script_check.js
```

Hasil: OK.

---

## Penyesuaian favicon

Setelah dilihat di ukuran browser/tab yang sangat kecil, favicon lebih jelas memakai icon transparan lama.

Keputusan desain:

```txt
Favicon browser/tab = transparan lama agar logo kecil lebih terbaca.
PWA/install icon = gold premium.
Kategori “Semua” = gold premium.
```

Implementasi:

```txt
assets/pwa/icon_install_64.png → dikembalikan ke transparan lama
index.html <link rel="icon" sizes="64x64"> → memakai transparan lama
```

PWA tetap gold:

```txt
assets/pwa/icon_install_180.png
assets/pwa/icon_install_192.png
assets/pwa/icon_install_512.png
manifest.json
```
