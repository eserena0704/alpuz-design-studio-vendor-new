# Deploy to Vercel

This project deploys as a Vite app with Vercel Serverless Functions. The store uses Vercel Blob for catalog/media storage and Stripe Checkout for fixed-price package payments.

## Dashboard Deploy

1. Push the repository to GitHub.
2. Import the project in Vercel.
3. Use these settings:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
4. Add the required environment variables.
5. Deploy.

## Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `BLOB_READ_WRITE_TOKEN` | Yes | Reads/writes catalog JSON and uploaded media in Vercel Blob |
| `STRIPE_SECRET_KEY` | Yes | Creates Stripe Checkout Sessions |
| `STRIPE_CURRENCY` | No | Defaults to `sgd` |
| `ADMIN_PASSWORD` | No | Admin login password; defaults to `alpuz-admin` |
| `ALPUZ_ADMIN_PASSWORD` | No | Alternate admin password env name |
| `SITE_URL` | No | Canonical base URL for Stripe success/cancel redirects |

## CLI Deploy

```bash
npm install
npm run build
vercel --prod
```

To add env vars from the CLI:

```bash
vercel env add BLOB_READ_WRITE_TOKEN
vercel env add STRIPE_SECRET_KEY
vercel env add STRIPE_CURRENCY
vercel env add ADMIN_PASSWORD
vercel env add SITE_URL
```

## Production Paths

- Site: `https://<your-project>.vercel.app`
- Shop: `/shop`
- Checkout: `/checkout`
- Admin: `/admin`
- Catalog API: `/api/catalog`
- Stripe Checkout API: `/api/create-checkout-session`

## Notes

- Fixed-price packages can be purchased through Stripe Checkout.
- Quote-only packages, such as commercial fit-out work, remain enquiry-only.
- Buyer name, email, phone, address and notes are attached to the Stripe Checkout Session metadata.
