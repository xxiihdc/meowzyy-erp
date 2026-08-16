---
name: epic
description: Decompose a PM-approved Meowzyy ERP business outcome into a proposed Epic → Story → Task hierarchy, grounded in approved repository docs. Use when a PM asks to scope an Epic, map a delivery hierarchy, or prepare Epic content; use gh-create-work-item separately only when the PM explicitly authorizes creating one GitHub item.
---

# Plan an ERP Epic

Turn an approved business outcome into a small, traceable delivery hierarchy. This skill plans and documents only; it does not create GitHub issues, change Project fields, or implement code.

## Authority and boundaries

- Read `AGENTS.md` and relevant `docs/` first. `docs/` is authoritative for approved workflows, business rules, and data-model decisions.
- Treat the PM's stated request and confirmed decisions as the only source for new scope. Do not invent business rules, roles, acceptance criteria, integrations, owners, priorities, estimates, or dates.
- If the workflow is not confirmed, use `erp-business-discovery` before proposing implementation or data-model work.
- Do not change code, migrations, configuration, Figma, GitHub issues, GitHub Project items, or approved documentation under this skill.
- Do not inspect secrets or `.env*` files.

## Procedure

1. Establish the target outcome, business scope, success measure, exclusions, and the approved documents that support it. If any are missing and material, list focused open questions.
2. Inspect existing documentation and implementation only to distinguish observed capabilities from proposed work. Never promote an inference to an approved fact.
3. Propose one Epic and decompose it into Stories. Each Story must deliver independently reviewable operational value for a named role or process.
4. Decompose each Story into Tasks only when implementation-ready detail is available. A Task must be concrete and verifiable, with explicit scope/exclusions and dependencies or risks.
5. Identify dependencies and risks. Keep the graph acyclic and do not assume a fixed technical layer order; derive dependencies from the approved workflow and existing architecture.
6. Produce the output below. Mark every unconfirmed item as **Open question** or **Assumption for PM confirmation**.
7. If the PM authorizes creating an item, hand off to `gh-create-work-item`. That skill creates exactly one approved Epic, Story, or Task and adds it to the specified GitHub Project. Use `gh-link-doc-ticket` only if the PM separately authorizes linking one existing ticket in one document.

## Output

```markdown
# Proposed Epic: <outcome>

## Outcome
<business result>

## Scope
- <included>

## Success measures
- <confirmed measure>

## Exclusions
- <not included>

## Evidence
- Approved docs: <path and heading>
- Observed implementation: <path, if relevant>

## Proposed Stories

### Story 1 — <user or operational value>
As a <role>, I want <capability> so that <outcome>.

Scope / exclusions:
- <confirmed boundaries>

Tasks:
1. <concrete task>
   - Acceptance criteria: <observable, testable condition>
   - Dependencies / risks: <only known items>

## Dependency map
<short ordered list or Mermaid flowchart when it materially clarifies three or more dependencies>

## Open questions
- <PM decision needed before planning or implementation>
```

## Quality checks

Before presenting the proposal, verify:

1. Each claimed business fact is supported by the PM request or an approved document.
2. The Epic states outcome, scope, success measures, and exclusions.
3. Every Story names a role/process and a valuable outcome.
4. Every Task is independently actionable and has at least one verifiable acceptance criterion.
5. Dependencies have no cycle and no GitHub item is implied to exist.
6. Unresolved decisions are separated from approved facts.

## Optional references

- Read [epic-template.md](references/epic-template.md) for the output scaffold.
- Read [data-flow-patterns.md](references/data-flow-patterns.md) only when a data or integration flow needs visual clarification.
