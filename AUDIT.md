# Site audit — security, performance, SEO

Snapshot taken 2026-08-03 against a clean `next build` + `next start` of
Next.js 16.2.12. Every item below was measured, not assumed; the evidence
column says how.

Severity is *practical risk to this site*, not the raw CVSS of an advisory.

> **Status: all P1, P2 and P3.1 items are RESOLVED as of 2026-08-03.**
> See "Resolution log" at the bottom for what changed and how it was verified.
> Only 3.2 (font payload) and 3.3 (duplicate FAQ/form components) remain open,
> both deliberate.

---

## P1 — Do before any public launch

### 1.1 No security headers at all
**Evidence:** `curl -sI localhost:3124/` — `content-security-policy`,
`strict-transport-security`, `x-frame-options`, `x-content-type-options`,
`referrer-policy`, `permissions-policy` are all absent. `next.config.ts` is the
untouched Create-Next-App stub with no `headers()`.

**Impact:** The site is framable (clickjacking), has no MIME-sniffing
protection, leaks full referrer URLs cross-origin, and has no CSP to blunt an
injected-script incident.

**Fix:** add an `async headers()` block to `next.config.ts`. CSP needs care —
the two canvas components are fine, but Next injects inline bootstrap scripts,
so a strict `script-src` needs `'unsafe-inline'` or a nonce (nonces force
dynamic rendering and would cost the static prerender on all 6 routes).
Recommend starting with everything except CSP, then adding CSP in report-only
mode.

### 1.2 Five dead internal links on every page
**Evidence:** crawled all 5 routes, resolved all 18 unique internal links.

| Link | Status | Linked from |
|---|---|---|
| `/solutions/customer-intelligence` | 404 | all 5 pages (footer + homepage pillars) |
| `/solutions/trust-risk-intelligence` | 404 | all 5 pages |
| `/solutions/memory-intelligence` | 404 | all 5 pages |
| `/resources/blog` | 404 | all 5 pages (footer) |
| `/resources/whitepapers` | 404 | all 5 pages (footer) |

**Impact:** every page ships 5 broken links. Search engines will crawl and
penalise them; visitors hit `not-found`.

**Fix:** either trim `FOOTER_GROUPS`/`PILLARS` in `lib/content.ts` to live
routes only, or make the three unbuilt pillar cards static (as already done for
the platform cards on the homepage).

### 1.3 No `robots.txt`, no `sitemap.xml`
**Evidence:** no `app/robots.ts`, `app/sitemap.ts`, or `public/` equivalents.

**Impact:** no crawl directives and no sitemap for a 6-route marketing site
whose entire purpose is discovery. `metadataBase` *is* correctly set to
`https://rebel-labz.com`, so canonical URLs already resolve — this is the
missing half.

**Fix:** `app/robots.ts` + `app/sitemap.ts` (Next generates both from
exported functions; both stay static).

---

## P2 — Should fix, low risk to change

### 2.1 Three high-severity advisories in the dependency tree
**Evidence:** `npm audit --omit=dev` → 3 high, all transitive through
`next@16.2.12`.

| Package | Advisory | Reachable here? |
|---|---|---|
| `sharp@0.34.5` | libvips CVE-2026-33327/33328/35590/35591 | Only via the image optimizer, and only on **local** files in `public/`. No `images.remotePatterns` is configured, so untrusted images never reach libvips. |
| `postcss` (nested under next) | GHSA-r28c-9q8g-f849 path traversal via `sourceMappingURL` | Build-time only, on first-party CSS. |

**Do not run `npm audit fix --force`** — it "resolves" these by installing
`next@9.3.3`, a catastrophic downgrade.

`16.2.12` is the latest published 16.x stable, so there is no upstream fix to
move to today. Practical exploitability is low for both, given static
prerendering and no remote images.

**Fix:** try an npm `overrides` entry pinning `sharp` to `>=0.35.0` and
re-run the build to confirm Next still works; otherwise track the advisories
and upgrade when 16.3 stable lands.

### 2.2 `X-Powered-By: Next.js` leaks the framework
**Evidence:** present in every response header.
**Fix:** `poweredByHeader: false` in `next.config.ts`. One line.

### 2.3 JSON-LD is stringified without escaping
**Evidence:** 4 pages use
`dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}`.

**Impact:** none today — all FAQ content is author-controlled in `lib/*.ts` and
contains no `<`. But a future FAQ answer containing `</script>` would break out
of the tag and could execute. It is a latent injection, not a live one.

**Fix:** escape `<` as `<` in the serialized output, ideally via one
shared `jsonLd()` helper used by all four pages.

### 2.4 Source images are oversized and unoptimized
**Evidence:** `public/solutions/di-strategy.jpg` is **283 KB**;
`di-decisions.jpg` 156 KB; `trust-risk-intelligence.jpg` 109 KB. 908 KB of
raster assets total. `next.config.ts` sets no `images.formats`, so AVIF is
never emitted (WebP is the built-in default).

