---
description: Break the plan into ordered tasks (T001 ... with FR references) for your approval
argument-hint: "[feature id]"
allowed-tools: Bash(node:*), Read, Write, Edit, Glob, Grep
---

Run the Tasks phase.

1. Find the feature: `$ARGUMENTS` if given, otherwise the active one. Require `spec.md` and `plan.md`; if missing, say which phase to run first.
2. Read the phase guide: `docs/sdd/tasks.md` in the project, or `${CLAUDE_PLUGIN_ROOT}/templates/sdd/tasks.md`. Follow it.
3. Create `features/NNN-slug/tasks.md` from `docs/templates/tasks.md` (or `${CLAUDE_PLUGIN_ROOT}/templates/tasks.md`). Task format: `- [ ] T001 Description (FR-001, FR-002)`.
4. Make sure every requirement of the spec is referenced by at least one task.
5. Leave `- [ ] Approved` unticked. Tell the user to review `tasks.md` and tick it themselves; you must not tick it (a hook blocks it). Source-code edits stay blocked until then.
