# Tech Stack

## Framework & Runtime
- **Next.js 16** (App Router) with React 19
- **TypeScript 5.8**
- Node.js runtime

## Styling
- **Tailwind CSS v4** with `tw-animate-css`
- **shadcn/ui** component library built on Radix UI primitives
- `class-variance-authority` + `clsx` + `tailwind-merge` for conditional class composition
- Geist variable font via `@fontsource-variable/geist`

## Key Libraries
- **axios** - HTTP client, configured in `src/lib/api.ts`
- **react-hook-form** + **zod** + `@hookform/resolvers` - form handling and validation
- **@tanstack/react-table** - data tables
- **lucide-react** - icons
- **date-fns** + **react-day-picker** - date utilities and calendar UI
- **motion** - animations
- **@google/genai** - Gemini AI SDK

## Auth
- JWT token stored in `localStorage` under key `token`
- Bearer token attached via axios request interceptor
- API base URL configurable via `localStorage` key `API_BASE_URL` or `NEXT_PUBLIC_API_BASE_URL` env var

## Environment Variables
- `NEXT_PUBLIC_API_BASE_URL` - backend API base URL (defaults to `/api`)
- `GEMINI_API_KEY` - required for AI features

## Common Commands
```bash
npm run dev      # start dev server
npm run build    # production build
npm run start    # start production server
npm run lint     # run ESLint
```
