# Project Structure

## Top-Level
```
src/
  app/        # Next.js App Router pages and layouts
  components/ # Reusable React components
  pages/      # Full-page feature components (rendered inside app/ routes)
  hooks/      # Custom React hooks
  lib/        # Utilities and API client
  types/      # Shared TypeScript types and enums
```

## Routing (`src/app/`)
Next.js App Router. Each route folder has a `page.tsx` that wraps a feature component from `src/pages/` inside `MainLayout`.

```
app/
  page.tsx              # Dashboard (root)
  login/page.tsx
  assets/
    page.tsx            # Asset list
    new/page.tsx        # Create asset
    [id]/page.tsx       # Asset detail
  tickets/
    page.tsx            # Ticket list
    new/page.tsx        # Create ticket
    [id]/edit/page.tsx  # Edit ticket
  settings/page.tsx
```

## Components (`src/components/`)
- `ui/` - shadcn/ui primitives (Button, Card, Dialog, DataTable, etc.) — do not modify directly
- `layout/` - App shell: `MainLayout`, `Header`, `Sidebar`, `Breadcrumb`
- `auth/ProtectedRoute.tsx` - Redirects to `/login` if no token in localStorage

## Feature Pages (`src/pages/`)
Actual page content components. These are `"use client"` components that handle data fetching and business logic. App Router `page.tsx` files are thin wrappers that apply `MainLayout` and render these.

## API Layer (`src/lib/api.ts`)
Axios instance with auth interceptor. Services grouped by entity:
- `authService` - signin
- `assetService` - CRUD for assets
- `ticketService` - CRUD for tickets
- `departmentService`, `userService` - lookup data

## Types (`src/types/index.ts`)
Single source of truth for all shared types and enums. Key enums: `AssetType`, `TicketType`, `TicketPriority`, `TicketStatus`.

## Conventions
- App Router pages are server components by default; add `"use client"` only when needed
- All interactive/data-fetching logic lives in `src/pages/`, not in `src/app/`
- Use `@/` path alias for all imports (maps to `src/`)
- Form validation uses zod schemas with react-hook-form
- Use existing shadcn/ui components from `src/components/ui/` before creating new ones
