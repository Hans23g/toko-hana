# 🏪 Toko Hana — Warungnya Rakyat

> **"Warungnya Rakyat, Siap Menyambut Ekosistem π"**
> Warung digital dengan rasa warung asli — dari Jl. Cilendek Timur, Bogor, untuk Indonesia 🇮🇩

**🌐 Live:** https://tokohana.vercel.app/

Toko Hana bukan marketplace dan tidak ingin jadi marketplace.
Ia adalah **warung sungguhan (05.30–22.00 WIB) yang bertransformasi digital** —
lengkap dengan sapaan juragan, batik ungu-emas, stempel jadul, celengan HanaPoin,
dan prinsip: **sistem mengikuti hidup, bukan hidup dipaksa mengikuti sistem.**

## ✨ Fitur Utama
- 🛒 **Etalase & keranjang** — belanja online (24 jam) & offline (kasir warung)
- 👥 **Multi-peran**: Admin, Kasir, Kurir (Mitra Kurir Aktif), Mitra, Member, Tamu
- 💵 **Kasir offline lengkap**: bayar lunas/sebagian, piutang, struk + kirim WA, cetak ulang
- 🛵 **Pengiriman berlapis**: ekspedisi umum, Mitra Kurir (dengan HanaPoin), sampai **Kurir Warga** berbasis kepercayaan lokal
- 📍 **Zona antar fleksibel** — ongkir per zona dari patokan alamat warung
- ⭐ **HanaPoin** — loyalti member & bonus kurir (500 poin = Rp 5.000)
- 🧾 **POS Restok** — alert stok menipis + kirim daftar belanja ke WA agen
- 🔔 Notifikasi real-time (Supabase Realtime)
- 🌙 Tema malam, 🧶 batik keraton, dan rasa warung di setiap microcopy

## ⚖️ Prinsip Kepatuhan
Seluruh pembayaran diselesaikan **HANYA dalam Rupiah** (QRIS/Tunai/COD) sesuai UU No. 7/2011.
Fitur Koin Pi bersifat **edukasi & kesiapan ekosistem** — bukan alat pembayaran yang sah.

## 🛡️ Keamanan
- RLS aktif di semua tabel — lihat **`db/BENTENG_AKTIF_RESMI.md`** (rujukan satu-satunya!)
- Aksi kurir/pelanggan via **RPC "Pintu Kecil"** (SECURITY DEFINER) — benteng tetap rapat
- Password admin diverifikasi server (Supabase Auth) — tidak ada di kode
- CSP headers via `vercel.json`

## 📁 Struktur Repo
```
index.html      → build produksi (single-file PWA, deploy langsung ke Vercel)
App.jsx         → source React aktif
tools/          → generator build (make_cq_compiled.py)
db/             → RPC pintu kecil + dokumen benteng (BACA BENTENG_AKTIF_RESMI.md)
docs/           → NAWA_CITA (dokumen ruh!), rasa pengiriman, update log
assets/         → logo, icon PWA, icon kategori
_archive/       → arsip & karantina (JANGAN jalankan isi karantina!)
incoming/       → jalur upload build baru (auto-deploy via Actions)
```

## 📖 Untuk CTO / Meja Baru
1. Baca `docs/NAWA_CITA_TOKO_HANA.md` — ruh proyek, wajib!
2. Baca `db/BENTENG_AKTIF_RESMI.md` — sebelum sentuh database
3. Baca `README_CTO_WORKSPACE.md` — riwayat teknis lengkap
4. Jaga rasa warung: hangat, membumi, tidak generik ☕

---
*Dibangun gotong royong lintas meja oleh Juragan & para CTO (CTO1 "Mythical Immortal" → CTO2 → CTO3 → ...) sambil ngopi.* ☕🤝
*974+ commits dan terus bertumbuh — dari warung tetangga jadi gerbang ekonomi digital.*
