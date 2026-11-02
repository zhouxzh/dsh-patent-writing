#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { cp, mkdir, readFile, readdir, rm, stat } from 'node:fs/promises';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const skillsRoot = resolve(here, '..', 'skills');
const legacyPatentSkills = [
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

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function fileHash(path) {
  try {
    return createHash('sha256').update(await readFile(path)).digest('hex');
  } catch {
    return null;
  }
}

export async function listSkills(root = skillsRoot) {
  const entries = await readdir(root, { withFileTypes: true });
  const skills = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const dir = join(root, entry.name);
    try {
      await stat(join(dir, 'SKILL.md'));
      skills.push({ name: entry.name, dir });
    } catch {
      // Support-only directories are deliberately ignored.
    }
  }
  return skills.sort((a, b) => a.name.localeCompare(b.name));
}

export async function installSkills({ target, check = false } = {}) {
  const root = target ? resolve(target) : join(homedir(), '.dsh', 'skills');
  const results = [];

  for (const name of legacyPatentSkills) {
    const destination = join(root, name);
    const present = await exists(destination);
    if (!present) continue;
    if (check) {
      results.push({ name, state: 'obsolete' });
    } else {
      await rm(destination, { recursive: true, force: true });
      results.push({ name, state: 'removed' });
    }
  }

  for (const skill of await listSkills()) {
    const destination = join(root, skill.name);
    const source = await fileHash(join(skill.dir, 'SKILL.md'));
    const installed = await fileHash(join(destination, 'SKILL.md'));
    if (check) {
      results.push({
        name: skill.name,
        state: installed === null ? 'missing' : installed === source ? 'current' : 'stale'
      });
      continue;
    }
    await mkdir(root, { recursive: true });
    await cp(skill.dir, destination, { recursive: true, force: true });
    results.push({ name: skill.name, state: installed === null ? 'installed' : 'updated' });
  }
  return { root, results };
}

const invokedDirectly = process.argv[1] !== undefined &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (invokedDirectly) {
  const args = process.argv.slice(2);
  const check = args.includes('--check');
  const targetIndex = args.indexOf('--target');
  const target = targetIndex >= 0 ? args[targetIndex + 1] : undefined;
  const result = await installSkills({ target, check });
  for (const item of result.results) console.log(`${item.state.padEnd(9)} ${item.name}`);
  console.log(`skill root: ${result.root}`);
  if (check) {
    const failures = result.results.filter((item) => item.state !== 'current');
    if (failures.length) process.exitCode = 1;
  }
}
