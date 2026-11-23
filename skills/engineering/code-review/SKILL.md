---
name: code-review
description: "Read-only, three-axis review of a branch, PR, diff, or work-in-progress changes: Risk (bugs, edge cases, regressions, security, missing tests), Standards (the repo's documented coding standards plus a code-smell baseline), and Spec (does it match the originating issue or spec?). Runs the axes as parallel sub-agents, verifies the serious findings, and reports them side by side with a verdict. Use when the user wants to review a branch, a PR, uncommitted changes, or asks to \"review since X\"."
---

Three-axis review of a change:

- **Risk**: what did the author and the tests miss? Bugs, edge cases, regressions, security, performance, test gaps.
- **Standards**: does the code conform to this repo's documented coding standards and the smell baseline?
- **Spec**: does the code faithfully implement the originating issue or spec?

Each axis runs in its own `code-reviewer` sub-agent, started through the `subagent` tool, so no axis pollutes another's context. You own the parts that need the whole picture: pinning the target, writing the brief, verifying findings, and the final report.

The issue tracker should have been provided to you. If it wasn't, tell the user to run `/setup-skills`, and meanwhile fetch issues with `gh` when the repo is on GitHub.

## Read-only

The whole review, yours and every sub-agent's, is observation. Use the read, grep and glob tools plus read-only `git` and `gh` commands (`git diff`, `log`, `show`, `status`, `blame`, `rev-parse`, `merge-base`, `ls-files`, plus `gh pr view`, `gh pr diff`, `gh issue view`). Search code with the grep tool, not `git grep`. Never redirect output to a file. Fixes appear only as snippets inside the report. If the user asked for changes, deliver the review first; applying fixes is a separate request.

## Process

### 1. Pin the target

Resolve what is being reviewed, and capture the diff command once:

- **PR number or URL**: `gh pr view` for title, body and base; `gh pr diff` for the diff.
- **Fixed point** (SHA, branch, tag, `HEAD~5`): `git diff <fixed-point>...HEAD` (three-dot, against the merge-base) and `git log <fixed-point>..HEAD --oneline`.
- **File paths**: review those files in full; their callers and tests are in scope too.
- **Nothing given**: use the merge-base with the default branch (`git rev-parse --abbrev-ref origin/HEAD`, else `main`, else `master`) and state which base you chose. Ask only when none resolves.

When the working tree has uncommitted changes, add `git diff HEAD` to the target and say so in the report. `git diff` never shows untracked files, so also run `git status --short` and list every untracked (`??`) file as in scope, to be read in full.

Done when the ref resolves (`git rev-parse`), the diff (or untracked file list) is non-empty, and you hold the exact diff command(s), the untracked file list, the commit list, and `git diff --stat`. A bad ref or empty diff fails here, never inside the sub-agents.

### 2. Write the brief

Read the diff, then enough surrounding code (callers, callees, related models, config, migrations, tests) to write a **brief** of at most 250 words:

- the business problem being solved, and the intended behaviour;
- the invariants the system must preserve, and the domain rules the change encodes;
- the public interfaces, schemas, events and consumers the change touches.

Done when every file in `git diff --stat` and the untracked file list is accounted for in the brief. Every sub-agent gets the brief, so none of them rediscovers the change from scratch.

### 3. Find the spec

Look for the originating spec, in this order:

1. Issue references in the commit messages or PR body (`#123`, `Closes #45`, GitLab `!67`), fetched through the tracker.
2. A path the user passed as an argument.
3. A spec file under `docs/`, `specs/` or `.scratch/` matching the branch name or feature.
4. Nothing found: ask the user where the spec is.

If there is no spec, the Spec axis still runs in **inferred-intent** mode: it reviews against the PR description, commit messages and the brief, and labels every finding _inferred_. Missing requirements become open questions for the author, never invented acceptance criteria.

### 4. Gather the standards

Find every file in the repo that documents how code should be written (`AGENTS.md`, `CONTRIBUTING.md`, `CODING_STANDARDS.md`, style guides, ADRs). `CODING_STANDARDS.md` and `CONTRIBUTING.md` are always on the list when they exist. Then read [SMELLS.md](SMELLS.md): the Standards axis always carries that baseline, and a documented repo standard overrides it.

### 5. Size the review

Pick the dispatch shape from `git diff --stat`:

