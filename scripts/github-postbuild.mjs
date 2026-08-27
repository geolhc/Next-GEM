import { readdir, readFile, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outputDirectory = fileURLToPath(new URL("../out/", import.meta.url));
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "/Next-GEM";
const textExtensions = new Set([".html", ".css", ".js", ".json", ".txt", ".xml"]);

async function rewrite(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      await rewrite(path);
      continue;
    }
    if (!textExtensions.has(extname(entry.name))) continue;
    const source = await readFile(path, "utf8");
    const updated = source
      .replaceAll('"/verification-specialist.png"', `"${basePath}/verification-specialist.png"`)
      .replaceAll("url('/next-gem-brand.png')", `url('${basePath}/next-gem-brand.png')`);
    if (updated !== source) await writeFile(path, updated);
  }
}

await rewrite(outputDirectory);
