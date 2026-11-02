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
  '## 填写前须知',
  '## 唯一正文模板',
  '### 一、发明创造的技术方案名称',
  '### 二、技术方案应用的技术领域',
  '### 三、背景技术',
  '### 四、本发明内容',
  '### 五、本发明技术方案的优点',
  '### 六、本发明的其他替代方案',
  '### 七、附图及附图说明',
  '### 八、具体实施方式',
  '### 九、主要创新点及代理师重点关注内容',
  '术语一致性',
  '完整与可实现',
  '充分公开',
  '不生成权利要求',
  '正式申请说明书',
  'references/research-and-prior-art.md',
  'references/technical-writing-and-evidence.md',
  'references/data-model-disclosure.md',
  'references/figures-and-delivery.md',
  'references/review-and-handoff.md'
]) {
  if (!disclosure.includes(phrase)) errors.push(`patent-disclosure: missing required guidance: ${phrase}`);
}
if (disclosure.includes('学术型技术研究报告') || disclosure.includes('统一16节模板')) {
  errors.push('patent-disclosure: legacy report or 16-section wording remains');
}
if (disclosure.includes('保密等级') || disclosure.includes('保密范围')) {
  errors.push('patent-disclosure: obsolete confidentiality fields remain');
}

const references = [
  'research-and-prior-art.md',
  'technical-writing-and-evidence.md',
  'data-model-disclosure.md',
  'figures-and-delivery.md',
  'review-and-handoff.md'
];
for (const reference of references) {
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
console.log(`skill assets: ${expected.length} valid; patent-disclosure references: ${references.length} valid`);
