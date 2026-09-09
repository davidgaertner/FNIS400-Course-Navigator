"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const data = require("../js/course-data.js");
const {
  COURSE_CONFIG, COURSE_MODULES, COURSE_ASSESSMENTS, COURSE_RESOURCES, COURSE_RESOURCE_CONTEXTS,
  PROJECT_PATHWAYS, PROJECT_STATE_DEFINITIONS, DEFAULT_PROJECT_STATE, ETHICS_STATUS_PRESENTATION, COURSE_STAGES, COURSE_EVENTS,
  WEEKLY_DESTINATIONS, JOURNEY_STAGES, utils
} = data;
const projectRoot = path.resolve(__dirname, "..");
let passed = 0;

function test(name, fn) {
  try { fn(); passed += 1; console.log("✓ " + name); }
  catch (error) { console.error("✗ " + name); throw error; }
}
function event(id) { return COURSE_EVENTS.find(function (item) { return item.id === id; }); }
function state(overrides) { return Object.assign({}, DEFAULT_PROJECT_STATE, overrides || {}); }
function resourceIds(date, pathway) { return utils.getResourcesForStage(utils.getStage(date), date, pathway).map(function (item) { return item.id; }); }

class FakeNode {
  constructor(tagName) {
    this.tagName = tagName; this.children = []; this.dataset = {}; this.attributes = {}; this.listeners = {};
    this.className = ""; this.hidden = false; this.naturalWidth = 0; this.removed = false; this.open = false; this.value = ""; this._text = "";
  }
  get textContent() { return this._text + this.children.map(function (child) { return child.textContent; }).join(""); }
  set textContent(value) { this._text = value == null ? "" : String(value); this.children = []; }
  appendChild(child) { this.children.push(child); return child; }
  replaceChildren() { this._text = ""; this.children = Array.from(arguments); }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  addEventListener(name, handler) { this.listeners[name] = handler; }
  remove() { this.removed = true; }
}

function renderPreview(date, pathway, stateOverrides, options) {
  const html = fs.readFileSync(path.join(projectRoot, "index.html"), "utf8");
  const nodes = new Map();
  Array.from(html.matchAll(/<([a-z0-9-]+)[^>]*\sid="([^"]+)"[^>]*>/gi)).forEach(function (match) {
    const node = new FakeNode(match[1].toLowerCase()); node.hidden = /\shidden(?:\s|>|$)/i.test(match[0]); nodes.set(match[2], node);
  });
  nodes.get("fnis-logo").dataset.src = "assets/fnis-logo.png?v=20260907-artwork1";
  const initial = Object.assign({}, stateOverrides || {});
  const storage = new Map();
  if (options && options.storedState) storage.set(COURSE_CONFIG.projectStateStorageKey, JSON.stringify(options.storedState));
  if (options && options.storedPathway) storage.set(COURSE_CONFIG.pathwayStorageKey, options.storedPathway);
  const localStorage = {
    getItem: function (key) { if (options && options.storageThrows) throw new Error("unavailable"); return storage.has(key) ? storage.get(key) : null; },
    setItem: function (key, value) { if (options && options.storageThrows) throw new Error("unavailable"); storage.set(key, String(value)); }
  };
  const params = new URLSearchParams();
  if (!(options && options.studentMode)) {
    params.set("preview", "1"); params.set("date", date); params.set("pathway", pathway || "not-confirmed");
    Object.keys(initial).forEach(function (key) { params.set(key, initial[key]); });
  }
  const document = {
    getElementById: function (id) { return nodes.get(id) || null; },
    createElement: function (tag) { return new FakeNode(tag); },
    createTextNode: function (text) { const node = new FakeNode("#text"); node.textContent = text; return node; }
  };
  const window = {
    FNIS400: data, localStorage: localStorage,
    location: { search: "?" + params.toString(), href: "file:///index.html?" + params.toString() },
    history: { replaceState: function (_a, _b, url) { window.lastUrl = String(url); } }
  };
  const context = vm.createContext({ window: window, document: document, URL: URL, URLSearchParams: URLSearchParams, Intl: Intl, Date: Date, JSON: JSON, console: console });
  vm.runInContext(fs.readFileSync(path.join(projectRoot, "js/app.js"), "utf8"), context, { filename: "js/app.js" });
  return { nodes: nodes, storage: storage, window: window, text: function (id) { return nodes.get(id).textContent.replace(/\s+/g, " ").trim(); } };
}

test("event and module IDs are unique and all dates are valid", function () {
  assert.equal(new Set(COURSE_EVENTS.map(function (item) { return item.id; })).size, COURSE_EVENTS.length);
  assert.equal(new Set(COURSE_MODULES.map(function (item) { return item.id; })).size, COURSE_MODULES.length);
  COURSE_EVENTS.forEach(function (item) {
    if (item.date) assert.equal(utils.isValidDate(item.date), true, item.id);
    if (item.endDate) { assert.equal(utils.isValidDate(item.endDate), true, item.id); assert.ok(item.endDate >= item.date, item.id); }
  });
});

test("course events sort chronologically with stable same-day ordering", function () {
  const sorted = utils.sortedDatedEvents();
  for (let i = 1; i < sorted.length; i += 1) assert.ok(sorted[i - 1].date <= sorted[i].date);
  assert.deepEqual(sorted.filter(function (item) { return item.date === "2026-11-02"; }).map(function (item) { return item.id; }), ["ethics-assembly-tutorial", "ethics-readiness-package-draft", "proposal-to-partner"]);
});

test("broad course stages are contiguous and every instructional date maps once", function () {
  for (let index = 1; index < COURSE_STAGES.length; index += 1) assert.equal(utils.daysBetween(COURSE_STAGES[index - 1].end, COURSE_STAGES[index].start), 1);
  for (let day = utils.dateOrdinal("2026-09-09"); day <= utils.dateOrdinal("2027-04-12"); day += 1) {
    const iso = new Date(day * 86400000).toISOString().slice(0, 10);
    assert.ok(utils.getStage(iso), iso);
  }
  assert.deepEqual(COURSE_STAGES.slice(1, 6).map(function (item) { return item.title; }), ["Placement & Matching", "Partnership & Scoping", "Project Development + Ethics / Readiness", "Research Foundation", "Term 1 Transition"]);
});

