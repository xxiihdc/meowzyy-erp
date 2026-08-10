#!/usr/bin/env python3
"""Codex lifecycle reminder: approved documentation is this project's source of truth."""

import json
import hashlib
import subprocess
import sys
from pathlib import Path, PurePosixPath


SESSION_CONTEXT = (
    "Repository policy: `docs/` is the source of truth for approved business workflows "
    "and data-model decisions. Before changing implementation, use existing docs as the "
    "authority. When an approved business rule, entity, relationship, lifecycle, or "
    "implementation behavior changes, update the relevant docs in the same task. Do not "
    "invent or update business facts that the PM has not confirmed."
)

STOP_REMINDER = (
    "Docs: code or migration changed. Update `docs/` only if approved behaviour or data rules "
    "changed; do not invent business facts."
)

CODE_SUFFIXES = {".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".py", ".go", ".java", ".rb", ".php", ".cs"}
STATE_DIRECTORY = Path("/private/tmp/codex-docs-hook")


def working_tree_files() -> dict[str, str]:
    """Return a content-aware snapshot of changed worktree files."""
    result = subprocess.run(
        ["git", "status", "--porcelain=v1", "-z"],
        check=False,
        capture_output=True,
        text=False,
    )
    if result.returncode:
        return {}

    snapshot = {}
    entries = result.stdout.decode("utf-8", errors="replace").split("\0")
    index = 0
    while index < len(entries):
        entry = entries[index]
        index += 1
        if len(entry) < 4:
            continue
        path = entry[3:]
        if entry[0] in {"R", "C"} or entry[1] in {"R", "C"}:
            index += 1  # Ignore the old path supplied by porcelain's rename/copy entry.
        normalized = PurePosixPath(path).as_posix()
        if normalized.startswith(".codex/"):
            continue
        file_path = Path(normalized)
        if file_path.is_file():
            snapshot[normalized] = hashlib.sha256(file_path.read_bytes()).hexdigest()
        else:
            snapshot[normalized] = "missing"
    return snapshot


def is_implementation_file(path: str) -> bool:
    file_path = PurePosixPath(path)
    return "migrations" in file_path.parts or file_path.suffix in CODE_SUFFIXES


def session_state_path(payload: dict) -> Path:
    session_id = str(payload.get("session_id", "default"))
    safe_session_id = "".join(character for character in session_id if character.isalnum() or character in {"-", "_"})
    return STATE_DIRECTORY / f"{safe_session_id or 'default'}.json"


def has_new_implementation_changes(payload: dict) -> bool:
    """Detect code or migration edits since this session's last lifecycle checkpoint."""
    state_path = session_state_path(payload)
    current = working_tree_files()
    try:
        previous = json.loads(state_path.read_text())
    except (FileNotFoundError, json.JSONDecodeError):
        previous = current

    STATE_DIRECTORY.mkdir(parents=True, exist_ok=True)
    state_path.write_text(json.dumps(current, sort_keys=True))
    return any(
        is_implementation_file(path) and current.get(path) != previous.get(path)
        for path in current
    )


def main() -> int:
    payload = json.load(sys.stdin)
    event = payload.get("hook_event_name")

    if event == "SessionStart":
        has_new_implementation_changes(payload)
        json.dump(
            {
                "hookSpecificOutput": {
                    "hookEventName": "SessionStart",
                    "additionalContext": SESSION_CONTEXT,
                }
            },
            sys.stdout,
        )
    elif event == "Stop" and has_new_implementation_changes(payload):
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
