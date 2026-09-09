# FNIS 400 Practicum Course Navigator: Build Report

## What changed in this revision

The existing FNIS-branded static Navigator was revised in place. Its colour palette, typography, compact hero, preview bar, card language, journey interaction, resource/upcoming layout, timeline disclosure, and footer were retained.

The application is now project-state-driven as well as date-aware:

```text
course date + local project status + confirmed pathway + active conditions
→ current guidance
```

The primary view now answers:

1. **Where you are:** the broad calendar-based course stage.
2. **Your project right now:** only meaningful active workstreams and locally selected states.
3. **Do now:** up to three prioritized actions.
4. **Coming next:** the next three dated course activities.
5. **Before you proceed:** shown only when a real boundary, permission, approval, readiness condition, or dependency applies.

It also includes a weekly destination, explicit Canvas-authority statement, optional Project Status controls, focused Canvas resources, a course-architecture journey, and a secondary full timeline.

## Focused simplification and ethics semantics pass

The residual hero-side “Next significant date” and “Next project gate / dependency” panels were removed. The lower seven-item “Upcoming dates” list was also removed because it substantially repeated the three-item Coming Next list. Consequential gates remain visible through DO NOW, Coming Next, Before You Proceed, the journey, and the full timeline as applicable. The resulting hierarchy is:

1. Where You Are
2. Your Project Right Now
3. Do Now
4. Coming Next
5. Before You Proceed, when applicable
6. Project Status
7. Useful Right Now
8. Full Practicum Journey
9. Full Course Timeline

The course-stage note now states that the course stage reflects the calendar and project status is tracked separately. “Your project this week” is now “Right now in your Practicum.” The Project Status introduction now uses the student-facing “Saved locally” label and explains that students update the controls when their project reaches a new state.

The pathway selector no longer groups Behavioural and Archival Research under a formal-pathway label. Behavioural Research and Archival Research are independent top-level options. Only Program Evaluation and No Formal Review are grouped under “Research that does not require formal review.” Stored route IDs and local persistence are unchanged.

The compact stored Ethics / Project Readiness values are unchanged, but their displayed project-summary labels are now route-sensitive. Examples include:

- Behavioural `submitted-determined`: Formal ethics submission made
- Behavioural `ready`: Formal approval received
- Program Evaluation or No Formal Review `submitted-determined`: Project-Readiness determination made
- Program Evaluation or No Formal Review `ready-conditions`: Ready with Conditions
- Archival states: neutral applicable-review, permission, and readiness language without a fabricated universal formal-review outcome

Instructor preview now labels October 19 as “Project Board” and includes October 21 as “Ethics Pathways.” October 26 is labelled “Ethics development.”

## Final semantic and logic audit

The Ethics / Project Readiness selector itself is now pathway-sensitive as well as the project summary. Stable internal state IDs remain unchanged, while `ETHICS_STATUS_PRESENTATION` centrally defines each route's visible labels and allowed choices:

- Behavioural shows ethics-material, formal-submission, proviso, and formal-approval language. It does not offer Ready with Conditions.
- Program Evaluation and No Formal Review show Project-Readiness materials, determination, Ready with Conditions, and Ready to Proceed. They do not offer Provisos.
- Archival uses neutral ethics, permission, applicable-review, and readiness language without claiming a universal formal submission, approval, or Project-Readiness determination.

When the pathway changes, route-specific advanced states such as submitted, provisos, conditional readiness, or ready return to Developing if carrying them into the new route would change their meaning. Scope, Proposal, and Board values are preserved. The pathway selector and its existing stored route IDs remain unchanged.

Before You Proceed now precedes the weekly destination in source, keyboard, and mobile reading order. Its visual treatment remains a restrained project boundary rather than an error state.

The January 30 “Milestone preparation” shortcut was removed. The date appeared only in the old preview menu; there is no January 30 event or supporting authoritative datum in `COURSE_EVENTS`, tests, or the revised schedule. The confirmed February 1 Deliverable Milestone and all other stable high-level Term 2 assessments remain unchanged.

The page metadata description is now: “A guide to where you are, what to do next, and what conditions affect your progress in the FNIS 400 community research practicum.”

