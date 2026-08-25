# Next GEM — GitHub Pages static update

This pack publishes the already-built website from the visible `docs` folder.
It does **not** run `npm ci` or `npm run build`, so it avoids Node, Vite, and
lockfile conflicts in GitHub Actions.

## One-time repair

1. In the GitHub repository, open **Actions**.
2. Open the failing **Deploy Next GEM to GitHub Pages** workflow.
3. Select the **•••** menu and choose **Disable workflow**.
4. Return to **Code**.

## Upload this version

1. Unzip this pack on your computer.
2. In the repository, choose **Add file → Upload files**.
3. Drag the complete `docs` folder into the upload area.
4. Commit directly to the `main` branch.

If GitHub does not accept the folder itself, open the repository's existing
`docs` folder (or create it), then upload all files inside this pack's `docs`
folder while preserving the `assets` and `products` subfolders.

## Select the correct Pages source

1. Open **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
3. Select branch **main** and folder **/docs**.
4. Select **Save**.
5. Wait about 1–3 minutes, then open:
   `https://geolhc.github.io/Next-GEM/`

Customer demo:
`https://geolhc.github.io/Next-GEM/#/demo`

## Future updates

Replace the contents of `docs` with the new compiled website and commit to
`main`. No npm build or custom GitHub Actions workflow is required.
