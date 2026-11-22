// OpenCode V2 server plugin: registers this repo's skills, a slash command for
// every user-invoked skill, and nothing else. Plain ESM with no imports from
// an OpenCode package, so it loads straight from a git checkout.
//
// Options (plugin entry in opencode.jsonc):
//   buckets: skill buckets to register. Default ["engineering", "productivity"].
//            Add "in-progress" or "misc" to opt in to the unpromoted skills.
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseSkill } from "./frontmatter.js";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DEFAULT_BUCKETS = ["engineering", "productivity"];

function* skillFiles(dir) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* skillFiles(path);
    else if (entry.name === "SKILL.md") yield path;
  }
}

export function loadSkills(buckets = DEFAULT_BUCKETS, root = ROOT) {
  const skills = [];
  for (const bucket of buckets) {
    for (const path of skillFiles(join(root, "skills", bucket))) {
      const { data, body } = parseSkill(readFileSync(path, "utf8"));
      const id = basename(dirname(path));
      const meta = data.metadata && typeof data.metadata === "object" ? data.metadata : {};
      const autoinvoke = meta["opencode/autoinvoke"] !== false;
      skills.push({
        id,
        bucket,
        path,
        name: typeof data.name === "string" ? data.name : id,
        description: typeof data.description === "string" ? data.description : "",
        autoinvoke,
        argumentHint: typeof meta["argument-hint"] === "string" ? meta["argument-hint"] : undefined,
        content: body.trim(),
      });
    }
  }
  return skills;
}

function basename(dir) {
  return dir.split(/[\\/]/).pop();
}

export default {
  id: "matt-skills",

  async setup(ctx) {
    const buckets = Array.isArray(ctx.options?.buckets) ? ctx.options.buckets : DEFAULT_BUCKETS;
    const skills = loadSkills(buckets);

    await ctx.skill.transform((editor) => {
      for (const skill of skills) {
        editor.add({
          id: skill.id,
          name: skill.name,
          description: skill.description,
          autoinvoke: skill.autoinvoke,
          path: skill.path,
          content: skill.content,
        });
      }
    });

    // A user-invoked skill has no model-facing entry, so it gets a slash
    // command instead: `/to-spec`, `/handoff some focus`. The command attaches
    // the skill to the prompt, which is the same thing typing `@to-spec` does.
    await ctx.command.transform((editor) => {
      for (const skill of skills.filter((s) => !s.autoinvoke)) {
        const hint = skill.argumentHint ? ` (${skill.argumentHint})` : "";
        editor.add({
          name: skill.id,
          description: `${skill.description}${hint}`,
          execute: async ({ sessionID, prompt, delivery }) => {
            await ctx.session.prompt({
              ...prompt,
              sessionID,
              text: prompt.text?.trim() ? prompt.text : `Run the ${skill.id} skill.`,
              skills: [...(prompt.skills ?? []), { id: skill.id }],
              delivery,
            });
          },
        });
      }
    });
  },
};
