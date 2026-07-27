#!/usr/bin/env python3
"""Codex lifecycle reminder: approved documentation is this project's source of truth."""

import json
import sys


SESSION_CONTEXT = (
    "Repository policy: `docs/` is the source of truth for approved business workflows "
    "and data-model decisions. Before changing implementation, use existing docs as the "
    "authority. When an approved business rule, entity, relationship, lifecycle, or "
    "implementation behavior changes, update the relevant docs in the same task. Do not "
    "invent or update business facts that the PM has not confirmed."
)

STOP_REMINDER = (
    "Documentation check: before finalizing, determine whether this turn changed an approved "
    "business workflow, data model, decision, or implementation behavior. If yes, update the "
    "relevant `docs/` source-of-truth file and mention it in the handoff. If no docs change is "
    "needed, state why briefly. Never invent unconfirmed business rules."
)


def main() -> int:
    payload = json.load(sys.stdin)
    event = payload.get("hook_event_name")

    if event == "SessionStart":
        json.dump(
            {
                "hookSpecificOutput": {
                    "hookEventName": "SessionStart",
                    "additionalContext": SESSION_CONTEXT,
                }
            },
            sys.stdout,
        )
    elif event == "Stop":
        # A Stop continuation invokes this hook again. Let that second pass finish.
        if payload.get("stop_hook_active"):
            json.dump({"continue": True}, sys.stdout)
        else:
            json.dump({"decision": "block", "reason": STOP_REMINDER}, sys.stdout)
    else:
        json.dump({"continue": True}, sys.stdout)

    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
