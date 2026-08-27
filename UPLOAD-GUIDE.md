# Simple upload guide

Target repository: https://github.com/geolhc/Next-GEM

## Upload

1. Open the repository and choose **Add file → Upload files**.
2. Open the extracted `Next-GEM-GitHub-Pack` folder.
3. Select **all files and folders inside it** and drag them into GitHub.
4. Keep the branch as `main`, add a message such as `Update latest Next GEM site`, then choose **Commit changes**.

You do not need to delete the old files first. Uploading this complete pack will replace files with the same names. If GitHub still shows unrelated old files afterward, remove only those files in a separate commit.

## Turn on the website

1. Open **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Open the **Actions** tab and wait for `Deploy Next GEM to GitHub Pages` to show a green tick.
4. Visit: https://geolhc.github.io/Next-GEM/

Demo link: https://geolhc.github.io/Next-GEM/demo/

## Important

- Upload the contents of the folder, not the outer folder itself.
- Keep `.github/workflows/deploy-pages.yml`; it performs the automatic deployment.
- Do not upload `node_modules`, `.next`, `out`, or ZIP files into the repository.
