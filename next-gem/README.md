# Next GEM

An interactive pitch website for a future business-banking onboarding journey: start in minutes, unlock capabilities progressively, and build trust at every milestone.

## What is included

- Responsive executive-style landing page
- Interactive seven-part, five-minute pitch mode
- Keyboard navigation in pitch mode (`Left`, `Right`, `Esc`)
- Original Next GEM project identity and faceted-gem mark
- No personal, customer, or confidential information

## Run locally

Requirements: Node.js 22.13 or newer.

```bash
npm ci
npm run dev
```

Open the local address shown in the terminal, normally `http://localhost:5173`.

## Quality checks

```bash
npm run lint
npm test
```

## Put this project on GitHub

1. Create an empty repository on GitHub.
2. Extract this download pack.
3. Open a terminal inside the extracted `next-gem` folder.
4. Run:

```bash
git init
git add .
git commit -m "Add Next GEM pitch website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Replace `YOUR-USERNAME` and `YOUR-REPOSITORY` with your own GitHub details.

## Deployment note

GitHub stores and reviews the source code. This app uses Vinext and a Cloudflare-compatible worker build, so it is not a plain static GitHub Pages site. Deploy it through ChatGPT Sites or another compatible worker host after connecting the GitHub repository.

## Main files

- `app/page.tsx` — page content and pitch interaction
- `app/globals.css` — full visual design and responsive styles
- `app/layout.tsx` — page metadata and document shell
- `public/favicon.svg` — browser icon

## Content notice

This is a concept prototype for internal discussion. Any speed, eligibility, compliance, or service statements should be validated before external or customer-facing use.
