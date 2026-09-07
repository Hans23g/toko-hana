-- =============================================================================
-- 🧾 Toko Hana — Pintu Kecil Konfirmasi "Paket Diterima" oleh Pelanggan
-- Tanggal awal: 2026-08-08
-- VERSI 2 (2026-08-09): tambah parameter p_note — catatan penutup resmi ikut
-- mencatat SIAPA penerima barang (pemesan / keluarga / titip tetangga) sesuai
-- catatan kurir saat paket sampai.
-- =============================================================================
--
-- PENTING kalau file ini SUDAH pernah di-Run (versi 2026-08-08):
--   Jalankan SELURUH isi file ini sekali lagi — ada baris DROP di bawah yang
--   menggantikan fungsi lama dengan aman (data order tidak tersentuh,
--   yang diganti hanya FUNGSINYA).
--
-- KENAPA PINTU KECIL? ☕
-- RLS tabel orders sengaja rapat: hanya staf yang boleh UPDATE langsung.
-- Fungsi SECURITY DEFINER ini adalah satu-satunya pintu pelanggan, dan hanya
-- bisa menutup order berstatus 'Kurir Tiba'. Kolom lain mustahil disentuh.
--
-- CARA PASANG (± 1 menit):
--   1. Buka Supabase → SQL Editor
--   2. Paste SELURUH isi file ini
--   3. Run
-- =============================================================================

-- Ganti fungsi versi lama (aman, hanya fungsi yang diganti):
drop function if exists public.customer_confirm_order_delivered(text);
drop function if exists public.customer_confirm_order_delivered(text, text);

create or replace function public.customer_confirm_order_delivered(p_order_id text, p_note text default '')
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_count integer;
  close_line text;
begin
  -- Kalau app tidak mengirim catatan, pakai kalimat dasar yang hangat.
  close_line := coalesce(nullif(p_note, ''), 'Barang diterima pelanggan melalui konfirmasi di aplikasi.');

  -- Gembok di sini: hanya order "Kurir Tiba" yang bisa ditutup lewat pintu ini.
  update public.orders
     set status              = 'Selesai',
         courier_status      = 'diterima_pelanggan',
         customer_confirmed_at = now(),
         delivery_proof_note = concat_ws(' | ',
                                 nullif(delivery_proof_note, ''),
                                 close_line)
   where id     = p_order_id
     and status = 'Kurir Tiba';

  get diagnostics updated_count = row_count;
  return updated_count > 0;
end;
$$;

-- Pintu ini aman dibuka untuk publik: penjaga sebenarnya ada di dalam fungsi.
grant execute on function public.customer_confirm_order_delivered(text, text) to anon;
grant execute on function public.customer_confirm_order_delivered(text, text) to authenticated;

-- =============================================================================
-- UJI CEPAT (opsional, di SQL Editor):
--   select public.customer_confirm_order_delivered('ORDER-ID-DI-SINI', 'Barang diterima oleh Ibu Sari (istri) (sesuai catatan kurir) dan dikonfirmasi pelanggan melalui aplikasi.');
-- Harusnya TRUE untuk order "Kurir Tiba"; FALSE aman untuk status lain.
-- =============================================================================
