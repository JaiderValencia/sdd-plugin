# Phase: Plan

**Goal:** decide HOW the feature will be built, within the constitution.

**Output:** `features/NNN-slug/plan.md` (use `docs/templates/plan.md`).

## Steps
1. Preconditions: `docs/constitution.md` and `spec.md` exist. If the spec still has `[NEEDS CLARIFICATION]` markers, tell the user and ask whether to clarify first or continue.
2. Read the constitution, the spec and `MEMORY.md`. Inspect the existing code the feature touches.
3. Ask the user about technical decisions that neither the constitution nor the spec settle (libraries, data model, integrations, trade-offs). Do not decide them silently.
4. Fill the plan: Summary, Technical Context, Constitution Check, Architecture & Design, Requirement Coverage, Risks & Open Decisions.
5. Constitution Check: for each relevant principle state "compliant" or describe the deviation and why. Deviations need the user's approval; never hide them.
6. Requirement Coverage: every `FR-xxx` in the spec must map to the component(s) that implement it. Do not add work that no requirement asks for.

## Done when
Every FR is covered, deviations are flagged and approved, and open decisions are listed. Suggest the Tasks phase.
