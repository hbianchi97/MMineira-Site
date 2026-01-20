# Levantamento de Requisitos - Menina Mineira (Moda Praia)

Este documento descreve os requisitos funcionais, não-funcionais e a arquitetura sugerida para transformar a demonstração técnica da **Menina Mineira** em uma loja virtual completa e pronta para produção.

## 1. Visão Geral
O projeto atual é um e-commerce moderno construído com **Next.js 15, TypeScript, Tailwind CSS, Prisma e Clerk**. Atualmente, ele opera em modo de demonstração (checkout simulado). O objetivo é integrar serviços reais de pagamento e logística para viabilizar vendas reais.

---

## 2. Requisitos Funcionais (O que o sistema deve fazer)

### 2.1. Experiência do Cliente (Storefront)
- **Catálogo Rico:** Exibição de produtos com múltiplas imagens, zoom, e variações claras (Tamanho P/M/G/GG, Cores).
- **Tabela de Medidas (Guia de Tamanhos):** Essencial para moda praia para reduzir trocas. Deve ser acessível na página do produto.
- **Busca e Filtros:** Filtragem por categoria (Biquínis, Maiôs), tamanho, cor e faixa de preço.
- **Carrinho de Compras:** Persistente (salvo no navegador ou conta do usuário) com cálculo de subtotal.
- **Cálculo de Frete Real:** Input de CEP na página do produto e no carrinho para estimativa de prazo e valor.
- **Checkout Transparente:** O cliente não deve sair do site para pagar. Suporte a Cartão de Crédito (com parcelamento) e PIX.
- **Rastreamento de Pedidos:** Página "Meus Pedidos" onde o usuário vê o status (Pago, Em Separação, Enviado + Código de Rastreio).

### 2.2. Gestão (Back-office / Admin)
- **Gestão de Catálogo:** Interface para criar/editar produtos, gerenciar estoque por variação (ex: Biquíni Azul P tem 5 unid, Azul M tem 0).
- **Gestão de Pedidos:** Visualização de novos pedidos, alteração de status, e inserção de código de rastreio.
- **Cupom de Desconto:** Sistema para criar códigos promocionais (ex: `PRIMEIRACOMPRA`, `VERAO10`).
- **Banners e Destaques:** Controle sobre quais produtos aparecem na Home ("Novidades", "Mais Vendidos").

---

## 3. Sugestão de Ferramentas e Stack Tecnológico

Considerando que o projeto já utiliza **Next.js, Prisma e Clerk**, as recomendações abaixo visam manter a coerência técnica e facilitar a implementação.

| Função | Ferramenta Recomendada | Por que? |
| :--- | :--- | :--- |
| **Pagamentos** | **Pagar.me** ou **Stripe** | **Pagar.me:** Líder no Brasil, excelente aceitação de cartões nacionais, PIX nativo e checkout transparente robusto. <br>**Stripe:** Integração mundialmente famosa e fácil, mas taxas podem variar para boletos/pix dependendo da conta. |
| **Frete/Logística** | **Melhor Envio** | Agrega correios (Sedex/PAC) e transportadoras (Jadlog/Azul) com preços competitivos. Possui API fácil para cotação e geração de etiquetas. |
| **E-mails Transacionais** | **Resend** | Moderna, construída para desenvolvedores (SDK incrível para React/Next.js). Perfeita para enviar "Pedido Confirmado", "Senha Recuperada". |
| **Hospedagem de Imagens** | **Vercel Blob** ou **Cloudinary** | **Vercel Blob:** Já configurado no projeto, simples. <br>**Cloudinary:** Opção superior se precisar de otimização automática pesada e transformações de imagem on-the-fly (corte, redimensionamento). |
| **Analytics** | **Vercel Analytics** + **Google Analytics 4** | Vercel para performance técnica (Web Vitals) e GA4 para comportamento do usuário e conversão. |
| **Atendimento** | **Widget WhatsApp** | Link flutuante para o WhatsApp da loja. Indispensável para o público brasileiro tirar dúvidas rápidas. |

---

## 4. Requisitos Não-Funcionais (Qualidade)

- **Performance (Core Web Vitals):** O LCP (Largest Contentful Paint) deve ser baixo. Imagens devem usar formatos modernos (WebP/AVIF) e carregamento lazy.
- **SEO (Search Engine Optimization):** Metadados dinâmicos para cada produto, Sitemap XML automático e URLs amigáveis.
- **Responsividade (Mobile First):** A experiência deve ser perfeita no celular, onde ocorre a maioria das compras de moda.
- **Segurança:** Dados sensíveis de pagamento não passam pelo nosso banco (vão direto para o Gateway). Validação de dados com Zod no backend.

---

## 5. Análise do Código Atual e Próximos Passos

### 5.1. Limpeza de Esquema (Schema Cleanup)
O arquivo `schema.prisma` atual contém tabelas herdadas de um template SaaS que não fazem sentido para um e-commerce de moda praia puro.
- **Remover:** `CreditBalance`, `UsageHistory`, `Plan`, `Feature`, `SubscriptionEvent`, `AdminSettings` (se for focado em custos de feature).
- **Manter/Expandir:** `Product`, `Category`, `Order`, `User`, `Cart`, `Address`.

### 5.2. Plano de Execução
1.  **Limpeza:** Remover código morto (SaaS features).
2.  **Integração de Pagamento:** Substituir a simulação atual pela API do Pagar.me ou Stripe.
3.  **Integração de Frete:** Implementar consulta de CEP via Melhor Envio na página do produto.
4.  **Admin Dashboard:** Criar páginas protegidas (`/admin`) para gestão de produtos e pedidos (atualmente parece não existir interface visual completa para isso).

---

**Conclusão:** A base técnica (Next.js 15 + Prisma) é sólida. O foco agora deve ser remover as funcionalidades "demo/SaaS" e conectar as APIs reais de logística e pagamento brasileiras.
