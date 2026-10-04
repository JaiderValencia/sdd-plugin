<!-- sdd:begin (managed by the sdd plugin; edit outside this block) -->
## SDD Workflow

This project uses Spec-Driven Development. Follow the phases in order and read the phase guide before starting each one.

| Phase | Guide | Output |
|---|---|---|
| Constitution | `docs/sdd/constitution.md` | `docs/constitution.md` |
| Specify | `docs/sdd/specify.md` | `features/NNN-slug/spec.md` |
| Clarify (optional) | `docs/sdd/clarify.md` | updates `spec.md` |
| Plan | `docs/sdd/plan.md` | `features/NNN-slug/plan.md` |
| Tasks | `docs/sdd/tasks.md` | `features/NNN-slug/tasks.md` |
| Analyze (optional) | `docs/sdd/analyze.md` | report only |
| Implement | `docs/sdd/implement.md` | code + ticked tasks |

Rules:
- One feature = one branch `feature/NNN-slug` = one folder `features/NNN-slug/`.
- Do not invent business logic: ask the user whenever a requirement is unclear.
- Do not write source code until `features/NNN-slug/tasks.md` contains `- [x] Approved`. Only the user ticks that box.
- Templates live in `docs/templates/`.

### Memory sync
After finishing each task: tick it in `tasks.md`, then update `MEMORY.md` and end that file with the marker `<!-- sdd-sync: NNN-slug done=N -->`, where N is the number of ticked tasks. In Claude Code a Stop hook enforces this.
<!-- sdd:end -->
