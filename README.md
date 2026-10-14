# CINEMAFIAGANG website handoff

Vite + React website. Needs Node.js.

## Preview and edit
- `npm install`, then `npm run dev` and open http://localhost:5173.
- Edit src/App.jsx for copy, sections, project frames (`works` array), links, and contact details.
- Edit src/styles.css for typography, colors, layout, and responsive styling.
- Images, video and CNAME live in public/ and are copied to the build unchanged.

## Current design and content
- Paragon-inspired art direction adapted to CMG: paper, cinematic black and vermilion; oversized Geist typography with Instrument Serif accents.
- Homepage sequence: typographic identity and local film loop → collective introduction → asymmetric six-film gallery → expandable services → behind-the-scenes photos → contact.
- Responsive layout with a mobile menu, visible project labels, keyboard-accessible service disclosures, modal focus management and reduced-motion support.
- Six projects linked to their published Behance pages.
- Contact: hello@cinemafiagang.com / +84 8666 423 14.
- Collective credit; no individual studio-owner credit or street address.
- Featured video is a silent 30-second loop from 00:45–01:15 of the supplied Thích Anh Cơ music video. Its file is assets/video/thich-anh-co-preview.mp4 (1280 x 720, H.264, no audio).
- Featured video has no controls or overlays. It pauses offscreen, in hidden tabs, and for reduced-motion preferences.
- The brief form has no backend; it opens the visitor's email app with the brief pre-filled to hello@cinemafiagang.com.

## External dependencies
Internet access is used for Google Fonts (Geist, Instrument Serif), GSAP (bundled from npm), Behance project links, Instagram, and any YouTube playback. Local images and the featured loop are included.

## Publishing (Cloudflare Pages)
Static site, no backend. Cloudflare builds from GitHub on every push to `main`.
- Build command: `npm run build` — output directory: `dist` — Node version from `.nvmrc` (22).
- Domain cinemafiagang.com must use Cloudflare nameservers; add it under the Pages project's Custom domains (apex + www).
- `/directors/` is a real file in `dist/`, so no redirect rules are needed.
- CNAME is only for GitHub Pages; Cloudflare ignores it.
No passwords, account credentials, or hosting access are included.

## Package contents
The current HTML, CSS, JavaScript, complete original assets folder, CNAME, .nojekyll, and this guide are included. Historical backups and temporary working files are omitted. The full original music video is not needed to run the site and is not included; the finished highlight is included.

## Directors page
- `/directors/` is a separate static entry, linked from the shared navigation. Both pages are included in `npm run build`; no server-side route fallback is required.
- Edit `src/Directors.jsx` for the four directors. Names follow the supplied spelling. Reels are intentionally unassigned until confirmed.
- Each director accepts a `previewUrl` (a local or CDN-hosted MP4/WebM clip) and optional `poster`. Hovering a name changes its color and reveals a smoothly following preview behind the type. Layers crossfade between directors. Touch and keyboard focus also reveal previews; Escape dismisses them. Videos pause when inactive, in hidden tabs, or under reduced-motion preferences.
- Current monogram artwork is a placeholder, not a credited film still. No full-length director videos are stored locally.
