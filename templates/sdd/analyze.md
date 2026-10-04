# Phase: Analyze

**Goal:** check that constitution, spec, plan and tasks agree with each other. Read-only: do not modify any file.

**Output:** a report in the conversation.

## Checks
1. Spec requirements without acceptance criteria.
2. Requirements not covered in the plan's Requirement Coverage table.
3. Requirements not referenced by any task; tasks that reference unknown requirements.
4. Plan or tasks work that no requirement asks for (scope creep).
5. Plan decisions that conflict with the constitution, or deviations not marked in the Constitution Check.
6. Unresolved `[NEEDS CLARIFICATION]` markers.
7. Inconsistent terms, names or numbers across the documents.
8. Tasks out of dependency order.

## Report
Group findings by severity (**Blocker**, **Warning**, **Note**). For each: where it is, what is wrong, and a suggested fix. End with a verdict: ready to implement, or what must change first. Let the user decide which fixes to apply.
