"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const data = require("../js/course-data.js");

const {
  COURSE_CONFIG, COURSE_MODULES, COURSE_ASSESSMENTS, COURSE_RESOURCES,
  COURSE_RESOURCE_CONTEXTS, PROJECT_PATHWAYS, COURSE_STAGES, COURSE_EVENTS,
  JOURNEY_STAGE_IDS, utils
} = data;
const projectRoot = path.resolve(__dirname, "..");
let passed = 0;

function test(name, fn) {
  try {
    fn();
    passed += 1;
    console.log("✓ " + name);
  } catch (error) {
    console.error("✗ " + name);
    throw error;
  }
}

class FakeNode {
  constructor(tagName) {
    this.tagName = tagName;
    this.children = [];
    this.dataset = {};
    this.attributes = {};
    this.listeners = {};
    this.className = "";
    this.hidden = false;
    this.naturalWidth = 0;
    this.removed = false;
    this.open = false;
    this.value = "";
    this._text = "";
  }
  get textContent() { return this._text + this.children.map(function (child) { return child.textContent; }).join(""); }
  set textContent(value) { this._text = value == null ? "" : String(value); this.children = []; }
  appendChild(child) { this.children.push(child); return child; }
  replaceChildren() { this._text = ""; this.children = Array.from(arguments); }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  addEventListener(name, handler) { this.listeners[name] = handler; }
  remove() { this.removed = true; }
}

function renderView(search, options) {
  const html = fs.readFileSync(path.join(projectRoot, "index.html"), "utf8");
  const nodes = new Map();
  Array.from(html.matchAll(/<([a-z0-9-]+)[^>]*\sid="([^"]+)"[^>]*>/gi)).forEach(function (match) {
    const node = new FakeNode(match[1].toLowerCase());
    node.hidden = /\shidden(?:\s|>|$)/i.test(match[0]);
    nodes.set(match[2], node);
  });
  nodes.get("fnis-logo").dataset.src = "assets/fnis-logo.png?v=20260907-artwork1";
  const storage = new Map(Object.entries((options && options.storage) || {}));
  const localStorage = {
    getItem: function (key) {
      if (options && options.storageThrows) throw new Error("storage unavailable");
      return storage.has(key) ? storage.get(key) : null;
    },
    setItem: function (key, value) {
      if (options && options.storageThrows) throw new Error("storage unavailable");
      storage.set(key, String(value));
    }
  };
  const document = {
    getElementById: function (id) { return nodes.get(id) || null; },
    createElement: function (tagName) { return new FakeNode(tagName); },
    createTextNode: function (text) { const node = new FakeNode("#text"); node.textContent = text; return node; },
    querySelectorAll: function () { return []; }
  };
  const window = {
    FNIS400: data,
    localStorage: localStorage,
    location: { search: search, href: "file:///index.html" + search },
    history: { replaceState: function (_state, _title, url) { window.lastUrl = String(url); } }
  };
  const context = vm.createContext({ window: window, document: document, URL: URL, URLSearchParams: URLSearchParams, Intl: Intl, Date: Date, console: console });
  vm.runInContext(fs.readFileSync(path.join(projectRoot, "js/app.js"), "utf8"), context, { filename: "js/app.js" });
  return {
    nodes: nodes,
    storage: storage,
    window: window,
    text: function (id) { return nodes.get(id).textContent.replace(/\s+/g, " ").trim(); }
  };
}

function renderPreview(date, pathway, options) {
  return renderView("?preview=1&date=" + date + (pathway ? "&pathway=" + pathway : ""), options);
}

function event(id) { return COURSE_EVENTS.find(function (item) { return item.id === id; }); }
function selectedResourceIds(date, pathway) {
  return utils.getResourcesForStage(utils.getStage(date), date, pathway).map(function (resource) { return resource.id; });
}

test("dated course events remain in chronological source order", function () {
  const actual = COURSE_EVENTS.filter(function (item) { return item.date; }).map(function (item) { return item.id; });
  const sorted = utils.sortedDatedEvents("not-confirmed").map(function (item) { return item.id; });
  assert.deepEqual(actual, sorted);
});

test("event and module IDs are unique", function () {
  assert.equal(new Set(COURSE_EVENTS.map(function (item) { return item.id; })).size, COURSE_EVENTS.length);
  assert.equal(new Set(COURSE_MODULES.map(function (item) { return item.id; })).size, COURSE_MODULES.length);
});

test("all exact dates and ranges are valid", function () {
  COURSE_EVENTS.forEach(function (item) {
    if (item.date) assert.equal(utils.isValidDate(item.date), true, item.id);
    if (item.endDate) { assert.equal(utils.isValidDate(item.endDate), true, item.id); assert.ok(item.endDate >= item.date, item.id); }
  });
  COURSE_MODULES.forEach(function (module) { assert.equal(utils.isValidDate(module.start), true, module.id); });
});

test("primary stage ranges are contiguous while active responsibilities can overlap", function () {
  for (let index = 1; index < COURSE_STAGES.length; index += 1) {
    const previous = COURSE_STAGES[index - 1];
    const current = COURSE_STAGES[index];
    assert.equal(utils.daysBetween(previous.end, current.start), 1, previous.id + " → " + current.id);
  }
  for (let day = utils.dateOrdinal("2026-09-09"); day <= utils.dateOrdinal("2027-04-12"); day += 1) {
    const iso = new Date(day * 86400000).toISOString().slice(0, 10);
    assert.ok(utils.getStage(iso), iso);
  }
  const overlapping = utils.getActiveStages("2026-10-14").map(function (stage) { return stage.id; });
  ["partnership", "methods-scoping", "proposal", "research-ethics"].forEach(function (id) { assert.ok(overlapping.includes(id), id); });
});

test("the 18-stage practicum journey uses the authoritative order", function () {
  assert.deepEqual(JOURNEY_STAGE_IDS, ["orientation", "placement", "partnership", "methods-scoping", "proposal", "research-ethics", "ethics-pathway", "ethics-readiness", "quality-control", "ethics-readiness-gate", "foundation", "collaborative-design", "milestone", "deliverable-development", "partner-review", "handoff", "presentation", "closeout"]);
});

