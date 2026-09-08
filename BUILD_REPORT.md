# FNIS 400 Practicum Course Navigator — Build Report

## FNIS identity revision

- Rebranded the student-facing product as **FNIS 400 Practicum Course Navigator**.
- Replaced the CIS-led header and footer identity with First Nations and Indigenous Studies.
- Added the single-slot `assets/fnis-logo.png` loader with a mutually exclusive typographic FNIS fallback.
- Replaced the former turquoise/charcoal palette with FNIS red `#A5273C`, deep teal `#1A3C40`, dark wine `#3C1820`, white, and cool neutral working surfaces.
- Applied FNIS red to rules, current-position indicators, links, selected states, and textual gate markers; retained deep teal for the header, footer, stage card, and structural anchors.
- Preserved all dates, pathway logic, Canvas URLs, stage architecture, preview behavior, layout, and accessibility behavior.
- Modified `index.html`, `css/styles.css`, `js/app.js`, the branding title in `js/course-data.js`, `tests/test-data.js`, `README.md`, `assets/README.md`, and this report.
- Installed the supplied 250 × 250 PNG artwork at `assets/fnis-logo.png`; the typographic FNIS fallback now appears only if that image cannot load.
- Added an explicit artwork revision to the header source so a browser that previously cached the missing-image state fetches the supplied mark after refresh.

## November date and gate correction

- Corrected the shared date formatter so same-month ranges render naturally; Midterm Break now displays exactly `November 9–11, 2026`.
- Preserved single-date, noon, explicit-time, and cross-month date formatting.
- Replaced the pathway-renamed November 13 entry with one stable course event: **Final Ethics / Project-Readiness Gate**.
- Kept pathway-specific endpoints in centralized `pathwayDetails` data and the dynamic Next Gate / Project Condition areas instead of changing the course-wide timeline.
- Kept an unconfirmed pathway as a blocking dependency without presenting it as a different November 13 event.
- Added a script asset revision so the corrected logic is loaded after refreshing an earlier local view.

## Confirmed Canvas resource integration

- Added or corrected 24 authoritative Canvas destinations, bringing the canonical registry to 36 confirmed, unique URLs.
- Updated nine existing placeholder records in place and added fifteen new stable resource IDs; no duplicate record was created for an existing course function.
- Consolidated “This Year’s Partners & Projects” into the confirmed **How to Read the Partner Project Proposals** destination.
- Preserved all twelve previously confirmed Placement and scoping destinations unchanged.
- Kept Behavioural Research Data Collection on `/pages/data-collection` and Program Evaluation Data Collection on the intentionally distinct `/pages/data-collection-2` route.
- Added route-specific Quality Control/readiness resources so Behavioural receives Formal Ethics Submission, Program Evaluation and No Formal Review receive readiness destinations, Archival receives shared plus archival guidance, and Not yet confirmed receives common resources only.
- Added **Welcome to FNIS 400** as the primary course-overview resource and retained Canvas Home as a lower-priority general destination.
- All URLs remain in `COURSE_RESOURCES`; rendering and date/pathway mappings reference only stable resource IDs.

## Cool-neutral surface revision

- Replaced the warm cream page background with `#F5F7F7`.
- Kept primary panels white and retained cool neutral working surfaces.
- Replaced the remaining warm unavailable-resource fill with a cool neutral while preserving its non-interactive treatment.
- Left typography, layout, course logic, cards, pathway behavior, and information hierarchy unchanged.

## Authoritative course-architecture revision

The existing static Navigator was revised in place for the new 2026–27 architecture. Its typography, first-screen composition, preview bar, journey interaction, resources/upcoming layout, timeline, and footer remain recognizable.

The revised application now:

- represents the practicum through 18 precise underlying stages, with separate primary date ranges and overlapping responsibility ranges;
- uses all authoritative Term 1 module start dates;
- restores the complete Placement sequence, including professional materials and reciprocal interviews;
- reflects the revised partnership, methods/scoping, Proposal, ethics/readiness, Quality Control, and Research Foundation architecture;
- moves the final signed Project Proposal to November 4 EOD and preserves its required clearance/signature sequence;
- removes the outdated October Proposal-completion state and second ethics checkpoint;
- adds the October Case Conferences, office hours, Development Day, November package assembly, Quality Control, and X̱wi7x̱wa preparation dates;
- provides a compact “My confirmed project pathway” selector from October 14 onward;
- defaults that selector to Not yet confirmed, stores only its ID in local browser storage, and continues safely if storage is unavailable;
- branches guidance, resources, project condition, holds, and the November 13 gate for Behavioural Research, Archival Research, Program Evaluation, No Formal Review, and Not yet confirmed;
- distinguishes the three conceptual ethics pathways from the four student-facing Canvas route choices;
- states that formal submission is not approval and that project-readiness confirmation is not formal ethics approval;
- shows restrained blocked/dependent work without punitive language or colour;
- treats Research Foundation as one 15% project-specific knowledge-base assignment with two scheduling groups;
- retains the established Term 1 Project Pulses and all known Term 2 Pulse dates as ungraded early-warning activities;
- preserves only established Term 2 milestones and Project Pulses and displays the publication-boundary notice instead of inventing weekly seminars;
- preserves the six assessed components at 15 + 15 + 20 + 10 + 30 + 10 = 100%;
- keeps 36 confirmed Canvas destinations in one canonical resource registry and leaves unresolved route-specific placeholders blank rather than inventing URLs;
- shows common plus selected-route resources after pathway selection and de-duplicates cross-stage resources;
- preserves the working/pending November 13 formal-submission date, March Musqueam TBC item, and unconfirmed office-hours links.

## Project structure

```text
index.html
css/styles.css
js/course-data.js
js/app.js
assets/fnis-logo.png
assets/README.md
tests/test-data.js
README.md
BUILD_REPORT.md
```

## Verification completed

On September 7, 2026:

```text
node tests/test-data.js
44 tests passed

node --check js/course-data.js
passed

node --check js/app.js
passed

node --check tests/test-data.js
passed
```

The automated suite verifies:

- authoritative module starts, revised events, ranges, source ordering, and unique IDs;
- contiguous primary stages plus intended overlaps and full September 9–April 12 coverage;
- the 18-stage journey order and non-final “earlier calendar stage” language;
- the full Placement, scoping, Proposal, ethics/readiness, Quality Control, Foundation, and established Term 2 sequences;
- the stable November 13 course gate plus all five route-specific detail branches with no cross-route leakage;
- natural same-month and cross-month ranges, unchanged single dates, and retained time formatting;
- local pathway defaults, persistence, query-driven preview, and storage-failure fallback;
- assessment total and exclusion of checkpoints, conversations, Pulses, and readiness gates as separate assessments;
- all 36 confirmed Canvas URLs, date-aware resource emphasis, route-specific resources, link/placeholder states, URL uniqueness, and duplicate suppression;
- the distinct Behavioural and Program Evaluation Data Collection URLs and pathway-specific Quality Control/readiness routing;
- every requested preview date and all critical rendered sections;
- Vancouver calendar-day logic at UTC boundaries;
- HTML IDs, ARIA references, local asset paths, disclosure state, and logo/fallback exclusivity;
- absence of obsolete claims, invented Term 2 activities, runtime network calls, and external dependencies.

Rendered browser checks were also completed against the local static server:

- all required preview dates produced a current stage, next activity, next gate/dependency, positioning lists, project condition/dependencies, journey, resources, upcoming dates, and populated full timeline;
- November 12 and 13 were rendered under all five selector choices; every timeline retained the shared gate while route-specific status, context, and dependencies changed correctly;
- the visible timeline rows read `November 9–11, 2026 · Midterm Break` and `November 13, 2026 · Final Ethics / Project-Readiness Gate`;
- 33 date/pathway resource views were checked across all 13 requested dates, including every pathway from October 19 through November 13; none was blank, exceeded five resources, leaked another route, exposed a raw URL, or used an invalid link state;
- the Full Course Timeline opened from its entire summary row, changed to “Hide dates −”, and updated `aria-expanded="true"`;
- the supplied FNIS logo loads in the single header slot, removes the fallback entirely, and retains a clean fallback-only state if the file cannot load;
- browser console warnings/errors: none;
- widths checked: 320, 375, 768, 1024, and 1440px; no page-level horizontal overflow remained.
- the longer FNIS title remained legible, with header heights of approximately 130px at 320px, 113px at 375px, and 93–101px at wider checks;
- contrast checks passed for white/deep teal (11.90:1), white/FNIS red (7.11:1), white/dark wine (15.63:1), body text/white (13.21:1), muted text/white (6.02:1), and FNIS red/page background (6.61:1).

## Accessibility checks

