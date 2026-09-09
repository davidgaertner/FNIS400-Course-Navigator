(function () {
  "use strict";

  const data = window.FNIS400;
  if (!data) return;
  const {
    COURSE_CONFIG, COURSE_STAGES, COURSE_EVENTS, COURSE_RESOURCES, PROJECT_PATHWAYS,
    PROJECT_STATE_DEFINITIONS, DEFAULT_PROJECT_STATE, JOURNEY_STAGES, utils
  } = data;
  const RESOURCE_TYPE_LABELS = { page: "Page", assignment: "Assignment", file: "File", module: "Module", template: "Template", external: "External resource" };
  const MONTH_NAMES = ["September", "October", "November", "December", "January", "February", "March", "April"];
  const MONTH_KEYS = ["2026-09", "2026-10", "2026-11", "2026-12", "2027-01", "2027-02", "2027-03", "2027-04"];
  const query = new URLSearchParams(window.location.search);
  const previewMode = query.get("preview") === "1";
  let activeDate = utils.getVancouverToday();
  let selectedPathway = "not-confirmed";
  let projectState = utils.normalizeProjectState(DEFAULT_PROJECT_STATE);
  let selectedJourneyId = null;

  const byId = function (id) { return document.getElementById(id); };
  function create(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function dateObject(isoDate) {
    const p = utils.parseDateParts(isoDate);
    return new Date(Date.UTC(p.year, p.month - 1, p.day, 12));
  }
  function formatDate(isoDate, options) {
    return new Intl.DateTimeFormat("en-CA", Object.assign({ timeZone: "UTC", month: "long", day: "numeric", year: "numeric" }, options || {})).format(dateObject(isoDate));
  }
  function formatEventDate(event, short) {
    if (!event.date) return "Date TBC";
    const options = { month: short ? "short" : "long", day: "numeric", year: short ? undefined : "numeric" };
    const start = formatDate(event.date, options);
    const suffix = event.timeLabel ? " · " + event.timeLabel : "";
    if (event.openEnded) return start + " onward" + suffix;
    if (!event.endDate) return start + suffix;
    const a = utils.parseDateParts(event.date);
    const b = utils.parseDateParts(event.endDate);
    const range = a.year === b.year && a.month === b.month
      ? formatDate(event.date, { month: short ? "short" : "long", day: "numeric", year: undefined }) + "–" + b.day + (short ? "" : ", " + a.year)
      : start + " – " + formatDate(event.endDate, options);
    return range + suffix;
  }
  function makeBadge(text, className) { return create("span", className, text); }
  function eventTypeBadgeClass(type) { return "event-type event-type--" + String(type || "activity").replace(/[^a-z0-9-]/g, "-"); }
  function appendEventBadges(container, event, includeType) {
    if (includeType && !event.gate) container.appendChild(makeBadge(utils.getTypeLabel(event.type), eventTypeBadgeClass(event.type)));
    if (event.weight) container.appendChild(makeBadge(event.weight + " assessment", "weight-badge"));
    if (event.gate) container.appendChild(makeBadge("Project gate", "gate-badge"));
    if (event.boundary) container.appendChild(makeBadge("Project boundary", "boundary-badge"));
    if (event.provisional) container.appendChild(makeBadge(COURSE_CONFIG.provisionalLabel, "status-badge"));
    if (event.status === "tbc") container.appendChild(makeBadge("Date TBC", "status-badge"));
  }

  function renderHero(stage) {
    byId("current-date").textContent = formatDate(activeDate, { weekday: "long", month: "long", day: "numeric", year: "numeric" });
    byId("position-title").textContent = stage.title;
    byId("stage-description").textContent = stage.description;
    const term2 = byId("term2-notice");
    term2.hidden = !stage.term2Limited;
    term2.textContent = stage.term2Limited ? COURSE_CONFIG.term2ScheduleNotice : "";
  }

  function renderProjectSummary() {
    const list = byId("project-summary-list");
    list.replaceChildren();
    utils.getProjectSummary(activeDate, projectState, selectedPathway).forEach(function (item) {
      const row = create("div", "project-summary-item");
      row.appendChild(create("dt", null, item.label));
      const value = create("dd");
      value.appendChild(create("span", "summary-value", item.value));
      value.appendChild(create("span", "summary-condition", item.condition));
      row.appendChild(value);
      list.appendChild(row);
    });
  }
  function renderDoNow() {
    const list = byId("do-now-list");
    list.replaceChildren();
    utils.getDoNow(activeDate, projectState, selectedPathway).forEach(function (action) {
      const item = create("li");
      let sourceClass = "action-source event-type event-type--project-state action-source--state";
      if (action.type === "project-gate") sourceClass = "action-source gate-badge";
      else if (action.type === "project-boundary") sourceClass = "action-source boundary-badge";
      else if (action.type && action.type !== "project-state") sourceClass = "action-source " + eventTypeBadgeClass(action.type);
      item.appendChild(create("span", sourceClass, action.source));
      item.appendChild(create("span", "action-text", action.text));
      list.appendChild(item);
    });
  }
  function renderComingNext(upcoming) {
    const list = byId("coming-up-list");
    list.replaceChildren();
    if (!upcoming.length) { list.appendChild(create("li", null, "No further dated course activities.")); return; }
    upcoming.slice(0, 3).forEach(function (event) {
      const item = create("li");
      item.appendChild(create("span", "coming-date", formatEventDate(event, true) + ":"));
      const title = create("span", "coming-title", event.title);
      item.appendChild(title);
      const meta = create("span", "coming-meta");
      if (event.gate) meta.appendChild(makeBadge("Project gate", "gate-badge"));
      else meta.appendChild(makeBadge(utils.getTypeLabel(event.type), eventTypeBadgeClass(event.type)));
      if (event.provisional) meta.appendChild(makeBadge(COURSE_CONFIG.provisionalLabel, "status-badge"));
      item.appendChild(meta);
      list.appendChild(item);
    });
  }
  function renderWeeklyDestination() {
    const destination = utils.getWeeklyDestination(activeDate);
    const panel = byId("weekly-destination-panel");
    panel.hidden = !destination;
    byId("weekly-destination").textContent = destination ? destination.text : "";
  }
  function renderBeforeProceed() {
    const boundary = utils.getBeforeProceed(activeDate, projectState, selectedPathway);
    const panel = byId("before-proceed-panel");
    panel.hidden = !boundary;
    const statusClass = !boundary ? "" : boundary.status === "Blocked" ? " is-blocked" : boundary.status === "Waiting" ? " is-waiting" : boundary.status === "Ready with conditions" ? " is-ready-conditions" : " is-boundary";
    panel.className = "before-proceed" + statusClass;
    byId("before-proceed-label").textContent = boundary ? boundary.label : "";
    byId("before-proceed-text").textContent = boundary ? boundary.text : "";
    const status = byId("before-proceed-status");
    status.textContent = boundary && boundary.status ? boundary.status : "";
    status.hidden = !boundary || !boundary.status;
  }

  function currentJourneyStage() {
    return JOURNEY_STAGES.find(function (stage) { return activeDate >= stage.from && activeDate <= stage.until; }) || (activeDate < JOURNEY_STAGES[0].from ? JOURNEY_STAGES[0] : JOURNEY_STAGES[JOURNEY_STAGES.length - 1]);
  }
  function renderJourneyDetail(stage) {
    const detail = byId("journey-detail");
    detail.replaceChildren();
    detail.appendChild(create("h3", null, stage.label));
    detail.appendChild(create("p", null, stage.description));
    detail.appendChild(create("p", "journey-dates", formatDate(stage.from, { month: "short", day: "numeric", year: undefined }) + " to " + formatDate(stage.until, { month: "short", day: "numeric", year: undefined })));
    if (stage.gate) detail.appendChild(create("p", "journey-major-gate", "◆ Project gate: " + stage.gate));
    if (stage.id === "partnership-scoping") detail.appendChild(create("p", "journey-chain", "Emerging project map → Core Commitment → Scope Snapshot → Partner-checked scope"));
    if (stage.id === "proposal-ethics") detail.appendChild(create("p", "journey-chain", "Project Proposal → Ethics / readiness conditions → Ready for the next stage"));
  }
  function renderJourney() {
    const current = currentJourneyStage();
    if (!selectedJourneyId) selectedJourneyId = current.id;
    const list = byId("journey-list");
    list.replaceChildren();
    const currentIndex = JOURNEY_STAGES.findIndex(function (stage) { return stage.id === current.id; });
    JOURNEY_STAGES.forEach(function (stage, index) {
      const state = index === currentIndex ? "current" : index < currentIndex ? "completed" : "future";
      const item = create("li", "journey-item " + state + (stage.id === selectedJourneyId ? " selected" : ""));
      const button = create("button", "journey-button");
      button.type = "button";
      button.dataset.stageId = stage.id;
      button.setAttribute("aria-pressed", String(stage.id === selectedJourneyId));
      button.appendChild(create("span", "journey-index", String(index + 1).padStart(2, "0")));
      button.appendChild(create("span", "journey-label", stage.label));
      button.appendChild(create("span", "journey-state", state === "current" ? "You are here" : state === "completed" ? "✓ Earlier course stage" : "Upcoming"));
      if (stage.gate) button.appendChild(create("span", "journey-gate", "◆ Project gate"));
      button.addEventListener("click", function () { selectedJourneyId = stage.id; renderJourney(); });
      item.appendChild(button);
      list.appendChild(item);
    });
    renderJourneyDetail(JOURNEY_STAGES.find(function (stage) { return stage.id === selectedJourneyId; }) || current);
  }

  function isValidResourceUrl(url) {
    if (typeof url !== "string" || !url.trim()) return false;
    try { const parsed = new URL(url); return parsed.protocol === "https:" || parsed.protocol === "http:"; } catch (error) { return false; }
  }
  function renderResources(stage) {
    const list = byId("resources-list");
    const resources = utils.getResourcesForStage(stage, activeDate, selectedPathway);
    byId("resources-intro").textContent = "A focused set of Canvas materials for the current course stage and confirmed pathway.";
    list.replaceChildren();
    resources.forEach(function (resource) {
      const item = create("li");
      const type = (RESOURCE_TYPE_LABELS[resource.type] || resource.type).toUpperCase();
      let content;
      if (isValidResourceUrl(resource.url)) {
        content = create("a", "resource-link");
        content.href = resource.url; content.target = "_blank"; content.rel = "noopener noreferrer";
        content.setAttribute("aria-label", resource.label + " · " + type + ", opens in a new tab");
        content.appendChild(create("span", "resource-label", resource.label));
        content.appendChild(create("span", "resource-meta", type + " · Open in Canvas (new tab)"));
      } else {
        content = create("div", "resource-unavailable");
        content.appendChild(create("span", "resource-label", resource.label));
        content.appendChild(create("span", "resource-meta", type + " · Canvas link to be added"));
      }
      item.appendChild(content); list.appendChild(item);
    });
  }

  function renderTimeline() {
    const container = byId("full-timeline"); container.replaceChildren();
    MONTH_KEYS.forEach(function (monthKey, index) {
      const monthEvents = COURSE_EVENTS.filter(function (event) { return (event.date && event.date.slice(0, 7) === monthKey) || (!event.date && event.month === monthKey); }).slice().sort(function (a, b) {
        if (!a.date) return 1; if (!b.date) return -1;
        return a.date.localeCompare(b.date) || (Number(a.order) || 0) - (Number(b.order) || 0) || a.id.localeCompare(b.id);
      });
      if (!monthEvents.length) return;
      const section = create("section", "timeline-month"); section.appendChild(create("h3", null, MONTH_NAMES[index]));
      const list = create("ol", "timeline-items");
      monthEvents.forEach(function (event) {
        const item = create("li", "timeline-item timeline-item--" + event.type + (event.gate ? " is-gate" : "") + (event.boundary ? " is-boundary" : ""));
        item.appendChild(create("div", "timeline-date", formatEventDate(event, false)));
        const content = create("div"); content.appendChild(create("div", "timeline-title", event.title));
        const badges = create("div", "timeline-meta"); appendEventBadges(badges, event, true); content.appendChild(badges);
        if (event.action) content.appendChild(create("p", "timeline-context", "Action: " + event.action));
        if (event.outcome) content.appendChild(create("p", "timeline-context", "Outcome: " + event.outcome));
        if (event.details) content.appendChild(create("p", "timeline-context", event.details));
        if (event.context) content.appendChild(create("p", "timeline-context", event.context));
        if (event.whyNow) content.appendChild(create("p", "why-now", "Why this comes now: " + event.whyNow));
        item.appendChild(content); list.appendChild(item);
      });
      section.appendChild(list); container.appendChild(section);
    });
  }

  function readStorage(key, fallback) { try { const value = window.localStorage.getItem(key); return value === null ? fallback : value; } catch (error) { return fallback; } }
  function writeStorage(key, value) { try { window.localStorage.setItem(key, value); } catch (error) { /* Persistence is optional. */ } }
  function readProjectState() {
    try { return utils.normalizeProjectState(JSON.parse(readStorage(COURSE_CONFIG.projectStateStorageKey, "{}"))); } catch (error) { return utils.normalizeProjectState(DEFAULT_PROJECT_STATE); }
  }
  function renderEthicsStatusOptions() {
    const select = byId("ethics-select");
    select.replaceChildren();
    utils.getEthicsStatusOptions(selectedPathway).forEach(function (item) {
      const option = create("option", null, item.label);
      option.value = item.value;
      select.appendChild(option);
    });
    select.value = projectState.ethics;
  }
  function setupStatusControls() {
    const previewPathway = previewMode ? query.get("pathway") : null;
    selectedPathway = PROJECT_PATHWAYS[previewPathway] ? previewPathway : utils.normalizePathway(readStorage(COURSE_CONFIG.pathwayStorageKey, "not-confirmed"));
    projectState = readProjectState();
    if (previewMode) Object.keys(PROJECT_STATE_DEFINITIONS).forEach(function (key) { if (query.get(key)) projectState[key] = query.get(key); });
    projectState = utils.normalizeProjectStateForPathway(projectState, selectedPathway);
    if (!previewMode) writeStorage(COURSE_CONFIG.projectStateStorageKey, JSON.stringify(projectState));
    byId("pathway-select").value = selectedPathway;
    byId("pathway-select").addEventListener("change", function (event) {
      const previousPathway = selectedPathway;
      selectedPathway = utils.normalizePathway(event.target.value);
      projectState = utils.transitionProjectStateForPathway(projectState, previousPathway, selectedPathway);
      renderEthicsStatusOptions();
      writeStorage(COURSE_CONFIG.pathwayStorageKey, selectedPathway);
      writeStorage(COURSE_CONFIG.projectStateStorageKey, JSON.stringify(projectState));
      updateDate(activeDate, true);
    });
    renderEthicsStatusOptions();
    Object.keys(PROJECT_STATE_DEFINITIONS).forEach(function (key) {
      const select = byId(key + "-select"); select.value = projectState[key];
      select.addEventListener("change", function (event) {
        projectState[key] = event.target.value; projectState = utils.normalizeProjectStateForPathway(projectState, selectedPathway);
        writeStorage(COURSE_CONFIG.projectStateStorageKey, JSON.stringify(projectState)); updateDate(activeDate, true);
      });
    });
  }
  function setupPreview() {
    if (!previewMode) return;
    byId("preview-bar").hidden = false;
    if (utils.isValidDate(query.get("date"))) activeDate = query.get("date");
    byId("preview-date").addEventListener("change", function (event) { updateDate(event.target.value, true); });
    byId("today-button").addEventListener("click", function () { updateDate(utils.getVancouverToday(), true); });
    byId("preview-shortcut").addEventListener("change", function (event) { if (utils.isValidDate(event.target.value)) updateDate(event.target.value, true); });
  }
  function setupLogo() {
    const logo = byId("fnis-logo"); const fallback = byId("fnis-logo-fallback");
    if (!logo || !fallback) return;
    logo.addEventListener("load", function () { if (logo.naturalWidth > 0) { logo.hidden = false; fallback.remove(); } });
    logo.addEventListener("error", function () { logo.hidden = true; fallback.hidden = false; });
    logo.src = logo.dataset.src;
  }
  function setupTimelineToggle() {
    const details = byId("timeline-details"); const toggle = byId("timeline-toggle"); const action = byId("timeline-action");
    const sync = function () { const open = Boolean(details.open); toggle.setAttribute("aria-expanded", String(open)); action.textContent = open ? "Hide dates −" : "View all dates +"; };
    details.addEventListener("toggle", sync); sync();
  }

  function updateDate(nextDate, announce) {
    if (!utils.isValidDate(nextDate)) return;
    activeDate = nextDate;
    const stage = utils.getStage(activeDate);
    const upcoming = utils.getUpcomingEvents(activeDate, 7, selectedPathway, projectState);
    renderHero(stage);
    renderProjectSummary(); renderDoNow(); renderComingNext(upcoming); renderBeforeProceed(); renderWeeklyDestination();
    byId("pathway-panel").hidden = activeDate < "2026-09-25";
    byId("pathway-choice").hidden = activeDate < COURSE_CONFIG.pathwayRelevantFrom;
    byId("ethics-principles").hidden = activeDate < COURSE_CONFIG.pathwayRelevantFrom;
    byId("board-principles").hidden = activeDate < "2026-10-19";
    renderJourney(); renderResources(stage); renderTimeline();
    if (previewMode) {
      byId("preview-date").value = activeDate;
      const url = new URL(window.location.href); url.searchParams.set("preview", "1"); url.searchParams.set("date", activeDate); url.searchParams.set("pathway", selectedPathway);
      Object.keys(PROJECT_STATE_DEFINITIONS).forEach(function (key) { url.searchParams.set(key, projectState[key]); });
      window.history.replaceState({}, "", url);
    }
    if (announce) byId("date-announcer").textContent = "Navigator updated for " + formatDate(activeDate) + ". Course stage: " + stage.title + ".";
  }

  setupLogo(); setupStatusControls(); setupPreview(); setupTimelineToggle();
  byId("last-updated").textContent = COURSE_CONFIG.lastUpdated;
  updateDate(activeDate, false);
})();
