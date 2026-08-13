---
name: gh-create-work-item
description: Create exactly one approved Epic, Story, or Task as a GitHub issue and add it to a specified GitHub Project using GitHub CLI. Use when the PM explicitly asks to create a new work item, with a concise reader-ready description and, for a Task, verifiable acceptance criteria.
---

# Create GitHub Work Item

Create one item only. Do not update existing items, alter Project settings, or edit repository docs; use the corresponding skill for those actions.

## Procedure

1. Read `AGENTS.md` and the approved `docs/` files named by the PM. Require explicit authorization to create the item.
2. Verify `gh auth status`, repository, Project owner/number, and existing Project fields. Confirm `project` scope when the issue must be added to a Project.
3. Identify exactly one type and its parent reference:
   - **Epic:** outcome, scope, success measure, and exclusions.
   - **Story:** role, desired capability, outcome, scope, and parent Epic.
   - **Task:** Description, testable Acceptance Criteria, scope/exclusions, dependencies or risks, and parent Story.
4. Draft the issue body below. Do not invent owners, priorities, dates, estimates, labels, acceptance criteria, or business facts. Ask the PM when they are missing and material.
5. Create the issue with explicit `--repo`. When it has an approved parent, create the native GitHub hierarchy in the same operation with `gh issue create --parent <number>` or immediately afterwards with `gh issue edit <child> --parent <parent>`. Text references such as `Parent Story: #<number>` do not replace the native relationship.
6. Add the issue to the specified Project with `gh project item-add`. Set only fields that already exist and whose values were confirmed.
7. Re-read the issue and Project item, confirm the native parent/sub-issue relationship, then report the issue URL/number, parent link, Project item ID, and values set.

## Issue-body templates

### Epic

```markdown
## Outcome

## Scope

## Success measures

## Exclusions

## References
- Approved docs: <link>
```

### Story

```markdown
## User / operational value
As a <role>, I want <capability> so that <outcome>.

## Description

## Scope / exclusions

## Dependencies and risks

## References
- Parent Epic: #<number>
- Approved docs: <link>
```

### Task

```markdown
## Description

## Acceptance Criteria
- [ ] <observable, testable condition>

## Scope / exclusions

## Dependencies and risks

## References
- Parent Story: #<number>
- Approved docs/spec/plan: <link>
```

Never place credentials, local exports, PII, or unapproved internal data in the issue.