The logic audit also corrected two state-aware DO NOW cases: satisfied November gates no longer reappear as project actions, and the Provisos module opening is conditional on the Provisos state. NO CLASS entries remain visible in the course calendar but cannot become DO NOW actions.

## Pre-publish pathway/status normalization

`normalizeEthicsStateForPathway()` now enforces one conservative invariant wherever pathway/state pairs enter the application:

- An unconfirmed pathway always carries `pathway-not-confirmed`.
- A confirmed pathway cannot carry `pathway-not-confirmed`; it becomes `developing`.
- A status that is invalid for the selected confirmed route becomes `developing`.
- A valid compatible status is preserved.

The same helper is used through `normalizeProjectStateForPathway()` for loaded localStorage, Instructor Preview URL overrides, project-status changes, summaries, boundary guidance, active windows, and dated lookahead logic. `transitionProjectStateForPathway()` retains the more conservative route-switch rule: submitted/determined, proviso, conditional-readiness, and ready outcomes return to Developing when moving between different confirmed routes. Scope, Project Proposal, and Project Board values are preserved.

Confirmed-route selectors no longer offer the contradictory Pathway not confirmed choice. Behavioural, Archival, Program Evaluation, and No Formal Review retain their existing route-sensitive labels and valid states. “Not Yet Ready” was not added as a stored state, selector option, inference, or UI label.

## Event-type visual-system refinement

The event-type language was revised without changing the schedule, state logic, pathway logic, Canvas routing, or page hierarchy. A single reusable badge structure now carries the visible type label and semantic class in DO NOW, Coming Next, and the Full Course Timeline. Coming Next uses a slightly more compact instance of the same component rather than a second colour language.

The final mapping is:

- **Seminar:** filled deep teal (`#1F4B4D`) with white text.
- **Tutorial:** soft sage (`#DCEBE5`) with dark teal text and a restrained sage border.
- **Deadline:** warm sand (`#E8D7B3`) with charcoal text and a muted ochre border.
- **Milestone:** slate blue-gray (`#DCE3E8`) with dark teal text and a quiet inset rule.
- **Partnership Action:** very pale sage (`#F0F6F3`) with dark teal text and a teal outline.
- **Support / Consultation:** light slate (`#E8EDF0`) with dark slate text and reduced visual weight.
- **Project Gate:** pale rose (`#F7ECEF`) with FNIS red text and a stronger two-pixel FNIS red border.
- **No Class:** neutral stone (`#F4F3EF`) with muted gray text and border.
- **Pending committee confirmation:** neutral gray, separate from the Project Gate treatment.

Project Boundary remains a structural panel/badge with its own label and teal rule rather than imitating a gate. Waiting and Blocked remain neutral operational conditions, and Ready with Conditions uses a restrained teal treatment rather than gate red.

The apparent empty Seminar rectangle was caused by the generic `.action-source` colour overriding the white Seminar badge text. That generic colour was removed; project-state sources now receive their own neutral badge class, so the SEMINAR label stays visible inside its deep-teal badge and every DO NOW item begins with a labelled badge treatment. Every category remains text-labelled, so the distinctions survive grayscale and do not rely on colour alone. Long labels may wrap within compact rectangular badges; no phone-specific substitute or abbreviation was required.

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

## Calendar stage versus project status

`COURSE_STAGES` contains broad calendar orientation only:

- Placement & Matching: September 9 to 24
- Partnership & Scoping: September 25 to October 20
- Project Development + Ethics / Readiness: October 21 to November 15
- Research Foundation: November 16 to December 1
- Term 1 Transition: December 2 to 7

September 25 is treated as the transition into Partnership & Scoping because Placements Announced marks the shift from matching into partnership development. This resolves the supplied overlapping boundary without changing the September 25 event.

Passing a date never changes project status. The optional client-side state model separately stores:

- Scope: Emerging, Core Commitment identified, or Partner-checked
- Project Proposal: Not started, Drafting, Complete draft, Revisions required, Cleared, or Final signed
- Ethics / Project Readiness: Pathway not confirmed, Developing, Quality Control, Submitted / Determined, Provisos, Ready with conditions, or Ready
- Project Board: Not yet activated or Active

