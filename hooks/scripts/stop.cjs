'use strict';
const lib = require('../../lib/sdd.cjs');

const input = lib.readInput();
// A stop hook already blocked this turn: let it end to avoid loops.
if (input.stop_hook_active) process.exit(0);

const root = lib.findRoot(input.cwd || process.cwd());
const feature = lib.activeFeature(root);
if (!feature.id || !feature.exists) process.exit(0);

const s = lib.featureState(root, feature);
if (!s.hasTasks || !s.approved) process.exit(0);

const tooLong = s.memory.lines > lib.MEMORY_SOFT_LIMIT;
const lengthNote = `MEMORY.md has ${s.memory.lines} lines; condense it to ~100 (drop what no longer helps, promote permanent rules to AGENTS.md).`;

if (s.done > 0 && !s.memory.synced) {
  const reason = [
    `SDD: ${s.done} task(s) are ticked in features/${s.id}/tasks.md but MEMORY.md is not synced.`,
    'Update MEMORY.md now: current state, important decisions (with why), findings and mistakes to avoid. Keep it ~100 lines, no secrets or personal data.',
    `Then end the file with the marker: <!-- sdd-sync: ${s.id} done=${s.done} -->`,
    tooLong ? lengthNote : null,
  ]
    .filter(Boolean)
    .join('\n');
  lib.emit({ decision: 'block', reason });
  process.exit(0);
}

const notes = [];
if (tooLong) notes.push(lengthNote);
if (s.done > 0 && s.pending.length) {
  notes.push(`SDD: ${s.done}/${s.total} tasks done on ${s.id}; ${s.pending.length} pending (next: ${s.pending[0].id}).`);
}
if (notes.length) lib.emit({ systemMessage: notes.join(' ') });
process.exit(0);
