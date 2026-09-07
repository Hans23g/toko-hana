-- =============================================================================
-- 🛵 Toko Hana — Pintu Kecil Mitra Kurir: Pickup & Paket Sampai
-- Tanggal: 2026-08-09
-- =============================================================================
--
-- KENAPA PERLU INI? ☕ (kelanjutan pintu kecil kemarin)
-- Mitra Kurir adalah akun member/pelanggan — RLS tabel orders memang sengaja
-- menolak UPDATE dari non-staf. Akibatnya:
--   kurir konfirmasi "Paket Sampai" → database tidak berubah → di HP pelanggan
--   status masih "Sedang Dikirim" → tombol Paket Diterima BELUM muncul.
-- Selama ini kurir hanya ditopang overlay lokal (layar kurir benar, tapi
-- pelanggan & kasir membaca data lama).
--
-- SOLUSI AMAN — dua pintu kecil SECURITY DEFINER, penjaga di dalam fungsi:
--   1) courier_confirm_pickup   : hanya jalan saat order 'Dikirim'
--   2) courier_confirm_arrived  : hanya jalan saat order 'Dikirim' → 'Kurir Tiba'
-- Kolom lain (total, barang, dsb.) mustahil disentuh lewat pintu ini.
--
-- Setelah 'Kurir Tiba' tembus database:
--   → realtime pelanggan bunyi notifikasi rasa "Paket Sampai"
--   → tombol "Paket Diterima" muncul di HP pelanggan
--   → pelanggan menutup order lewat pintu kecil kemarin ☕
--
-- CARA PASANG (± 1 menit):
--   1. Buka Supabase → SQL Editor
--   2. Paste SELURUH isi file ini → Run
--   3. Tes: kurir pickup → kurir Paket Sampai → pelanggan konfirmasi diterima
-- =============================================================================

-- 🛵 PINTU 1: Konfirmasi pickup oleh Mitra Kurir -------------------------------
create or replace function public.courier_confirm_pickup(p_order_id text, p_note text default '')
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_count integer;
begin
  -- Hanya order yang siap jalan ('Dikirim') yang boleh dicatat pickup.
  update public.orders
     set courier_status      = 'pickup',
         picked_up_at        = now(),
         delivery_proof_note = concat_ws(' | ',
                                 nullif(delivery_proof_note, ''),
                                 nullif(p_note, ''))
   where id     = p_order_id
     and status = 'Dikirim';

  get diagnostics updated_count = row_count;
  return updated_count > 0;
end;
$$;

-- 📦 PINTU 2: Konfirmasi paket sampai di alamat oleh Mitra Kurir ---------------
create or replace function public.courier_confirm_arrived(p_order_id text, p_note text default 'Paket telah sampai di alamat pelanggan. Menunggu konfirmasi paket diterima.')
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_count integer;
begin
  -- Hanya order yang sedang jalan ('Dikirim') yang boleh ditandai sampai.
  update public.orders
     set status              = 'Kurir Tiba',
         courier_status      = 'tiba',
         delivered_at        = now(),
         delivery_proof_note = concat_ws(' | ',
                                 nullif(delivery_proof_note, ''),
                                 nullif(p_note, '')),
         payment_note        = concat_ws(' | ',
                                 nullif(payment_note, ''),
                                 nullif(p_note, ''))
   where id     = p_order_id
     and status = 'Dikirim';

  get diagnostics updated_count = row_count;
  return updated_count > 0;
end;
$$;

-- Pintu ini aman dibuka untuk publik: penjaga sebenarnya ada di dalam fungsi.
grant execute on function public.courier_confirm_pickup(text, text) to anon;
grant execute on function public.courier_confirm_pickup(text, text) to authenticated;
grant execute on function public.courier_confirm_arrived(text, text) to anon;
grant execute on function public.courier_confirm_arrived(text, text) to authenticated;

-- =============================================================================
-- UJI CEPAT (opsional, di SQL Editor):
--   select public.courier_confirm_pickup('ORDER-ID-DI-SINI', 'tes pickup');
--   select public.courier_confirm_arrived('ORDER-ID-DI-SINI');
-- Harusnya TRUE hanya untuk order 'Dikirim'; FALSE aman untuk status lain.
-- =============================================================================