The confirmed pathway selector retains five student-facing values grouped into exactly three conceptual pathways:

1. Behavioural Research
2. Archival Research
3. Research that does not require formal review, with Program Evaluation and No Formal Review routes

All selected values are fixed IDs stored only in the browser. No personal text or research information is collected. The interface explicitly says the settings are not an official course record and must not contain research data, participant information, partner-confidential information, or other sensitive information.

## DO NOW priority

`getDoNow()` uses this order and returns at most three actions:

1. active Project Gate, boundary, or blocking prerequisite;
2. locally known project state;
3. currently active date window;
4. a seminar, tutorial, deadline, milestone, or consultation within the next week;
5. the next dated activity as a fallback.

No action is labelled On track unless the locally selected state supports it. Waiting, Ready with conditions, and Blocked are used as operational conditions. The boundary copy states that blocked does not mean behind where a gate actually blocks governed work.

## Active and open-ended windows

Finite windows are represented with `date` and `endDate`:

- Two-Way Interview Window: September 21 to 24
- Partner Scope Check: October 9 to 16
- Partner Ethics & Project-Development Check-In: October 21 to 30

Open-ended windows add `openEnded: true` and a data condition:

- First Partner Meeting begins September 25 and remains active only while Scope is Emerging.
- Proviso Response & Ethics Approval begins November 30 and appears only while Ethics / Readiness is Provisos.

The renderer does not close these windows because time passed. It suppresses them only when the relevant locally stored state no longer matches.

## Revised Term 1 course data

The older Term 1 event sequence was replaced with the supplied Monday/Wednesday calendar through December 7, including:

- explicit No Class entries for September 7, September 30, October 12, November 9, and November 11;
- the full reciprocal Placement & Matching sequence;
- emerging scoping on September 28, Bullseye/Core Commitment on October 5, Scope Snapshot on October 7, and Partner Scope Check October 9 to 16;
- the Practicum Project Board Working Session on October 19;
- the three-pathway ethics architecture beginning October 21;
- one Checkpoint on October 23, Case Conferences October 26 and 27, Proposal draft October 28, clearance/revisions October 29 and 30;
- Ethics / Project-Readiness Assembly November 2;
- Ethics Quality-Control and the 15% Final Signed Project Proposal gate on November 4 EOD;
- the provisional noon Formal Ethics Submission / Project-Readiness Determination gate on November 13;
- Research Foundation and X̱wi7x̱wa work from November 16;
- proviso work from November 30 where applicable;
- Term 1 wrap-up and transition on December 2 and 7;
- no invented December 9 seminar.

The November 13 status uses one `provisional: true` field. `COURSE_CONFIG.provisionalLabel` supplies the neutral “Pending committee confirmation” badge everywhere. Changing the event field to `false` removes the badge throughout the app.

Stable high-level Term 2 assessment information remains visible. The detailed Term 2 weekly schedule is not invented; the UI states that it will be available after the winter break.

## Canvas resources

`COURSE_RESOURCES` is the single registry of 59 surviving canonical resources. All 59 have authoritative Canvas URLs; none currently has a blank URL. The renderer still supports the quiet “Canvas link to be added” state for any future blank or invalid destination.

This cleanup added or corrected the authoritative destinations for Common Research Methods, Bullseye / Core Commitment, Building Your Scope Snapshot, Checking the Scope with Your Partner, Project Proposal Timeline & Review Sequence, Project Proposal Template, Completed Proposal Examples, Research Ethics Timeline & Review Sequence, What Determines Your Ethics Pathway?, Ethics Development & Project Readiness, Consent, Recruitment, Behavioural Research: Data Collection, Risk & Vulnerability, Access & Custodianship, Participation & Consent, Representation/Attribution/Re-Circulation, Data Stewardship, Storing Your Data, Research Foundation Group A, Finding Resources That Are Useful to the Project, and X̱wi7x̱wa Search Preparation.

The following resource types were corrected:

