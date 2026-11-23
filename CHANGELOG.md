# opencode-skills

## 2.1.0

### Minor Changes

- [#8](https://github.com/sadman-bk/opencode-skills/pull/8) [`5754a1a`](https://github.com/sadman-bk/opencode-skills/commit/5754a1abde3102fe0428afbf49f457bb905499db) Thanks [@sadman-bk](https://github.com/sadman-bk)! - `code-review` now reviews on three axes: a new **Risk** axis (bugs, edge cases, regressions, security, missing tests) joins Standards and Spec. It writes a shared brief for the sub-agents, sizes the dispatch to the diff, verifies Blocker and Major findings before reporting, and ends with a verdict. With no spec, the Spec axis runs on inferred intent instead of being skipped. It also accepts a PR, uncommitted work, or no target at all (it falls back to the default branch). The `code-reviewer` agent is now fully read-only: it denies every tool except reads, glob, grep and an allowlist of read-only `git` and `gh` commands, with shell redirects blocked. Run `/setup-skills` again and accept the agent update when it shows the difference for `code-reviewer.md`.

## 2.0.1

### Patch Changes

- [#4](https://github.com/sadman-bk/opencode-skills/pull/4) [`22a5c01`](https://github.com/sadman-bk/opencode-skills/commit/22a5c017f07aeb3844d7d33d4f9896d3e282bae1) Thanks [@sadman-bk](https://github.com/sadman-bk)! - `setup-skills` and `setup-ts-deep-modules` now offer to rename a legacy `CLAUDE.md` to `AGENTS.md` instead of editing it, because OpenCode stops reading `CLAUDE.md` once an `AGENTS.md` exists. The in-progress `software-factory` skill is removed.

## 2.0.0

### Major Changes

- [#1](https://github.com/sadman-bk/opencode-skills/pull/1) [`cbdfeb9`](https://github.com/sadman-bk/opencode-skills/commit/cbdfeb9f9caee75a899f980ae0e1ec3875eb6a80) Thanks [@sadman-bk](https://github.com/sadman-bk)! - Ship as an OpenCode v2 plugin and drop every other harness. User-invoked skills use `metadata: { opencode/autoinvoke: false }` and every skill gets a slash command from the plugin. `agents/openai.yaml`, `.claude-plugin/` and `scripts/link-skills.sh` are removed. `setup-matt-pocock-skills` is now `setup-skills`, `ask-matt` is `ask-skills`, `git-guardrails-claude-code` is `git-guardrails` (OpenCode permission rules), and `claude-handoff` is `background-handoff`. Four subagent definitions ship in `agents/`, and `setup-skills` copies them into the user's agents directory.