test("all authoritative Term 1 module starts are present", function () {
  const starts = Object.fromEntries(COURSE_MODULES.map(function (module) { return [module.title, module.start]; }));
  assert.deepEqual(starts, {
    "Start Here": "2026-09-09",
    "This Year’s Partners & Projects": "2026-09-09",
    "Placement & Matching": "2026-09-09",
    "Common Research Methods": "2026-09-23",
    "Beginning the Partnership": "2026-09-28",
    "Scoping Your Project": "2026-09-28",
    "Project Proposals": "2026-10-07",
    "Research Ethics": "2026-10-14",
    "Behavioural Research": "2026-10-19",
    "Ethics Pathways: Program Evaluation": "2026-10-19",
    "Ethics Pathways: Archival Research": "2026-10-19",
    "Ethics Pathways: No Formal Review": "2026-10-19",
    "Ethics Development & Project Readiness": "2026-10-21",
    "Quality Control & Submission of Ethics": "2026-11-04",
    "Research Foundation": "2026-11-16"
  });
});

test("Placement includes the complete professional-materials and reciprocal-interview sequence", function () {
  assert.equal(event("personal-profile-due").date, "2026-09-14");
  assert.equal(event("partner-fair").date, "2026-09-16");
  assert.match(event("preliminary-placement-interests").context, /three unranked/i);
  assert.equal(event("resume-cover-letter-due").date, "2026-09-21");
  assert.equal(event("resume-cover-letter-due").time, "12:00");
  assert.match(event("resume-cover-letter-due").context, /upload to Canvas.*send.*copy the teaching team/i);
  assert.equal(event("two-way-interviews").endDate, "2026-09-24");
  assert.match(event("two-way-interviews").context, /at least one reciprocal/i);
  assert.equal(event("final-placement-ranking").date, "2026-09-24");
  assert.equal(event("placement-confirmation").date, "2026-09-25");
  assert.equal(event("placement-confirmation").gate, true);
});

test("partnership and scoping landmarks use the revised logic", function () {
  assert.match(event("partnership-scoping-start").context, /not an inflexible site-visit window/i);
  assert.equal(event("bullseye-core-commitment").date, "2026-10-05");
  assert.equal(event("scope-snapshot").date, "2026-10-07");
  assert.equal(event("partner-scope-check").date, "2026-10-09");
  assert.equal(event("partner-scope-check").endDate, "2026-10-16");
  assert.match(event("scope-contingency").context, /only where partner availability requires/i);
});

test("Proposal dates and signature sequence are authoritative", function () {
  assert.equal(event("proposal-module-start").date, "2026-10-07");
  assert.equal(event("complete-proposal-draft").date, "2026-10-28");
  assert.equal(event("proposal-clearance").date, "2026-10-29");
  assert.match(event("proposal-clearance").context, /clearance, not teaching-team signature/i);
  assert.equal(event("proposal-revisions").date, "2026-10-30");
  assert.equal(event("proposal-to-partner").date, "2026-11-02");
  assert.match(event("proposal-to-partner").context, /clearance → student signs → community partner signs → instructor signs last/i);
  assert.equal(event("final-signed-proposal").date, "2026-11-04");
  assert.equal(event("final-signed-proposal").weight, "15%");
  assert.match(event("final-signed-proposal").context, /Due EOD.*instructor signs last.*confirmed pathway/i);
  assert.equal(COURSE_EVENTS.some(function (item) { return item.date === "2026-10-16" && item.weight; }), false);
});

test("ethics development has one checkpoint and the required October activities", function () {
  assert.equal(event("research-ethics-start").date, "2026-10-14");
  assert.equal(event("ethics-pathways-start").date, "2026-10-19");
  assert.match(event("ethics-pathways-start").context, /teaching team confirms/i);
  assert.equal(event("checkpoint-1").date, "2026-10-23");
  assert.equal(event("checkpoint-1").weight, undefined);
  assert.equal(event("sarah-office-hours-1").timeLabel, "11:00 AM–12:00 PM");
  assert.equal(event("case-conference-a").date, "2026-10-26");
  assert.equal(event("case-conference-b").date, "2026-10-27");
  assert.equal(event("case-conference-a").location, "CIS Meeting Room, Buchanan E273");
  assert.equal(event("ethics-development-day").date, "2026-10-30");
  assert.match(event("ethics-development-day").context, /no second formal checkpoint/i);
  assert.equal(COURSE_EVENTS.some(function (item) { return /checkpoint.?2/i.test(item.id + item.title); }), false);
  assert.equal(event("sarah-office-hours-2").timeLabel, "2:00–3:00 PM");
  assert.equal(event("ethics-readiness-package-draft").date, "2026-11-02");
});

test("Quality Control uses the revised November sequence", function () {
  assert.equal(event("quality-control-seminar").date, "2026-11-04");
  assert.match(event("quality-control-seminar").context, /not a first-drafting session/i);
  assert.equal(event("substantive-review-cutoff").date, "2026-11-06");
  assert.equal(event("november-midterm-break").endDate, "2026-11-11");
  assert.equal(event("final-assembly-readiness").date, "2026-11-12");
});

test("date rendering handles same-month ranges, cross-month ranges, single dates, and times", function () {
  const view = renderPreview("2026-11-12", "behavioural");
  const timeline = view.text("full-timeline");
  assert.ok(timeline.includes("November 9–11, 2026"));
  assert.ok(timeline.includes("November 12, 2026"));
  assert.ok(timeline.includes("September 21, 2026 at noon"));
  assert.ok(timeline.includes("October 30, 2026 · 2:00–3:00 PM"));

  const synthetic = { id: "test-cross-month-range", date: "2026-09-30", endDate: "2026-10-02", title: "Cross-month test range", type: "activity", stageIds: ["placement"] };
  COURSE_EVENTS.push(synthetic);
  try {
    const crossMonth = renderPreview("2026-09-30").text("full-timeline");
    assert.ok(crossMonth.includes("September 30 – October 2, 2026"));
  } finally {
    COURSE_EVENTS.pop();
  }
});

