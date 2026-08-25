# Next GEM — GitHub Pages Pack

Latest packaged version: **v25**

This repository contains two presentation destinations:

- Pitch landing page
- Interactive customer demo (`#/demo`)

The demo uses fictional data only. Do not upload real identification or company documents.

## Publish on GitHub Pages

1. Open your GitHub repository.
2. Upload all files and folders from this pack to the repository root.
3. Commit the changes to the `main` branch.
4. Open **Settings → Pages**.
5. Under **Build and deployment**, select **GitHub Actions**.
6. Open the **Actions** tab and wait for **Deploy Next GEM to GitHub Pages** to finish.
7. Open your Pages URL, normally `https://YOUR-USERNAME.github.io/REPOSITORY-NAME/`.

For your current repository, the expected address is:

`https://geolhc.github.io/Next-GEM/`

## Replace an older version

Delete or overwrite the old website files, but keep the repository itself. Upload this pack with the same folder structure, including the hidden `.github` folder.

Important: upload the *contents* of `Next-GEM-GitHub-Pack`, not the outer folder.

## Local preview (optional)

```bash
npm install
npm run dev
```

## Notes

- The demo route uses `#/demo` so GitHub Pages can open it without a 404 error.
- `vite.config.ts` uses relative asset paths, so the site works in a project repository such as `/Next-GEM/`.
- Product links open the official external product pages.
- Inputs remain inside the browser session and are not saved by this prototype.
