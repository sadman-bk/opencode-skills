---
"opencode-skills": minor
---

`code-review` now reviews on three axes: a new **Risk** axis (bugs, edge cases, regressions, security, missing tests) joins Standards and Spec. It writes a shared brief for the sub-agents, sizes the dispatch to the diff, verifies Blocker and Major findings before reporting, and ends with a verdict. With no spec, the Spec axis runs on inferred intent instead of being skipped. It also accepts a PR, uncommitted work, or no target at all (it falls back to the default branch). The `code-reviewer` agent is now fully read-only: it denies every tool except reads, glob, grep and an allowlist of read-only `git` and `gh` commands, with shell redirects blocked. Run `/setup-skills` again and accept the agent update when it shows the difference for `code-reviewer.md`.
