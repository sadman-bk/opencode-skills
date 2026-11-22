# Routing every grilling question through the `question` tool

Grilling sessions (`/grilling`, `/grill-me`, `/grill-with-docs`, and grilling inside other skills) use OpenCode's native `question` tool only for closed choices, with the recommended answer first and marked "(Recommended)". Open questions stay as plain chat text. Requests to send every question through the tool, or to batch a whole session into one structured questionnaire, are out of scope.

## Why this is out of scope

Structured pickers push the model towards multiple-choice questions with pre-baked answers, which is the opposite of what grilling is for: open questions you answer in your own words, one branch of the decision tree at a time. The `question` tool always offers a free-form answer, but the options still frame what you say.

So the line is the shape of the question. A closed choice (which tracker, which label scheme, keep or drop) fits the tool. A question that exists to draw out your reasoning does not.

If you want a different split, say so in your own `AGENTS.md` ("when grilling, always ask through the question tool", or "never use it"). That's a one-line, per-user preference, and it doesn't need the shared skill to change.
