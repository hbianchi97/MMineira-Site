---
status: unfilled
generated: 2026-01-17
---

# Architecture Notes

Describe how the system is assembled and why the current design exists.

## System Architecture Overview

Summarize the top-level topology (monolith, modular service, microservices) and deployment model. Highlight how requests traverse the system and where control pivots between layers.

## Architectural Layers
### Utils
Shared utilities and helpers
- **Directories**: `src/lib`
- **Symbols**: 1 total, 1 exported
- **Key exports**:
  - [`cn`](src/lib/utils.ts#L4) (function)

### Controllers
Request handling and routing
- **Directories**: `src/lib`, `src/app/api/health`, `src/app/api/webhooks/clerk`
- **Symbols**: 5 total, 5 exported
- **Key exports**:
  - [`ApiError`](src/lib/api-errors.ts#L4) (class)
  - [`handleApiError`](src/lib/api-errors.ts#L14) (function)
  - [`apiClient`](src/lib/api-client.ts#L3) (function)
  - [`GET`](src/app/api/health/route.ts#L4) (function)
  - [`POST`](src/app/api/webhooks/clerk/route.ts#L6) (function)

### Components
UI components and views
- **Directories**: `src/app`
- **Symbols**: 1 total, 1 exported
- **Key exports**:
  - [`Home`](src/app/page.tsx#L1) (function)


## Detected Design Patterns
- *No design patterns detected yet.*

## Entry Points
- *No entry points detected.*

## Public API
| Symbol | Type | Location |
| --- | --- | --- |
| [`apiClient`](src/lib/api-client.ts#L3) | function | src/lib/api-client.ts:3 |
| [`ApiError`](src/lib/api-errors.ts#L4) | class | src/lib/api-errors.ts:4 |
| [`cn`](src/lib/utils.ts#L4) | function | src/lib/utils.ts:4 |
| [`GET`](src/app/api/health/route.ts#L4) | function | src/app/api/health/route.ts:4 |
| [`handleApiError`](src/lib/api-errors.ts#L14) | function | src/lib/api-errors.ts:14 |
| [`Home`](src/app/page.tsx#L1) | function | src/app/page.tsx:1 |
| [`POST`](src/app/api/webhooks/clerk/route.ts#L6) | function | src/app/api/webhooks/clerk/route.ts:6 |
| [`RootLayout`](src/app/layout.tsx#L31) | function | src/app/layout.tsx:31 |

## Internal System Boundaries

Document seams between domains, bounded contexts, or service ownership. Note data ownership, synchronization strategies, and shared contract enforcement.

## External Service Dependencies

List SaaS platforms, third-party APIs, or infrastructure services the system relies on. Describe authentication methods, rate limits, and failure considerations for each dependency.

## Key Decisions & Trade-offs

Summarize architectural decisions, experiments, or ADR outcomes that shape the current design. Reference supporting documents and explain why selected approaches won over alternatives.

## Diagrams

Link architectural diagrams or add mermaid definitions here.

## Risks & Constraints

Document performance constraints, scaling considerations, or external system assumptions.

## Top Directories Snapshot
- `agents/` — approximately 7 files
- `AGENTS.md/` — approximately 1 files
- `CLAUDE.md/` — approximately 1 files
- `components.json/` — approximately 1 files
- `docs/` — approximately 17 files
- `eslint.config.mjs/` — approximately 1 files
- `h -u origin main/` — approximately 1 files
- `next-env.d.ts/` — approximately 1 files
- `next.config.ts/` — approximately 1 files
- `package-lock.json/` — approximately 1 files
- `package.json/` — approximately 1 files
- `plans/` — approximately 4 files
- `playwright.config.ts/` — approximately 1 files
- `postcss.config.mjs/` — approximately 1 files
- `prevc-template.md/` — approximately 1 files
- `prisma/` — approximately 1 files
- `public/` — approximately 1 files
- `README.md/` — approximately 1 files
- `replit.md/` — approximately 1 files
- `replit.nix/` — approximately 1 files
- `scripts/` — approximately 2 files
- `src/` — approximately 10 files
- `tailwind.config.ts/` — approximately 1 files
- `tests/` — approximately 8 files
- `tsconfig.json/` — approximately 1 files
- `vitest.config.ts/` — approximately 1 files

## Related Resources

- [Project Overview](./project-overview.md)
- Update [agents/README.md](../agents/README.md) when architecture changes.
