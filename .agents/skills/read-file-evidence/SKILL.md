---
name: read-file-evidence
description: Inspect repository files to map their structure, extract directly supported facts, and record explicitly labelled hypotheses. Use when a PM or developer needs an accurate orientation of a codebase, docs tree, data model, workflow, specification, migration, or unfamiliar file set, especially before planning or changing implementation.
---

# Read File Evidence

Produce an evidence-first orientation note. Treat `docs/` as the authority for approved Meowzyy ERP business workflows and data-model decisions; never promote an inference to an approved fact.

## Workflow

1. Define the target files and the question being answered. Inspect repository status first; do not modify implementation files.
2. Inventory the target with `rg --files`, then read the most authoritative files first:
   - approved workflow and data-model decisions in `docs/`;
   - relevant feature artefacts in `specs/`;
   - implementation, migrations, and configuration only to describe observed behaviour.
3. Extract facts with file paths and, where practical, headings or line references. For code, describe what it does without assuming the original intent.
4. Separate findings into exactly these classes:
   - **Observed facts:** directly supported by a file.
   - **Interpretations / hypotheses:** a reasoned explanation; include supporting evidence and confidence (`low`, `medium`, or `high`).
   - **Open questions:** facts that must be confirmed before a business or implementation decision.
5. When requested to persist output, create `docs/analysis/<yyyy-mm-dd>-<slug>.md` using [the report template](references/report-template.md). Add a clear non-authoritative notice. Do not edit approved workflow or data-model documents merely because analysis suggests a change.
6. Report the scope inspected, key findings, and any files deliberately excluded (such as secrets, generated files, dependencies, or binary assets).

## Safety and quality rules

- Do not read or reproduce secrets from `.env*`, credentials, keys, or private exports. Record only that such files were excluded when relevant.
- Prefer direct evidence over broad conclusions. Cite conflicting evidence rather than resolving it by guesswork.
- Keep each report focused on one question. Link to prior analysis instead of copying it.
- Treat generated files, `node_modules/`, `.next/`, package stores, and lockfiles as non-authoritative unless the question specifically concerns them.
- If the target includes Supabase, distinguish schema declared in migrations from a database instance actually verified as applied.
- Do not write code, migrations, or business facts as part of analysis.
