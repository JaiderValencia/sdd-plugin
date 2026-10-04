# Phase: Tasks

**Goal:** break the plan into ordered, small, verifiable tasks.

**Output:** `features/NNN-slug/tasks.md` (use `docs/templates/tasks.md`).

## Format
```
- [ ] T001 Description (FR-001, FR-002)
```
- IDs are sequential (`T001`, `T002`, ...) and unique.
- Every task ends with the requirements it serves in parentheses.
- Ordered by dependency: a task never needs one listed after it.
- One task = one small change that can be verified (tests pass, behavior observable).
- Include the tests the constitution requires, as tasks of their own or inside the task they verify.

## Steps
1. Preconditions: `spec.md` and `plan.md` exist.
2. Read spec, plan and constitution. Create one or more tasks for each component in the plan.
3. Check coverage: every `FR-xxx` is referenced by at least one task and no task references an unknown FR.
4. Leave `- [ ] Approved` unticked. Tell the user to review the tasks and tick it themselves. Never tick it on their behalf.

## Done when
The file follows the format, coverage is complete, and the user has been asked to review and approve. Implementation is not allowed until the box is ticked.
