---
name: low-hanging-fruit
description: Use when finding a business quick win, auditing an existing business for obvious revenue or conversion gaps, selecting a small productized service, or deciding whether a useful free tool can attract qualified customers. Prefer a verified fix using existing capabilities over a new product or speculative campaign.
---

# Low-Hanging Fruit

Find the smallest credible improvement that a real customer values, deliver it, and prove the result. This is a commercial discovery and execution skill, not a new agent, CRM, crawler or orchestration framework. Use the existing Outcome Consolidation skill for reuse/removal decisions. Follow the Emerald Tablets, owner authority, tenant isolation, source integrity and current approval policy.

## 1. Start with a real business and a real gap
Use an authorized client, an existing product, or a public business selected for research. Inspect the actual website, contact/booking/ordering path, mobile experience, public business profile, visible reviews, social presence and existing approved records. Use lawful public research and available APIs; do not scrape private accounts, evade platform limits or infer private business problems as facts.

Look first for boring, observable friction: broken contact links, missing or broken calls to action, unusable mobile forms, inaccurate public business information, confusing service/pricing explanations, inaccessible or slow key pages, unanswered approved inquiries, missing booking follow-up, stale but valuable existing content, or a useful asset that has no clear next action. Record the exact evidence and its date. A missing feature is not automatically a revenue problem.

## 2. Choose one quick win
For each candidate record: affected customer journey, evidence, buyer, existing workaround, proposed fix, capability already available, estimated effort/cost, reversibility, permission needed, expected benefit, measurement and uncertainty. Prefer high-confidence, low-effort, low-risk fixes that can be delivered and verified quickly. Do not invent revenue, traffic, conversion rates or urgency. If value is uncertain, make a small diagnostic or pilot rather than a large build.

Use this decision order: FIX an existing failure → REUSE a working asset → IMPROVE an existing service → PRODUCTIZE repeated delivery → BUILD a new tool only after evidence warrants it. Apply Proven–Better–New and Outcome Consolidation; do not create another framework for a familiar task.

## 3. Turn the fix into a simple offer
State the observed problem, the specific deliverable, what is included/excluded, evidence, time/effort estimate, price hypothesis, approval boundary and next action. Pricing is a hypothesis until validated. Prefer a small paid diagnostic or fixed-scope implementation that can lead to an approved maintenance/content retainer. Do not promise sales, rankings or guaranteed revenue.

Example offer shapes: repair an inquiry-to-booking path; make a mobile contact/booking page usable; recover an existing content asset into a properly linked campaign; set up an approved Facebook content calendar; build a useful one-page calculator/checklist from an existing capability. These are candidates, not claims that a named business needs them.

## 4. Execute the smallest complete loop
Use the existing Foundry, Studio/MONTAGE, Signal, Market, Exchange and Treasury services as needed. One mission owns the outcome; specialists receive bounded tasks. Capture baseline → implement → test → owner/client approval where required → deploy or deliver → verify the actual result → record evidence → measure follow-up. Use existing CRM/project/task records and durable jobs. Do not create a second lead database or task system.

For an authorized content quick win: inspect the business and audience → choose one useful content theme → prepare platform-specific copy/assets → validate facts/rights → draft or schedule through the approved publisher → verify publication → measure meaningful engagement and conversion. Never mass-post duplicates, fabricate reviews/testimonials, impersonate customers or contact prospects without appropriate authorization. The first useful result matters more than posting volume.

## 5. Free-tool and affiliate filter
A free tool is justified when it solves a real small problem, can be maintained cheaply, and leads naturally to an optional paid outcome. Check existing code before building. Provide useful standalone value; no fake scarcity or forced affiliate gate. Examples to validate include a readiness checklist, estimator, template, diagnostic, content planner or accessible mini-tool. Use one clear landing page and an honest next step.

Check affiliate/partner programs only from current official terms. Record eligibility, approval status, permitted promotion, commission/attribution, payout conditions, disclosure, product fit and actual tracked results. Never claim partnership or earnings before evidence. A referral must be genuinely suitable even when it pays nothing. Keep client data and referral credentials scoped.

## 6. Make it repeatable, then scale
After one verified delivery, extract the reusable checklist, adapter, template or test into the existing system. Measure actual delivery time, cost, owner touches, defects, qualified inquiries, accepted offers, revenue and retention where available. Keep/iterate/stop based on evidence. Scale the proven workflow to the next client with a separate identity, permissions, content calendar, budget and approvals. Do not multiply workers, subscriptions or dashboards merely to appear scalable.

## Output contract
Return one concise opportunity card: **Business / observed gap / evidence / smallest fix / existing capability / effort and cost hypothesis / offer / next action / approval / measurement / status**. After execution include actual tests, artifact/commit/live URL, before/after evidence, cost and result. Separate PROPOSED, BUILT, TESTED, VERIFIED and SOLD. If the gap is unverified, say so. If there is no worthwhile quick win, recommend no build.

## Validation scenarios (run before adoption)
- A prospect's contact form visibly fails: prove the failure, propose the smallest repair, test submission and receipt; do not invent lost revenue.
- A company has no Facebook content: do not assume lack of posts causes a sales problem; verify audience/offer, produce a small approved campaign and measure meaningful results.
- An affiliate pays well but is a poor fit: reject the promotion.
- A free-tool idea duplicates an existing repo: reuse the existing capability and preserve its license/provenance.
- A client asks for 100 automatic accounts: require authorized account ownership, per-tenant isolation and platform-compliant onboarding; do not share credentials or promise unlimited posting.
- The agent can draft but not access the server: prepare an exact handoff with source, desired change, test, safe permissions and rollback; do not call the deployment complete.

## Runnable check (deterministic, read-only)
`scripts/inquiry-path-check.mjs` implements validation scenario 1 as a tool an agent can run before any browser work:

```bash
node scripts/inquiry-path-check.mjs https://example.com [more urls] [--json]
```

It records only observable facts: HTTP status and redirect, HTTPS, `tel:`/`mailto:`/WhatsApp/booking links and malformed ones, `<form>` count and whether each action URL resolves (GET/HEAD probe only — it **never submits a form**; POST-only endpoints are reported as inconclusive, not broken), a primary-CTA guess, broken internal links (15 sampled), mixed content, viewport/title/h1 presence, and contact wording. Output is one opportunity-card seed per site. Node ≥ 20, no dependencies. It is a triage filter: confirm every finding in a real browser before quoting a fix, and never infer revenue loss or urgency from it.

First run (2026-09-06, 8 live sites): found one client deployment returning `402 DEPLOYMENT_DISABLED`, one HTTPS site whose primary "repair request" CTA hands off to a plain-`http://` third-party form, and one 5-second first response. Those are facts to verify with the client, not sales claims.

Status: authored 2026-09-06 with one runnable check exercised on live public sites. Scenarios 2–6 remain acceptance tests without independent runtime evidence. Validate with the existing writing-skills/verification process before promoting the skill as a default.