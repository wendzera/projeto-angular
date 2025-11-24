# Sistema de Carrinho e Pedidos - Documentação

## 📦 Estrutura do Banco de Dados

### Tabela: `order_items` (Carrinho de Compras)
Esta tabela funciona como o **carrinho de compras** do usuário.

**Campos:**
- `id`: ID único do item
- `user_id`: ID do usuário (FK para auth.users)
- `product_id`: ID do produto (FK para products)
- `quantity`: Quantidade do produto
- `order_id`: NULL enquanto no carrinho, preenchido quando pedido é finalizado
- `created_at`: Data de criação
- `updated_at`: Data de atualização

### Tabela: `orders` (Pedidos Finalizados)
Esta tabela armazena os **pedidos finalizados**.

**Campos:**
- `id`: ID único do pedido
- `user_id`: ID do usuário
- `total`: Valor total do pedido
- `status`: Status do pedido (pending, completed, etc)
- `customer_name`: Nome do cliente
- `customer_email`: Email do cliente
- `customer_phone`: Telefone
- `customer_address`: Endereço de entrega
- `created_at`: Data de criação
- `updated_at`: Data de atualização

## 🔄 Fluxo de Operações

### 1. Adicionar Produto ao Carrinho
```typescript
await cartService.addToCart(product);
```
- Cria um registro em `order_items` com `order_id = NULL`
- Se o produto já existe no carrinho, incrementa a quantidade
- O item fica "pendente" no carrinho do usuário

### 2. Ver Itens do Carrinho
```sql
SELECT * FROM order_items 
WHERE user_id = '<user_id>' AND order_id IS NULL;
```
- Lista apenas itens sem `order_id` (ainda no carrinho)

### 3. Modificar Quantidade
```typescript
await cartService.incrementQuantity(productId);
await cartService.decrementQuantity(productId);
```
- Atualiza a quantidade do item no carrinho

### 4. Remover do Carrinho
```typescript
await cartService.removeItem(productId);
```
- Delete o registro de `order_items`

### 5. Finalizar Pedido
```typescript
await cartService.finalizeOrder();
```
**O que acontece:**
1. Cria um registro em `orders` com os dados do pedido
2. Atualiza TODOS os itens do carrinho: `SET order_id = <novo_order_id>`
3. Os itens agora estão **associados ao pedido finalizado**
4. O carrinho fica vazio (pois não há mais itens com `order_id = NULL`)

### 6. Ver Histórico de Pedidos
```sql
SELECT o.*, oi.* 
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
WHERE o.user_id = '<user_id>';
```
- Lista pedidos com seus respectivos itens

## 🎯 Benefícios dessa Abordagem

1. **Carrinho Persistente**: O carrinho é salvo no banco, não se perde ao recarregar a página
2. **Histórico Completo**: Todos os itens comprados ficam registrados
3. **Sincronização**: Carrinho sincronizado entre diferentes dispositivos
4. **Auditoria**: Possível rastrear quando cada item foi adicionado ao carrinho
5. **Performance**: Queries eficientes com índices apropriados

## 🔐 Segurança (RLS)

### order_items
- Usuários só podem ver/modificar seus próprios itens
- Políticas baseadas em `auth.uid() = user_id`

### orders
- Usuários autenticados podem criar e ver pedidos
- Em produção, recomenda-se restringir ainda mais

## 📝 Exemplo de Uso Completo

```typescript
// 1. Usuário adiciona produtos ao carrinho
await cartService.addToCart(product1);
await cartService.addToCart(product2);

// 2. Visualiza o carrinho
const items = cartService.items(); // Carregado do banco

// 3. Modifica quantidades
await cartService.incrementQuantity(product1.id);

// 4. Remove um item
await cartService.removeItem(product2.id);

// 5. Finaliza o pedido
await cartService.finalizeOrder();
// Agora os itens estão em order_items com order_id preenchido
// E existe um registro em orders com o pedido

// 6. Carrinho está vazio novamente
const emptyCart = cartService.items(); // []
```

## 🚀 Scripts de Migração

Execute na ordem:

1. **setup-database.sql** - Cria toda a estrutura (primeira vez)
2. **migrate-order-items.sql** - Atualiza a estrutura se já existir

## ⚠️ Observações Importantes

- Sempre verifique se o usuário está autenticado antes de operações no carrinho
- O `order_id = NULL` indica que o item está no carrinho
- O `order_id != NULL` indica que o item faz parte de um pedido finalizado
- Ao finalizar o pedido, NÃO deletamos os itens, apenas associamos ao pedido