**Fix:** add `images: { formats: ["image/avif", "image/webp"] }` and
re-compress the sources. Every `next/image` already passes a correct `sizes`
prop and sensible `priority`/`loading` — that part is in good shape.

---

## P3 — Worth doing, low urgency

### 3.1 Latent route collision in `app/(energy-talents)/contact/`
**Evidence:** the directory exists and is empty. It generates no route today,
so the build passes. Git does not track empty directories, so it will not even
be committed.

**Impact:** the moment a `page.tsx` lands there it collides with
`(rebel)/contact` at `/contact` and **fails the build**.

**Fix:** delete the folder, or decide a path prefix for the second brand before
that work resumes.

### 3.2 Font payload
**Evidence:** 6 `.woff2` preloads on the homepage — Inter normal + italic, plus
JetBrains Mono in the Rebel layout.

Loading is already well structured (JetBrains Mono is scoped to the route-group
layout so a visitor only downloads what their page uses). Worth confirming the
italic Inter face earns its place, since it is used only for a handful of `<em>`
runs.

### 3.3 Three near-duplicate FAQ accordions and three near-duplicate mailto forms
Known, deliberate — they differ in theme and layout. Flagging so it stays a
choice rather than drift. `/simplify` would consolidate them.

---

## Verified healthy — no action

These were checked and are genuinely fine; recording them so they are not
re-litigated.

| Area | Result |
|---|---|
| **Compression** | Homepage is 221 KB raw but **32 KB gzipped**. The large prerendered HTML is a non-issue over the wire. |
| **Heading structure** | All 5 pages: exactly one `<h1>`, zero skipped levels. |
| **`prefers-reduced-motion`** | Honoured in both canvases, `reveal-observer`, `frameworks`, `platform-visual`, and `globals.css`. |
| **Image props** | Every `fill` image has a `sizes`; `priority` on above-fold, `loading="lazy"` below. |
| **External links** | None — so no `target="_blank"` / `rel="noopener"` exposure. |
| **`metadataBase`** | Set, so OG and canonical URLs resolve absolutely. |
| **Rendering** | All 6 routes statically prerendered; no server runtime to attack. |
| **Client boundary** | 11 client components, each justified by state/canvas/observer. Sections stay server-rendered. |
| **Forms** | No backend — `mailto:` composition only, so no injection sink, no CSRF surface, no credential handling. |
| **`lang` attribute** | `<html lang="en">` present. |
| **Favicon** | `app/favicon.ico` present. |

---

## Resolution log — 2026-08-03

| # | Item | Resolution | Verified by |
|---|---|---|---|
| 1.1 | No security headers | `next.config.ts` now sends CSP, HSTS, `X-Frame-Options: DENY`, `nosniff`, `Referrer-Policy`, `Permissions-Policy` on `/:path*` | `curl -sI` — all six present |
| 1.2 | 5 dead links | `SOLUTION_LINKS` trimmed to live routes; `Pillar.href` made optional so unbuilt pillars render inert; Blog/Whitepapers removed from footer | Re-crawled 5 pages / 13 links → **0 dead** (was 5) |
| 1.3 | No robots/sitemap | `app/robots.ts` + `app/sitemap.ts`, sharing `lib/site.ts` with `metadataBase` | Both build static; 5 URLs in sitemap |
| 2.1 | 3 high advisories | npm `overrides` → `sharp@0.35.3`, `postcss@8.5.25` | `npm audit` → **0 vulnerabilities**; optimizer re-verified serving AVIF + WebP |
| 2.2 | `X-Powered-By` leak | `poweredByHeader: false` | Header absent |
| 2.3 | Unescaped JSON-LD | `lib/json-ld.ts` escapes `<`, `>`, `&`; shared `faqPageJsonLd()` used by all 4 pages | No raw `JSON.stringify` left in a script tag |
| 2.4 | Oversized images | Re-encoded with mozjpeg q80 progressive; `images.formats` set to AVIF→WebP | 885 KB → 716 KB sources (−19%); AVIF served at 69 KB vs 156 KB source |
| 3.1 | Route collision risk | Empty `app/(energy-talents)/contact/` deleted | Directory gone; build unaffected |

### Notes for later

- **CSP uses `'unsafe-inline'`** for script-src and style-src. This is the
  deliberate cost of keeping all six routes statically prerendered — nonces
  force dynamic rendering. It still blocks script from foreign origins, which
  is the bigger win. Revisit if a route ever goes dynamic anyway.
- **The `overrides` block is load-bearing.** `sharp` and `postcss` are pinned
  ahead of what Next depends on. Re-run `npm audit` and a clean build after any
  Next upgrade, and drop the overrides once Next ships them itself.
- **Image re-compression matters less than it looks** now that AVIF is on: the
  optimizer re-encodes at request time, so source size mainly affects repo and
  deploy weight rather than delivered bytes.
- Originals of the eight re-compressed JPEGs were backed up to the session
  scratchpad before overwriting, in case any look degraded.