test("November 13 keeps one stable course gate with pathway-specific detail", function () {
  const expectedDetails = {
    "not-confirmed": "Pathway Not Yet Confirmed",
    behavioural: "Formal Ethics Submission, where required",
    archival: "Archival Conditions / Review in Progress",
    "program-evaluation": "Project-Readiness Confirmation",
    "no-formal-review": "Project-Readiness Confirmation"
  };
  Object.entries(expectedDetails).forEach(function (entry) {
    const resolved = utils.resolveEventForPathway(event("november-pathway-gate"), entry[0]);
    assert.equal(resolved.title, "Final Ethics / Project-Readiness Gate");
    assert.equal(resolved.type, "project-gate");
    assert.equal(resolved.gate, true);
    assert.equal(resolved.date, "2026-11-13");
    assert.equal(resolved.pathwayDetail.title, entry[1]);
  });
  const formal = utils.resolveEventForPathway(event("november-pathway-gate"), "behavioural");
  assert.equal(formal.pathwayDetail.timeLabel, "12:00 PM");
  assert.equal(formal.pathwayDetail.statusNote, "Working date, pending final committee confirmation.");
  assert.match(formal.pathwayDetail.context, /Submission is not approval.*formal ethics approval remains on hold/i);
  const readiness = utils.resolveEventForPathway(event("november-pathway-gate"), "program-evaluation");
  assert.match(readiness.pathwayDetail.context, /Ready to Proceed.*Ready with Conditions.*Not Yet Ready.*not formal ethics approval.*readiness may be partial/i);
  const archival = utils.resolveEventForPathway(event("november-pathway-gate"), "archival");
  assert.doesNotMatch(archival.pathwayDetail.context, /ethics approved|archival approval/i);
  assert.match(archival.pathwayDetail.context, /No universal REB-style archival submission or approval process is implied/i);
  const unconfirmed = utils.resolveEventForPathway(event("november-pathway-gate"), "not-confirmed");
  assert.match(unconfirmed.pathwayDetail.context, /blocking dependency, not a different November 13 course event/i);
});

test("pathway model has three conceptual pathways and four student-facing confirmed routes", function () {
  assert.deepEqual(Object.keys(PROJECT_PATHWAYS), ["not-confirmed", "behavioural", "archival", "program-evaluation", "no-formal-review"]);
  assert.equal(PROJECT_PATHWAYS["program-evaluation"].conceptualPathway, "Research that does not require formal review");
  assert.equal(PROJECT_PATHWAYS["no-formal-review"].conceptualPathway, "Research that does not require formal review");
  assert.match(PROJECT_PATHWAYS["program-evaluation"].states[0].guidance, /not a fourth ethics pathway/i);
  assert.match(PROJECT_PATHWAYS["no-formal-review"].states[0].guidance, /No formal review does not mean unrestricted use/i);
  assert.match(PROJECT_PATHWAYS.archival.states[0].guidance, /Access is not authority/i);
});

test("Research Foundation is one assignment with two scheduling groups", function () {
  assert.equal(event("research-foundation-start").date, "2026-11-16");
  assert.match(event("research-foundation-start").context, /not an annotated bibliography/i);
  assert.equal(event("xwi7xwa-preparation").date, "2026-11-17");
  assert.equal(event("xwi7xwa-preparation").timeLabel, "11:59 PM");
  assert.equal(event("foundation-group-a").date, "2027-01-11");
  assert.equal(event("foundation-conversation-a").date, "2027-01-13");
  assert.equal(event("foundation-group-b").date, "2027-01-18");
  assert.equal(event("foundation-conversation-b").date, "2027-01-20");
  ["foundation-group-a", "foundation-group-b"].forEach(function (id) {
    assert.equal(event(id).weight, undefined);
    assert.match(event(id).context, /scheduling groups for one 15% Research Foundation assignment/i);
  });
  assert.match(utils.getStage("2026-11-17").description, /project-specific knowledge base.*not an annotated bibliography/i);
  assert.match(utils.getStage("2026-11-17").rightNow.join(" "), /3–5.*8–12.*guidance, not a quota/i);
});

test("known Term 2 milestones remain and invented weekly schedule items are absent", function () {
  const expectedDates = {
    "milestone-form-confirmation": "2027-01-27", "pulse-2027-01-31": "2027-01-31", "deliverable-milestone": "2027-02-01",
    "milestone-clinic-a": "2027-02-03", "milestone-clinic-b": "2027-02-10", "working-deliverable": "2027-03-01",
    "partner-review-draft": "2027-03-08", "community-research-deliverables": "2027-03-25",
    "community-research-presentation": "2027-04-07", "project-closeout-complete": "2027-04-12"
  };
  Object.entries(expectedDates).forEach(function (entry) { assert.equal(event(entry[0]).date, entry[1]); });
  assert.ok(event("milestone-clinic-a").date > event("deliverable-milestone").date);
  assert.ok(event("milestone-clinic-b").date > event("deliverable-milestone").date);
  const forbidden = ["design-handover-clinic", "deliverable-studio-1", "deliverable-studio-2", "partner-feedback-presentation", "final-deliverable-studio", "draft-slides"];
  forbidden.forEach(function (id) { assert.equal(event(id), undefined, id); });
  assert.equal(COURSE_CONFIG.term2ScheduleNotice, "The Term 2 schedule will be available after the winter break.");
});

test("established Term 1 Project Pulses remain ungraded", function () {
  ["pulse-2026-09-27", "pulse-2026-10-04", "pulse-2026-11-22", "pulse-2026-11-29"].forEach(function (id) {
    assert.ok(event(id), id);
    assert.equal(event(id).type, "pulse");
    assert.equal(event(id).weight, undefined);
  });
});

