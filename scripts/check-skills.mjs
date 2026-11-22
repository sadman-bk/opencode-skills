#!/usr/bin/env node
// Validates every SKILL.md: strict YAML, required fields, unique IDs (the
// directory name is the OpenCode skill ID), no legacy agent flags, and that the
// plugin's lightweight parser reads the same values as a real YAML parser.
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { parse } from "yaml";
import { parseSkill } from "../plugin/frontmatter.js";

const root = new URL("../skills/", import.meta.url).pathname;
const errors = [];
const ids = new Map();

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

for (const file of walk(root)) {
  if (basename(file) === "openai.yaml") errors.push(`${file}: openai.yaml is not used by OpenCode, delete it`);
  if (basename(file) !== "SKILL.md") continue;

  const rel = file.slice(root.length);
  const source = readFileSync(file, "utf8");
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    errors.push(`${rel}: missing frontmatter`);
    continue;
  }

  let strict;
  try {
    strict = parse(match[1]);
  } catch (error) {
    errors.push(`${rel}: invalid YAML: ${error.message.split("\n")[0]}`);
    continue;
  }

  for (const key of ["name", "description"]) {
    if (typeof strict?.[key] !== "string" || strict[key].trim() === "") errors.push(`${rel}: missing ${key}`);
  }
  if ("disable-model-invocation" in strict) {
    errors.push(`${rel}: use metadata.opencode/autoinvoke: false instead of disable-model-invocation`);
  }
  if ("argument-hint" in strict) errors.push(`${rel}: move argument-hint under metadata`);

  const flag = strict.metadata?.["opencode/autoinvoke"];
  if (flag !== undefined && flag !== false) errors.push(`${rel}: metadata.opencode/autoinvoke must be false when set`);

  const lite = parseSkill(source).data;
  if (lite.description !== strict.description) errors.push(`${rel}: plugin parser disagrees with YAML on description`);
  if (lite.metadata?.["opencode/autoinvoke"] !== flag) errors.push(`${rel}: plugin parser disagrees with YAML on autoinvoke`);

  const id = basename(dirname(file));
  if (ids.has(id)) errors.push(`${rel}: skill ID "${id}" is also used by ${ids.get(id)}`);
  ids.set(id, rel);
}

for (const bucket of ["engineering", "productivity"]) {
  const readme = join(root, bucket, "README.md");
  if (!existsSync(readme)) {
    errors.push(`${bucket}/README.md: missing`);
    continue;
  }
  const text = readFileSync(readme, "utf8");
  for (const [id, rel] of ids) {
    if (rel.startsWith(`${bucket}/`) && !text.includes(`(./${id}/SKILL.md)`) && !text.includes(`(${id}/SKILL.md)`)) {
      errors.push(`${bucket}/README.md: does not link ${id}`);
    }
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`ok: ${ids.size} skills`);
