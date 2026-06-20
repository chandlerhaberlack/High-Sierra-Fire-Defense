# High Sierra Fire Defense

Early-access landing page for an intelligent exterior wildfire defense system serving Reno, Tahoe, Truckee, and Northern Nevada.

## Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Formspree (waitlist submissions)

## Getting Started

```bash
npm install
cp .env.local.example .env.local
# Add your Formspree form ID to .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Formspree Setup

1. Create a free account at [formspree.io](https://formspree.io)
2. Form endpoint: `https://formspree.io/f/meewyvkr`
3. Set `NEXT_PUBLIC_FORMSPREE_ID=meewyvkr` in `.env.local` (see `.env.local.example`)

## Production Build

```bash
npm run build
npm start
```

## Deployment

Deploy to Vercel, Netlify, or any Node.js host. Set `NEXT_PUBLIC_FORMSPREE_ID` as an environment variable in your hosting dashboard.

When your domain is ready, update `metadataBase` in `app/layout.tsx` and the URL in `app/sitemap.ts`.

## Project Structure

```
app/                  # Next.js app router (layout, page, SEO files)
components/           # Page sections and UI primitives
public/images/        # Hero background and assets
```
