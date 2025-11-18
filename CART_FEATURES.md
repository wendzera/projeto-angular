# 🛒 Sistema de E-Commerce - Angular + Supabase

Sistema completo de e-commerce com carrinho de compras, gerenciamento de produtos e cálculo de frete.

## 📋 Funcionalidades Implementadas

### 📱 1. Tela de Listagem de Produtos

A tela de produtos (`/products`) exibe:

- ✅ **Lista completa de produtos** com imagem, nome, descrição e preço
- ✅ **Botão Editar** - Abre dialog para editar produto
- ✅ **Botão Excluir** - Remove produto com confirmação
- ✅ **Botão "Adicionar ao carrinho"** (ícone shopping_cart)
  - Se produto NÃO está no carrinho → adiciona com quantidade = 1
  - Se produto JÁ está no carrinho → incrementa quantidade
- ✅ **Badge no carrinho** - Mostra quantidade total de itens

### 🛒 2. Tela do Carrinho

A tela do carrinho (`/cart`) apresenta:

- ✅ **Lista de itens adicionados** com:
  - Imagem do produto
  - Nome e descrição
  - Preço unitário
  - Quantidade
  - **Total parcial** (preço × quantidade)

### 💰 3. Total Geral

Ao final da tela do carrinho:

- ✅ **Subtotal** - Soma de todos os totais parciais
- ✅ **Frete** - Calculado com base no CEP e valor
- ✅ **Total Geral** - Subtotal + Frete

### ➕➖ 4. Incrementar / Decrementar Quantidade

Para cada item no carrinho:

- ✅ **Botão "+"** (add)
  - Aumenta quantidade
  - Recalcula total parcial automaticamente
  - Atualiza total geral em tempo real
  
- ✅ **Botão "−"** (remove)
  - Diminui quantidade
  - **Não permite valores < 1**
  - Recalcula totais automaticamente

### 🗑️ 5. Remover Item do Carrinho

Cada item possui:

- ✅ **Botão com ícone delete** (Material Icons)
- ✅ Remove item individual com confirmação
- ✅ Atualiza lista imediatamente
- ✅ Recalcula total geral automaticamente

### 📦 6. Cálculo de Frete por CEP

Sistema de frete inteligente:

- ✅ **Campo de entrada para CEP**
- ✅ Formato automático: `12345-678`
- ✅ **Regra de frete grátis:**
  - Valor da compra ≥ R$ 100,00 → **FRETE GRÁTIS**
  - Valor da compra < R$ 100,00 → **R$ 15,00**
- ✅ Total atualizado automaticamente ao informar CEP

### ✅ 7. Resumo e Confirmação do Pedido

Antes de finalizar, um **dialog de confirmação** é exibido com:

- ✅ **Lista completa de itens** com quantidades e valores
- ✅ **Informações de entrega** (CEP formatado)
- ✅ **Resumo financeiro:**
  - Subtotal
  - Frete (com indicação visual de "GRÁTIS")
  - Total final
- ✅ **Três opções de ação:**
  1. **Confirmar Pedido** - Finaliza a compra
  2. **Continuar Comprando** - Volta para lista de produtos
  3. **Cancelar** - Fecha o dialog sem fazer nada

## 🏗️ Arquitetura

### Componentes Criados

```
src/app/
├── models/
│   ├── product.ts                    # Interface do Produto
│   └── cart-item.ts                  # Interface do Item do Carrinho e Pedido
├── services/
│   ├── supabase.service.ts           # Serviço de autenticação e produtos
│   └── cart.service.ts               # ✨ Serviço de gerenciamento do carrinho
├── products/
│   ├── products.component.ts         # 🔄 Atualizado com botão de adicionar ao carrinho
│   ├── products.component.html       # 🔄 Badge do carrinho e botões
│   └── products.component.css        # 🔄 Estilos para botão do carrinho
├── cart/
│   ├── cart.component.ts             # ✨ Novo - Tela do carrinho
│   ├── cart.component.html           # ✨ Novo - UI do carrinho
│   └── cart.component.css            # ✨ Novo - Estilos do carrinho
└── order-summary-dialog/
    ├── order-summary-dialog.component.ts    # ✨ Novo - Dialog de confirmação
    ├── order-summary-dialog.component.html  # ✨ Novo - UI do resumo
    └── order-summary-dialog.component.css   # ✨ Novo - Estilos do resumo
```

### CartService - Gerenciamento de Estado

O `CartService` utiliza **Angular Signals** para reatividade:

```typescript
- cartItems: Signal<CartItem[]>       // Lista de itens
- subtotal: Computed                   // Subtotal calculado
- freight: Computed                    // Frete calculado
- total: Computed                      // Total calculado
- itemCount: Computed                  // Quantidade total de itens
```

**Métodos principais:**
- `addToCart(product)` - Adiciona ou incrementa produto
- `incrementQuantity(productId)` - Aumenta quantidade
- `decrementQuantity(productId)` - Diminui quantidade (mín: 1)
- `removeItem(productId)` - Remove item
- `setCep(cep)` - Define CEP para cálculo de frete
- `clearCart()` - Limpa carrinho após finalização

## 🎨 Interface do Usuário

### Material Design Components Utilizados

- `MatButtonModule` - Botões
- `MatIconModule` - Ícones (Material Icons)
- `MatBadgeModule` - Badge de contagem no carrinho
- `MatCardModule` - Cards para itens e resumos
- `MatFormFieldModule` - Campos de formulário
- `MatInputModule` - Inputs de texto
- `MatDividerModule` - Divisores visuais
- `MatDialogModule` - Dialog de confirmação
- `MatTableModule` - Tabela de produtos

### Destaques Visuais

✅ **Badge no botão do carrinho** - Mostra quantidade de itens
✅ **Ícone "GRÁTIS"** verde quando frete é gratuito
✅ **Totais em tempo real** - Atualização instantânea
✅ **Confirmação de ações** - Dialogs para exclusões
✅ **Responsivo** - Design adaptável para mobile

## 🚀 Como Executar

### Pré-requisitos

- Node.js (v18+)
- Angular CLI (v17+)
- Conta Supabase configurada

### Instalação

```powershell
# Instalar dependências
npm install

# Configurar variáveis de ambiente
# Editar src/environments/environment.ts com suas credenciais Supabase

# Executar servidor de desenvolvimento
npm start
```

Acesse: `http://localhost:4200`

## 📊 Fluxo de Uso

1. **Login/Registro** → Autentica no sistema
2. **Home** → Dashboard principal
3. **Produtos** → Lista produtos disponíveis
4. **Adicionar ao Carrinho** → Clique no ícone 🛒
5. **Ver Carrinho** → Badge mostra quantidade, clique no botão "Carrinho"
6. **Ajustar Quantidades** → Use botões +/- em cada item
7. **Informar CEP** → Digite CEP para calcular frete
8. **Finalizar Compra** → Revise resumo e confirme
9. **Pedido Concluído** → Carrinho limpo automaticamente

## 🔐 Regras de Negócio

### Carrinho
- ✅ Quantidade mínima: 1 unidade
- ✅ Adicionar produto existente: incrementa quantidade
- ✅ Valores calculados em tempo real

### Frete
- ✅ Obrigatório informar CEP antes de finalizar
- ✅ Grátis para compras ≥ R$ 100,00
- ✅ R$ 15,00 para compras < R$ 100,00

### Pedido
- ✅ Dialog de confirmação obrigatório
- ✅ 3 opções: Confirmar, Continuar Comprando, Cancelar
- ✅ Carrinho limpo após confirmação

## 🛠️ Tecnologias Utilizadas

- **Angular 17** - Framework principal
- **Angular Material** - Componentes UI
- **Supabase** - Backend e autenticação
- **TypeScript** - Linguagem
- **RxJS** - Programação reativa
- **Angular Signals** - Gerenciamento de estado reativo

## ✨ Diferenciais Implementados

✅ **Estado reativo** com Angular Signals
✅ **Cálculos automáticos** de totais
✅ **UI/UX profissional** com Material Design
✅ **Validações completas** em todas as ações
✅ **Feedback visual** constante para o usuário
✅ **Código modular** e reutilizável
✅ **TypeScript strict** para segurança de tipos

---

## 📝 Notas de Desenvolvimento

### CartService

O serviço utiliza **computed signals** para garantir que os valores sejam recalculados automaticamente sempre que o estado do carrinho mudar:

```typescript
subtotal = computed(() => {
  return this.cartItems().reduce((sum, item) => 
    sum + (item.product.price * item.quantity), 0
  );
});
```

### Frete Dinâmico

A lógica de frete verifica:
1. Se CEP foi informado
2. Se subtotal ≥ R$ 100 → frete = 0
3. Caso contrário → frete = R$ 15

### Persistência

Atualmente o carrinho é mantido em memória. Para persistência:
- Adicionar localStorage
- Ou criar tabela `carts` no Supabase
- Ou usar IndexedDB

## 📧 Contato

Desenvolvido para atender todos os requisitos do sistema de e-commerce.

---

**Status:** ✅ Todos os requisitos implementados e funcionais!