- All controls are native buttons, selects, links, or disclosure elements with visible focus treatment.
- The pathway selector has a persistent label and explanatory help text; dynamic project-condition/date announcements use live regions.
- Working resources are links with underline, border, new-tab wording, accessible names, and `noopener noreferrer`; missing resources are non-link elements.
- Journey states and gates use explicit text as well as visual treatment.
- The logo has useful alternative text, and load/failure states never display the real mark and fallback together.
- Mobile controls retain comfortable touch heights; the 320px layout stacks without page-level horizontal scrolling.
- The visually hidden key-date label remains one pixel wide and no longer creates mobile overflow.
- `prefers-reduced-motion` remains respected.

## Issues found and fixed

- Replaced the obsolete single ethics deadline with pathway-resolved November 13 data.
- Fixed the date-range formatter that produced `November 9, 2026–11` for same-month ranges.
- Removed pathway-specific title replacement from the November 13 course event; pathway confirmation is now represented only as a prerequisite/dependency.
- Replaced mutually exclusive sequential stage assumptions with precise primary stages plus overlapping active responsibilities.
- Corrected Placement resources so Targeted Interviews is available during September 17–23 preparation.
- Removed duplicate resource cards that could occur when one canonical resource crossed adjacent stage mappings.
- Updated nine existing resource records instead of creating duplicate entries for newly confirmed destinations.
- Kept each Program Evaluation and No Formal Review branch resource visible at the November Quality Control/readiness gate.
- Added the missing September 25 preview shortcut used by the rendered regression suite.
- Fixed a mobile selector rule that widened a visually hidden label and caused 9–13px of horizontal overflow at 320px and 375px.

## Intentionally unresolved items

- The remaining Canvas destinations listed below remain blank and visibly labelled “Canvas link to be added.” No URL was invented.
- The November 13 Behavioural Formal Ethics Submission remains a working date pending final committee confirmation.
- The Musqueam Presentation / Gathering remains in March with exact date TBC.
- Sarah Flann office-hours Zoom links remain TBC.
- The detailed Term 2 weekly schedule remains unpublished; only established milestones and Pulses are shown.
- The static Navigator cannot know actual project status, approvals, permissions, partner actions, or readiness outcomes; its language distinguishes calendar expectation from project condition.

## REMAINING UNRESOLVED CANVAS LINKS

Every item below has the current state **Canvas link to be added** because no authoritative destination was supplied. They remain non-clickable.

