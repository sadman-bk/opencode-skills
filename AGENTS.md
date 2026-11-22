This repo is an OpenCode v2 plugin. It registers a set of skills, and a slash command for each skill, with OpenCode. There is no other supported harness. Read the V2 docs at https://opencode.ai/docs/ (index at /docs/llms.txt) before changing anything about skills, commands, agents, permissions or plugins, and never use a deprecated V1 field.

## Layout

- `plugin/index.js` is the plugin entry (`exports["."]` in `package.json`). It scans `skills/<bucket>/**/SKILL.md` and registers each skill and a slash command for it. `plugin/frontmatter.js` is its small frontmatter reader.
- `skills/<bucket>/<skill>/SKILL.md` holds the skills. The **directory name is the skill ID**, so IDs are unique across all buckets. The frontmatter `name` is display only.
- `agents/*.md` are OpenCode agent definitions that the repo ships. A plugin cannot register agents, so `setup-skills` copies them into the user's agents directory.
- `scripts/check-skills.mjs` (`npm run check`) validates every skill. CI runs it.

Skills are organized into bucket folders under `skills/`:

- `engineering/`: daily code work
- `productivity/`: daily non-code workflow tools
- `misc/`: kept around but rarely used, not promoted
- `in-progress/`: beta: public on purpose, feedback wanted, not shipped by default

Only `engineering/` and `productivity/` (the **promoted** buckets) are registered by default. Users opt in to other buckets with the plugin's `buckets` option. Each promoted skill must have a reference in the top-level `README.md`.

Each skill entry in the top-level `README.md` must link the skill name to its `SKILL.md`.

Each bucket folder has a `README.md` that lists every skill in the bucket with a one-line description, with the skill name linked to its `SKILL.md`. The promoted buckets' `README.md`s and the top-level `README.md` group entries into **User-invoked** and **Model-invoked**; non-promoted bucket `README.md`s (`misc/`, `in-progress/`) use a flat list. `npm run check` fails when a promoted skill is missing from its bucket `README.md`.

## Invocation

Every `SKILL.md` is either user-invoked (`metadata:` with `opencode/autoinvoke: false`, which hides it from the model's skill list) or model-invoked (the default). See [.agents/invocation.md](./.agents/invocation.md). Never write `disable-model-invocation` or add an `agents/openai.yaml`; `npm run check` rejects both.

[`ask-skills`](./skills/engineering/ask-skills/SKILL.md) is the router that maps every user-reachable skill and how they relate. Whenever you add, rename, remove, or change how a user-reachable skill fits the flows, re-read `ask-skills`'s `SKILL.md` and update it so the map stays accurate: a new skill it never mentions, or a stale one it still routes to, is a router that lies.

## Install and release

Install commands are copied verbatim from [.agents/install-block.md](./.agents/install-block.md). The plugin ships from the git ref in that block, so a merge to the tracked branch is a release for users on it. The package version in `package.json` is bumped by changesets (`npm run changeset`, then the Release workflow). [ADR 0003](./.agents/adr/0003-ship-as-an-opencode-plugin.md) records why this is a plugin.

To try changes locally, point a test project at the checkout:

```jsonc
{ "plugins": [{ "package": "/absolute/path/to/this/repo", "options": {} }] }
```

## Writing rules

No em-dashes anywhere in this repo's prose (`SKILL.md` files, `README.md`, ADRs, changesets, code comments). Where a sentence reaches for one, rewrite it instead with a comma, colon, period, parentheses, or a conjunction, whichever the sentence actually wants; never do a blind character substitution.

OpenCode subagents always start with a fresh context window, so a skill that dispatches one does not need to say so. A skill that dispatches a subagent must not rely on that subagent dispatching another: the default `experimental.subagent_depth` is 1.

## Agent skills

### Triage labels

Canonical names, unchanged: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. Issues are judged against [`SCOPE.md`](./SCOPE.md).
