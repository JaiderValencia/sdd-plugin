'use strict';
const fs = require('fs');
const path = require('path');
const lib = require('../../lib/sdd.cjs');

const input = lib.readInput();
const root = lib.findRoot(input.cwd || process.cwd());

const cap = (text, max) => {
  const lines = text.replace(/\n+$/, '').split('\n');
  return lines.length > max ? lines.slice(0, max).join('\n') + `\n... (truncated, ${lines.length - max} more lines)` : lines.join('\n');
};

const parts = [];
const constitution = lib.readText(path.join(root, lib.CONSTITUTION));
const memory = lib.readText(path.join(root, lib.MEMORY_FILE));
const initialized = fs.existsSync(path.join(root, 'docs', 'sdd'));

if (!initialized && constitution === null && memory === null) {
  parts.push('SDD plugin is installed but this project is not initialized. Suggest running /sdd:init if the user wants Spec-Driven Development.');
} else {
  if (constitution !== null) parts.push(`## Project constitution (docs/constitution.md)\n${cap(constitution, 150)}`);
  if (memory !== null) parts.push(`## Project memory (MEMORY.md)\n${cap(memory, 200)}`);

  const feature = lib.activeFeature(root);
  if (feature.id && feature.exists) {
    const s = lib.featureState(root, feature);
    const next = s.pending[0];
    const gate = !s.hasTasks
      ? 'tasks.md missing'
      : s.approved
        ? 'tasks approved, implementation allowed'
        : 'tasks NOT approved, source-code edits are blocked until the user ticks "- [x] Approved"';
    parts.push(
      [
        `## Active SDD feature: ${s.id}`,
        `Files: spec.md ${s.hasSpec ? 'yes' : 'no'}, plan.md ${s.hasPlan ? 'yes' : 'no'}, tasks.md ${s.hasTasks ? 'yes' : 'no'}`,
        `Gate: ${gate}`,
        `Progress: ${s.done}/${s.total} tasks done` + (next ? `; next: ${next.id} ${next.text}` : ''),
        s.openClarifications ? `Unresolved clarifications in spec: ${s.openClarifications}` : null,
      ]
        .filter(Boolean)
        .join('\n'),
    );
  } else if (feature.branch) {
    parts.push(`## SDD\nNo active feature (branch "${feature.branch}"). Features live on branches feature/NNN-slug.`);
  }
}

if (!parts.length) process.exit(0);
lib.emit({
  hookSpecificOutput: {
    hookEventName: 'SessionStart',
    additionalContext: parts.join('\n\n'),
  },
});
