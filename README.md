# sdd

Spec-Driven Development (SDD) plugin for Claude Code. It guides any software project through
**constitution → specify → clarify → plan → tasks → analyze → implement**, keeps every artifact as
versioned markdown in the repo, enforces approval gates with hooks, and maintains a short
`MEMORY.md` between tasks.

Artifacts are plain markdown, and `/sdd:init` also writes the phase guides into the project, so other
agents (Codex, Cursor, etc.) can follow the same flow from `AGENTS.md`. Commands, subagents and hooks
are Claude Code only.

## Install

```bash
# from a local clone
claude --plugin-dir ./sdd-plugin
```

Requires Node.js (hooks and scripts) and Git (feature branches).

## Workflow

| Command | What it does | Output |
|---|---|---|
| `/sdd:init` | Prepares the project: phase guides, templates, `MEMORY.md`, `AGENTS.md` sections | `docs/sdd/`, `docs/templates/`, `MEMORY.md`, `AGENTS.md` |
| `/sdd:constitution` | Guided interview **or** detect-from-project + confirm | `docs/constitution.md` |
| `/sdd:specify <description>` | Creates branch `feature/NNN-slug` and the spec | `features/NNN-slug/spec.md` |
| `/sdd:clarify` | Resolves ambiguities in the spec by asking you | updates `spec.md` |
| `/sdd:plan` | Technical plan checked against the constitution | `plan.md` |
| `/sdd:tasks` | Ordered tasks referencing requirements | `tasks.md` |
| `/sdd:analyze` | Read-only consistency check across spec, plan and tasks | report |
| `/sdd:implement` | Implements task by task, updating `MEMORY.md` after each | code + ticked tasks |
| `/sdd:status` | Active feature, progress, approval and memory state | report |

Subagents: `spec-reviewer`, `plan-reviewer`, `task-implementer`, `implementation-verifier`.

## Project layout it creates

```
AGENTS.md                      # Memory + SDD workflow sections
MEMORY.md                      # Current state, decisions (with why), mistakes to avoid
docs/constitution.md
docs/sdd/<phase>.md            # Phase guides (agent-neutral, editable)
docs/templates/{spec,plan,tasks,constitution}.md
features/NNN-slug/{spec,plan,tasks}.md
```

## Conventions

- One feature = branch `feature/NNN-slug` = folder `features/NNN-slug/`.
- Requirements are `FR-001`, acceptance criteria `AC-001 (FR-001)`.
- Tasks are `- [ ] T001 Description (FR-001, FR-002)`.
- Approval: `tasks.md` has `- [ ] Approved`. **Only the user ticks it.**

## Hooks

| Event | Behavior |
|---|---|
| `SessionStart` | Injects constitution, `MEMORY.md` and the active feature state |
| `PreToolUse` (Write/Edit/MultiEdit/NotebookEdit) | Blocks source-code edits on a feature branch until `tasks.md` is approved. With no active feature it only warns (once per session). Also blocks Claude from ticking `Approved` itself |
| `PostToolUse` | Validates required sections and formats of spec, plan, tasks, constitution and `MEMORY.md` |
| `Stop` | Blocks ending the turn if tasks were completed but `MEMORY.md` was not synced (marker `<!-- sdd-sync: NNN-slug done=N -->`). Warns above ~120 lines of memory and when tasks remain pending |

Edits are never blocked in: `docs/`, `features/`, `.claude/`, `.github/`, `.vscode/`, `.idea/`,
Markdown/text files, and root-level config files (dotfiles, `*.json`, `*.yml`, `*.toml`, lockfiles,
`Dockerfile`, `Makefile`, `LICENSE*`).

### Limitations

- The gate covers Claude's file tools. Writes done through shell commands (`sed -i`, redirects) are not intercepted.
- The `Stop` block is skipped when Claude Code reports a stop hook already fired in the same turn, to avoid loops.
- Other agents do not run hooks; for them the gates are instructions in `AGENTS.md`.

## License

MIT © Jaider Valencia