- Bullseye / Core Commitment: page placeholder to assignment.
- Project Proposal Timeline & Review Sequence: misleading assignment placeholder to page.
- Project Proposal Template: template placeholder to Canvas file.
- Completed Proposal Examples: page placeholder to assignment.
- Research Ethics Timeline & Review Sequence: module placeholder to page.
- X̱wi7x̱wa Search Preparation: page placeholder to assignment.

Common Research Methods and Ethics Development & Project Readiness remain module-level resources. Because Canvas does not provide a standalone module URL for either, both intentionally link to the general Canvas Modules destination and clearly say “module” in their labels and metadata.

The following conceptual or redundant resource IDs were removed: `projectBoard`, `proposalAssignment`, `proposalChecklist`, `proposalSignatureRouting`, `researchInstrumentGuidance`, `projectReadinessRecord`, `projectFolderGuide`, `foundationExample`, `xwi7xwaResources`, `milestoneAssignment`, `milestoneGuidance`, `deliverableDesignGuide`, `prototypesFeedback`, `feedbackCadence`, `decisionsChanges`, `handoverGuidance`, `closeoutChecklist`, `partnerDraftInstructions`, `presentationGuidance`, `presentationRubric`, `communityDeliverable`, and `communityPresentation`.

Context routing now uses `projectBoardReference` and `projectBoardSetup` instead of a generic Project Board entry; Proposal checklist and signature contexts resolve to `proposalTimeline`; behavioural research-instrument needs resolve to `behaviouralDataCollection`; Project-Readiness record needs resolve to `projectReadinessConfirmation`; and common information-handling contexts resolve to Data Stewardship, with Storing Your Data retained for Behavioural work. Research Foundation routes only to its three confirmed resources. Removed Term 2 concepts were not replaced with invented destinations; the dated events and assessments remain unchanged.

`COURSE_RESOURCE_CONTEXTS` references surviving IDs only and chooses up to five resources by broad course stage, current date, priority, and pathway. Participation & Consent is restricted to Program Evaluation, Representation/Attribution/Re-Circulation to No Formal Review, Access & Custodianship to Archival, and the behavioural Consent, Recruitment, and Data Collection resources to Behavioural Research.

No Canvas URL appears in rendering logic, and the finished application makes no runtime network requests.

## Tests run

On September 8, 2026:

```text
node tests/test-data.js
40 tests passed

node --check js/course-data.js
passed

node --check js/app.js
passed
```

The regression suite checks:

- unique event/module IDs, valid dates, chronological ordering, and stable same-day ordering;
- contiguous broad stages and full September 9 to April 12 coverage;
- structural separation of calendar stage from project state;
- exactly three conceptual ethics pathways;
- all supplied Term 1 dates and event types;
- unchanged assessment weights and project-gate classification;
- the single November 13 provisional switch and weekly prose that does not hard-code that date;
- finite, open-ended, and state-suppressed windows;
- DO NOW priority and three-item cap;
- Behavioural, Archival, Program Evaluation, No Formal Review, and unconfirmed boundary logic;
- pathway confirmation from an unconfirmed state for Behavioural, Program Evaluation, and Archival routes;
- return to Not yet confirmed while preserving unrelated Scope, Proposal, and Board values;
- conservative repair of Ready with Conditions and Provisos across incompatible confirmed routes;
- repair and persistence of contradictory localStorage values on load;
- normalization and URL rewriting for contradictory Instructor Preview parameters;
- route-correct Before You Proceed guidance after normalization;
- absence of a local `not-ready` state or “Not Yet Ready” selector label;
- placement/date-aware and pathway-specific resource selection;
- the 59-resource canonical registry, zero current blank URLs, supported Canvas file type, link/placeholder states, and new-tab safety;
- exact supplied labels, types, and authoritative Canvas URLs;
- complete removal of conceptual IDs and dangling context references;
- duplicate-destination prevention except for the intentional Canvas Modules routing;
- pathway-appropriate Behavioural, Archival, Program Evaluation, and No Formal Review resource selection;
- preservation of Term 2 course events after removal of conceptual Term 2 resource cards;
- focused, fully linked resource sets on October 5, October 7, October 14, October 26, November 4, and November 18;
- all requested preview dates from September 9 through December 8;
- local persistence and storage-failure fallback;
- timeline disclosure and `aria-expanded` behavior;
- logo/fallback exclusivity and Vancouver calendar-day handling;
- consistent semantic event-type classes in DO NOW, Coming Next, and the Full Course Timeline;
- protection against the generic source-label colour hiding filled badge text;
- distinct gate, boundary, pending, waiting, blocked, and ready-with-conditions treatments;
- WCAG AA text/background contrast for every event and pending-status token;
- valid local paths, unique IDs, ARIA references, offline architecture, and absence of em dashes in student-facing HTML/JavaScript copy.

