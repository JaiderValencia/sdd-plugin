# Phase: Clarify

**Goal:** remove ambiguity from `spec.md` before planning, by asking the user.

**Output:** an updated `features/NNN-slug/spec.md`.

## Steps
1. Read the spec and the constitution.
2. Find gaps: `[NEEDS CLARIFICATION]` markers, vague words ("fast", "secure", "easy"), requirements that cannot be tested, missing actors, undefined edge cases or error behavior, conflicts between requirements, unstated data rules.
3. Ask the user, a few questions at a time (up to about 10 in total), most impactful first. Offer concrete options when possible, but let the user answer freely. Never answer on the user's behalf.
4. After each batch, update the spec: rewrite the affected requirement or criterion, remove the resolved marker, and record the decision under Open Questions > Resolved.
5. If the answers change the scope, update Out of Scope too.

## Done when
No `[NEEDS CLARIFICATION]` markers remain, or the user explicitly chose to leave some open (keep them marked). Suggest the Plan phase.
