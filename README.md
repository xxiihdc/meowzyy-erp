# Meowzyy ERP

Web application for Meowzyy ERP, built with Next.js. Supabase runs locally through Docker during development.

## Prerequisites

- Node.js and pnpm
- Docker Desktop (or another running Docker daemon)
- Supabase CLI. On macOS, install it with:

  ```bash
  brew install supabase/tap/supabase
  ```

  Alternatively, prefix the Supabase commands below with `npx supabase` instead of installing the CLI globally.

Verify Docker is running before starting Supabase:

```bash
docker info
```

## Start the web application

Install dependencies once:

```bash
pnpm install
```

Start the Next.js development server:

```bash
pnpm dev
```

Open the local URL printed by Next.js (normally `http://localhost:3000`).

## Start Supabase locally

The repository does not yet contain a Supabase configuration. Initialize it once at the repository root:

```bash
supabase init
```

This creates the local `supabase/` configuration directory. Then start the Docker-backed Supabase services:

```bash
supabase start
```

Check that the containers are healthy and view the local API, Studio, database, and key details:

```bash
supabase status
```

Keep Supabase and the web app in separate terminals while developing:

```text
Terminal 1: supabase start
Terminal 2: pnpm dev
```

When the application begins using Supabase, copy only the local URL and public anon key reported by `supabase status` into `.env.local`. Do not commit `.env.local` or any service-role key.

## Stop or reset Supabase

Stop this project's local containers while preserving their data volumes:

```bash
supabase stop
```

To rebuild the local database from migrations after migrations exist, run:

```bash
supabase db reset
```

`supabase db reset` replaces local database data, so use it only when resetting the development environment is intended.

## Useful checks

```bash
pnpm lint
pnpm build
supabase status
```
