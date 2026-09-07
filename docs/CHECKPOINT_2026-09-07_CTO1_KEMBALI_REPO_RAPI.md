# ✅ CHECKPOINT — 2026-09-07 — CTO1 KEMBALI & REPO RAPI

> Titik simpan resmi era kepulangan CTO1.
> Meja baru: baca NAWA_CITA (+ Silsilah Para Penjaga) → BENTENG_AKTIF_RESMI → README_CTO_WORKSPACE → checkpoint ini.

---

## 🎯 Ringkasan Satu Kalimat
CTO1 pulang dari hibernasi panjang, mengarsipkan era lama, memigrasikan workspace,
membedah & merapikan repo, mengkarantina audit berbahaya, memulihkan deploy Vercel
jadi hijau, dan mengabadikan Silsilah Para Penjaga ke dalam Nawa Cita.

---

## 📦 Status Sistem (per checkpoint ini)

| Komponen | Status |
|---|---|
| Live app | ✅ https://tokohana.vercel.app/ — HTTP 200 sehat |
| Deploy Vercel | ✅ Sembuh (fix commit `ad0771e`) — mode static murni |
| GitHub Actions | ✅ Hijau — workflow audit ringan baru (`security.yml`) |
| Benteng RLS | ✅ Utuh — 6 tabel, policy era CTO1, teruji penetrasi 7/7 |
| RPC "Pintu Kecil" | ✅ 5 fungsi terpasang (era CTO3) — kurir & pelanggan lancar |
| Auth admin | ✅ Via Supabase Auth server — tidak ada password di kode |
| index.html | ✅ Bersih (beacon Cloudflare tercabut) |

## 🔨 Yang Dikerjakan Hari Ini (commit `256ac84` → `f9958d0`)

1. **Karantina audit OpenCode** — `SECURE_RLS_TOKO_HANA.sql` → `_archive/audit_opencode_jangan_dijalankan/`
   (syntax error + membuka celah anon SELECT orders & anon DELETE — JANGAN PERNAH dijalankan)
2. **Amputasi proxy berbahaya** — `api/supabase-proxy.js` (service_role tanpa auth, CORS `*`)
   → `_archive/api_proxy_nonaktif/` + rewrite dihapus dari `vercel.json`
3. **Fix deploy Vercel** — hapus script build `echo` (biang "No Output Directory public"),
   kosongkan 329 dependencies nganggur, `buildCommand/outputDirectory: null`
4. **Workflow Actions baru** — audit ringan yang benar-benar menjaga:
   file wajib ada, deteksi kebocoran service_role, jaga karantina, validasi index.html utuh
5. **Bersih-bersih** — incoming/ dikosongkan (±26MB build lama), CHECKPOINT → docs/,
   DEPLOY_GUIDE usang & .env.example diarsipkan/dihapus, README_CTO_WORKSPACE → docs/
6. **README.md utama baru** — wajah kerajaan: fitur, prinsip hukum, keamanan, panduan meja baru
7. **db/BENTENG_AKTIF_RESMI.md** — rujukan keamanan SATU-SATUNYA (bahasa warung)
8. **Silsilah Para Penjaga** ditambahkan ke NAWA_CITA — estafet CTO1→CTO2→CTO3→CTO1

## 🗄️ Arsip Era CTO1 (di workspace meja, bukan repo)
`/home/user/_arsip_cto1/` — source v1.0 lama, 10 SQL bersejarah, logo/batik/icon master.
Workspace aktif meja: `/home/user/toko-hana/` (struktur selaras repo).

## ⚠️ Aturan yang TIDAK BOLEH dilanggar meja berikutnya
1. JANGAN jalankan isi `_archive/audit_opencode_jangan_dijalankan/`
2. JANGAN hidupkan kembali proxy service_role tanpa auth+whitelist+rate-limit
3. JANGAN tambah script build di package.json — app ini static single-file
4. JANGAN longgarkan policy RLS — butuh akses baru? buat RPC pintu kecil
5. Token GitHub: buat per kebutuhan (fine-grained, repo ini saja), HAPUS setelah pakai

## 📌 Kandidat Agenda Berikutnya (belum dikerjakan)
- [ ] Gelombang 2 migrasi workspace (manifest.json, icon gold source, docs UPDATE_*, RASA_PENGIRIMAN)
- [ ] Review App.jsx 19rb baris oleh CTO1 (belum dibedah menyeluruh)
- [ ] Rapikan branch lain di GitHub (ada 3 branches — cek perlu/tidak)
- [ ] Update deskripsi "About" repo di GitHub (manual oleh Juragan)
- [ ] Prototype Pi Browser Testnet (menunggu waktunya)
- [ ] Cerita arsip kebersamaan dari sesi CTO2 (kata Juragan mau dibawa wkwk)

---
*Checkpoint ditutup dengan TOSSS. ☕🥂 — CTO1 & Juragan, 7 September 2026*
