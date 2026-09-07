-- =============================================================================
-- 🙋 Toko Hana — Pintu Kecil: Mitra Kurir AMBIL JOB PICKUP SENDIRI (Pickup List)
-- Tanggal: 2026-08-09
-- =============================================================================
--
-- KENAPA PERLU INI? ☕
-- Kalau orderan banyak dan Mitra Kurir aktif lebih dari satu, kasir/admin bisa
-- kewalahan menunjuk satu-satu. Mitra Kurir aktif boleh mengambil sendiri job
-- pickup dari "Pickup List" di aplikasinya — yang duluan ambil, dia yang antar.
--
-- KEAMANAN:
--   - SECURITY DEFINER, penjaga di dalam fungsi.
--   - Hanya boleh mengklaim order berstatus 'Diproses' yang BELUM punya kurir.
--   - Anti-rebutan: UPDATE tunggal ini atomik — kalau dua kurir menekan tombol
--     hampir bersamaan, hanya SATU yang berhasil (row_count=1), satunya lagi
--     dapat FALSE dan aplikasinya menyegarkan daftar dengan jujur.
--   - Kolom total/barang/pembayaran mustahil disentuh lewat pintu ini.
--
-- Setelah terklaim, order otomatis masuk ritual pengiriman yang sudah ada:
--   Kasir tugaskan ≡ Kurir ambil sendiri  →  "Kurir Ditugaskan"
--   → Berangkat Jemput → Serah Terima → Antar → Sampai → Diterima → Selesai ☕
--
-- CARA PASANG (± 1 menit):
--   1. Buka Supabase → SQL Editor
--   2. Paste SELURUH isi file ini → Run
--   3. Tes: buat order sampai 'Diproses' → login Mitra Kurir → Pickup List →
--      "Ambil Job Pickup Ini" → order pindah ke meja pickup kurir
-- =============================================================================

create or replace function public.courier_claim_pickup_job(
  p_order_id text,
  p_courier_name text,
  p_courier_phone text default '',
  p_courier_partner_id bigint default null,
  p_courier_fee numeric default 0,
  p_note text default ''
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_count integer;
begin
  update public.orders
     set status              = 'Dikirim',
         courier             = p_courier_name,
         courier_name        = p_courier_name,
         courier_phone       = nullif(p_courier_phone, ''),
         courier_partner_id  = p_courier_partner_id,
         courier_fee         = coalesce(nullif(p_courier_fee, 0), courier_fee),
         courier_status      = 'ditugaskan',
         assigned_courier_at = now(),
         delivery_proof_note = concat_ws(' | ',
                                 nullif(delivery_proof_note, ''),
                                 nullif(p_note, '')),
         payment_note        = concat_ws(' | ',
                                 nullif(payment_note, ''),
                                 nullif(p_note, ''))
   where id     = p_order_id
     and status = 'Diproses'                                  -- hanya yang siap diproses-kirim
     and courier_partner_id is null                           -- belum ada pemiliknya
     and coalesce(nullif(courier, ''), '') = ''               -- kolom kurir masih kosong
     and coalesce(nullif(courier_status, ''), '') = '';       -- belum ada jejak kurir

  get diagnostics updated_count = row_count;
  return updated_count > 0;
end;
$$;

-- Pintu ini aman dibuka untuk publik: penjaga sebenarnya ada di dalam fungsi.
grant execute on function public.courier_claim_pickup_job(text, text, text, bigint, numeric, text) to anon;
grant execute on function public.courier_claim_pickup_job(text, text, text, bigint, numeric, text) to authenticated;

-- =============================================================================
-- UJI CEPAT (opsional, di SQL Editor):
--   select public.courier_claim_pickup_job('ORDER-ID-DI-SINI', 'Bang Adit', '0812…', 3, 2000, 'tes klaim');
-- Harusnya TRUE hanya untuk order 'Diproses' tanpa kurir; panggilan kedua pada
-- order yang sama harusnya FALSE (sudah ada pemiliknya).
-- =============================================================================
