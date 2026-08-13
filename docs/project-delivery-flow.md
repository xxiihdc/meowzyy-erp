# Project delivery flow

## Purpose and authority

- `docs/` remains the source of truth for approved business workflows, data-model decisions and implementation behavior.
- GitHub Projects is the PM-facing backlog and delivery tracker. It records hierarchy, status and executable work; it does not replace the approved decisions in `docs/`.
- Figma is the source of visual reference for approved UI work. It does not establish business rules, data-model facts or implementation scope on its own.

## GitHub Projects workflow

1. After PM confirms enough scope to track, create or update the appropriate work item: Epic for a business outcome, Story for an independently valuable slice, and Task for verifiable work.
2. Each Task states a description, testable acceptance criteria, scope/exclusions, dependencies or risks, parent Story and references to the authoritative docs/spec.
3. The relevant document contains a short `GitHub tracking` reference only after the real item exists.
4. When a PM-approved decision changes scope or acceptance criteria, update the docs and propose the matching work-item update for PM confirmation.
5. Move/close a Project item only after the requested work is verified; do not infer status from a code diff alone.

## Figma-to-UI workflow

1. PM supplies the Figma file URL and the target page, frame or node. If the target is not identified, developer asks for it before treating canvas content as required UI.
2. Developer reads the target using the Figma plugin and records the file URL plus node/frame reference in the GitHub Task.
3. Developer compares the design with the approved business workflow and task scope. A conflict or missing business behavior is escalated to PM.
4. After explicit implementation approval, developer implements the agreed UI, validates the specified states and reports the Figma reference actually used.
5. Any change to an approved UI requirement is reflected in its Figma reference and/or task only after PM confirmation; implementation and tracking are then kept in sync.

## Current reference

- GitHub tracking: [Epic #1](https://github.com/xxiihdc/meowzyy-erp/issues/1) · [Story #3](https://github.com/xxiihdc/meowzyy-erp/issues/3) · [Task #5](https://github.com/xxiihdc/meowzyy-erp/issues/5).
- Figma design file: [meowzyy-erp](https://www.figma.com/design/CHBknBlcjsk3m1ioGXA5BW/meowzyy-erp?t=gFHAEVoKFCaq8LG9-0).
- The file currently has a page named `Page 1`; no target UI frame/node has been approved for implementation yet.
