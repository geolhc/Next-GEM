# Next GEM — Business Banking Onboarding

GitHub-ready version of the Next GEM pitch website and interactive customer demo.

## Included

- Final holographic Next GEM branding and full wordmark
- One-screen elevator-pitch landing page
- Three-part presentation mode
- Seven-stage interactive onboarding demo
- EN / TC / SC language switching
- Next GEM AI capability simulation and guided autofill
- Optional personal-profile connection or manual entry
- Company ID and director mapping concept
- KYC document-pack and selective video-verification simulation
- Masked fictional account details
- AI-tailored business and personal product journeys
- Responsive desktop and mobile layouts

## Important demo notes

- This is a fictional prototype. It does not connect to a bank system, government records, CorpID, iAM Smart or a live LLM.
- Inputs remain in the current browser session only.
- The document control reads filenames for the demo; it does not upload or store file contents.
- Do not enter real customer or personal information.

## Run locally

Requires Node.js 22 or later.

```bash
npm install
npm run dev
```

Open the local address shown in the terminal.

## Build

```bash
npm run build
```

The deployable static website is generated in `dist/`.

## Publish with GitHub Pages

1. Create a new GitHub repository.
2. Upload all files from this pack to the repository root.
3. Commit or push to the `main` branch.
4. In GitHub, open **Settings → Pages**.
5. Under **Build and deployment**, set **Source** to **GitHub Actions**.
6. Open the **Actions** tab and wait for “Deploy Next GEM to GitHub Pages” to finish.

The workflow in `.github/workflows/deploy-pages.yml` builds and publishes the site automatically after each push to `main`.

## Routes

- Pitch: `#/`
- Customer demo: `#/demo`

Hash-based routes are used so the demo works reliably from a GitHub Pages repository subpath.

## Main files

- `src/Home.tsx` — landing and pitch presentation
- `src/Demo.tsx` — interactive customer journey
- `src/styles.css` — responsive visual system
- `public/` — finalized branding and product images

## Product links

The demo contains external links to official product-information pages. Product descriptions in the prototype should be reviewed before any formal or public presentation.
