# AddPlus

## Overview
A Next.js 15 application with Clerk authentication, Prisma ORM, and PostgreSQL database.

## Tech Stack
- **Framework**: Next.js 15.5.9 with React 19
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Clerk
- **Styling**: Tailwind CSS 4, Radix UI components
- **AI Integration**: AI SDK with OpenRouter
- **Testing**: Vitest (unit), Playwright (e2e)

## Project Structure
```
src/
├── app/           # Next.js App Router pages and layouts
│   ├── api/       # API routes
│   ├── layout.tsx # Root layout with providers
│   └── page.tsx   # Home page
├── lib/           # Utility libraries
prisma/
├── schema.prisma  # Database schema
```

## Environment Variables
Required:
- `DATABASE_URL` - PostgreSQL connection string (auto-configured by Replit)
- Clerk keys are in keyless development mode

## Development
- Run: `npm run dev -- -p 5000 -H 0.0.0.0`
- Database migrations: `npm run db:push`

## Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push Prisma schema to database
- `npm run db:migrate` - Run database migrations
- `npm run test:unit` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