| Resource title | Stage / pathway | Current state | Why unresolved |
|---|---|---|---|
| Common Research Methods | Scoping · all pathways | Canvas link to be added | No authoritative URL supplied |
| Bullseye / Core Commitment | Scoping · all pathways | Canvas link to be added | No authoritative URL supplied |
| Scope Snapshot | Scoping · all pathways | Canvas link to be added | No authoritative URL supplied |
| Partner Scope Check | Scoping · all pathways | Canvas link to be added | No authoritative URL supplied |
| Project Board | Partnership, Scoping, Development, Milestone, Partner Review · all pathways | Canvas link to be added | No authoritative URL supplied |
| Project Proposal Assignment | Proposal, Quality Control · all pathways | Canvas link to be added | No authoritative URL supplied |
| Project Proposal Template | Proposal · all pathways | Canvas link to be added | No authoritative URL supplied |
| Proposal Checklist | Proposal · all pathways | Canvas link to be added | No authoritative URL supplied |
| Completed Proposal Examples | Proposal · all pathways | Canvas link to be added | No authoritative URL supplied |
| Proposal Clearance & Signature Routing | Proposal · all pathways | Canvas link to be added | No authoritative URL supplied |
| Research Ethics | Research Ethics, Ethics Pathway · all pathways | Canvas link to be added | No authoritative URL supplied |
| Confirmed Ethics Pathway Guide | Research Ethics, Ethics Pathway · all pathways | Canvas link to be added | No authoritative URL supplied |
| Ethics Development & Project Readiness | Ethics Development, Quality Control · all pathways | Canvas link to be added | No authoritative URL supplied |
| Project-Readiness Record | Ethics Development, Quality Control · Program Evaluation / No Formal Review | Canvas link to be added | No authoritative URL supplied |
| Consent Guidance | Ethics Development · Behavioural Research | Canvas link to be added | No authoritative URL supplied |
| Recruitment Guidance | Ethics Development · Behavioural Research | Canvas link to be added | No authoritative URL supplied |
| Research Instrument Guidance | Ethics Development · Behavioural Research | Canvas link to be added | No authoritative URL supplied |
| Risk & Vulnerability Guide | Ethics Development · Behavioural Research | Canvas link to be added | No authoritative URL supplied |
| Archival Access, Permissions & Authority | Ethics Development · Archival Research | Canvas link to be added | No authoritative URL supplied |
| Participation & Informed Agreement Guidance | Ethics Development · Program Evaluation | Canvas link to be added | No authoritative URL supplied |
| Information-Use & Permissions Guidance | Ethics Development · Program Evaluation / No Formal Review | Canvas link to be added | No authoritative URL supplied |
| Project Folder & Information Handling | Research Ethics, Ethics Development, Quality Control · all pathways | Canvas link to be added | No authoritative URL supplied |
| Research Foundation Assignment | Research Foundation · all pathways | Canvas link to be added | No authoritative URL supplied |
| Research Foundation Example | Research Foundation · all pathways | Canvas link to be added | No authoritative URL supplied |
| Research Support Directory | Research Foundation · all pathways | Canvas link to be added | No authoritative URL supplied |
| X̱wi7x̱wa Search Preparation | Research Foundation · all pathways | Canvas link to be added | No authoritative URL supplied |
| X̱wi7x̱wa Resources | Research Foundation · all pathways | Canvas link to be added | No authoritative URL supplied |
| Deliverable Milestone Assignment | Milestone · all pathways | Canvas link to be added | No authoritative URL supplied |
| Milestone Guidance | Milestone · all pathways | Canvas link to be added | No authoritative URL supplied |
| Deliverable Design Guide | Development · all pathways | Canvas link to be added | No authoritative URL supplied |
| Prototypes, Feedback & Iteration | Development · all pathways | Canvas link to be added | No authoritative URL supplied |
| Feedback Cadence & Working Rhythm | Development · all pathways | Canvas link to be added | No authoritative URL supplied |
| Decisions, Changes & Closing the Loop | Development, Milestone, Partner Review · all pathways | Canvas link to be added | No authoritative URL supplied |
| Handover Guidance | Development, Partner Review, Closeout · all pathways | Canvas link to be added | No authoritative URL supplied |
| Project Closeout Checklist | Closeout · all pathways | Canvas link to be added | No authoritative URL supplied |
| Partner-Review Draft Instructions | Partner Review · all pathways | Canvas link to be added | No authoritative URL supplied |
| Community Research Presentation Guidance | Partner Review · all pathways | Canvas link to be added | No authoritative URL supplied |
| Presentation Rubric | Closeout · all pathways | Canvas link to be added | No authoritative URL supplied |
| Community Research Deliverable(s) | Closeout · all pathways | Canvas link to be added | No authoritative URL supplied |
| Community Research Presentation | Closeout · all pathways | Canvas link to be added | No authoritative URL supplied |

## Launch tomorrow morning

From `/Users/davidgaertner/Desktop/FNIS400-Course-Navigator` run:

```bash
python3 -m http.server 8000
```

Then open:

```text
Student view
http://localhost:8000/

Instructor preview
http://localhost:8000/?preview=1
```

Opening `index.html` directly also works in a modern browser.

## Recommended preview URLs

```text
Placement / professional materials
http://localhost:8000/?preview=1&date=2026-09-21

Research Ethics / pathway selector
http://localhost:8000/?preview=1&date=2026-10-19

Ethics development, Behavioural route
http://localhost:8000/?preview=1&date=2026-10-26&pathway=behavioural

November formal-submission branch
http://localhost:8000/?preview=1&date=2026-11-13&pathway=behavioural

November readiness branch
http://localhost:8000/?preview=1&date=2026-11-13&pathway=program-evaluation

Research Foundation
http://localhost:8000/?preview=1&date=2027-01-18

Milestone
http://localhost:8000/?preview=1&date=2027-02-01

Partner review
http://localhost:8000/?preview=1&date=2027-03-08

Final handoff
http://localhost:8000/?preview=1&date=2027-03-25
```

## Where to add Canvas URLs

Open `js/course-data.js`, find the resource’s stable key in `COURSE_RESOURCES`, and replace `url: ""` with the authoritative Canvas URL. The UI will automatically convert that item to a working link in a new tab. Edit `COURSE_RESOURCE_CONTEXTS` only when its stage, date, priority, or pathway mapping also needs to change; rendering code should not contain resource URLs.
