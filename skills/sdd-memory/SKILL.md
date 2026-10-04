---
name: sdd-memory
description: Rules for reading and updating MEMORY.md, the project's short running memory. Use when starting work in a project with MEMORY.md, after completing a task, or when the user asks to update the project memory.
---

# Project memory

`MEMORY.md` at the repo root keeps the state of the project between tasks so mistakes are not repeated.

## Read
At the start of work, read it to learn the current state and past decisions.

## Update
After finishing each task, update it with:
- **Current state:** what exists and works, what is in progress, what is next.
- **Key decisions:** important decisions and why they were made.
- **Findings & mistakes to avoid:** errors hit, wrong assumptions, gotchas.

## Limits
- About 100 lines; summarize or delete what no longer helps. The Stop hook warns above 120.
- Never store secrets, keys, tokens or personal data.
- If something becomes a permanent rule, propose moving it to `AGENTS.md` instead of keeping it in memory.

## Sync marker (SDD)
During an SDD feature, end the file with `<!-- sdd-sync: NNN-slug done=N -->`, where N is the number of ticked tasks in `features/NNN-slug/tasks.md`. The Stop hook blocks the turn when ticked tasks and the marker disagree. Update the marker after ticking a task and writing the memory entry.
