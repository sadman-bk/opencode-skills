# In Progress

Beta. These skills are public on purpose: try them and tell us what breaks. They're not registered by the plugin by default and are left out of the top-level README until they graduate to a stable bucket, and they can change or disappear without warning.

Opt in with the plugin's `buckets` option (see the [install block](../../.agents/install-block.md)): add `"in-progress"`.

- **[loop-me](./loop-me/SKILL.md)**: Grill yourself into implementable workflow specs over multiple sessions, using the current directory as a stateful workspace. User-invoked.
- **[writing-beats](./writing-beats/SKILL.md)**: Shape an article as a journey of beats, choose-your-own-adventure style. Pick a starting beat, write only that beat, then pivot to the next, until the article reaches a natural end.
- **[writing-fragments](./writing-fragments/SKILL.md)**: Grilling session that mines you for fragments (heterogeneous nuggets of writing) and appends them to a single document as raw material for a future article.
- **[writing-shape](./writing-shape/SKILL.md)**: Take a markdown file of raw material and shape it into an article paragraph by paragraph, arguing format choices at each step.
- **[background-handoff](./background-handoff/SKILL.md)**: Hand the current conversation off to a fresh background subagent that picks up the work immediately, seeded with a handoff summary. User-invoked.
- **[setup-ts-deep-modules](./setup-ts-deep-modules/SKILL.md)**: Wire dependency-cruiser into a TypeScript repo so each package is a deep module: implementation hidden in subfolders, reachable only through its entry-point files, tests exercising it through those. User-invoked.
