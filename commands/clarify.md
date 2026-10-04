---
description: Resolve ambiguities in the active feature's spec by asking you
argument-hint: "[feature id]"
allowed-tools: Bash(node:*), Read, Edit, Glob, Grep, AskUserQuestion
---

Run the Clarify phase.

1. Find the feature: `$ARGUMENTS` if given, otherwise the active one (branch `feature/NNN-slug`). If unsure, run `node "${CLAUDE_PLUGIN_ROOT}/scripts/status.cjs"`.
2. Read the phase guide: `docs/sdd/clarify.md` in the project, or `${CLAUDE_PLUGIN_ROOT}/templates/sdd/clarify.md`. Follow it.
3. Ask with AskUserQuestion, up to 4 questions per batch, most impactful first. Never answer for the user.
4. Update `features/NNN-slug/spec.md` after each batch and remove the resolved markers.
5. Suggest `/sdd:plan` when no markers remain.
