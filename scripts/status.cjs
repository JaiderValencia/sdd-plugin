#!/usr/bin/env node
'use strict';
const path = require('path');
const lib = require('../lib/sdd.cjs');

const root = lib.findRoot(process.cwd());
const arg = process.argv[2];
const feature = lib.resolveFeature(root, arg);
const out = [];

const constitution = lib.readText(path.join(root, lib.CONSTITUTION)) !== null;
out.push(`Constitution: ${constitution ? 'docs/constitution.md' : 'missing (run /sdd:constitution)'}`);

if (!feature) {
  const branch = lib.currentBranch(root);
  out.push(arg ? `Feature "${arg}" not found in features/.` : `No active feature (branch: ${branch || 'none'}). Start one with /sdd:specify.`);
  const memory = lib.readText(path.join(root, lib.MEMORY_FILE));
  out.push(`Memory: ${memory === null ? 'MEMORY.md missing (run /sdd:init)' : `${lib.lineCount(memory)} lines`}`);
  console.log(out.join('\n'));
  process.exit(0);
}

const s = lib.featureState(root, feature);
out.push(`Feature: ${s.id}${feature.branch ? ` (branch ${feature.branch})` : ''}`);
out.push(`Spec:  ${s.hasSpec ? `yes, ${s.requirements.length} requirement(s), ${s.openClarifications} open clarification(s)` : 'missing'}`);
out.push(`Plan:  ${s.hasPlan ? 'yes' : 'missing'}`);
out.push(`Tasks: ${s.hasTasks ? `${s.done}/${s.total} done, ${s.approved ? 'APPROVED' : 'not approved'}` : 'missing'}`);

if (s.hasTasks && s.pending.length) {
  out.push(`Next:  ${s.pending[0].id} ${s.pending[0].text}`);
}

const m = s.memory;
const memState = !m.exists ? 'MEMORY.md missing' : `${m.lines} lines${m.lines > lib.MEMORY_SOFT_LIMIT ? ' (over the ~120 soft limit)' : ''}`;
out.push(`Memory: ${memState}${s.done > 0 ? `, ${m.synced ? 'synced' : 'NOT synced with ticked tasks'}` : ''}`);

let step;
if (!s.hasSpec) step = 'Run /sdd:specify.';
else if (s.openClarifications) step = 'Run /sdd:clarify.';
else if (!s.hasPlan) step = 'Run /sdd:plan.';
else if (!s.hasTasks) step = 'Run /sdd:tasks.';
else if (!s.approved) step = 'Review tasks.md and tick "- [x] Approved" yourself.';
else if (s.pending.length) step = 'Run /sdd:implement.';
else step = 'All tasks done: verify acceptance criteria and merge.';
out.push(`Next step: ${step}`);

console.log(out.join('\n'));
