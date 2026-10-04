---
description: Start a feature - create branch feature/NNN-slug and write its spec
argument-hint: "<feature description>"
allowed-tools: Bash(node:*), Read, Write, Edit, Glob, Grep, AskUserQuestion, Agent
---

Run the Specify phase for: $ARGUMENTS

1. If `$ARGUMENTS` is empty, ask the user what the feature is.
2. Read the phase guide: `docs/sdd/specify.md` in the project, or `${CLAUDE_PLUGIN_ROOT}/templates/sdd/specify.md`. Follow it.
3. Create the feature with the script instead of doing it by hand: `node "${CLAUDE_PLUGIN_ROOT}/scripts/new-feature.cjs" "<short feature title>"`. It picks the next NNN, creates branch `feature/NNN-slug` and `features/NNN-slug/spec.md` from the template. Report the branch and folder. If the script says no branch was created, tell the user why.
4. Ask the user (AskUserQuestion, a few questions at a time) about everything the description leaves open. Do not invent business logic. Mark what remains unknown as `[NEEDS CLARIFICATION: ...]`.
5. Fill `spec.md` as the guide describes.
6. When done, run the `spec-reviewer` subagent on the new spec, show its findings to the user, and apply only the fixes the user agrees with.
7. Suggest `/sdd:clarify` if markers remain, otherwise `/sdd:plan`.
