# 🌿 Angular Supabase CRUD com Autenticação

Dashboard moderno de gerenciamento de produtos com Angular 17, Supabase e autenticação completa.

## 🚀 Tecnologias

Angular 17 • Angular Material • Supabase • TypeScript • RxJS

## ⚡ Início Rápido

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm start
```

Acesse: `http://localhost:4200`

## 🔐 Configuração de Autenticação

### 1. Configurar Banco de Dados

Execute no SQL Editor do Supabase:

```sql
-- Criar tabela de produtos
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  "imageUrl" TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir operações apenas para usuários autenticados
CREATE POLICY "Authenticated users can do everything" 
ON products FOR ALL 
USING (auth.role() = 'authenticated');
```

### 2. Criar Usuário de Teste

No painel do Supabase:
1. Vá em **Authentication** → **Users**
2. Clique em **Add user** → **Create new user**
3. Adicione email e senha para teste
4. Use essas credenciais para fazer login

## ✨ Funcionalidades

✅ **Autenticação completa** (login/logout)  
✅ **Proteção de rotas** com Guards  
✅ **CRUD completo** de produtos  
✅ **Upload de imagens** via URL  
✅ **Preview em tempo real**  
✅ **Interface moderna** com Material Design  
✅ **Design responsivo**  
✅ **Paleta verde moderna**  
✅ **Animações suaves**  
✅ **Confirmação antes de excluir**

## 🎨 Paleta de Cores

- **Primary Green**: `#10b981`
- **Dark Green**: `#059669`
- **Light Green**: `#34d399`
- **Accent**: `#6ee7b7`
- **Background**: `#f0fdf4`

## 📦 Estrutura do Projeto

```
src/
├── app/
│   ├── auth/
│   │   └── login/          # Componente de login
│   ├── guards/
│   │   └── auth.guard.ts   # Proteção de rotas
│   ├── home/               # Dashboard principal
│   ├── products/           # Lista de produtos
│   ├── product-dialog/     # Dialog para add/edit
│   ├── services/
│   │   └── supabase.service.ts  # Serviço principal
│   └── models/
│       └── product.ts      # Interface do produto
└── environments/           # Configurações do Supabase
```

## 🔒 Segurança

- Row Level Security (RLS) habilitado
- Autenticação obrigatória para acessar recursos
- Guards protegendo todas as rotas principais
- Sessões gerenciadas automaticamente

## 📱 Screenshots

### Login
Interface moderna com gradiente verde e validação de campos.

### Dashboard
Página inicial com cards interativos e botão de logout.

### Produtos
Tabela completa com operações CRUD e imagens dos produtos.

## 🛠️ Scripts Disponíveis

```bash
npm start          # Inicia o servidor de desenvolvimento
npm run build      # Build para produção
npm test           # Executa testes
npm run lint       # Verifica código com ESLint
```

## 📝 Licença

MIT

---

Desenvolvido com 💚 usando Angular e Supabase
