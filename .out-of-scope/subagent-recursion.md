# Guards against sub-agents recursing into skills

Skills do not add guards against sub-agents recursively invoking skills or spawning nested agents (a `/code-review` sub-agent re-invoking `/code-review`, a `/research` agent spawning another agent). Requests to add leaf-agent instructions, depth limits or "do not invoke this skill" lines are out of scope.

## Why this is out of scope

OpenCode already owns this, so a skill does not need to:

- **Depth.** Subagent nesting depth defaults to one (`experimental.subagent_depth`). A child session cannot start a grandchild unless you raise the limit.
- **Reach.** The `subagent` permission decides which agents a session may start, and the `skill` permission decides which skills it may load. A limit set there holds for every skill at once. The agents shipped in `agents/` deny `subagent *`.

A guard written into one skill's prose covers only that skill, costs tokens on every run, and still depends on the model choosing to obey it.

## What a skill may still say

A skill may describe how it behaves at a given depth when that is part of its job, not a safety net. `research` works inline when it was itself started by another agent, because the default depth leaves it no room to start a researcher. That is a branch in the workflow, not a recursion guard.

If a sub-agent recurses or fans out without bound, set `experimental.subagent_depth` or the `subagent` permission, or report it to OpenCode.
