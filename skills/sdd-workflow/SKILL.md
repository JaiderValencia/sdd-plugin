---
name: sdd-workflow
description: Spec-Driven Development workflow, artifact paths and approval rules. Use when the user mentions SDD, specs, features, constitution, plan or tasks, or when working in a project that has docs/constitution.md or a features/ folder.
---

# SDD workflow

Phases, in order: constitution, specify, clarify (optional), plan, tasks, analyze (optional), implement. Each has a guide in `docs/sdd/<phase>.md` (project copy) or in this plugin's `templates/sdd/`. Read the guide before starting the phase.

## Artifacts
- `docs/constitution.md`: project rules.
- `features/NNN-slug/spec.md`, `plan.md`, `tasks.md`: one folder per feature, on branch `feature/NNN-slug`.
- `MEMORY.md` and `AGENTS.md` at the repo root.
- Templates in `docs/templates/`.

## Identifiers
- Requirements: `FR-001`. Acceptance criteria: `AC-001 (FR-001)`.
- Tasks: `- [ ] T001 Description (FR-001, FR-002)`.

## Rules
- Do not invent business logic. Ask the user when something is unclear and mark unknowns as `[NEEDS CLARIFICATION: ...]`.
- Do not edit source code until `tasks.md` has `- [x] Approved`. Only the user ticks that box.
- Do not change the spec, plan or approved tasks silently while implementing: propose and wait.
- After each completed task, sync `MEMORY.md` (see the `sdd-memory` skill).

## Commands
`/sdd:init`, `/sdd:constitution`, `/sdd:specify`, `/sdd:clarify`, `/sdd:plan`, `/sdd:tasks`, `/sdd:analyze`, `/sdd:implement`, `/sdd:status`.
