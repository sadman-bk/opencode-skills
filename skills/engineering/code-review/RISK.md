# Risk checklist

The **Risk** axis asks one question: _what did the author and the tests miss that would hurt in production?_ Read the actual code, not just the diff: callers, callees, models, config, migrations, and existing tests. Work through every section below. For each edge-case category, decide whether it is relevant to this change; only relevant categories go in the report.

## Correctness

- Trace the happy path end to end, then each failure path.
- Check every domain rule the change encodes (pricing, permissions, state transitions, ordering, idempotency) against the brief's stated intent and invariants.

## Edge cases

- **Inputs**: null/undefined/empty, zero, negative, very large, wrong type, malformed, duplicate, boundary values (off-by-one), unicode and encoding, whitespace, case.
- **Data state**: missing records, stale data, partially migrated data, legacy rows, soft-deleted or archived entities, orphaned references.
- **Time**: time zones, DST, leap years, clock skew, expiry boundaries, event ordering.
- **Concurrency**: races, double submits, retries, idempotency, deadlocks, lost updates, transaction isolation, cache invalidation.
- **Failure modes**: timeouts, partial failures, third-party outages, retry and backoff, rollback and compensation, what the user sees on error.
- **Scale**: N+1 queries, unbounded loops or payloads, pagination, memory, hot paths, behaviour at 10x and 100x load.
- **Security and permissions**: authn/authz gaps, IDOR, injection, mass assignment, data leaking into logs or responses, tenant isolation, secrets handling.
- **State machines**: invalid or skipped transitions, re-entrancy, terminal states.
- **Money, quantities, precision**: rounding, currency, floating point, overflow.
- **Environment**: feature flags on and off, config differences, deploy ordering, rollback safety.

## Regressions

- Search the codebase for every consumer of what the diff touches: functions, API contracts, schemas, events, persisted or serialized formats. Include indirect callers.
- Check backward compatibility of public interfaces and migrations (safe on live data? reversible? locking?).
- Look for changed defaults, renamed fields, altered ordering, and changed error types or messages that other code relies on.
- Check whether existing tests were weakened, deleted, or altered to make the change pass.

## Tests

- Do the tests verify behaviour, or only implementation details?
- Which relevant edge cases and regressions above are untested? Propose concrete cases: input, and expected outcome.
- Flag flaky patterns: time dependence, order dependence, shared state, over-mocking.

## Extra report sections

On top of the findings, the Risk report ends with:

1. **Edge case matrix**: a table `Scenario | Handled? (Yes / Partial / No) | Notes`, relevant rows only.
2. **Regression risk**: affected areas, likelihood, and how to verify (tests, manual checks, staged rollout, monitoring).
3. **Missing tests**: a prioritized list of concrete cases.
