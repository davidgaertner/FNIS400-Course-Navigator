/*
 * FNIS 400 COURSE MAINTAINERS
 * ---------------------------
 * COURSE_MODULES records authoritative module starts.
 * COURSE_STAGES controls the primary date-aware position shown in the Navigator;
 * activeStart/activeEnd separately record overlapping responsibilities.
 * COURSE_EVENTS controls dated activities, gates, and assessments.
 * pathwayDetails adds route-specific meaning without replacing a stable
 * course-wide event title in the timeline.
 * COURSE_RESOURCES is the canonical Canvas registry. Blank URLs intentionally
 * render as “Canvas link to be added.”
 * COURSE_RESOURCE_CONTEXTS maps registry IDs to stage/date/pathway contexts.
 * PROJECT_PATHWAYS controls local route-specific guidance and dependencies.
 * Dates are YYYY-MM-DD calendar-date strings, never timestamps.
 */
(function (root, factory) {
  var data = factory();
  if (typeof module === "object" && module.exports) module.exports = data;
  root.FNIS400 = data;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const COURSE_CONFIG = {
    timezone: "America/Vancouver",
    title: "FNIS 400 Practicum Course Navigator",
    academicYear: "2026–27",
    lastUpdated: "September 7, 2026",
    resourceDisplayLimit: 5,
    pathwayRelevantFrom: "2026-10-14",
    pathwayStorageKey: "fnis400-confirmed-project-pathway",
    term2ScheduleNotice: "The Term 2 schedule will be available after the winter break."
  };

  const COURSE_MODULES = [
    { id: "start-here", title: "Start Here", start: "2026-09-09", stageId: "orientation" },
    { id: "partners-projects", title: "This Year’s Partners & Projects", start: "2026-09-09", stageId: "orientation" },
    { id: "placement-matching", title: "Placement & Matching", start: "2026-09-09", stageId: "placement" },
    { id: "common-research-methods", title: "Common Research Methods", start: "2026-09-23", stageId: "methods-scoping" },
    { id: "beginning-partnership", title: "Beginning the Partnership", start: "2026-09-28", stageId: "partnership" },
    { id: "scoping-project", title: "Scoping Your Project", start: "2026-09-28", stageId: "methods-scoping" },
    { id: "project-proposals", title: "Project Proposals", start: "2026-10-07", stageId: "proposal" },
    { id: "research-ethics", title: "Research Ethics", start: "2026-10-14", stageId: "research-ethics" },
    { id: "behavioural-research", title: "Behavioural Research", start: "2026-10-19", stageId: "ethics-pathway" },
    { id: "program-evaluation", title: "Ethics Pathways: Program Evaluation", start: "2026-10-19", stageId: "ethics-pathway" },
    { id: "archival-research", title: "Ethics Pathways: Archival Research", start: "2026-10-19", stageId: "ethics-pathway" },
    { id: "no-formal-review", title: "Ethics Pathways: No Formal Review", start: "2026-10-19", stageId: "ethics-pathway" },
    { id: "ethics-readiness-development", title: "Ethics Development & Project Readiness", start: "2026-10-21", stageId: "ethics-readiness" },
    { id: "quality-control", title: "Quality Control & Submission of Ethics", start: "2026-11-04", stageId: "quality-control" },
    { id: "research-foundation", title: "Research Foundation", start: "2026-11-16", stageId: "foundation" }
  ];

  const COURSE_ASSESSMENTS = {
    projectProposal: { label: "Project Proposal", weight: 15 },
    researchFoundation: { label: "Research Foundation", weight: 15 },
    communityResearchProcess: { label: "Community Research Process", weight: 20 },
    deliverableMilestone: { label: "Deliverable Milestone", weight: 10 },
    communityResearchDeliverables: { label: "Community Research Deliverable(s)", weight: 30 },
    communityResearchPresentation: { label: "Community Research Presentation", weight: 10 }
  };

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
    startHere: { label: "Welcome to FNIS 400", url: "https://canvas.ubc.ca/courses/194371/pages/welcome-to-fnis-400?module_item_id=9518046", type: "page" },
    howWeWork: { label: "How We Work in FNIS 400", url: "https://canvas.ubc.ca/courses/194371/pages/how-we-work-in-fnis-400", type: "page" },
    workingCommunityPartners: { label: "Working with Community Partners", url: "https://canvas.ubc.ca/courses/194371/pages/working-with-community-partners", type: "page" },
    deadlinesGatesBlockedWork: { label: "Deadlines, Project Gates, and Blocked Work", url: "https://canvas.ubc.ca/courses/194371/pages/deadlines-project-gates-and-blocked-work", type: "page" },
    howUseCanvas: { label: "How to Use This Canvas Site", url: "https://canvas.ubc.ca/courses/194371/pages/how-to-use-this-canvas-site", type: "page" },
    conceptsTerms: { label: "Concepts and Terms Used Regularly in FNIS 400", url: "https://canvas.ubc.ca/courses/194371/pages/concepts-and-terms-used-regularly-in-fnis-400", type: "page" },
    partnersProjects: { label: "How to Read the Partner Project Proposals", url: "https://canvas.ubc.ca/courses/194371/pages/how-to-read-the-partner-project-proposals?module_item_id=9677368", type: "page" },
    beginningPartnership: { label: "Starting Your Placement", url: "https://canvas.ubc.ca/courses/194371/pages/starting-your-placement", type: "page" },
    commonResearchMethods: { label: "Common Research Methods", url: "", type: "module" },
    whatWeMeanScoping: { label: "What We Mean by Scoping", url: "https://canvas.ubc.ca/courses/194371/pages/what-we-mean-by-scoping?module_item_id=9553401", type: "page" },
    bullseyeScope: { label: "Bullseye / Core Commitment", url: "", type: "page" },
    scopeSnapshot: { label: "Scope Snapshot", url: "", type: "page" },
    partnerScopeCheck: { label: "Partner Scope Check", url: "", type: "page" },
    projectBoard: { label: "Project Board", url: "", type: "external" },
    proposalAssignment: { label: "Project Proposal Assignment", url: "", type: "assignment" },
    proposalTemplate: { label: "Project Proposal Template", url: "", type: "template" },
    proposalChecklist: { label: "Proposal Checklist", url: "", type: "page" },
    proposalExamples: { label: "Completed Proposal Examples", url: "", type: "page" },
    proposalSignatureRouting: { label: "Proposal Clearance & Signature Routing", url: "", type: "page" },
    researchEthics: { label: "Research Ethics", url: "", type: "module" },
    ethicsPathwayGuide: { label: "Confirmed Ethics Pathway Guide", url: "", type: "page" },
    behaviouralPathway: { label: "How the Behavioural Research Pathway Works", url: "https://canvas.ubc.ca/courses/194371/pages/how-the-behavioural-research-pathway-works", type: "page" },
    behaviouralDataCollection: { label: "Behavioural Research: Data Collection", url: "https://canvas.ubc.ca/courses/194371/pages/data-collection", type: "page" },
    storingData: { label: "Storing Your Data", url: "https://canvas.ubc.ca/courses/194371/pages/storing-your-data", type: "page" },
    archivalPathway: { label: "How the Archival Research Pathway Works", url: "https://canvas.ubc.ca/courses/194371/pages/how-the-archival-research-pathway-works", type: "page" },
    programEvaluationPathway: { label: "How the Program Evaluation Pathway Works", url: "https://canvas.ubc.ca/courses/194371/pages/how-the-program-evaluation-pathway-works", type: "page" },
    programEvaluationDataCollection: { label: "Program Evaluation: Data Collection", url: "https://canvas.ubc.ca/courses/194371/pages/data-collection-2", type: "page" },
    noFormalReviewPathway: { label: "How the No Formal Review Pathway Works", url: "https://canvas.ubc.ca/courses/194371/pages/how-the-no-formal-review-pathway-works", type: "page" },
    ethicsReadinessDevelopment: { label: "Ethics Development & Project Readiness", url: "", type: "module" },
    qualityControlSubmission: { label: "Preparing for the Quality-Control Seminar", url: "https://canvas.ubc.ca/courses/194371/pages/preparing-for-the-quality-control-seminar", type: "page" },
    projectReadinessCheck: { label: "Project Readiness Check", url: "https://canvas.ubc.ca/courses/194371/pages/project-readiness-check", type: "page" },
    finalAssemblyReadiness: { label: "Final Assembly & Readiness Check", url: "https://canvas.ubc.ca/courses/194371/assignments/2571537?module_item_id=9706121", type: "assignment" },
    formalEthicsSubmission: { label: "Formal Ethics Submission, Where Required", url: "https://canvas.ubc.ca/courses/194371/assignments/2571538?module_item_id=9706122", type: "assignment" },
    projectReadinessConfirmation: { label: "Project-Readiness Confirmation", url: "https://canvas.ubc.ca/courses/194371/pages/project-readiness-confirmation?module_item_id=9706123", type: "page" },
    projectReadinessRecord: { label: "Project-Readiness Record", url: "", type: "template" },
    consentGuidance: { label: "Consent Guidance", url: "", type: "page" },
    recruitmentGuidance: { label: "Recruitment Guidance", url: "", type: "page" },
    researchInstrumentGuidance: { label: "Research Instrument Guidance", url: "", type: "page" },
    riskVulnerabilityGuide: { label: "Risk & Vulnerability Guide", url: "", type: "page" },
    archivalPermissions: { label: "Archival Access, Permissions & Authority", url: "", type: "page" },
    participationAgreement: { label: "Participation & Informed Agreement Guidance", url: "", type: "page" },
    informationUsePermissions: { label: "Information-Use & Permissions Guidance", url: "", type: "page" },
    dataStewardship: { label: "Data Stewardship", url: "https://canvas.ubc.ca/courses/194371/pages/data-stewardship", type: "page" },
    projectFolderGuide: { label: "Project Folder & Information Handling", url: "", type: "page" },
    foundationAssignment: { label: "Research Foundation Assignment", url: "", type: "assignment" },
    foundationExample: { label: "Research Foundation Example", url: "", type: "page" },
    researchSupportDirectory: { label: "Research Support Directory", url: "", type: "page" },
    xwi7xwaPreparation: { label: "X̱wi7x̱wa Search Preparation", url: "", type: "page" },
    xwi7xwaResources: { label: "X̱wi7x̱wa Resources", url: "", type: "external" },
    milestoneAssignment: { label: "Deliverable Milestone Assignment", url: "", type: "assignment" },
    milestoneGuidance: { label: "Milestone Guidance", url: "", type: "page" },
    collaborativeDesignIteration: { label: "How Collaborative Design and Iteration Works", url: "https://canvas.ubc.ca/courses/194371/pages/how-collaborative-design-and-iteration-works", type: "page" },
    deliverableDesignGuide: { label: "Deliverable Design Guide", url: "", type: "page" },
    prototypesFeedback: { label: "Prototypes, Feedback & Iteration", url: "", type: "page" },
    feedbackCadence: { label: "Feedback Cadence & Working Rhythm", url: "", type: "page" },
    decisionsChanges: { label: "Decisions, Changes & Closing the Loop", url: "", type: "page" },
    handoverGuidance: { label: "Handover Guidance", url: "", type: "page" },
    closeoutChecklist: { label: "Project Closeout Checklist", url: "", type: "page" },
    partnerDraftInstructions: { label: "Partner-Review Draft Instructions", url: "", type: "page" },
    presentationGuidance: { label: "Community Research Presentation Guidance", url: "", type: "page" },
    presentationRubric: { label: "Presentation Rubric", url: "", type: "page" },
    communityDeliverable: { label: "Community Research Deliverable(s)", url: "", type: "assignment" },
    communityPresentation: { label: "Community Research Presentation", url: "", type: "assignment" }
  };

  const placementContexts = [
    { resourceId: "canvasHome", usefulPeriods: [{ until: "2026-09-13", priority: 40 }] },
    { resourceId: "startHere", usefulPeriods: [{ until: "2026-09-13", priority: 120 }] },
    { resourceId: "howWeWork", usefulPeriods: [{ until: "2026-09-08", priority: 110 }, { from: "2026-09-09", until: "2026-09-13", priority: 65 }] },
    { resourceId: "workingCommunityPartners", usefulPeriods: [{ until: "2026-09-08", priority: 100 }, { from: "2026-09-09", until: "2026-09-13", priority: 60 }] },
    { resourceId: "deadlinesGatesBlockedWork", usefulPeriods: [{ until: "2026-09-08", priority: 95 }, { from: "2026-09-09", until: "2026-09-13", priority: 55 }] },
    { resourceId: "howUseCanvas", usefulPeriods: [{ until: "2026-09-08", priority: 105 }, { from: "2026-09-09", until: "2026-09-13", priority: 70 }] },
    { resourceId: "conceptsTerms", usefulPeriods: [{ until: "2026-09-08", priority: 90 }, { from: "2026-09-09", until: "2026-09-13", priority: 50 }] },
    { resourceId: "partnersProjects", usefulPeriods: [{ from: "2026-09-09", until: "2026-09-14", priority: 70 }, { from: "2026-09-15", until: "2026-09-16", priority: 92 }] },
    { resourceId: "placementMatching", usefulPeriods: [{ until: "2026-09-14", priority: 75 }, { from: "2026-09-15", until: "2026-09-16", priority: 60 }, { from: "2026-09-17", until: "2026-09-20", priority: 80 }, { from: "2026-09-21", until: "2026-09-24", priority: 90 }, { from: "2026-09-25", until: "2026-09-25", priority: 60 }] },
    { resourceId: "positionalityGuidance", usefulPeriods: [{ until: "2026-09-14", priority: 90 }, { from: "2026-09-15", until: "2026-09-16", priority: 90 }] },
    { resourceId: "personalProfile", usefulPeriods: [{ until: "2026-09-14", priority: 100 }] },
    { resourceId: "positionalityStatement", usefulPeriods: [{ until: "2026-09-16", priority: 85 }] },
    { resourceId: "preparingPartnerFair", usefulPeriods: [{ from: "2026-09-15", until: "2026-09-16", priority: 100 }] },
    { resourceId: "partnerFair", usefulPeriods: [{ from: "2026-09-15", until: "2026-09-16", priority: 95 }] },
    { resourceId: "preliminaryInterests", usefulPeriods: [{ from: "2026-09-17", until: "2026-09-20", priority: 100 }, { from: "2026-09-21", until: "2026-09-23", priority: 65 }] },
    { resourceId: "resumeCoverLetter", usefulPeriods: [{ from: "2026-09-17", until: "2026-09-21", priority: 95 }, { from: "2026-09-22", until: "2026-09-24", priority: 75 }] },
    { resourceId: "targetedInterviews", usefulPeriods: [{ from: "2026-09-17", until: "2026-09-24", priority: 100 }] },
    { resourceId: "finalPlacementRanking", usefulPeriods: [{ from: "2026-09-21", until: "2026-09-24", priority: 95 }] },
    { resourceId: "placementResults", stages: ["partnership", "methods-scoping"], usefulPeriods: [{ from: "2026-09-25", until: "2026-10-06", priority: 100 }] },
    { resourceId: "scopingProject", stages: ["partnership", "methods-scoping", "proposal"], usefulPeriods: [{ from: "2026-09-25", until: "2026-10-13", priority: 95 }] }
  ];

  function refs(ids) { return ids.map(function (resourceId) { return { resourceId: resourceId }; }); }

  const COURSE_RESOURCE_CONTEXTS = {
    placement: placementContexts,
    partnership: refs(["beginningPartnership", "scopingProject", "workingCommunityPartners", "projectBoard", "positionalityGuidance"]),
    scoping: [
      { resourceId: "whatWeMeanScoping", priority: 100 },
      { resourceId: "scopingProject", priority: 95 },
      { resourceId: "commonResearchMethods", priority: 80 },
      { resourceId: "bullseyeScope", priority: 75 },
      { resourceId: "scopeSnapshot", priority: 70 },
      { resourceId: "partnerScopeCheck", priority: 65 },
      { resourceId: "projectBoard", priority: 60 }
    ],
    proposal: refs(["proposalAssignment", "proposalTemplate", "proposalChecklist", "proposalSignatureRouting", "scopingProject", "proposalExamples"]),
    researchEthics: refs(["researchEthics", "ethicsPathwayGuide", "dataStewardship", "projectFolderGuide"]),
    ethicsPathway: [
      { resourceId: "researchEthics", priority: 100 },
      { resourceId: "ethicsPathwayGuide", priority: 95 },
      { resourceId: "behaviouralPathway", pathways: ["behavioural"], priority: 90 },
      { resourceId: "archivalPathway", pathways: ["archival"], priority: 90 },
      { resourceId: "programEvaluationPathway", pathways: ["program-evaluation"], priority: 90 },
      { resourceId: "noFormalReviewPathway", pathways: ["no-formal-review"], priority: 90 },
      { resourceId: "dataStewardship", priority: 70 }
    ],
    ethicsDevelopment: [
      { resourceId: "qualityControlSubmission", usefulPeriods: [{ from: "2026-11-02", until: "2026-11-03", priority: 110 }] },
      { resourceId: "finalAssemblyReadiness", usefulPeriods: [{ from: "2026-11-02", until: "2026-11-03", priority: 105 }] },
      { resourceId: "ethicsReadinessDevelopment", priority: 70 },
      { resourceId: "projectFolderGuide", priority: 65 },
      { resourceId: "behaviouralPathway", pathways: ["behavioural"], priority: 100 },
      { resourceId: "behaviouralDataCollection", pathways: ["behavioural"], priority: 95 },
      { resourceId: "storingData", pathways: ["behavioural"], priority: 90 },
      { resourceId: "consentGuidance", pathways: ["behavioural"], priority: 85 },
      { resourceId: "recruitmentGuidance", pathways: ["behavioural"], priority: 80 },
      { resourceId: "riskVulnerabilityGuide", pathways: ["behavioural"], priority: 75 },
      { resourceId: "researchInstrumentGuidance", pathways: ["behavioural"], priority: 70 },
      { resourceId: "archivalPathway", pathways: ["archival"], priority: 100 },
      { resourceId: "archivalPermissions", pathways: ["archival"], priority: 95 },
      { resourceId: "dataStewardship", pathways: ["archival", "program-evaluation", "no-formal-review"], priority: 90 },
      { resourceId: "programEvaluationPathway", pathways: ["program-evaluation"], priority: 100 },
      { resourceId: "programEvaluationDataCollection", pathways: ["program-evaluation"], priority: 95 },
      { resourceId: "noFormalReviewPathway", pathways: ["no-formal-review"], priority: 100 },
      { resourceId: "projectReadinessRecord", pathways: ["program-evaluation", "no-formal-review"], priority: 85 },
      { resourceId: "participationAgreement", pathways: ["program-evaluation"], priority: 80 },
      { resourceId: "informationUsePermissions", pathways: ["program-evaluation", "no-formal-review"], priority: 80 }
    ],
    quality: [
      { resourceId: "qualityControlSubmission", priority: 110 },
      { resourceId: "finalAssemblyReadiness", priority: 105 },
      { resourceId: "proposalAssignment", priority: 70 },
      { resourceId: "ethicsReadinessDevelopment", priority: 60 },
      { resourceId: "projectFolderGuide", priority: 50 },
      { resourceId: "formalEthicsSubmission", pathways: ["behavioural"], usefulPeriods: [{ until: "2026-11-12", priority: 100 }, { from: "2026-11-13", priority: 120 }] },
      { resourceId: "behaviouralPathway", pathways: ["behavioural"], priority: 90 },
      { resourceId: "storingData", pathways: ["behavioural"], priority: 80 },
      { resourceId: "archivalPathway", pathways: ["archival"], priority: 100 },
      { resourceId: "dataStewardship", pathways: ["archival"], priority: 90 },
      { resourceId: "projectReadinessCheck", pathways: ["program-evaluation", "no-formal-review"], priority: 108 },
      { resourceId: "projectReadinessConfirmation", pathways: ["program-evaluation", "no-formal-review"], usefulPeriods: [{ until: "2026-11-12", priority: 95 }, { from: "2026-11-13", priority: 120 }] },
      { resourceId: "programEvaluationPathway", pathways: ["program-evaluation"], priority: 90 },
      { resourceId: "noFormalReviewPathway", pathways: ["no-formal-review"], priority: 90 },
      { resourceId: "projectReadinessRecord", pathways: ["program-evaluation", "no-formal-review"], priority: 85 }
    ],
    foundation: refs(["foundationAssignment", "xwi7xwaPreparation", "researchSupportDirectory", "xwi7xwaResources", "foundationExample"]),
    development: [
      { resourceId: "collaborativeDesignIteration", stages: ["milestone"], priority: 100 },
      { resourceId: "projectBoard", priority: 90 },
      { resourceId: "deliverableDesignGuide", priority: 85 },
      { resourceId: "prototypesFeedback", priority: 80 },
      { resourceId: "feedbackCadence", priority: 75 },
      { resourceId: "decisionsChanges", priority: 70 },
      { resourceId: "handoverGuidance", priority: 65 }
    ],
    milestone: refs(["milestoneAssignment", "milestoneGuidance", "projectBoard", "decisionsChanges"]),
    partnerReview: refs(["partnerDraftInstructions", "decisionsChanges", "handoverGuidance", "presentationGuidance", "projectBoard"]),
    closeout: refs(["communityDeliverable", "communityPresentation", "presentationRubric", "closeoutChecklist", "handoverGuidance"])
  };

  const PROJECT_PATHWAYS = {
    "not-confirmed": { label: "Not yet confirmed", conceptualPathway: null, states: [{ from: "2026-10-14", status: "Pathway Not Yet Confirmed", guidance: "The teaching team confirms the pathway after considering project purpose, intended use, people or materials, access, authority, permissions, risk, context, and stewardship.", rightNow: ["Use the common Research Ethics guidance while the teaching team confirms the project pathway"], dependencies: ["The teaching team must confirm the project pathway before pathway-dependent work can proceed."] }] },
    behavioural: { label: "Behavioural Research", conceptualPathway: "Behavioural Research", states: [
      { from: "2026-10-14", until: "2026-10-20", status: "Pathway Confirmed · Behavioural Research", guidance: "Every Practicum project has ethical responsibilities. This route requires a formal behavioural ethics package.", rightNow: ["Review the confirmed route before developing pathway-specific materials"], dependencies: [] },
      { from: "2026-10-21", until: "2026-11-03", status: "Ethics Package in Development", guidance: "Develop, test, clarify, revise, and assemble the formal ethics package and supporting materials.", rightNow: ["Develop the formal package and its methods, recruitment, consent, risk, privacy, instruments, and information-handling materials"], dependencies: ["Do not recruit participants or collect research data before required approval and project-readiness conditions are in place."] },
      { from: "2026-11-04", until: "2026-11-12", status: "Calendar Expectation · Ready for Quality Control", guidance: "Based on the course calendar, the substantially complete package should now be reviewed as one coherent whole.", rightNow: ["Resolve internal inconsistencies and complete final assembly after substantive review"], dependencies: ["Consequential late changes go to the teaching team."] },
      { from: "2026-11-13", until: "2026-11-13", status: "Formal Ethics Submission, where required", guidance: "Working date, pending final committee confirmation. Submission is not approval.", rightNow: ["Complete the formal submission required for the reviewed project"], dependencies: ["Work requiring formal ethics approval remains on hold until approval is actually received."] },
      { from: "2026-11-14", status: "Formal Approval Condition", guidance: "Possible statuses include Formal Ethics Submitted, Awaiting Ethics Approval, Responding to Provisos, or Ethics Approved. The Navigator cannot know which applies.", rightNow: ["Work only within the conditions and approval actually in place; consult before consequential changes"], dependencies: ["Research requiring formal approval remains on hold until approval is actually received."] }
    ] },
    archival: { label: "Archival Research", conceptualPathway: "Archival Research", states: [{ from: "2026-10-14", status: "Archival Conditions / Review in Progress", guidance: "Access is not authority. Confirm the actual requirements for collections, custodianship, permissions, protocol, privacy, sensitivity, attribution, reproduction, recirculation, and stewardship.", rightNow: ["Develop the archival access, authority, permissions, protocol, and stewardship conditions required by this project"], dependencies: ["Possession is not permission. Access authorization or other archival conditions may remain outstanding."] }] },
    "program-evaluation": { label: "Program Evaluation", conceptualPathway: "Research that does not require formal review", states: [
      { from: "2026-10-14", until: "2026-11-03", status: "Project-Readiness Record in Development", guidance: "Program Evaluation is a Canvas branch within the broader pathway for research that does not require formal review; it is not a fourth ethics pathway.", rightNow: ["Develop a proportionate Project-Readiness Record covering purpose, participation, informed agreement, information handling, representation, sharing, and return"], dependencies: ["Pathway confirmation alone is not permission to begin."] },
      { from: "2026-11-04", until: "2026-11-12", status: "Calendar Expectation · Ready for Quality Control", guidance: "Based on the course calendar, the Project-Readiness Record should now be reviewed with the whole project.", rightNow: ["Finalize the Project-Readiness Record and resolve remaining conditions"], dependencies: ["Consequential late changes go to the teaching team."] },
      { from: "2026-11-13", status: "Project-Readiness Confirmation", guidance: "This is a course-level readiness determination, not formal ethics approval. Possible outcomes are Ready to Proceed, Ready with Conditions, or Not Yet Ready; readiness may be partial. No formal review does not mean unrestricted use.", rightNow: ["Work only within the readiness determination and conditions actually established"], dependencies: ["Unresolved permissions, access, authority, stewardship, or other conditions can keep specific work on hold. Only work covered by a Ready to Proceed or Ready with Conditions determination may proceed."] }
    ] },
    "no-formal-review": { label: "No Formal Review", conceptualPathway: "Research that does not require formal review", states: [
      { from: "2026-10-14", until: "2026-11-03", status: "Project-Readiness Record in Development", guidance: "No formal review does not mean unrestricted use. Possession is not permission. Access is not authority.", rightNow: ["Develop a proportionate Project-Readiness Record covering information, materials, access, permissions, authority, stewardship, representation, and circulation"], dependencies: ["Pathway confirmation alone is not permission to begin."] },
      { from: "2026-11-04", until: "2026-11-12", status: "Calendar Expectation · Ready for Quality Control", guidance: "Based on the course calendar, the Project-Readiness Record should now be reviewed with the whole project.", rightNow: ["Finalize the Project-Readiness Record and resolve remaining conditions"], dependencies: ["Consequential late changes go to the teaching team."] },
      { from: "2026-11-13", status: "Project-Readiness Confirmation", guidance: "This is a course-level readiness determination, not formal ethics approval. Possible outcomes are Ready to Proceed, Ready with Conditions, or Not Yet Ready; readiness may be partial.", rightNow: ["Work only within the readiness determination and conditions actually established"], dependencies: ["Only work covered by a Ready to Proceed or Ready with Conditions determination may proceed."] }
    ] }
  };

  const COURSE_STAGES = [
    { id: "before", journeyLabel: "Before course", start: null, end: "2026-09-08", activeStart: null, activeEnd: "2026-09-08", title: "Preparing to begin", resourceGroup: "placement", description: "FNIS 400 begins September 9 with orientation and the Placement & Matching process.", byNow: ["No practicum work is assumed before the course begins"], rightNow: ["Note the first seminar and early placement dates"] },
    { id: "orientation", journeyLabel: "Orientation", start: "2026-09-09", end: "2026-09-13", activeStart: "2026-09-09", activeEnd: "2026-09-25", title: "Orientation and beginning Placement", resourceGroup: "placement", description: "You are entering the practicum, learning the year’s partner landscape, and beginning the matching process.", byNow: ["Course orientation underway"], rightNow: ["Complete the Personal Profile and positionality work", "Understand how Placement & Matching will proceed"], dependencies: ["Placement confirmation is required before partnership and project work can proceed."] },
    { id: "placement", journeyLabel: "Placement", start: "2026-09-14", end: "2026-09-25", activeStart: "2026-09-09", activeEnd: "2026-09-25", title: "Placement and reciprocal fit", resourceGroup: "placement", description: "You are moving through the full matching sequence: profile, Partner Fair, preliminary interests, professional materials, reciprocal interviews, final ranking, and placement confirmation.", byNow: ["Orientation and Personal Profile work underway", "Partner possibilities reviewed as serious, reciprocal fits"], rightNow: ["Complete the immediate placement step shown in Coming Up", "Prepare carefully for professional materials and at least one reciprocal Two-Way Interview"], dateGuidance: [
      { from: "2026-09-14", until: "2026-09-16", byNow: ["Personal Profile submitted or at its due date", "Partner projects reviewed"], rightNow: ["Prepare for and participate in the Partner Fair", "Use positionality guidance when introducing yourself to partners"] },
      { from: "2026-09-17", until: "2026-09-20", byNow: ["Partner Fair completed according to the calendar", "Three unranked placements under serious consideration"], rightNow: ["Submit Preliminary Placement Interests", "Prepare the Practicum Résumé, tailored Cover Letter(s), and at least one reciprocal Two-Way Interview"] },
      { from: "2026-09-21", until: "2026-09-24", byNow: ["Preliminary Placement Interests submitted", "Professional materials prepared for prospective partner(s)"], rightNow: ["Submit and send the Résumé and tailored Cover Letter(s) by September 21 at noon", "Participate in at least one reciprocal Two-Way Interview", "Submit the Final Placement Ranking by September 24"] },
      { from: "2026-09-25", until: "2026-09-25", byNow: ["Final Placement Ranking submitted according to the calendar", "Reciprocal fit conversations completed"], rightNow: ["Review Placement Confirmation and the next-step guidance", "Prepare to initiate the partner relationship"] }
    ], dependencies: ["Placement confirmation is required before partnership and project work can proceed."] },
    { id: "partnership", journeyLabel: "Partnership", start: "2026-09-26", end: "2026-10-04", activeStart: "2026-09-28", activeEnd: "2027-04-12", title: "Beginning the partnership", resourceGroup: "partnership", description: "The first partner meeting should take place as soon as reasonably possible after placement confirmation, ideally during the first week of the placement. The student leads this meeting; the teaching team supports the process but does not run it.", byNow: ["Placement confirmed", "Initial partner contact initiated"], rightNow: ["Establish communication expectations, roles, meeting rhythm, initial project understanding, unresolved questions, and immediate next steps"], dependencies: ["Partner availability may shape timing; communicate early and adjust the plan visibly."] },
    { id: "methods-scoping", journeyLabel: "Methods & Scoping", start: "2026-10-05", end: "2026-10-06", activeStart: "2026-09-23", activeEnd: "2026-11-04", title: "Methods and project scoping", resourceGroup: "scoping", description: "Methods inform project design but do not determine the ethics pathway. Scoping identifies one coherent core commitment while partnership, methods, and project conditions are still being clarified.", byNow: ["Common Research Methods introduced", "Initial partner understanding underway"], rightNow: ["Complete the Bullseye / Core Commitment", "Distinguish Must Have work from negotiable, possible, or deferred work"], dependencies: ["Research or feedback may identify an implication; consequential change still requires conversation, decision, and a project record."] },
    { id: "proposal", journeyLabel: "Proposal", start: "2026-10-07", end: "2026-10-13", activeStart: "2026-10-07", activeEnd: "2026-11-04", title: "Project Proposal development", resourceGroup: "proposal", description: "Proposal work translates the partner-defined need into a feasible plan while scoping, methods, and ethics/readiness questions continue to develop.", byNow: ["Bullseye / Core Commitment established", "Scope Snapshot prepared"], rightNow: ["Develop the Proposal and complete the Partner Scope Check", "Use implication → conversation → decision → project record → revised work for consequential change"], dependencies: ["Teaching-team Proposal clearance is required before signature routing."] },
    { id: "research-ethics", journeyLabel: "Research Ethics", start: "2026-10-14", end: "2026-10-18", activeStart: "2026-10-14", activeEnd: "2027-04-12", title: "Research Ethics and pathway confirmation", resourceGroup: "researchEthics", description: "Every Practicum project has ethical responsibilities. Only some require formal ethics review. The whole project design—not a method alone—determines the route, and the teaching team confirms it.", byNow: ["Project purpose, intended use, methods, people or materials, and partner context described", "Proposal and scope questions visible"], rightNow: ["Use the common ethics framework to identify authority, permissions, risk, context, and stewardship", "Confirm the project pathway with the teaching team"], dependencies: ["Do not recruit participants, collect research data, or convert informal conversations into research evidence before the required pathway and conditions are in place."] },
    { id: "ethics-pathway", journeyLabel: "Ethics Pathway", start: "2026-10-19", end: "2026-10-20", activeStart: "2026-10-19", activeEnd: "2027-04-12", title: "Confirmed ethics pathway", resourceGroup: "ethicsPathway", description: "Pathway-specific work begins from a route already confirmed with the teaching team. Behavioural and Archival Research are pathways; Program Evaluation and No Formal Review are Canvas branches within the broader pathway for research that does not require formal review.", byNow: ["Common Research Ethics introduced", "Project design information available for teaching-team confirmation"], rightNow: ["Work only from the route confirmed with the teaching team", "Use the October 19 contingency only if partner availability requires it"], dependencies: ["Selecting a route in this Navigator does not create, approve, or change the formal pathway."] },
    { id: "ethics-readiness", journeyLabel: "Ethics / Readiness Development", start: "2026-10-21", end: "2026-11-03", activeStart: "2026-10-21", activeEnd: "2026-11-13", title: "Ethics development and project readiness", resourceGroup: "ethicsDevelopment", description: "All students develop, test, clarify, revise, and assemble the ethics or project-readiness materials appropriate to the confirmed route while Proposal work continues.", byNow: ["Confirmed pathway normally identified", "Early project design substantial enough to test"], rightNow: ["Use Checkpoint 1, partner consultation, Case Conferences, Proposal feedback, and Development Day to improve one coherent package", "Complete the ethics or Project-Readiness Package Draft by November 2"], dependencies: [] },
    { id: "quality-control", journeyLabel: "Quality Control", start: "2026-11-04", end: "2026-11-12", activeStart: "2026-11-04", activeEnd: "2026-11-13", title: "Quality control and final assembly", resourceGroup: "quality", description: "Every student reviews the substantially complete Proposal and ethics/readiness package as one coherent whole, then revises, finalizes, and reaches the appropriate gate.", byNow: ["Complete ethics or Project-Readiness Package Draft assembled", "Teaching-team-cleared and student-signed Proposal sent to the partner"], rightNow: ["Incorporate feedback, correct inconsistencies, complete documentation, assemble, and proofread", "Complete final Proposal signatures in the required order by November 4 EOD"], dependencies: ["Consequential changes after the November 6 substantive-review cutoff go to the teaching team."] },
    { id: "ethics-readiness-gate", journeyLabel: "Ethics / Readiness Gate", start: "2026-11-13", end: "2026-11-15", activeStart: "2026-11-13", activeEnd: null, title: "Pathway-specific ethics or readiness gate", resourceGroup: "quality", description: "The November gate branches by confirmed route. Formal submission is not approval; project-readiness confirmation is not formal ethics approval; archival conditions depend on the actual project.", byNow: ["Quality control and final assembly completed according to the calendar", "Final signed Proposal uploaded to the designated project folder"], rightNow: ["Follow only the gate and conditions that apply to the confirmed route", "Remember: the gate applies to the project that was reviewed, not a different project"], dependencies: [] },
    { id: "foundation", journeyLabel: "Research Foundation", start: "2026-11-16", end: "2027-01-20", activeStart: "2026-11-16", activeEnd: "2027-04-12", title: "Research Foundation", resourceGroup: "foundation", description: "You are building a project-specific knowledge base to inform the decisions, design, interpretation, and next steps of the Practicum project—not an annotated bibliography.", byNow: ["Appropriate ethics/readiness gate reached or outstanding conditions clearly identified", "Project’s initial knowledge needs visible"], rightNow: ["Develop approximately 3–5 provisional knowledge needs", "Use approximately 8–12 substantive sources or materials as guidance, not a quota", "Ask: What does this project need us to understand in order to do the work well?"], dependencies: ["A finding may identify a possible project consequence; it does not automatically become a project decision."], seasonalGuidance: { start: "2026-12-03", end: "2027-01-05", note: "The course is between scheduled meetings. No continuous December production is implied; Research Foundation work resumes with Term 2.", rightNow: ["Use the scheduled course break as a break", "Return ready to re-enter Research Foundation and collaborative design work"] } },
    { id: "collaborative-design", journeyLabel: "Collaborative Design", start: "2027-01-21", end: "2027-01-31", activeStart: "2027-01-06", activeEnd: "2027-03-24", title: "Collaborative design and Milestone preparation", resourceGroup: "development", description: "The working cycle is rhythm → prototype or partial form → focused feedback → visible decision → next iteration. Feedback is input into a decision, not automatically the decision itself.", byNow: ["Term 2 working rhythm re-established", "Research Foundation completed or in its final scheduled conversation"], rightNow: ["Build the smallest version that can teach you what you need to know next", "Confirm the exact substantive form that will count as the Deliverable Milestone"], dependencies: ["Blocked work is information. Surface blockers, partner needs, access issues, and workload concerns early."], term2Limited: true },
    { id: "milestone", journeyLabel: "Milestone", start: "2027-02-01", end: "2027-02-10", activeStart: "2027-01-27", activeEnd: "2027-02-10", title: "Deliverable Milestone and feedback", resourceGroup: "milestone", description: "The Milestone shows meaningful substantive progress in a form appropriate to the project. It is assessed for progress and responsiveness—not final polish.", byNow: ["Exact Milestone form confirmed in Project Studio", "Early-warning Project Pulse completed"], rightNow: ["Submit the substantive partial form", "Use the post-Milestone clinics to decide what the project needs next"], dependencies: ["Feedback is input into a decision; record consequential decisions and resulting changes."], term2Limited: true },
    { id: "deliverable-development", journeyLabel: "Deliverable Development", start: "2027-02-11", end: "2027-03-07", activeStart: "2027-01-06", activeEnd: "2027-03-25", title: "Deliverable development", resourceGroup: "development", description: "You are developing a usable partner-facing deliverable through research, partial forms, focused feedback, visible decisions, and iteration.", byNow: ["Deliverable Milestone and clinic feedback available", "Project board reflects agreed consequential changes"], rightNow: ["Build the smallest useful next version", "Keep handoff, access, permissions, and information-handling conditions visible"], dependencies: ["Work outside formal approval, readiness conditions, permission, or access authorization remains on hold."], term2Limited: true },
    { id: "partner-review", journeyLabel: "Partner Review", start: "2027-03-08", end: "2027-03-24", activeStart: "2027-03-08", activeEnd: "2027-03-24", title: "Partner review and final revision", resourceGroup: "partnerReview", description: "The partner-review draft begins a consequential review cycle. Feedback generates possibilities; agreed decisions determine what changes.", byNow: ["Partner-review draft provided according to the project plan"], rightNow: ["Use focused partner feedback to make visible decisions", "Resolve usability, format, access, permission, and handover questions before March 25"], dependencies: ["Partner action may be required before the next step; communicate and record what remains outstanding."], term2Limited: true },
    { id: "handoff", journeyLabel: "Handoff", start: "2027-03-25", end: "2027-03-30", activeStart: "2027-03-25", activeEnd: "2027-04-12", title: "Final deliverable handoff", resourceGroup: "closeout", description: "The substantive community research deliverable should now be transferred according to the agreed project plan. A project need not be a conventional written report.", byNow: ["Final substantive deliverable completed according to the calendar"], rightNow: ["Confirm transfer, access, format, permissions, and remaining partner actions", "Begin presentation and closeout work"], dependencies: ["Partner-dependent actions should be documented rather than silently treated as complete."], term2Limited: true },
    { id: "presentation", journeyLabel: "Presentation", start: "2027-03-31", end: "2027-04-07", activeStart: "2027-03-31", activeEnd: "2027-04-07", title: "Community Research Presentation", resourceGroup: "closeout", description: "You are preparing a clear public account of what was asked, what you did, what changed, and what resulted. Slides are not separately graded; paired presentations are permitted where appropriate.", byNow: ["Community Research Deliverable(s) handed off", "Presentation account grounded in the actual project"], rightNow: ["Prepare the Community Research Presentation", "Keep confidential, identifying, restricted, and culturally sensitive information protected"], dependencies: ["Public presentation requires the permissions and information-handling conditions actually in place."], term2Limited: true },
    { id: "closeout", journeyLabel: "Closeout", start: "2027-04-08", end: "2027-04-12", activeStart: "2027-04-08", activeEnd: "2027-04-12", title: "Project closeout", resourceGroup: "closeout", description: "The project is not finished merely because the deliverable was submitted. Closeout completes transfer, documentation, information handling, permissions/access cleanup, project-board closure, and outstanding responsibilities.", byNow: ["Community Research Presentation completed according to the calendar"], rightNow: ["Complete all closeout actions within your control", "Document partner-dependent actions that remain outstanding"], dependencies: ["Partner action may remain outstanding; record ownership and next steps clearly."], term2Limited: true },
    { id: "complete", journeyLabel: "Complete", start: "2027-04-13", end: null, activeStart: "2027-04-13", activeEnd: null, title: "Practicum timeline complete", resourceGroup: "closeout", description: "The formal FNIS 400 practicum timeline is complete. Retain the final materials and records needed for responsible handoff and reference.", byNow: ["Formal course timeline concluded"], rightNow: ["Contact the teaching team if a documented partner-dependent closeout action remains"] }
  ];

  const COURSE_EVENTS = [
    { id: "course-orientation", date: "2026-09-09", title: "Orientation, Start Here, and Placement & Matching begin", type: "module", stageIds: ["orientation", "placement"] },
    { id: "personal-profile-due", date: "2026-09-14", title: "Personal Profile due", type: "submission", stageIds: ["placement"] },
    { id: "partner-fair", date: "2026-09-16", title: "Partner Fair", type: "activity", location: "UBC Alumni Centre", stageIds: ["placement"] },
    { id: "preliminary-placement-interests", date: "2026-09-18", title: "Preliminary Placement Interests due", type: "submission", stageIds: ["placement"], context: "Identify three unranked placements you would seriously consider. This is not the Final Placement Ranking." },
    { id: "resume-cover-letter-due", date: "2026-09-21", time: "12:00", order: 1, title: "Practicum Résumé & tailored Cover Letter(s) due", shortTitle: "Résumé & Cover Letter(s) due", type: "submission", stageIds: ["placement"], context: "Upload to Canvas; send relevant materials to prospective partner(s); copy the teaching team." },
    { id: "two-way-interviews", date: "2026-09-21", endDate: "2026-09-24", order: 2, title: "Targeted Two-Way Interviews", type: "activity", stageIds: ["placement"], context: "Every student has at least one reciprocal fit conversation; students are evaluating the placement as well as being evaluated." },
    { id: "common-research-methods-start", date: "2026-09-23", title: "Common Research Methods begins", type: "module", stageIds: ["methods-scoping"], context: "A method does not determine the ethics pathway; the whole project design matters." },
    { id: "final-placement-ranking", date: "2026-09-24", title: "Final Placement Ranking due", type: "submission", stageIds: ["placement"] },
    { id: "placement-confirmation", date: "2026-09-25", title: "Placement Confirmation", type: "activity", gate: true, stageIds: ["placement"], context: "Placement confirmation enables partnership and project work to proceed." },
    { id: "pulse-2026-09-27", date: "2026-09-27", title: "Project Pulse", type: "pulse", stageIds: ["partnership"] },
    { id: "partnership-scoping-start", date: "2026-09-28", title: "Beginning the Partnership and Scoping Your Project begin", type: "module", stageIds: ["partnership", "methods-scoping"], context: "The first partner meeting should happen as soon as reasonably possible, ideally in the first week; this is not an inflexible site-visit window." },
    { id: "university-closed", date: "2026-09-30", title: "No seminar — University closed", type: "break", stageIds: ["partnership"] },
    { id: "pulse-2026-10-04", date: "2026-10-04", title: "Project Pulse", type: "pulse", stageIds: ["partnership", "methods-scoping"] },
    { id: "bullseye-core-commitment", date: "2026-10-05", title: "Bullseye / Core Commitment", type: "activity", stageIds: ["methods-scoping"], context: "Identify the Must Have contribution and separate important-but-negotiable, possible, or deferred work." },
    { id: "proposal-module-start", date: "2026-10-07", order: 1, title: "Project Proposals begins", type: "module", stageIds: ["proposal"] },
    { id: "scope-snapshot", date: "2026-10-07", order: 2, title: "Scope Snapshot", type: "submission", stageIds: ["methods-scoping", "proposal"] },
    { id: "partner-scope-check", date: "2026-10-09", endDate: "2026-10-16", title: "Partner Scope Check", type: "activity", stageIds: ["methods-scoping", "proposal"] },
    { id: "research-ethics-start", date: "2026-10-14", title: "Research Ethics begins", type: "module", stageIds: ["research-ethics"], context: "Every Practicum project has ethical responsibilities. Only some require formal ethics review." },
    { id: "ethics-pathways-start", date: "2026-10-19", order: 1, title: "Confirmed pathway-specific work begins", type: "module", gate: true, stageIds: ["ethics-pathway"], context: "The teaching team confirms the route. Program Evaluation and No Formal Review are Canvas branches within the broader non-formal-review pathway." },
    { id: "scope-contingency", date: "2026-10-19", order: 2, title: "Partner Scope Check contingency", type: "activity", stageIds: ["proposal"], context: "Use only where partner availability requires it." },
    { id: "ethics-readiness-start", date: "2026-10-21", order: 1, title: "Ethics Development & Project Readiness begins", type: "module", stageIds: ["ethics-readiness"] },
    { id: "partner-ethics-check-in", date: "2026-10-21", endDate: "2026-10-30", order: 2, title: "Partner Ethics & Project-Development Check-In", type: "activity", stageIds: ["ethics-readiness"] },
    { id: "checkpoint-1", date: "2026-10-23", order: 1, title: "Ethics & Project-Readiness Checkpoint 1", type: "submission", stageIds: ["ethics-readiness"], context: "Required course checkpoint; not separately graded. Bring an early but substantive version while important issues can still be addressed." },
    { id: "sarah-office-hours-1", date: "2026-10-23", timeLabel: "11:00 AM–12:00 PM", order: 2, title: "Sarah Flann Office Hours", type: "activity", stageIds: ["ethics-readiness"], context: "Primarily for early formal-ethics and information-practice questions. Zoom link TBC." },
    { id: "case-conference-a", date: "2026-10-26", timeLabel: "1:00–3:00 PM", title: "Ethics Case Conference — Group A", type: "seminar", location: "CIS Meeting Room, Buchanan E273", stageIds: ["ethics-readiness"], context: "Bring one live ethics or project-readiness issue. No slides; share only the minimum necessary context." },
    { id: "case-conference-b", date: "2026-10-27", timeLabel: "1:00–3:00 PM", title: "Ethics Case Conference — Group B", type: "seminar", location: "CIS Meeting Room, Buchanan E273", stageIds: ["ethics-readiness"], context: "Bring one live ethics or project-readiness issue. No slides; share only the minimum necessary context." },
    { id: "complete-proposal-draft", date: "2026-10-28", title: "Complete Proposal draft", type: "submission", stageIds: ["proposal", "ethics-readiness"] },
    { id: "proposal-clearance", date: "2026-10-29", title: "Teaching-team Proposal clearance or required revisions returned", shortTitle: "Proposal clearance / revisions returned", type: "activity", gate: true, stageIds: ["proposal", "ethics-readiness"], context: "This is clearance, not teaching-team signature. Clearance is required before signature routing." },
    { id: "ethics-development-day", date: "2026-10-30", order: 1, title: "Ethics Development Day", type: "activity", stageIds: ["ethics-readiness"], context: "There is no second formal checkpoint submission." },
    { id: "proposal-revisions", date: "2026-10-30", order: 2, title: "Complete required Proposal revisions, where applicable", type: "submission", stageIds: ["proposal", "ethics-readiness"] },
    { id: "sarah-office-hours-2", date: "2026-10-30", timeLabel: "2:00–3:00 PM", order: 3, title: "Sarah Flann Office Hours", type: "activity", stageIds: ["ethics-readiness"], context: "For substantive unresolved issues before final package assembly. Zoom link TBC." },
    { id: "ethics-readiness-package-draft", date: "2026-11-02", order: 1, title: "Complete Ethics / Project-Readiness Package Draft due", shortTitle: "Complete Ethics / Readiness Package Draft", type: "submission", gate: true, stageIds: ["ethics-readiness", "quality-control"], context: "Major assembly gate before Quality Control." },
    { id: "proposal-to-partner", date: "2026-11-02", order: 2, title: "Cleared and student-signed Proposal sent to community partner", type: "submission", stageIds: ["proposal", "quality-control"], context: "Required sequence: teaching-team clearance → student signs → community partner signs → instructor signs last." },
    { id: "quality-control-seminar", date: "2026-11-04", order: 1, title: "Quality-Control Seminar", type: "seminar", stageIds: ["quality-control"], context: "Arrive with a substantially complete package; this is not a first-drafting session." },
    { id: "final-signed-proposal", date: "2026-11-04", order: 2, title: "Final Signed Project Proposal", type: "submission", weight: "15%", assessmentId: "projectProposal", gate: true, stageIds: ["proposal", "quality-control"], context: "Due EOD. Community partner signature complete; instructor signs last; upload to the designated project folder. The confirmed pathway should be identified." },
    { id: "substantive-review-cutoff", date: "2026-11-06", title: "Substantive-review cutoff", type: "activity", stageIds: ["quality-control"], context: "After this point, emphasis shifts to incorporating feedback, correcting inconsistencies, final assembly, and proofreading." },
    { id: "november-midterm-break", date: "2026-11-09", endDate: "2026-11-11", title: "Midterm Break", type: "break", stageIds: ["quality-control"] },
    { id: "final-assembly-readiness", date: "2026-11-12", title: "Final Assembly & Readiness Check", type: "activity", stageIds: ["quality-control"] },
    { id: "november-pathway-gate", date: "2026-11-13", title: "Final Ethics / Project-Readiness Gate", type: "project-gate", gate: true, stageIds: ["ethics-readiness-gate"], context: "The specific endpoint depends on the project’s confirmed pathway.", pathwayDetails: {
      "not-confirmed": { title: "Pathway Not Yet Confirmed", context: "The teaching team must confirm the project pathway before pathway-dependent work can proceed. This is a blocking dependency, not a different November 13 course event." },
      behavioural: { title: "Formal Ethics Submission, where required", timeLabel: "12:00 PM", statusNote: "Working date, pending final committee confirmation.", context: "Submission is not approval. Work requiring formal ethics approval remains on hold until approval is actually received." },
      archival: { title: "Archival Conditions / Review in Progress", context: "The applicable endpoint depends on the project’s access, authority, permission, protocol, privacy, sensitivity, and stewardship conditions. No universal REB-style archival submission or approval process is implied." },
      "program-evaluation": { title: "Project-Readiness Confirmation", context: "The teaching team confirms Ready to Proceed, Ready with Conditions, or Not Yet Ready. This is a course-level readiness determination, not formal ethics approval; readiness may be partial." },
      "no-formal-review": { title: "Project-Readiness Confirmation", context: "The teaching team confirms Ready to Proceed, Ready with Conditions, or Not Yet Ready. This is a course-level readiness determination, not formal ethics approval; readiness may be partial. No formal review does not mean unrestricted use, and unresolved conditions can keep specific work on hold." }
    } },
    { id: "research-foundation-start", date: "2026-11-16", title: "Research Foundation begins", type: "module", stageIds: ["foundation"], context: "A project-specific knowledge base, not an annotated bibliography." },
    { id: "xwi7xwa-preparation", date: "2026-11-17", timeLabel: "11:59 PM", title: "X̱wi7x̱wa Preparation due", type: "submission", stageIds: ["foundation"], context: "Prepare a short working document with a project description, 3–5 provisional knowledge needs, existing materials, and 1–2 focused search-support questions." },
    { id: "pulse-2026-11-22", date: "2026-11-22", title: "Project Pulse", type: "pulse", stageIds: ["foundation"] },
    { id: "pulse-2026-11-29", date: "2026-11-29", title: "Project Pulse", type: "pulse", stageIds: ["foundation"] },
    { id: "term-one-wrap", date: "2026-12-02", title: "Term 1 Wrap-Up", type: "seminar", stageIds: ["foundation"] },
    { id: "collaborative-design-start", date: "2027-01-06", title: "Collaborative Design & Iteration begins", type: "module", stageIds: ["collaborative-design", "deliverable-development"] },
    { id: "pulse-2027-01-10", date: "2027-01-10", title: "Project Pulse", type: "pulse", stageIds: ["foundation", "collaborative-design"] },
    { id: "foundation-group-a", date: "2027-01-11", title: "Written Research Foundation — Group A", type: "submission", stageIds: ["foundation"], context: "Group A and Group B are scheduling groups for one 15% Research Foundation assignment." },
    { id: "foundation-conversation-a", date: "2027-01-13", title: "Research Foundation Conversation — Group A", type: "activity", stageIds: ["foundation"], context: "Required, not separately graded; no slides. Bring a live question, tension, gap, constraint, possible consequence, or decision point." },
    { id: "foundation-group-b", date: "2027-01-18", title: "Written Research Foundation — Group B", type: "submission", stageIds: ["foundation"], context: "Group A and Group B are scheduling groups for one 15% Research Foundation assignment." },
    { id: "foundation-conversation-b", date: "2027-01-20", title: "Research Foundation Conversation — Group B", type: "activity", stageIds: ["foundation"], context: "Required, not separately graded; no slides. Bring a live question, tension, gap, constraint, possible consequence, or decision point." },
    { id: "pulse-2027-01-24", date: "2027-01-24", title: "Project Pulse", type: "pulse", stageIds: ["collaborative-design"] },
    { id: "milestone-form-confirmation", date: "2027-01-27", title: "Project Studio — Milestone form confirmed", type: "activity", stageIds: ["collaborative-design", "milestone"] },
    { id: "pulse-2027-01-31", date: "2027-01-31", title: "Project Pulse", type: "pulse", stageIds: ["collaborative-design", "milestone"], context: "Early-warning Pulse immediately before the Deliverable Milestone." },
    { id: "deliverable-milestone", date: "2027-02-01", title: "Deliverable Milestone", type: "submission", weight: "10%", assessmentId: "deliverableMilestone", stageIds: ["milestone"] },
    { id: "milestone-clinic-a", date: "2027-02-03", title: "Milestone Clinic A", type: "activity", stageIds: ["milestone"] },
    { id: "milestone-clinic-b", date: "2027-02-10", title: "Milestone Clinic B", type: "activity", stageIds: ["milestone"] },
    { id: "pulse-2027-02-14", date: "2027-02-14", title: "Project Pulse", type: "pulse", stageIds: ["deliverable-development"] },
    { id: "pulse-2027-02-28", date: "2027-02-28", title: "Project Pulse", type: "pulse", stageIds: ["deliverable-development"] },
    { id: "working-deliverable", date: "2027-03-01", title: "Working deliverable", type: "activity", stageIds: ["deliverable-development"], context: "A working form used to learn what the project needs next; not separately graded." },
    { id: "partner-review-draft", date: "2027-03-08", title: "Partner-review draft", type: "submission", gate: true, stageIds: ["partner-review"], context: "A commitment to the community partner and the start of a consequential review cycle." },
    { id: "pulse-2027-03-21", date: "2027-03-21", title: "Project Pulse", type: "pulse", stageIds: ["partner-review"] },
    { id: "community-research-deliverables", date: "2027-03-25", title: "Community Research Deliverable(s)", type: "submission", weight: "30%", assessmentId: "communityResearchDeliverables", gate: true, stageIds: ["handoff"], context: "Final substantive work is handed off according to the project plan; not every project produces a conventional written report." },
    { id: "musqueam-presentation", date: null, month: "2027-03", title: "Musqueam Presentation / Gathering", type: "presentation", status: "tbc", stageIds: ["presentation"], context: "March date TBC with Musqueam. Not separately graded." },
    { id: "community-research-presentation", date: "2027-04-07", title: "Community Research Presentation", type: "presentation", weight: "10%", assessmentId: "communityResearchPresentation", stageIds: ["presentation"], context: "Slides are not separately graded. Paired presentations are permitted where appropriate." },
    { id: "project-closeout-complete", date: "2027-04-12", title: "Project Closeout complete", type: "submission", stageIds: ["closeout"], context: "Closeout forms part of Community Research Process and includes actions within the student’s control plus documentation of partner-dependent actions." }
  ];

  const JOURNEY_STAGE_IDS = ["orientation", "placement", "partnership", "methods-scoping", "proposal", "research-ethics", "ethics-pathway", "ethics-readiness", "quality-control", "ethics-readiness-gate", "foundation", "collaborative-design", "milestone", "deliverable-development", "partner-review", "handoff", "presentation", "closeout"];

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

  function getVancouverToday(now) {
    const parts = new Intl.DateTimeFormat("en-CA", { timeZone: COURSE_CONFIG.timezone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now || new Date());
    const values = {};
    parts.forEach(function (part) { if (part.type !== "literal") values[part.type] = part.value; });
    return values.year + "-" + values.month + "-" + values.day;
  }

  function getStage(isoDate) { return COURSE_STAGES.find(function (stage) { return (!stage.start || isoDate >= stage.start) && (!stage.end || isoDate <= stage.end); }); }

  function getActiveStages(isoDate) {
    return COURSE_STAGES.filter(function (stage) {
      if (stage.id === "before" || stage.id === "complete") return false;
      return (!stage.activeStart || isoDate >= stage.activeStart) && (!stage.activeEnd || isoDate <= stage.activeEnd);
    });
  }

  function normalizePathway(pathwayId) { return PROJECT_PATHWAYS[pathwayId] ? pathwayId : "not-confirmed"; }

  function resolveEventForPathway(event, pathwayId) {
    const resolved = Object.assign({}, event);
    if (event.pathwayDetails) {
      const detail = event.pathwayDetails[normalizePathway(pathwayId)] || event.pathwayDetails["not-confirmed"];
      resolved.pathwayDetail = Object.assign({}, detail);
      delete resolved.pathwayDetails;
    }
    return resolved;
  }

  function sortedDatedEvents(pathwayId) {
    return COURSE_EVENTS.filter(function (event) { return event.date; }).slice().sort(function (a, b) {
      return a.date.localeCompare(b.date) || (Number(a.order) || 0) - (Number(b.order) || 0) || a.id.localeCompare(b.id);
    }).map(function (event) { return resolveEventForPathway(event, pathwayId); });
  }

  function getUpcomingEvents(isoDate, count, pathwayId) {
    return sortedDatedEvents(pathwayId).filter(function (event) {
      return (event.endDate || event.date) >= isoDate;
    }).sort(function (a, b) {
      const aOngoing = a.date < isoDate && a.endDate >= isoDate;
      const bOngoing = b.date < isoDate && b.endDate >= isoDate;
      const aEffective = aOngoing ? isoDate : a.date;
      const bEffective = bOngoing ? isoDate : b.date;
      return aEffective.localeCompare(bEffective) || Number(aOngoing) - Number(bOngoing) || (Number(a.order) || 0) - (Number(b.order) || 0) || a.id.localeCompare(b.id);
    }).slice(0, count || 6);
  }
  function getNextEvent(isoDate, pathwayId) { return getUpcomingEvents(isoDate, 1, pathwayId)[0] || null; }
  function getNextGate(isoDate, pathwayId) { return sortedDatedEvents(pathwayId).find(function (event) { return event.gate && event.date >= isoDate; }) || null; }

  function getPathwayState(pathwayId, isoDate) {
    const id = normalizePathway(pathwayId);
    const pathway = PROJECT_PATHWAYS[id];
    const state = pathway.states.slice().reverse().find(function (item) { return (!item.from || isoDate >= item.from) && (!item.until || isoDate <= item.until); }) || pathway.states[0];
    return Object.assign({ id: id, label: pathway.label, conceptualPathway: pathway.conceptualPathway }, state);
  }

  function activeResourcePriority(context, isoDate) {
    if (!Array.isArray(context.usefulPeriods)) return Number(context.priority) || 0;
    const activePeriods = context.usefulPeriods.filter(function (period) { return (!period.from || isoDate >= period.from) && (!period.until || isoDate <= period.until); });
    if (!activePeriods.length) return null;
    return activePeriods.reduce(function (highest, period) { return Math.max(highest, Number(period.priority) || Number(context.priority) || 0); }, 0);
  }

  function getResourcesForStage(stage, isoDate, pathwayId) {
    const currentDate = isValidDate(isoDate) ? isoDate : getVancouverToday();
    const selectedPathway = normalizePathway(pathwayId);
    const candidates = [];
    let sourceOrder = 0;
    Object.keys(COURSE_RESOURCE_CONTEXTS).forEach(function (groupName) {
      COURSE_RESOURCE_CONTEXTS[groupName].forEach(function (context) {
        const order = sourceOrder;
        sourceOrder += 1;
        const inPrimaryPool = groupName === stage.resourceGroup;
        const inAdditionalStage = Array.isArray(context.stages) && context.stages.includes(stage.id);
        if ((!inPrimaryPool && !inAdditionalStage) || (context.pathways && !context.pathways.includes(selectedPathway))) return;
        const priority = activeResourcePriority(context, currentDate);
        const definition = COURSE_RESOURCES[context.resourceId];
        if (priority === null || !definition) return;
        candidates.push({ resource: Object.assign({ id: context.resourceId }, definition), priority: priority, order: order });
      });
    });
    const uniqueCandidates = new Map();
    candidates.forEach(function (candidate) {
      const existing = uniqueCandidates.get(candidate.resource.id);
      if (!existing || candidate.priority > existing.priority) uniqueCandidates.set(candidate.resource.id, candidate);
    });
    return Array.from(uniqueCandidates.values()).sort(function (a, b) { return b.priority - a.priority || a.order - b.order; }).slice(0, COURSE_CONFIG.resourceDisplayLimit).map(function (candidate) { return candidate.resource; });
  }

  return {
    COURSE_CONFIG: COURSE_CONFIG,
    COURSE_MODULES: COURSE_MODULES,
    COURSE_ASSESSMENTS: COURSE_ASSESSMENTS,
    COURSE_RESOURCES: COURSE_RESOURCES,
    COURSE_RESOURCE_CONTEXTS: COURSE_RESOURCE_CONTEXTS,
    PROJECT_PATHWAYS: PROJECT_PATHWAYS,
    COURSE_STAGES: COURSE_STAGES,
    COURSE_EVENTS: COURSE_EVENTS,
    JOURNEY_STAGE_IDS: JOURNEY_STAGE_IDS,
    utils: {
      parseDateParts: parseDateParts,
      isValidDate: isValidDate,
      dateOrdinal: dateOrdinal,
      daysBetween: daysBetween,
      getVancouverToday: getVancouverToday,
      getStage: getStage,
      getActiveStages: getActiveStages,
      normalizePathway: normalizePathway,
      resolveEventForPathway: resolveEventForPathway,
      sortedDatedEvents: sortedDatedEvents,
      getUpcomingEvents: getUpcomingEvents,
      getNextEvent: getNextEvent,
      getNextGate: getNextGate,
      getPathwayState: getPathwayState,
      getResourcesForStage: getResourcesForStage
    }
  };
});