test("assessment truth totals 100 and excludes ungraded course activities", function () {
  const weights = Object.values(COURSE_ASSESSMENTS).map(function (assessment) { return assessment.weight; });
  assert.deepEqual(weights, [15, 15, 20, 10, 30, 10]);
  assert.equal(weights.reduce(function (sum, value) { return sum + value; }, 0), 100);
  COURSE_EVENTS.filter(function (item) { return item.type === "pulse" || /checkpoint|conversation|readiness|office-hours/i.test(item.id); }).forEach(function (item) {
    assert.equal(item.weight, undefined, item.id + " must not be separately graded");
  });
});

test("canonical resource registry and mappings are structurally valid", function () {
  const allowedTypes = new Set(["page", "assignment", "module", "template", "external"]);
  Object.entries(COURSE_RESOURCES).forEach(function (entry) {
    assert.ok(entry[0]);
    assert.ok(entry[1].label);
    assert.equal(typeof entry[1].url, "string");
    assert.ok(allowedTypes.has(entry[1].type));
  });
  Object.entries(COURSE_RESOURCE_CONTEXTS).forEach(function (entry) {
    const ids = [];
    entry[1].forEach(function (context) {
      assert.ok(COURSE_RESOURCES[context.resourceId], context.resourceId);
      assert.equal(context.label, undefined);
      assert.equal(context.url, undefined);
      assert.equal(context.type, undefined);
      if (context.pathways) context.pathways.forEach(function (pathway) { assert.ok(PROJECT_PATHWAYS[pathway]); });
      if (context.usefulPeriods) context.usefulPeriods.forEach(function (period) {
        if (period.from) assert.equal(utils.isValidDate(period.from), true);
        if (period.until) assert.equal(utils.isValidDate(period.until), true);
      });
      ids.push(context.resourceId);
    });
    assert.equal(new Set(ids).size, ids.length, entry[0] + " repeats a resource");
  });
});

const REAL_CANVAS_RESOURCES = {
  canvasHome: "https://canvas.ubc.ca/courses/194371",
  startHere: "https://canvas.ubc.ca/courses/194371/pages/welcome-to-fnis-400?module_item_id=9518046",
  howWeWork: "https://canvas.ubc.ca/courses/194371/pages/how-we-work-in-fnis-400",
  workingCommunityPartners: "https://canvas.ubc.ca/courses/194371/pages/working-with-community-partners",
  deadlinesGatesBlockedWork: "https://canvas.ubc.ca/courses/194371/pages/deadlines-project-gates-and-blocked-work",
  howUseCanvas: "https://canvas.ubc.ca/courses/194371/pages/how-to-use-this-canvas-site",
  conceptsTerms: "https://canvas.ubc.ca/courses/194371/pages/concepts-and-terms-used-regularly-in-fnis-400",
  partnersProjects: "https://canvas.ubc.ca/courses/194371/pages/how-to-read-the-partner-project-proposals?module_item_id=9677368",
  placementMatching: "https://canvas.ubc.ca/courses/194371/pages/how-placement-and-matching-works?module_item_id=9519859",
  positionalityGuidance: "https://canvas.ubc.ca/courses/194371/pages/positionality-and-introducing-yourself-to-partners?module_item_id=9519863",
  preparingPartnerFair: "https://canvas.ubc.ca/courses/194371/pages/preparing-for-the-partner-fair?module_item_id=9519864",
  personalProfile: "https://canvas.ubc.ca/courses/194371/assignments/2523249?module_item_id=9520212",
  positionalityStatement: "https://canvas.ubc.ca/courses/194371/assignments/2545452?module_item_id=9601103",
  partnerFair: "https://canvas.ubc.ca/courses/194371/pages/partner-fair?module_item_id=9520215",
  preliminaryInterests: "https://canvas.ubc.ca/courses/194371/assignments/2525739?module_item_id=9520225",
  resumeCoverLetter: "https://canvas.ubc.ca/courses/194371/assignments/2545453?module_item_id=9601106",
  targetedInterviews: "https://canvas.ubc.ca/courses/194371/pages/targeted-interviews?module_item_id=9520452",
  finalPlacementRanking: "https://canvas.ubc.ca/courses/194371/assignments/2526845?module_item_id=9524840",
  placementResults: "https://canvas.ubc.ca/courses/194371/pages/placement-results-and-what-happens-next?module_item_id=9524853",
  scopingProject: "https://canvas.ubc.ca/courses/194371/pages/scoping-your-project?module_item_id=9553456",
  beginningPartnership: "https://canvas.ubc.ca/courses/194371/pages/starting-your-placement",
  whatWeMeanScoping: "https://canvas.ubc.ca/courses/194371/pages/what-we-mean-by-scoping?module_item_id=9553401",
  behaviouralPathway: "https://canvas.ubc.ca/courses/194371/pages/how-the-behavioural-research-pathway-works",
  behaviouralDataCollection: "https://canvas.ubc.ca/courses/194371/pages/data-collection",
  storingData: "https://canvas.ubc.ca/courses/194371/pages/storing-your-data",
  programEvaluationPathway: "https://canvas.ubc.ca/courses/194371/pages/how-the-program-evaluation-pathway-works",
  programEvaluationDataCollection: "https://canvas.ubc.ca/courses/194371/pages/data-collection-2",
  dataStewardship: "https://canvas.ubc.ca/courses/194371/pages/data-stewardship",
  archivalPathway: "https://canvas.ubc.ca/courses/194371/pages/how-the-archival-research-pathway-works",
  noFormalReviewPathway: "https://canvas.ubc.ca/courses/194371/pages/how-the-no-formal-review-pathway-works",
  qualityControlSubmission: "https://canvas.ubc.ca/courses/194371/pages/preparing-for-the-quality-control-seminar",
  projectReadinessCheck: "https://canvas.ubc.ca/courses/194371/pages/project-readiness-check",
  finalAssemblyReadiness: "https://canvas.ubc.ca/courses/194371/assignments/2571537?module_item_id=9706121",
  formalEthicsSubmission: "https://canvas.ubc.ca/courses/194371/assignments/2571538?module_item_id=9706122",
  projectReadinessConfirmation: "https://canvas.ubc.ca/courses/194371/pages/project-readiness-confirmation?module_item_id=9706123",
  collaborativeDesignIteration: "https://canvas.ubc.ca/courses/194371/pages/how-collaborative-design-and-iteration-works"
};

