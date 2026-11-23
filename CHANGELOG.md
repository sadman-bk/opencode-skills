# opencode-skills

## 2.0.1

### Patch Changes

- [#4](https://github.com/sadman-bk/opencode-skills/pull/4) [`22a5c01`](https://github.com/sadman-bk/opencode-skills/commit/22a5c017f07aeb3844d7d33d4f9896d3e282bae1) Thanks [@sadman-bk](https://github.com/sadman-bk)! - `setup-skills` and `setup-ts-deep-modules` now offer to rename a legacy `CLAUDE.md` to `AGENTS.md` instead of editing it, because OpenCode stops reading `CLAUDE.md` once an `AGENTS.md` exists. The in-progress `software-factory` skill is removed.

## 2.0.0

### Major Changes

- [#1](https://github.com/sadman-bk/opencode-skills/pull/1) [`cbdfeb9`](https://github.com/sadman-bk/opencode-skills/commit/cbdfeb9f9caee75a899f980ae0e1ec3875eb6a80) Thanks [@sadman-bk](https://github.com/sadman-bk)! - Ship as an OpenCode v2 plugin and drop every other harness. User-invoked skills use `metadata: { opencode/autoinvoke: false }` and every skill gets a slash command from the plugin. `agents/openai.yaml`, `.claude-plugin/` and `scripts/link-skills.sh` are removed. `setup-matt-pocock-skills` is now `setup-skills`, `ask-matt` is `ask-skills`, `git-guardrails-claude-code` is `git-guardrails` (OpenCode permission rules), and `claude-handoff` is `background-handoff`. Four subagent definitions ship in `agents/`, and `setup-skills` copies them into the user's agents directory.
