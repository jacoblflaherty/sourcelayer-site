# Source Layer — Site Snapshot
Live at: https://sourcelayer.co · Snapshot date: July 5, 2026
Status: **Repositioned build in `/site` — NOT YET DEPLOYED. Live site still shows the Bullhorn-only version.**

---

## 1. BRAND CONTEXT

- **Business:** Source Layer — independent consulting practice. **Business Systems Cleanup & Implementation** for owner-led businesses, with two lanes:
  1. **Bullhorn/recruiting systems** (staffing & recruiting agencies) — the specialist wedge with direct proof
  2. **Google Workspace/business operations** (owner-led small businesses) — the broader market lane
- **Operator:** Jake Flaherty. "Technical Implementation & Systems Operator. CRM/ATS workflows, Google Workspace, customer adoption, practical process improvement. Turning messy operations into usable systems."
- **Unifying idea:** "We clean up the backend of your business so your team can find things, follow a process, and stop wasting time."
- **Tagline:** "Fix the layer everything runs on."
- **Primary CTA sitewide:** "Book a Systems Audit" → contact.html (free 30-min Calendly call first). Lane CTAs: "Book a Bullhorn System Audit" / "Book a Workspace Cleanup Audit". Nav button: "Book an Audit".
- **Pricing:** PUBLISHED as USD ranges (switched from CAD July 5, 2026, evening — Jake's call).
- **Voice rules:** clear, direct, practical, plainspoken, slightly sharp, not corporate. Banned: unlock, elevate, robust, seamless, game-changing, next-level, transform, end-to-end/tailored solutions, operational excellence, boomer/dinosaur/tech-shy, AI-powered transformation, agentic, future-proof, digital transformation.
- **Hard constraints:** no "Bullhorn" in brand/logo/domain; independence disclaimer sitewide (+ Google Workspace trademark line); no invented metrics/testimonials/clients; case study anonymous and blame-free; nothing implying Bullhorn partnership/certification.
- **Design system:** unchanged — warm paper (#faf9f5), green-black ink, green accent (#14724d), Source Serif 4 + Inter. Form styles added to style.css.
- **Contact:** jacob@sourcelayer.co · calendly.com/jacoblflaherty/30min

## 2. SITEMAP

1. Home (/) — broad backend-cleanup hook, pain recognition, two lane cards, how it works, 6 offers w/ pricing, why Source Layer, CTA
2. Services (/services.html) — restructured July 5 2026 (addendum) around the maturity path **Diagnose → Clean Up → Optimize → Support**:
   - Step 1 Diagnose: Systems Audit ($750–$1,500, featured) · Bullhorn System Audit ($1,500–$2,500)
   - Step 2 Clean up: Google Workspace Cleanup ($1,500–$3,500) · Bullhorn Cleanup Sprint ($3,500–$7,500, + Implementation from $6,500)
   - Step 3 Optimize: Workflow Automation Setup ($2,500–$6,000, incl. Bullhorn Workflow Automation Sprint) · Reporting & Dashboards ($1,500–$4,000) · Team Training & Onboarding Playbook ($1,000–$2,500)
   - Step 4 Support (#monthly-support anchor): Light $750/mo · Core $1,500/mo (featured) · Operator $3,000/mo
   - Homepage has "Keep the system clean after the cleanup" section linking to #monthly-support; Bullhorn page has Phase 2 upsell section (Automation Sprint scoped to client's license/permissions — never promise provisioning). Platform migrations deliberately NOT offered (addendum: revisit once delivery process exists).
   - Naming rule (Jake, July 5 2026): never call the Bullhorn lane "Bullhorn Support" — he is not tech support. Lane = "Bullhorn Cleanup". "Support" is acceptable only for Bullhorn Inc.'s own support desk and the monthly retainer tier names.
3. Bullhorn Cleanup (/bullhorn-cleanup.html) — hero "Bought Bullhorn, but your team still works around it?", pain bullets, 3 engagements (Audit / Cleanup Sprint / Implementation+Training from $6,500), sprint phases, liaison, disclaimer callout
4. Google Workspace Cleanup (/workspace-cleanup.html; nav label "Google Workspace" per Jake, July 5 2026 — do NOT rename the file, Jake reverted that) — hero "Your team shouldn't need a search party to find a file", pain bullets, cleanup + handoff deliverables, 3-step process
5. Proof (/proof.html) — sanitized Bullhorn case study + bridge line to Workspace lane
6. About (/about.html) — Jake's own copy integrated July 5 (Why Source Layer exists / How I ended up doing this / What the work looks like), plus principles and "What I'm not"
7. Book an Audit (/contact.html) — Calendly embed (primary) + short intake form (Formspree, **form ID placeholder**) + email fallback

## 3. OPEN ITEMS BEFORE DEPLOY

1. **Deploy approval** — Jake must approve before pushing live (all content blockers now cleared)
3. Calendly slug still generic /30min (optional rename)
4. No blog/resources yet (deliberate, post-launch)
5. Post-deploy: submit sitemap in Google Search Console; send a test form submission to verify Formspree delivery
6. ~~Formspree form ID~~ DONE — wired `f/mzdlokry` into contact.html July 5 evening

## 4. DONE JULY 5 2026 (evening session)

- Pricing switched to **USD** (Jake's call; same numbers, relabeled — flagged as effective raise vs CAD, accepted)
- SEO: canonical tags all pages; JSON-LD (ProfessionalService on home, Service on both lane pages); sitemap.xml; robots.txt
- New pages: 404.html, thank-you.html (both noindex, no nav-active state)
- Contact form: hidden `_next` → thank-you.html + `_subject` fields added
- QA re-scan passed: links, guardrails, disclaimers (now on 9/9 pages), JSON-LD valid
- About page: Jake's own copy integrated (implementation-gap line softened per guardrail; closing disclaimer dropped — footer carries it)
- Headshot (plaid, IMG_5596.PNG): background recolored gray → brand green-ink, web-optimized to site/img/jake-flaherty.jpg (800w, 62KB); on About hero (side-by-side layout, .with-portrait) + small round version on contact page (.contact-who trust strip). Full-res kept at brand/jake-headshot-brand-bg.png. Vendor logos (Bullhorn/Google) deliberately NOT used — trademark risk.
- LinkedIn banner rebuilt in brand (brand/source-layer-banner-linkedin.png, 1584×396): "Skills build the business. / Systems scale them." Source Serif + italic sage accent, layered-cube motif, sourcelayer.co. Fonts obtained via @fontsource npm packages → TTF in /tmp/fonts (sandbox).
