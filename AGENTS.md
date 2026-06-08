<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version (16.2.7) has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Commands

```bash
npm run dev      # development server on http://localhost:3000
npm run build    # production build (run `npx prisma generate` first)
npm run lint     # ESLint flat config only — no separate typecheck script
npx prisma generate   # generates client to generated/prisma/ (needed before build)
npx prisma db push    # push schema to MySQL (uses prisma.config.ts for env loading)
```

## Stack

- **Next.js 16.2.7** (App Router) + React 19 + TypeScript 5 (strict)
- **Tailwind CSS v4** with `@tailwindcss/postcss` PostCSS plugin (not the classic plugin)
- **shadcn/ui v4** ("radix-luma" style, Remixicon icon library)
- **Prisma v7** with MariaDB driver-adapter (not the default ORM client)
- **better-auth v1.6** for email/password auth
- **Zustand v5** for client-side cart (persisted to localStorage)

## Critical project quirks

### Prisma v7 driver-adapter setup (non-standard)

Prisma client is **not** in `node_modules/.prisma/client`. It is generated to `generated/prisma/`.

```ts
// src/lib/prisma.ts — import path is non-obvious:
import { PrismaMariaDb } from "@prisma/adapter-mariadb"
import { PrismaClient } from "../../generated/prisma/client"
```

`prisma.config.ts` manually loads env vars via `import "dotenv/config"` — Prisma v7 does **not** auto-load `.env`.

### No root layout — two route groups each own `<html>`

- `src/app/(front)/layout.tsx` — main site layout
- `src/app/(auth)/layout.tsx` — auth pages layout

There is **no** `src/app/layout.tsx`. Each group defines its own `<html>` tag. Do not create a root layout without checking both group layouts.

### Auth (better-auth)

- Server-side: `await auth.api.getSession({ headers: await headers() })` — note `await headers()`
- Client-side: `authClient.signIn.email()` / `authClient.signUp.email()`
- Auth server endpoint: `/api/auth/[...all]` via `toNextJsHandler`

### `@/*` import alias

Maps to `./src/*`. shadcn components live in `@/components/ui/`.

### Cart is client-side only

`src/lib/cart-store.ts` — Zustand store persisted to localStorage key `skill-cart`. No server-side cart.

### Docker

Multi-stage Dockerfile expects standalone output. `npm run build` with the Dockerfile copies `.next/standalone`.

## Lint and typecheck

Only `npm run lint` is configured (ESLint flat config `eslint.config.mjs`). There is no separate `tsc --noEmit` script, but TypeScript is in strict mode. Run `npx tsc --noEmit` if you need typechecking independently.

## DB

MySQL database `wha_ecommerce` at `localhost:3306`. Connection string in `.env`. The schema has both e-commerce models (categories, products, orders, etc.) and better-auth models (User, Session, Account, Verification).
