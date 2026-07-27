---
name: erp-business-discovery
description: Clarify and scope an ERP operating workflow before proposing features, schema, APIs, or UI. Use when discussing shop operations such as orders, products, inventory, pricing, fulfilment, reconciliation, returns, reporting, marketplace integrations, or access roles.
---

# ERP Business Discovery

Treat the PM's operational reality as the source of truth. Do not create code, database migrations, configuration, or accounts unless explicitly asked.

## Workflow

1. State the operating problem and the smallest valuable workflow slice in plain Vietnamese.
2. Capture only unknowns that affect the workflow: actors, trigger, inputs, steps, outputs, business rules, exceptions, ownership, and measurable outcome.
3. Separate facts confirmed by the PM from assumptions and open questions. Never silently turn an assumption into a rule.
4. Define an acceptance boundary: what is included now, deliberately excluded, and the criteria for completion.
5. Only after the PM confirms the above, propose a concise technical approach. Hand off to `$erp-relational-data-modeling` only when its data rules are ready.

## Minimum discovery record

Use this structure in `docs/` when the PM asks for documentation:

```md
# <Workflow name>

## Goal
## Scope
## Actors and responsibilities
## Current and desired flow
## Inputs and outputs
## Business rules
## Exceptions and manual handling
## Metrics / completion criteria
## Confirmed decisions
## Open questions
```

## Guardrails

- Ask one focused question at a time when a missing decision materially changes the design.
- Prefer an explicit manual exception to inventing automation.
- Flag terms that need a shared definition, especially order, SKU, variant, available stock, physical stock, revenue, cost, and profit.
- Do not decide marketplace integration, retention, permissions, or financial calculations without PM confirmation.
