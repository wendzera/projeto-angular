-- ============================================
-- VERIFICAR ITENS DO CARRINHO E PEDIDOS
-- Execute estas queries para ver o que está no banco
-- ============================================

-- 1. VER TODOS OS ITENS DE ORDER_ITEMS
-- ============================================
SELECT 
  oi.id,
  oi.user_id,
  oi.product_id,
  p.name as product_name,
  oi.quantity,
  oi.order_id,
  CASE 
    WHEN oi.order_id IS NULL THEN '🛒 NO CARRINHO'
    ELSE '✅ PEDIDO FINALIZADO'
  END as status,
  oi.created_at
FROM order_items oi
JOIN products p ON oi.product_id = p.id
ORDER BY oi.created_at DESC;

-- 2. VER APENAS ITENS NO CARRINHO (order_id = NULL)
-- ============================================
SELECT 
  oi.id,
  oi.user_id,
  p.name as product_name,
  oi.quantity,
  oi.created_at
FROM order_items oi
JOIN products p ON oi.product_id = p.id
WHERE oi.order_id IS NULL
ORDER BY oi.created_at DESC;

-- 3. VER PEDIDOS COM SEUS ITENS
-- ============================================
SELECT 
  o.id as order_id,
  o.customer_name,
  o.total,
  o.status,
  o.created_at as order_date,
  oi.id as item_id,
  p.name as product_name,
  oi.quantity,
  p.price
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
LEFT JOIN products p ON oi.product_id = p.id
ORDER BY o.created_at DESC, oi.id;

-- 4. CONTAR ITENS POR STATUS
-- ============================================
SELECT 
  CASE 
    WHEN order_id IS NULL THEN 'No Carrinho'
    ELSE 'Em Pedido'
  END as status,
  COUNT(*) as quantidade
FROM order_items
GROUP BY CASE WHEN order_id IS NULL THEN 'No Carrinho' ELSE 'Em Pedido' END;

-- 5. VER CARRINHO DE UM USUÁRIO ESPECÍFICO
-- ============================================
-- Substitua 'SEU_USER_ID_AQUI' pelo ID do seu usuário
/*
SELECT 
  oi.id,
  p.name as product_name,
  oi.quantity,
  p.price,
  (oi.quantity * p.price) as total_item
FROM order_items oi
JOIN products p ON oi.product_id = p.id
WHERE oi.user_id = 'SEU_USER_ID_AQUI'
  AND oi.order_id IS NULL
ORDER BY oi.created_at;
*/

-- 6. LIMPAR TODOS OS ITENS DO CARRINHO (SEM PEDIDO)
-- ============================================
-- CUIDADO: Isso vai deletar todos os itens que estão no carrinho
-- Descomente apenas se quiser limpar tudo
/*
DELETE FROM order_items WHERE order_id IS NULL;
*/

-- 7. VER HISTÓRICO COMPLETO DE UM USUÁRIO
-- ============================================
-- Substitua 'SEU_USER_ID_AQUI' pelo ID do seu usuário
/*
SELECT 
  'Carrinho' as tipo,
  NULL as order_id,
  p.name as product_name,
  oi.quantity,
  p.price,
  oi.created_at
FROM order_items oi
JOIN products p ON oi.product_id = p.id
WHERE oi.user_id = 'SEU_USER_ID_AQUI' AND oi.order_id IS NULL

UNION ALL

SELECT 
  'Pedido' as tipo,
  o.id as order_id,
  p.name as product_name,
  oi.quantity,
  p.price,
  o.created_at
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
WHERE o.user_id = 'SEU_USER_ID_AQUI'

ORDER BY created_at DESC;
*/

-- ============================================
-- INSTRUÇÕES
-- ============================================
-- 1. Execute as queries 1 a 4 para ver o estado atual
-- 2. Verifique se os itens têm order_id NULL (carrinho) ou preenchido (pedido)
-- 3. Após finalizar um pedido, execute novamente para ver a mudança
-- ============================================