test("all 36 confirmed Canvas URLs remain exact and unique", function () {
  assert.equal(Object.keys(REAL_CANVAS_RESOURCES).length, 36);
  Object.entries(REAL_CANVAS_RESOURCES).forEach(function (entry) { assert.equal(COURSE_RESOURCES[entry[0]].url, entry[1]); });
  assert.equal(new Set(Object.values(REAL_CANVAS_RESOURCES)).size, Object.keys(REAL_CANVAS_RESOURCES).length);
  assert.equal(COURSE_RESOURCES.startHere.label, "Welcome to FNIS 400");
  assert.equal(COURSE_RESOURCES.partnersProjects.label, "How to Read the Partner Project Proposals");
});

test("unresolved Canvas resources remain intentional non-links without dummy destinations", function () {
  const unresolved = Object.values(COURSE_RESOURCES).filter(function (resource) { return !resource.url; });
  assert.ok(unresolved.length > 0);
  unresolved.forEach(function (resource) { assert.equal(resource.url, "", resource.label); });
  Object.values(COURSE_RESOURCES).forEach(function (resource) {
    assert.notEqual(resource.url, "#", resource.label);
    assert.doesNotMatch(resource.url, /example\.(com|org)|dummy|placeholder/i, resource.label);
  });
  const mappedIds = new Set(Object.values(COURSE_RESOURCE_CONTEXTS).flatMap(function (contexts) { return contexts.map(function (context) { return context.resourceId; }); }));
  mappedIds.forEach(function (id) { assert.ok(COURSE_RESOURCES[id], id); });
});

test("Behavioural and Program Evaluation use distinct Data Collection destinations", function () {
  assert.equal(COURSE_RESOURCES.behaviouralDataCollection.url, "https://canvas.ubc.ca/courses/194371/pages/data-collection");
  assert.equal(COURSE_RESOURCES.programEvaluationDataCollection.url, "https://canvas.ubc.ca/courses/194371/pages/data-collection-2");
  assert.doesNotMatch(COURSE_RESOURCES.behaviouralDataCollection.url, /data-collection-2/);
  const behavioural = selectedResourceIds("2026-10-23", "behavioural");
  const evaluation = selectedResourceIds("2026-10-23", "program-evaluation");
  assert.ok(behavioural.includes("behaviouralDataCollection"));
  assert.equal(behavioural.includes("programEvaluationDataCollection"), false);
  assert.ok(evaluation.includes("programEvaluationDataCollection"));
  assert.equal(evaluation.includes("behaviouralDataCollection"), false);
});

test("date-aware resources surface a focused route without cross-pathway leakage", function () {
  const dateChecks = {
    "2026-09-09": ["startHere", "personalProfile", "placementMatching"],
    "2026-09-16": ["preparingPartnerFair", "partnerFair", "partnersProjects"],
    "2026-09-21": ["targetedInterviews", "resumeCoverLetter", "finalPlacementRanking"],
    "2026-09-25": ["placementResults", "scopingProject"],
    "2026-09-28": ["beginningPartnership", "workingCommunityPartners", "scopingProject"],
    "2026-10-05": ["whatWeMeanScoping", "scopingProject"],
    "2026-11-17": ["foundationAssignment", "xwi7xwaPreparation"],
    "2027-02-01": ["collaborativeDesignIteration", "milestoneAssignment"]
  };
  Object.entries(dateChecks).forEach(function (entry) {
    const ids = selectedResourceIds(entry[0], "not-confirmed");
    entry[1].forEach(function (id) { assert.ok(ids.includes(id), entry[0] + " should include " + id); });
    assert.ok(ids.length <= COURSE_CONFIG.resourceDisplayLimit, entry[0]);
  });

  const routeIds = {
    behavioural: ["behaviouralPathway"],
    archival: ["archivalPathway"],
    "program-evaluation": ["programEvaluationPathway"],
    "no-formal-review": ["noFormalReviewPathway"]
  };
  ["2026-10-19", "2026-10-23", "2026-11-02", "2026-11-04", "2026-11-13"].forEach(function (date) {
    Object.entries(routeIds).forEach(function (entry) {
      const ids = selectedResourceIds(date, entry[0]);
      assert.ok(ids.includes(entry[1][0]), date + " should include " + entry[1][0]);
      Object.values(routeIds).flat().filter(function (id) { return id !== entry[1][0]; }).forEach(function (other) {
        assert.equal(ids.includes(other), false, date + " " + entry[0] + " leaked " + other);
      });
      assert.ok(ids.length <= COURSE_CONFIG.resourceDisplayLimit, date + " " + entry[0]);
    });
    const unconfirmed = selectedResourceIds(date, "not-confirmed");
    Object.values(routeIds).flat().forEach(function (id) { assert.equal(unconfirmed.includes(id), false, date + " unconfirmed leaked " + id); });
  });
});

test("Quality Control and readiness resources follow the selected pathway", function () {
  ["2026-11-04", "2026-11-13"].forEach(function (date) {
    const behavioural = selectedResourceIds(date, "behavioural");
    assert.ok(behavioural.includes("qualityControlSubmission"));
    assert.ok(behavioural.includes("finalAssemblyReadiness"));
    assert.ok(behavioural.includes("formalEthicsSubmission"));
    assert.equal(behavioural.includes("projectReadinessConfirmation"), false);

    ["program-evaluation", "no-formal-review"].forEach(function (pathway) {
      const readiness = selectedResourceIds(date, pathway);
      ["qualityControlSubmission", "projectReadinessCheck", "finalAssemblyReadiness", "projectReadinessConfirmation"].forEach(function (id) {
        assert.ok(readiness.includes(id), date + " " + pathway + " should include " + id);
      });
      assert.equal(readiness.includes("formalEthicsSubmission"), false);
    });

    const archival = selectedResourceIds(date, "archival");
    assert.ok(archival.includes("qualityControlSubmission"));
    assert.ok(archival.includes("finalAssemblyReadiness"));
    assert.ok(archival.includes("archivalPathway"));
    assert.equal(archival.includes("formalEthicsSubmission"), false);
    assert.equal(archival.includes("projectReadinessConfirmation"), false);

    const unconfirmed = selectedResourceIds(date, "not-confirmed");
    assert.ok(unconfirmed.includes("qualityControlSubmission"));
    assert.ok(unconfirmed.includes("finalAssemblyReadiness"));
    ["formalEthicsSubmission", "projectReadinessConfirmation", "projectReadinessCheck"].forEach(function (id) { assert.equal(unconfirmed.includes(id), false); });
  });
});

