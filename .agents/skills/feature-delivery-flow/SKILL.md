---
name: feature-delivery-flow
description: Drive one project feature from a PM request through business discovery, SpecKit specification, clarification, planning, task validation, approved implementation, and convergence. Use when the PM wants an end-to-end feature workflow, wants SpecKit steps coordinated automatically, or asks to resume such a workflow after answering a blocking question.
---

# Feature Delivery Flow

Coordinate one feature at a time. Treat `docs/` as the authority for approved workflows and data-model decisions, and the PM as the authority for new or changed business facts.

## Operating rules

- Read the relevant `docs/` artifacts and `.specify/memory/constitution.md` before deciding scope or changing implementation.
- Never invent or record an unconfirmed business rule, entity, relationship, lifecycle, or implementation behavior as fact.
- Ask only when an unanswered decision materially affects scope, data, security, acceptance criteria, or implementation. Ask one focused question at a time unless the invoked SpecKit skill requires a different format.
- Stop after every blocking question. On the PM's next reply, resume the active feature from its artifacts; do not recreate completed artifacts or start another feature.
- Do not write application code, migrations, configuration, accounts, or external changes until the PM explicitly approves implementation after seeing the plan and tasks.
- When a PM-approved business rule, workflow, entity, relationship, lifecycle, or implementation behavior changes, update the applicable `docs/` artifact in the same task. Do not make that update before PM confirmation.
- Do not use parallel agents for this workflow. Its stages are stateful and depend on the same active feature artifacts.
- GitHub Projects is the PM-facing tracker. Once the scope is approved enough to track, create or update the appropriate Epic, Story, or Task only with PM authorization; establish the native GitHub parent/sub-issue relationship for Epic → Story → Task and link the approved artefacts back to that work item. Body-text references alone are not sufficient hierarchy.
- For UI work, Figma is the approved visual reference when a PM supplies a Figma link or node. Read the target through the Figma plugin before planning or implementation; record the file URL and target node/frame in the task. Figma must not be used to invent business rules.

## Workflow

1. **Establish context.** Identify whether this is a new request or a continuation from `.specify/feature.json` and its feature directory. Read the feature artifacts that exist, the relevant approved documents in `docs/workflows/` and `docs/data-model/`, and the constitution. Report the current stage and the smallest next action.

2. **Discover the business slice.** For shop operations, marketplace integration, catalog, SKU, inventory, pricing, orders, fulfilment, returns, reconciliation, reporting, or access roles, invoke `$erp-business-discovery` before technical design. Confirm the workflow slice, roles, inputs and outputs, rules, exceptions, exclusions, and completion criteria. If the request needs a changed business workflow, have the PM approve it before treating it as source of truth in `docs/`.

3. **Specify and clarify.** For a new feature, invoke `$speckit-specify` with the PM's request. Invoke `$speckit-clarify` when the specification has a material ambiguity or the specify step leaves clarification work. Let these skills manage their required interactive formats. Do not proceed while a required clarification remains open.

4. **Model and plan.** When the confirmed workflow introduces or changes relational data rules, invoke `$erp-relational-data-modeling` before planning and update the appropriate `docs/data-model/` files only with approved facts. Then invoke `$speckit-plan`. For a technical library, SDK, framework, cloud service, API, CLI, or version-sensitive decision, fetch current official documentation through Context7 before finalizing that decision.

5. **Make the work executable.** Invoke `$speckit-tasks`, then `$speckit-analyze`. Resolve any artifact inconsistency before implementation; ask the PM when resolving it changes scope, business facts, or a meaningful trade-off. Create or update the approved GitHub Projects work item and add its reference to the relevant artefact. For UI work, include the inspected Figma file URL and target node/frame in the task. Summarize the agreed scope, key decisions, risks, and task count.

6. **Approval gate.** Ask the PM for explicit approval to implement the validated plan. A feature request alone is not implementation approval. State which feature artifacts will guide the work and call out any pending assumption. Stop here until the PM approves.

7. **Implement and converge.** After explicit approval, invoke `$speckit-implement`. Invoke `$speckit-converge` afterward. If convergence appends tasks, invoke `$speckit-implement` again and repeat until it reports convergence. If a new material business decision appears, stop and ask the PM rather than guessing.

8. **Hand off.** Report delivered behavior, updated documents, verification performed, GitHub tracking, Figma references reviewed for UI work, remaining assumptions or out-of-scope work, and the smallest sensible next step.

## Status format

At each stop or completion, state: active feature, completed stages, current blocker or next stage, and whether implementation approval is required. End every PM-facing response with:

```text
Tools / agents / skills đã sử dụng: <tên và mục đích ngắn, hoặc N/A>
Tối ưu flow: <N/A, hoặc vấn đề + phương pháp ngắn gọn>
```