test("calendar stage and project state are structurally separate", function () {
  assert.deepEqual(Object.keys(PROJECT_STATE_DEFINITIONS), ["scope", "proposal", "ethics", "board"]);
  assert.equal(utils.getStage("2026-11-04").id, "project-development");
  assert.equal(utils.normalizeProjectState({ scope: "nonsense" }).scope, "emerging");
  assert.equal(COURSE_STAGES.some(function (stage) { return Object.prototype.hasOwnProperty.call(stage, "completed"); }), false);
});

test("the five pathway choices represent exactly three conceptual pathways", function () {
  assert.equal(PROJECT_PATHWAYS.behavioural.conceptualPathway, "Behavioural Research");
  assert.equal(PROJECT_PATHWAYS.archival.conceptualPathway, "Archival Research");
  assert.equal(PROJECT_PATHWAYS["program-evaluation"].conceptualPathway, "Research that does not require formal review");
  assert.equal(PROJECT_PATHWAYS["no-formal-review"].conceptualPathway, "Research that does not require formal review");
  assert.equal(new Set(Object.values(PROJECT_PATHWAYS).map(function (item) { return item.conceptualPathway; }).filter(Boolean)).size, 3);
});

test("the pathway selector groups only routes that do not require formal review", function () {
  const html = fs.readFileSync(path.join(projectRoot, "index.html"), "utf8");
  const selector = html.match(/<select id="pathway-select"[\s\S]*?<\/select>/)[0];
  assert.doesNotMatch(selector, /<optgroup label="(?:Formal pathway|Formal review|REB pathway)">/i);
  assert.match(selector, /<option value="behavioural">Behavioural Research<\/option><option value="archival">Archival Research<\/option>/);
  assert.match(selector, /<optgroup label="Research that does not require formal review">[\s\S]*Program Evaluation[\s\S]*No Formal Review[\s\S]*<\/optgroup>/);
});

test("the revised Term 1 calendar preserves every key date and type", function () {
  const expected = {
    "labour-day": ["2026-09-07", "no-class"], "course-orientation": ["2026-09-09", "seminar"],
    "personal-profile-due": ["2026-09-14", "deadline"], "partner-fair": ["2026-09-16", "seminar"],
    "preliminary-placement-interests": ["2026-09-18", "deadline"], "common-research-methods": ["2026-09-23", "seminar"],
    "final-placement-ranking": ["2026-09-24", "deadline"], "placement-confirmation": ["2026-09-25", "milestone"],
    "beginning-partnership-scoping": ["2026-09-28", "tutorial"], "truth-reconciliation-day": ["2026-09-30", "no-class"],
    "bullseye-core-commitment": ["2026-10-05", "tutorial"], "scope-snapshot-proposals": ["2026-10-07", "seminar"],
    thanksgiving: ["2026-10-12", "no-class"], "research-ethics-practicum": ["2026-10-14", "seminar"],
    "project-board-working-session": ["2026-10-19", "tutorial"], "ethics-pathways-readiness": ["2026-10-21", "seminar"],
    "checkpoint-1": ["2026-10-23", "milestone"], "ethics-readiness-tutorial": ["2026-10-26", "tutorial"],
    "case-conference-b": ["2026-10-27", "support"], "complete-proposal-draft": ["2026-10-28", "milestone"],
    "proposal-clearance": ["2026-10-29", "milestone"], "proposal-revisions": ["2026-10-30", "milestone"],
    "ethics-assembly-tutorial": ["2026-11-02", "tutorial"], "final-signed-proposal": ["2026-11-04", "project-gate"],
    "substantive-review-cutoff": ["2026-11-06", "milestone"], "midterm-break": ["2026-11-09", "no-class"],
    "remembrance-day": ["2026-11-11", "no-class"], "final-assembly-readiness": ["2026-11-12", "milestone"],
    "november-pathway-gate": ["2026-11-13", "project-gate"], "research-foundation-tutorial": ["2026-11-16", "tutorial"],
    "xwi7xwa-preparation": ["2026-11-17", "deadline"], "xwi7xwa-seminar": ["2026-11-18", "seminar"],
    "research-foundation-tutorial-2": ["2026-11-23", "tutorial"], "research-foundation-working-session": ["2026-11-25", "seminar"],
    "research-foundation-provisos": ["2026-11-30", "tutorial"], "term-one-wrap": ["2026-12-02", "seminar"], "term-one-transition": ["2026-12-07", "tutorial"]
  };
  Object.entries(expected).forEach(function (entry) { assert.deepEqual([event(entry[0]).date, event(entry[0]).type], entry[1], entry[0]); });
  assert.equal(COURSE_EVENTS.some(function (item) { return item.date === "2026-12-09"; }), false);
});

test("assessment weights and key project gates remain correct", function () {
  assert.equal(event("final-signed-proposal").weight, "15%");
  assert.equal(event("deliverable-milestone").weight, "10%");
  assert.equal(event("community-research-deliverables").weight, "30%");
  assert.equal(event("community-research-presentation").weight, "10%");
  ["final-signed-proposal", "november-pathway-gate", "proviso-response", "partner-review-draft", "community-research-deliverables"].forEach(function (id) { assert.equal(event(id).gate, true, id); });
  assert.equal(event("deliverable-milestone").gate, undefined);
  assert.equal(event("placement-confirmation").gate, undefined);
});

test("November 13 provisional status has one authoritative switch", function () {
  assert.equal(event("november-pathway-gate").provisional, true);
  assert.equal(COURSE_EVENTS.filter(function (item) { return item.provisional; }).length, 1);
  assert.equal(COURSE_CONFIG.provisionalLabel, "Pending committee confirmation");
  assert.doesNotMatch(WEEKLY_DESTINATIONS.find(function (item) { return item.from === "2026-11-09"; }).text, /Nov(?:ember)?\.? 13/i);
});

test("finite and open-ended windows are condition-aware", function () {
  assert.ok(utils.getActiveWindows("2026-09-23", state()).some(function (item) { return item.id === "two-way-interviews"; }));
  assert.ok(utils.getActiveWindows("2026-10-10", state()).some(function (item) { return item.id === "partner-scope-check"; }));
  assert.ok(utils.getActiveWindows("2026-10-26", state()).some(function (item) { return item.id === "partner-ethics-check-in"; }));
  assert.ok(utils.getActiveWindows("2026-10-05", state({ scope: "emerging" })).some(function (item) { return item.id === "first-partner-meeting"; }));
  assert.equal(utils.getActiveWindows("2026-10-05", state({ scope: "partner-checked" })).some(function (item) { return item.id === "first-partner-meeting"; }), false);
  assert.ok(utils.getActiveWindows("2026-12-07", state({ ethics: "provisos" })).some(function (item) { return item.id === "proviso-response"; }));
  assert.equal(utils.getActiveWindows("2026-12-07", state({ ethics: "ready" })).some(function (item) { return item.id === "proviso-response"; }), false);
});

