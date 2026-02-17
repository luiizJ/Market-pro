# 🛒 MarketPro - B2B Enterprise Commerce

> Sistema de abastecimento B2B focado em alta performance, integridade de dados".

![Focus](https://img.shields.io/badge/Focus-Performance_%26_UX-blue)

## 🎯 Sobre o Projeto

O **MarketPro** é uma plataforma desenvolvida para resolver o problema de reposição rápida de estoque para pequenos comércios. Diferente de e-commerces tradicionais, o foco aqui é a agilidade do processo de compra em volume (atacado) e a garantia absoluta de estoque real.

O sistema apresenta uma interface **"Always Dark"**, otimizada para ambientes operacionais, e utiliza uma arquitetura moderna para garantir que **vendas simultâneas** não gerem inconsistências no banco de dados.

## 🚀 Tech Stack & Arquitetura

O projeto foi construído sobre uma arquitetura **Serverless** moderna:

- **Core:** [Next.js 15](https://nextjs.org/) (App Router & Server Actions)
- **Linguagem:** TypeScript
- **Estilização:** TailwindCSS v4 + ShadCN UI
- **Database:** PostgreSQL (via NeonDB Serverless)
- **ORM:** Drizzle ORM (Type-safe SQL queries)
- **State Management:** Zustand (Gerenciamento de carrinho Client-side)
- **Conectividade:** WebSockets (`@neondatabase/serverless`) para suporte a transações.

## ⚡ Diferenciais Técnicos

### 1. Transações ACID & Integridade de Estoque 🔐

Implementação de **Database Transactions** para o processo de checkout.

- **Cenário:** Ao finalizar um pedido, o sistema cria a ordem, insere os itens e subtrai o estoque atomicamente.
- **Resultado:** Se a subtração do estoque falhar (ex: produto esgotou no milissegundo anterior), o pedido inteiro é revertido (Rollback), garantindo zero inconsistência de dados.

### 2. Otimização de UI/UX (Optimistic & Responsive)

- **Responsividade Adaptativa:** O layout transita fluidamente de Mobile (`max-w-md`) para Desktop (`max-w-7xl`), ajustando grids de 2 para até 5 colunas.
- **Feedback Visual:** Uso de `useTransition` e Loaders para feedback imediato em operações de servidor (Server Actions).

### 3. Server Actions & Segurança

Eliminação de API Routes tradicionais em favor de **Server Actions**. Toda a lógica de mutação de dados (Criar Produto, Editar, Deletar) roda exclusivamente no servidor, protegendo a lógica de negócios e chaves de API.

### 4. Integração "Click-to-WhatsApp"

O checkout gera um payload formatado automaticamente e redireciona o cliente para o WhatsApp do vendedor com o resumo estruturado do pedido, facilitando o fechamento B2B.

## 🔧 Como rodar o projeto localmente

Siga os passos abaixo para ter a aplicação rodando na sua máquina:

### Pré-requisitos

- Node.js (v18+)
- NPM ou Yarn
- PostgreSQL (Local ou Docker)

### 1. Clone o repositório

```bash
git clone [https://github.com/luiizJ/Market-pro]
cd Market-pro
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as Variáveis de Ambiente

```bash
Crie um arquivo .env na raiz do projeto baseando-se no .env.example (se houver) ou adicione as seguintes chaves:
DATABASE_URL="postgresql://user:password@host:port/db_name"
```

### 4. Configure o Banco de Dados (Prisma)

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 5. Inicie o Servidor

```bash
npm run dev
Acesse http://localhost:3000 no seu navegador.
```

## 🤝 Contato

- **Luiz Janampa Full-stack Developer**
