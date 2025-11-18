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
