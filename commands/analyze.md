---
description: Read-only consistency check across constitution, spec, plan and tasks
argument-hint: "[feature id]"
allowed-tools: Bash(node:*), Read, Glob, Grep
---

Run the Analyze phase. This is read-only: do not modify any file.

1. Find the feature: `$ARGUMENTS` if given, otherwise the active one.
2. Read the phase guide: `docs/sdd/analyze.md` in the project, or `${CLAUDE_PLUGIN_ROOT}/templates/sdd/analyze.md`. Follow it.
3. Read `docs/constitution.md` and the feature's `spec.md`, `plan.md` and `tasks.md`.
4. Report findings grouped by severity with location and suggested fix, and end with a verdict. Let the user decide what to change.