const PREVIEW_CASES = [
  ["2026-09-10", "orientation", "personal-profile-due"], ["2026-09-18", "placement", "preliminary-placement-interests"],
  ["2026-09-21", "placement", "resume-cover-letter-due"], ["2026-09-23", "placement", "common-research-methods-start"],
  ["2026-09-25", "placement", "placement-confirmation"],
  ["2026-09-28", "partnership", "partnership-scoping-start"], ["2026-10-05", "methods-scoping", "bullseye-core-commitment"],
  ["2026-10-14", "research-ethics", "research-ethics-start"], ["2026-10-19", "ethics-pathway", "ethics-pathways-start"],
  ["2026-10-23", "ethics-readiness", "checkpoint-1"], ["2026-10-26", "ethics-readiness", "case-conference-a"],
  ["2026-10-29", "ethics-readiness", "proposal-clearance"], ["2026-11-02", "ethics-readiness", "ethics-readiness-package-draft"],
  ["2026-11-04", "quality-control", "quality-control-seminar"], ["2026-11-12", "quality-control", "final-assembly-readiness"],
  ["2026-11-13", "ethics-readiness-gate", "november-pathway-gate"], ["2026-11-17", "foundation", "xwi7xwa-preparation"],
  ["2027-01-11", "foundation", "foundation-group-a"], ["2027-01-18", "foundation", "foundation-group-b"],
  ["2027-01-30", "collaborative-design", "pulse-2027-01-31"], ["2027-02-01", "milestone", "deliverable-milestone"],
  ["2027-03-08", "partner-review", "partner-review-draft"], ["2027-03-25", "handoff", "community-research-deliverables"],
  ["2027-04-07", "presentation", "community-research-presentation"], ["2027-04-12", "closeout", "project-closeout-complete"]
];

test("all acceptance preview dates resolve to the correct stage and next event", function () {
  PREVIEW_CASES.forEach(function (entry) {
    assert.equal(utils.getStage(entry[0]).id, entry[1], entry[0]);
    assert.equal(utils.getNextEvent(entry[0], "not-confirmed").id, entry[2], entry[0]);
  });
});

test("Vancouver date detection avoids UTC day shifts", function () {
  assert.equal(utils.getVancouverToday(new Date("2026-10-27T06:30:00Z")), "2026-10-26");
  assert.equal(utils.getVancouverToday(new Date("2027-01-31T06:30:00Z")), "2027-01-30");
});

