## What it does

`setup-matt-pocock-skills` answers three questions about one repo: where issues live, what the triage labels are called, and where the domain docs sit. It records the answers as markdown files under `docs/agents/`.

Those files are the only thing that varies between repos. The skills themselves are identical everywhere. They read `docs/agents/issue-tracker.md` at run time and do what it says. That is why the set is not tied to GitHub, and why you never edit a skill file to point it at another tracker. Invoking it with "link the skills to a custom issue tracker" works with anything you can connect to programmatically, with no changes to the skills.

It also installs the four subagents the engineering skills delegate to (`implementer`, `merger`, `researcher`, `code-reviewer`), because a plugin cannot register agents itself.

It is a prompt-driven skill, not a deterministic script. It reads your `git remote`, `AGENTS.md` and `GLOSSARY.md`, proposes what it found, and waits for you to confirm before it writes anything.

## When to reach for it

You invoke this by typing `/setup-matt-pocock-skills`; the agent won't reach for it on its own. It is hidden from the agent's skill list on purpose, so no other skill can fire it for you.

Reach for it once per repo, before the first use of any other engineering skill. If [triage](./triage.md), [to-spec](./to-spec.md), [to-tickets](./to-tickets.md) or [wayfinder](./wayfinder.md) start guessing where your issues go, or apply labels your tracker doesn't have, this repo has not been set up yet. You can run it in a repo halfway through a project. The skill reads what is already there, so no earlier work is lost.

## Prerequisites

It writes into the repo you run it in:

| It writes | Where |
| --- | --- |
| `issue-tracker.md` | `docs/agents/` |
| `domain.md` | `docs/agents/` |
| `triage-labels.md` | `docs/agents/`, only when the `triage` skill is installed |
| An `## Agent skills` block | `AGENTS.md`, edited first (it is created if neither it nor a legacy instruction file exists) |
| `implementer.md`, `merger.md`, `researcher.md`, `code-reviewer.md` | `.opencode/agents/` for this project, or `~/.config/opencode/agents/` for all projects, as you choose |

You commit all of it as markdown. The tracker, label and domain config has no user-level or global mode: it lives in the repo, so every repo gets its own copy. Only the subagents can go in your user config. If you skip that step, the skills fall back to the built-in `general` agent, and each agent's `model` can be set in its frontmatter if you want a stronger model for review.

## The three decisions

It starts each section with the recommended answer, and skips any question its exploration already answered. Most runs need only two confirmations.

| Decision | What it proposes | When it asks |
| --- | --- | --- |
| **Issue tracker** | the one matching your `git remote` | always, because this is the one real choice |
| **Triage labels** | keep the five canonical names (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`) | only if the `triage` skill is installed |
| **Domain docs** | single-context: one `GLOSSARY.md` plus `docs/adr/` at the root | only if it spots monorepo signals, and then it offers a multi-context `GLOSSARY-MAP.md` |

The tracker options:

| Option | Where issues live | Needs |
| --- | --- | --- |
| **GitHub** | the repo's GitHub Issues | the `gh` CLI |
| **GitLab** | the repo's GitLab Issues | the `glab` CLI |
| **Local markdown** | files under `.scratch/<feature>/` in this repo | nothing, not even a remote |
| **Other** | wherever you say | one paragraph from you describing the workflow |

The first three ship as templates in the skill and work out of the box. Local markdown is a full option, not a fallback. The skill supports a solo project with no remote. One caveat: don't use local markdown if you use GitHub. They are alternatives, so pick one.

"Other" is a full option too. It is how Jira, Linear, Azure DevOps and Beads all work. You describe the workflow, the skill records your prose in `docs/agents/issue-tracker.md`, and the downstream skills follow the prose. Users have already built this: a Jira-over-MCP variant, a Gitea CLI shaped like `gh`, a hand-built local dashboard.

## Common questions

**Do I have to use GitHub?**

No. GitHub, GitLab and local markdown under `.scratch/` all ship as ready-made templates, and anything else works through the "other" path. This is the most-repeated question, in roughly these words: *"hard locked to github"*, *"can I use GitLab / Jira"*, *"what about Azure DevOps"*. The answer is always the same: setup chooses the tracker, not the skill.

**Do I need to re-run it after updating the skills?**

One answer is yes. The skill's own closing message is softer. It tells you to re-run only to switch trackers or start over. Both are defensible. The seed templates change between versions, so a `docs/agents/issue-tracker.md` from an older release can go out of date against the skills that now read it. If a downstream skill does something different from what the docs describe, re-run setup. It is cheap.

**It didn't create my triage labels.**

It doesn't. `docs/agents/triage-labels.md` is a *mapping*: it tells `/triage` which strings in your tracker correspond to the five canonical roles. It does not run `gh label create`. On a fresh GitHub repo the labels do not exist yet, and users have filed this as a bug more than once. Two consequences:

- If your tracker already uses the canonical names, the mapping is an identity table and there is nothing to configure. That is the intended common case, not a missing step.
- This skill does not create [wayfinder](./wayfinder.md)'s `wayfinder:map` and `wayfinder:<type>` labels either, and `gh issue create --label <missing>` fails instead of creating the label. Create them by hand before the first wayfinder run on a GitHub repo.

**Can I configure the other skills' behaviour here (grilling cadence, question format, tone)?**

No. It configures three things: tracker, labels, doc layout. Users have asked to make it the place for per-user preferences. The answer is that skills stay opinionated and take no per-user config. Preferences belong in your `AGENTS.md` as plain instructions, which every skill already reads.

**Can I keep the config in my user config instead of committing it to every repo?**

Not the tracker, label and domain config. A user who runs the skills across many repos has no user-level mode for it, and every repo carries its own `docs/agents/`. The subagents are the exception: step 5 offers `~/.config/opencode/agents/` so you install them once for all projects.

**Isn't it strange to have a skill that configures the other skills?**

One long-standing complaint says yes, in these words: *"having a skill to set up the other skill does not feel right to me: that means the LLM is configuring its own skills."* The trade-off is real. Without a setup step, every skill that touches issues would need its own copy of the tracker instructions. The output is markdown you can read and edit, and that limits the risk. You can read every file it wrote and change it by hand. Make day-to-day changes that way, not with another run.

## It's working if

- `docs/agents/issue-tracker.md` and `docs/agents/domain.md` exist, plus `triage-labels.md` if `triage` is installed.
- An `## Agent skills` section appears in `AGENTS.md`, with a one-line summary pointing at each of those files.
- The tracker it proposed matches the remote you use, and the label strings match labels that exist in your tracker.
- Afterwards, `/to-tickets` publishes without asking you where issues live, and `/triage` applies labels rather than inventing them.
- The four subagents are in `.opencode/agents/` or `~/.config/opencode/agents/`, unless you chose to skip them.
- Nothing in the skill files themselves changed. If setup edited a `SKILL.md`, something went wrong.

## Where it fits

`setup-matt-pocock-skills` is the **run-once setup** for the engineering flow, the precondition everything else assumes rather than a step in the chain. Its neighbours are its readers: [triage](./triage.md), which applies the label vocabulary written here; [to-spec](./to-spec.md) and [to-tickets](./to-tickets.md), which publish into the tracker named here; and [wayfinder](./wayfinder.md), which reads the "Wayfinding operations" section of the same tracker file to learn how to store maps and child tickets. [domain-modeling](./domain-modeling.md) later fills in the domain-doc layout that setup records. It creates `GLOSSARY.md` and ADRs only when you resolve a term or decision, so a repo with no domain docs after setup is normal. For which skill to reach for next, [ask-matt](./ask-matt.md) routes the whole set.
