# Rebel Labz

Marketing site for Rebel Labz, an intelligence lab. Built with Next.js 16 (App
Router, Turbopack), React 19, TypeScript, and Tailwind CSS v4.

## Getting started

```bash
npm run dev     # dev server on http://localhost:3000
npm run build   # production build
npm start       # serve the production build
npm run lint    # eslint
```

## Structure

```
app/
  layout.tsx        fonts, metadata, and the persistent chrome:
                    skip link → SiteHeader → <main id="main"> → SiteFooter
  page.tsx          homepage sections only
  globals.css       design tokens, keyframes, base + component layers
  not-found.tsx     branded 404 (renders inside the layout chrome)
  solutions/
    decision-intelligence/page.tsx   pillar detail page
components/         homepage sections, plus the generated artwork
components/service/ reusable solution-page sections
lib/content.ts      site chrome + homepage copy
lib/solutions.ts    per-pillar solution page content
public/brand/       logo assets
public/pillars/     photography for the homepage pillar rail
public/solutions/   photography for the solution pages
```

The header and footer live in the root layout, so every route gets them and
they are not remounted on navigation. Anything in them that depends on page
content therefore has to re-sync on route change — see the `usePathname()` deps
in `site-header.tsx` (scroll spy, mobile sheet) and `reveal-observer.tsx`.
Pages render their own sections and nothing else; `<main>` is supplied by the
layout, so don't add another one.

### Conventions

- **Content lives in `lib/content.ts`.** Sections read from typed tables, so copy
  changes never require touching layout. Body copy marks emphasis with
  `*asterisks*`, rendered as real `<em>` by `components/emphasis.tsx`.
- **Server Components by default.** Only four components opt into the client:
  `site-header` (menu + scroll spy), `maze-canvas` (hero animation),
  `frameworks` (scroll-pinned rail), and `open-lab` (the terminal input).
- **Artwork is generated, not authored.** The three platform card visuals
  (`platform-visual.tsx`) and the nine principle signatures (`signature.tsx`)
  are built from small geometry tables rather than literal SVG markup.
- **Motion is CSS, not SMIL**, so the global `prefers-reduced-motion` rule in
  `globals.css` can stop it. The maze falls back to one static solved frame and
  the pinned rail falls back to a native swipe rail.
- **Design tokens** are Tailwind v4 `@theme` variables (`--color-brand`,
  `--spacing-shell`, `--ease-out-soft`, …). Prefer `bg-brand`,
  `max-w-(--spacing-shell)`, `ease-(--ease-out-soft)` over raw values.

### Progressive enhancement

Scroll-reveal is gated behind `data-reveal-armed`, which `RevealObserver` sets
on `<html>` at mount — without JavaScript the page renders fully visible rather
than stuck at `opacity: 0`.

## Adding another solution page

`components/service/` renders whatever it is handed, so a new pillar is data
plus a route:

1. Add a `Solution` record to `lib/solutions.ts`.
2. Add photography under `public/solutions/`.
3. Copy `app/solutions/decision-intelligence/page.tsx`, pointing the import at
   the new record.

The contact form has no backend — it composes a `mailto:` to the lab. The field
names already match what a Server Action would expect, so moving it server-side
means swapping `handleSubmit` in `collaboration-form.tsx`.

## Not yet built

Nav, cards, and footer link to routes that do not exist yet (`/about`,
`/careers`, `/resources/*`, `/platforms/*`, and three of the four
`/solutions/*`). Those links carry `prefetch={false}` and land on the branded
404.
# rebel