test("static HTML IDs, paths, and ARIA references are valid", function () {
  const html = fs.readFileSync(path.join(projectRoot, "index.html"), "utf8");
  const app = fs.readFileSync(path.join(projectRoot, "js/app.js"), "utf8");
  const ids = Array.from(html.matchAll(/\sid="([^"]+)"/g), function (match) { return match[1]; });
  assert.equal(new Set(ids).size, ids.length);
  const idSet = new Set(ids);
  Array.from(app.matchAll(/byId\("([^"]+)"\)/g), function (match) { return match[1]; }).forEach(function (id) { assert.ok(idSet.has(id), id); });
  Array.from(html.matchAll(/aria-(?:labelledby|describedby|controls)="([^"]+)"/g), function (match) { return match[1]; }).flatMap(function (value) { return value.split(/\s+/); }).forEach(function (id) { assert.ok(idSet.has(id), id); });
  Array.from(html.matchAll(/\s(?:src|href)="([^"]+)"/g), function (match) { return match[1]; }).filter(function (ref) { return !ref.startsWith("#") && !/^[a-z]+:/i.test(ref); }).forEach(function (ref) { assert.ok(fs.existsSync(path.join(projectRoot, ref.split(/[?#]/)[0])), ref); });
});

test("preview UI includes the compact key-date control and pathway selector", function () {
  const html = fs.readFileSync(path.join(projectRoot, "index.html"), "utf8");
  assert.match(html, /id="preview-shortcut"/);
  PREVIEW_CASES.forEach(function (entry) { assert.match(html, new RegExp("value=\"" + entry[0] + "\""), entry[0]); });
  assert.match(html, /My confirmed project pathway/i);
  assert.match(html, /Not yet confirmed/);
  assert.match(html, /Nothing is transmitted or treated as an official course record/);
});

test("every acceptance preview renders all critical sections", function () {
  PREVIEW_CASES.forEach(function (entry) {
    const view = renderPreview(entry[0], entry[0] >= "2026-10-14" ? "behavioural" : null);
    ["position-title", "next-event", "next-gate", "by-now-list", "right-now-list", "coming-up-list", "pathway-status", "dependency-list", "journey-list", "journey-detail", "resources-list", "upcoming-list", "full-timeline"].forEach(function (id) {
      assert.ok(view.text(id).length > 0, entry[0] + " left #" + id + " blank");
    });
  });
});

test("pathway selector defaults safely and persists locally where supported", function () {
  const defaultView = renderPreview("2026-10-19");
  assert.equal(defaultView.nodes.get("pathway-select").value, "not-confirmed");
  assert.match(defaultView.text("pathway-status"), /Pathway Not Yet Confirmed/);
  defaultView.nodes.get("pathway-select").listeners.change({ target: { value: "behavioural" } });
  assert.equal(defaultView.storage.get(COURSE_CONFIG.pathwayStorageKey), "behavioural");
  assert.match(defaultView.text("pathway-status"), /Behavioural Research/);
  const storedView = renderView("?preview=1&date=2026-10-23", { storage: { [COURSE_CONFIG.pathwayStorageKey]: "archival" } });
  assert.equal(storedView.nodes.get("pathway-select").value, "archival");
  const noStorage = renderPreview("2026-10-23", null, { storageThrows: true });
  assert.equal(noStorage.nodes.get("pathway-select").value, "not-confirmed");
  assert.ok(noStorage.text("position-title"));
});

test("November 12 and 13 previews keep the timeline stable while pathway detail branches", function () {
  const expectations = {
    "not-confirmed": [/Pathway Not Yet Confirmed/, /must confirm the project pathway before pathway-dependent work can proceed/i],
    behavioural: [/Formal Ethics Submission, where required/, /12:00 PM/, /Submission is not approval/i, /Working date, pending final committee confirmation/i],
    archival: [/Archival Conditions \/ Review in Progress/, /Access is not authority/i, /No universal REB-style archival submission or approval process/i],
    "program-evaluation": [/Project-Readiness Confirmation/, /Ready to Proceed.*Ready with Conditions.*Not Yet Ready/i, /readiness may be partial/i, /not formal ethics approval/i],
    "no-formal-review": [/Project-Readiness Confirmation/, /Ready to Proceed.*Ready with Conditions.*Not Yet Ready/i, /No formal review does not mean unrestricted use/i, /unresolved conditions can keep specific work on hold/i]
  };
  ["2026-11-12", "2026-11-13"].forEach(function (date) {
    Object.entries(expectations).forEach(function (entry) {
      const view = renderPreview(date, entry[0]);
      const timeline = view.text("full-timeline");
      const combined = [view.text("next-event"), view.text("next-gate"), view.text("pathway-status"), view.text("pathway-guidance"), view.text("dependency-list")].join(" ");
      assert.match(timeline, /November 13, 2026Final Ethics \/ Project-Readiness GateProject gate/i, date + " " + entry[0]);
      assert.doesNotMatch(timeline, /Pathway Confirmation Required|Formal Ethics Submission|Archival Conditions \/ Review in Progress|Project-Readiness Confirmation/, date + " " + entry[0]);
      assert.match(view.text("next-gate"), /Final Ethics \/ Project-Readiness Gate.*Project gate/i, date + " " + entry[0]);
      if (date === "2026-11-13") assert.match(view.text("next-event"), /Final Ethics \/ Project-Readiness Gate/i, entry[0]);
      entry[1].forEach(function (pattern) { assert.match(combined, pattern, date + " " + entry[0]); });
      if (entry[0] !== "behavioural") assert.doesNotMatch(combined, /Formal Ethics Submission/, date + " " + entry[0]);
      ["position-title", "next-event", "next-gate", "by-now-list", "right-now-list", "coming-up-list", "pathway-status", "dependency-list", "journey-list", "journey-detail", "resources-list", "upcoming-list", "full-timeline"].forEach(function (id) {
        assert.ok(view.text(id).length > 0, date + " " + entry[0] + " left #" + id + " blank");
      });
    });
  });
});

test("pathway-specific resources show common plus selected-route materials", function () {
  const notConfirmed = selectedResourceIds("2026-10-23", "not-confirmed");
  assert.ok(notConfirmed.includes("ethicsReadinessDevelopment"));
  ["behaviouralPathway", "archivalPathway", "programEvaluationPathway", "noFormalReviewPathway"].forEach(function (id) { assert.equal(notConfirmed.includes(id), false, id); });
  assert.ok(selectedResourceIds("2026-10-23", "behavioural").includes("behaviouralPathway"));
  assert.ok(selectedResourceIds("2026-10-23", "archival").includes("archivalPermissions"));
  assert.ok(selectedResourceIds("2026-10-23", "program-evaluation").includes("projectReadinessRecord"));
  assert.ok(selectedResourceIds("2026-10-23", "no-formal-review").includes("projectReadinessRecord"));
  assert.ok(selectedResourceIds("2026-11-13", "program-evaluation").includes("programEvaluationPathway"));
  assert.ok(selectedResourceIds("2026-11-13", "no-formal-review").includes("noFormalReviewPathway"));
});

test("Placement and early Proposal resources follow the immediate calendar step without duplicates", function () {
  const expected = {
    "2026-09-10": ["personalProfile", "positionalityGuidance", "positionalityStatement", "placementMatching"],
    "2026-09-15": ["preparingPartnerFair", "partnerFair", "positionalityGuidance", "positionalityStatement"],
    "2026-09-18": ["preliminaryInterests", "targetedInterviews", "resumeCoverLetter", "placementMatching"],
    "2026-09-23": ["targetedInterviews", "finalPlacementRanking", "placementMatching"],
    "2026-09-25": ["placementResults", "scopingProject"],
    "2026-10-02": ["placementResults", "scopingProject"],
    "2026-10-08": ["scopingProject"]
  };
  Object.entries(expected).forEach(function (entry) {
    const ids = selectedResourceIds(entry[0], "not-confirmed");
    entry[1].forEach(function (id) { assert.ok(ids.includes(id), entry[0] + " should include " + id); });
    assert.equal(new Set(ids).size, ids.length, entry[0] + " contains a duplicate resource");
    assert.ok(ids.length >= 2 && ids.length <= COURSE_CONFIG.resourceDisplayLimit, entry[0]);
  });
});

test("working and missing resource links retain distinct accessible states", function () {
  const original = COURSE_RESOURCES.researchEthics.url;
  COURSE_RESOURCES.researchEthics.url = "https://canvas.ubc.ca/courses/194371/pages/research-ethics";
  const view = renderPreview("2026-10-14", "not-confirmed");
  COURSE_RESOURCES.researchEthics.url = original;
  const cards = view.nodes.get("resources-list").children.map(function (item) { return item.children[0]; });
  assert.equal(cards[0].tagName, "a");
  assert.equal(cards[0].target, "_blank");
  assert.equal(cards[0].rel, "noopener noreferrer");
  assert.match(cards[0].attributes["aria-label"], /opens in a new tab/i);
  assert.ok(cards.some(function (card) { return card.tagName === "div" && /Canvas link to be added/.test(card.textContent); }));
});

test("Term 2 notice and limited timeline render from centralized data", function () {
  const view = renderPreview("2027-01-30", "behavioural");
  assert.equal(view.nodes.get("term2-notice").hidden, false);
  assert.equal(view.text("term2-notice"), COURSE_CONFIG.term2ScheduleNotice);
  const timeline = view.text("full-timeline");
  assert.doesNotMatch(timeline, /Deliverable Studio|Presentation Workshop|Draft Slides|Handover Clinic/);
});

test("Full Course Timeline synchronizes disclosure state", function () {
  const view = renderPreview("2026-11-13", "program-evaluation");
  const details = view.nodes.get("timeline-details");
  const toggle = view.nodes.get("timeline-toggle");
  const action = view.nodes.get("timeline-action");
  assert.equal(toggle.attributes["aria-expanded"], "false");
  details.open = true; details.listeners.toggle();
  assert.equal(toggle.attributes["aria-expanded"], "true");
  assert.equal(action.textContent, "Hide dates −");
});

test("journey uses earlier/current/future language without implying permanent completion", function () {
  const view = renderPreview("2026-10-23", "behavioural");
  const journey = view.text("journey-list");
  assert.match(journey, /Orientation.*Earlier calendar stage.*Ethics \/ Readiness Development.*You are here.*Research Foundation.*Upcoming/i);
  assert.doesNotMatch(journey, /Calendar stage complete/i);
});

test("FNIS logo fallback remains mutually exclusive", function () {
  const view = renderPreview("2026-09-10");
  const logo = view.nodes.get("fnis-logo");
  const fallback = view.nodes.get("fnis-logo-fallback");
  logo.naturalWidth = 447; logo.listeners.load();
  assert.equal(logo.hidden, false);
  assert.equal(fallback.removed, true);
  const failed = renderPreview("2026-09-10");
  failed.nodes.get("fnis-logo").listeners.error();
  assert.equal(failed.nodes.get("fnis-logo").hidden, true);
  assert.equal(failed.nodes.get("fnis-logo-fallback").hidden, false);
});

test("the supplied FNIS logo asset is installed as a valid PNG", function () {
  const logoPath = path.join(projectRoot, "assets/fnis-logo.png");
  assert.equal(fs.existsSync(logoPath), true);
  const bytes = fs.readFileSync(logoPath);
  assert.ok(bytes.length > 8);
  assert.equal(bytes.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
});

test("student-facing branding uses the exact FNIS product identity", function () {
  const html = fs.readFileSync(path.join(projectRoot, "index.html"), "utf8");
  assert.match(html, /<title>FNIS 400 Practicum Course Navigator<\/title>/);
  assert.match(html, /<h1>FNIS 400 Practicum Course Navigator<\/h1>/);
  assert.match(html, /First Nations and Indigenous Studies/);
  assert.match(html, /2026–27 Community Research Practicum/);
  assert.match(html, /data-src="assets\/fnis-logo\.png\?v=20260907-artwork1"/);
  assert.match(html, /alt="First Nations and Indigenous Studies logo"/);
  assert.doesNotMatch(html, /cis-mark|Institute for Critical Indigenous Studies/i);
  assert.equal(COURSE_CONFIG.title, "FNIS 400 Practicum Course Navigator");
});

test("prohibited claims and obsolete architecture are absent", function () {
  const contents = [fs.readFileSync(path.join(projectRoot, "js/course-data.js"), "utf8"), fs.readFileSync(path.join(projectRoot, "js/app.js"), "utf8")].join("\n");
  assert.doesNotMatch(contents, /ETHICS COMPLETE/i);
  assert.doesNotMatch(contents, /Deliverable Prototype/i);
  assert.doesNotMatch(contents, /Ethics Checkpoint 2/i);
  assert.doesNotMatch(contents, /October 16[^\n]*Project Proposal/i);
});

test("the application has no runtime network calls or external dependencies", function () {
  ["index.html", "css/styles.css", "js/app.js"].forEach(function (relativePath) {
    const contents = fs.readFileSync(path.join(projectRoot, relativePath), "utf8");
    assert.doesNotMatch(contents, /https?:\/\//i, relativePath);
  });
  ["js/course-data.js", "js/app.js"].forEach(function (relativePath) {
    const contents = fs.readFileSync(path.join(projectRoot, relativePath), "utf8");
    assert.doesNotMatch(contents, /\b(fetch|XMLHttpRequest|WebSocket)\s*\(/, relativePath);
  });
});

test("mobile preview labels do not override the visually hidden utility", function () {
  const css = fs.readFileSync(path.join(projectRoot, "css/styles.css"), "utf8");
  assert.match(css, /\.preview-controls label:not\(\.visually-hidden\)\s*\{\s*width:\s*100%/);
  assert.doesNotMatch(css, /\.preview-controls label\s*\{\s*width:\s*100%/);
});

test("page and panel surfaces use the cool FNIS neutral system", function () {
  const css = fs.readFileSync(path.join(projectRoot, "css/styles.css"), "utf8");
  assert.match(css, /--fnis-red:\s*#A5273C/i);
  assert.match(css, /--fnis-teal:\s*#1A3C40/i);
  assert.match(css, /--fnis-wine:\s*#3C1820/i);
  assert.match(css, /--fnis-white:\s*#FFFFFF/i);
  assert.match(css, /--page-bg:\s*#F5F7F7/i);
  assert.match(css, /--surface:\s*#FFFFFF/i);
  assert.match(css, /--surface-soft:\s*#EEF2F2/i);
  assert.match(css, /--border:\s*#CDD5D5/i);
  assert.match(css, /--text:\s*#263235/i);
  assert.match(css, /--text-muted:\s*#596568/i);
  assert.match(css, /--paper:\s*var\(--page-bg\)/);
  assert.match(css, /--line:\s*var\(--border\)/);
  assert.doesNotMatch(css, /cis-turquoise|cis-charcoal|#3FC1CE|#5FC8CD|#58595E|#f6f4ef|#f0f0ed/i);
});

console.log("\n" + passed + " tests passed.");
