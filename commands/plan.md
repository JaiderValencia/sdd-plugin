---
description: Write the technical plan for the active feature, checked against the constitution
argument-hint: "[feature id]"
allowed-tools: Bash(node:*), Read, Write, Edit, Glob, Grep, AskUserQuestion, Agent
---

Run the Plan phase.

1. Find the feature: `$ARGUMENTS` if given, otherwise the active one. If there is none, tell the user to run `/sdd:specify` first.
2. Read the phase guide: `docs/sdd/plan.md` in the project, or `${CLAUDE_PLUGIN_ROOT}/templates/sdd/plan.md`. Follow it.
3. Check preconditions (constitution and spec exist; open `[NEEDS CLARIFICATION]` markers need the user's decision).
4. Ask the user (AskUserQuestion) about technical decisions that the constitution and spec do not settle. Do not decide them silently.
5. Create `features/NNN-slug/plan.md` from `docs/templates/plan.md` (or `${CLAUDE_PLUGIN_ROOT}/templates/plan.md`) and fill it in.
6. Run the `plan-reviewer` subagent, show its findings, and apply only what the user agrees with.
7. Suggest `/sdd:tasks`.
