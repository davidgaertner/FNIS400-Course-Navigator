# FNIS 400 Practicum Course Navigator

A dependency-free, date-aware orientation and routing tool for the 2026–27 FNIS 400 Community Research Practicum. It uses the America/Vancouver course date to show the current calendar stage, immediate work, upcoming activities and gates, project dependencies, and relevant Canvas destinations.

The Navigator does not know or assess an individual student’s progress. A locally selected project pathway changes the on-screen route guidance, but it stays only in that browser’s `localStorage`; it is never transmitted or treated as an official course record. The app has no accounts, analytics, cookies, API calls, or runtime dependencies.

## Launch locally

Opening `index.html` directly works in a modern browser. For the most reliable Canvas-like test, open a terminal in this project folder and run:

```bash
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

Instructor preview:

```text
http://localhost:8000/?preview=1
http://localhost:8000/?preview=1&date=2026-10-26
http://localhost:8000/?preview=1&date=2026-11-13&pathway=behavioural
```

Preview mode adds a date picker, Today button, compact key-date menu, and the same pathway selector students see once it becomes relevant. Valid preview pathway values are `not-confirmed`, `behavioural`, `archival`, `program-evaluation`, and `no-formal-review`.

## Run checks

No packages need to be installed. With Node available:

```bash
node tests/test-data.js
node --check js/course-data.js
node --check js/app.js
```

The suite checks the authoritative module starts and events, overlapping and primary stage ranges, all required preview dates, every November 13 route, assessment truth, locally persisted pathway behavior, resource routing, DOM rendering, local paths, disclosure behavior, logo fallback, and mobile CSS safeguards.

## Maintain course data

All course content and routing data live in `js/course-data.js`:

- `COURSE_CONFIG`: timezone, academic year, local pathway storage key, update date, resource limit, and the Term 2 publication notice.
- `COURSE_MODULES`: authoritative Term 1 module start dates.
- `COURSE_ASSESSMENTS`: the six assessed components and weights.
- `COURSE_STAGES`: the precise date-aware stage shown in the hero. `start`/`end` define the one primary stage for each date; `activeStart`/`activeEnd` preserve overlapping responsibilities.
- `COURSE_EVENTS`: dated activities, ranges, gates, statuses, assessment references, and the pathway-specific November 13 variants.
- `PROJECT_PATHWAYS`: route-specific project conditions, guidance, holds, and dependencies.
- `COURSE_RESOURCES`: the canonical Canvas registry. Each object key is a stable internal resource ID with one label, type, and URL.
- `COURSE_RESOURCE_CONTEXTS`: stage/date/pathway routing that references those stable IDs. It never duplicates a resource label or URL.

Use `YYYY-MM-DD` calendar-date strings. Do not convert course dates to timestamps. After any change, rerun the checks above.

### Add or change a Canvas URL

Find the stable ID in `COURSE_RESOURCES` and replace its blank URL:

```js
researchEthics: {
  label: "Research Ethics",
  url: "https://canvas.ubc.ca/...",
  type: "module"
}
```

A valid HTTP(S) URL automatically renders as an underlined, keyboard-focusable link that opens in a new tab. A blank or invalid URL remains a quiet, non-interactive card labelled “Canvas link to be added.” Never add URLs to `app.js`.

To change when that resource appears, edit its `resourceId` entry in `COURSE_RESOURCE_CONTEXTS`. `usefulPeriods` accepts `from`, `until`, and `priority`; `pathways` limits a resource to selected routes; `stages` can carry it into an adjacent stage. The resolver de-duplicates resources and shows at most `COURSE_CONFIG.resourceDisplayLimit` items.

## FNIS logo and colour system

The header loads:

```text
assets/fnis-logo.png
```

When the file loads, only the real artwork is shown. If it is absent or fails, the image stays hidden and the typographic FNIS fallback appears. The logo is not cropped or recoloured.

The supplied FNIS artwork is installed at that path in this build.

The core visual tokens are at the top of `css/styles.css`: `--fnis-red`, `--fnis-teal`, `--fnis-wine`, `--fnis-white`, `--page-bg`, `--surface`, `--surface-soft`, `--border`, `--text`, and `--text-muted`.

## Full Course Timeline

The entire timeline heading is a native disclosure control. Pointer, Enter, and Space input open or close it; its text changes between “View all dates +” and “Hide dates −”, and `aria-expanded` stays synchronized.

## Project structure

```text
index.html              Semantic page structure
css/styles.css          FNIS visual system, responsive and print styles
js/course-data.js       Centralized course, route, resource, and date data
js/app.js               Rendering, preview, selector, and disclosure behavior
assets/                 FNIS logo slot and asset notes
tests/test-data.js      Dependency-free Node regression suite
README.md               Launch and maintenance guide
BUILD_REPORT.md         Completed-build verification record
```

## Future deployment

Because the app is static, it can later be hosted on an appropriate HTTPS static host and linked or embedded from Canvas where security settings permit. No build step, server application, database, credentials, or deployment-specific code is required.
