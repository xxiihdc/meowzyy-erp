---
name: erp-relational-data-modeling
description: Turn a PM-approved ERP workflow into a documented relational data model, including entity definitions, relationships, constraints, lifecycle, audit needs, and Mermaid ERD. Use after business rules are confirmed for orders, catalog, SKU, inventory, pricing, fulfilment, reconciliation, returns, reporting, or marketplace data.
---

# ERP Relational Data Modeling

Model approved business rules before implementation. PostgreSQL and Supabase are implementation choices; they do not replace a documented domain model.

## Prerequisite

Read the approved workflow or ask for it. If purpose, ownership, key business rules, lifecycle, or scope are unconfirmed, return to `$erp-business-discovery`; do not invent schema details.

## Workflow

1. Establish a glossary and define the grain of each entity: what exactly does one row represent?
2. Identify entities, identifiers, ownership, relationships, optionality, and cardinality.
3. Record invariants, state transitions, derived values, source of truth, correction policy, and audit requirements.
4. Decide constraints before columns: unique keys, foreign keys, checks, nullability, immutable facts, and many-to-many bridge tables.
5. Document the model in `docs/data-model/` using the contract in [references/documentation-contract.md](references/documentation-contract.md), including an ERD Mermaid diagram.
6. Clearly label pending decisions. Do not generate migrations, SQL, RLS policies, or APIs unless explicitly requested.

## Modeling rules

- Give every table one business meaning; avoid generic catch-all tables and ambiguous status fields.
- Store facts required for history (e.g. captured prices or addresses) rather than recomputing them from mutable records.
- Model inventory movements as append-only events when traceability matters; do not treat a balance alone as the audit trail.
- Use an explicit bridge table for many-to-many relationships when the relationship has attributes or lifecycle.
- Separate marketplace external IDs from internal IDs; define their uniqueness scope.
- Treat money, timestamps, time zones, and status transitions as explicit business decisions.
- Identify sensitive fields and the roles allowed to read or change them. RLS design comes after the ownership model is clear.

## Deliverable checklist

- Entity glossary, row grain, primary keys and external identifiers
- Relationship/cardinality rules and Mermaid ERD
- Constraints and lifecycle/state transitions
- Source of truth, audit and correction policy
- Assumptions, open questions and explicitly out-of-scope items
