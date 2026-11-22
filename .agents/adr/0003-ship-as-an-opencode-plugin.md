# Ship the skill set as a native OpenCode v2 plugin

This repo targets OpenCode v2 only. Earlier versions shipped as a Claude Code plugin with Codex, Copilot, Gemini and skills.sh as fallbacks, and used harness-specific flags and files to describe each skill. All of that is removed.

## Decision

Ship one OpenCode server plugin, `plugin/index.js`, as the package's `exports["."]` entry. At startup it:

- reads `skills/<bucket>/**/SKILL.md` for the promoted buckets (`engineering`, `productivity`) and registers each through `ctx.skill.transform`;
- registers a slash command per skill through `ctx.command.transform` (option `commands`: `"all"`, `"user-invoked"` or `"none"`). The command adds the skill to the prompt, which is what typing `@skill-id` does, so `/to-spec` and `@to-spec` behave the same.

Users install it with a git ref in their `opencode.jsonc`. A branch ref is checked for updates at startup and every 24 hours, so there is no manual update step and no version file to sync.

## Why a plugin and not a skills path or HTTP catalog

- A `"skills": [...]` path or catalog entry registers skills only. It cannot register slash commands, and user-invoked skills would be reachable by `@id` alone.
- A plugin can also take options (`buckets`), so the promoted set stays the default and unpromoted buckets are opt-in without a second install.
- The plugin is plain ESM with no imports from an OpenCode package, so it loads from a git checkout with no build and no dependency install.

## Constraints we hit

- A plugin cannot register agents (the agent editor has no `add`). Agent definitions ship as markdown in `agents/` and are copied by `setup-skills`.
- A skill ID is its directory name, so IDs must be unique across all buckets. `npm run check` enforces this.
- `metadata.opencode/autoinvoke: false` hides a skill from the model's skill list. It does not forbid the model from loading it by ID if it is told the ID, so user-invoked skills must not be named in other skills' operative steps.
- Subagents run in the background in a fresh context, and nesting is capped at `experimental.subagent_depth` (default 1). A skill that dispatches a subagent must not depend on that subagent dispatching another.

## Invariants

- Every promoted skill lives in `skills/engineering/` or `skills/productivity/` and appears in its bucket `README.md`. `npm run check` fails otherwise.
- The plugin's frontmatter reader and a strict YAML parser must agree on every skill. `npm run check` fails otherwise.

Supersedes ADR 0002, which recorded the Claude Code plugin decision. That file was deleted in this migration; it remains in git history.
