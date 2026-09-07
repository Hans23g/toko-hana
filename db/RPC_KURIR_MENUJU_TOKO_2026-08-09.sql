-- =============================================================================
-- 🛵 Toko Hana — Pintu Kecil Mitra Kurir: "Berangkat Jemput ke Warung"
-- Tanggal: 2026-08-09 (tambahan tahap ritual jemput–serah terima–antar)
-- =============================================================================
--
-- KENAPA PERLU INI? ☕
-- Alur pengiriman resmi sekarang punya tahap lengkap (saran langsung dari lapangan):
--   Kasir tugaskan kurir  → "Kurir Ditugaskan"
--   Kurir berangkat jemput → "Kurir Menuju Toko"     ← PINTU INI
--   Kasir serahkan paket   → "Siap Berangkat"        (staf, UPDATE langsung — tanpa RPC)
--   Kurir bawa paket       → "Sedang Dikirim"        (pintu courier_confirm_pickup kemarin)
--   Kurir sampai           → "Paket Sampai"          (pintu courier_confirm_arrived kemarin)
--   Pelanggan konfirmasi   → "Selesai"               (pintu customer_confirm_order_delivered kemarin)
--
-- SOLUSI AMAN — satu pintu kecil SECURITY DEFINER ini:
-- hanya jalan saat order berstatus 'Dikirim' dan paket belum dibawa/terserah,
-- lalu menandai courier_status = 'menuju_toko'. Kolom lain mustahil disentuh.
--
-- CARA PASANG (± 1 menit):
--   1. Buka Supabase → SQL Editor
--   2. Paste SELURUH isi file ini → Run
--   3. Tes ritual: tugaskan kurir → kurir "Berangkat Jemput" → kasir "Serahkan
--      Paket" → kurir "Bawa Paket & Antar" → "Paket Sampai" → pelanggan diterima
-- =============================================================================

create or replace function public.courier_start_pickup(p_order_id text, p_note text default '')
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_count integer;
begin
  -- Hanya order yang siap jalan ('Dikirim') dan paketnya belum dibawa/terserah.
  update public.orders
     set courier_status      = 'menuju_toko',
         delivery_proof_note = concat_ws(' | ',
                                 nullif(delivery_proof_note, ''),
                                 nullif(p_note, ''))
   where id     = p_order_id
     and status = 'Dikirim'
     and coalesce(nullif(courier_status, ''), 'ditugaskan') in ('ditugaskan', 'dikirim', 'menuju_toko');

  get diagnostics updated_count = row_count;
  return updated_count > 0;
end;
$$;

-- Pintu ini aman dibuka untuk publik: penjaga sebenarnya ada di dalam fungsi.
grant execute on function public.courier_start_pickup(text, text) to anon;
grant execute on function public.courier_start_pickup(text, text) to authenticated;

-- =============================================================================
-- UJI CEPAT (opsional, di SQL Editor):
--   select public.courier_start_pickup('ORDER-ID-DI-SINI', 'tes berangkat jemput');
-- Harusnya TRUE untuk order 'Dikirim' yang belum dibawa; FALSE aman selain itu.
-- =============================================================================
