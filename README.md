# Source Layer — redesigned site (July 2026)

Drop-in replacement for the `/site` folder. Static HTML + one CSS + one JS. No build step.

## Before deploying — 3 required swaps

1. **Calendly** — `contact.html`: replace `https://calendly.com/REPLACE-WITH-YOUR-LINK/30min` in the `data-url` attribute with the real event link.
2. **Formspree** — `contact.html`: replace `https://formspree.io/f/REPLACE-WITH-YOUR-ID` in the form `action` with the real endpoint.
3. **Headshot** — pages reference `img/jake-flaherty.jpg`. Keep the existing image file from the current repo at that path (it isn't included here).

## Keep from the current repo

- `img/` (headshot + any brand assets)
- `sitemap.xml`, `robots.txt`, favicon links if present (re-add favicon `<link>` tags to each page's `<head>` if the current site has them)

## What changed

- New hierarchy: hero H1/tagline split, two-column pain lists, audience-first lane cards, pricing grouped under the Diagnose → Clean up → Optimize → Support ladder.
- Services page rebuilt around the 4-step ladder with anchor chips (`#diagnose`, `#cleanup`, `#optimize`, `#monthly-support` preserved).
- Contact is Calendly-first with the intake form as secondary path (redirects to `thank-you.html`).
- Sticky mobile CTA bar on all content pages (single conversion path).
- Mobile menu, reveal-on-scroll, reduced-motion support, skip links, focus-visible states, disclaimers on every page — all preserved/implemented in `css/style.css` + `js/main.js`.

All copy is verbatim from the live site per the design handoff (§7–§9). Guardrails respected: no invented proof, no vendor logos, no pure white, banned words avoided.
