# 👙 Menina Mineira - E-commerce de Moda Praia

Bem-vindo ao repositório da **Menina Mineira**, uma plataforma de e-commerce moderna e performática especializada em moda praia. Este projeto foi desenvolvido com foco total na experiência do usuário (UX), conversão e estética, unindo a praticidade da compra online com a identidade visual acolhedora da marca.

> **⚠️ AVISO IMPORTANTE:**
> Este projeto é uma demonstração técnica. **Não há integração real com APIs de pagamento (como Stripe/Pagar.me) ou APIs de correios (como Melhor Envio).**
> - O cálculo de frete é **simulado** com valores fixos ou lógica interna.
> - O checkout é **transparente e simulado**, não processando cobranças reais.

---

## 🎯 Objetivos e Soluções

O objetivo principal foi substituir o front-end legado por uma aplicação web de elite, garantindo:
- **Alta Conversão:** Interface intuitiva e processo de compra simplificado.
- **Performance:** Carregamento rápido (Mobile-First) para atender ao público que vem das redes sociais (Instagram/TikTok).
- **Segurança:** Autenticação robusta para transmitir confiança.
- **Identidade de Marca:** Design "Mineiro" (acolhedor e detalhista) aplicado ao nicho praia.

### Soluções Implementadas
- **UX de Elite:** Navegação fluida por categorias, filtros eficientes e carrinho lateral (Side Cart) para compra rápida.
- **Autenticação Simplificada:** Login social (Google, Apple, etc.) e gestão de usuários via **Clerk**, eliminando fricção no acesso.
- **Infraestrutura Escalável:** Banco de dados e serviços orquestrados via **Docker** para paridade entre desenvolvimento e produção.
- **Gestão Completa:** Painel administrativo para controle de estoque, pedidos e variações de produtos (tamanho, cor).

---

## 🛠️ Tecnologias Utilizadas

Este projeto utiliza um stack moderno e robusto para garantir performance e manutenibilidade:

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Estilização:** [Tailwind CSS 4](https://tailwindcss.com/) & [Radix UI](https://www.radix-ui.com/)
- **Animações:** [Framer Motion](https://www.framer.com/motion/)
- **Banco de Dados:** [PostgreSQL](https://www.postgresql.org/) com [Prisma ORM](https://www.prisma.io/)
- **Autenticação:** [Clerk](https://clerk.com/)
- **Gerenciamento de Estado:** [TanStack Query](https://tanstack.com/query/latest)
- **Validação:** [Zod](https://zod.dev/) & [React Hook Form](https://react-hook-form.com/)
- **Infraestrutura:** [Docker](https://www.docker.com/) (para Banco de Dados)

---

## 🚀 Funcionalidades Principais

### Para o Cliente (Storefront)
- **Catálogo Visual:** Grade de produtos com hover de imagens e filtros instantâneos.
- **Busca Inteligente:** Sugestões em tempo real.
- **Checkout Otimizado:** Carrinho lateral e fluxo de pagamento sem distrações.
- **Área do Usuário:** Acompanhamento de pedidos e status.

### Para o Administrador (Back-office)
- **Dashboard:** Visão geral de vendas e métricas.
- **Gestão de Produtos:** Cadastro de itens com múltiplas variações (P, M, G, Cores).
- **Controle de Estoque:** Baixa automática e gestão de pedidos.

---

## 📦 Como Rodar o Projeto

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/hbianchi97/MMineira-Site.git
    cd MMineira-Site
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    # ou
    pnpm install
    ```

3.  **Configure o ambiente:**
    - Crie um arquivo `.env` baseado no `.env.example`.
    - Configure as chaves do Clerk e a URL do Banco de Dados.

4.  **Suba o Banco de Dados (Docker):**
    ```bash
    npm run db:docker
    ```

5.  **Execute as migrações do Prisma:**
    ```bash
    npm run db:migrate
    ```

6.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

Acesse `http://localhost:3000` para ver a aplicação.
