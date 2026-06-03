# Alpuz Design Studio

Interior design website for Alpuz Interior Design, with a Vercel Blob-backed store admin, Stripe Checkout for fixed-price packages, and enquiry-only support for quote-based commercial work.

## Tech Stack

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Framer Motion
- TanStack Query
- React Router
- Vercel Blob
- Stripe Checkout
- Vercel Analytics

## Getting Started

```sh
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

For local API parity, use Vercel CLI and run `npm run dev:local` so the `api/` serverless functions run locally. Plain `npm run dev` serves the React app and uses local fallbacks for catalog/admin behavior in development.

## Environment Variables

Set these in Vercel Project Settings -> Environment Variables.

| Variable | Description |
|----------|-------------|
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token used by catalog and media APIs |
| `STRIPE_SECRET_KEY` | Stripe secret key used to create Checkout Sessions |
| `STRIPE_CURRENCY` | Optional currency override; defaults to `sgd` |
| `ADMIN_PASSWORD` | Optional admin password; defaults to `alpuz-admin` |
| `ALPUZ_ADMIN_PASSWORD` | Optional fallback admin password env name |
| `SITE_URL` | Optional canonical site URL for Stripe success/cancel redirects |

## Vercel Deployment

- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Rewrites: handled by `vercel.json` so client-side routes such as `/shop`, `/checkout`, and `/admin` serve `index.html`.
- API routes:
  - `/api/catalog`
  - `/api/admin-login`
  - `/api/create-checkout-session`
  - `/api/upload-media`

## Project Structure

- `src/components/` - Reusable UI components
- `src/pages/` - Page components
- `src/contexts/` - Cart context
- `src/lib/` - API client, default catalog, and utils
- `src/types/` - Catalog and checkout types
- `server/` - Shared server-side catalog helpers
- `api/` - Vercel serverless functions
- `public/catalog/` - Default store images
