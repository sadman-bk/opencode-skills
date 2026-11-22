---
name: research
description: Investigate a question against high-trust primary sources and capture the findings as a Markdown file in the repo. Use when the user wants a topic researched, docs or API facts gathered, or reading legwork delegated to a background agent.
---

Who does the reading depends on where you are running:

- **You are a top-level session:** start the `researcher` agent with the `subagent` tool, so you keep working while it reads. Subagents always start with a fresh context window and run in the background.
- **You were started by another agent** (a `wayfinder` research ticket, for example): do the research yourself, inline. OpenCode allows one level of subagent nesting by default (`experimental.subagent_depth`), so a subagent starting another one fails.

The job:

1. Investigate the question against **primary sources** (official docs, source code, specs, first-party APIs), not a secondary write-up of them. Follow every claim back to the source that owns it.
2. Write the findings to a single Markdown file, citing each claim's source.
3. Save it where the repo already keeps such notes; match the existing convention, and if there is none, put it somewhere sensible and say where.
