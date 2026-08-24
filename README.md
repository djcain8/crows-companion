# Crows Companion

A player-first campaign companion for the Crows tabletop RPG. The first release will center on an interactive village, shared inventory, and a lightweight GM view.

## Foundation

- Next.js App Router, React, and TypeScript
- Tailwind CSS
- Supabase Postgres with SSR-ready clients
- Vitest, ESLint, TypeScript checks, and GitHub Actions
- Vercel-compatible deployment

Production builds use Next.js's supported webpack builder for deterministic CI. The development server retains the default Turbopack experience.

## Local setup

This project requires Node.js 20.9 or newer; Node 22 is selected in `.nvmrc`.

```bash
nvm install
nvm use
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. The landing shell works without Supabase credentials; data-backed features will require them.

## Supabase

1. Create a Supabase project.
2. Copy the project URL and publishable key into `.env.local`.
3. Install the Supabase CLI or connect this repository through the Supabase dashboard.
4. Apply `supabase/migrations/202608240001_initial_campaign_schema.sql`.

The initial row-level-security policies intentionally allow anonymous read/write access. This matches the no-auth prototype, but means anyone with the deployed URL can change its data. Do not store private information. Replace these policies before introducing accounts or sharing the app publicly.

## Verification

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

CI runs the same checks for pushes and pull requests to `main`.

## Deployment

Push the repository to GitHub, import it into Vercel, and add the two Supabase environment variables to the Vercel project. Vercel detects Next.js without additional configuration.

## Planned slices

1. Campaign bootstrap and shared village state
2. Town navigation and institution detail panels
3. Shared inventory and treasury
4. Character roster and wound tracking
5. GM controls, authentication, and campaign membership
6. Expedition maps and tokens
