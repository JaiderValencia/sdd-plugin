'use strict';
const path = require('path');
const lib = require('../../lib/sdd.cjs');

const input = lib.readInput();
const root = lib.findRoot(input.cwd || process.cwd());
const filePath = (input.tool_input || {}).file_path;
if (!filePath) process.exit(0);

const abs = path.resolve(root, filePath);
const rel = path.relative(root, abs).split(path.sep).join('/');
const text = lib.readText(abs);
if (text === null) process.exit(0);

let label;
let result;
const featureFile = rel.match(/^features\/(\d{3}-[^/]+)\/(spec|plan|tasks)\.md$/);

if (featureFile) {
  label = rel;
  const dir = path.dirname(abs);
  if (featureFile[2] === 'spec') result = lib.validateSpec(text);
  else if (featureFile[2] === 'plan') result = lib.validatePlan(text);
  else result = lib.validateTasks(text, lib.readText(path.join(dir, 'spec.md')));
} else if (rel === lib.CONSTITUTION.split(path.sep).join('/')) {
  label = rel;
  result = lib.validateConstitution(text);
} else if (rel === lib.MEMORY_FILE) {
  label = rel;
  result = lib.validateMemory(text);
} else {
  process.exit(0);
}

const { errors, warnings } = result;
if (errors.length) {
  const reason =
    `SDD format check failed for ${label}:\n- ${errors.join('\n- ')}\n` +
    'Fix the file following the template in docs/templates/ (or the plugin templates).' +
    (warnings.length ? `\nAlso: ${warnings.join('; ')}` : '');
  lib.emit({ decision: 'block', reason });
} else if (warnings.length) {
  lib.emit({
    hookSpecificOutput: {
      hookEventName: 'PostToolUse',
      additionalContext: `SDD notes for ${label}: ${warnings.join('; ')}`,
    },
  });
}
process.exit(0);
