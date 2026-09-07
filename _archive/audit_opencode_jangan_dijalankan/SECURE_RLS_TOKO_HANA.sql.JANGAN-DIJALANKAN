-- File: db/SECURE_RLS_TOKO_HANA.sql
-- Kopi paste di SQL Editor Supabase > Run

-- === ORDERS ===
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_select_orders" ON orders
FOR SELECT USING (true);

CREATE POLICY "authenticated_insert_orders" ON orders
FOR INSERT FOR EACH ROW WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "admin_update_orders" ON orders
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM customers WHERE email = auth.jwt() ->> 'email' AND role = 'admin'
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM customers WHERE email = auth.jwt() ->> 'email' AND role = 'admin'
  )
);

CREATE POLICY "public_delete_own_orders" ON orders
FOR DELETE USING (
  auth.uid()::text = orders.created_by OR auth.uid() IS NULL
);

-- === CUSTOMERS ===
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated_select_customers" ON customers
FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "public_insert_customers" ON customers
FOR INSERT FOR EACH ROW WITH CHECK (true);

CREATE POLICY "own_update_customers" ON customers
FOR UPDATE USING (
  auth.uid()::text = customers.id OR auth.uid() IS NULL
);

-- === PARTNERS ===
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_select_partners" ON partners
FOR SELECT USING (status = 'active');

CREATE POLICY "admin_crud_partners" ON partners
FOR INSERT, UPDATE, DELETE USING (
  EXISTS (
    SELECT 1 FROM customers WHERE email = auth.jwt() ->> 'email' AND role = 'admin'
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM customers WHERE email = auth.jwt() ->> 'email' AND role = 'admin'
  )
);

-- === CATEGORIES ===
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_categories" ON categories
FOR SELECT USING (is_active = true);

CREATE POLICY "admin_manage_categories" ON categories
FOR INSERT, UPDATE, DELETE USING (
  EXISTS (
    SELECT 1 FROM customers WHERE email = auth.jwt() ->> 'email' AND role = 'admin'
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM customers WHERE email = auth.jwt() ->> 'email' AND role = 'admin'
  )
);

-- === SETTINGS ===
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_select_settings" ON settings
FOR SELECT USING (key NOT LIKE '%key%' AND key NOT LIKE '%secret%' AND key NOT LIKE '%password%');

CREATE POLICY "admin_manage_settings" ON settings
FOR INSERT, UPDATE, DELETE USING (
  EXISTS (
    SELECT 1 FROM customers WHERE email = auth.jwt() ->> 'email' AND role = 'admin'
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM customers WHERE email = auth.jwt() ->> 'email' AND role = 'admin'
  )
);

-- === PRODUCTS ===
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_select_active_products" ON products
FOR SELECT USING (is_active = true);

CREATE POLICY "admin_manage_products" ON products
FOR INSERT, UPDATE, DELETE USING (
  EXISTS (
    SELECT 1 FROM customers WHERE email = auth.jwt() ->> 'email' AND role = 'admin'
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM customers WHERE email = auth.jwt() ->> 'email' AND role = 'admin'
  )
);
