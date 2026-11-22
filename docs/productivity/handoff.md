## What it does

`handoff` compacts the conversation you are in into a **handoff document**: one markdown file, written to your OS's temporary directory rather than into the workspace, that a fresh agent can read to pick the work up.

What it gives you is **portability**, not compression, so the skill is narrower than it sounds. You need a file only when the work has to *travel*: to a different model or agent, a new directory, a colleague, or a side task you want to fork off. If nothing is travelling, you do not need a handoff. Staying in the session, `/new`, a subagent and compaction cover the ordinary end-of-phase case, and compaction covers it more often than this skill does.

## When to reach for it

You invoke this by typing `/handoff`; the agent won't reach for it on its own. Pass a note about what the next session is for, and the skill writes the document for that purpose.

There are four triggers, and only four:

| Situation | Why a file |
| --- | --- |
| Switching to a different model or agent | The new session cannot see the old context |
| Moving to a different directory or repo | A prototype directory is the common case |
| Sending the work to a colleague | They need something they can read |
| Forking a side task found mid-phase | You keep working; a second agent takes the fork |

For anything else (same model, same directory, you are done grilling and moving to implementation), let compaction handle it. [ask-skills](../engineering/ask-skills.md) has the ordered tree over all five options at a phase boundary.

## Branching is the use people skip

The skill's description reads like session resumption: write a summary, end here, resume there. Read that way, it looks like worse compaction, so people skip it. The fork case is the one worth knowing. You **stay in your session** and hand a copy of the accumulated context to a second agent working in parallel.

That is what the detour through [prototype](../engineering/prototype.md) uses. You are deep in a design conversation, you hit a question that only running code will settle, and you do not want to spend the thread you built on finding out. Hand off to a prototype session, get the answer, hand the answer back, and reference it from the original thread. The work crosses over twice, your original conversation stays live, and you re-explain nothing.

Three of the five options at a phase boundary preserve different things: compaction preserves your intent, `/new` preserves nothing, `/handoff` preserves the work's ability to move.

## What travels, and what doesn't

The document carries the live thread (what's in flight, why, and what's next) plus a **suggested skills** section naming what the next agent should reach for. The skill redacts secrets before it writes the file.

It deliberately does not carry anything already written down. The document references specs, plans, ADRs, issues, commits and diffs by path or URL, and never copies them. That keeps the file small, and it keeps the settled detail in one place instead of two copies that drift apart.

## Common questions

**Handoff or compaction?**
Compaction unless something is travelling. Staying on the same task is a compaction, not a handoff. OpenCode compacts automatically near the context limit, and you can request it earlier with `opencode api post /api/session/<id>/compact`. When the model and directory stay the same and you need to stay in the loop, the phase-boundary tree ends at compaction most days. `/handoff` does not summarise better. Its advantage is that the result is a file you can carry somewhere compaction can't reach.

**So what's the actual difference between compaction, `/new` and handoff?**
Each one preserves something different. Compaction replaces the older conversation in this session with a summary and continues, so your intent survives. `/new` starts a fresh session with nothing carried over (the old one stays in `/sessions`). That is correct when everything behind you is disposable. `/handoff` writes a portable file, so the work survives the move to somewhere else. All three turn a **primary source** (the conversation as it happened) into a **secondary source** (a summary of it), or drop it. Continuing is the only option that doesn't, which is why you rule it out first.

**Where did my handoff file go?**
It goes to the temp directory, which is the most-reported problem with the skill. The skill resolves it as `$TMPDIR`, else `/tmp` (`%TEMP%` on Windows), but the paths are long. Ask for the path back and keep it before you move on. Temp is deliberate, because a handoff is a document in transit, not an artifact you maintain. Temp is also not durable, as the next question explains.

**My handoff vanished between sessions.**
Temp is not durable: some systems clear it between sessions, and a reboot can empty it. If the next session isn't starting within the hour, or is starting on a different machine, copy the file somewhere durable yourself as soon as it's written. The same applies to anything the document *points at*: if a dispatch references other files in temp, the next agent can't follow it.

**How do I actually hand it to the next agent?**
Open the fresh session and point it at the path: read this file, then continue. Point at the file rather than pasting the summary into a shell command. The shell mangles a summary that contains backticks or `$(...)` when you interpolate it into a command line. The usual result is silent truncation rather than an error, so the new agent starts with an incomplete brief and nothing tells you.

**When does something belong in `AGENTS.md` instead?**
Ask whether it's true next month. `AGENTS.md` is standing context about the project, loaded into every session whether it's relevant or not. A handoff is about one piece of work in flight and is useless once that work lands. If you keep re-explaining a fact, it belongs in `AGENTS.md`. A half-finished task belongs in a handoff.

**It captures the what, not the why.**
This is a fair criticism, and people raise it often. Two things help. Pass the argument (tell it what the next session is for), so the skill keeps the reasoning that bears on *that* rather than flattening it. And watch for confident claims the session never verified, such as "X isn't built" or "Y is done". The next agent trusts the document and does not re-check it, so a belief written as a fact becomes a false premise for everything that follows. Read the document before you hand it over, and downgrade anything you only assumed.

**Why is it a skill rather than a slash command?**
Both work; they suit different situations. As a skill, it ships through the plugin like everything else here, which makes it shareable, and the plugin registers `/handoff` as its slash command. Its frontmatter, not the mechanism, is what stops the agent from firing it on its own.

## It's working if

- The document is a small fraction of the conversation, and the specs, issues and diffs appear in it as paths and URLs rather than as copied text.
- You can read it cold, without the original session open, and know what to do next.
- The fresh agent starts working instead of asking you to re-explain the setup.
- In the fork case, your original session is unchanged when you come back to it.
- The suggested-skills section names the skill you'd have reached for yourself.
- Nothing in it is a key, a token, or a password.

## Where it fits

`handoff` is a **reach-for-it-anytime standalone**. It works between sessions rather than inside a build chain. It is a narrow one, and you'll use it less often than the other four options at a phase boundary. Its closest neighbour is [prototype](../engineering/prototype.md), because a prototype lives in its own directory and the round trip out and back is the move this skill is for. When you're at a boundary and unsure whether to continue, start a `/new` session, hand off, delegate or compact, [ask-skills](../engineering/ask-skills.md) has the tree that orders those five, and routes you across the rest of the set.
