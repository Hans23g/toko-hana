# MULAI DI SINI — Toko Hana

> Jangan mulai dari nol. Meja boleh pindah, arah jangan hilang.

## Urutan Baca

```txt
1. docs/checkpoints/CURRENT.md
2. docs/checkpoints/CHECKPOINT_2026-07-30_VISUAL_GOLD_RASA_PENGIRIMAN_READY.md
3. docs/arah-produk/NAWA_CITA_TOKO_HANA.md
4. docs/pengiriman/RASA_PENGIRIMAN_TOKO_HANA.md
5. db/DB_SCHEMA_RLS_2026-07-30.md
6. docs/INDEX_DOKUMEN.md
```

## File Aktif di Meja

```txt
App.jsx       source aplikasi
index.html    compiled HTML self-contained / preview utama
manifest.json manifest PWA sumber
tools/        builder
```

Dokumen sudah dikelompokkan berdasarkan fungsi. Checkpoint lama tidak dihapus; semuanya berada di `docs/checkpoints/`.

Preview percobaan dan backup lama berada di `_archive/`, sehingga tidak memenuhi meja utama.

## Menjalankan / Melihat

Buka:

```txt
index.html
```

## Rebuild

Builder sumber:

```bash
cd /home/user/toko-hana
python3 tools/make_cq_compiled.py
```

Catatan: paket workspace ringkas yang tersedia saat ini tidak membawa seluruh folder `assets/` dan `libs/` dari workspace asal. `index.html` tetap self-contained dan dapat dipreview. Untuk rebuild penuh, pulihkan `assets/` dan `libs/` asli terlebih dahulu.

## Paket Pindah Meja

Petunjuk:

```txt
handoff/README_PAKET_PINDAH_MEJA.md
```

Paket ZIP dan checksum disimpan di luar folder project agar meja project tetap bersih.

## Pegangan

```txt
Sistem mengikuti hidup, bukan hidup dipaksa mengikuti sistem.
Jaga rasa warung.
Jangan bongkar UI matang tanpa alasan.
Backup → edit kecil → test → checkpoint.
```
