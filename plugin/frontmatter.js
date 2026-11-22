// Minimal frontmatter reader for SKILL.md files. It handles exactly the shapes
// this repo uses: top-level `key: value` scalars (plain or quoted) and one
// level of nested keys under `metadata:`. scripts/check-skills.mjs checks
// every skill against a strict YAML parser and against this reader, so a shape
// this cannot read fails CI instead of silently dropping a skill.

function scalar(raw) {
  let value = raw.trim();
  // Drop a trailing ` # comment` from an unquoted value, as YAML does.
  if (!value.startsWith('"') && !value.startsWith("'")) value = value.replace(/\s+#.*$/, "");
  if (value.startsWith('"') && value.endsWith('"') && value.length >= 2) {
    return JSON.parse(value);
  }
  if (value.startsWith("'") && value.endsWith("'") && value.length >= 2) {
    return value.slice(1, -1).replace(/''/g, "'");
  }
  if (value === "true") return true;
  if (value === "false") return false;
  return value;
}

export function parseSkill(source) {
  source = source.replace(/^\uFEFF/, "");
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { data: {}, body: source };

  const data = {};
  let nested = null;
  for (const line of match[1].split(/\r?\n/)) {
    if (line.trim() === "" || line.trimStart().startsWith("#")) continue;
    const indented = /^\s+/.test(line);
    const kv = line.trim().match(/^([^:]+?):(?:\s+(.*))?$/);
    if (!kv) continue;
    const [, key, rest] = kv;
    if (indented && nested) {
      if (rest !== undefined && rest !== "") data[nested][key] = scalar(rest);
      continue;
    }
    if (rest === undefined || rest === "") {
      nested = key;
      data[key] = {};
    } else {
      nested = null;
      data[key] = scalar(rest);
    }
  }
  return { data, body: source.slice(match[0].length) };
}
