# Source Layer — Site Audit & Implementation Plan
July 5, 2026

## Audit summary

Two versions exist:

**Live site (sourcelayer.co)** — the OLD Bullhorn-only build. Fails the current strategy: no Google Workspace lane, positions Source Layer as a Bullhorn company, nav says "Book a Call" not "Book an Audit", no offer ladder, no pricing.

**Local rebuild (`/site`)** — already repositioned and passes nearly every guardrail:

- Source Layer branding correct; zero "Course Layer" instances
- Two-lane positioning (Bullhorn wedge + Google Workspace) on homepage; Bullhorn not buried, not dominant
- Primary CTA "Book a Systems Audit" consistent across all 7 pages; lane CTAs intact
- Offer ladder Audit → Cleanup Sprint → Optimization → Monthly Support implemented on Services
- Homepage has exactly 2 lane cards + 6 compact pricing tiles — not overloaded
- No migration offers (only two acceptable passing mentions: "data migration support" within implementation help, and a "the fix is never one big migration" line)
- Zero banned corporate/AI-hype words
- Bullhorn independence disclaimer on all 7 pages (+ Google trademark line); "Bullhorn support" only used for Bullhorn Inc.'s support desk — lane is correctly "Bullhorn Cleanup"
- Contact page: Calendly embed + Formspree intake form + email fallback; unique titles + meta descriptions on every page

## Gaps found (the actual work)

1. **BLOCKER — Formspree form ID** is still `YOUR_FORM_ID`; form submissions go nowhere. Need Jake to create the free Formspree account (jacob@sourcelayer.co) and give me the ID.
2. **BLOCKER — About background paragraph** still a placeholder. Need 2–3 sentences from Jake.
3. **Decision — pricing currency**: published in CAD; target market mostly US. Confirm CAD stays or switch to USD before deploy.
4. **SEO basics missing**: no canonical tags, no sitemap.xml, no robots.txt, no 404 page, OG tags only verified on index.
5. **Form UX**: no submit success state (Formspree default redirect is generic — add `_next` redirect to a thank-you state or inline confirmation).
6. **QA not yet run**: mobile nav, Calendly embed load, all internal links, reveal animations, Lighthouse pass.

## Implementation plan (in order)

1. **SEO pass** — add canonical + OG tags to all pages, create sitemap.xml, robots.txt, simple 404.html. No copy changes. *(no approval needed — local only)*
2. **Form polish** — add thank-you handling; keep form to 5 fields (already right length). Wire real Formspree ID once Jake provides it.
3. **Jake inputs** — About paragraph, Formspree ID, CAD/USD call.
4. **QA** — link check, mobile check, embed check, spellcheck, guardrail re-scan.
5. **Deploy** — replace live Bullhorn-only site with the rebuild. **Only after Jake's explicit approval.** This is the highest-impact single step: the live site currently contradicts the entire strategy.

## Explicitly deferred (per guardrails)

Migration offers, advanced automation pages, resource library/blog, extra pages.