## Browser and accessibility verification

The local build was rendered at 320, 375, 768, 1024, and 1440px. Each width had:

- no page-level horizontal overflow;
- no blank Current Stage, project summary, DO NOW, Coming Next, journey, stage detail, Useful Right Now, or timeline content;
- the real FNIS mark displayed with no fallback block beneath it;
- no browser console warnings or errors.

The October 26 Behavioural view was visually inspected at desktop and 320px mobile widths. The five pathways were checked on November 13 with route-appropriate boundary copy and resources. Timeline expansion was exercised in the browser and reported `aria-expanded="true"`. A partner-checked Scope state suppressed the First Partner Meeting action after its opening date.

The focused simplification pass additionally verified September 28 with an emerging Scope; October 19 with a partner-checked Scope and inactive Board; October 21 with unconfirmed, Behavioural, and Archival pathways; November 13 with Behavioural submission, Program Evaluation determination, and No Formal Review Ready with Conditions states; and November 30 with Behavioural Provisos and Ready states. The provisional November gate remained visible in Coming Next, while a Ready Behavioural state suppressed the open-ended proviso gate. The corrected layout was rechecked at 320, 375, 768, 1024, and 1440px with no horizontal overflow or console errors.

The final audit repeated those checks with the filtered selector labels and also covered October 5 Emerging Scope, November 4 Drafting Proposal, November 13 Behavioural Ready, No Formal Review Ready, and Archival Ready states, plus the January 30 arbitrary-date preview. A live pathway switch from No Formal Review with Ready with Conditions to Behavioural reset only Ethics / Readiness to Developing, preserved Scope, Proposal, and Board, refreshed the selector labels, and updated the preview URL without an error. At every responsive width, Before You Proceed was first in source order, both boundary and weekly panels remained visible when applicable, every status select retained its associated label, and the browser console remained clear.

The event-type refinement was rendered at September 9, September 21, October 19, November 4, November 9, and November 30. The mixed views showed Seminar, Tutorial, Deadline, Partnership Action, Milestone, Support / Consultation, Project Gate, and No Class with the intended distinct styles. The expanded Full Course Timeline used the same labelled mapping. At 320, 375, 768, 1024, and 1440px, Partnership Action, Support / Consultation, and Pending committee confirmation remained fully visible, their content widths did not overflow, and the document width never exceeded the viewport. The final browser console contained no errors.

The pre-publish correction was rendered with a contradictory Behavioural preview URL (`ethics=pathway-not-confirmed`); the interface and URL both normalized to Developing and showed Behavioural development and pre-approval boundary language. A live change back to Not yet confirmed reset Ethics / Readiness to Pathway not confirmed while preserving Scope, Proposal, and Board. Confirming Program Evaluation then selected Project-Readiness materials in development and refreshed the permission/readiness boundary. Switching No Formal Review + Ready with Conditions to Behavioural normalized to Behavioural development without carrying the incompatible outcome. No browser errors occurred.

The Canvas cleanup was rendered at October 5, October 7, October 14, November 4, and November 18, plus October 26 for all four confirmed pathways. Every displayed card was a real link with its correct PAGE, ASSIGNMENT, FILE, or MODULE label, `_blank` target, and `noopener noreferrer`. No unavailable placeholder rendered because every surviving registry entry is linked. Consent, Recruitment, and Behavioural Data Collection appeared only for Behavioural; Access & Custodianship for Archival; Participation & Consent for Program Evaluation; and Representation, Attribution & Re-Circulation for No Formal Review. The longest No Formal Review labels were rechecked at 320px without horizontal overflow. The browser console remained clear.

