---
description: Prepare this project for SDD (phase guides, templates, MEMORY.md, AGENTS.md sections)
allowed-tools: Bash(node:*), Read
---

Prepare the current project for Spec-Driven Development.

1. Run: `node "${CLAUDE_PLUGIN_ROOT}/scripts/init.cjs"`
2. The script is idempotent: it never overwrites existing files, refreshes the managed SDD block in `AGENTS.md`, and keeps any existing Memory section.
3. Report the script output to the user in a short list of what was created, skipped or needs attention.
4. If the output says there is no constitution, suggest `/sdd:constitution` as the next step.
