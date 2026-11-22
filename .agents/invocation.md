# Model-invoked vs user-invoked

Every `SKILL.md` in this repo is a skill. The one axis that splits them is **invocation**, who can reach it:

- **User-invoked**: reachable **only by the human**, through a slash command (`/to-spec`) or an `@to-spec` mention. Set this in the frontmatter:

  ```yaml
  metadata:
    opencode/autoinvoke: false
  ```

  This hides the skill from the model's skill list. The plugin then registers a slash command with the same name as the skill's ID. The `description` is **human-facing**: a one-line summary read by a person browsing slash commands. Strip trigger lists ("Use when the user says…"). If the skill takes arguments, add `argument-hint: "…"` under `metadata:` and the plugin appends it to the command description.
- **Model-invoked**: reachable by **model or user**. The default: omit the `metadata` block. The `description` is **model-facing** and keeps rich trigger phrasing ("Use when the user wants…, mentions…, asks for…") so auto-invocation fires. The test for whether a skill should stay model-invoked: _could the model usefully reach for this autonomously?_ (Reuse is the reason to extract a skill, not the test.)

A user-invoked skill is not in the model's list, so no other skill can reach it by name. A user-invoked skill may invoke model-invoked skills, but it can never reach another user-invoked skill.

Do not use `disable-model-invocation`, and do not add an `agents/openai.yaml`. OpenCode honors the old flag, but this repo keeps one native spelling, and `npm run check` rejects both.

Bucket `README.md`s and the top-level `README.md` group entries into **User-invoked** and **Model-invoked**.

## Dependencies between them

Dependencies are expressed as an explicit instruction to **call the skill tool** with the named skill (`Call the skill tool with id "grilling"`), not deep `../other-skill/FILE.md` cross-references, and not a bare `@skill` mention left for the model to interpret. The tool takes `{ id }`, and spelling that out gets a higher hit rate than a name dropped into prose. Shared reference docs live inside the skill that owns them; other skills reach that material by calling the skill tool with it, not by linking across folders.

This is about **operative** instructions: a skill's own steps telling the agent to go run another skill right now. Router prose that just names skills for a human to pick from (`ask-skills`, bucket `README.md`s) isn't invoking anything, so it uses `/skill` names as plain labels.

The skill tool takes one skill per call. A step that needs two skills is two calls: say so (`Call the skill tool twice, for "grilling" and "domain-modeling"`).

This whole convention only holds when the named skill is **model-invoked**. When a step's precondition is a user-invoked skill (e.g. `setup-skills`), phrase it as an instruction for the human to act on: "tell the user to run `/setup-skills`", never as a skill tool call.

## Passive vs active domain work

Merely _reading_ `GLOSSARY.md` for vocabulary is a one-line prose pointer, not the `domain-modeling` skill. Only the active build/sharpen discipline (challenge terms, edge-case scenarios, write ADRs, update `GLOSSARY.md` inline) is `domain-modeling`.
