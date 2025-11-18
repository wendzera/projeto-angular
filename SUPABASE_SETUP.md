# 🚀 Guia de Configuração do Supabase

## ✅ Status das Configurações

### 1. Variáveis de Ambiente - ✅ CONFIGURADO

Seus arquivos já estão com as credenciais corretas:

```typescript
URL: https://zvvfhxsjqwarskvhusjw.supabase.co
Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (anon key)
```

**Arquivos configurados:**
- ✅ `src/environments/environment.ts`
- ✅ `src/environments/environment.development.ts`
- ✅ `src/environments/environment.prod.ts`

---

## 📊 Próximo Passo: Configurar o Banco de Dados

### Passo 1: Acessar o SQL Editor

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto: **zvvfhxsjqwarskvhusjw**
3. No menu lateral, clique em **SQL Editor** (ícone ⚡)

### Passo 2: Criar a Tabela Products

Copie e cole este SQL no editor:

```sql
-- CRIAR TABELA DE PRODUTOS
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  "imageUrl" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- HABILITAR ROW LEVEL SECURITY
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS DE ACESSO (PERMITIR TUDO - DESENVOLVIMENTO)
CREATE POLICY "Enable read access for all users" ON products
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON products
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON products
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON products
  FOR DELETE USING (true);

-- INSERIR PRODUTOS DE EXEMPLO
INSERT INTO products (name, description, price, "imageUrl") VALUES
  ('Notebook Dell Inspiron', 'Intel Core i7, 16GB RAM, 512GB SSD', 4500.00, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400'),
  ('Mouse Logitech MX Master 3', 'Mouse sem fio ergonômico', 450.00, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400'),
  ('Teclado Mecânico RGB', 'Switches Cherry MX Blue', 650.00, 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=400'),
  ('Monitor LG 27" 4K', 'IPS, HDR10, 60Hz', 2200.00, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400'),
  ('Webcam Logitech C920', 'Full HD 1080p com microfone', 350.00, 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400'),
  ('Fone de Ouvido Sony', 'Bluetooth, Cancelamento de ruído', 890.00, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'),
  ('SSD Samsung 1TB', 'NVMe M.2, Leitura 3500MB/s', 550.00, 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=400'),
  ('Cadeira Gamer', 'Ergonômica, ajuste de altura', 1200.00, 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400');
```

### Passo 3: Executar o Script

1. Clique no botão **"Run"** (ou pressione `Ctrl + Enter`)
2. Aguarde a mensagem: **"Success. No rows returned"**
3. ✅ Pronto! Banco configurado!

---

## 🔍 Verificar se Funcionou

### Método 1: Table Editor

1. No Supabase Dashboard, clique em **Table Editor**
2. Selecione a tabela **products**
3. Você deve ver os 8 produtos de exemplo

### Método 2: SQL Query

Execute no SQL Editor:

```sql
SELECT * FROM products ORDER BY "createdAt" DESC;
```

Deve retornar 8 produtos.

---

## 🧪 Testar na Aplicação

1. Certifique-se que o servidor está rodando:
   ```powershell
   npm start
   ```

2. Acesse: http://localhost:4200/

3. Faça login ou registre-se

4. Vá para a página de **Produtos**

5. ✅ Você deve ver a lista de produtos do banco!

---

## 🔐 Sobre as Chaves

Você mencionou duas chaves diferentes:

### 🔑 Publishable Key (que você forneceu)
```
sb_publishable_KKL5iMVG4Yg_bZmkd92OFw_2RcqhpcO
```
- Esta é usada para **Realtime** e **Storage**
- **NÃO** é usada para o cliente JavaScript

### 🔑 Anon Key (já configurada no código)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
- Esta é a que o código Angular usa
- Já está configurada corretamente ✅

**Você não precisa mudar nada!** As chaves corretas já estão no código.

---

## 🛠️ Se Algo Não Funcionar

### Erro: "relation products does not exist"
**Solução:** Execute o script SQL acima para criar a tabela

### Erro: "JWT expired" ou "Invalid API key"
**Solução:** Verifique se copiou a anon key correta do dashboard

### Erro: "new row violates row-level security policy"
**Solução:** Execute as políticas RLS do script acima

### Erro de CORS
**Solução:** No Supabase, vá em Settings → API → "Allow headers" e adicione `*`

---

## 📋 Checklist de Configuração

- [x] URL do Supabase configurada
- [x] Anon Key configurada
- [ ] Tabela `products` criada (execute o SQL acima)
- [ ] Políticas RLS configuradas (no SQL acima)
- [ ] Produtos de exemplo inseridos (no SQL acima)
- [ ] Aplicação testada

---

## 🎯 Próximos Passos

Após executar o SQL:

1. **Teste o Registro:** Crie uma conta com email real
2. **Teste Login:** Faça login com a conta criada
3. **Veja Produtos:** Navegue até `/products`
4. **Adicione Produto:** Clique em "Adicionar Produto"
5. **Teste Carrinho:** Adicione produtos ao carrinho
6. **Finalize Compra:** Teste o fluxo completo

---

## 💡 Dicas

### Para Adicionar Mais Produtos

```sql
INSERT INTO products (name, description, price, "imageUrl")
VALUES ('Nome do Produto', 'Descrição', 99.90, 'url-da-imagem');
```

### Para Ver Usuários Cadastrados

```sql
SELECT * FROM auth.users;
```

### Para Limpar Produtos de Teste

```sql
DELETE FROM products WHERE id > 0;
```

---

## 🚀 Tudo Pronto!

**Sua aplicação está configurada e pronta para usar!**

1. ✅ Credenciais do Supabase configuradas
2. ⏳ Aguardando criação da tabela (execute o SQL acima)
3. 🎉 Depois é só usar!

**Execute o SQL agora e teste a aplicação!** 🚀

---

**Precisa de ajuda?** Verifique:
- Console do navegador (F12) para erros JavaScript
- Network tab para ver chamadas ao Supabase
- Logs no Supabase Dashboard → Logs
