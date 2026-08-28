#!/usr/bin/env bash
# gate.sh — deterministic stage-entry gate (INV-1a + mechanical gate checks).
#   Usage: bash scripts/gate.sh <stage 2..8> [workshop-root]
#   Exit 0 = the stage may start. Exit 2 = BLOCKED (reason on stderr).
#
# This is the hard, non-probabilistic form of the pipeline contract's
# prerequisite checks: a stage must not start unless the previous stage's
# artifact file actually exists (and blueprint has no open [BLOCKER]s).
set -uo pipefail
STAGE="${1:-}"; ROOT="${2:-$PWD}"
cd "$ROOT" 2>/dev/null || { echo "BLOCKED: workshop root not found: $ROOT" >&2; exit 2; }
[ -n "$STAGE" ] || { echo "Usage: gate.sh <stage 2..8> [root]" >&2; exit 2; }

need() { # need <file> <producing-stage>
  [ -f "$1" ] && return 0
  echo "BLOCKED (INV-1a): required artifact '$1' from stage $2 does not exist — do not start stage $STAGE. Produce/repair the artifact first." >&2
  exit 2
}

case "$STAGE" in
  2) need brief.yaml "1 (intake)" ;;
  3) need brief.yaml "1"; need artifacts/02-feature-facts.md "2 (research)" ;;
  4)
    need artifacts/02-feature-facts.md "2"
    need artifacts/03-blueprint.md "3 (blueprint)"
    if grep -q '\[BLOCKER\]' artifacts/03-blueprint.md 2>/dev/null; then
      echo "BLOCKED (GATE-3a/3e): artifacts/03-blueprint.md still contains [BLOCKER] items — close them before generation." >&2
      exit 2
    fi
    ;;
  5) need artifacts/03-blueprint.md "3"; [ -d docs ] || { echo "BLOCKED: docs/ missing — run generation (4) first." >&2; exit 2; } ;;
  6) need artifacts/03-blueprint.md "3"
     [ -d docs/.vitepress/dist ] || echo "note: no build output found — persona review should read a built site (run stage 5)." >&2 ;;
  7) need artifacts/06-persona-review.md "6 (persona review)" ;;
  8) need artifacts/07-qa-report.md "7 (QA)" ;;
  *) echo "Usage: gate.sh <stage 2..8> [root]" >&2; exit 2 ;;
esac

echo "gate ok: stage $STAGE may start"
exit 0
