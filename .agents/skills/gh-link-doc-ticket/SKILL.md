---
name: gh-link-doc-ticket
description: Add or validate exactly one GitHub Epic, Story, or Task reference in one approved Meowzyy ERP document. Use when a PM asks to connect a document in docs/ or a feature artifact to an existing GitHub ticket without changing the ticket itself.
---

# Link Documentation to Ticket

Edit one document-to-ticket reference only. Do not create or update GitHub items, and do not change the document's business or technical decision.

## Procedure

1. Read `AGENTS.md`, the target document, and the existing GitHub issue using read-only GitHub CLI commands. Confirm the issue exists and is the right Epic, Story, or Task for the document.
2. Require an explicit PM request before editing the document. If linking implies a new business fact, scope change, or acceptance criterion, stop for PM confirmation.
3. Add or update one concise line near the document's scope or status section:

   ```markdown
   GitHub tracking: [Epic #12](https://github.com/<owner>/<repo>/issues/12) · [Story #18](https://github.com/<owner>/<repo>/issues/18) · [Task #23](https://github.com/<owner>/<repo>/issues/23)
   ```

   Include only items that exist and directly track this document. Use a stable GitHub issue URL; do not paste issue-body content into `docs/`.
4. Verify the Markdown link and diff. Report the document path and exact linked issue references.

## Constraints

- `docs/` remains the source of truth for approved workflows and data-model decisions; the ticket provides human-readable delivery tracking only.
- Do not add links to unrelated or historical analysis notes merely for coverage.
- Do not edit GitHub, implementation, migrations, or Project fields.
