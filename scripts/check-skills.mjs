#!/usr/bin/env node
import { readFile, readdir, stat } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'skills');
const expected = ['diagram-design', 'patent-disclosure'];
const forbiddenPatentSkills = [
  'patent-application',
  'patent-chapters',
  'patent-claims',
  'patent-de-ai',
  'patent-effect-contrast',
  'patent-experiment',
  'patent-figure-design',
  'patent-init',
  'patent-loop',
  'patent-research',
  'patent-review',
  'patent-services',
  'patent-writing-quality'
];
const errors = [];

for (const name of expected) {
  const path = join(root, name, 'SKILL.md');
  try {
    await stat(path);
    const text = await readFile(path, 'utf8');
    if (!text.startsWith('---\n')) errors.push(`${name}: missing YAML frontmatter`);
    if (!text.includes(`name: ${name}`)) errors.push(`${name}: frontmatter name mismatch`);
    if (!/^description:\s+/m.test(text)) errors.push(`${name}: missing description`);
    if (!text.endsWith('\n')) errors.push(`${name}: missing final newline`);
  } catch {
    errors.push(`${name}: missing SKILL.md`);
  }
}

const disclosureRoot = join(root, 'patent-disclosure');
const disclosure = await readFile(join(disclosureRoot, 'SKILL.md'), 'utf8');
for (const phrase of [
  '学术论文或研究技术报告',
  '公式必须说明变量含义',
  '算法写清输入',
  '不生成权利要求',
  '正式申请说明书',
  'references/research-and-prior-art.md',
  'references/technical-writing-and-evidence.md',
  'references/figures-and-delivery.md',
  'references/review-and-handoff.md'
]) {
  if (!disclosure.includes(phrase)) errors.push(`patent-disclosure: missing required guidance: ${phrase}`);
}

for (const reference of [
  'research-and-prior-art.md',
  'technical-writing-and-evidence.md',
  'figures-and-delivery.md',
  'review-and-handoff.md'
]) {
  try {
    const text = await readFile(join(disclosureRoot, 'references', reference), 'utf8');
    if (text.length < 500) errors.push(`patent-disclosure/references/${reference}: too short`);
    if (!text.endsWith('\n')) errors.push(`patent-disclosure/references/${reference}: missing final newline`);
  } catch {
    errors.push(`patent-disclosure/references/${reference}: missing reference`);
  }
}

const actual = (await readdir(root, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();
const unexpected = actual.filter((name) => !expected.includes(name));
if (unexpected.length) errors.push(`unexpected skill directories: ${unexpected.join(', ')}`);
const presentLegacy = actual.filter((name) => forbiddenPatentSkills.includes(name));
if (presentLegacy.length) errors.push(`legacy patent skills present: ${presentLegacy.join(', ')}`);

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`skill assets: ${expected.length} valid; patent-disclosure references: 4 valid`);
