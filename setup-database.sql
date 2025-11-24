-- ============================================
-- SCRIPT DE CONFIGURAÇÃO DO BANCO DE DADOS
-- Projeto: Angular Supabase Dashboard
-- ============================================

-- 1. CRIAR A TABELA PRODUCTS
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  "imageUrl" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- 2. HABILITAR ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 3. CRIAR POLÍTICA DE SEGURANÇA
-- ============================================
-- Esta política permite todas as operações para todos os usuários
-- ATENÇÃO: Em produção, ajuste conforme suas regras de negócio!

-- Política para SELECT (leitura)
CREATE POLICY "Enable read access for all users" ON products
  FOR SELECT USING (true);

-- Política para INSERT (inserção)
CREATE POLICY "Enable insert access for all users" ON products
  FOR INSERT WITH CHECK (true);

-- Política para UPDATE (atualização)
CREATE POLICY "Enable update access for all users" ON products
  FOR UPDATE USING (true);

-- Política para DELETE (exclusão)
CREATE POLICY "Enable delete access for all users" ON products
  FOR DELETE USING (true);

-- 4. INSERIR DADOS DE TESTE (OPCIONAL)
-- ============================================
INSERT INTO products (name, description, price, "imageUrl") VALUES
  ('Notebook Dell Inspiron', 'Intel Core i7, 16GB RAM, 512GB SSD', 4500.00, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400'),
  ('Mouse Logitech MX Master 3', 'Mouse sem fio ergonômico', 450.00, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400'),
  ('Teclado Mecânico RGB', 'Switches Cherry MX Blue', 650.00, 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=400'),
  ('Monitor LG 27" 4K', 'IPS, HDR10, 60Hz', 2200.00, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400'),
  ('Webcam Logitech C920', 'Full HD 1080p com microfone', 350.00, 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400'),
  ('Fone de Ouvido Sony', 'Bluetooth, Cancelamento de ruído', 890.00, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'),
  ('SSD Samsung 1TB', 'NVMe M.2, Leitura 3500MB/s', 550.00, 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400'),
  ('Cadeira Gamer', 'Ergonômica, ajuste de altura', 1200.00, 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400');

-- 5. VERIFICAR OS DADOS
-- ============================================
SELECT * FROM products ORDER BY "createdAt" DESC;

-- ============================================
-- 6. CRIAR A TABELA ORDERS
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  customer_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CRIAR A TABELA ORDER_ITEMS (CARRINHO DE COMPRAS)
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  order_id BIGINT REFERENCES orders(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. HABILITAR RLS PARA ORDERS
-- ============================================
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Política para SELECT (leitura) - usuários autenticados podem ver pedidos
CREATE POLICY "Authenticated users can view orders" ON orders
  FOR SELECT USING (auth.role() = 'authenticated');

-- Política para INSERT (inserção) - usuários autenticados podem criar pedidos
CREATE POLICY "Authenticated users can create orders" ON orders
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Política para UPDATE (atualização) - usuários autenticados podem atualizar pedidos
CREATE POLICY "Authenticated users can update orders" ON orders
  FOR UPDATE USING (auth.role() = 'authenticated');

-- 9. HABILITAR RLS PARA ORDER_ITEMS
-- ============================================
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Política para SELECT (leitura) - usuários veem apenas seus próprios itens
CREATE POLICY "Users can view their own cart items" ON order_items
  FOR SELECT USING (auth.uid() = user_id);

-- Política para INSERT (inserção) - usuários podem adicionar seus próprios itens
CREATE POLICY "Users can create their own cart items" ON order_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política para UPDATE (atualização) - usuários podem atualizar seus próprios itens
CREATE POLICY "Users can update their own cart items" ON order_items
  FOR UPDATE USING (auth.uid() = user_id);

-- Política para DELETE (exclusão) - usuários podem excluir seus próprios itens
CREATE POLICY "Users can delete their own cart items" ON order_items
  FOR DELETE USING (auth.uid() = user_id);

-- 10. CRIAR ÍNDICES PARA MELHOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_user_id ON order_items(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- 11. FUNÇÃO PARA ATUALIZAR updated_at AUTOMATICAMENTE
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_order_items_updated_at
  BEFORE UPDATE ON order_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INSTRUÇÕES DE USO
-- ============================================
-- 1. Acesse o painel do Supabase: https://supabase.com/dashboard
-- 2. Selecione seu projeto: zvvfhxsjqwarskvhusjw
-- 3. Vá em "SQL Editor" no menu lateral
-- 4. Cole e execute este script
-- 5. Volte para a aplicação Angular e recarregue a página
-- 
-- URL: https://zvvfhxsjqwarskvhusjw.supabase.co
-- ============================================