test("DO NOW respects blocker, local state, window, and event priority", function () {
  const blocked = utils.getDoNow("2026-10-26", state({ proposal: "revisions-required", board: "not-activated" }), "not-confirmed");
  assert.equal(blocked.length, 3);
  assert.match(blocked[0].text, /Confirm.*ethics pathway/i);
  assert.ok(blocked.some(function (item) { return /Proposal revisions/i.test(item.text); }));
  const advancedDate = utils.getDoNow("2026-10-19", state({ scope: "emerging", proposal: "not-started" }), "not-confirmed");
  assert.ok(advancedDate.some(function (item) { return /first partner meeting/i.test(item.text); }));
  const provisos = utils.getDoNow("2026-11-30", state({ ethics: "provisos" }), "behavioural");
  assert.match(provisos[0].text, /Respond to each proviso/i);
  const approved = utils.getDoNow("2026-11-30", state({ proposal: "final-signed", ethics: "ready", board: "active" }), "behavioural");
  assert.equal(approved.some(function (item) { return /Research Ethics Provisos module opens|Address every proviso/i.test(item.text); }), false);
  const submitted = utils.getDoNow("2026-11-13", state({ proposal: "final-signed", ethics: "submitted-determined", board: "active" }), "behavioural");
  assert.equal(submitted.some(function (item) { return /Formal Ethics Submission \/ Project-Readiness Determination/i.test(item.text); }), false);
  const gateWeek = utils.getDoNow("2026-11-03", state({ scope: "partner-checked", proposal: "drafting", ethics: "quality-control", board: "active" }), "behavioural");
  assert.equal(gateWeek[0].source, "Project gate");
});

test("before-proceed guidance branches by pathway and state", function () {
  assert.equal(utils.getBeforeProceed("2026-09-28", state(), "not-confirmed").label, "Project boundary");
  assert.match(utils.getBeforeProceed("2026-10-26", state({ ethics: "developing" }), "behavioural").text, /formal ethics approval cannot begin until approval/i);
  assert.match(utils.getBeforeProceed("2026-10-26", state({ ethics: "developing" }), "no-formal-review").text, /Pathway confirmation alone is not permission/i);
  assert.match(utils.getBeforeProceed("2026-10-26", state({ ethics: "developing" }), "archival").text, /Possession is not permission.*Access is not authority/i);
  assert.match(utils.getBeforeProceed("2026-11-30", state({ ethics: "provisos" }), "behavioural").text, /Blocked does not mean behind/i);
  assert.equal(utils.getBeforeProceed("2026-11-30", state({ ethics: "ready" }), "behavioural"), null);
  assert.equal(utils.getBeforeProceed("2026-11-30", state({ ethics: "ready-conditions" }), "no-formal-review").status, "Ready with conditions");
});

test("ethics status labels translate the same stored value by pathway", function () {
  function ethicsItem(pathway, ethics) {
    return utils.getProjectSummary("2026-11-13", state({ ethics: ethics }), pathway).find(function (item) { return item.label === "Ethics / Readiness"; });
  }
  assert.equal(ethicsItem("behavioural", "submitted-determined").value, "Formal ethics submission made");
  assert.notEqual(ethicsItem("behavioural", "submitted-determined").value, "Formal approval received");
  assert.equal(ethicsItem("behavioural", "ready").value, "Formal approval received");
  assert.equal(ethicsItem("program-evaluation", "submitted-determined").value, "Project-Readiness determination made");
  assert.equal(ethicsItem("no-formal-review", "ready-conditions").value, "Ready with Conditions");
  assert.equal(ethicsItem("archival", "developing").value, "Archival ethics / permissions in development");
  assert.doesNotMatch(ethicsItem("archival", "ready").value, /formal approval/i);
});

test("ethics selector options are pathway-sensitive", function () {
  const behavioural = renderPreview("2026-10-21", "behavioural", { ethics: "developing" });
  const behaviouralOptions = behavioural.nodes.get("ethics-select").children.map(function (option) { return [option.value, option.textContent]; });
  assert.ok(behaviouralOptions.some(function (item) { return item[1] === "Formal ethics submission made"; }));
  assert.equal(behaviouralOptions.some(function (item) { return item[0] === "ready-conditions"; }), false);
  const noFormal = renderPreview("2026-10-21", "no-formal-review", { ethics: "developing" });
  const noFormalOptions = noFormal.nodes.get("ethics-select").children.map(function (option) { return [option.value, option.textContent]; });
  assert.ok(noFormalOptions.some(function (item) { return item[1] === "Project-Readiness determination made"; }));
  assert.ok(noFormalOptions.some(function (item) { return item[1] === "Ready with Conditions"; }));
  assert.equal(noFormalOptions.some(function (item) { return item[0] === "provisos"; }), false);
  const archivalLabels = utils.getEthicsStatusOptions("archival").map(function (item) { return item.label; }).join(" ");
  assert.match(archivalLabels, /Applicable review \/ readiness step complete/);
  assert.doesNotMatch(archivalLabels, /Formal ethics submission|Formal approval|Project-Readiness determination/);
  assert.equal(ETHICS_STATUS_PRESENTATION.behavioural.allowed.includes("ready-conditions"), false);
  ["behavioural", "archival", "program-evaluation", "no-formal-review"].forEach(function (pathway) {
    assert.equal(utils.getEthicsStatusOptions(pathway).some(function (item) { return item.value === "pathway-not-confirmed"; }), false, pathway);
  });
});

