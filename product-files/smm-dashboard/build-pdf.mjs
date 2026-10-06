// Builds how-to-use.pdf from how-to-use.html.
//
// Usage:
//   TEMPLATE_URL="https://your-notion-template-link" node build-pdf.mjs
//
// TEMPLATE_URL is optional. When it's set, the guide includes a clickable
// "Duplicate the template" button. When it's not, the guide tells buyers to use
// the link in their purchase email instead.
//
// Requires Playwright (`npm i -D playwright`) and a Chromium install.

import { readFile, writeFile, rm } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import { chromium } from "playwright";

const dir = path.dirname(fileURLToPath(import.meta.url));
const templateUrl = (process.env.TEMPLATE_URL || "").trim();

const escape = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

let html = await readFile(path.join(dir, "how-to-use.html"), "utf8");
html = html
  .replace(
    "__TEMPLATE_LINK_SENTENCE__",
    templateUrl
      ? "Click the button below (or the template link in your purchase email). The template opens as a page in your browser."
      : "Click the template link in your purchase email. The template opens as a page in your browser."
  )
  .replace(
    "__TEMPLATE_BUTTON__",
    templateUrl
      ? `<p style="margin:4pt 0 14pt 30pt"><a class="button" href="${escape(templateUrl)}">Duplicate the template →</a></p>` +
        `<p style="margin:-6pt 0 14pt 30pt;font-size:8.5pt;color:var(--ink-soft)">Or copy this link: <a href="${escape(templateUrl)}">${escape(templateUrl)}</a></p>`
      : ""
  );

const tmp = path.join(dir, ".how-to-use.build.html");
await writeFile(tmp, html);

const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}
);
try {
  const page = await browser.newPage();
  await page.goto(pathToFileURL(tmp).href, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({
    path: path.join(dir, "how-to-use.pdf"),
    format: "Letter",
    printBackground: true,
    preferCSSPageSize: true,
  });
} finally {
  await browser.close();
  await rm(tmp, { force: true });
}

console.log("Wrote how-to-use.pdf");
