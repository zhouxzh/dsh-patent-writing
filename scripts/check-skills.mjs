#!/usr/bin/env node
import { readFile, readdir, stat } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'skills');
const expected = [
  'patent-init',
  'patent-loop',
  'patent-research',
  'patent-experiment',
  'patent-chapters',
  'patent-writing-quality',
  'patent-de-ai',
  'patent-effect-contrast',
  'patent-figure-design',
  'patent-claims',
  'patent-application',
  'patent-review',
  'patent-services',
  'diagram-design'
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
  } catch {
    errors.push(`${name}: missing SKILL.md`);
  }
}
const actual = (await readdir(root, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();
const unexpected = actual.filter((name) => !expected.includes(name));
if (unexpected.length) errors.push(`unexpected skill directories: ${unexpected.join(', ')}`);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`skill assets: ${expected.length} valid`);
