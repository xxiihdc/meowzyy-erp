import { mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { chromium } from "@playwright/test";

const args = process.argv.slice(2);
const valueFor = (name, fallback) => {
  const index = args.indexOf(name);
  return index === -1 ? fallback : args[index + 1];
};

const url = valueFor("--url");
const output = valueFor("--output");
const width = Number(valueFor("--width", "1440"));
const height = Number(valueFor("--height", "1100"));

if (!url || !output || !Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1) {
  throw new Error("Usage: node capture-screenshot.mjs --url <url> --output <file.png> [--width <px>] [--height <px>]");
}

await mkdir(dirname(output), { recursive: true });
const browser = await chromium.launch({ headless: true });

try {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.screenshot({ path: output, fullPage: true });
  console.log(output);
} finally {
  await browser.close();
}
