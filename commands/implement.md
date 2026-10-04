---
description: Implement the approved tasks one by one, syncing MEMORY.md after each
argument-hint: "[task id or 'all']"
allowed-tools: Bash, Read, Write, Edit, MultiEdit, Glob, Grep, AskUserQuestion, Agent
---

Run the Implement phase. Scope: `$ARGUMENTS` (a task id like T003, or empty/"all" for every pending task).

1. Read the phase guide: `docs/sdd/implement.md` in the project, or `${CLAUDE_PLUGIN_ROOT}/templates/sdd/implement.md`. Follow it.
2. Preconditions: you are on `feature/NNN-slug` and its `tasks.md` contains `- [x] Approved`. If not, stop and ask the user to review and tick it. Never tick it yourself.
3. For each pending task, in order:
   - Delegate it to the `task-implementer` subagent, passing the task id and text, the feature folder, and the points of `MEMORY.md` relevant to it. The subagent returns a summary of changes, tests run and any decisions or surprises.
   - Check the result yourself. If it failed or hit an ambiguity, stop and ask the user.
   - Tick the task in `tasks.md`.
   - Update `MEMORY.md` yourself (not the subagent): current state, important decisions with why, findings and mistakes to avoid. About 100 lines, no secrets. Finish the file with `<!-- sdd-sync: NNN-slug done=N -->` where N is the number of ticked tasks. A Stop hook blocks the turn if this is missing.
4. After the last task, run the `implementation-verifier` subagent, show its report, and ask the user how to handle any gap.
5. Do not change spec, plan or approved tasks without the user's decision.
