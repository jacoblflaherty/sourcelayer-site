# Source Layer — Project Blueprint

Working brand: **Source Layer** (pending domain check: sourcelayer.com)
Positioning line: Technical Implementation & Systems Operator — CRM/ATS Workflows, Adoption & AI-Assisted Process Improvement.
Tagline direction: **"Fix the layer everything runs on."**

---

## 1. Sitemap (6 pages — lean, credible, no filler)

| Page | URL | Purpose |
|---|---|---|
| Home | `/` | Hook the frustrated Bullhorn owner, route to offer, drive booking |
| Bullhorn Cleanup | `/bullhorn-cleanup` | The flagship offer page — deepest copy, main revenue page |
| Services | `/services` | Everything else: support, liaison, training, adoption, process work |
| Proof | `/proof` | Sanitized case study + how I work |
| About | `/about` | Who Jake is, why he's credible, the operator angle |
| Book a Call | `/contact` | Calendly embed + email fallback |

Dropped from the original 8: separate "Support/Liaison" page (folded into Services — don't split thin content across two pages pre-revenue) and Resources/Insights (add after launch; empty blog sections hurt credibility).

## 2. Offer positioning

Lead offer: **Bullhorn Cleanup Sprint** — a fixed-scope engagement, not open-ended consulting.
Why this name wins: "Cleanup" names the pain in the buyer's own words; "Sprint" signals fixed timeline/cost and a beginning-middle-end, which is easier to buy than "consulting." "Audit" alone sounds like a report they'll pay for and shelve.

The audit still exists — as the **entry step of the Sprint** (diagnose → clean → document → train), and as the low-friction first purchase for hesitant buyers.

## 3. Primary CTA

**"Book a Bullhorn Cleanup Call"** — everywhere, one CTA, no competing buttons.
It's specific (Bullhorn), names the outcome (cleanup), and low-commitment (a call, not a contract). Links to Calendly.

## 4. Homepage structure

1. Hero: pain-first headline + subhead + CTA
2. "Sound familiar?" — 6 recognition bullets (messy data, no reporting trust, follow-ups slipping…)
3. What I do — 3 blocks: Clean up / Make it stick / Keep it working
4. How it works — 3 steps (Call → Sprint → Handoff)
5. Proof strip — sanitized case study summary
6. Who this is for / not for
7. Final CTA block

## 5. Service packaging

1. **Bullhorn Systems Audit** — entry. Fixed-fee diagnostic: data health, workflow gaps, adoption gaps, prioritized fix list. Deliverable: findings + roadmap. (Also de-risks the Sprint.)
2. **Bullhorn Cleanup Sprint** — core. Fixed-scope: record/dup cleanup, field & stage rationalization, workflow repair, usage standards doc, team walkthrough.
3. **Ongoing Support & Liaison** — retainer. Monthly admin support, Bullhorn-support ticket liaison, new-hire onboarding, continued adoption coaching.

No public pricing at launch — "fixed-fee, scoped on the call." Revisit after first 3 sales.

## 6. What I need from Jake

- [ ] Domain availability result (sourcelayer.com et al.)
- [ ] Calendly link (free account: calendly.com → Google login → create "Bullhorn Cleanup Call — 30 min" event)
- [ ] Business email to display (jacoblflaherty@gmail.com or a domain email later)
- [ ] 2–3 sentence background for About (roles/years in staffing ops — no employer names needed)
- [ ] Approval of case study language before publish
- [ ] A headshot (optional but recommended for About)
- [ ] Reference materials mentioned in the brief (competitor pages, notes) — drop into this folder anytime; I'll fold findings into the copy

## 7. Technical build plan

- **Stack: static HTML + CSS** (one shared stylesheet, no frameworks, no build step). Fastest, cheapest, most secure, easiest for a beginner to maintain. No database to hack, nothing to update.
- **GitHub** repo = source of truth for the site files.
- **DigitalOcean Droplet** ($6/mo, Ubuntu + nginx) serves the site.
- **Deploy**: a one-line script pulls the latest from GitHub onto the server. Update flow forever after: edit file → push → run one command.
- **DNS**: domain registrar points to the Droplet IP.
- **HTTPS**: free Let's Encrypt certificate, auto-renews.

Honest note: DigitalOcean is more setup than you need (GitHub Pages/Netlify would be live in 10 minutes, free). But a static site on a Droplet is the *gentlest possible* version of the workflow you want to learn, and it doesn't slow the copy/offer work at all. Proceeding as planned.

## 8. Fastest path to launch

1. **Now**: I build all pages with real copy → you review (biggest time saver: copy is the actual work)
2. **Day 1–2**: domain purchased, Calendly created, copy revised
3. **Day 2–3**: GitHub + Droplet setup (~1–2 hrs of guided steps), DNS + SSL (DNS can take up to a day to propagate)
4. **Day 3–4**: live-site verification → launch
Realistic total: **under a week**, most of it waiting on DNS and your copy review.

## 9. Risks & decisions not to ignore

- **Trademark**: "Bullhorn" never appears in the brand, domain, or logo. Site will carry a one-line disclaimer: independent consultant, not affiliated with or endorsed by Bullhorn Inc. Non-negotiable.
- **Case study sensitivity**: all proof language ships sanitized per your rules; you approve every word before publish. I'll flag anything borderline.
- **Employer conflict**: you said "full send," but I'll still keep framing that doesn't reference current work. If your employment agreement has a non-compete/moonlighting clause, read it before taking a paying client — not a website issue, a business one. (Not legal advice; worth 10 minutes with the actual document.)
- **No invented proof**: zero testimonials/metrics until real ones exist. The site is built to be credible without them.
- **Lead capture**: Calendly is the funnel. Book the call event with buffer and a couple of qualifying questions (agency size, Bullhorn edition, biggest frustration).

## 10. First concrete build step

Build the six pages with full copy under the Source Layer brand — happening now. Files land in this folder for your review.
