(function () {
  "use strict";

  const data = window.FNIS400;
  if (!data) return;

  const { COURSE_CONFIG, COURSE_STAGES, COURSE_EVENTS, JOURNEY_STAGE_IDS, PROJECT_PATHWAYS, utils } = data;
  const TYPE_LABELS = {
    module: "Module start",
    seminar: "Seminar",
    activity: "Activity",
    submission: "Submission",
    pulse: "Project Pulse",
    break: "Break",
    presentation: "Presentation",
    "project-gate": "Project gate"
  };
  const RESOURCE_TYPE_LABELS = {
    page: "Page", assignment: "Assignment", module: "Module", template: "Template", external: "External resource"
  };
  const MONTH_NAMES = ["September", "October", "November", "December", "January", "February", "March", "April"];
  const MONTH_KEYS = ["2026-09", "2026-10", "2026-11", "2026-12", "2027-01", "2027-02", "2027-03", "2027-04"];

  let activeDate = utils.getVancouverToday();
  let selectedPathway = "not-confirmed";
  let selectedJourneyId = null;
  const query = new URLSearchParams(window.location.search);
  const previewMode = query.get("preview") === "1";

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
    return new Intl.DateTimeFormat("en-CA", Object.assign({
      timeZone: "UTC", month: "long", day: "numeric", year: "numeric"
    }, options || {})).format(dateObject(isoDate));
  }

  function formatEventDate(event, short) {
    if (!event.date) return "Date TBC";
    const monthStyle = short ? "short" : "long";
    const monthDayOptions = { month: monthStyle, day: "numeric", year: undefined };
    const fullDateOptions = { month: monthStyle, day: "numeric" };
    const timeSuffix = event.timeLabel ? " · " + event.timeLabel : (event.time === "12:00" ? " at noon" : "");
    const start = formatDate(event.date, short ? monthDayOptions : fullDateOptions);
    if (!event.endDate) {
      return start + timeSuffix;
    }
    const startParts = utils.parseDateParts(event.date);
    const endParts = utils.parseDateParts(event.endDate);
    const sameYear = startParts.year === endParts.year;
    const sameMonth = sameYear && startParts.month === endParts.month;
    let range;
    if (sameMonth) {
      range = formatDate(event.date, monthDayOptions) + "–" + endParts.day + (short ? "" : ", " + startParts.year);
    } else if (sameYear) {
      range = formatDate(event.date, monthDayOptions) + " – " + formatDate(event.endDate, monthDayOptions) + (short ? "" : ", " + startParts.year);
    } else {
      range = formatDate(event.date, fullDateOptions) + " – " + formatDate(event.endDate, fullDateOptions);
    }
    return range + timeSuffix;
  }

  function getTypeLabel(event) { return event.gate ? "Project gate" : (TYPE_LABELS[event.type] || event.type); }

  function makeBadge(text, className) { return create("span", className, text); }

  function appendEventBadges(container, event, includeType) {
    if (includeType && event.type !== "project-gate") container.appendChild(makeBadge(TYPE_LABELS[event.type] || event.type, "event-type"));
    if (event.weight) container.appendChild(makeBadge(event.weight + " assessment", "weight-badge"));
    if (event.gate) container.appendChild(makeBadge("Project gate", "gate-badge"));
    if (event.status === "pending-confirmation") container.appendChild(makeBadge("Working date, pending final committee confirmation", "status-badge"));
    if (event.status === "pathway-dependent") container.appendChild(makeBadge("Project-specific conditions", "status-badge"));
    if (event.status === "readiness") container.appendChild(makeBadge("Course-level readiness", "status-badge"));
    if (event.status === "tbc") container.appendChild(makeBadge("Date TBC", "status-badge"));
  }

  function currentSeasonalGuidance(stage) {
    const dated = (stage.dateGuidance || []).find(function (guidance) {
      return (!guidance.from || activeDate >= guidance.from) && (!guidance.until || activeDate <= guidance.until);
    });
    if (dated) return dated;
    const guidance = stage.seasonalGuidance;
    return guidance && activeDate >= guidance.start && activeDate <= guidance.end ? guidance : null;
  }

  function renderHero(stage, nextEvent) {
    byId("current-date").textContent = formatDate(activeDate, { weekday: "long", month: "long", day: "numeric", year: "numeric" });
    byId("position-title").textContent = stage.title;
    const seasonal = currentSeasonalGuidance(stage);
    byId("stage-description").textContent = seasonal ? seasonal.note : stage.description;
    const term2Notice = byId("term2-notice");
    const showTerm2Notice = stage.term2Limited || (stage.id === "foundation" && activeDate >= "2027-01-06");
    term2Notice.hidden = !showTerm2Notice;
    term2Notice.textContent = showTerm2Notice ? COURSE_CONFIG.term2ScheduleNotice : "";

    const nextContainer = byId("next-event");
    nextContainer.replaceChildren();
    if (!nextEvent) {
      nextContainer.appendChild(create("p", "next-date", "Course timeline complete"));
      nextContainer.appendChild(create("p", "next-title", "There are no further dated FNIS 400 activities in this calendar."));
      return;
    }

    const inRange = nextEvent.endDate && activeDate > nextEvent.date && activeDate <= nextEvent.endDate;
    const days = inRange ? 0 : utils.daysBetween(activeDate, nextEvent.date);
    nextContainer.appendChild(create("p", "next-date", days === 0 ? "Today" : formatEventDate(nextEvent, false)));
    nextContainer.appendChild(create("h3", "next-title", nextEvent.title));
    if (nextEvent.details || nextEvent.context) nextContainer.appendChild(create("p", "next-detail", nextEvent.details || nextEvent.context));
    const badges = create("div", "next-badges");
    appendEventBadges(badges, nextEvent, false);
    nextContainer.appendChild(badges);
    let countdown = "Today";
    if (inRange) countdown = "In progress";
    else if (days === 1) countdown = "1 day away";
    else if (days > 1) countdown = days + " days away";
    nextContainer.appendChild(create("p", "countdown", countdown));
  }

  function renderNextGate(nextGate) {
    const container = byId("next-gate");
    container.replaceChildren();
    if (!nextGate) {
      container.appendChild(create("p", "next-date next-date-complete", "No future gates"));
      container.appendChild(create("p", "next-title", "The formal project-gate sequence is complete."));
      return;
    }
    const days = utils.daysBetween(activeDate, nextGate.date);
    container.appendChild(create("p", "next-date", formatEventDate(nextGate, false)));
    container.appendChild(create("h3", "next-title", nextGate.title));
    const badges = create("div", "next-badges");
    appendEventBadges(badges, nextGate, false);
    container.appendChild(badges);
    const countdown = days === 0 ? "Today" : days === 1 ? "1 day away" : days + " days away";
    container.appendChild(create("p", "countdown", countdown));
    if (nextGate.context) container.appendChild(create("p", "next-detail", nextGate.context));
    if (nextGate.pathwayDetail) {
      const detail = nextGate.pathwayDetail;
      const label = PROJECT_PATHWAYS[selectedPathway].label + ": " + detail.title + (detail.timeLabel ? " · " + detail.timeLabel : "");
      container.appendChild(create("p", "next-detail", label));
      if (detail.statusNote) container.appendChild(create("p", "next-detail", detail.statusNote));
      if (detail.context) container.appendChild(create("p", "next-detail", detail.context));
    }
    if (days >= 0 && days <= 7) {
      container.appendChild(create("p", "gate-approaching-copy", "Project gate approaching. If this is at risk, communicate before the date so the plan can be adjusted while there is still time."));
    }
  }

  function renderBulletList(id, items) {
    const list = byId(id);
    list.replaceChildren();
    items.forEach(function (item) { list.appendChild(create("li", null, item)); });
  }

  function pathwayIsRelevant() { return activeDate >= COURSE_CONFIG.pathwayRelevantFrom; }

  function currentPathwayState() {
    return pathwayIsRelevant() ? utils.getPathwayState(selectedPathway, activeDate) : null;
  }

  function renderProjectCondition(stage) {
    const panel = byId("pathway-panel");
    const choice = byId("pathway-choice");
    const pathwayState = currentPathwayState();
    const dependencies = (stage.dependencies || []).concat(pathwayState ? (pathwayState.dependencies || []) : []);
    panel.hidden = !pathwayState && !dependencies.length;
    if (panel.hidden) return;
    if (choice) choice.hidden = !pathwayState;
    byId("pathway-status").textContent = pathwayState ? pathwayState.status : "Current Project Dependency";
    byId("pathway-guidance").textContent = pathwayState ? pathwayState.guidance : "Some work depends on a course or partner condition before the next project step can proceed.";
    const dependencyPanel = byId("dependency-panel");
    dependencyPanel.hidden = !dependencies.length;
    renderBulletList("dependency-list", dependencies);
  }

  function renderPositioning(stage, upcoming) {
    const seasonal = currentSeasonalGuidance(stage);
    const pathwayState = currentPathwayState();
    renderBulletList("by-now-list", seasonal && seasonal.byNow ? seasonal.byNow : stage.byNow);
    const rightNow = (seasonal ? seasonal.rightNow : stage.rightNow).concat(pathwayState ? (pathwayState.rightNow || []) : []).slice(0, 4);
    renderBulletList("right-now-list", rightNow);
    const coming = byId("coming-up-list");
    coming.replaceChildren();
    if (!upcoming.length) {
      coming.appendChild(create("li", null, "No further dated course activities."));
      return;
    }
    upcoming.slice(0, 3).forEach(function (event) {
      const item = create("li");
      item.appendChild(create("span", "coming-date", formatEventDate(event, true) + ":"));
      const title = create("span", "coming-title", event.shortTitle || event.title);
      if (event.gate) title.appendChild(document.createTextNode(" · PROJECT GATE"));
      item.appendChild(title);
      coming.appendChild(item);
    });
  }

  function stageState(stage, currentStage) {
    if (currentStage.id === "complete") return "completed";
    if (currentStage.id === "before") return "future";
    if (stage.id === currentStage.id) return "current";
    return JOURNEY_STAGE_IDS.indexOf(stage.id) < JOURNEY_STAGE_IDS.indexOf(currentStage.id) ? "completed" : "future";
  }

  function majorDatesForStage(stage) {
    const events = COURSE_EVENTS.filter(function (event) {
      return Array.isArray(event.stageIds) && event.stageIds.includes(stage.id) && (event.gate || event.weight || event.type === "presentation");
    });
    if (!events.length) {
      return COURSE_EVENTS.filter(function (event) { return Array.isArray(event.stageIds) && event.stageIds.includes(stage.id); }).slice(0, 2);
    }
    return events.map(function (event) { return utils.resolveEventForPathway(event, selectedPathway); }).slice(0, 4);
  }

  function renderJourneyDetail(stage) {
    const detail = byId("journey-detail");
    detail.replaceChildren();
    detail.appendChild(create("h3", null, stage.journeyLabel));
    detail.appendChild(create("p", null, stage.description));
    const events = majorDatesForStage(stage);
    if (events.length) {
      const summary = events.map(function (event) { return formatEventDate(event, true) + ": " + event.title; }).join(" · ");
      detail.appendChild(create("p", "journey-dates", "Major dates — " + summary));
    }
  }

  function renderJourney(currentStage) {
    const list = byId("journey-list");
    const stages = JOURNEY_STAGE_IDS.map(function (id) { return COURSE_STAGES.find(function (stage) { return stage.id === id; }); });
    if (!selectedJourneyId) {
      selectedJourneyId = JOURNEY_STAGE_IDS.includes(currentStage.id) ? currentStage.id : (currentStage.id === "complete" ? "closeout" : "placement");
    }
    list.replaceChildren();
    stages.forEach(function (stage, index) {
      const state = stageState(stage, currentStage);
      const item = create("li", "journey-item " + state + (stage.id === selectedJourneyId ? " selected" : ""));
      const button = create("button", "journey-button");
      button.type = "button";
      button.dataset.stageId = stage.id;
      button.setAttribute("aria-pressed", String(stage.id === selectedJourneyId));
      button.appendChild(create("span", "journey-index", String(index + 1).padStart(2, "0")));
      button.appendChild(create("span", "journey-label", stage.journeyLabel));
      const stateText = state === "current" ? "You are here" : state === "completed" ? "✓ Earlier calendar stage" : "Upcoming";
      button.appendChild(create("span", "journey-state", stateText));
      if (COURSE_EVENTS.some(function (event) { return event.gate && Array.isArray(event.stageIds) && event.stageIds.includes(stage.id); })) {
        button.appendChild(create("span", "journey-gate", "◆ Project gate"));
      }
      button.addEventListener("click", function () {
        selectedJourneyId = stage.id;
        renderJourney(currentStage);
      });
      item.appendChild(button);
      list.appendChild(item);
    });
    renderJourneyDetail(stages.find(function (stage) { return stage.id === selectedJourneyId; }));
  }

  function typeName(type) { return RESOURCE_TYPE_LABELS[type] || type; }

  function isValidResourceUrl(url) {
    if (typeof url !== "string" || !url.trim()) return false;
    try {
      const parsed = new URL(url);
      return parsed.protocol === "https:" || parsed.protocol === "http:";
    } catch (error) {
      return false;
    }
  }

  function renderResources(stage) {
    const list = byId("resources-list");
    const resources = utils.getResourcesForStage(stage, activeDate, selectedPathway);
    byId("resources-intro").textContent = "Materials selected for the " + stage.title.toLowerCase() + " stage.";
    list.replaceChildren();
    resources.forEach(function (resource) {
      const item = create("li");
      const resourceType = typeName(resource.type).toUpperCase();
      let content;
      if (isValidResourceUrl(resource.url)) {
        content = create("a", "resource-link");
        content.href = resource.url;
        content.target = "_blank";
        content.rel = "noopener noreferrer";
        content.setAttribute("aria-label", resource.label + " — " + resourceType + ", opens in a new tab");
        content.appendChild(create("span", "resource-label", resource.label));
        content.appendChild(create("span", "resource-meta", resourceType + " · Open in Canvas (new tab)"));
      } else {
        content = create("div", "resource-unavailable");
        content.appendChild(create("span", "resource-label", resource.label));
        content.appendChild(create("span", "resource-meta", resourceType + " · Canvas link to be added"));
      }
      item.appendChild(content);
      list.appendChild(item);
    });
  }

  function renderEventRow(event) {
    const item = create("li", "event-row" + (event.gate ? " is-gate" : ""));
    item.appendChild(create("div", "event-date", formatEventDate(event, true)));
    const content = create("div", "event-content");
    content.appendChild(create("h3", null, event.title));
    const badges = create("div", "event-badges");
    appendEventBadges(badges, event, true);
    content.appendChild(badges);
    if (event.context && (event.gate || event.status || event.type === "break" || event.id === "pulse-2027-01-31")) {
      content.appendChild(create("p", "event-context", event.context));
    }
    item.appendChild(content);
    return item;
  }

  function renderUpcoming(upcoming) {
    const list = byId("upcoming-list");
    list.replaceChildren();
    if (!upcoming.length) {
      const item = create("li", "empty-state", "The formal practicum timeline is complete. There are no further dated course activities.");
      list.appendChild(item);
      return;
    }
    upcoming.slice(0, 7).forEach(function (event) { list.appendChild(renderEventRow(event)); });
  }

  function renderTimeline() {
    const container = byId("full-timeline");
    container.replaceChildren();
    const resolvedEvents = COURSE_EVENTS.map(function (event) { return utils.resolveEventForPathway(event, selectedPathway); });
    MONTH_KEYS.forEach(function (monthKey, index) {
      const monthEvents = resolvedEvents.filter(function (event) {
        return (event.date && event.date.slice(0, 7) === monthKey) || (!event.date && event.month === monthKey);
      }).slice().sort(function (a, b) {
        if (!a.date) return 1;
        if (!b.date) return -1;
        return a.date.localeCompare(b.date) || a.id.localeCompare(b.id);
      });
      const section = create("section", "timeline-month");
      section.appendChild(create("h3", null, MONTH_NAMES[index]));
      const list = create("ol", "timeline-items");
      monthEvents.forEach(function (event) {
        const item = create("li", "timeline-item");
        item.appendChild(create("div", "timeline-date", formatEventDate(event, false)));
        const content = create("div");
        content.appendChild(create("div", "timeline-title", event.title));
        const badges = create("div", "timeline-meta");
        appendEventBadges(badges, event, true);
        content.appendChild(badges);
        if (event.details) content.appendChild(create("p", "timeline-context", event.details));
        if (event.location) content.appendChild(create("p", "timeline-context", "Location: " + event.location));
        if (event.context) content.appendChild(create("p", "timeline-context", event.context));
        item.appendChild(content);
        list.appendChild(item);
      });
      section.appendChild(list);
      container.appendChild(section);
    });
  }

  function readStoredPathway() {
    try {
      return utils.normalizePathway(window.localStorage.getItem(COURSE_CONFIG.pathwayStorageKey));
    } catch (error) {
      return "not-confirmed";
    }
  }

  function storePathway(pathwayId) {
    try {
      window.localStorage.setItem(COURSE_CONFIG.pathwayStorageKey, pathwayId);
    } catch (error) {
      // Local persistence is optional; the Navigator remains fully usable without it.
    }
  }

  function updatePathway(pathwayId, announce) {
    selectedPathway = utils.normalizePathway(pathwayId);
    byId("pathway-select").value = selectedPathway;
    storePathway(selectedPathway);
    updateDate(activeDate, false);
    if (announce) byId("date-announcer").textContent = "Project pathway view updated to " + PROJECT_PATHWAYS[selectedPathway].label + ".";
  }

  function setupPathwaySelector() {
    const previewPathway = previewMode ? query.get("pathway") : null;
    selectedPathway = PROJECT_PATHWAYS[previewPathway] ? previewPathway : readStoredPathway();
    const select = byId("pathway-select");
    select.value = selectedPathway;
    select.addEventListener("change", function (event) { updatePathway(event.target.value, true); });
  }

  function updateDate(nextDate, announce) {
    if (!utils.isValidDate(nextDate)) return;
    activeDate = nextDate;
    const stage = utils.getStage(activeDate);
    const upcoming = utils.getUpcomingEvents(activeDate, 7, selectedPathway);
    const nextEvent = upcoming[0] || null;
    const nextGate = utils.getNextGate(activeDate, selectedPathway);
    renderHero(stage, nextEvent);
    renderNextGate(nextGate);
    renderProjectCondition(stage);
    renderPositioning(stage, upcoming);
    renderJourney(stage);
    renderResources(stage);
    renderUpcoming(upcoming);
    renderTimeline();
    if (previewMode) {
      byId("preview-date").value = activeDate;
      const url = new URL(window.location.href);
      url.searchParams.set("preview", "1");
      url.searchParams.set("date", activeDate);
      url.searchParams.set("pathway", selectedPathway);
      window.history.replaceState({}, "", url);
    }
    if (announce) byId("date-announcer").textContent = "Course navigator updated for " + formatDate(activeDate) + ". Current stage: " + stage.title + ".";
  }

  function setupPreview() {
    if (!previewMode) return;
    byId("preview-bar").hidden = false;
    const requestedDate = query.get("date");
    if (utils.isValidDate(requestedDate)) activeDate = requestedDate;
    byId("preview-date").addEventListener("change", function (event) { updateDate(event.target.value, true); });
    byId("today-button").addEventListener("click", function () { updateDate(utils.getVancouverToday(), true); });
    byId("preview-shortcut").addEventListener("change", function (event) {
      if (utils.isValidDate(event.target.value)) updateDate(event.target.value, true);
    });
  }

  function setupFnisLogo() {
    const logo = byId("fnis-logo");
    const fallback = byId("fnis-logo-fallback");
    if (!logo || !fallback) return;
    logo.addEventListener("load", function () {
      if (logo.naturalWidth > 0) {
        logo.hidden = false;
        fallback.remove();
      }
    });
    logo.addEventListener("error", function () {
      logo.hidden = true;
      fallback.hidden = false;
    });
    logo.src = logo.dataset.src;
  }

  function setupTimelineToggle() {
    const details = byId("timeline-details");
    const toggle = byId("timeline-toggle");
    const action = byId("timeline-action");
    if (!details || !toggle || !action) return;
    const syncState = function () {
      const expanded = Boolean(details.open);
      toggle.setAttribute("aria-expanded", String(expanded));
      action.textContent = expanded ? "Hide dates −" : "View all dates +";
    };
    details.addEventListener("toggle", syncState);
    syncState();
  }

  setupFnisLogo();
  setupPathwaySelector();
  setupPreview();
  setupTimelineToggle();
  byId("last-updated").textContent = COURSE_CONFIG.lastUpdated;
  updateDate(activeDate, false);
})();