- **Small** (under ~100 changed lines and at most 3 files): read [RISK.md](RISK.md) and run the three axes yourself with the step 6 briefs, in the order Risk, Spec, Standards, finishing each axis's section before starting the next. Sub-agents would cost more than they save.
- **Normal**: one sub-agent per axis.
- **Large** (over ~1500 changed lines or 30 files): split the Risk axis by area, one Risk sub-agent per coherent slice of files. Standards and Spec stay whole.

### 6. Dispatch the axes

Issue every `subagent` call to the `code-reviewer` agent in the same turn, and tell each one which axis it owns. If `code-reviewer` isn't installed, dispatch to `explore` instead, add the Read-only section to each prompt, and tell the user to run `/setup-skills`. If the `subagent` tool is unavailable or the dispatch fails, run the review inline as in the Small shape, and say so in the report.

Every prompt, whichever agent receives it, includes the diff command(s), the untracked file list, the commit list, the brief, this **finding format**, and the axis-specific part and word budget below:

> For each finding: severity (Blocker / Major / Minor / Nit), location (`file:line`), type, confidence (High / Medium / Low), what is wrong and the scenario that triggers it, the impact in user or business terms, and a suggested fix (a snippet when it helps). Ground every finding in the code you read; label anything you could not verify a hypothesis. Group linter-level nits into one line. End with one line on what is done well. If the change is safe on your axis, say so plainly.

Then the axis-specific part:

- **Risk**: the full contents of [RISK.md](RISK.md), pasted in (the sub-agent has no other access to it). For a sliced Risk axis, also the files that slice owns. Budget: under 900 words including the RISK.md report sections (per slice when sliced).
- **Standards**: the standards files from step 4, plus the full contents of [SMELLS.md](SMELLS.md). Brief: "Report (a) every place the diff violates a documented standard, citing the file and the rule; (b) any baseline smell, named and with the hunk quoted. Documented-standard breaches can be hard violations; baseline smells are always judgement calls. Skip anything tooling enforces." Budget: under 400 words.
- **Spec**: the spec contents, or the inferred-intent instruction from step 3. Brief: "Report (a) requirements that are missing or partial; (b) behaviour the spec didn't ask for (scope creep or hidden behaviour change); (c) requirements that look implemented but where the implementation looks wrong. Quote the spec line for each finding." Budget: under 400 words.

### 7. Verify

Sub-agents can be wrong. Before reporting, open the cited lines for every Blocker and Major finding and check the claim against the code:

- **Confirmed**: keep it.
- **Plausible but unproven**: keep it at Low confidence, labelled hypothesis.
- **Wrong**: drop it, and count the drops in the summary.

Done when every Blocker and Major has one of those three outcomes.

### 8. Report

Deliver the review in the chat, never to a file:

1. **Summary**: the intent (from the brief), the base you diffed against, the **verdict** with a 2-3 sentence rationale, and how many sub-agent findings verification dropped.
2. **Questions for the author**: requirements, data volumes or consumers you needed but lacked.
3. **`## Risk`**, **`## Spec`**, **`## Standards`**: each axis's verified findings, ordered by severity within the axis. Two axes flagging the same line keep both findings, cross-referenced.
4. **Edge case matrix**, **Regression risk** and **Missing tests**, from the Risk axis. With a sliced Risk axis, merge the slices into one of each: concatenate the rows, remove duplicates, and keep the highest risk rating where slices disagree.
5. **Positives**.
6. **Pre-merge checklist**: what must happen before this ships.
7. A one-line tally: findings per axis, the worst issue within each axis, and the dropped count.

The verdict follows mechanically from the verified findings, so it never reranks one axis against another:

- any confirmed Blocker → **Request changes**;
- otherwise any confirmed Major → **Approve with changes**;
- otherwise, an open question that blocks judging correctness → **Needs discussion**;
- otherwise → **Approve**.

## Why separate axes

A change can pass one axis and fail another:

- Code that follows every standard but implements the wrong thing → **Standards pass, Spec fail.**
- Code that does exactly what the issue asked but breaks the project's conventions → **Spec pass, Standards fail.**
- Code that is on-spec and clean but loses an update under concurrent writes → **Spec and Standards pass, Risk fail.**

Reporting them separately stops one axis from masking another.
