---
name: git-guardrails
description: Add OpenCode permission rules that deny dangerous git commands (push, reset --hard, clean, branch -D, etc.) before they execute. Use when the user wants to prevent destructive git operations, add git safety rules, or block git push/reset.
---

# Setup Git Guardrails

Adds `shell` permission rules to `opencode.jsonc` that deny dangerous git commands. OpenCode's shell scanner checks every extracted subcommand of a compound command against the rules, so `cd x && git push` is caught too. A command the scanner cannot analyse (such as `eval`) fails closed once any `shell` deny rule applies. A denied command returns an error to the model, which sees that it does not have authority to run it.

No hook script, no plugin, no dependency.

## What Gets Blocked

- `git push` (all variants including `--force`, and `git -C <dir> push`)
- `git reset --hard`
- `git clean -f` / `git clean -fd`
- `git branch -D`
- `git checkout .` / `git restore .`

## Steps

### 1. Ask scope

Ask the user: install for **this project only** (`opencode.jsonc` in the repo root) or **all projects** (`~/.config/opencode/opencode.jsonc`)?

### 2. Add the rules

Read the target file (it may be `.jsonc`, so keep comments). Add this to its `permissions` array, creating the array if absent. Append at the **end**: the last matching rule wins, so a deny that sits after a broad allow still applies. Don't overwrite other settings, and skip any rule already present.

```jsonc
{ "action": "shell", "resource": "git push *", "effect": "deny" },
{ "action": "shell", "resource": "git -* push *", "effect": "deny" },
{ "action": "shell", "resource": "git reset --hard*", "effect": "deny" },
{ "action": "shell", "resource": "git -* reset --hard*", "effect": "deny" },
{ "action": "shell", "resource": "git clean *-f*", "effect": "deny" },
{ "action": "shell", "resource": "git -* clean *-f*", "effect": "deny" },
{ "action": "shell", "resource": "git branch *-D *", "effect": "deny" },
{ "action": "shell", "resource": "git branch *--delete --force*", "effect": "deny" },
{ "action": "shell", "resource": "git -* branch *-D *", "effect": "deny" },
{ "action": "shell", "resource": "git checkout .", "effect": "deny" },
{ "action": "shell", "resource": "git checkout -- .", "effect": "deny" },
{ "action": "shell", "resource": "git checkout -f*", "effect": "deny" },
{ "action": "shell", "resource": "git restore .", "effect": "deny" },
{ "action": "shell", "resource": "git restore -- .", "effect": "deny" }
```

If the file has no `$schema`, add `"$schema": "https://opencode.ai/config.json"`.

### 3. Ask about customization

Ask if the user wants to add or remove any patterns from the blocked list. Edit the rules accordingly.

### 4. Verify

Ask the user to prompt the agent to run `git push --dry-run`. It should be denied without a prompt. Config reloads without a restart.

## Notes

- A rule in a later config layer or an agent's own `permissions` list can override these. If something slips through, check those.
- Rules are pattern matches, not a sandbox. The OpenCode docs recommend a narrow shell allowlist when you need a real guarantee.
