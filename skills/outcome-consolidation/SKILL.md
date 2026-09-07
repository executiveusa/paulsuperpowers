---
name: outcome-consolidation
description: Use when consolidating repos, agent runtimes, workflows, skills, services, interfaces or organizational systems; when removing duplication or complexity while preserving or improving capabilities; or when deciding whether a new component should exist.
---

# Outcome Consolidation

Reduce the system, not the outcome. Understand the real work before simplifying it. This skill is subordinate to the Emerald Tablets, owner authority, security and existing approval policy. It is a decision/review method, not permission to delete data, install software, spend money or rewrite governance.

## 1. State the outcome
Write one observable result, its owner and acceptance proof. Identify the current baseline: working capabilities, users, dependencies, cost, maintenance, time, failure modes and trust boundaries. Distinguish measured facts from hypotheses. If no outcome is improved, do not add a component.

## 2. Inspect before deciding
Read actual source, manifests, relevant callers, tests, configuration, deployment evidence and current upstream documentation. README claims are leads. Preserve original source identity, commit, license, rights and provenance. Map the existing path end-to-end and identify the canonical owner of each state and responsibility. Do not execute untrusted skills or import a fork merely to inspect it.

## 3. Apply the reduction ladder
Stop at the first sufficient solution:
1. Does this need to exist? Skip speculative work.
2. Does the current system already do it? Reuse it.
3. Can a standard-library or native platform capability do it? Prefer that.
4. Does an approved installed dependency or existing service do it? Reuse it.
5. Can a small shared fix solve the root cause? Fix once.
6. Can two capabilities share one contract or implementation? Consolidate while preserving ownership and boundaries.
7. Only then add the minimum new capability required.

Compare actual alternatives by capability coverage, reliability, latency, total cost, maintainability, portability, security and owner effort. Fewer lines, tokens, agents or repos are not sufficient proof. Do not consolidate unrelated trust domains just to reduce component count.

## 4. Decide and execute
Classify each asset USE, MERGE, SELL, PARK or ARCHIVE. Record the canonical implementation, retained capabilities, rejected alternatives, dependencies and rollback. Prefer adapters or extracted reusable functions over a full rewrite. Make the smallest reversible change. Preserve tests, validation, accessibility, data integrity, security, licenses, source provenance and required behavior. Never delete original writing, customer data, story canon, credentials or useful history as a shortcut. Archive/retire only after replacement evidence and authorized retention decisions.

## 5. Prove enhancement, not just reduction
Run a baseline and the same acceptance tests after the change. Measure the intended outcome and regressions. Include independent correctness/security review and a Ponytail complexity review. Confirm the old and new paths do not both remain active unnecessarily. Record before/after capability, cost, reliability, owner actions and evidence. Mark BUILT, TESTED, VERIFIED and ADOPTED separately. If the result is worse, restore the previous version. If it is already lean, say so and ship.

## 6. Learn without accumulating clutter
Keep one versioned decision/lesson in the existing registry or task record. Promote a reusable skill only after a real failure or demonstrated need, a targeted test and review. Deduplicate overlapping skills, keep specialist capabilities scoped, and make global laws small. Do not let a skill change agent identity, permissions or constitutional authority. Revisit retired components only when a measured requirement justifies them.

## Output contract
Return: outcome; existing path; chosen reduction; retained/enhanced capabilities; what was removed or avoided; tests and evidence; rollback; remaining blocker or next action. For a proposed change, show the smallest useful diff/decision rather than another architecture. For an implementation, provide exact commit/release evidence. Never claim deployment, adoption, savings or revenue without proof.

## Pressure tests
- Five agent frameworks overlap: inventory capabilities, choose an approved runtime pool, preserve specialized adapters; do not merge all source trees.
- Two dashboards share status: use one authoritative state API and remove duplicated state; retain distinct owner-facing views only if useful.
- A one-line change drops input validation: reject it; minimum means minimum correct implementation.
- A client tenant and personal life share a database: do not merge their private data or credentials; reuse code with scoped access.
- A new skill repeats three installed skills: select the best existing one or merge tested guidance, preserve provenance, and retire redundant instructions.
- A README claims production but the endpoint fails: report unverified, inspect real code and tests, and repair the smallest root cause.
