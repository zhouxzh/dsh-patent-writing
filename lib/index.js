/**
 * dsh-plugin-patent-writing host half.
 *
 * The plugin deliberately registers no custom model-facing tools. Its
 * functionality is carried by the SKILL.md assets under ../skills, which are
 * installed into the DSH skill root by scripts/install-skills.mjs. This keeps
 * the bundle compatible with DSH hosts that do not provide the optional patent
 * MCP service.
 */

export const name = 'dsh-plugin-patent-writing';

/** This plugin uses no host service beyond the normal skill loader. */
export const inject = [];

export function apply(_ctx) {
  // Skill discovery is handled from the DSH skill root.
}
