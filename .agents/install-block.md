# The canonical install block

One install story, one wording. `README.md`, `.changeset/*`, and every page under `docs/` must say **this** and nothing else. Change it here first, then propagate.

OpenCode v2 is the only supported harness, and it installs plugins from a config file, so there is a single route.

## Install

<canonical-block name="install">

Add the plugin to `opencode.jsonc` (project) or `~/.config/opencode/opencode.jsonc` (all projects):

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "plugins": [
    { "package": "github:sadman-bk/matt-opencode-skills#main", "options": {} }
  ]
}
```

OpenCode reloads config without a restart. Then run `/setup-skills` once per repo.

</canonical-block>

A git branch ref is checked for updates at startup and every 24 hours, so the plugin updates itself. Pin a tag or commit (`#v1.3.2`) to stop that. `opencode plugin update` forces a check.

## Options

<canonical-block name="options">

```jsonc
{ "package": "github:sadman-bk/matt-opencode-skills#main", "options": { "buckets": ["engineering", "productivity", "in-progress"] } }
```

`buckets` defaults to `["engineering", "productivity"]`. Add `in-progress` or `misc` to opt in to skills that are not promoted.

</canonical-block>

## What you get

- Every model-invoked skill appears in the model's skill list, and loads when a task fits.
- Every user-invoked skill is hidden from the model, and has a slash command (`/to-spec`) and an `@to-spec` mention.
- Agent definitions in `agents/` are copied into your project by `setup-skills`. A plugin cannot register agents, so this step is a copy.

## Local checkout (maintainers)

```jsonc
{ "plugins": [{ "package": "/absolute/path/to/matt-opencode-skills", "options": {} }] }
```

## Name collisions

A skill ID is its directory name. If you already have a skill with the same ID in `.opencode/skills/` or `~/.config/opencode/skills/`, yours wins by precedence and shadows the plugin's. Rename yours, or remove it.

Use the single-skill wording wherever one skill is named on its own: "run `/<name>`" for a user-invoked skill, "load `<name>`" for a model-invoked one. `docs/` pages don't repeat the install block. See [writing-docs.md](./writing-docs.md).
