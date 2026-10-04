'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const lib = require('../../lib/sdd.cjs');

const input = lib.readInput();
const root = lib.findRoot(input.cwd || process.cwd());
const ti = input.tool_input || {};
const filePath = ti.file_path || ti.notebook_path;
if (!filePath) process.exit(0);

const { exempt, rel } = lib.classifyPath(root, filePath);

const deny = (reason) => {
  lib.emit({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'deny',
      permissionDecisionReason: reason,
    },
  });
  process.exit(0);
};

// Claude must not tick the approval checkbox: only the user approves tasks.
if (/^features\/[^/]+\/tasks\.md$/.test(rel)) {
  const current = lib.readText(path.resolve(root, filePath));
  const wasApproved = current !== null && lib.isApproved(current);
  let becomesApproved = false;
  if (input.tool_name === 'Write') {
    becomesApproved = lib.isApproved(ti.content || '');
  } else if (input.tool_name === 'Edit') {
    becomesApproved = lib.isApproved(ti.new_string || '') && !lib.isApproved(ti.old_string || '');
  } else if (input.tool_name === 'MultiEdit') {
    becomesApproved = (ti.edits || []).some(
      (e) => lib.isApproved(e.new_string || '') && !lib.isApproved(e.old_string || ''),
    );
  }
  if (!wasApproved && becomesApproved) {
    deny('Only the user can approve tasks. Ask them to review tasks.md and tick "- [x] Approved" themselves.');
  }
}

if (exempt) process.exit(0);

const feature = lib.activeFeature(root);

if (!feature.id || !feature.exists) {
  const flag = path.join(os.tmpdir(), `sdd-warned-${String(input.session_id || 'nosession').replace(/\W/g, '')}`);
  if (fs.existsSync(flag)) process.exit(0);
  try {
    fs.writeFileSync(flag, '1');
  } catch {}
  const msg =
    'SDD: no active feature (expected branch feature/NNN-slug with a matching features/NNN-slug/ folder). ' +
    'Code edits are not gated here. Use /sdd:specify to start a feature the SDD way.';
  lib.emit({
    systemMessage: msg,
    hookSpecificOutput: { hookEventName: 'PreToolUse', additionalContext: msg },
  });
  process.exit(0);
}

const tasksText = lib.readText(path.join(feature.dir, 'tasks.md'));
if (tasksText === null) {
  deny(
    `SDD gate: features/${feature.id}/tasks.md does not exist. Complete specify, plan and tasks first (/sdd:specify, /sdd:plan, /sdd:tasks) before editing source code.`,
  );
}
if (!lib.isApproved(tasksText)) {
  deny(
    `SDD gate: features/${feature.id}/tasks.md is not approved. Ask the user to review it and tick "- [x] Approved" before any source-code edit.`,
  );
}
process.exit(0);
