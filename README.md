# AI Dev Peru

A monorepo for the AI Dev Peru community site and internal management dashboard.

## Project Structure

- `apps/public`: The public-facing site (`ai.devperu.org`).
- `apps/internal`: The internal management dashboard (`ai.devperu.org/internal/`).

## Tech Stack

- **Runtime**: Bun
- **Framework**: React 19 + Vite
- **Routing**: TanStack Router (Internal)
- **Styling**: Tailwind CSS
- **Testing**: Vitest
- **Deployment**: Vercel

## Getting Started

### Installation

```bash
bun install
```

### Development

Run the development servers:

```bash
# Internal Dashboard
bun run dev:internal

# Public Site
bun run dev:public
```

### Build & Test

```bash
# Build both apps
bun run build

# Run tests
bun run test:internal
bun run test:public

# Type check
bun run typecheck:internal
bun run typecheck:public
```

## Deployment

The project is configured for deployment on Vercel via `vercel.json`. The internal app is served under the `/internal/` sub-path.
