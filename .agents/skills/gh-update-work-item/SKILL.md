---
name: gh-update-work-item
description: Update exactly one existing GitHub Epic, Story, or Task issue or its existing GitHub Project fields using GitHub CLI. Use when the PM explicitly asks to change a work item's status, priority, ownership, body, hierarchy, or other confirmed tracking data.
---

# Update GitHub Work Item

Change one existing work item only. Do not create new items, alter Project settings, or edit repository docs; use the corresponding skill for those actions.

## Procedure

1. Require the PM's explicit change request and exact issue URL/number. Read the item, its parent/children, relevant approved docs, and current Project fields before proposing a change.
2. Verify `gh auth status`, explicit repository, Project owner/number, and field option IDs. Confirm the requested value exists in the target Project.
3. Confirm the change does not contradict `docs/`, which remains authoritative. If an approved decision has changed, stop and ask the PM to authorize updating the relevant document separately.
4. Apply only the named change using an explicit GitHub CLI command. Do not close, move, assign, reprioritize, alter hierarchy, or change fields not requested.
5. Re-read the issue and Project item. Report the before/after value, issue URL, Project item ID, and any doc synchronization still required.

## Constraints

- Preserve Description and Acceptance Criteria on Tasks unless the PM has approved their change.
- Do not mark a Task complete merely because code was written; its Acceptance Criteria and PM completion convention must be satisfied.
- Do not insert credentials, local exports, PII, or unapproved internal data.
