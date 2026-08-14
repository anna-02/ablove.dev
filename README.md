# ablove-site

Vite + React + Tailwind skeleton for Anna's minimalist site (warm white background, TeXGyrePagella/Palatino serif stack).


## Quick start

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
# outputs to dist/
```

The build runs three stages:

1. `vite build` — normal client bundle into `dist/`
2. `vite build --ssr src/entry-server.jsx` — server bundle into `dist-server/`
3. `node scripts/prerender.mjs` — renders the app to HTML, injects it into
   `dist/index.html`, copies that to `dist/404.html`, and deletes `dist-server/`

Stage 3 exists so crawlers that don't run JavaScript still see the page content.
It fails the build if the render comes back empty or the `<div id="root">` marker
is missing, so a silent regression can't ship an empty page.

## Deploying

Push to `main`. The GitHub Actions workflow in `.github/workflows/deploy.yaml`
runs `npm ci && npm run build` and publishes `dist/` to GitHub Pages. The workflow
itself is unchanged from before prerendering was added — `npm run build` just does
more now. `dist/` and `dist-server/` are gitignored and should never be committed.

## Writing components (important)

Every component is now rendered under Node during the build, not only in the
browser. That means at render time a component must not:

- touch `window`, `document`, or `localStorage`
- `fetch` data (load it with a build-time import instead — see below)
- produce output that differs between server and browser (e.g. `Math.random()`)

Browser-only work belongs in `useEffect`, which doesn't run during prerendering.
If server and browser output disagree, React logs a hydration mismatch in the
console and re-renders on the client. Check the console after `npm run preview`.

`src/main.jsx` uses `hydrateRoot` when `#root` already has content and falls back
to `createRoot` in dev, where it's empty.

## Publications

Source of truth is `src/data/publications.bib`.

It's imported at build time in `src/components/PublicationsFromBib.jsx`:

```js
import bibText from "../data/publications.bib?raw";
```

Parsing happens once at module scope, so the publication list is present in the
prerendered HTML.

It lives in `src/` rather than `public/` because Vite warns when you import from
the public directory. To keep `ablove.dev/publications.bib` downloadable,
`scripts/prerender.mjs` copies it into `dist/` at the end of the build.

Because it's inlined at build time, **editing the `.bib` requires a rebuild** —
changing the deployed file alone won't update the page.

Custom BibTeX fields picked up per entry: `pdf`, `talk`, `slides`, `video`,
`code`, `poster`, `website`, `artifact`, `award`, `rate`.

## SEO

Three places hold this, all hand-edited.

### `index.html` (the `<head>`)

| What | Update when |
| --- | --- |
| `<title>` | Role or institution changes. Keep under ~60 chars or Google truncates it. |
| `<meta name="description">` | Research focus changes. Aim ~150–180 chars. Shown in search results. |
| `<link rel="canonical">` | Only if the domain changes. Must match the `CNAME` (`www.ablove.dev`) exactly. |
| `og:*` / `twitter:*` | Keep descriptions under ~200 chars — LinkedIn and X truncate past that. |
| `og:image` + `og:image:width/height` | If the headshot changes, update the URL **and** the pixel dimensions. |
| JSON-LD `<script type="application/ld+json">` | New affiliation, new profile link, or new research area. |

The JSON-LD block is a `schema.org/Person` describing who you are as an entity:
`affiliation` and `memberOf` (University of Michigan, Censored Planet),
`knowsAbout` (research topics), and `sameAs` — the list of profile URLs
(Google Scholar, ORCID, GitHub, LinkedIn) that ties this site to your
publication record. Add new scholarly profiles to `sameAs`.

Descriptions appear in three places (`description`, `og:description`,
`twitter:description`) and should stay consistent in voice. The `og`/`twitter`
pair are currently identical to each other.

### `public/robots.txt`

Allows everything and points to the sitemap. Rarely needs changes.

### `public/sitemap.xml`

Lists the homepage plus each paper PDF and the CV. **When you add a paper, add
its PDF here too** — PDFs get indexed on their own and can rank independently.
Also bump `<lastmod>` on the homepage entry when content changes meaningfully.

### Verifying

```bash
npm run build && npm run preview
```

- View source on the built page — your bio and publications should be in the raw
  HTML, not just an empty `<div id="root">`.
- Check the browser console for hydration warnings (should be silent).
- Paste the JSON-LD into Google's Rich Results Test.
- After deploying, submit `sitemap.xml` in Google Search Console.

## Notes

- Place your headshot at `public/images/profile3.jpeg`.
- The warm white background is defined in `src/index.css` as `--bg-warm: #FDF4DC`.
- The font stack is set via the `.font-serif-stack` class (applied to `<main>`).
- Tailwind v4 style import is used via `@import "tailwindcss";`.
- In JSX use `className`, never `class` — raw `class` attributes trigger React
  warnings that surface during the SSR build.
