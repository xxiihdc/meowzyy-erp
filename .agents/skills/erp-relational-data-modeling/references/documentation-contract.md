# Data-model documentation contract

Create these files only when there is an approved workflow to document.

```text
docs/data-model/
  README.md             # scope, glossary, source of truth, open questions
  entities.md           # one section per entity
  relationships.mmd     # Mermaid ERD
  lifecycle.md          # state transitions and correction/audit policy
```

Use this entity template:

```md
## <Entity>

- Purpose:
- Row grain:
- Owner / source of truth:
- Primary key:
- External identifiers:
- Important attributes:
- Relations:
- Invariants and constraints:
- Lifecycle / mutability:
- Audit and access considerations:
- Open questions:
```

For an ERD, show only approved entities and relationships. Annotate uncertain relationships with `TODO` outside the diagram; do not present assumptions as schema facts.
