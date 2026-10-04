# Phase: Implement

**Goal:** build the feature one task at a time, keeping tasks and project memory up to date.

**Output:** code, tests, ticked tasks in `tasks.md`, updated `MEMORY.md`.

## Preconditions
- You are on branch `feature/NNN-slug`.
- `features/NNN-slug/tasks.md` contains `- [x] Approved` (ticked by the user). If not, stop and ask the user to approve.

## Loop (for each unticked task, in order)
1. Read the task, the spec, the plan, the constitution and `MEMORY.md`.
2. Implement only that task. Follow the constitution's conventions.
3. Run the tests or checks the constitution defines. Fix failures before moving on.
4. Tick the task in `tasks.md` (`- [x] T001 ...`).
5. Update `MEMORY.md`: current state, important decisions (with why), findings and mistakes to avoid. Keep it about 100 lines: summarize or drop what no longer helps, and propose moving permanent rules to `AGENTS.md`. Never store secrets or personal data.
6. End `MEMORY.md` with the marker `<!-- sdd-sync: NNN-slug done=N -->`, where N is the number of ticked tasks.

## Stop and ask the user when
- A requirement is ambiguous or the spec seems wrong.
- The plan cannot be followed as written.
- A task needs a change outside the plan.

Do not edit the spec, plan or approved tasks silently. Propose the change and wait for the user.

## Done when
All tasks are ticked, memory is synced, and every acceptance criterion has been checked against the implementation. Summarize what was built and any follow-ups.
