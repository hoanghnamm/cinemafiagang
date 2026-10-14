# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Portfolio site for the CINEMAFIAGANG (CMG) film collective, to be served at cinemafiagang.com. Vite + React (JSX, no TypeScript), no router, no tests, no linter. Git repo on branch `main`; Cloudflare Pages deploys on push.

## Run locally

```sh
npm install
npm run dev       # http://localhost:5173
npm run build     # static output in dist/
npm run preview   # serve dist/
```

## Structure

- `index.html` holds only `<head>` (meta, OG tags, Google Fonts) and `#root`.
- `src/App.jsx` holds all content, in this order: floating pill nav, serif title hero with framed video, marquee, work bento (`#work`), manifesto, services accordion (`#services`), footer CTA (`#contact`), and two modals (`#cinemaVideoModal`, `#commissionBookingModal`). Small components live in the same file: `Modal`, `FeaturedPreview`, `Manifesto`. Work tiles come from the `works` array; the featured film from `featuredFilm`.
- `src/styles.css` uses tokens on `:root`. The type is Geist, which has a Vietnamese subset, with Instrument Serif italic in `<em>`. Instrument Serif has no Vietnamese glyphs, so use `<em>` on English words only. The accent is plain solid white, with no glow or effects. The hero name uses `.textfx`, an iridescent silver effect with five stacked `.layer` spans (bloom, base, tint, gloss, rim), rendered from one map in `App.jsx`. `--accent` (white) is the solid fallback for focus rings, selection and links. Breakpoints are 960px (tablet) and 720px (phone, which `App.jsx` also uses).
- `public/` is copied as-is into `dist/`: `assets/` (images, video, data), `CNAME`, `.nojekyll`. Reference these with absolute paths (`/assets/...`).
- GSAP comes from npm (`gsap`, `gsap/ScrollTrigger`).

## Non-obvious coupling

- **Bento grid:** the grid has 4 columns × 3 rows. `.tile--hero` takes 2×2, `.tile--wide` takes 2×1, and the others take 1×1. The current order is hero, wide, 1, 1, wide, wide, which fills all 12 cells. If you add or remove tiles, redo that arithmetic for 4, 2 and 1 columns. Covers are 808px images in `public/assets/img/covers/<behance-id>.webp`, taken from Behance's `808_webp` size.
- **Motion:** `Manifesto` only adds motion on top of content that is already visible (inside a `gsap.context`, reverted on unmount). Don't animate content in from `opacity: 0`, because that leaves it hidden if GSAP stalls or fails to load. Reduced-motion users get no GSAP and no CSS animation.
- **Modals:** the `modal` state in `App` (`null | 'video' | 'booking'`) drives everything. Modals stay mounted so the `.active` CSS transition runs. `App` sets `inert` on the skip link, header and main; `Modal` handles its own `inert`, the focus trap and focus return. Don't set `inert` or move focus anywhere else.
- **Featured video modal:** the iframe only gets a `src` while open, so closing stops playback. Content comes from `featuredFilm` in `App.jsx`.
- **Brief form:** there's no backend. On submit it builds a `mailto:` link to hello@cinemafiagang.com with the fields filled in.
- **Featured loop:** `assets/video/thich-anh-co-preview.mp4` is a silent 30s clip. It must stay muted with no controls, and `FeaturedPreview` pauses it offscreen, in hidden tabs, and when reduced motion is preferred.
- **Project data file:** `public/assets/data/behance-projects.json` is reference data and no code loads it.

## Content constraints (from README)

- Credit the work to the collective only: no individual studio-owner credit and no street address.
- Contact: hello@cinemafiagang.com / +84 8666 423 14.
- External dependencies are Google Fonts (Geist, Instrument Serif), GSAP (npm), YouTube, Behance and Instagram.

## Publishing

Run `npm run build` and upload `dist/` to static hosting (Vercel/Netlify/Cloudflare Pages: build command `npm run build`, output `dist`). `CNAME` and `.nojekyll` end up in `dist/` for GitHub Pages. The site is served from the domain root; set `base` in `vite.config.js` if it ever moves to a subpath. Hosting and Cloudflare DNS are not set up yet.
