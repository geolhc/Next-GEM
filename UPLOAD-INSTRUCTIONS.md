# Upload to `geolhc/Next-GEM`

This pack is built for the repository's current GitHub Pages setting: **Deploy from a branch → `main` → `/docs`**.

## Before uploading

1. Delete `.github/workflows/deploy-pages.yml`. The older workflow failed during its build and is not needed when Pages deploys from `/docs`.
2. Optional cleanup: delete the old files inside `docs/assets/`. The new build uses new hashed filenames; old assets are harmless but unused.

Do not delete the repository or create a new branch.

## Upload

1. Open `https://github.com/geolhc/Next-GEM`.
2. Select **Add file → Upload files**.
3. Open this pack folder, select all files and folders inside it, and drag them into GitHub. Upload the contents, not the ZIP itself.
4. Commit directly to `main` with message: `Update Next GEM pitch and demo to version 32`.
5. Wait around 1–3 minutes, then open `https://geolhc.github.io/Next-GEM/` and refresh once with `Ctrl + F5`.

## Keep / replace / remove

- Replace: `src/`, `public/`, `docs/`, `index.html`, `package.json`, `package-lock.json`, `vite.config.ts`, `tsconfig.json`, `README.md`.
- Keep: `.gitignore` (this pack also includes the same file).
- Remove: `.github/workflows/deploy-pages.yml` if Pages remains set to `/docs`.
- Remove optional: old unreferenced files under `docs/assets/` after the new site is confirmed.

## If the page does not update

Open **Settings → Pages** and confirm:

- Source: **Deploy from a branch**
- Branch: **main**
- Folder: **/docs**

Then save and wait for the Pages deployment to complete.
