---
name: background-handoff
description: Hand the current conversation off to a fresh background subagent that picks up the work immediately.
metadata:
  opencode/autoinvoke: false
  argument-hint: "What will the next session be used for?"
---

Write a handoff summary of the current conversation so a fresh agent can continue the work. Save it to the temporary directory of the user's OS (`$TMPDIR`, else `/tmp`; `%TEMP%` on Windows), then start a background subagent seeded with it.

Start the subagent with the `subagent` tool: agent `general`, a short descriptive `description` (e.g. "Fix login bug"), and a `prompt` that tells it to read the summary file at its absolute path and continue the work. Pass the path, not the summary text, so a long summary does not get truncated or mangled. The subagent starts in a fresh context window, runs in the background, and the tool returns its session ID immediately. It reports back to this session when it goes idle. Tell the user the session ID so they can open it from the session list.

Include a "suggested skills" section in the summary, naming which skills the next agent should call the skill tool for.

Do not duplicate content already captured in other artifacts (specs, plans, ADRs, issues, commits, diffs). Reference them by path or URL instead.

Redact any sensitive information, such as API keys, passwords, or personally identifiable information, since the summary becomes the agent's prompt.

If the user passed arguments, treat them as a description of what the next session will focus on and tailor the summary accordingly.

A subagent cannot start another subagent by default (`experimental.subagent_depth` is 1). If this session is itself a subagent, write the summary and stop. Tell the user to run it from a top-level session instead.
