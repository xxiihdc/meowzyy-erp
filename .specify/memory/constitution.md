<!--
Sync Impact Report
- Version change: 0.1.0 → 0.1.1
- Modified principles: none.
- Added sections: none.
- Removed sections: none.
- Follow-up TODOs: none.
-->
# Meowzyy ERP Constitution

## Core Principles

### I. Business Workflow Before Features
Every change MUST begin by identifying the operating problem, current and desired workflow,
actors, inputs, outputs, business rules, exceptions, and success measures. The smallest valuable
business slice MUST be agreed before technical design or implementation begins. This keeps the ERP
aligned with how the shop actually operates rather than encoding untested assumptions.

### II. Explicit PM Authority for Business Facts
The PM owns scope, priorities, business rules, and trade-offs. The team MUST NOT invent business
facts, including marketplace mappings, lifecycle rules, data definitions, or permissions. Unresolved
facts that could change the design MUST be surfaced for PM decision. This preserves a clear,
auditable source for operational decisions.

### III. Documentation Is the Approved Source of Truth
The `docs/` directory is authoritative for approved workflows and data-model decisions.
Implementation work MUST use those documents as its authority. When an approved business rule,
entity, relationship, lifecycle, or implementation behavior changes, the relevant document MUST be
updated in the same task. This keeps product intent and software behavior synchronized.

### IV. Deliberate, Safe Implementation
No application code, migration, configuration, account, or system change may be made unless the PM
explicitly requests implementation. Each technical decision MUST state its rationale, trade-offs,
and an extension path when relevant. Designs MUST favor simple, modular, readable solutions over
premature optimization, unnecessary architecture, or dependencies. This protects data correctness
and keeps future change affordable.

### V. Data Integrity, Security, and Traceability
Data-handling changes MUST preserve correctness, safety, and a durable audit trail where the
approved workflow requires it. Authorization, sensitive data, edit history, import/export behavior,
and external-service limits MUST be confirmed before designs that depend on them are finalized.
Free services may be used only when they do not compromise correctness, data safety, or long-term
evolution. This is essential for financial and marketplace operations.

## Data Authority and Technical Boundaries

Approved operating workflows and relational-model decisions belong in `docs/`; implementation
artifacts do not override them. The intended web stack is Next.js with Supabase for database,
authentication, storage, and suitable backend services. Before decisions involving Supabase
authentication, RLS, database, storage, realtime, Edge Functions, or plan limits, the team MUST
consult current official documentation. The same applies to material decisions involving current
Next.js behavior. Technology choices remain subordinate to an approved business slice.

## Delivery Workflow

1. The PM states the operating problem or goal.
2. The developer summarizes the workflow, exposes unknown rules and risks, and proposes the
   smallest viable slice.
3. The PM confirms scope, business rules, and completion criteria.
4. The developer documents a concise technical approach, including data, security, and trade-offs
   requiring a PM decision.
5. Only after an explicit implementation request may the developer change code, migrations, or
   configuration.
6. On completion, the developer reports delivered work, verification, open assumptions, and the
   next appropriate step.

Before the first feature is built, the PM and developer MUST establish the planned marketplace
integrations, prioritized business domains, shared glossary, MVP success criteria and exclusions,
and expectations for access control, sensitive data, audit history, and import/export. Missing
items that could alter design MUST be resolved or explicitly deferred by the PM.

## Governance

This constitution governs project delivery. Approved documents in `docs/` govern business facts
within their scope; this constitution governs how those facts are discovered, approved, and carried
into implementation. Amendments require an explicit PM decision, a documented rationale, a
semantic-version increment, and same-task updates to affected approved documentation.

Versioning follows semantic intent: MAJOR for incompatible removal or redefinition of governance,
MINOR for a new principle or materially expanded governance, and PATCH for clarification,
wording, or typo-only changes. Every specification, plan, task list, implementation review, and
release decision MUST verify compliance with the applicable principles. Any exception requires a
documented PM approval and a defined follow-up or expiry condition.

**Version**: 0.1.1 | **Ratified**: 2026-08-03 | **Last Amended**: 2026-08-03
