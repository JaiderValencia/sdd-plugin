---
description: Create or update docs/constitution.md (guided interview or detect-and-confirm)
argument-hint: "[interview | detect]"
allowed-tools: Read, Write, Edit, Glob, Grep, AskUserQuestion
---

Run the Constitution phase.

1. Read the phase guide: `docs/sdd/constitution.md` in the project, or `${CLAUDE_PLUGIN_ROOT}/templates/sdd/constitution.md` if the project copy does not exist. Follow it.
2. Mode: `$ARGUMENTS`. If it is empty or unclear, ask the user with AskUserQuestion which mode they want: **guided interview** (they already know their rules) or **detect from the project and confirm**. Do not choose for them.
3. Use `docs/templates/constitution.md` (or `${CLAUDE_PLUGIN_ROOT}/templates/constitution.md`) as the structure.
4. Write `docs/constitution.md` only with content the user confirmed.
