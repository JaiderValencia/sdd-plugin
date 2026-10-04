# Phase: Constitution

**Goal:** record the project's non-negotiable rules in `docs/constitution.md`. Every spec, plan and task is checked against it.

**Output:** `docs/constitution.md` (use `docs/templates/constitution.md`).

## Steps
1. If `docs/constitution.md` already exists, read it and ask the user whether to update it or leave it.
2. Ask the user which mode they prefer. Do not choose for them:
   - **Guided interview:** use when the user already knows their rules or the project is new.
   - **Detect and confirm:** inspect the repo, propose a draft, and let the user confirm or correct it.
3. **Guided interview:** ask about principles (architecture, quality, security), tech stack and versions, testing policy and commands, code and naming conventions, branch/commit rules, and how deviations are approved. Ask a few questions at a time.
4. **Detect and confirm:** read README, package/build manifests, lint and format configs, CI files, test folders and folder structure. Present what you found as a draft, mark each item as detected, and ask the user to confirm, fix or remove each one. Never state a guess as a fact.
5. Write only what the user confirmed. Leave a section with a short note if nothing was decided; do not invent rules.
6. Do not include secrets, tokens or personal data.

## Done when
`docs/constitution.md` has the sections Principles, Tech Stack, Testing, Conventions and Governance, and the user has seen and confirmed the content.
