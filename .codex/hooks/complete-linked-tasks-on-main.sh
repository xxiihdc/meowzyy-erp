#!/usr/bin/env bash
set -u

# Complete only explicitly linked Task issues after a successful push to origin/main.
# Required commit footer: Closes #<issue>, Fixes #<issue>, or Resolves #<issue>.
# API failures are reported but never turn a completed git push into a failure.

project_owner="${TASK_COMPLETION_PROJECT_OWNER:-xxiihdc}"
project_number="${TASK_COMPLETION_PROJECT_NUMBER:-2}"
project_id="${TASK_COMPLETION_PROJECT_ID:-PVT_kwHOBT05Vs4BgOar}"
status_field_id="${TASK_COMPLETION_STATUS_FIELD_ID:-PVTSSF_lAHOBT05Vs4BgOarzhabpKw}"
done_option_id="${TASK_COMPLETION_DONE_OPTION_ID:-98236657}"

remote_name="${1:-}"
remote_url="${2:-}"

if [[ "$remote_name" != "origin" ]] || [[ "$remote_url" != *"xxiihdc/meowzyy-erp"* ]]; then
  exit 0
fi

issues_file="$(mktemp "${TMPDIR:-/tmp}/meowzyy-completed-issues.XXXXXX")"
trap 'rm -f "$issues_file"' EXIT

while read -r local_ref local_sha remote_ref remote_sha; do
  [[ "$remote_ref" == "refs/heads/main" ]] || continue
  [[ "$local_sha" != "0000000000000000000000000000000000000000" ]] || continue

  if [[ "$remote_sha" == "0000000000000000000000000000000000000000" ]]; then
    revision_range="$local_sha"
  else
    revision_range="${remote_sha}..${local_sha}"
  fi

  git log --format=%B "$revision_range" | perl -ne 'while (/(?:close[sd]?|fix(?:e[sd])?|resolve[sd]?)\s*:?\s*#(\d+)/ig) { print "$1\n" }' >> "$issues_file"
done

sort -u "$issues_file" | while read -r issue_number; do
  [[ -n "$issue_number" ]] || continue

  issue_json="$(gh issue view "$issue_number" --repo xxiihdc/meowzyy-erp --json state,title 2>/dev/null)" || {
    echo "Task completion hook: could not read issue #$issue_number; leaving it unchanged." >&2
    continue
  }

  issue_state="$(jq -r '.state' <<< "$issue_json")"
  issue_title="$(jq -r '.title' <<< "$issue_json")"
  if [[ "$issue_state" != "OPEN" ]] || [[ "$issue_title" != Task:* ]]; then
    continue
  fi

  item_id="$(gh project item-list "$project_number" --owner "$project_owner" --format json --limit 100 2>/dev/null | jq -r --argjson issue "$issue_number" '.items[] | select(.content.type == "Issue" and .content.number == $issue) | .id' | head -n 1)"
  if [[ -n "$item_id" && "$item_id" != "null" ]]; then
    if [[ "${TASK_COMPLETION_DRY_RUN:-0}" == "1" ]]; then
      echo "Task completion hook (dry run): mark #$issue_number Done and close it." >&2
      continue
    fi
    gh project item-edit --id "$item_id" --project-id "$project_id" --field-id "$status_field_id" --single-select-option-id "$done_option_id" >/dev/null 2>&1 || echo "Task completion hook: could not mark #$issue_number Done." >&2
  fi

  if [[ "${TASK_COMPLETION_DRY_RUN:-0}" == "1" ]]; then
    echo "Task completion hook (dry run): close #$issue_number." >&2
    continue
  fi
  gh issue close "$issue_number" --repo xxiihdc/meowzyy-erp --reason completed >/dev/null 2>&1 || echo "Task completion hook: could not close #$issue_number." >&2
done
