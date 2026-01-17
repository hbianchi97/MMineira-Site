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
- **Category**: Categorias de produtos (Biquinis, Maios, Saidas de Praia, Acessorios, Cangas, Bolsas)
- **Product**: Produtos com preco, imagens, tamanhos, cores, estoque
- **Cart/CartItem**: Carrinho de compras
- **Order/OrderItem**: Pedidos
- **Address**: Enderecos de entrega
- **SiteConfig**: Configuracoes de paginas (imagem, titulo, descricao)
- **Post**: Novidades/noticias do blog
- **ProductView**: Tracking de visualizacoes de produtos para analytics

## Key Features
- Catálogo de produtos com categorias
- Carrinho de compras (SideCart)
- Página de produto com galeria de imagens
- Filtros por tamanho e cor
- Sistema de créditos para recursos AI
- Páginas de login/registro (Clerk)
- Checkout completo com PIX, cartão e boleto
- Painel administrativo protegido (/admin)
- Upload de imagens do computador (Object Storage)
- Dashboard de analytics (produtos mais vendidos/acessados)

## Admin Panel (/admin)
- Visao Geral com estatisticas
- Dashboard de Analytics (/admin/dashboard) com graficos de:
  - Produtos mais vendidos
  - Produtos mais acessados
  - Periodo personalizavel
- CRUD de produtos com upload de imagens
- Gerenciamento de Novidades (posts/noticias)
- Configuracoes do site por pagina (imagem, titulo, descricao)
  - Pagina Inicial (home)
  - Biquinis, Maios, Saidas de Praia
  - Acessorios, Cangas, Bolsas
- Acesso restrito por email (ADMIN_EMAILS env var)

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
- Implemented image upload from computer (Object Storage integration)
- Created Analytics Dashboard with customizable time period
- Added new product categories: Acessorios, Canga de Praia, Bolsas
- Added ProductView model for tracking product views
- Added color palette selection in product modal (20 colors + Estampado/Cor Unica)
- Added shipping options (envio/retirada) for products
- Implemented automatic product view tracking on page access
- Created test data generation endpoint for analytics (/api/admin/seed-analytics)
- Updated admin quick actions button to link to Analytics Dashboard
- Added multi-image support in Site Config (array of images)
- Added total count display in analytics dashboard
- Fixed post detail page layout (button and date side by side)
- Enhanced test data generation with customizable quantity modal
- Added "Zerar Dados" button with confirmation and data logging
- Added shipping method selection in checkout (delivery vs pickup with free shipping)
