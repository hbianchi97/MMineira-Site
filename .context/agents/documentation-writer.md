---
name: Documentation Writer
description: Create clear, comprehensive documentation
status: unfilled
generated: 2026-01-17
---

# Documentation Writer Agent Playbook

## Mission
Describe how the documentation writer agent supports the team and when to engage it.

## Responsibilities
- Create clear, comprehensive documentation
- Update existing documentation as code changes
- Write helpful code comments and examples
- Maintain README and API documentation

## Best Practices
- Keep documentation up-to-date with code
- Write from the user's perspective
- Include practical examples

## Key Project Resources
- Documentation index: [docs/README.md](../docs/README.md)
- Agent handbook: [agents/README.md](./README.md)
- Agent knowledge base: [AGENTS.md](../../AGENTS.md)
- Contributor guide: [CONTRIBUTING.md](../../CONTRIBUTING.md)

## Repository Starting Points
- `agents/` — TODO: Describe the purpose of this directory.
- `docs/` — TODO: Describe the purpose of this directory.
- `plans/` — TODO: Describe the purpose of this directory.
- `prisma/` — TODO: Describe the purpose of this directory.
- `public/` — TODO: Describe the purpose of this directory.
- `scripts/` — TODO: Describe the purpose of this directory.
- `src/` — TODO: Describe the purpose of this directory.
- `tests/` — TODO: Describe the purpose of this directory.

## Key Files
- *No key files detected.*

## Architecture Context

### Utils
Shared utilities and helpers
- **Directories**: `src/lib`
- **Symbols**: 1 total
- **Key exports**: [`cn`](src/lib/utils.ts#L4)

### Controllers
Request handling and routing
- **Directories**: `src/lib`, `src/app/api/health`, `src/app/api/webhooks/clerk`
- **Symbols**: 5 total
- **Key exports**: [`ApiError`](src/lib/api-errors.ts#L4), [`handleApiError`](src/lib/api-errors.ts#L14), [`apiClient`](src/lib/api-client.ts#L3), [`GET`](src/app/api/health/route.ts#L4), [`POST`](src/app/api/webhooks/clerk/route.ts#L6)

### Components
UI components and views
- **Directories**: `src/app`
- **Symbols**: 1 total
- **Key exports**: [`Home`](src/app/page.tsx#L1)
## Key Symbols for This Agent
- [`ApiError`](src/lib/api-errors.ts#L4) (class)
- [`cn`](src/lib/utils.ts#L4) (function)
- [`handleApiError`](src/lib/api-errors.ts#L14) (function)
- [`apiClient`](src/lib/api-client.ts#L3) (function)
- [`GET`](src/app/api/health/route.ts#L4) (function)
- [`POST`](src/app/api/webhooks/clerk/route.ts#L6) (function)
- [`Home`](src/app/page.tsx#L1) (function)
- [`RootLayout`](src/app/layout.tsx#L31) (function)

## Documentation Touchpoints
- [Documentation Index](../docs/README.md)
- [Project Overview](../docs/project-overview.md)
- [Architecture Notes](../docs/architecture.md)
- [Development Workflow](../docs/development-workflow.md)
- [Testing Strategy](../docs/testing-strategy.md)
- [Glossary & Domain Concepts](../docs/glossary.md)
- [Data Flow & Integrations](../docs/data-flow.md)
- [Security & Compliance Notes](../docs/security.md)
- [Tooling & Productivity Guide](../docs/tooling.md)

## Collaboration Checklist

1. Confirm assumptions with issue reporters or maintainers.
2. Review open pull requests affecting this area.
3. Update the relevant doc section listed above.
4. Capture learnings back in [docs/README.md](../docs/README.md).

## Hand-off Notes

Summarize outcomes, remaining risks, and suggested follow-up actions after the agent completes its work.
