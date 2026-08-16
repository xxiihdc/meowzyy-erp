# Data and Integration Flow Patterns

Use this reference only when the proposed Epic includes a confirmed process across three or more components, or an external integration whose handoff needs clarification. Do not infer technical components from a business request.

## Rules

- Derive actors, systems, data, and sync/async behaviour from approved docs or clearly label them as open questions.
- Show a complete handoff: initiator, processing system, durable record when applicable, and returned/next state.
- Keep error, retry, reconciliation, and manual-intervention paths visible when they affect operations.
- A diagram explains a proposal; it does not approve a workflow or data model.

## Template

```mermaid
sequenceDiagram
    participant Operator
    participant ERP
    participant ExternalSystem

    Operator->>ERP: <confirmed action>
    ERP->>ExternalSystem: <confirmed request or export>
    ExternalSystem-->>ERP: <confirmed response or import result>
    ERP-->>Operator: <confirmed status>
```

## Dependency map template

```mermaid
flowchart LR
    A[<approved prerequisite>] --> B[<proposed Story or Task>]
    B --> C[<dependent Story or Task>]
```
