---
"matt-opencode-skills": major
---

Ship as an OpenCode v2 plugin and drop every other harness. User-invoked skills use `metadata: { opencode/autoinvoke: false }` and every skill gets a slash command from the plugin. `agents/openai.yaml`, `.claude-plugin/` and `scripts/link-skills.sh` are removed. `setup-matt-pocock-skills` is now `setup-skills`, `ask-matt` is `ask-skills`, `git-guardrails-claude-code` is `git-guardrails` (OpenCode permission rules), and `claude-handoff` is `background-handoff`. Four subagent definitions ship in `agents/`, and `setup-skills` copies them into the user's agents directory.
