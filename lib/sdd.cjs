'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const FEATURES_DIR = 'features';
const CONSTITUTION = path.join('docs', 'constitution.md');
const MEMORY_FILE = 'MEMORY.md';
const MEMORY_SOFT_LIMIT = 120;
const BRANCH_PREFIX = 'feature/';
const FEATURE_ID_RE = /^\d{3}-[a-z0-9]+(?:-[a-z0-9]+)*$/;
const EXEMPT_DIRS = new Set(['docs', 'features', '.claude', '.github', '.vscode', '.idea', '.sdd']);
const PLUGIN_ROOT = path.resolve(__dirname, '..');

function git(cwd, args) {
  try {
    return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return null;
  }
}

const isGitRepo = (cwd) => git(cwd, ['rev-parse', '--is-inside-work-tree']) === 'true';
const findRoot = (cwd) => git(cwd, ['rev-parse', '--show-toplevel']) || cwd;
const currentBranch = (root) => git(root, ['symbolic-ref', '--short', 'HEAD']);

function readText(file) {
  try {
    return fs.readFileSync(file, 'utf8');
  } catch {
    return null;
  }
}

function readTemplate(root, name) {
  const projectCopy = readText(path.join(root, 'docs', 'templates', name));
  return projectCopy !== null ? projectCopy : readText(path.join(PLUGIN_ROOT, 'templates', name));
}

function activeFeature(root) {
  const branch = currentBranch(root);
  const out = { branch, id: null, dir: null, exists: false };
  if (!branch || !branch.startsWith(BRANCH_PREFIX)) return out;
  const id = branch.slice(BRANCH_PREFIX.length);
  if (!FEATURE_ID_RE.test(id)) return out;
  const dir = path.join(root, FEATURES_DIR, id);
  out.id = id;
  out.dir = dir;
  out.exists = fs.existsSync(dir);
  return out;
}

function resolveFeature(root, idOrPrefix) {
  if (!idOrPrefix) {
    const active = activeFeature(root);
    return active.exists ? active : null;
  }
  const base = path.join(root, FEATURES_DIR);
  let names = [];
  try {
    names = fs.readdirSync(base).filter((n) => FEATURE_ID_RE.test(n));
  } catch {
    return null;
  }
  const hit = names.find((n) => n === idOrPrefix) || names.find((n) => n.startsWith(idOrPrefix));
  return hit ? { branch: null, id: hit, dir: path.join(base, hit), exists: true } : null;
}

function sectionText(text, heading) {
  const lines = text.split('\n');
  const re = new RegExp('^##\\s+' + heading + '\\b', 'i');
  const start = lines.findIndex((l) => re.test(l));
  if (start === -1) return null;
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (/^##\s+/.test(lines[i])) {
      end = i;
      break;
    }
  }
  return lines.slice(start + 1, end).join('\n');
}

const hasSection = (text, heading) => sectionText(text, heading) !== null;
const uniq = (arr) => [...new Set(arr)];

function parseTasks(text) {
  const tasks = [];
  const re = /^\s*-\s*\[( |x|X)\]\s+(T\d{3})\b(.*)$/;
  for (const line of text.split('\n')) {
    const m = line.match(re);
    if (!m) continue;
    tasks.push({
      id: m[2],
      done: m[1].toLowerCase() === 'x',
      text: m[3].trim(),
      frs: uniq(m[3].match(/FR-\d{3}/g) || []),
      refsOk: /\(\s*FR-\d{3}(?:\s*,\s*FR-\d{3})*\s*\)\s*$/.test(m[3]),
    });
  }
  return tasks;
}

const isApproved = (text) => /^\s*-\s*\[[xX]\]\s*Approved\b/m.test(text || '');

function parseFRs(specText) {
  const section = sectionText(specText, 'Functional Requirements') || '';
  return uniq(section.match(/FR-\d{3}/g) || []);
}

function parseMemoryMarker(text) {
  const m = (text || '').match(/<!--\s*sdd-sync:\s*(\S+)\s+done=(\d+)\s*-->/);
  return m ? { id: m[1], done: Number(m[2]) } : null;
}

const lineCount = (text) => (text ? text.replace(/\n+$/, '').split('\n').length : 0);

function validateSections(text, required) {
  return required.filter((h) => !hasSection(text, h)).map((h) => `missing section "## ${h}"`);
}