test("confirming or unconfirming a pathway normalizes only Ethics and Readiness", function () {
  [
    ["behavioural", "Ethics materials in development"],
    ["program-evaluation", "Project-Readiness materials in development"],
    ["archival", "Archival ethics / permissions in development"]
  ].forEach(function (scenario) {
    const view = renderPreview("2026-10-26", "not-confirmed", { scope: "partner-checked", proposal: "drafting", ethics: "pathway-not-confirmed", board: "active" });
    view.nodes.get("pathway-select").listeners.change({ target: { value: scenario[0] } });
    const stored = JSON.parse(view.storage.get(COURSE_CONFIG.projectStateStorageKey));
    assert.equal(stored.ethics, "developing", scenario[0]);
    assert.equal(stored.scope, "partner-checked");
    assert.equal(stored.proposal, "drafting");
    assert.equal(stored.board, "active");
    assert.match(view.text("project-summary-list"), new RegExp(scenario[1].replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.equal(view.nodes.get("ethics-select").value, "developing");
  });

  const unconfirmed = renderPreview("2026-10-26", "behavioural", { scope: "partner-checked", proposal: "drafting", ethics: "developing", board: "active" });
  unconfirmed.nodes.get("pathway-select").listeners.change({ target: { value: "not-confirmed" } });
  const stored = JSON.parse(unconfirmed.storage.get(COURSE_CONFIG.projectStateStorageKey));
  assert.equal(stored.ethics, "pathway-not-confirmed");
  assert.equal(stored.scope, "partner-checked");
  assert.equal(stored.proposal, "drafting");
  assert.equal(stored.board, "active");
  assert.equal(unconfirmed.nodes.get("ethics-select").value, "pathway-not-confirmed");
  assert.match(unconfirmed.text("project-summary-list"), /Pathway not confirmed/);
});

test("pathway switching safely normalizes an irrelevant ethics state", function () {
  const view = renderPreview("2026-11-13", "no-formal-review", { scope: "partner-checked", proposal: "final-signed", ethics: "ready-conditions", board: "active" });
  view.nodes.get("pathway-select").listeners.change({ target: { value: "behavioural" } });
  assert.equal(view.nodes.get("ethics-select").value, "developing");
  assert.doesNotMatch(view.text("project-summary-list"), /Ready with Conditions|Formal approval received/);
  assert.match(view.text("project-summary-list"), /Ethics materials in development/);
  const stored = JSON.parse(view.storage.get(COURSE_CONFIG.projectStateStorageKey));
  assert.equal(stored.ethics, "developing");
  assert.equal(stored.scope, "partner-checked");
  assert.equal(stored.proposal, "final-signed");
  assert.equal(stored.board, "active");
  assert.equal(utils.transitionProjectStateForPathway(state({ ethics: "submitted-determined" }), "behavioural", "no-formal-review").ethics, "developing");
  assert.equal(utils.transitionProjectStateForPathway(state({ ethics: "ready" }), "no-formal-review", "archival").ethics, "developing");
  assert.equal(utils.transitionProjectStateForPathway(state({ ethics: "quality-control" }), "behavioural", "archival").ethics, "quality-control");
  assert.equal(utils.transitionProjectStateForPathway(state({ ethics: "provisos" }), "behavioural", "program-evaluation").ethics, "developing");
});

test("stale stored and preview pathway contradictions normalize on entry", function () {
  const stored = renderPreview("2026-10-26", null, {}, {
    studentMode: true,
    storedPathway: "behavioural",
    storedState: { scope: "partner-checked", proposal: "final-signed", ethics: "pathway-not-confirmed", board: "active" }
  });
  const repaired = JSON.parse(stored.storage.get(COURSE_CONFIG.projectStateStorageKey));
  assert.equal(repaired.ethics, "developing");
  assert.equal(repaired.scope, "partner-checked");
  assert.equal(repaired.proposal, "final-signed");
  assert.equal(repaired.board, "active");
  assert.equal(stored.nodes.get("ethics-select").value, "developing");
  assert.ok(stored.nodes.get("ethics-select").children.some(function (option) { return option.value === "developing" && option.textContent === "Ethics materials in development"; }));

  const preview = renderPreview("2026-10-26", "behavioural", { ethics: "pathway-not-confirmed" });
  assert.equal(preview.nodes.get("ethics-select").value, "developing");
  assert.match(preview.text("project-summary-list"), /Ethics materials in development/);
  assert.equal(new URL(preview.window.lastUrl).searchParams.get("ethics"), "developing");

  const unconfirmed = renderPreview("2026-10-26", "not-confirmed", { ethics: "ready" });
  assert.equal(unconfirmed.nodes.get("ethics-select").value, "pathway-not-confirmed");
  assert.match(unconfirmed.text("project-summary-list"), /Pathway not confirmed/);
  assert.doesNotMatch(unconfirmed.text("project-summary-list"), /Ready to Proceed|Formal approval received/);
  assert.equal(new URL(unconfirmed.window.lastUrl).searchParams.get("ethics"), "pathway-not-confirmed");
});

test("normalization refreshes pathway-specific Before You Proceed guidance", function () {
  const unconfirmed = renderPreview("2026-10-26", "not-confirmed", { ethics: "ready" });
  assert.equal(unconfirmed.text("before-proceed-label"), "Project boundary");

  const behavioural = renderPreview("2026-10-26", "behavioural", { ethics: "pathway-not-confirmed" });
  assert.match(behavioural.text("before-proceed-text"), /formal ethics approval cannot begin until approval/i);
  assert.equal(behavioural.text("before-proceed-status"), "Blocked");

  const program = renderPreview("2026-10-26", "program-evaluation", { ethics: "pathway-not-confirmed" });
  assert.match(program.text("before-proceed-text"), /Project-Readiness status.*permission/i);
  assert.doesNotMatch(program.text("before-proceed-text"), /formal ethics approval/i);
  assert.equal(program.text("before-proceed-status"), "Blocked");
});

test("the lean local state model does not add Not Yet Ready", function () {
  assert.equal(Object.prototype.hasOwnProperty.call(PROJECT_STATE_DEFINITIONS.ethics.values, "not-ready"), false);
  Object.values(ETHICS_STATUS_PRESENTATION).forEach(function (presentation) {
    assert.equal(presentation.allowed.includes("not-ready"), false);
    assert.doesNotMatch(Object.values(presentation.labels).join(" "), /Not Yet Ready/i);
  });
  const studentFiles = ["index.html", "js/course-data.js", "js/app.js"].map(function (file) { return fs.readFileSync(path.join(projectRoot, file), "utf8"); }).join("\n");
  assert.doesNotMatch(studentFiles, /\bnot-ready\b|Not Yet Ready/i);
});

test("calendar dates never auto-advance local scope or proposal state", function () {
  const october = utils.getProjectSummary("2026-10-21", state({ scope: "emerging" }), "behavioural");
  assert.equal(october.find(function (item) { return item.label === "Scope"; }).value, "Emerging");
  const november = utils.getProjectSummary("2026-11-04", state({ proposal: "drafting", ethics: "developing" }), "behavioural");
  assert.equal(november.find(function (item) { return item.label === "Project Proposal"; }).value, "Drafting");
});

test("NO CLASS events do not become DO NOW actions", function () {
  ["2026-09-07", "2026-09-30", "2026-10-12", "2026-11-09", "2026-11-11"].forEach(function (date) {
    assert.equal(utils.getDoNow(date, state(), "not-confirmed").some(function (item) { return /No class/i.test(item.source) || /No class/i.test(item.text); }), false, date);
  });
});

test("date-aware resources stay focused and pathway-specific", function () {
  const dates = {
    "2026-09-10": ["personalProfile", "positionalityGuidance", "placementMatching"],
    "2026-09-15": ["preparingPartnerFair", "partnerFair", "positionalityGuidance"],
    "2026-09-18": ["preliminaryInterests", "targetedInterviews", "resumeCoverLetter"],
    "2026-09-23": ["targetedInterviews", "finalPlacementRanking", "placementMatching"],
    "2026-09-25": ["placementResults", "scopingProject"], "2026-10-02": ["placementResults", "scopingProject"], "2026-10-08": ["scopingProject"]
  };
  Object.entries(dates).forEach(function (entry) {
    const ids = resourceIds(entry[0], "not-confirmed"); entry[1].forEach(function (id) { assert.ok(ids.includes(id), entry[0] + " needs " + id); });
    assert.ok(ids.length <= COURSE_CONFIG.resourceDisplayLimit); assert.equal(new Set(ids).size, ids.length);
  });
  const behavioural = resourceIds("2026-10-26", "behavioural");
  ["behaviouralPathway", "consentGuidance", "recruitmentGuidance", "behaviouralDataCollection"].forEach(function (id) { assert.ok(behavioural.includes(id), "Behavioural needs " + id); });
  ["archivalPermissions", "participationAgreement", "informationUsePermissions"].forEach(function (id) { assert.equal(behavioural.includes(id), false, "Behavioural must exclude " + id); });

  const archival = resourceIds("2026-10-26", "archival");
  assert.ok(archival.includes("archivalPermissions"));
  ["consentGuidance", "participationAgreement", "informationUsePermissions"].forEach(function (id) { assert.equal(archival.includes(id), false, "Archival must exclude " + id); });

  const program = resourceIds("2026-10-26", "program-evaluation");
  assert.ok(program.includes("participationAgreement"));
  ["consentGuidance", "archivalPermissions", "informationUsePermissions"].forEach(function (id) { assert.equal(program.includes(id), false, "Program Evaluation must exclude " + id); });

  const noFormal = resourceIds("2026-10-26", "no-formal-review");
  assert.ok(noFormal.includes("informationUsePermissions"));
  ["consentGuidance", "archivalPermissions", "participationAgreement"].forEach(function (id) { assert.equal(noFormal.includes(id), false, "No Formal Review must exclude " + id); });
});

test("resource registry contains only surviving canonical Canvas destinations", function () {
  const allowed = new Set(["page", "assignment", "file", "module", "template", "external"]);
  assert.equal(Object.keys(COURSE_RESOURCES).length, 59);
  assert.equal(Object.values(COURSE_RESOURCES).filter(function (resource) { return !resource.url; }).length, 0);
  Object.entries(COURSE_RESOURCES).forEach(function (entry) {
    assert.ok(entry[0]); assert.equal(typeof entry[1].label, "string"); assert.equal(typeof entry[1].url, "string"); assert.ok(allowed.has(entry[1].type));
    assert.match(entry[1].url, /^https:\/\/canvas\.ubc\.ca\/courses\/194371(?:\/|$)/);
  });
  assert.equal(COURSE_RESOURCES.canvasModules.url, "https://canvas.ubc.ca/courses/194371/modules");
  assert.equal(COURSE_RESOURCES.canvasAssignments.url, "https://canvas.ubc.ca/courses/194371/assignments");
  assert.equal(COURSE_RESOURCES.projectBoardReference.url, "https://canvas.ubc.ca/courses/194371/pages/project-board-reference-page");
  assert.equal(COURSE_RESOURCES.projectBoardSetup.url, "https://canvas.ubc.ca/courses/194371/pages/project-board-setup");
  Object.values(COURSE_RESOURCE_CONTEXTS).flat().forEach(function (ref) { assert.ok(COURSE_RESOURCES[ref.resourceId], ref.resourceId); });
});

test("corrected resource labels, types, and authoritative URLs are exact", function () {
  const expected = {
    commonResearchMethods: ["Common Research Methods module", "https://canvas.ubc.ca/courses/194371/modules", "module"],
    bullseyeScope: ["Bullseye / Core Commitment", "https://canvas.ubc.ca/courses/194371/assignments/2535293?module_item_id=9559763", "assignment"],
    scopeSnapshot: ["Building Your Scope Snapshot", "https://canvas.ubc.ca/courses/194371/pages/building-your-scope-snapshot?module_item_id=9560522", "page"],
    partnerScopeCheck: ["Checking the Scope with Your Partner", "https://canvas.ubc.ca/courses/194371/pages/checking-the-scope-with-your-partner?module_item_id=9560529", "page"],
    proposalTimeline: ["Project Proposal Timeline & Review Sequence", "https://canvas.ubc.ca/courses/194371/pages/project-proposal-timeline-and-review-sequence-2?module_item_id=9677349", "page"],
    proposalTemplate: ["Project Proposal Template", "https://canvas.ubc.ca/courses/194371/files/47490356?module_item_id=9533606", "file"],
    proposalExamples: ["Completed Proposal Examples", "https://canvas.ubc.ca/courses/194371/assignments/2548828?module_item_id=9614450", "assignment"],
    researchEthics: ["Research Ethics Timeline & Review Sequence", "https://canvas.ubc.ca/courses/194371/pages/research-ethics-timeline-and-review-sequence?module_item_id=9677346", "page"],
    ethicsPathwayGuide: ["What Determines Your Ethics Pathway?", "https://canvas.ubc.ca/courses/194371/pages/what-determines-your-ethics-pathway?module_item_id=9538895", "page"],
    ethicsReadinessDevelopment: ["Ethics Development & Project Readiness module", "https://canvas.ubc.ca/courses/194371/modules", "module"],
    consentGuidance: ["Consent", "https://canvas.ubc.ca/courses/194371/pages/consent?module_item_id=9539227", "page"],
    recruitmentGuidance: ["Recruitment", "https://canvas.ubc.ca/courses/194371/pages/recruitment?module_item_id=9539320", "page"],
    behaviouralDataCollection: ["Behavioural Research: Data Collection", "https://canvas.ubc.ca/courses/194371/pages/data-collection?module_item_id=9566247", "page"],
    riskVulnerabilityGuide: ["Risk & Vulnerability", "https://canvas.ubc.ca/courses/194371/pages/risk-and-vulnerability?module_item_id=9542640", "page"],
    archivalPermissions: ["Access & Custodianship", "https://canvas.ubc.ca/courses/194371/pages/access-and-custodianship?module_item_id=9568019", "page"],
    participationAgreement: ["Participation & Consent", "https://canvas.ubc.ca/courses/194371/pages/participation-and-consent?module_item_id=9567853", "page"],
    informationUsePermissions: ["Representation, Attribution & Re-Circulation", "https://canvas.ubc.ca/courses/194371/pages/representation-attribution-and-re-circulation?module_item_id=9593343", "page"],
    dataStewardship: ["Data Stewardship", "https://canvas.ubc.ca/courses/194371/pages/data-stewardship?module_item_id=9567857", "page"],
    storingData: ["Storing Your Data", "https://canvas.ubc.ca/courses/194371/pages/storing-your-data?module_item_id=9568013", "page"],
    foundationAssignment: ["Research Foundation Group A", "https://canvas.ubc.ca/courses/194371/assignments/2541335?module_item_id=9584132", "assignment"],
    researchSupportDirectory: ["Finding Resources That Are Useful to the Project", "https://canvas.ubc.ca/courses/194371/pages/finding-resources-that-are-useful-to-the-project?module_item_id=9578715", "page"],
    xwi7xwaPreparation: ["X̱wi7x̱wa Search Preparation", "https://canvas.ubc.ca/courses/194371/assignments/2540228?module_item_id=9579412", "assignment"]
  };
  Object.entries(expected).forEach(function (entry) {
    assert.deepEqual([COURSE_RESOURCES[entry[0]].label, COURSE_RESOURCES[entry[0]].url, COURSE_RESOURCES[entry[0]].type], entry[1], entry[0]);
  });
});

test("removed conceptual resources have no registry or context references", function () {
  const removed = [
    "projectBoard", "proposalAssignment", "proposalChecklist", "proposalSignatureRouting", "researchInstrumentGuidance",
    "projectReadinessRecord", "projectFolderGuide", "foundationExample", "xwi7xwaResources", "milestoneAssignment",
    "milestoneGuidance", "deliverableDesignGuide", "prototypesFeedback", "feedbackCadence", "decisionsChanges",
    "handoverGuidance", "closeoutChecklist", "partnerDraftInstructions", "presentationGuidance", "presentationRubric",
    "communityDeliverable", "communityPresentation"
  ];
  const contextIds = Object.values(COURSE_RESOURCE_CONTEXTS).flat().map(function (ref) { return ref.resourceId; });
  removed.forEach(function (id) { assert.equal(Object.prototype.hasOwnProperty.call(COURSE_RESOURCES, id), false, id); assert.equal(contextIds.includes(id), false, id); });
  ["deliverable-milestone", "partner-review-draft", "community-research-deliverables", "community-research-presentation", "project-closeout-complete"].forEach(function (id) { assert.ok(event(id), id + " event remains"); });
});

test("duplicate Canvas destinations exist only for explicit module-level routing", function () {
  const byUrl = new Map();
  Object.entries(COURSE_RESOURCES).forEach(function (entry) { if (!byUrl.has(entry[1].url)) byUrl.set(entry[1].url, []); byUrl.get(entry[1].url).push(entry[0]); });
  const duplicates = Array.from(byUrl.entries()).filter(function (entry) { return entry[1].length > 1; });
  assert.deepEqual(duplicates, [["https://canvas.ubc.ca/courses/194371/modules", ["canvasModules", "commonResearchMethods", "ethicsReadinessDevelopment"]]]);
});

test("required Term 1 resource views remain focused and fully linked", function () {
  const cases = [
    ["2026-10-05", "not-confirmed", ["bullseyeScope", "scopeSnapshot", "scopingProject"]],
    ["2026-10-07", "not-confirmed", ["proposalTimeline", "proposalTemplate"]],
    ["2026-10-14", "not-confirmed", ["researchEthics", "ethicsPathwayGuide"]],
    ["2026-11-04", "behavioural", ["qualityControlSubmission", "finalAssemblyReadiness", "formalEthicsSubmission"]],
    ["2026-11-18", "behavioural", ["foundationAssignment", "xwi7xwaPreparation", "researchSupportDirectory"]]
  ];
  cases.forEach(function (item) {
    const ids = resourceIds(item[0], item[1]);
    item[2].forEach(function (id) { assert.ok(ids.includes(id), item[0] + " needs " + id); });
    assert.ok(ids.length >= 2 && ids.length <= COURSE_CONFIG.resourceDisplayLimit, item[0]);
    ids.forEach(function (id) { assert.ok(COURSE_RESOURCES[id].url, item[0] + " has linked " + id); });
  });
});

const PREVIEW_DATES = ["2026-09-09", "2026-09-25", "2026-09-28", "2026-10-05", "2026-10-10", "2026-10-19", "2026-10-21", "2026-10-26", "2026-11-04", "2026-11-10", "2026-11-13", "2026-11-18", "2026-11-30", "2026-12-07", "2026-12-08"];
test("all requested preview dates render every operational section", function () {
  PREVIEW_DATES.forEach(function (date) {
    const view = renderPreview(date, date >= "2026-10-21" ? "behavioural" : "not-confirmed", date >= "2026-10-21" ? { ethics: "developing", proposal: "drafting", board: "active" } : {});
    ["position-title", "project-summary-list", "do-now-list", "coming-up-list", "journey-list", "journey-detail", "resources-list", "full-timeline"].forEach(function (id) {
      assert.ok(view.text(id).length > 0, date + " left #" + id + " blank");
    });
  });
});

test("state selectors persist locally and update the rendered view", function () {
  const view = renderPreview("2026-10-26", "behavioural", { scope: "partner-checked", proposal: "drafting", ethics: "developing", board: "active" });
  assert.match(view.text("project-summary-list"), /Partner-checked.*Drafting.*Developing.*Active/i);
  view.nodes.get("proposal-select").listeners.change({ target: { value: "revisions-required" } });
  assert.match(view.text("do-now-list"), /requested Project Proposal revisions/i);
  assert.match(view.storage.get(COURSE_CONFIG.projectStateStorageKey), /revisions-required/);
  const noStorage = renderPreview("2026-10-26", "behavioural", {}, { storageThrows: true });
  assert.ok(noStorage.text("position-title"));
});

test("November gate renders provisional status from centralized data", function () {
  const view = renderPreview("2026-11-10", "behavioural", { ethics: "quality-control" });
  assert.match(view.text("coming-up-list"), /Formal Ethics Submission \/ Project-Readiness Determination.*PROJECT GATE.*Pending committee confirmation/i);
  assert.match(view.text("full-timeline"), /November 13, 2026.*Pending committee confirmation/i);
  const gate = event("november-pathway-gate");
  gate.provisional = false;
  try {
    const confirmed = renderPreview("2026-11-10", "behavioural", { ethics: "quality-control" });
    assert.doesNotMatch(confirmed.text("coming-up-list"), /Pending committee confirmation/i);
    assert.doesNotMatch(confirmed.text("full-timeline"), /Pending committee confirmation/i);
  } finally { gate.provisional = true; }
});

test("the simplified current view removes duplicate lookahead panels and uses revised copy", function () {
  const html = fs.readFileSync(path.join(projectRoot, "index.html"), "utf8");
  assert.doesNotMatch(html, /id="next-card"|id="next-event"|id="next-gate"|id="upcoming-list"/);
  assert.match(html, /This course stage reflects the course calendar\. Your project status is tracked separately below\./);
  assert.match(html, /Right now in your Practicum/);
  assert.match(html, /Saved locally/);
  assert.match(html, /Update these when your project reaches a new state\. The Navigator uses them to tailor the guidance shown above\./);
  assert.match(html, /value="2026-10-19">Oct 19 · Project Board/);
  assert.match(html, /value="2026-10-21">Oct 21 · Ethics Pathways/);
  assert.ok(html.indexOf('id="resources-title"') < html.indexOf('id="journey-title"'));
});

test("event types render consistently in DO NOW, Coming Next, and the timeline", function () {
  function descendants(node) {
    return [node].concat(node.children.flatMap(descendants));
  }
  const view = renderPreview("2026-10-26", "behavioural", { scope: "partner-checked", proposal: "drafting", ethics: "developing", board: "active" });
  const doNowClasses = descendants(view.nodes.get("do-now-list")).map(function (node) { return node.className; }).join(" ");
  assert.match(doNowClasses, /event-type--partnership-action/);
  assert.match(doNowClasses, /event-type--tutorial/);
  view.nodes.get("do-now-list").children.forEach(function (item) {
    assert.match(item.children[0].className, /event-type|gate-badge|boundary-badge/, "every DO NOW source uses a labelled badge treatment");
  });
  const comingClasses = descendants(view.nodes.get("coming-up-list")).map(function (node) { return node.className; }).join(" ");
  assert.match(comingClasses, /event-type--tutorial/);
  assert.match(comingClasses, /event-type--support/);
  assert.match(comingClasses, /event-type--partnership-action/);
  const timeline = descendants(view.nodes.get("full-timeline"));
  const timelineClasses = timeline.map(function (node) { return node.className; }).join(" ");
  ["seminar", "tutorial", "deadline", "milestone", "partnership-action", "support", "no-class"].forEach(function (type) {
    assert.match(timelineClasses, new RegExp("event-type--" + type));
  });
  assert.ok(timeline.some(function (node) { return /gate-badge/.test(node.className) && /Project gate/i.test(node.textContent); }));
  assert.ok(timeline.some(function (node) { return /boundary-badge/.test(node.className) && /Project boundary/i.test(node.textContent); }));
});

test("semantic event colours reserve red for gates and keep status states neutral", function () {
  const css = fs.readFileSync(path.join(projectRoot, "css/styles.css"), "utf8");
  function rule(className) {
    const match = css.match(new RegExp("\\." + className + "\\s*\\{([^}]*)\\}"));
    assert.ok(match, className);
    return match[1];
  }
  assert.match(rule("event-type--seminar"), /background:\s*var\(--event-seminar-bg\)/);
  assert.match(rule("event-type--seminar"), /color:\s*var\(--event-seminar-text\)/);
  assert.doesNotMatch(rule("event-type--seminar"), /fnis-red/);
  assert.match(rule("event-type--tutorial"), /background:\s*var\(--event-tutorial-bg\)/);
  assert.match(rule("event-type--deadline"), /background:\s*var\(--event-deadline-bg\)/);
  assert.doesNotMatch(rule("event-type--deadline"), /fnis-red/);
  assert.match(rule("event-type--milestone"), /background:\s*var\(--event-milestone-bg\)/);
  assert.match(rule("event-type--partnership-action"), /background:\s*var\(--event-partnership-bg\)/);
  assert.match(rule("event-type--support"), /background:\s*var\(--event-support-bg\)/);
  assert.match(rule("event-type--no-class"), /background:\s*var\(--event-no-class-bg\)/);
  assert.match(rule("gate-badge"), /event-gate-(?:text|bg|border)/);
  assert.doesNotMatch(rule("status-badge"), /fnis-red|C69AA3/i);
  assert.doesNotMatch(rule("action-source"), /(?:^|;)\s*color\s*:/, "generic action-source colour must not override labelled event badges");
  assert.match(rule("event-type--project-state\.action-source--state"), /background:\s*var\(--event-pending-bg\)/);
  assert.doesNotMatch(rule("before-proceed\.is-waiting"), /fnis-red/);
  assert.doesNotMatch(rule("before-proceed\.is-blocked"), /fnis-red/);
  assert.doesNotMatch(rule("before-proceed\.is-ready-conditions"), /fnis-red/);
});

test("event badge text and background tokens meet accessible contrast", function () {
  const css = fs.readFileSync(path.join(projectRoot, "css/styles.css"), "utf8");
  const tokenEntries = Array.from(css.matchAll(/--(event-[a-z-]+):\s*(#[0-9A-F]{6})/gi), function (match) { return [match[1], match[2]]; });
  const tokens = Object.fromEntries(tokenEntries);
  function luminance(hex) {
    const channels = hex.slice(1).match(/.{2}/g).map(function (part) {
      const value = parseInt(part, 16) / 255;
      return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  }
  function contrast(first, second) {
    const lighter = Math.max(luminance(first), luminance(second));
    const darker = Math.min(luminance(first), luminance(second));
    return (lighter + 0.05) / (darker + 0.05);
  }
  ["seminar", "tutorial", "deadline", "milestone", "partnership", "support", "gate", "no-class", "pending"].forEach(function (category) {
    assert.ok(tokens["event-" + category + "-text"], category + " text token");
    assert.ok(tokens["event-" + category + "-bg"], category + " background token");
    assert.ok(contrast(tokens["event-" + category + "-text"], tokens["event-" + category + "-bg"]) >= 4.5, category + " contrast");
  });
});

test("boundary condition classes remain text-labelled and semantically distinct", function () {
  const blocked = renderPreview("2026-10-26", "behavioural", { ethics: "developing" });
  assert.match(blocked.nodes.get("before-proceed-panel").className, /is-blocked/);
  assert.equal(blocked.text("before-proceed-status"), "Blocked");
  const waiting = renderPreview("2026-11-13", "behavioural", { ethics: "submitted-determined" });
  assert.match(waiting.nodes.get("before-proceed-panel").className, /is-waiting/);
  assert.equal(waiting.text("before-proceed-status"), "Waiting");
  const conditional = renderPreview("2026-11-13", "no-formal-review", { ethics: "ready-conditions" });
  assert.match(conditional.nodes.get("before-proceed-panel").className, /is-ready-conditions/);
  assert.equal(conditional.text("before-proceed-status"), "Ready with conditions");
  const boundary = renderPreview("2026-09-28", "not-confirmed", {});
  assert.match(boundary.nodes.get("before-proceed-panel").className, /is-boundary/);
  assert.equal(boundary.text("before-proceed-label"), "Project boundary");
});

test("boundary reading order, January preview audit, and metadata are correct", function () {
  const html = fs.readFileSync(path.join(projectRoot, "index.html"), "utf8");
  assert.ok(html.indexOf('id="before-proceed-panel"') < html.indexOf('id="weekly-destination-panel"'));
  assert.doesNotMatch(html, /2027-01-30|Jan 30 · Milestone preparation/);
  assert.equal(COURSE_EVENTS.some(function (item) { return item.date === "2027-01-30"; }), false);
  assert.match(html, /<meta name="description" content="A guide to where you are, what to do next, and what conditions affect your progress in the FNIS 400 community research practicum\.">/);
  assert.match(html, /<title>FNIS 400 Practicum Course Navigator<\/title>/);
});

test("working and missing resource links have distinct accessible states", function () {
  const original = COURSE_RESOURCES.proposalTimeline.url;
  COURSE_RESOURCES.proposalTimeline.url = "";
  try {
    const view = renderPreview("2026-10-08", "not-confirmed", { scope: "core-commitment" });
    const cards = view.nodes.get("resources-list").children.map(function (item) { return item.children[0]; });
    assert.ok(cards.some(function (card) { return card.tagName === "a" && card.target === "_blank" && card.rel === "noopener noreferrer"; }));
    assert.ok(cards.some(function (card) { return card.tagName === "div" && /Project Proposal Timeline.*Canvas link to be added/.test(card.textContent); }));
    cards.filter(function (card) { return card.tagName === "a"; }).forEach(function (card) { assert.match(card.attributes["aria-label"], /opens in a new tab/i); });
  } finally { COURSE_RESOURCES.proposalTimeline.url = original; }
});

test("timeline disclosure, logo fallback, and Vancouver date logic remain sound", function () {
  const view = renderPreview("2026-11-13", "program-evaluation", { ethics: "submitted-determined" });
  assert.equal(view.nodes.get("timeline-toggle").attributes["aria-expanded"], "false");
  view.nodes.get("timeline-details").open = true; view.nodes.get("timeline-details").listeners.toggle();
  assert.equal(view.nodes.get("timeline-toggle").attributes["aria-expanded"], "true");
  assert.equal(view.nodes.get("timeline-action").textContent, "Hide dates −");
  view.nodes.get("fnis-logo").naturalWidth = 447; view.nodes.get("fnis-logo").listeners.load();
  assert.equal(view.nodes.get("fnis-logo-fallback").removed, true);
  assert.equal(utils.getVancouverToday(new Date("2026-10-27T06:30:00Z")), "2026-10-26");
});

test("static paths, IDs, ARIA references, and offline architecture are valid", function () {
  const html = fs.readFileSync(path.join(projectRoot, "index.html"), "utf8");
  const app = fs.readFileSync(path.join(projectRoot, "js/app.js"), "utf8");
  const ids = Array.from(html.matchAll(/\sid="([^"]+)"/g), function (match) { return match[1]; });
  assert.equal(new Set(ids).size, ids.length);
  const idSet = new Set(ids);
  Array.from(app.matchAll(/byId\("([^"]+)"\)/g), function (match) { return match[1]; }).forEach(function (id) { assert.ok(idSet.has(id), id); });
  Array.from(html.matchAll(/aria-(?:labelledby|describedby|controls)="([^"]+)"/g), function (match) { return match[1]; }).flatMap(function (value) { return value.split(/\s+/); }).forEach(function (id) { assert.ok(idSet.has(id), id); });
  Array.from(html.matchAll(/\s(?:src|href)="([^"]+)"/g), function (match) { return match[1]; }).filter(function (ref) { return !ref.startsWith("#") && !/^[a-z]+:/i.test(ref); }).forEach(function (ref) { assert.ok(fs.existsSync(path.join(projectRoot, ref.split(/[?#]/)[0])), ref); });
  ["index.html", "css/styles.css", "js/app.js"].forEach(function (file) { assert.doesNotMatch(fs.readFileSync(path.join(projectRoot, file), "utf8"), /https?:\/\//i, file); });
  ["js/course-data.js", "js/app.js"].forEach(function (file) { assert.doesNotMatch(fs.readFileSync(path.join(projectRoot, file), "utf8"), /\b(fetch|XMLHttpRequest|WebSocket)\s*\(/, file); });
});

test("student-facing copy contains no em dashes and preserves required principles", function () {
  const text = ["index.html", "js/course-data.js", "js/app.js"].map(function (file) { return fs.readFileSync(path.join(projectRoot, file), "utf8"); }).join("\n");
  assert.doesNotMatch(text, /—/);
  assert.match(text, /Canvas is the authoritative source for current instructions and materials/);
  assert.match(text, /Every Practicum project has ethical responsibilities/);
  assert.match(text, /No formal ethics review does not mean unrestricted use/);
  assert.match(text, /Possession is not permission\. Access is not authority/);
  assert.match(text, /Trello tracks the project, not the research data/);
});

console.log("\n" + passed + " tests passed.");
