-- ============================================
-- VERIFICAÇÃO E CORREÇÃO RÁPIDA
-- Execute este script para diagnosticar e corrigir problemas
-- ============================================

-- 1. VERIFICAR SE A TABELA EXISTE
-- ============================================
SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'order_items'
ORDER BY ordinal_position;

-- 2. SE A TABELA NÃO EXISTIR OU ESTIVER ERRADA, RECRIE
-- ============================================

-- Remover tabela antiga (CUIDADO: Remove todos os dados!)
DROP TABLE IF EXISTS order_items CASCADE;

-- Criar nova tabela
CREATE TABLE order_items (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  order_id BIGINT REFERENCES orders(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. HABILITAR RLS
-- ============================================
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 4. REMOVER TODAS AS POLÍTICAS ANTIGAS
-- ============================================
DO $$ 
DECLARE 
  r RECORD;
BEGIN
  FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'order_items') 
  LOOP
    EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON order_items';
  END LOOP;
END $$;

-- 5. CRIAR POLÍTICAS CORRETAS
-- ============================================

-- SELECT: Usuários veem apenas seus próprios itens
CREATE POLICY "Users can view own cart items"
  ON order_items FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT: Usuários podem adicionar seus próprios itens
CREATE POLICY "Users can insert own cart items"
  ON order_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Usuários podem atualizar seus próprios itens
CREATE POLICY "Users can update own cart items"
  ON order_items FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- DELETE: Usuários podem deletar seus próprios itens
CREATE POLICY "Users can delete own cart items"
  ON order_items FOR DELETE
  USING (auth.uid() = user_id);

-- 6. CRIAR ÍNDICES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_order_items_user_id ON order_items(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_user_cart ON order_items(user_id) WHERE order_id IS NULL;

-- 7. CRIAR TRIGGER PARA updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_order_items_updated_at ON order_items;

CREATE TRIGGER update_order_items_updated_at
  BEFORE UPDATE ON order_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 8. VERIFICAR POLÍTICAS CRIADAS
-- ============================================
SELECT 
  schemaname,
  tablename, 
  policyname, 
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'order_items'
ORDER BY policyname;

-- 9. TESTAR INSERÇÃO (substitua pelo seu user_id e product_id reais)
-- ============================================
-- Comentado para evitar erro, descomente e teste manualmente
/*
INSERT INTO order_items (user_id, product_id, quantity)
VALUES (
  auth.uid(), -- Seu user_id atual
  1, -- ID de um produto existente
  1
);
*/

-- 10. VERIFICAR DADOS
-- ============================================
SELECT * FROM order_items LIMIT 10;

-- ============================================
-- INSTRUÇÕES
-- ============================================
-- 1. Execute este script completo no SQL Editor do Supabase
-- 2. Verifique se não há erros na execução
-- 3. Olhe os resultados das queries de verificação
-- 4. Teste adicionar um produto ao carrinho na aplicação
-- ============================================
