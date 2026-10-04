# Phase: Specify

**Goal:** describe WHAT the feature must do and WHY, in a testable way, without deciding HOW.

**Output:** `features/NNN-slug/spec.md` on branch `feature/NNN-slug` (use `docs/templates/spec.md`).

## Steps
1. Check that `docs/constitution.md` exists. If not, tell the user and suggest the Constitution phase first.
2. Create the feature:
   - `NNN`: next 3-digit number, one above the highest in `features/` and in existing `feature/NNN-*` branches (start at `001`).
   - `slug`: 2-5 lowercase words from the title, joined with `-`.
   - Create and switch to branch `feature/NNN-slug`, create `features/NNN-slug/`, copy the spec template to `spec.md` and fill the title, ID and date.
3. Ask the user about everything the description leaves open: actors, goals, scope limits, edge cases, error behavior, data rules, non-functional needs. Do not invent business logic. Ask a few questions at a time.
4. Fill the spec:
   - **Functional Requirements:** `- FR-001: ...`, sequential, each one testable and free of implementation details.
   - **Acceptance Criteria:** `- AC-001 (FR-001): Given ... when ... then ...`, every requirement covered by at least one.
   - **Out of Scope:** what is explicitly excluded.
5. For anything the user could not answer yet, write `[NEEDS CLARIFICATION: question]` inline and list it under Open Questions.

## Done when
All sections are filled, every FR has an acceptance criterion, and remaining unknowns are marked. Suggest the Clarify phase if markers remain, otherwise Plan.