Accessibility retained or added:

- semantic headings, lists, definition lists, native selects, buttons, links, and disclosure control;
- visible focus styling and 40px minimum interactive-control height;
- textual current/earlier/upcoming, gate, boundary, and operational-condition labels so meaning is not colour-only;
- live announcements for date and state changes;
- useful logo alt text and mutually exclusive logo/fallback states;
- working Canvas links with accessible new-tab names and `noopener noreferrer`;
- non-interactive missing-resource cards without fake URLs;
- `prefers-reduced-motion` support.

## Issues found and fixed

- Replaced the old eighteen-slice date model that could suggest automatic project completion with five broad Term 1 calendar stages and a separate local project-state model.
- Corrected the Project Board Working Session to October 19 and made the Board persistent infrastructure rather than a completed phase.
- Removed obsolete Pulse events and replaced the prior Term 1 sequence with the supplied weekly teaching calendar.
- Removed gate styling from ordinary milestones such as Placements Announced and the Deliverable Milestone.
- Added conditional suppression for the First Partner Meeting and proviso response windows.
- Added the Revisions required state so a proposal can remain actionable after the calendar reaches teaching-team clearance.
- Grouped Program Evaluation and No Formal Review beneath the third ethics pathway in the native selector.
- Preserved all resource links in the central registry and added the confirmed Canvas navigation and Project Board destinations.
- Added a 920px responsive breakpoint for the five status controls so labels and values do not become cramped in embedded layouts.
- Replaced the unfinished event markers with one labelled semantic badge system shared across DO NOW, Coming Next, and the Full Course Timeline.
- Fixed the CSS cascade that made the white Seminar label disappear against its deep-teal fill.
- Prevented confirmed pathways from carrying Pathway not confirmed and unconfirmed pathways from carrying advanced Ethics / Readiness states.
- Routed stale storage, preview parameters, live pathway changes, and derived guidance through the centralized pathway/status normalizer.
- Replaced conceptual resource placeholders with the supplied authoritative Canvas destinations and removed redundant or nonexistent resource entries.
- Added Canvas file metadata support for the Project Proposal Template and removed every dangling resource-context reference.

## Remaining limitations

- The Navigator cannot know actual project status, partner actions, ethics decisions, permissions, or readiness unless the student updates the small local status controls.
- Local settings do not synchronize between devices and are cleared with browser site data.
- The explicit module-level links open the Canvas Modules screen; students then select the named Common Research Methods or Ethics Development & Project Readiness module.
- The November 13 gate remains provisional pending committee confirmation.
- The March Musqueam presentation date remains TBC.
- Detailed Term 2 weekly teaching activity remains unpublished. Only stable high-level assessment milestones are retained.

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

Recommended checks:

```text
Placement and first partner transition
http://localhost:8000/?preview=1&date=2026-09-25

Project Board working session
http://localhost:8000/?preview=1&date=2026-10-19&scope=partner-checked&proposal=drafting&board=not-activated

Behavioural development
http://localhost:8000/?preview=1&date=2026-10-26&pathway=behavioural&scope=partner-checked&proposal=drafting&ethics=developing&board=active

No-formal-review readiness
http://localhost:8000/?preview=1&date=2026-11-13&pathway=no-formal-review&scope=partner-checked&proposal=final-signed&ethics=submitted-determined&board=active

Provisos active
http://localhost:8000/?preview=1&date=2026-11-30&pathway=behavioural&scope=partner-checked&proposal=final-signed&ethics=provisos&board=active

Term 1 transition
http://localhost:8000/?preview=1&date=2026-12-07&pathway=behavioural&scope=partner-checked&proposal=final-signed&ethics=ready&board=active
```

## Where to maintain Canvas destinations

Open `js/course-data.js` and edit the one canonical entry in `COURSE_RESOURCES`. All current entries are linked. If a future entry temporarily has `url: ""`, it will render as “Canvas link to be added.” Edit `COURSE_RESOURCE_CONTEXTS` only if its date, priority, course-stage, or pathway routing also needs to change.

The project is ready to publish on GitHub Pages or another HTTPS static host. It has not been deployed or pushed.
