# Renaming skills to dodge built-in commands

Skill names are not changed because OpenCode, a plugin, or another skill pack ships a command or skill with the same ID (`/prototype`, `/research`, `/code-review`, and so on). Requests to rename a skill, or add an alias, to avoid a collision are out of scope.

## Why this is out of scope

Names come and go on every side. Renaming every time one of them lands on a name we already use would mean chasing a moving target and breaking every cross-reference between skills each time.

How OpenCode resolves two skills with the same ID is the harness's behaviour, not the skill's. A skill ID is its directory name, and the source registered later wins. Skills in `~/.config/opencode/skills/` override the plugin's skills of the same ID (checked against OpenCode v2.3.2, where a global `code-review` shadowed the plugin's), and project `.opencode/skills/` and explicit `skills` config entries rank higher still. The skill text is correct either way.

## The way through

- Rename or remove your own conflicting skill.
- Or copy the plugin's skill folder into `.opencode/skills/` under a different directory name. The ID follows the directory, so both can coexist.
- Use `@skill-id` mentions to be explicit about which one you want.
