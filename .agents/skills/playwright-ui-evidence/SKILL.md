---
name: playwright-ui-evidence
description: Capture reproducible screenshots of local Meowzyy ERP routes with Playwright for UI verification. Use when validating a UI implementation against Figma, producing an issue-ready screenshot, or checking a desktop/mobile route before delivery.
---

# Playwright UI Evidence

Use the included script to capture a local route after implementation.

## Workflow

1. Read the approved docs and Figma target first. Do not infer business states from a visual mockup.
2. Start the local app and wait until the requested route responds.
3. Install the direct Playwright dependency and Chromium only when absent:

   ```bash
   pnpm add -D @playwright/test
   pnpm exec playwright install chromium
   ```

4. Capture a desktop screenshot. Use the approved target viewport when specified; otherwise use `1440x1100`.

   ```bash
   node .agents/skills/playwright-ui-evidence/scripts/capture-screenshot.mjs \
     --url http://127.0.0.1:3000/capital \
     --output artifacts/ui/capital-desktop.png
   ```

5. Inspect the image. Record what was verified and any limitation in the relevant issue or analysis note.
6. Keep screenshots out of commits by default. Only commit/push a screenshot when the PM explicitly requests an issue-visible, repository-hosted image. Do not include customer, order, credential, or other sensitive data.

## Script contract

- `--url` is required.
- `--output` is required and is created with parent directories.
- `--width` and `--height` are optional; defaults are `1440` and `1100`.
- The script waits for network idle, then captures the full page in Chromium.
