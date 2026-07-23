/* ============================================================
   Source Layer — Bullhorn Implementation Check
   Deterministic diagnostic: assessment -> scoring -> contact gate -> result.
   Vanilla JS, no dependencies. Progress persists in localStorage.
   ============================================================ */
(function () {
  'use strict';

  /* ---------------------------------------------------------
     CONFIG — Jake fills these three in (see setup checklist).
     Everything no-ops gracefully until they are present.
     --------------------------------------------------------- */
  var CONFIG = {
    // GA4 Measurement ID, e.g. 'G-XXXXXXXXXX'. Leave '' to disable analytics.
    GA4_MEASUREMENT_ID: 'G-Y0H9EQ40PN',
    // Apps Script web app /exec URL. Leave '' to run front-end without a backend.
    APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbwHeeYvbM9-JFpNJ6lwG_OU28GqwNRcGCT_3Gs4w0WrAnBlJ9cCDblYZ_G5V8fsK8efCg/exec',
    // Calendly event for the Results Review (live event, created 2026-07-23).
    CALENDLY_RESULTS_REVIEW_URL: 'https://calendly.com/jacoblflaherty/bullhorn-results-review',
    // Phase 2 flag. Flip to true once bullhorn-cost-calculator is live.
    CALCULATOR_ENABLED: false
  };

  var STATE_KEY = 'sl_blc_state_v1';
  var ATTR_KEY = 'sl_blc_attr_v1';
  var SESSION_STARTED = 'sl_blc_started';

  /* ---------------------------------------------------------
     SCORED QUESTIONS (10). Answers are worth 4,3,2,1,0.
     Two questions map to each of the five dimensions.
     --------------------------------------------------------- */
  var SCORED = [
    {
      id: 'q1', n: 1, dim: 'status_architecture',
      title: 'Do your candidate statuses mean one clear thing — and does everyone use them the same way?',
      context: 'If “Screening” means three different things, the database cannot reliably separate current candidates from stale ones.',
      answers: [
        { v: 4, label: 'Every status is clearly defined and used consistently' },
        { v: 3, label: 'Mostly — a few cause occasional confusion' },
        { v: 2, label: 'Different recruiters interpret some of them differently' },
        { v: 1, label: 'Several are catch-alls or mean different things depending on who entered them' },
        { v: 0, label: 'I could not confidently define every status we use today' }
      ]
    },
    {
      id: 'q2', n: 2, dim: 'status_architecture',
      title: 'Are Candidate Status and Submission Status doing different jobs?',
      context: 'Most small agencies were never properly shown this distinction. Mixing them makes it difficult to answer, “Who can we place right now?”',
      answers: [
        { v: 4, label: 'Yes — overall availability vs. job-specific progress are clearly separate' },
        { v: 3, label: 'Mostly, with a few inconsistencies' },
        { v: 2, label: 'We know they differ but use them inconsistently' },
        { v: 1, label: 'They often get mixed together' },
        { v: 0, label: 'I’m not sure of the difference' }
      ]
    },
    {
      id: 'q3', n: 3, dim: 'candidate_visibility',
      title: 'When a new job comes in, does every recruiter follow a consistent Bullhorn search process before sourcing elsewhere?',
      context: 'Bullhorn only becomes reusable candidate inventory when the team can find people beyond the names they already remember.',
      answers: [
        { v: 4, label: 'Yes — a standard, consistent search process' },
        { v: 3, label: 'Usually, with occasional exceptions' },
        { v: 2, label: 'It depends on the recruiter or the role' },
        { v: 1, label: 'Recruiters start with familiar candidates, email, LinkedIn, job boards, or personal lists' },
        { v: 0, label: 'There is no reliable internal search process' }
      ]
    },
    {
      id: 'q4', n: 4, dim: 'crm_reporting',
      title: 'Do Leads, Contacts, Companies, Candidates, and Jobs each have a clear definition, owner, stage, and next action?',
      context: 'Agencies often feel confident until the records reveal hundreds of leads outside a working pipeline and candidates stored in the wrong places.',
      answers: [
        { v: 4, label: 'Yes — documented and consistent' },
        { v: 3, label: 'Mostly, with minor inconsistencies' },
        { v: 2, label: 'Informal, and not always consistent' },
        { v: 1, label: 'Many records have no clear owner, stage, pipeline, or next action' },
        { v: 0, label: 'I’m not confident these objects are used correctly' }
      ]
    },
    {
      id: 'q5', n: 5, dim: 'crm_reporting',
      title: 'Does leadership use Bullhorn’s pipeline and reporting in regular meetings without rebuilding the story manually?',
      context: 'The real test is not whether a report exists. It is whether leadership trusts it enough to run the meeting from it.',
      answers: [
        { v: 4, label: 'Yes — trusted and used directly' },
        { v: 3, label: 'Mostly, with light checking' },
        { v: 2, label: 'Used, but someone reconciles or supplements it manually' },
        { v: 1, label: 'A spreadsheet or manual summary is the real report' },
        { v: 0, label: 'There is no usable pipeline or reporting' }
      ]
    },
    {
      id: 'q6', n: 6, dim: 'operating_discipline',
      title: 'How much of the agency is still being run outside Bullhorn?',
      context: 'Spreadsheets, inboxes, personal lists, and even paper notes are usually symptoms of an unfinished operating model — not a lazy team.',
      answers: [
        { v: 4, label: 'Almost none — Bullhorn is the source of truth' },
        { v: 3, label: 'A few personal notes or temporary workarounds' },
        { v: 2, label: 'Several spreadsheets, shared lists, or makeshift tearsheets alongside it' },
        { v: 1, label: 'Recruiters maintain separate workflows or personal systems' },
        { v: 0, label: 'Bullhorn is secondary — the real operation lives elsewhere' }
      ]
    },
    {
      id: 'q7', n: 7, dim: 'candidate_visibility',
      title: 'Are active, dormant, unavailable, archived, and re-engagement candidates clearly separated?',
      context: 'Dormant candidates are not automatically useless. The problem is leaving them mixed with current records until they become noise.',
      answers: [
        { v: 4, label: 'Yes — clearly defined, with deliberate re-engagement' },
        { v: 3, label: 'Mostly, with a few unclear areas' },
        { v: 2, label: 'Statuses exist but are inconsistent, with no deliberate re-engagement' },
        { v: 1, label: 'Current and stale candidates are mixed together' },
        { v: 0, label: 'I don’t know how many are active, dormant, unavailable, or recoverable' }
      ]
    },
    {
      id: 'q8', n: 8, dim: 'sustainability',
      title: 'When an assignment ends, does the candidate reliably return to a recruitable status?',
      context: 'If a finished worker remains marked as placed, recruiters can miss someone who is available, known, and already paid to acquire.',
      answers: [
        { v: 4, label: 'Yes — automated and tested' },
        { v: 3, label: 'A clear manual process that is consistently followed' },
        { v: 2, label: 'It depends on someone remembering' },
        { v: 1, label: 'They often remain marked placed after the assignment ends' },
        { v: 0, label: 'I don’t know — there is no defined process' }
      ]
    },
    {
      id: 'q9', n: 9, dim: 'operating_discipline',
      title: 'Who owns Bullhorn internally?',
      context: 'A small agency does not need a full-time administrator. It does need one operating standard and someone responsible for maintaining it.',
      answers: [
        { v: 4, label: 'A named owner with authority, time, and regular maintenance' },
        { v: 3, label: 'One person informally owns it' },
        { v: 2, label: 'Shared across several people, without one standard' },
        { v: 1, label: 'Everyone fixes their own corner' },
        { v: 0, label: 'Nobody clearly owns it' }
      ]
    },
    {
      id: 'q10', n: 10, dim: 'sustainability',
      title: 'If the person who knows Bullhorn best were away tomorrow, could someone else run the system correctly?',
      context: 'The question is simple: who owns what, what happens next, and can the work continue when one person is unavailable?',
      answers: [
        { v: 4, label: 'Yes — roles, definitions, workflows, and maintenance are documented' },
        { v: 3, label: 'Mostly written down, with a few gaps' },
        { v: 2, label: 'Much of it is informal or tribal knowledge' },
        { v: 1, label: 'It depends heavily on one person’s memory' },
        { v: 0, label: 'Important processes would stop or become inconsistent' }
      ]
    }
  ];

  /* ---------------------------------------------------------
     QUALIFICATION GROUPS (unscored) — two screens of three selects.
     Sharpens the result and feeds the calculator later. Company is
     collected once, at the gate. No phone number.
     --------------------------------------------------------- */
  var QUAL_GROUPS = [
    { n: 1,
      kicker: 'Scoring done \u2014 two quick screens to sharpen your result',
      fields: [
        { id: 'employee_count', label: 'How many full-time employees?',
          options: ['1\u20134', '5\u20139', '10\u201319', '20\u201349', '50+'] },
        { id: 'bullhorn_user_count', label: 'How many people use Bullhorn?',
          options: ['1\u20132', '3\u20135', '6\u201310', '11\u201325', '26+'] },
        { id: 'staffing_model', label: 'What kind of staffing do you do?',
          options: ['Permanent / direct hire', 'Contract / temp', 'Mixed'] }
      ] },
    { n: 2,
      kicker: 'Last screen before your results',
      fields: [
        { id: 'years_on_bullhorn', label: 'How long have you been on Bullhorn?',
          options: ['Less than a year', '1\u20132 years', '3\u20135 years', 'More than 5 years', 'Not sure'] },
        { id: 'formal_implementation_completed', label: 'Was a formal Bullhorn implementation ever completed?',
          options: ['Yes, a full implementation', 'Partially', 'No \u2014 we set it up ourselves', 'Not sure'] },
        { id: 'primary_frustration', label: 'What frustrates you most right now?',
          options: ['Search \u2014 finding the right people', 'Candidate data quality', 'Pipeline & reporting', 'Workflows & process', 'Team adoption', 'Automation', 'Not sure yet'] }
      ] }
  ];

  /* ---------------------------------------------------------
     DIMENSIONS, BANDS, FINDINGS
     --------------------------------------------------------- */
  var DIMENSIONS = [
    { key: 'status_architecture', label: 'Status Architecture', qs: ['q1', 'q2'] },
    { key: 'candidate_visibility', label: 'Candidate Visibility', qs: ['q3', 'q7'] },
    { key: 'crm_reporting', label: 'CRM and Reporting', qs: ['q4', 'q5'] },
    { key: 'operating_discipline', label: 'Operating Discipline', qs: ['q6', 'q9'] },
    { key: 'sustainability', label: 'Sustainability and Continuity', qs: ['q8', 'q10'] }
  ];

  var BANDS = [
    { min: 85, max: 100, name: 'Implemented and Controlled',
      blurb: 'Your answers point to a clear operating model that the team uses consistently. The remaining opportunity is targeted optimization, not a broad rescue.' },
    { min: 70, max: 84, name: 'Working, but Dependent on People',
      blurb: 'The system functions, but it leans on individual habits, manual checks, and knowledge that isn’t written down. That works until someone is away.' },
    { min: 50, max: 69, name: 'Installed, Partially Implemented',
      blurb: 'Bullhorn is installed, but important parts of the operating process may never have been fully implemented — which is exactly where small agencies tend to lose time.' },
    { min: 30, max: 49, name: 'Workarounds Are Running the Agency',
      blurb: 'Spreadsheets, personal workflows, inconsistent statuses, and manual reporting are doing much of the real work. The software is there; the operating layer around it isn’t finished.' },
    { min: 0, max: 29, name: 'Bullhorn Is Mostly a Database, Not an Operating System',
      blurb: 'Right now Bullhorn is storing records without reliably directing search, pipeline, reporting, ownership, and follow-up. That’s a finishable problem, not a reason to switch platforms.' }
  ];

  var FINDINGS = {
    status_architecture: {
      label: 'Status Architecture',
      suggest: 'Your statuses may not carry one consistent meaning, or Candidate Status and Submission Status may be doing the same job.',
      matters: 'Mixing global availability with job-specific progress hides who is actually placeable right now.',
      verify: 'List every Candidate Status, ask two recruiters to define each one separately, and compare their answers.',
      action: 'Write a one-sentence definition for each status, and separate overall availability from job-specific submission progress.'
    },
    candidate_visibility: {
      label: 'Candidate Visibility',
      suggest: 'There may be no consistent method for finding candidates already in Bullhorn, and active/dormant records may be creating noise.',
      matters: 'The agency ends up repurchasing candidate supply through job boards and external sourcing while known candidates stay hard to retrieve.',
      verify: 'Pick one role you fill regularly and compare the Bullhorn search process against recruiters’ personal lists and go-to candidates.',
      action: 'Define standard fields, status rules, categories, and a search sequence for that one role before changing the whole database.'
    },
    crm_reporting: {
      label: 'CRM and Reporting',
      suggest: 'Leads, contacts, companies, jobs, and pipeline stages may exist without one operating definition, so leadership rebuilds the story manually.',
      matters: 'A report isn’t useful just because Bullhorn generates it — leadership has to trust the records enough to run meetings from it.',
      verify: 'Pull all open leads and jobs and check that each has an owner, a stage, a next action, and a clear relationship to the right company or contact.',
      action: 'Define the minimum required structure for one working sales pipeline and one working recruiting pipeline.'
    },
    operating_discipline: {
      label: 'Operating Discipline',
      suggest: 'Spreadsheets, tearsheets, personal notes, and separate workflows may have become the real operating system.',
      matters: 'When no one owns the standard, everyone solves the same problem differently and Bullhorn becomes less trustworthy over time.',
      verify: 'Inventory every spreadsheet, personal list, and shared tracker managing work that should be visible in Bullhorn.',
      action: 'Name one internal owner, and decide which outside systems to retire, keep temporarily, or formally integrate.'
    },
    sustainability: {
      label: 'Sustainability and Continuity',
      suggest: 'Visibility and data quality may depend on memory — including manually returning finished workers to a recruitable status.',
      matters: 'Available candidates stay hidden as “placed,” and undocumented rules disappear when the person who knows them is away.',
      verify: 'Review placements that ended in the last 90 days and check that each candidate became visible and recruitable again.',
      action: 'Define the placement-end rule, document it, and automate it where configuration and permissions allow.'
    }
  };

  /* ---------------------------------------------------------
     SCORING (deterministic, transparent, unit-testable)
     --------------------------------------------------------- */
  function computeResult(answers) {
    var raw = 0, i;
    for (i = 0; i < SCORED.length; i++) {
      var v = answers[SCORED[i].id];
      raw += (typeof v === 'number') ? v : 0;
    }
    var overall = Math.round((raw / 40) * 100);

    var dims = DIMENSIONS.map(function (d) {
      var dimRaw = 0;
      d.qs.forEach(function (qid) {
        var val = answers[qid];
        dimRaw += (typeof val === 'number') ? val : 0;
      });
      return { key: d.key, label: d.label, raw: dimRaw, score: Math.round((dimRaw / 8) * 100) };
    });

    // Three lowest-scoring dimensions -> priority findings.
    // Stable tie-break: preserve DIMENSIONS order.
    var ordered = dims.map(function (d, idx) { return { d: d, idx: idx }; })
      .sort(function (a, b) {
        if (a.d.raw !== b.d.raw) return a.d.raw - b.d.raw;
        return a.idx - b.idx;
      });
    var priorities = ordered.slice(0, 3).map(function (o) {
      var f = FINDINGS[o.d.key];
      return {
        key: o.d.key, label: f.label, score: o.d.score,
        suggest: f.suggest, matters: f.matters, verify: f.verify, action: f.action
      };
    });

    var band = bandFor(overall);

    return {
      raw: raw,
      overall_score: overall,
      band: band.name,
      band_blurb: band.blurb,
      dimensions: dims,
      priority_findings: priorities
    };
  }

  function bandFor(score) {
    for (var i = 0; i < BANDS.length; i++) {
      if (score >= BANDS[i].min && score <= BANDS[i].max) return BANDS[i];
    }
    return BANDS[BANDS.length - 1];
  }

  /* ---------------------------------------------------------
     STATE + PERSISTENCE
     --------------------------------------------------------- */
  function newState() {
    return {
      answers: {}, qual: {}, contact: {}, idx: 0,
      submitted: false, lead_id: null, result: null
    };
  }
  function loadState() {
    try {
      var raw = localStorage.getItem(STATE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return newState();
  }
  function saveState(s) {
    try { localStorage.setItem(STATE_KEY, JSON.stringify(s)); } catch (e) {}
  }

  /* ---------------------------------------------------------
     ATTRIBUTION (UTM + referrer, first-touch)
     --------------------------------------------------------- */
  function captureAttribution() {
    var existing;
    try { existing = JSON.parse(localStorage.getItem(ATTR_KEY) || 'null'); } catch (e) { existing = null; }
    if (existing) return existing;
    var p = new URLSearchParams(location.search);
    var attr = {
      utm_source: p.get('utm_source') || '',
      utm_medium: p.get('utm_medium') || '',
      utm_campaign: p.get('utm_campaign') || '',
      utm_content: p.get('utm_content') || '',
      referrer: document.referrer || ''
    };
    try { localStorage.setItem(ATTR_KEY, JSON.stringify(attr)); } catch (e) {}
    return attr;
  }
  function getAttribution() {
    try { return JSON.parse(localStorage.getItem(ATTR_KEY) || 'null') || captureAttribution(); }
    catch (e) { return captureAttribution(); }
  }

  /* ---------------------------------------------------------
     ANALYTICS — GA4 via gtag + a dataLayer mirror.
     No-ops cleanly when GA4_MEASUREMENT_ID is empty.
     --------------------------------------------------------- */
  window.dataLayer = window.dataLayer || [];
  function track(name, params) {
    params = params || {};
    try { window.dataLayer.push(Object.assign({ event: name }, params)); } catch (e) {}
    if (CONFIG.GA4_MEASUREMENT_ID && typeof window.gtag === 'function') {
      try { window.gtag('event', name, params); } catch (e) {}
    }
  }
  function trackOnce(flagKey, name, params) {
    try {
      if (sessionStorage.getItem(flagKey)) return;
      sessionStorage.setItem(flagKey, '1');
    } catch (e) {}
    track(name, params);
  }

  /* ---------------------------------------------------------
     BACKEND POST (Apps Script). text/plain avoids a CORS
     preflight that Apps Script web apps can't answer.
     --------------------------------------------------------- */
  function postBackend(payload) {
    if (!CONFIG.APPS_SCRIPT_URL) return Promise.reject(new Error('no-backend'));
    return fetch(CONFIG.APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    }).then(function (r) { return r.json(); });
  }

  /* ---------------------------------------------------------
     APP
     --------------------------------------------------------- */
  function initApp(root) {
    captureAttribution();
    var state = loadState();

    // screens = 10 scored + 2 grouped qualification, then gate, then result
    var screens = SCORED.map(function (q) { return { kind: 'scored', q: q }; })
      .concat(QUAL_GROUPS.map(function (g) { return { kind: 'qual', g: g }; }));
    var TOTAL = screens.length;

    trackOnce(SESSION_STARTED, 'bullhorn_check_started', {});

    // If a completed result already exists, jump straight to it (refresh-safe).
    if (state.result && state.submitted) { renderResult(); return; }

    render();

    /* ---- rendering ---- */
    function render() {
      if (state.idx >= TOTAL) { renderGate(); return; }
      var sc = screens[state.idx];
      if (sc.kind === 'scored') renderScored(sc.q);
      else renderQualGroup(sc.g);
    }

    function progressBar(step, total) {
      var pct = Math.round((step / total) * 100);
      return '<div class="blc-progress" role="progressbar" aria-valuemin="0" aria-valuemax="' + total +
        '" aria-valuenow="' + step + '" aria-label="Progress">' +
        '<span style="width:' + pct + '%"></span></div>' +
        '<p class="blc-step">Step ' + step + ' of ' + total + '</p>';
    }

    function shell(step, total, inner) {
      root.innerHTML =
        '<div class="blc-frame">' +
        progressBar(step, total) +
        '<div class="blc-card reveal in">' + inner + '</div>' +
        '</div>';
    }

    function renderScored(q) {
      track('bullhorn_check_question_viewed', { question_number: q.n });
      var current = state.answers[q.id];
      var opts = q.answers.map(function (a) {
        var sel = (current === a.v) ? ' aria-checked="true" data-sel="1"' : ' aria-checked="false"';
        return '<button type="button" class="blc-opt" role="radio"' + sel +
          ' data-val="' + a.v + '">' +
          '<span class="blc-opt-dot" aria-hidden="true"></span>' +
          '<span class="blc-opt-label">' + a.label + '</span></button>';
      }).join('');
      var inner =
        '<p class="blc-qnum">Question ' + q.n + ' of 10</p>' +
        '<h2 class="blc-qtitle">' + q.title + '</h2>' +
        (q.context ? '<p class="blc-qcontext">' + q.context + '</p>' : '') +
        '<div class="blc-opts" role="radiogroup" aria-label="Answer">' + opts + '</div>' +
        navRow(typeof current === 'number');
      shell(state.idx + 1, TOTAL, inner);

      var optEls = root.querySelectorAll('.blc-opt');
      Array.prototype.forEach.call(optEls, function (el) {
        el.addEventListener('click', function () {
          var val = parseInt(el.getAttribute('data-val'), 10);
          state.answers[q.id] = val;
          saveState(state);
          track('bullhorn_check_question_answered', { question_number: q.n, answer_value: val });
          Array.prototype.forEach.call(optEls, function (o) {
            o.setAttribute('aria-checked', 'false'); o.removeAttribute('data-sel');
          });
          el.setAttribute('aria-checked', 'true'); el.setAttribute('data-sel', '1');
          var cont = root.querySelector('.blc-continue');
          if (cont) cont.removeAttribute('disabled');
        });
      });
      wireNav();
    }

    function renderQualGroup(g) {
      var fieldsHtml = g.fields.map(function (q) {
        var current = state.qual[q.id] || '';
        var options = '<option value="" disabled' + (current ? '' : ' selected') + '>Choose one\u2026</option>' +
          q.options.map(function (o) {
            return '<option' + (current === o ? ' selected' : '') + '>' + o + '</option>';
          }).join('');
        return '<div class="blc-field"><label for="blc-' + q.id + '">' + q.label + '</label>' +
          '<select class="blc-input blc-qual-field" id="blc-' + q.id + '" data-qid="' + q.id + '">' + options + '</select></div>';
      }).join('');
      function allAnswered() {
        return g.fields.every(function (q) { return !!state.qual[q.id]; });
      }
      var inner =
        '<p class="blc-qnum">' + g.kicker + '</p>' +
        '<h2 class="blc-qtitle">A few details about your agency (' + g.n + ' of 2)</h2>' +
        '<p class="blc-qcontext">These don\u2019t change your score. They make your findings and follow-up specific to your agency.</p>' +
        '<div class="blc-qual-grid">' + fieldsHtml + '</div>' +
        navRow(allAnswered());
      shell(state.idx + 1, TOTAL, inner);

      var selects = root.querySelectorAll('.blc-qual-field');
      function commit() {
        Array.prototype.forEach.call(selects, function (s) {
          if (s.value) state.qual[s.getAttribute('data-qid')] = s.value;
        });
        saveState(state);
        var cont = root.querySelector('.blc-continue');
        if (cont && allAnswered()) cont.removeAttribute('disabled');
      }
      Array.prototype.forEach.call(selects, function (s) {
        s.addEventListener('change', commit);
      });
      wireNav();
    }

    function navRow(canContinue) {
      var back = state.idx > 0
        ? '<button type="button" class="blc-back">← Back</button>'
        : '<span></span>';
      var contAttr = canContinue ? '' : ' disabled';
      return '<div class="blc-nav">' + back +
        '<button type="button" class="btn blc-continue"' + contAttr + '>Continue</button></div>';
    }

    function wireNav() {
      var back = root.querySelector('.blc-back');
      if (back) back.addEventListener('click', function () {
        if (state.idx > 0) { state.idx--; saveState(state); render(); scrollTop(); }
      });
      var cont = root.querySelector('.blc-continue');
      if (cont) cont.addEventListener('click', function () {
        if (cont.hasAttribute('disabled')) return;
        state.idx++; saveState(state); render(); scrollTop();
      });
    }

    /* ---- contact gate ---- */
    function renderGate() {
      track('bullhorn_check_contact_gate_viewed', {});
      var company = (state.contact.company || '');
      var inner =
        '<p class="blc-qnum">Last step</p>' +
        '<h2 class="blc-qtitle">Your Bullhorn Implementation Profile is ready.</h2>' +
        '<p class="blc-qcontext">Enter your email to see:</p>' +
        '<ul class="blc-gate-list">' +
        '<li>Your 0\u2013100 implementation score</li>' +
        '<li>Your breakdown across five operating areas</li>' +
        '<li>Your three highest-priority findings</li>' +
        '<li>The first practical action for each</li>' +
        '<li>A copy by email you can review or share later</li>' +
        '</ul>' +
        '<p class="blc-proofline">Built by the operator behind a documented 5,821-record Bullhorn cleanup \u2014 2,683 records moved out of limbo and 3,601 candidates organized for re-engagement.</p>' +
        '<form class="blc-gate-form" novalidate>' +
        '<div class="blc-field"><label for="blc-fname">First name</label>' +
        '<input class="blc-input" id="blc-fname" type="text" autocomplete="given-name" value="' +
        (state.contact.first_name || '') + '" required></div>' +
        '<div class="blc-field"><label for="blc-email">Best email to receive your results</label>' +
        '<input class="blc-input" id="blc-email" type="email" autocomplete="email" value="' +
        (state.contact.work_email || '') + '" required></div>' +
        '<div class="blc-field"><label for="blc-company">Company</label>' +
        '<input class="blc-input" id="blc-company" type="text" autocomplete="organization" value="' +
        (company ? company.replace(/"/g, '&quot;') : '') + '"></div>' +
        // honeypot (matches the site's Formspree _gotcha pattern)
        '<input type="text" name="_gotcha" class="blc-hp" tabindex="-1" aria-hidden="true" autocomplete="off">' +
        '<p class="blc-err" hidden></p>' +
        '<div class="blc-nav"><button type="button" class="blc-back">\u2190 Back</button>' +
        '<button type="submit" class="btn blc-submit">Show My Results</button></div>' +
        '<p class="blc-riskline">No sales call required. We never ask for your Bullhorn login or candidate data. Unsubscribe anytime.</p>' +
        '<p class="blc-consent">By continuing you agree to receive your results and related follow-up by email. ' +
        'See our <a href="privacy.html" target="_blank" rel="noopener">privacy note</a>.</p>' +
        '</form>';
      shell(TOTAL, TOTAL, inner);

      root.querySelector('.blc-back').addEventListener('click', function () {
        state.idx = TOTAL - 1; saveState(state); render(); scrollTop();
      });
      root.querySelector('.blc-gate-form').addEventListener('submit', function (ev) {
        ev.preventDefault();
        submitGate();
      });
    }

    function submitGate() {
      var fname = root.querySelector('#blc-fname').value.trim();
      var email = root.querySelector('#blc-email').value.trim();
      var company = root.querySelector('#blc-company').value.trim();
      var hp = root.querySelector('.blc-hp').value;
      var err = root.querySelector('.blc-err');

      function fail(msg) { err.textContent = msg; err.hidden = false; }

      if (hp) { return; } // bot
      if (!fname) return fail('Please add your first name.');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail('Please enter a valid email address.');

      state.contact = { first_name: fname, work_email: email, company: company };
      var result = computeResult(state.answers);
      state.result = result;
      state.submitted = true;
      var attr = getAttribution();
      state.lead_id = state.lead_id || genId();
      saveState(state);

      var lowest = result.priority_findings.length ? result.priority_findings[0].key : '';
      track('bullhorn_check_contact_submitted', {
        score_band: result.band, overall_score: result.overall_score,
        lowest_dimension: lowest, bullhorn_user_count: state.qual.bullhorn_user_count || '',
        staffing_model: state.qual.staffing_model || '', source: attr.utm_source || 'direct'
      });
      track('bullhorn_check_completed', { overall_score: result.overall_score, score_band: result.band });

      var payload = {
        action: 'lead',
        lead_id: state.lead_id,
        first_name: fname, work_email: email, company: company,
        employee_count: state.qual.employee_count || '',
        bullhorn_user_count: state.qual.bullhorn_user_count || '',
        staffing_model: state.qual.staffing_model || '',
        years_on_bullhorn: state.qual.years_on_bullhorn || '',
        formal_implementation_completed: state.qual.formal_implementation_completed || '',
        primary_frustration: state.qual.primary_frustration || '',
        assessment_answers_json: JSON.stringify(state.answers),
        overall_score: result.overall_score,
        status_architecture_score: dimScore(result, 'status_architecture'),
        candidate_visibility_score: dimScore(result, 'candidate_visibility'),
        crm_reporting_score: dimScore(result, 'crm_reporting'),
        operating_discipline_score: dimScore(result, 'operating_discipline'),
        sustainability_score: dimScore(result, 'sustainability'),
        priority_findings_json: JSON.stringify(result.priority_findings.map(function (p) {
          return { key: p.key, score: p.score };
        })),
        band: result.band,
        utm_source: attr.utm_source, utm_medium: attr.utm_medium,
        utm_campaign: attr.utm_campaign, utm_content: attr.utm_content,
        referrer: attr.referrer,
        consent_timestamp: new Date().toISOString(),
        _gotcha: ''
      };

      // Fire-and-forget: show results immediately regardless of network.
      postBackend(payload).then(function (res) {
        if (res && res.lead_id) { state.lead_id = res.lead_id; saveState(state); }
      })['catch'](function () {
        state._emailFailed = true; saveState(state);
        var note = document.querySelector('.blc-email-note');
        if (note) {
          note.textContent = 'Your results are below. We couldn’t email a copy right now — you can screenshot or print this page.';
          note.hidden = false;
        }
      });

      renderResult();
    }

    function dimScore(result, key) {
      var found = null;
      result.dimensions.forEach(function (d) { if (d.key === key) found = d.score; });
      return found;
    }

    /* ---- result ---- */
    function renderResult() {
      var r = state.result || computeResult(state.answers);
      var attr = getAttribution();
      var high = r.overall_score >= 70;

      var dimRows = r.dimensions.map(function (d) {
        return '<div class="blc-dim">' +
          '<div class="blc-dim-top"><span>' + d.label + '</span><span class="blc-dim-score">' + d.score + '</span></div>' +
          '<div class="blc-dim-bar"><span style="width:' + d.score + '%"></span></div>' +
          '</div>';
      }).join('');

      var findingCards = r.priority_findings.map(function (p, i) {
        return '<div class="blc-finding">' +
          '<div class="blc-finding-head"><span class="blc-finding-idx">' + (i + 1) + '</span>' +
          '<h4>' + p.label + '</h4><span class="blc-finding-score">' + p.score + '/100</span></div>' +
          '<dl class="blc-finding-body">' +
          '<dt>What your answers suggest</dt><dd>' + p.suggest + '</dd>' +
          '<dt>Why it matters in Bullhorn</dt><dd>' + p.matters + '</dd>' +
          '<dt>What to verify first</dt><dd>' + p.verify + '</dd>' +
          '<dt>Practical first action</dt><dd>' + p.action + '</dd>' +
          '</dl></div>';
      }).join('');

      var reviewLabel = high ? 'Review the Remaining Gaps' : 'Find Out What Was Never Finished';
      var reviewUrl = buildCalendlyUrl(attr);

      var calcBlock = CONFIG.CALCULATOR_ENABLED
        ? '<a class="btn btn-ghost blc-calc-link" href="bullhorn-cost-calculator.html">Estimate the Cost of the Workarounds →</a>'
        : '<button type="button" class="btn btn-ghost blc-calc-soon">Estimate the Cost of the Workarounds →</button>' +
          '<p class="blc-calc-note" hidden>The cost calculator is the next step — it’s being finalized. Your emailed results will include a link the moment it’s live.</p>';

      root.innerHTML =
        '<div class="blc-report">' +
        '<p class="blc-email-note" hidden></p>' +
        '<header class="blc-report-hero">' +
        '<p class="kicker">Your Bullhorn Implementation Profile</p>' +
        '<div class="blc-score-wrap">' +
        '<div class="blc-score-ring" style="--pct:' + r.overall_score + '">' +
        '<div class="blc-score-num">' + r.overall_score + '<span>/100</span></div></div>' +
        '<div class="blc-score-band"><h2>' + r.band + '</h2><p>' + r.band_blurb + '</p>' +
        '<p class="blc-selfnote">This is a self-assessment based on your answers, not a formal technical audit.</p></div>' +
        '</div></header>' +

        '<section class="blc-report-sec"><h3>How each area scored</h3>' +
        '<div class="blc-dims">' + dimRows + '</div></section>' +

        '<section class="blc-report-sec"><h3>Your three priority findings</h3>' +
        '<p class="blc-sec-lede">These are the lowest-scoring areas from your answers — the places the implementation is most likely unfinished.</p>' +
        '<div class="blc-findings">' + findingCards + '</div></section>' +

        '<section class="blc-report-cta">' +
        '<h3>Book a Free Bullhorn Results Review</h3>' +
        '<p>We’ll review your lowest-scoring area, identify what is most likely happening inside the system, and decide whether it is worth investigating further. No database access is required for the call.</p>' +
        '<div class="btn-row blc-cta-row">' +
        '<a class="btn btn-lg blc-review" href="' + reviewUrl + '" target="_blank" rel="noopener">' + reviewLabel + '</a>' +
        calcBlock +
        '</div></section>' +
        '</div>';

      track('bullhorn_check_result_viewed', {
        overall_score: r.overall_score, score_band: r.band,
        lowest_dimension: r.priority_findings.length ? r.priority_findings[0].key : ''
      });

      if (state._emailFailed) {
        var note = root.querySelector('.blc-email-note');
        if (note) {
          note.textContent = 'Your results are below. We couldn’t email a copy right now — you can screenshot or print this page.';
          note.hidden = false;
        }
      }

      var review = root.querySelector('.blc-review');
      if (review) review.addEventListener('click', function () {
        track('results_review_clicked', { score_band: r.band });
        track('booking_started', {});
        if (CONFIG.APPS_SCRIPT_URL && state.lead_id) {
          postBackend({ action: 'event', type: 'results_review_clicked', lead_id: state.lead_id })['catch'](function () {});
        }
      });

      var soon = root.querySelector('.blc-calc-soon');
      if (soon) soon.addEventListener('click', function () {
        track('cost_calculator_started', {});
        var n = root.querySelector('.blc-calc-note'); if (n) n.hidden = false;
      });
      var calcLink = root.querySelector('.blc-calc-link');
      if (calcLink) calcLink.addEventListener('click', function () { track('cost_calculator_started', {}); });

      scrollTop();
    }

    function buildCalendlyUrl(attr) {
      var base = CONFIG.CALENDLY_RESULTS_REVIEW_URL;
      var params = [];
      if (state.contact.first_name) params.push('name=' + encodeURIComponent(state.contact.first_name));
      if (state.contact.work_email) params.push('email=' + encodeURIComponent(state.contact.work_email));
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'].forEach(function (k) {
        if (attr[k]) params.push(k + '=' + encodeURIComponent(attr[k]));
      });
      if (!params.length) return base;
      return base + (base.indexOf('?') > -1 ? '&' : '?') + params.join('&');
    }

    function scrollTop() { window.scrollTo({ top: 0, behavior: 'auto' }); }
  }

  function genId() {
    return 'blc_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
  }

  /* ---------------------------------------------------------
     BOOTSTRAP — landing page vs app page
     --------------------------------------------------------- */
  function loadGA4() {
    var id = CONFIG.GA4_MEASUREMENT_ID;
    if (!id || window.gtag) return;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    document.head.appendChild(s);
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', id, { anonymize_ip: true });
  }

  function boot() {
    loadGA4();
    captureAttribution();
    var landing = document.querySelector('[data-blc-landing]');
    if (landing) {
      track('bullhorn_check_viewed', {});
      var starters = document.querySelectorAll('[data-blc-start]');
      Array.prototype.forEach.call(starters, function (el) {
        el.addEventListener('click', function () {
          track('bullhorn_check_started', { source: 'landing' });
          try { sessionStorage.setItem(SESSION_STARTED, '1'); } catch (e) {}
        });
      });
    }
    var appRoot = document.getElementById('blc-app');
    if (appRoot) initApp(appRoot);
  }

  // Expose scoring for tests / other phases.
  window.SourceLayerBLC = {
    computeResult: computeResult, bandFor: bandFor,
    SCORED: SCORED, DIMENSIONS: DIMENSIONS, BANDS: BANDS, CONFIG: CONFIG
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else { boot(); }
})();
