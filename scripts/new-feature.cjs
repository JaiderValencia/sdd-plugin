#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const lib = require('../lib/sdd.cjs');

const args = process.argv.slice(2);
const noBranch = args.includes('--no-branch');
const title = args.filter((a) => a !== '--no-branch').join(' ').trim();

if (!title) {
  console.error('Usage: new-feature.cjs [--no-branch] "<feature title>"');
  process.exit(1);
}

const root = lib.findRoot(process.cwd());

const slug = title
  .normalize('NFD')
  .replace(/[̀-ͯ]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, ' ')
  .trim()
  .split(/\s+/)
  .slice(0, 5)
  .join('-')
  .slice(0, 40)
  .replace(/-+$/, '');

if (!slug) {
  console.error('Could not derive a slug from the title.');
  process.exit(1);
}

const numbers = [];
const featuresBase = path.join(root, lib.FEATURES_DIR);
if (fs.existsSync(featuresBase)) {
  for (const n of fs.readdirSync(featuresBase)) {
    const m = n.match(/^(\d{3})-/);
    if (m) numbers.push(Number(m[1]));
  }
}
const inRepo = lib.isGitRepo(root);
if (inRepo) {
  const branches = lib.git(root, ['branch', '--list', '--format=%(refname:short)', 'feature/*']) || '';
  for (const b of branches.split('\n')) {
    const m = b.match(/^feature\/(\d{3})-/);
    if (m) numbers.push(Number(m[1]));
  }
}
const next = String((numbers.length ? Math.max(...numbers) : 0) + 1).padStart(3, '0');
const id = `${next}-${slug}`;
const branch = `${lib.BRANCH_PREFIX}${id}`;
const dir = path.join(featuresBase, id);

if (fs.existsSync(dir)) {
  console.error(`Feature folder already exists: features/${id}`);
  process.exit(1);
}

let branchCreated = false;
let branchNote = null;
if (noBranch) {
  branchNote = 'branch creation skipped (--no-branch)';
} else if (!inRepo) {
  branchNote = 'not a git repository: no branch created';
} else if (lib.git(root, ['checkout', '-b', branch]) === null) {
  console.error(`Could not create branch ${branch}. Nothing was created.`);
  process.exit(1);
} else {
  branchCreated = true;
}

fs.mkdirSync(dir, { recursive: true });
const template = lib.readTemplate(root, 'spec.md') || '# Feature Spec: {{TITLE}}\n';
const date = new Date().toISOString().slice(0, 10);
const spec = template.replace(/\{\{TITLE\}\}/g, title).replace(/\{\{ID\}\}/g, id).replace(/\{\{DATE\}\}/g, date);
fs.writeFileSync(path.join(dir, 'spec.md'), spec);

console.log(
  JSON.stringify(
    { id, title, branch, branchCreated, branchNote, dir: `features/${id}`, spec: `features/${id}/spec.md` },
    null,
    2,
  ),
);
