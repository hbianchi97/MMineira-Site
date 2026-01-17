# Menina Mineira - E-commerce de Moda Praia

## Overview
E-commerce de roupas de praia com foco em biquínis, maiôs e saídas de praia. Marca baseada no Rio de Janeiro com foco em estampas exclusivas.

## Tech Stack
- **Framework**: Next.js 15.5.9 com React 19
- **Language**: TypeScript
- **Database**: PostgreSQL com Prisma ORM
- **Authentication**: Clerk
- **Styling**: Tailwind CSS 4, Radix UI
- **State Management**: TanStack Query, React Hook Form
- **AI Integration**: AI SDK com OpenRouter (para chat de atendimento)

## Project Structure
```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── categoria/[slug]/  # Página de categoria
│   ├── produto/[slug]/    # Página de produto
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   ├── layout/            # Header, Footer
│   ├── shop/              # ProductCard, CartContext, SideCart
│   ├── ui/                # Base UI components
│   └── providers/         # Context providers
├── lib/
│   ├── brand-config.ts    # Configuração da marca
│   ├── shop-data.ts       # Funções de dados de produtos
│   ├── db.ts              # Prisma client
│   └── utils.ts           # Utilities
prisma/
├── schema.prisma          # Database schema (Category, Product, Order, Cart, etc.)
```

## E-commerce Models
- **Category**: Categorias de produtos (Biquinis, Maios, Saidas de Praia)
- **Product**: Produtos com preco, imagens, tamanhos, cores, estoque
- **Cart/CartItem**: Carrinho de compras
- **Order/OrderItem**: Pedidos
- **Address**: Enderecos de entrega
- **SiteConfig**: Configuracoes de paginas (imagem, titulo, descricao)
- **Post**: Novidades/noticias do blog

## Key Features
- Catálogo de produtos com categorias
- Carrinho de compras (SideCart)
- Página de produto com galeria de imagens
- Filtros por tamanho e cor
- Sistema de créditos para recursos AI
- Páginas de login/registro (Clerk)
- Checkout completo com PIX, cartão e boleto
- Painel administrativo protegido (/admin)

## Admin Panel (/admin)
- Dashboard com estatisticas
- CRUD de produtos
- Gerenciamento de Novidades (posts/noticias)
- Configuracoes do site por pagina (imagem, titulo, descricao)
  - Pagina Inicial (home)
  - Biquinis
  - Maios
  - Saidas de Praia
- Acesso restrito por email (admin@meninamineira.com.br)

## Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:push` - Push Prisma schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Populate database with sample data

## Environment Variables
- `DATABASE_URL` - PostgreSQL connection (auto-configured by Replit)
- `NEXT_PUBLIC_APP_URL` - Public URL
- Clerk keys - Authentication (keyless mode available)

## User Preferences
- Portuguese (Brazilian) language
- Prices in BRL (centavos)
- Sizes: P, M, G, GG

## Recent Changes
- Initial setup on Replit environment
- Database synchronized with e-commerce schema
- Added seed script with categories and products
- Created login/signup pages with Clerk (custom styling)
- Created complete checkout page with address form and payment options
- Created admin panel with products management and site settings
- Added server-side authorization for admin APIs
- Added SiteConfig model for dynamic page content
- Added Post model for news/blog functionality
- Created admin page for site configurations (per page)
- Created admin page for managing posts/novidades
- Created public /novidades page with post listing
- Created post detail page at /novidades/[slug]
- Pages now use dynamic content from database
