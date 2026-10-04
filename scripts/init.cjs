#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const lib = require('../lib/sdd.cjs');

const root = lib.findRoot(process.cwd());
const report = [];

const rel = (p) => path.relative(root, p).split(path.sep).join('/');

function mkdir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    report.push(`created  ${rel(dir)}/`);
  }
}

function copyIfMissing(src, dest) {
  if (fs.existsSync(dest)) {
    report.push(`skipped  ${rel(dest)} (already exists)`);
    return;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  report.push(`created  ${rel(dest)}`);
}

const tpl = (...p) => path.join(lib.PLUGIN_ROOT, 'templates', ...p);

mkdir(path.join(root, lib.FEATURES_DIR));
const keep = path.join(root, lib.FEATURES_DIR, '.gitkeep');
if (!fs.existsSync(keep) && fs.readdirSync(path.join(root, lib.FEATURES_DIR)).length === 0) {
  fs.writeFileSync(keep, '');
}

for (const f of fs.readdirSync(tpl('sdd'))) {
  copyIfMissing(tpl('sdd', f), path.join(root, 'docs', 'sdd', f));
}
for (const f of ['spec.md', 'plan.md', 'tasks.md', 'constitution.md']) {
  copyIfMissing(tpl(f), path.join(root, 'docs', 'templates', f));
}
copyIfMissing(tpl('MEMORY.md'), path.join(root, lib.MEMORY_FILE));

// AGENTS.md: user-owned Memory section (only if absent) + managed SDD block (refreshed).
const agentsPath = path.join(root, 'AGENTS.md');
let agents = lib.readText(agentsPath);
const created = agents === null;
if (created) agents = '# AGENTS.md\n';

const hasMemorySection = /^##\s+(Memory|Memoria)\b/m.test(agents);
const block = fs.readFileSync(tpl('agents-block.md'), 'utf8').trimEnd();
const blockRe = /<!-- sdd:begin[\s\S]*?<!-- sdd:end -->/;
const original = agents;

if (blockRe.test(agents)) {
  agents = agents.replace(blockRe, () => block);
  if (!hasMemorySection) {
    agents = agents.replace(blockRe, () => fs.readFileSync(tpl('agents-memory.md'), 'utf8').trimEnd() + '\n\n' + block);
  }
} else {
  const memory = hasMemorySection ? '' : fs.readFileSync(tpl('agents-memory.md'), 'utf8').trimEnd() + '\n\n';
  agents = agents.trimEnd() + '\n\n' + memory + block + '\n';
}

if (agents !== original) {
  fs.writeFileSync(agentsPath, agents.endsWith('\n') ? agents : agents + '\n');
  report.push(`${created ? 'created ' : 'updated '} AGENTS.md (SDD Workflow block${hasMemorySection ? '; existing Memory section kept' : ' + Memory section'})`);
} else {
  report.push('skipped  AGENTS.md (already up to date)');
}

if (!lib.isGitRepo(root)) {
  report.push('warning  not a git repository: /sdd:specify cannot create feature branches until you run "git init"');
}
if (lib.readText(path.join(root, lib.CONSTITUTION)) === null) {
  report.push('next     run /sdd:constitution to create docs/constitution.md');
}

console.log(report.join('\n'));
