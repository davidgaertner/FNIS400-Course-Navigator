/*
 * FNIS 400 COURSE MAINTAINERS
 * COURSE_STAGES provides calendar orientation only and never infers project completion.
 * COURSE_EVENTS contains dated teaching activity, gates, and active windows.
 * COURSE_RESOURCES is the canonical Canvas registry; blank URLs are intentional.
 * COURSE_RESOURCE_CONTEXTS selects resources by course stage, date, and pathway.
 * PROJECT_STATE_DEFINITIONS controls the optional local project-status selectors.
 * Dates are YYYY-MM-DD calendar dates, never timestamps.
 */
(function (root, factory) {
  var data = factory();
  if (typeof module === "object" && module.exports) module.exports = data;
  root.FNIS400 = data;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const COURSE_CONFIG = {
    timezone: "America/Vancouver", title: "FNIS 400 Practicum Course Navigator", academicYear: "2026–27",
    lastUpdated: "September 8, 2026", resourceDisplayLimit: 5, pathwayRelevantFrom: "2026-10-14",
    pathwayStorageKey: "fnis400-confirmed-project-pathway", projectStateStorageKey: "fnis400-project-status-v1",
    provisionalLabel: "Pending committee confirmation",
    term2ScheduleNotice: "The Term 2 schedule will be available after the winter break."
  };

  const COURSE_ASSESSMENTS = {
    projectProposal: { label: "Project Proposal", weight: 15 }, researchFoundation: { label: "Research Foundation", weight: 15 },
    communityResearchProcess: { label: "Community Research Process", weight: 20 }, deliverableMilestone: { label: "Deliverable Milestone", weight: 10 },
    communityResearchDeliverables: { label: "Community Research Deliverable(s)", weight: 30 }, communityResearchPresentation: { label: "Community Research Presentation", weight: 10 }
  };

  const COURSE_MODULES = [
    { id: "start-here", title: "Start Here", start: "2026-09-09", stageId: "placement-matching" },
    { id: "partners-projects", title: "This Year's Partners & Projects", start: "2026-09-09", stageId: "placement-matching" },
    { id: "placement-matching", title: "Placement & Matching", start: "2026-09-09", stageId: "placement-matching" },
    { id: "common-research-methods", title: "Common Research Methods", start: "2026-09-23", stageId: "placement-matching" },
    { id: "beginning-partnership", title: "Beginning the Partnership", start: "2026-09-28", stageId: "partnership-scoping" },
    { id: "scoping-project", title: "Scoping Your Project", start: "2026-09-28", stageId: "partnership-scoping" },
    { id: "project-proposals", title: "Project Proposals", start: "2026-10-07", stageId: "partnership-scoping" },
    { id: "research-ethics", title: "Research Ethics", start: "2026-10-14", stageId: "partnership-scoping" },
    { id: "ethics-readiness-development", title: "Ethics Development & Project Readiness", start: "2026-10-21", stageId: "project-development" },
    { id: "quality-control", title: "Quality Control & Submission of Ethics", start: "2026-11-04", stageId: "project-development" },
    { id: "research-foundation", title: "Research Foundation", start: "2026-11-16", stageId: "research-foundation" }
  ];

  const COURSE_RESOURCES = {
    placementMatching: { label: "How Placement & Matching Works", url: "https://canvas.ubc.ca/courses/194371/pages/how-placement-and-matching-works?module_item_id=9519859", type: "page" },
    positionalityGuidance: { label: "Positionality and Introducing Yourself to Partners", url: "https://canvas.ubc.ca/courses/194371/pages/positionality-and-introducing-yourself-to-partners?module_item_id=9519863", type: "page" },
    preparingPartnerFair: { label: "Preparing for the Partner Fair", url: "https://canvas.ubc.ca/courses/194371/pages/preparing-for-the-partner-fair?module_item_id=9519864", type: "page" },
    personalProfile: { label: "Personal Profile", url: "https://canvas.ubc.ca/courses/194371/assignments/2523249?module_item_id=9520212", type: "assignment" },
    positionalityStatement: { label: "Positionality Statement", url: "https://canvas.ubc.ca/courses/194371/assignments/2545452?module_item_id=9601103", type: "assignment" },
    partnerFair: { label: "Partner Fair", url: "https://canvas.ubc.ca/courses/194371/pages/partner-fair?module_item_id=9520215", type: "page" },
    preliminaryInterests: { label: "Preliminary Placement Interests", url: "https://canvas.ubc.ca/courses/194371/assignments/2525739?module_item_id=9520225", type: "assignment" },
    resumeCoverLetter: { label: "Practicum Résumé & Cover Letter", url: "https://canvas.ubc.ca/courses/194371/assignments/2545453?module_item_id=9601106", type: "assignment" },
    targetedInterviews: { label: "Targeted Interviews", url: "https://canvas.ubc.ca/courses/194371/pages/targeted-interviews?module_item_id=9520452", type: "page" },
    finalPlacementRanking: { label: "Final Placement Ranking", url: "https://canvas.ubc.ca/courses/194371/assignments/2526845?module_item_id=9524840", type: "assignment" },
    placementResults: { label: "Placement Results & What Happens Next", url: "https://canvas.ubc.ca/courses/194371/pages/placement-results-and-what-happens-next?module_item_id=9524853", type: "page" },
    scopingProject: { label: "Scoping Your Project", url: "https://canvas.ubc.ca/courses/194371/pages/scoping-your-project?module_item_id=9553456", type: "page" },
    canvasHome: { label: "FNIS 400 Canvas Home", url: "https://canvas.ubc.ca/courses/194371", type: "page" },
    canvasModules: { label: "FNIS 400 Canvas Modules", url: "https://canvas.ubc.ca/courses/194371/modules", type: "module" },
    canvasAssignments: { label: "FNIS 400 Canvas Assignments", url: "https://canvas.ubc.ca/courses/194371/assignments", type: "page" },
    startHere: { label: "Welcome to FNIS 400", url: "https://canvas.ubc.ca/courses/194371/pages/welcome-to-fnis-400?module_item_id=9518046", type: "page" },
    howWeWork: { label: "How We Work in FNIS 400", url: "https://canvas.ubc.ca/courses/194371/pages/how-we-work-in-fnis-400", type: "page" },
    workingCommunityPartners: { label: "Working with Community Partners", url: "https://canvas.ubc.ca/courses/194371/pages/working-with-community-partners", type: "page" },
    deadlinesGatesBlockedWork: { label: "Deadlines, Project Gates, and Blocked Work", url: "https://canvas.ubc.ca/courses/194371/pages/deadlines-project-gates-and-blocked-work", type: "page" },
    howUseCanvas: { label: "How to Use This Canvas Site", url: "https://canvas.ubc.ca/courses/194371/pages/how-to-use-this-canvas-site", type: "page" },
    conceptsTerms: { label: "Concepts and Terms Used Regularly in FNIS 400", url: "https://canvas.ubc.ca/courses/194371/pages/concepts-and-terms-used-regularly-in-fnis-400", type: "page" },
    partnersProjects: { label: "How to Read the Partner Project Proposals", url: "https://canvas.ubc.ca/courses/194371/pages/how-to-read-the-partner-project-proposals?module_item_id=9677368", type: "page" },
    beginningPartnership: { label: "Starting Your Placement", url: "https://canvas.ubc.ca/courses/194371/pages/starting-your-placement", type: "page" },
    commonResearchMethods: { label: "Common Research Methods module", url: "https://canvas.ubc.ca/courses/194371/modules", type: "module" },
    whatWeMeanScoping: { label: "What We Mean by Scoping", url: "https://canvas.ubc.ca/courses/194371/pages/what-we-mean-by-scoping?module_item_id=9553401", type: "page" },
    bullseyeScope: { label: "Bullseye / Core Commitment", url: "https://canvas.ubc.ca/courses/194371/assignments/2535293?module_item_id=9559763", type: "assignment" },
    scopeSnapshot: { label: "Building Your Scope Snapshot", url: "https://canvas.ubc.ca/courses/194371/pages/building-your-scope-snapshot?module_item_id=9560522", type: "page" },
    partnerScopeCheck: { label: "Checking the Scope with Your Partner", url: "https://canvas.ubc.ca/courses/194371/pages/checking-the-scope-with-your-partner?module_item_id=9560529", type: "page" },
    projectBoardReference: { label: "Project Board Reference", url: "https://canvas.ubc.ca/courses/194371/pages/project-board-reference-page", type: "page" },
    projectBoardSetup: { label: "Project Board Setup", url: "https://canvas.ubc.ca/courses/194371/pages/project-board-setup", type: "page" },
    proposalTimeline: { label: "Project Proposal Timeline & Review Sequence", url: "https://canvas.ubc.ca/courses/194371/pages/project-proposal-timeline-and-review-sequence-2?module_item_id=9677349", type: "page" },
    proposalTemplate: { label: "Project Proposal Template", url: "https://canvas.ubc.ca/courses/194371/files/47490356?module_item_id=9533606", type: "file" },
    proposalExamples: { label: "Completed Proposal Examples", url: "https://canvas.ubc.ca/courses/194371/assignments/2548828?module_item_id=9614450", type: "assignment" },
    researchEthics: { label: "Research Ethics Timeline & Review Sequence", url: "https://canvas.ubc.ca/courses/194371/pages/research-ethics-timeline-and-review-sequence?module_item_id=9677346", type: "page" },
    ethicsPathwayGuide: { label: "What Determines Your Ethics Pathway?", url: "https://canvas.ubc.ca/courses/194371/pages/what-determines-your-ethics-pathway?module_item_id=9538895", type: "page" },
    behaviouralPathway: { label: "How the Behavioural Research Pathway Works", url: "https://canvas.ubc.ca/courses/194371/pages/how-the-behavioural-research-pathway-works", type: "page" },
    consentGuidance: { label: "Consent", url: "https://canvas.ubc.ca/courses/194371/pages/consent?module_item_id=9539227", type: "page" },
    recruitmentGuidance: { label: "Recruitment", url: "https://canvas.ubc.ca/courses/194371/pages/recruitment?module_item_id=9539320", type: "page" },
    behaviouralDataCollection: { label: "Behavioural Research: Data Collection", url: "https://canvas.ubc.ca/courses/194371/pages/data-collection?module_item_id=9566247", type: "page" },
    riskVulnerabilityGuide: { label: "Risk & Vulnerability", url: "https://canvas.ubc.ca/courses/194371/pages/risk-and-vulnerability?module_item_id=9542640", type: "page" },
    storingData: { label: "Storing Your Data", url: "https://canvas.ubc.ca/courses/194371/pages/storing-your-data?module_item_id=9568013", type: "page" },
    archivalPathway: { label: "How the Archival Research Pathway Works", url: "https://canvas.ubc.ca/courses/194371/pages/how-the-archival-research-pathway-works", type: "page" },
    archivalPermissions: { label: "Access & Custodianship", url: "https://canvas.ubc.ca/courses/194371/pages/access-and-custodianship?module_item_id=9568019", type: "page" },
    programEvaluationPathway: { label: "How the Program Evaluation Pathway Works", url: "https://canvas.ubc.ca/courses/194371/pages/how-the-program-evaluation-pathway-works", type: "page" },
    participationAgreement: { label: "Participation & Consent", url: "https://canvas.ubc.ca/courses/194371/pages/participation-and-consent?module_item_id=9567853", type: "page" },
    programEvaluationDataCollection: { label: "Program Evaluation: Data Collection", url: "https://canvas.ubc.ca/courses/194371/pages/data-collection-2", type: "page" },
    noFormalReviewPathway: { label: "How the No Formal Review Pathway Works", url: "https://canvas.ubc.ca/courses/194371/pages/how-the-no-formal-review-pathway-works", type: "page" },
    informationUsePermissions: { label: "Representation, Attribution & Re-Circulation", url: "https://canvas.ubc.ca/courses/194371/pages/representation-attribution-and-re-circulation?module_item_id=9593343", type: "page" },
    ethicsReadinessDevelopment: { label: "Ethics Development & Project Readiness module", url: "https://canvas.ubc.ca/courses/194371/modules", type: "module" },
    qualityControlSubmission: { label: "Preparing for the Quality-Control Seminar", url: "https://canvas.ubc.ca/courses/194371/pages/preparing-for-the-quality-control-seminar", type: "page" },
    projectReadinessCheck: { label: "Project Readiness Check", url: "https://canvas.ubc.ca/courses/194371/pages/project-readiness-check", type: "page" },
    finalAssemblyReadiness: { label: "Final Assembly & Readiness Check", url: "https://canvas.ubc.ca/courses/194371/assignments/2571537?module_item_id=9706121", type: "assignment" },
    formalEthicsSubmission: { label: "Formal Ethics Submission, Where Required", url: "https://canvas.ubc.ca/courses/194371/assignments/2571538?module_item_id=9706122", type: "assignment" },
    projectReadinessConfirmation: { label: "Project-Readiness Confirmation", url: "https://canvas.ubc.ca/courses/194371/pages/project-readiness-confirmation?module_item_id=9706123", type: "page" },
    dataStewardship: { label: "Data Stewardship", url: "https://canvas.ubc.ca/courses/194371/pages/data-stewardship?module_item_id=9567857", type: "page" },
    foundationAssignment: { label: "Research Foundation Group A", url: "https://canvas.ubc.ca/courses/194371/assignments/2541335?module_item_id=9584132", type: "assignment" },
    researchSupportDirectory: { label: "Finding Resources That Are Useful to the Project", url: "https://canvas.ubc.ca/courses/194371/pages/finding-resources-that-are-useful-to-the-project?module_item_id=9578715", type: "page" },
    xwi7xwaPreparation: { label: "X̱wi7x̱wa Search Preparation", url: "https://canvas.ubc.ca/courses/194371/assignments/2540228?module_item_id=9579412", type: "assignment" },
    collaborativeDesignIteration: { label: "How Collaborative Design and Iteration Works", url: "https://canvas.ubc.ca/courses/194371/pages/how-collaborative-design-and-iteration-works", type: "page" }
  };

  function refs(ids, priority) { return ids.map(function (resourceId, index) { return { resourceId: resourceId, priority: (priority || 90) - index }; }); }

  const COURSE_RESOURCE_CONTEXTS = {
    placement: [
      { resourceId: "startHere", usefulPeriods: [{ until: "2026-09-13", priority: 120 }] },
      { resourceId: "personalProfile", usefulPeriods: [{ until: "2026-09-14", priority: 115 }] },
      { resourceId: "positionalityGuidance", usefulPeriods: [{ until: "2026-09-16", priority: 110 }] },
      { resourceId: "positionalityStatement", usefulPeriods: [{ until: "2026-09-16", priority: 105 }] },
      { resourceId: "placementMatching", usefulPeriods: [{ until: "2026-09-24", priority: 100 }] },
      { resourceId: "preparingPartnerFair", usefulPeriods: [{ from: "2026-09-15", until: "2026-09-16", priority: 125 }] },
      { resourceId: "partnerFair", usefulPeriods: [{ from: "2026-09-15", until: "2026-09-16", priority: 120 }] },
      { resourceId: "preliminaryInterests", usefulPeriods: [{ from: "2026-09-17", until: "2026-09-20", priority: 125 }] },
      { resourceId: "resumeCoverLetter", usefulPeriods: [{ from: "2026-09-17", until: "2026-09-21", priority: 120 }] },
      { resourceId: "targetedInterviews", usefulPeriods: [{ from: "2026-09-17", until: "2026-09-24", priority: 122 }] },
      { resourceId: "finalPlacementRanking", usefulPeriods: [{ from: "2026-09-21", until: "2026-09-24", priority: 124 }] },
      { resourceId: "partnersProjects", usefulPeriods: [{ from: "2026-09-09", until: "2026-09-16", priority: 92 }] },
      { resourceId: "commonResearchMethods", usefulPeriods: [{ from: "2026-09-23", until: "2026-09-24", priority: 123 }] },
      { resourceId: "canvasModules", priority: 40 }
    ],
    partnership: refs(["placementResults", "beginningPartnership", "workingCommunityPartners", "scopingProject", "positionalityGuidance"], 110),
    scoping: [
      { resourceId: "bullseyeScope", usefulPeriods: [{ from: "2026-10-01", until: "2026-10-07", priority: 125 }] },
      { resourceId: "scopeSnapshot", usefulPeriods: [{ from: "2026-10-05", until: "2026-10-16", priority: 124 }] },
      { resourceId: "partnerScopeCheck", usefulPeriods: [{ from: "2026-10-07", until: "2026-10-20", priority: 123 }] },
      { resourceId: "whatWeMeanScoping", priority: 115 },
      { resourceId: "scopingProject", priority: 126 }, { resourceId: "commonResearchMethods", priority: 105 }
    ],
    proposal: refs(["proposalTimeline", "proposalTemplate", "proposalExamples", "scopingProject"], 125),
    researchEthics: [
      { resourceId: "researchEthics", priority: 130 }, { resourceId: "ethicsPathwayGuide", priority: 129 },
      { resourceId: "dataStewardship", priority: 100 }
    ],
    ethicsPathway: [
      { resourceId: "ethicsPathwayGuide", priority: 129 },
      { resourceId: "behaviouralPathway", pathways: ["behavioural"], priority: 128 }, { resourceId: "archivalPathway", pathways: ["archival"], priority: 128 },
      { resourceId: "programEvaluationPathway", pathways: ["program-evaluation"], priority: 128 }, { resourceId: "noFormalReviewPathway", pathways: ["no-formal-review"], priority: 128 },
      { resourceId: "dataStewardship", priority: 100 }
    ],
    ethicsDevelopment: [
      { resourceId: "ethicsReadinessDevelopment", priority: 141 },
      { resourceId: "behaviouralPathway", pathways: ["behavioural"], priority: 140 },
      { resourceId: "consentGuidance", pathways: ["behavioural"], priority: 139 },
      { resourceId: "recruitmentGuidance", pathways: ["behavioural"], priority: 138 },
      { resourceId: "behaviouralDataCollection", pathways: ["behavioural"], priority: 137 },
      { resourceId: "riskVulnerabilityGuide", pathways: ["behavioural"], priority: 136 },
      { resourceId: "storingData", pathways: ["behavioural"], priority: 135 },
      { resourceId: "archivalPathway", pathways: ["archival"], priority: 140 },
      { resourceId: "archivalPermissions", pathways: ["archival"], priority: 139 },
      { resourceId: "programEvaluationPathway", pathways: ["program-evaluation"], priority: 140 },
      { resourceId: "participationAgreement", pathways: ["program-evaluation"], priority: 139 },
      { resourceId: "programEvaluationDataCollection", pathways: ["program-evaluation"], priority: 138 },
      { resourceId: "noFormalReviewPathway", pathways: ["no-formal-review"], priority: 140 },
      { resourceId: "informationUsePermissions", pathways: ["no-formal-review"], priority: 139 },
      { resourceId: "projectReadinessConfirmation", pathways: ["program-evaluation", "no-formal-review"], priority: 137 },
      { resourceId: "dataStewardship", pathways: ["archival", "program-evaluation", "no-formal-review"], priority: 136 },
      { resourceId: "projectBoardReference", usefulPeriods: [{ from: "2026-10-19", priority: 129 }] },
      { resourceId: "projectBoardSetup", usefulPeriods: [{ from: "2026-10-19", priority: 128 }] }
    ],
    quality: [
      { resourceId: "qualityControlSubmission", priority: 150 }, { resourceId: "finalAssemblyReadiness", priority: 149 },
      { resourceId: "formalEthicsSubmission", pathways: ["behavioural"], priority: 148 },
      { resourceId: "projectReadinessCheck", pathways: ["program-evaluation", "no-formal-review"], priority: 148 },
      { resourceId: "projectReadinessConfirmation", pathways: ["program-evaluation", "no-formal-review"], priority: 147 },
      { resourceId: "archivalPathway", pathways: ["archival"], priority: 148 },
      { resourceId: "proposalTimeline", priority: 145 }, { resourceId: "projectBoardReference", priority: 120 }
    ],
    foundation: refs(["foundationAssignment", "xwi7xwaPreparation", "researchSupportDirectory"], 120),
    development: refs(["collaborativeDesignIteration", "projectBoardReference", "projectBoardSetup"], 110),
    milestone: refs(["projectBoardReference", "collaborativeDesignIteration"], 110),
    partnerReview: refs(["projectBoardReference", "collaborativeDesignIteration"], 110),
    closeout: []
  };

  const PROJECT_PATHWAYS = {
    "not-confirmed": { label: "Not yet confirmed", conceptualPathway: null },
    behavioural: { label: "Behavioural Research", conceptualPathway: "Behavioural Research" },
    archival: { label: "Archival Research", conceptualPathway: "Archival Research" },
    "program-evaluation": { label: "Program Evaluation", conceptualPathway: "Research that does not require formal review" },
    "no-formal-review": { label: "No Formal Review", conceptualPathway: "Research that does not require formal review" }
  };

  const PROJECT_STATE_DEFINITIONS = {
    scope: { label: "Scope", defaultValue: "emerging", values: {
      emerging: { label: "Emerging", condition: "Developing" }, "core-commitment": { label: "Core Commitment identified", condition: "Developing" },
      "partner-checked": { label: "Partner-checked", condition: "On track" }
    } },
    proposal: { label: "Project Proposal", defaultValue: "not-started", values: {
      "not-started": { label: "Not started", condition: "Not yet active" }, drafting: { label: "Drafting", condition: "Developing" },
      "complete-draft": { label: "Complete draft", condition: "Waiting" }, "revisions-required": { label: "Revisions required", condition: "Action required" },
      cleared: { label: "Cleared", condition: "On track" }, "final-signed": { label: "Final signed", condition: "On track" }
    } },
    ethics: { label: "Ethics / Readiness", defaultValue: "pathway-not-confirmed", values: {
      "pathway-not-confirmed": { label: "Pathway not confirmed", condition: "Blocked" }, developing: { label: "Developing", condition: "Developing" },
      "quality-control": { label: "Quality Control", condition: "Developing" }, "submitted-determined": { label: "Submitted / Determined", condition: "Waiting" },
      provisos: { label: "Provisos", condition: "Blocked" }, "ready-conditions": { label: "Ready with conditions", condition: "Ready with conditions" },
      ready: { label: "Ready", condition: "On track" }
    } },
    board: { label: "Project Board", defaultValue: "not-activated", values: {
      "not-activated": { label: "Not yet activated", condition: "Not yet active" }, active: { label: "Active", condition: "Active" }
    } }
  };
  const DEFAULT_PROJECT_STATE = { scope: "emerging", proposal: "not-started", ethics: "pathway-not-confirmed", board: "not-activated" };

  // Route-specific presentation for the compact, stable Ethics / Readiness state IDs.
  // Keep the stored IDs stable; edit labels or allowed choices here as course language changes.
  const ETHICS_STATUS_PRESENTATION = {
    "not-confirmed": {
      allowed: ["pathway-not-confirmed"],
      labels: { "pathway-not-confirmed": "Pathway not confirmed" }
    },
    behavioural: {
      allowed: ["developing", "quality-control", "submitted-determined", "provisos", "ready"],
      labels: {
        developing: "Ethics materials in development",
        "quality-control": "Quality Control",
        "submitted-determined": "Formal ethics submission made",
        provisos: "Provisos received / in progress",
        ready: "Formal approval received"
      }
    },
    archival: {
      allowed: ["developing", "quality-control", "submitted-determined", "provisos", "ready-conditions", "ready"],
      labels: {
        developing: "Archival ethics / permissions in development",
        "quality-control": "Quality Control",
        "submitted-determined": "Applicable review / readiness step complete",
        provisos: "Conditions or revisions received / in progress",
        "ready-conditions": "Permissions / readiness conditions recorded",
        ready: "Applicable permissions / readiness conditions satisfied"
      }
    },
    "program-evaluation": {
      allowed: ["developing", "quality-control", "submitted-determined", "ready-conditions", "ready"],
      labels: {
        developing: "Project-Readiness materials in development",
        "quality-control": "Quality Control",
        "submitted-determined": "Project-Readiness determination made",
        "ready-conditions": "Ready with Conditions",
        ready: "Ready to Proceed"
      }
    },
    "no-formal-review": {
      allowed: ["developing", "quality-control", "submitted-determined", "ready-conditions", "ready"],
      labels: {
        developing: "Project-Readiness materials in development",
        "quality-control": "Quality Control",
        "submitted-determined": "Project-Readiness determination made",
        "ready-conditions": "Ready with Conditions",
        ready: "Ready to Proceed"
      }
    }
  };

  const COURSE_STAGES = [
    { id: "before", start: null, end: "2026-09-08", title: "Preparing to begin", journeyId: "placement-matching", description: "FNIS 400 begins September 9 with orientation and the Placement & Matching process.", resourceTimeline: [{ groups: ["placement"] }] },
    { id: "placement-matching", start: "2026-09-09", end: "2026-09-24", title: "Placement & Matching", journeyId: "placement-matching", description: "You are moving through a reciprocal matching process that connects project fit, relationship fit, professional materials, interviews, and placement confirmation.", resourceTimeline: [{ groups: ["placement"] }] },
    { id: "partnership-scoping", start: "2026-09-25", end: "2026-10-20", title: "Partnership & Scoping", journeyId: "partnership-scoping", description: "You are moving from an initial partner-defined project toward a partner-checked scope that can support the Project Proposal and later ethics decisions.", resourceTimeline: [
      { until: "2026-10-06", groups: ["partnership", "scoping"] }, { from: "2026-10-07", until: "2026-10-13", groups: ["scoping", "proposal"] },
      { from: "2026-10-14", groups: ["researchEthics", "proposal", "ethicsPathway"] }
    ] },
    { id: "project-development", start: "2026-10-21", end: "2026-11-15", title: "Project Development + Ethics / Readiness", journeyId: "proposal-ethics", description: "Project Proposal, partner consultation, and pathway-specific ethics or readiness work are being developed as one coherent project system.", resourceTimeline: [
      { until: "2026-11-03", groups: ["ethicsDevelopment", "proposal", "ethicsPathway"] }, { from: "2026-11-04", groups: ["quality", "ethicsDevelopment"] }
    ] },
    { id: "research-foundation", start: "2026-11-16", end: "2026-12-01", title: "Research Foundation", journeyId: "research-foundation", description: "You are building a project-specific knowledge base that informs decisions, design, interpretation, and next steps. This is not a literature review or an annotated bibliography.", resourceTimeline: [{ groups: ["foundation"] }] },
    { id: "term1-transition", start: "2026-12-02", end: "2026-12-07", title: "Term 1 Transition", journeyId: "term1-transition", description: "You are taking stock of what is complete, what remains conditional, and what needs to happen next before the winter break.", resourceTimeline: [{ groups: ["foundation", "quality"] }] },
    { id: "term2", start: "2026-12-08", end: "2027-04-12", title: "Term 2", journeyId: "term2-development", description: "Known high-level Practicum milestones remain visible below.", term2Limited: true, resourceTimeline: [
      { until: "2027-01-20", groups: ["foundation"] }, { from: "2027-01-21", until: "2027-01-31", groups: ["development"] },
      { from: "2027-02-01", until: "2027-02-10", groups: ["milestone"] }, { from: "2027-02-11", until: "2027-03-07", groups: ["development"] },
      { from: "2027-03-08", until: "2027-03-24", groups: ["partnerReview"] }, { from: "2027-03-25", groups: ["closeout"] }
    ] },
    { id: "complete", start: "2027-04-13", end: null, title: "Practicum timeline complete", journeyId: "handoff-closeout", description: "The formal FNIS 400 practicum timeline is complete.", resourceTimeline: [{ groups: ["closeout"] }] }
  ];

  const JOURNEY_STAGES = [
    { id: "placement-matching", label: "Placement & Matching", description: "Reciprocal fit, professional materials, interviews, ranking, and placement confirmation.", from: "2026-09-09", until: "2026-09-24" },
    { id: "partnership-scoping", label: "Partnership & Scoping", description: "Emerging project map, Core Commitment, Scope Snapshot, and partner-checked scope.", from: "2026-09-25", until: "2026-10-20" },
    { id: "proposal-ethics", label: "Proposal + Ethics / Readiness", description: "The Proposal formalizes the agreement while pathway-specific conditions for proceeding are developed and reviewed.", from: "2026-10-21", until: "2026-11-15", gate: "Final signed Proposal and ethics / readiness gate" },
    { id: "research-foundation", label: "Research Foundation", description: "A project-specific knowledge base informs decisions, design, interpretation, and next steps.", from: "2026-11-16", until: "2026-12-01" },
    { id: "term1-transition", label: "Term 1 Transition", description: "Account for what is complete, conditional, unresolved, and next before the winter break.", from: "2026-12-02", until: "2026-12-07" },
    { id: "term2-development", label: "Term 2 Development", description: "Known high-level milestones remain visible. The detailed Term 2 schedule will be available after the winter break.", from: "2026-12-08", until: "2027-03-07" },
    { id: "partner-review", label: "Partner Review", description: "Partner-facing review and revision before final handoff.", from: "2027-03-08", until: "2027-03-24", gate: "Partner-review draft" },
    { id: "handoff-closeout", label: "Handoff + Closeout", description: "Final transfer, public accounting, presentation, and responsible project closeout.", from: "2027-03-25", until: "2027-04-12", gate: "Community Research Deliverable(s)" }
  ];

  const COURSE_EVENTS = [
    { id: "labour-day", date: "2026-09-07", title: "Labour Day", type: "no-class", details: "University closed. No tutorial.", stageIds: ["placement-matching"] },
    { id: "course-orientation", date: "2026-09-09", title: "Start Here + This Year's Partners & Projects + Placement & Matching", type: "seminar", action: "Build a shared map of the Practicum, examine this year's projects, and begin assessing project and relationship fit.", outcome: "Understand how placement, partnership, Proposal, ethics, research, deliverable, and handoff connect.", stageIds: ["placement-matching"] },
    { id: "placement-tutorial", date: "2026-09-14", order: 1, title: "Placement & Matching", type: "tutorial", details: "Bring your Personal Profile, positionality introduction, project information, and partner questions.", outcome: "Leave with a submitted Personal Profile, refined introduction, and Partner Fair questions.", stageIds: ["placement-matching"] },
    { id: "personal-profile-due", date: "2026-09-14", order: 2, title: "Personal Profile due", type: "deadline", stageIds: ["placement-matching"] },
    { id: "partner-fair", date: "2026-09-16", title: "Partner Fair", type: "seminar", action: "Meet prospective partners, learn how they describe their priorities and projects, and assess project and relationship fit.", outcome: "Identify placements you would seriously consider and gather information for Preliminary Placement Interests and interviews.", stageIds: ["placement-matching"] },
    { id: "preliminary-placement-interests", date: "2026-09-18", title: "Preliminary Placement Interests", type: "deadline", action: "Identify three unranked placements you would seriously consider and briefly explain why.", stageIds: ["placement-matching"] },
    { id: "placement-tutorial-materials", date: "2026-09-21", order: 1, title: "Placement & Matching", type: "tutorial", details: "Bring your résumé, tailored cover letter material, Partner Fair notes, and interview information.", outcome: "Leave with send-ready application materials, prepared interview questions and examples, and a plan for final ranking.", stageIds: ["placement-matching"] },
    { id: "resume-cover-letter-due", date: "2026-09-21", timeLabel: "noon", order: 2, title: "Practicum Résumé & Tailored Cover Letter(s)", type: "deadline", action: "Upload to Canvas and email relevant partner organization(s), copying the teaching team.", stageIds: ["placement-matching"] },
    { id: "two-way-interviews", date: "2026-09-21", endDate: "2026-09-24", order: 3, title: "Two-Way Interview Window", type: "partnership-action", action: "Complete at least one targeted interview with a prospective partner.", context: "This gives both student and partner an opportunity to assess fit before matching.", stageIds: ["placement-matching"] },
    { id: "common-research-methods", date: "2026-09-23", title: "Common Research Methods", type: "seminar", action: "Work backward from possible research questions to evidence, methods, and eventual outputs.", outcome: "Understand the relationship among purpose, research questions, evidence, methods, and deliverables.", stageIds: ["placement-matching"] },
    { id: "final-placement-ranking", date: "2026-09-24", title: "Final Placement Ranking", type: "deadline", action: "Submit final ranked placement preferences.", stageIds: ["placement-matching"] },
    { id: "placement-confirmation", date: "2026-09-25", order: 1, title: "Placements Announced", type: "milestone", context: "Marks the shift from matching into active partnership development.", stageIds: ["partnership-scoping"] },
    { id: "first-partner-meeting", date: "2026-09-25", order: 2, title: "First Partner Meeting", type: "partnership-action", openEnded: true, condition: { field: "scope", values: ["emerging"] }, action: "Schedule and lead the first partner meeting as soon as reasonably possible. Confirm purpose, roles, communication practices, and early decisions. The teaching team attends the first meeting.", stageIds: ["partnership-scoping"] },
    { id: "beginning-partnership-scoping", date: "2026-09-28", title: "Beginning the Partnership & Scoping Your Project", type: "tutorial", action: "Map the partner-defined need, possible project components, likely boundaries, constraints, and unresolved questions.", outcome: "An emerging project map, not a final Core Commitment.", boundary: true, stageIds: ["partnership-scoping"] },
    { id: "truth-reconciliation-day", date: "2026-09-30", title: "National Day for Truth and Reconciliation", type: "no-class", details: "University closed in lieu. No seminar.", stageIds: ["partnership-scoping"] },
    { id: "bullseye-core-commitment", date: "2026-10-05", title: "Bullseye: Identify Your Core Commitment", type: "tutorial", action: "Distinguish Must Have work from work that can be reduced, deferred, or kept outside scope.", outcome: "A completed Bullseye and concise Core Commitment.", whyNow: "You have begun scoping with your partner. Before formalizing the project in the Proposal, decide which work is truly central.", stageIds: ["partnership-scoping"] },
    { id: "scope-snapshot-proposals", date: "2026-10-07", title: "Scope Snapshot + Project Proposals", type: "seminar", action: "Translate the Bullseye into a concise Scope Snapshot, pressure-test the scope, and begin the Project Proposal.", outcome: "Scope Snapshot ready for partner review and a working Proposal structure.", stageIds: ["partnership-scoping"] },
    { id: "partner-scope-check", date: "2026-10-09", endDate: "2026-10-16", title: "Partner Scope Check", type: "partnership-action", action: "Bring the Scope Snapshot back to the partner and confirm what is central, secondary, reduced, deferred, or outside scope.", outcome: "Partner-checked scope.", stageIds: ["partnership-scoping"] },
    { id: "thanksgiving", date: "2026-10-12", title: "Thanksgiving", type: "no-class", details: "University closed. No tutorial.", stageIds: ["partnership-scoping"] },
    { id: "research-ethics-practicum", date: "2026-10-14", title: "Research Ethics in Practicum", type: "seminar", action: "Distinguish ethical responsibility from formal ethics review and identify issues involving people, information, permissions, risk, relationships, and accountability.", details: "Sarah Flann joins for approximately 45 minutes.", outcome: "Identify ethical issues and questions requiring attention before pathway-specific development.", stageIds: ["partnership-scoping"] },
    { id: "project-board-working-session", date: "2026-10-19", order: 1, title: "Practicum Project Board Working Session", type: "tutorial", action: "Turn the clearer project into an active shared work system with ownership, dependencies, conditions, and next actions.", outcome: "A functioning Project Board. Trello tracks the project, not the research data.", whyNow: "The project should now have a clearer, partner-checked scope, so the Board can track real work rather than hypothetical work.", stageIds: ["partnership-scoping"] },
    { id: "scope-contingency", date: "2026-10-19", order: 2, title: "Partner Scope Check contingency", type: "partnership-action", condition: { field: "scope", values: ["emerging", "core-commitment"] }, context: "Only relevant if partner availability prevented completion during October 9 to 16.", stageIds: ["partnership-scoping"] },
    { id: "ethics-pathways-readiness", date: "2026-10-21", order: 1, title: "Ethics Pathways + Ethics Development & Project Readiness", type: "seminar", action: "The teaching team confirms one of three pathways, then pathway-specific ethics or readiness development begins.", outcome: "Confirmed pathway, pathway-specific materials underway, and unresolved questions prioritized.", whyNow: "Ethics and project-readiness decisions require a sufficiently defined project design to evaluate.", stageIds: ["proposal-ethics"] },
    { id: "partner-ethics-check-in", date: "2026-10-21", endDate: "2026-10-30", order: 2, title: "Partner Ethics & Project-Development Check-In", type: "partnership-action", action: "Check developing ethics, permissions, information handling, project design, and readiness issues with the partner.", stageIds: ["proposal-ethics"] },
    { id: "checkpoint-1", date: "2026-10-23", order: 1, title: "Ethics & Project-Readiness Checkpoint 1", type: "milestone", action: "Complete the first pathway-specific checkpoint and identify unresolved design questions.", stageIds: ["proposal-ethics"] },
    { id: "sarah-office-hours-1", date: "2026-10-23", timeLabel: "11 AM–12 PM", order: 2, title: "Sarah Flann Office Hours", type: "support", stageIds: ["proposal-ethics"] },
    { id: "ethics-readiness-tutorial", date: "2026-10-26", order: 1, title: "Ethics Development & Project Readiness", type: "tutorial", action: "Bring current materials, feedback, and unresolved pathway-specific questions.", outcome: "A more complete and internally consistent package with specific next steps toward November 2.", stageIds: ["proposal-ethics"] },
    { id: "case-conference-a", date: "2026-10-26", order: 2, title: "Group A Ethics Case Conferences", type: "support", stageIds: ["proposal-ethics"] },
    { id: "case-conference-b", date: "2026-10-27", title: "Group B Ethics Case Conferences", type: "support", context: "Targeted support for substantive ethics, permission, methods, consent, information-handling, or project-design issues.", stageIds: ["proposal-ethics"] },
    { id: "proposal-ethics-seminar", date: "2026-10-28", order: 1, title: "Project Proposal & Ethics Development", type: "seminar", action: "Read Proposal and ethics or readiness materials against one another for consistency and resolve design questions.", outcome: "Complete Proposal draft ready for teaching-team review.", stageIds: ["proposal-ethics"] },
    { id: "complete-proposal-draft", date: "2026-10-28", order: 2, title: "Complete Project Proposal Draft", type: "milestone", stageIds: ["proposal-ethics"] },
    { id: "proposal-clearance", date: "2026-10-29", title: "Teaching-Team Proposal Clearance / Revisions", type: "milestone", action: "If cleared, prepare for signatures. If revisions are required, begin them promptly.", stageIds: ["proposal-ethics"] },
    { id: "proposal-revisions", date: "2026-10-30", order: 1, title: "Project Proposal Revisions, if required", type: "milestone", action: "Complete requested revisions. There is no separate checkpoint submission on this date.", stageIds: ["proposal-ethics"] },
    { id: "sarah-office-hours-2", date: "2026-10-30", timeLabel: "2–3 PM", order: 2, title: "Ethics Development & Sarah Flann Office Hours", type: "support", stageIds: ["proposal-ethics"] },
    { id: "ethics-assembly-tutorial", date: "2026-11-02", order: 1, title: "Ethics / Project-Readiness Assembly", type: "tutorial", outcome: "Complete assembled Ethics / Project-Readiness Package Draft ready for November 4.", stageIds: ["proposal-ethics"] },
    { id: "ethics-readiness-package-draft", date: "2026-11-02", order: 2, title: "Complete Ethics / Project-Readiness Package Draft", type: "milestone", stageIds: ["proposal-ethics"] },
    { id: "proposal-to-partner", date: "2026-11-02", order: 3, title: "Project Proposal sent to partner for final review and signature", type: "partnership-action", context: "Sequence: teaching-team clearance, student signs, partner final review and signature, instructor signs last, final file uploaded.", stageIds: ["proposal-ethics"] },
    { id: "quality-control-seminar", date: "2026-11-04", order: 1, title: "Ethics Quality-Control Seminar", type: "seminar", action: "Use the teaching-team-cleared Proposal as the anchor and quality-check the complete package for consistency, completeness, clarity, and unresolved issues.", outcome: "A precise revision record before the final ethics or readiness gate.", stageIds: ["proposal-ethics"] },
    { id: "final-signed-proposal", date: "2026-11-04", timeLabel: "EOD", order: 2, title: "Final Signed Project Proposal", type: "project-gate", weight: "15%", assessmentId: "projectProposal", gate: true, context: "Signature sequence: student, community partner, instructor last. Upload 01B - FINAL SIGNED PROJECT PROPOSAL.", stageIds: ["proposal-ethics"] },
    { id: "substantive-review-cutoff", date: "2026-11-06", title: "Final Substantive Feedback Cutoff", type: "milestone", action: "Raise and resolve remaining substantive questions. Afterward, focus on revision, consistency, assembly, editing, and proofreading.", stageIds: ["proposal-ethics"] },
    { id: "midterm-break", date: "2026-11-09", title: "Midterm Break", type: "no-class", details: "No tutorial.", stageIds: ["proposal-ethics"] },
    { id: "remembrance-day", date: "2026-11-11", title: "Remembrance Day / Midterm Break", type: "no-class", details: "University closed. No seminar.", stageIds: ["proposal-ethics"] },
    { id: "final-assembly-readiness", date: "2026-11-12", title: "Final Assembly & Readiness Check", type: "milestone", action: "Confirm required materials are present, revisions are incorporated consistently, and the package is ready for formal submission or Project-Readiness determination.", stageIds: ["proposal-ethics"] },
    { id: "november-pathway-gate", date: "2026-11-13", timeLabel: "noon", title: "Formal Ethics Submission / Project-Readiness Determination", type: "project-gate", gate: true, provisional: true, context: "Formal submission is not approval. No-formal-review projects receive a course-level readiness determination. Archival conditions depend on the actual project.", stageIds: ["proposal-ethics"] },
    { id: "research-foundation-tutorial", date: "2026-11-16", title: "Research Foundation", type: "tutorial", outcome: "Prioritized project-specific knowledge needs and an organized starting source and material set.", context: "Core question: What does this project need us to understand in order to do the work well?", stageIds: ["research-foundation"] },
    { id: "xwi7xwa-preparation", date: "2026-11-17", timeLabel: "11:59 PM", title: "X̱wi7x̱wa Preparation", type: "deadline", action: "Prepare a 2 to 3 sentence project description, 3 to 5 provisional knowledge needs, what you already have, and 1 to 2 focused search questions.", stageIds: ["research-foundation"] },
    { id: "xwi7xwa-seminar", date: "2026-11-18", title: "Research Foundation + X̱wi7x̱wa Library", type: "seminar", action: "Use provisional knowledge needs and focused search questions to locate project-relevant sources and materials with library support.", outcome: "More precise knowledge needs, a stronger source set, and clearer source rationale.", stageIds: ["research-foundation"] },
    { id: "research-foundation-tutorial-2", date: "2026-11-23", title: "Research Foundation", type: "tutorial", outcome: "A stronger organized source set and emerging synthesis of findings, tensions, limitations, and gaps.", stageIds: ["research-foundation"] },
    { id: "research-foundation-working-session", date: "2026-11-25", title: "Research Foundation Working Session", type: "seminar", action: "Work across sources and distinguish findings, questions for further investigation, limitations or gaps, and possible project decisions.", context: "An identified gap is not automatically an instruction to do more work. A research implication does not automatically become a project decision.", stageIds: ["research-foundation"] },
    { id: "research-foundation-provisos", date: "2026-11-30", order: 1, title: "Research Foundation + Research Ethics Provisos", type: "tutorial", context: "Proviso work takes priority where deadlines conflict.", stageIds: ["research-foundation"] },
    { id: "provisos-module", date: "2026-11-30", order: 2, title: "Research Ethics Provisos module opens", type: "milestone", condition: { field: "ethics", values: ["provisos"] }, stageIds: ["research-foundation"] },
    { id: "proviso-response", date: "2026-11-30", order: 3, title: "Proviso Response & Ethics Approval", type: "project-gate", gate: true, openEnded: true, condition: { field: "ethics", values: ["provisos"] }, action: "Address every proviso, revise every affected document consistently, prepare the required response, and complete final approval steps.", stageIds: ["research-foundation", "term1-transition"] },
    { id: "term-one-wrap", date: "2026-12-02", title: "Research Foundation + Research Ethics Provisos + Term 1 Wrap-Up", type: "seminar", action: "Take stock of the project, continue Research Foundation work, address provisos where applicable, and identify what is complete, conditional, unresolved, and next.", outcome: "Clear end-of-term project status and a practical Term 2 re-entry plan.", stageIds: ["term1-transition"] },
    { id: "term-one-transition", date: "2026-12-07", order: 1, title: "Term 1 Project Work, Research Ethics Provisos & Transition", type: "tutorial", outcome: "Updated project records, outstanding work completed or clearly documented, and a concrete re-entry plan.", stageIds: ["term1-transition"] },
    { id: "last-day-classes", date: "2026-12-07", order: 2, title: "Last day of classes", type: "milestone", stageIds: ["term1-transition"] },
    { id: "foundation-group-a", date: "2027-01-11", title: "Research Foundation: Group A", type: "deadline", weight: "15%", assessmentId: "researchFoundation", stageIds: ["term2-development"] },
    { id: "foundation-group-b", date: "2027-01-18", title: "Research Foundation: Group B", type: "deadline", weight: "15%", assessmentId: "researchFoundation", stageIds: ["term2-development"] },
    { id: "deliverable-milestone", date: "2027-02-01", title: "Deliverable Milestone", type: "milestone", weight: "10%", assessmentId: "deliverableMilestone", stageIds: ["term2-development"] },
    { id: "partner-review-draft", date: "2027-03-08", title: "Draft Deliverable to Community Partner", type: "project-gate", gate: true, context: "The partner is expecting this draft and needs time to review it before final revision.", stageIds: ["partner-review"] },
    { id: "community-research-deliverables", date: "2027-03-25", title: "Community Research Deliverable(s)", type: "project-gate", weight: "30%", assessmentId: "communityResearchDeliverables", gate: true, context: "Final substantive work is handed off according to the project plan.", stageIds: ["handoff-closeout"] },
    { id: "musqueam-presentation", date: null, month: "2027-03", title: "Musqueam Community Presentation Evening", type: "presentation", status: "tbc", context: "March date TBC. Important, but not separately graded.", stageIds: ["handoff-closeout"] },
    { id: "community-research-presentation", date: "2027-04-07", title: "UBC Community Research Presentations", type: "presentation", weight: "10%", assessmentId: "communityResearchPresentation", stageIds: ["handoff-closeout"] },
    { id: "project-closeout-complete", date: "2027-04-12", title: "Project Closeout complete", type: "deadline", context: "Complete all closeout actions within your control and document partner-dependent actions still outstanding.", stageIds: ["handoff-closeout"] }
  ];

  const WEEKLY_DESTINATIONS = [
    { from: "2026-09-07", until: "2026-09-13", text: "Understand the Practicum arc, know how placement will work, and have useful questions to carry into the Partner Fair." },
    { from: "2026-09-14", until: "2026-09-20", text: "Have your Personal Profile submitted, complete the Partner Fair, and identify three placements you would seriously consider." },
    { from: "2026-09-21", until: "2026-09-27", text: "Have your application materials submitted, complete relevant interviews, submit your Final Placement Ranking, and know your confirmed placement by Friday." },
    { from: "2026-09-28", until: "2026-10-04", text: "Have begun the partnership relationship and developed an emerging map of the project's purpose, possible components, constraints, and unresolved questions." },
    { from: "2026-10-05", until: "2026-10-11", text: "Have identified the project's Core Commitment, developed a Scope Snapshot, and be ready to bring the emerging scope back to your partner." },
    { from: "2026-10-12", until: "2026-10-18", text: "Have a stronger understanding of the project's ethical responsibilities and, where possible, have completed the Partner Scope Check." },
    { from: "2026-10-19", until: "2026-10-25", text: "Have a functioning Project Board, a confirmed ethics pathway, pathway-specific materials underway, and Ethics & Project-Readiness Checkpoint 1 completed." },
    { from: "2026-10-26", until: "2026-11-01", text: "Have worked through substantive ethics / readiness questions, completed the Project Proposal draft, and addressed any Proposal revisions required for clearance." },
    { from: "2026-11-02", until: "2026-11-08", text: "Have a complete Ethics / Project-Readiness Package Draft, complete Quality Control, send the cleared Proposal through final signatures, and complete the final signed Proposal gate." },
    { from: "2026-11-09", until: "2026-11-15", text: "Complete final assembly and reach the formal ethics submission / Project-Readiness gate, subject to committee confirmation.", gateDateId: "november-pathway-gate" },
    { from: "2026-11-16", until: "2026-11-22", text: "Have defined project-specific knowledge needs, prepared for the X̱wi7x̱wa session, and begun building a purposeful Research Foundation source set." },
    { from: "2026-11-23", until: "2026-11-29", text: "Have a stronger source set and an emerging synthesis of findings, tensions, limitations, and gaps." },
    { from: "2026-11-30", until: "2026-12-07", text: "Continue Research Foundation synthesis, address ethics provisos if applicable, and develop a clear end-of-term account of what is complete, conditional, unresolved, and next." }
  ];

  function parseDateParts(isoDate) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate || "")) return null;
    const parts = isoDate.split("-").map(Number);
    const utc = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
    if (utc.getUTCFullYear() !== parts[0] || utc.getUTCMonth() !== parts[1] - 1 || utc.getUTCDate() !== parts[2]) return null;
    return { year: parts[0], month: parts[1], day: parts[2] };
  }
  function isValidDate(isoDate) { return Boolean(parseDateParts(isoDate)); }
  function dateOrdinal(isoDate) { const p = parseDateParts(isoDate); return p ? Date.UTC(p.year, p.month - 1, p.day) / 86400000 : NaN; }
  function daysBetween(fromDate, toDate) { return dateOrdinal(toDate) - dateOrdinal(fromDate); }
  function addDays(isoDate, amount) { return new Date((dateOrdinal(isoDate) + amount) * 86400000).toISOString().slice(0, 10); }
  function getVancouverToday(now) {
    const parts = new Intl.DateTimeFormat("en-CA", { timeZone: COURSE_CONFIG.timezone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now || new Date());
    const values = {};
    parts.forEach(function (part) { if (part.type !== "literal") values[part.type] = part.value; });
    return values.year + "-" + values.month + "-" + values.day;
  }
  function getStage(isoDate) { return COURSE_STAGES.find(function (stage) { return (!stage.start || isoDate >= stage.start) && (!stage.end || isoDate <= stage.end); }); }
  function normalizePathway(pathwayId) { return PROJECT_PATHWAYS[pathwayId] ? pathwayId : "not-confirmed"; }
  function normalizeProjectState(input) {
    const state = {};
    Object.keys(PROJECT_STATE_DEFINITIONS).forEach(function (key) {
      const candidate = input && input[key];
      state[key] = PROJECT_STATE_DEFINITIONS[key].values[candidate] ? candidate : DEFAULT_PROJECT_STATE[key];
    });
    return state;
  }
  function getEthicsStatusOptions(pathwayId) {
    const pathway = normalizePathway(pathwayId);
    const presentation = ETHICS_STATUS_PRESENTATION[pathway];
    return presentation.allowed.map(function (value) { return { value: value, label: presentation.labels[value] }; });
  }
  // Canonical pathway/status invariant: unconfirmed pathways carry only
  // pathway-not-confirmed; confirmed routes carry only valid route states.
  function normalizeEthicsStateForPathway(pathwayId, ethicsState) {
    const pathway = normalizePathway(pathwayId);
    if (pathway === "not-confirmed") return "pathway-not-confirmed";
    const allowed = ETHICS_STATUS_PRESENTATION[pathway].allowed;
    if (allowed.includes(ethicsState)) return ethicsState;
    return "developing";
  }
  function normalizeProjectStateForPathway(input, pathwayId) {
    const state = normalizeProjectState(input);
    state.ethics = normalizeEthicsStateForPathway(pathwayId, state.ethics);
    return state;
  }
  function transitionProjectStateForPathway(input, previousPathwayId, nextPathwayId) {
    const state = normalizeProjectState(input);
    const previous = normalizePathway(previousPathwayId);
    const next = normalizePathway(nextPathwayId);
    const routeSpecificStates = ["submitted-determined", "provisos", "ready-conditions", "ready"];
    if (previous !== next && routeSpecificStates.includes(state.ethics)) state.ethics = next === "not-confirmed" ? "pathway-not-confirmed" : "developing";
    return normalizeProjectStateForPathway(state, next);
  }
  function eventConditionMatches(event, projectState) {
    if (!event.condition) return true;
    const state = normalizeProjectState(projectState);
    return event.condition.values.includes(state[event.condition.field]);
  }
  function sortedDatedEvents() {
    return COURSE_EVENTS.filter(function (event) { return event.date; }).slice().sort(function (a, b) {
      return a.date.localeCompare(b.date) || (Number(a.order) || 0) - (Number(b.order) || 0) || a.id.localeCompare(b.id);
    });
  }
  function getActiveWindows(isoDate, projectState, pathwayId) {
    const state = pathwayId === undefined ? normalizeProjectState(projectState) : normalizeProjectStateForPathway(projectState, pathwayId);
    return sortedDatedEvents().filter(function (event) {
      if ((!event.endDate && !event.openEnded) || !eventConditionMatches(event, state)) return false;
      return event.openEnded ? isoDate >= event.date : isoDate >= event.date && isoDate <= event.endDate;
    });
  }
  function getUpcomingEvents(isoDate, count, pathwayId, projectState) {
    const state = normalizeProjectStateForPathway(projectState, pathwayId);
    return sortedDatedEvents().filter(function (event) {
      if (!eventConditionMatches(event, state)) return false;
      if (event.openEnded && event.date < isoDate) return false;
      return event.date >= isoDate || Boolean(event.endDate && event.endDate >= isoDate);
    }).sort(function (a, b) {
      const aEffective = a.date < isoDate && a.endDate >= isoDate ? isoDate : a.date;
      const bEffective = b.date < isoDate && b.endDate >= isoDate ? isoDate : b.date;
      return aEffective.localeCompare(bEffective) || (Number(a.order) || 0) - (Number(b.order) || 0) || a.id.localeCompare(b.id);
    }).slice(0, count || 6).map(function (event) { return Object.assign({}, event); });
  }
  function getNextEvent(isoDate, pathwayId, projectState) { return getUpcomingEvents(isoDate, 1, pathwayId, projectState)[0] || null; }
  function getNextGate(isoDate, pathwayId, projectState) {
    const state = normalizeProjectStateForPathway(projectState, pathwayId);
    const active = getActiveWindows(isoDate, state, pathwayId).find(function (event) { return event.gate; });
    return active || sortedDatedEvents().find(function (event) { return event.gate && event.date >= isoDate && eventConditionMatches(event, state); }) || null;
  }
  function getWeeklyDestination(isoDate) { return WEEKLY_DESTINATIONS.find(function (item) { return isoDate >= item.from && isoDate <= item.until; }) || null; }

  function activeResourcePriority(context, isoDate) {
    if (!Array.isArray(context.usefulPeriods)) return Number(context.priority) || 0;
    const periods = context.usefulPeriods.filter(function (period) { return (!period.from || isoDate >= period.from) && (!period.until || isoDate <= period.until); });
    if (!periods.length) return null;
    return periods.reduce(function (highest, period) { return Math.max(highest, Number(period.priority) || Number(context.priority) || 0); }, 0);
  }
  function resourceGroupsForStage(stage, isoDate) {
    const window = (stage.resourceTimeline || []).find(function (item) { return (!item.from || isoDate >= item.from) && (!item.until || isoDate <= item.until); });
    return window ? window.groups : [];
  }
  function getResourcesForStage(stage, isoDate, pathwayId) {
    const date = isValidDate(isoDate) ? isoDate : getVancouverToday();
    const pathway = normalizePathway(pathwayId);
    const candidates = [];
    let order = 0;
    resourceGroupsForStage(stage, date).forEach(function (groupName) {
      (COURSE_RESOURCE_CONTEXTS[groupName] || []).forEach(function (context) {
        const itemOrder = order++;
        if (context.pathways && !context.pathways.includes(pathway)) return;
        const priority = activeResourcePriority(context, date);
        const definition = COURSE_RESOURCES[context.resourceId];
        if (priority === null || !definition) return;
        candidates.push({ resource: Object.assign({ id: context.resourceId }, definition), priority: priority, order: itemOrder });
      });
    });
    const unique = new Map();
    candidates.forEach(function (candidate) {
      const existing = unique.get(candidate.resource.id);
      if (!existing || candidate.priority > existing.priority) unique.set(candidate.resource.id, candidate);
    });
    return Array.from(unique.values()).sort(function (a, b) { return b.priority - a.priority || a.order - b.order; }).slice(0, COURSE_CONFIG.resourceDisplayLimit).map(function (item) { return item.resource; });
  }

  function projectSummaryItem(key, state) {
    const definition = PROJECT_STATE_DEFINITIONS[key];
    const value = definition.values[state[key]];
    return { label: definition.label, value: value.label, condition: value.condition };
  }
  function ethicsSummaryItem(state, pathway) {
    const definition = PROJECT_STATE_DEFINITIONS.ethics.values[state.ethics];
    const label = ETHICS_STATUS_PRESENTATION[pathway].labels[state.ethics] || definition.label;
    const conditionOverrides = {
      behavioural: { "submitted-determined": "Waiting", provisos: "Blocked", ready: "On track" },
      archival: { "submitted-determined": "Review / readiness recorded", provisos: "Action required", "ready-conditions": "Ready with conditions", ready: "Ready" },
      "program-evaluation": { "submitted-determined": "Course-level determination", "ready-conditions": "Ready with conditions", ready: "On track" },
      "no-formal-review": { "submitted-determined": "Course-level determination", "ready-conditions": "Ready with conditions", ready: "On track" }
    };
    return { label: PROJECT_STATE_DEFINITIONS.ethics.label, value: label, condition: (conditionOverrides[pathway] && conditionOverrides[pathway][state.ethics]) || definition.condition };
  }
  function getProjectSummary(isoDate, projectState, pathwayId) {
    const pathway = normalizePathway(pathwayId);
    const state = normalizeProjectStateForPathway(projectState, pathway);
    if (isoDate < "2026-09-25") return [{ label: "Placement", value: "Matching sequence active", condition: "Course process" }];
    let keys = isoDate < "2026-10-07" ? ["scope"] : isoDate < "2026-10-19" ? ["scope", "proposal"] : ["scope", "proposal", "ethics", "board"];
    if (isoDate >= "2026-11-16") keys = ["ethics", "board"];
    const items = keys.map(function (key) { return key === "ethics" ? ethicsSummaryItem(state, pathway) : projectSummaryItem(key, state); });
    if (isoDate >= COURSE_CONFIG.pathwayRelevantFrom) items.push({ label: "Confirmed pathway", value: PROJECT_PATHWAYS[pathway].label, condition: pathway === "not-confirmed" ? "Blocked" : "Teaching-team confirmed" });
    return items;
  }

  function getBeforeProceed(isoDate, projectState, pathwayId) {
    const pathway = normalizePathway(pathwayId);
    const state = normalizeProjectStateForPathway(projectState, pathway);
    if (isoDate >= "2026-09-25" && (pathway === "not-confirmed" || state.ethics === "pathway-not-confirmed")) return {
      label: "Project boundary", text: "Relationship-building and project development can begin. Do not recruit research participants, collect research data, or later treat informal conversations as research before the applicable ethics, permission, access, protocol, consent, and project-readiness conditions are in place."
    };
    if (state.ethics === "provisos") return {
      label: "Before you proceed", status: "Blocked", text: "Respond to each proviso, revise all affected materials consistently, and complete the required approval process. Research governed by the review cannot proceed as though approval has already been granted. Blocked does not mean behind."
    };
    if (pathway === "behavioural" && state.ethics !== "ready" && state.ethics !== "ready-conditions") return {
      label: "Before you proceed", status: state.ethics === "submitted-determined" ? "Waiting" : "Blocked", text: "Continue appropriate project-development activities. Research requiring formal ethics approval cannot begin until approval and any other applicable permissions or conditions are in place."
    };
    if ((pathway === "program-evaluation" || pathway === "no-formal-review") && state.ethics !== "ready" && state.ethics !== "ready-conditions") return {
      label: "Before you proceed", status: state.ethics === "submitted-determined" ? "Waiting" : "Blocked", text: "Pathway confirmation alone is not permission to begin. Check your Project-Readiness status and any remaining access, permission, protocol, information-handling, or other conditions. No formal ethics review does not mean unrestricted use."
    };
    if (pathway === "archival" && state.ethics !== "ready" && state.ethics !== "ready-conditions") return {
      label: "Before you proceed", status: state.ethics === "submitted-determined" ? "Waiting" : "Blocked", text: "Possession is not permission. Access is not authority. Confirm applicable archival review, permission, access, protocol, privacy, sensitivity, attribution, circulation, and stewardship conditions before governed work begins."
    };
    if (state.ethics === "ready-conditions") return { label: "Before you proceed", status: "Ready with conditions", text: "Some work may proceed, but only within the named conditions and permissions currently in place." };
    return null;
  }

  function getTypeLabel(type) { return ({ seminar: "Seminar", tutorial: "Tutorial", deadline: "Deadline", milestone: "Milestone", "project-gate": "Project gate", "partnership-action": "Partnership action", support: "Support / Consultation", "no-class": "No class", presentation: "Presentation" })[type] || type; }
  function eventIsActionableForState(event, state) {
    if (event.id === "final-signed-proposal" && state.proposal === "final-signed") return false;
    if (event.id === "november-pathway-gate" && ["submitted-determined", "provisos", "ready-conditions", "ready"].includes(state.ethics)) return false;
    return true;
  }
  function getDoNow(isoDate, projectState, pathwayId) {
    const pathway = normalizePathway(pathwayId);
    const state = normalizeProjectStateForPathway(projectState, pathway);
    const actions = [];
    function add(priority, text, source, type) { if (text && !actions.some(function (item) { return item.text === text; })) actions.push({ priority: priority, text: text, source: source, type: type || "project-state" }); }
    if (state.ethics === "provisos") add(1, "Respond to each proviso and revise every affected document consistently before completing the approval process.", "Project gate", "project-gate");
    if (isoDate >= "2026-10-21" && (pathway === "not-confirmed" || state.ethics === "pathway-not-confirmed")) add(1, "Confirm the project's ethics pathway with the teaching team before pathway-dependent work proceeds.", "Blocking prerequisite", "project-boundary");
    if (state.proposal === "revisions-required") add(1, "Complete the requested Project Proposal revisions and return the revised version for clearance.", "Project state", "project-state");
    if (isoDate >= "2026-09-25" && state.scope === "emerging") add(2, "Lead the first partner meeting and develop an emerging map of purpose, components, constraints, and unresolved questions.", "Project state", "project-state");
    if (isoDate >= "2026-10-05" && state.scope === "core-commitment") add(2, "Turn the Core Commitment into a Scope Snapshot and bring it to the partner for checking.", "Project state", "project-state");
    if (isoDate >= "2026-10-07" && state.proposal === "not-started") add(2, "Begin the Project Proposal from the current scope.", "Project state", "project-state");
    if (isoDate >= "2026-10-07" && state.proposal === "drafting") add(2, "Advance the Project Proposal and keep it consistent with ethics or readiness materials.", "Project state", "project-state");
    if (isoDate >= "2026-10-19" && state.board === "not-activated") add(2, "Activate the Project Board with clear ownership, dependencies, conditions, and next actions.", "Project state", "project-state");
    getActiveWindows(isoDate, state, pathway).forEach(function (event) { add(3, event.action || event.title, "Active now · " + getTypeLabel(event.type), event.type); });
    sortedDatedEvents().filter(function (event) { return event.type !== "no-class" && event.date >= isoDate && event.date <= addDays(isoDate, 6) && !event.openEnded && eventConditionMatches(event, state) && eventIsActionableForState(event, state); }).forEach(function (event) {
      const isBoundaryOrGate = Boolean(event.gate || event.boundary);
      add(isBoundaryOrGate ? 1 : 4, event.action || event.outcome || event.title, getTypeLabel(event.type), event.type);
    });
    if (!actions.length) {
      const upcoming = getUpcomingEvents(isoDate, 12, pathway, state).find(function (event) { return event.type !== "no-class"; });
      add(5, upcoming ? (upcoming.action || upcoming.title) : "Review the final project record and any partner-dependent closeout actions.", upcoming ? getTypeLabel(upcoming.type) : "Coming next", upcoming ? upcoming.type : "project-state");
    }
    return actions.sort(function (a, b) { return a.priority - b.priority; }).slice(0, 3);
  }

  return {
    COURSE_CONFIG: COURSE_CONFIG, COURSE_MODULES: COURSE_MODULES, COURSE_ASSESSMENTS: COURSE_ASSESSMENTS,
    COURSE_RESOURCES: COURSE_RESOURCES, COURSE_RESOURCE_CONTEXTS: COURSE_RESOURCE_CONTEXTS,
    PROJECT_PATHWAYS: PROJECT_PATHWAYS, PROJECT_STATE_DEFINITIONS: PROJECT_STATE_DEFINITIONS, DEFAULT_PROJECT_STATE: DEFAULT_PROJECT_STATE,
    ETHICS_STATUS_PRESENTATION: ETHICS_STATUS_PRESENTATION,
    COURSE_STAGES: COURSE_STAGES, COURSE_EVENTS: COURSE_EVENTS, WEEKLY_DESTINATIONS: WEEKLY_DESTINATIONS,
    JOURNEY_STAGES: JOURNEY_STAGES, JOURNEY_STAGE_IDS: JOURNEY_STAGES.map(function (stage) { return stage.id; }),
    utils: {
      parseDateParts: parseDateParts, isValidDate: isValidDate, dateOrdinal: dateOrdinal, daysBetween: daysBetween,
      getVancouverToday: getVancouverToday, getStage: getStage, normalizePathway: normalizePathway, normalizeProjectState: normalizeProjectState,
      getEthicsStatusOptions: getEthicsStatusOptions, normalizeEthicsStateForPathway: normalizeEthicsStateForPathway,
      normalizeProjectStateForPathway: normalizeProjectStateForPathway, transitionProjectStateForPathway: transitionProjectStateForPathway,
      eventConditionMatches: eventConditionMatches, sortedDatedEvents: sortedDatedEvents, getUpcomingEvents: getUpcomingEvents,
      getNextEvent: getNextEvent, getNextGate: getNextGate, getActiveWindows: getActiveWindows, getWeeklyDestination: getWeeklyDestination,
      getResourcesForStage: getResourcesForStage, getProjectSummary: getProjectSummary, getBeforeProceed: getBeforeProceed,
      getDoNow: getDoNow, getTypeLabel: getTypeLabel, eventIsActionableForState: eventIsActionableForState
    }
  };
});
