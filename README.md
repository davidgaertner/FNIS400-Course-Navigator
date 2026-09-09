# FNIS 400 Practicum Course Navigator

A dependency-free, date-aware and project-state-aware guide for the 2026–27 FNIS 400 Community Research Practicum.

The calendar answers where the course is now. Optional local project-status settings help the Navigator identify what work matters, what comes next, and what conditions affect whether work can proceed. Calendar dates never mark substantive project work complete.

The compact current view is organized as Where You Are, Your Project Right Now, Do Now, Coming Next, and a conditional Before You Proceed notice. The three-item Coming Next list is the single short lookahead; the complete calendar remains available in Full Course Timeline.

Canvas remains the authoritative source for instructions and materials. The Navigator has no accounts, analytics, cookies, API calls, or runtime dependencies. Project settings stay in the current browser's `localStorage` and are not an official course record.

## Launch locally

Opening `index.html` directly works in a modern browser. For the most reliable Canvas-like test, open a terminal in this folder and run:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

Instructor preview examples:

```text
http://localhost:8000/?preview=1
http://localhost:8000/?preview=1&date=2026-10-26
http://localhost:8000/?preview=1&date=2026-10-26&pathway=behavioural&scope=partner-checked&proposal=drafting&ethics=developing&board=active
http://localhost:8000/?preview=1&date=2026-11-30&pathway=behavioural&ethics=provisos
```

Preview mode adds a date picker, Today button, and key-date menu. It also accepts `pathway`, `scope`, `proposal`, `ethics`, and `board` query parameters for testing project-state combinations.

## Run checks

No packages need to be installed:

```bash
node tests/test-data.js
node --check js/course-data.js
node --check js/app.js
```

## Maintain course data

All course, project-state, and routing data lives in `js/course-data.js`:

- `COURSE_CONFIG`: timezone, storage keys, update date, provisional-status label, and Term 2 notice.
- `COURSE_STAGES`: broad calendar orientation. These ranges must not be used as evidence that project work is complete.
- `COURSE_EVENTS`: seminars, tutorials, deadlines, milestones, Project Gates, Partnership Actions, Support / Consultation, No Class dates, and finite or open-ended windows.
- `WEEKLY_DESTINATIONS`: the “By the end of this week...” statements.
- `JOURNEY_STAGES`: the course architecture shown in the practicum journey.
- `PROJECT_STATE_DEFINITIONS`: the allowed local Scope, Proposal, Ethics / Readiness, and Project Board states.
- `ETHICS_STATUS_PRESENTATION`: pathway-sensitive labels and allowed Ethics / Readiness choices for the stable stored state IDs.
- `PROJECT_PATHWAYS`: the five selector choices grouped into three conceptual pathways.
- `COURSE_RESOURCES`: the canonical Canvas registry. Every resource has one stable ID, label, type, and URL.
- `COURSE_RESOURCE_CONTEXTS`: stage, date, priority, and pathway routing that references resource IDs only.

Use `YYYY-MM-DD` calendar-date strings. Do not convert course dates to timestamps.

The November 13 gate has `provisional: true`. Once committee confirmation is received, change that one field to `false`; the pending-confirmation label will disappear everywhere automatically.

## Add or change a Canvas destination

Find the stable ID in `COURSE_RESOURCES` and update that one canonical entry. For example:

```js
proposalTemplate: {
  label: "Project Proposal Template",
  url: "https://canvas.ubc.ca/courses/194371/files/47490356?module_item_id=9533606",
  type: "file"
}
```

Resource types may be `page`, `assignment`, `file`, `module`, `template`, or `external`. A valid HTTP(S) URL automatically becomes an accessible link that opens in a new tab. If a future resource is added with a blank or invalid URL, it remains a quiet non-link labelled “Canvas link to be added.” Never add resource URLs to `app.js` or duplicate one destination under conceptual labels.

## Project status and privacy

The four optional selectors store only fixed status IDs. Students should never enter research data, participant information, partner-confidential information, or other sensitive information. Clearing site data resets the local settings.

Passing a scheduled date does not change any selected project status. Open-ended actions remain active only while their associated local state keeps them relevant.

The stored Ethics / Project Readiness values stay intentionally compact. Their selector and project-summary labels are translated by the confirmed route: Behavioural Research uses formal-submission and approval language where supported, Program Evaluation and No Formal Review use course-level Project-Readiness language, and Archival Research uses cautious review, permission, and readiness language without assuming a universal formal-review endpoint. Irrelevant options are omitted. When a pathway change makes a route-specific advanced state unsafe to reinterpret, only the Ethics / Readiness state returns to the neutral Developing state; unrelated project settings remain unchanged.

## Logo and visual system

The header uses `assets/fnis-logo.png`. When it loads, only the real artwork is shown; if it fails, the typographic FNIS fallback appears. The logo is not cropped or recoloured.

Visual tokens are at the top of `css/styles.css`, including the muted semantic event tokens used consistently in DO NOW, Coming Next, and the Full Course Timeline. The Full Course Timeline uses a native disclosure control; the entire summary row opens and closes with pointer, Enter, or Space input, and `aria-expanded` remains synchronized.

## Project structure

```text
index.html              Semantic page structure
css/styles.css          FNIS visual system, responsive and print styles
js/course-data.js       Central course, event, state, pathway, and resource data
js/app.js               Rendering, persistence, preview, and disclosure behavior
assets/fnis-logo.png    FNIS header artwork
tests/test-data.js      Dependency-free regression suite
README.md               Launch and maintenance guide
BUILD_REPORT.md         Build and verification record
```

## Future deployment

The project is ready for a static HTTPS host such as GitHub Pages and can then be linked or embedded from Canvas where security settings permit. No build step, backend, credentials, or deployment-specific code is required. This build has not been deployed or pushed.