function validateSpec(text) {
  const errors = validateSections(text, ['Overview', 'Functional Requirements', 'Acceptance Criteria']);
  const warnings = [];
  const frs = parseFRs(text);
  if (!errors.length) {
    if (!frs.length) warnings.push('no requirements yet (expected lines like "- FR-001: ...")');
    const ac = sectionText(text, 'Acceptance Criteria') || '';
    const uncovered = frs.filter((f) => !ac.includes(f));
    if (uncovered.length) warnings.push(`requirements without acceptance criteria: ${uncovered.join(', ')}`);
  }
  const open = (text.match(/\[NEEDS CLARIFICATION/g) || []).length;
  if (open) warnings.push(`${open} unresolved [NEEDS CLARIFICATION] marker(s)`);
  return { errors, warnings };
}

function validatePlan(text) {
  return {
    errors: validateSections(text, [
      'Summary',
      'Technical Context',
      'Constitution Check',
      'Architecture',
      'Requirement Coverage',
    ]),
    warnings: [],
  };
}

function validateTasks(text, specText) {
  const errors = validateSections(text, ['Approval', 'Tasks']);
  const warnings = [];
  const tasks = parseTasks(text);
  if (!errors.length) {
    if (!tasks.length) warnings.push('no tasks yet (expected lines like "- [ ] T001 Description (FR-001)")');
    const seen = new Set();
    for (const t of tasks) {
      if (seen.has(t.id)) errors.push(`duplicate task id ${t.id}`);
      seen.add(t.id);
      if (!t.refsOk) errors.push(`${t.id} must end with requirement references, e.g. "(FR-001, FR-002)"`);
    }
    if (specText) {
      const frs = parseFRs(specText);
      const referenced = new Set(tasks.flatMap((t) => t.frs));
      const uncovered = frs.filter((f) => !referenced.has(f));
      const unknown = [...referenced].filter((f) => !frs.includes(f));
      if (uncovered.length) warnings.push(`requirements without tasks: ${uncovered.join(', ')}`);
      if (unknown.length) warnings.push(`tasks reference unknown requirements: ${unknown.join(', ')}`);
    }
  }
  return { errors, warnings };
}

function validateConstitution(text) {
  return { errors: validateSections(text, ['Principles', 'Tech Stack', 'Testing', 'Conventions']), warnings: [] };
}

function validateMemory(text) {
  const warnings = [];
  const n = lineCount(text);
  if (n > MEMORY_SOFT_LIMIT) warnings.push(`MEMORY.md has ${n} lines (target ~100, soft limit ${MEMORY_SOFT_LIMIT}); condense it`);
  return { errors: [], warnings };
}

function classifyPath(root, filePath) {
  const abs = path.resolve(root, filePath);
  const rel = path.relative(root, abs).split(path.sep).join('/');
  if (rel.startsWith('..') || path.isAbsolute(rel)) return { exempt: true, rel };
  const parts = rel.split('/');
  if (EXEMPT_DIRS.has(parts[0])) return { exempt: true, rel };
  const base = parts[parts.length - 1];
  if (/\.(md|mdx|txt)$/i.test(base)) return { exempt: true, rel };
  if (parts.length === 1) {
    const configLike =
      base.startsWith('.') ||
      /\.(json|ya?ml|toml|ini|cfg|lock)$/i.test(base) ||
      /^(Dockerfile|Makefile|LICENSE.*)$/i.test(base);
    if (configLike) return { exempt: true, rel };
  }
  return { exempt: false, rel };
}

function featureState(root, feature) {
  const read = (n) => readText(path.join(feature.dir, n));
  const spec = read('spec.md');
  const plan = read('plan.md');
  const tasksText = read('tasks.md');
  const tasks = tasksText ? parseTasks(tasksText) : [];
  const memory = readText(path.join(root, MEMORY_FILE));
  const marker = parseMemoryMarker(memory);
  const done = tasks.filter((t) => t.done).length;
  return {
    id: feature.id,
    hasSpec: spec !== null,
    hasPlan: plan !== null,
    hasTasks: tasksText !== null,
    specText: spec,
    tasksText,
    tasks,
    total: tasks.length,
    done,
    pending: tasks.filter((t) => !t.done),
    approved: tasksText ? isApproved(tasksText) : false,
    requirements: spec ? parseFRs(spec) : [],
    openClarifications: spec ? (spec.match(/\[NEEDS CLARIFICATION/g) || []).length : 0,
    memory: {
      exists: memory !== null,
      lines: lineCount(memory),
      marker,
      synced: !!marker && marker.id === feature.id && marker.done === done,
    },
  };
}

function readInput() {
  try {
    const raw = fs.readFileSync(0, 'utf8');
    return raw.trim() ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

const emit = (obj) => process.stdout.write(JSON.stringify(obj));

module.exports = {
  FEATURES_DIR,
  CONSTITUTION,
  MEMORY_FILE,
  MEMORY_SOFT_LIMIT,
  BRANCH_PREFIX,
  FEATURE_ID_RE,
  PLUGIN_ROOT,
  git,
  isGitRepo,
  findRoot,
  currentBranch,
  readText,
  readTemplate,
  activeFeature,
  resolveFeature,
  sectionText,
  hasSection,
  parseTasks,
  isApproved,
  parseFRs,
  parseMemoryMarker,
  lineCount,
  validateSpec,
  validatePlan,
  validateTasks,
  validateConstitution,
  validateMemory,
  classifyPath,
  featureState,
  readInput,
  emit,
};
