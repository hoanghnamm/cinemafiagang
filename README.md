# CINEMAFIAGANG website handoff

Vite + React website. Needs Node.js.

## Preview and edit
- `npm install`, then `npm run dev` and open http://localhost:5173.
- Edit src/App.jsx for copy, sections, project frames (`works` array), links, and contact details.
- Edit src/styles.css for typography, colors, layout, and responsive styling.
- Images, video and CNAME live in public/ and are copied to the build unchanged.

## Current design and content
- Paragon-inspired art direction adapted to CMG: one shared warm black background, off-white typography and subtle dark surfaces across Home, Directors, dialogs and footer; oversized Geist typography with Instrument Serif accents.
- Homepage sequence: typographic identity and local film loop → collective introduction → asymmetric six-film gallery → expandable services → behind-the-scenes photos → contact.
- Responsive layout with a mobile menu, visible project labels, keyboard-accessible service disclosures, modal focus management and reduced-motion support.
- Six projects linked to their published Behance pages.
- Contact: hello@cinemafiagang.com / +84 8666 423 14.
- Crew roles are supplied by the user, including Do Hoang Long as Founder, Cinematographer and Colorist. No street address is published.
- Featured video is a silent 30-second loop from 00:45–01:15 of the supplied Thích Anh Cơ music video. Its file is assets/video/thich-anh-co-preview.mp4 (1280 x 720, H.264, no audio).
- Featured video has no controls or overlays. It pauses offscreen, in hidden tabs, and for reduced-motion preferences.
- The brief form has no backend; it opens the visitor's email app with the brief pre-filled to hello@cinemafiagang.com.

## External dependencies
Internet access is used for Google Fonts (Geist, Instrument Serif), GSAP (bundled from npm), Behance project links, Instagram, and any YouTube playback. Local images and the featured loop are included.

## Deploy to Cloudflare Pages

The repository is configured for Cloudflare Pages Direct Upload with a pinned Wrangler dependency and `wrangler.jsonc`. It has not been connected to GitHub or deployed automatically. The production branch is `main`; the intended project name is `cinemafiagang`.

### First deployment

Use Node 22.12 or later (Node 22 is selected by `.nvmrc`).

```sh
npm ci
npm run cf:login
npm run cf:whoami
npm run cf:create
npm run deploy
```

`cf:login` opens Cloudflare OAuth in your browser. Do not put tokens in this repository. If the Pages project already exists, skip `cf:create`; verify its account and project name before deployment. If multiple accounts are available, select the intended account or supply `CLOUDFLARE_ACCOUNT_ID` in your shell.

`npm run deploy` builds both pages, checks local asset references and upload size limits, then publishes the build to the production Pages project. Use the URL returned by Wrangler; a successful local build alone does not verify deployment.

### Local Cloudflare preview

```sh
npm run cf:preview
```

This serves `dist` with the Pages runtime. Ordinary visual preview: `npm run preview`. `/directors/` has its own built HTML. `public/404.html` gives unknown paths a real 404 rather than a homepage fallback. `public/_headers` adds basic response headers without blocking Google Fonts or YouTube embeds.

### Git-based builds (alternative)

If you prefer automatic builds, create/connect a Cloudflare Pages Git-integration project to your GitHub repository, with production branch `main`, build command `npm run build && npm run check:deploy`, output directory `dist`, and Node 22.12+. This repository currently has no Git remote. Choose the deployment approach before creating the Cloudflare project; do not assume Direct Upload projects can later be converted to Git integration.

### Custom domain

After verifying the returned `pages.dev` URL, open that Pages project's **Custom domains** and add `cinemafiagang.com` and, if wanted, `www.cinemafiagang.com`. Follow Cloudflare's domain/DNS verification flow. The apex domain requires the zone in the appropriate Cloudflare account. The existing `public/CNAME` is legacy GitHub Pages metadata and does not attach a Cloudflare domain. DNS and custom domains are not configured by this repository.

The brief form still opens an email application; it is not a server-side submission service.

## Package contents
The current HTML, CSS, JavaScript, complete original assets folder, CNAME, .nojekyll, and this guide are included. Historical backups and temporary working files are omitted. The full original music video is not needed to run the site and is not included; the finished highlight is included.

## The Gang / crew page

- `/directors/` is retained for existing links; navigation calls this page **The Gang**.
- Eight names and roles are maintained in `src/Directors.jsx`, using the spelling provided by the user. Roles remain visible on desktop and mobile.
- Do Hoang Long — Founder, Cinematographer, Colorist
- Le Quang Minh — Assistant Director
- Phan Nam Anh — Producer
- Nguyen Thi Truc Anh — Producer
- Vo Hong Minh — Camera Operator
- Pham Chu Binh — Editor, VFX
- Nguyen Quang Tien — Editor
- Hoang Hai Nam — Technical Specialist
- Preview panels show initials and the person's role. No existing film is assigned to an individual without confirmed credits.
