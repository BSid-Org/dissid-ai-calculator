// SOC 2 readiness self-assessment data + scoring.
//
// Grounded in the AICPA Trust Services Criteria (TSC, 2017 — points of focus
// revised 2022): five categories — Security (Common Criteria CC1–CC9),
// Availability (A1), Processing Integrity (PI1), Confidentiality (C1), and
// Privacy (P1–P8). Each question below maps to a real Common Criterion or
// category-specific criterion and a commonly-audited SOC 2 control. The
// criterion IDs are the AICPA series; they are NOT invented.
//
// IMPORTANT: this is a self-assessment readiness ESTIMATE, not a SOC 2 audit.
// A real SOC 2 report can only be issued by a licensed CPA firm.

export type Answer = "yes" | "partial" | "no";

// The five Trust Services Categories. Security is the mandatory baseline
// (the Common Criteria apply to every SOC 2 engagement); the other four are
// elective and only in scope if the org commits to them.
export const categories = [
  {
    id: "security",
    label: "Security",
    short: "Security (Common Criteria)",
    criteria: "CC1–CC9",
    icon: "security",
    mandatory: true,
    description:
      "The mandatory baseline — Common Criteria covering access, monitoring, change and risk. Required in every SOC 2 report.",
  },
  {
    id: "availability",
    label: "Availability",
    short: "Availability",
    criteria: "A1",
    icon: "cloud_done",
    mandatory: false,
    description:
      "Systems are available for operation and use as committed (uptime, DR, capacity).",
  },
  {
    id: "confidentiality",
    label: "Confidentiality",
    short: "Confidentiality",
    criteria: "C1",
    icon: "lock",
    mandatory: false,
    description:
      "Information designated as confidential is protected as committed (encryption, retention, disposal).",
  },
  {
    id: "processing_integrity",
    label: "Processing Integrity",
    short: "Processing Integrity",
    criteria: "PI1",
    icon: "fact_check",
    mandatory: false,
    description:
      "System processing is complete, valid, accurate, timely and authorized.",
  },
  {
    id: "privacy",
    label: "Privacy",
    short: "Privacy",
    criteria: "P1–P8",
    icon: "shield_person",
    mandatory: false,
    description:
      "Personal information is collected, used, retained, disclosed and disposed of per the entity's privacy notice.",
  },
] as const;

export type CategoryId = (typeof categories)[number]["id"];

// Priority drives gap ordering and per-question weight. High-priority controls
// (access/MFA, encryption, logging, incident response) are the ones auditors —
// and breach post-mortems — weight most heavily.
export type Priority = "high" | "medium" | "low";

export interface Question {
  id: string;
  category: CategoryId;
  // The AICPA criterion this maps to (real TSC series IDs).
  criterion: string;
  // Short control name shown in the gap list.
  control: string;
  // The yes/no prompt shown to the user.
  prompt: string;
  priority: Priority;
  // What to do if the answer is "no" / "partial" — the remediation hint.
  remediation: string;
}

// ~22 questions. Security carries the bulk (it is the mandatory baseline);
// each elective category adds a focused set that only appears when in scope.
export const questions: Question[] = [
  // ---- SECURITY / Common Criteria (CC1–CC9) ----
  {
    id: "sec_access_mfa",
    category: "security",
    criterion: "CC6.1",
    control: "Access control & MFA",
    prompt:
      "Is access to production systems restricted by role and protected with multi-factor authentication (MFA)?",
    priority: "high",
    remediation:
      "Enforce SSO + MFA on all production and admin accounts; restrict access by role (RBAC).",
  },
  {
    id: "sec_least_privilege",
    category: "security",
    criterion: "CC6.3",
    control: "Least privilege",
    prompt:
      "Are user permissions granted on a least-privilege basis and reviewed periodically?",
    priority: "high",
    remediation:
      "Implement least-privilege roles and run documented quarterly access reviews.",
  },
  {
    id: "sec_encryption",
    category: "security",
    criterion: "CC6.7",
    control: "Encryption in transit & at rest",
    prompt:
      "Is sensitive data encrypted both in transit (TLS) and at rest?",
    priority: "high",
    remediation:
      "Enable TLS everywhere and encryption-at-rest (e.g. AES-256) for databases, object stores and backups.",
  },
  {
    id: "sec_logging",
    category: "security",
    criterion: "CC7.2",
    control: "Logging & monitoring",
    prompt:
      "Do you centrally collect security logs and monitor/alert on anomalous activity?",
    priority: "high",
    remediation:
      "Centralize logs (SIEM/aggregator) and configure alerting on auth failures, privilege changes and anomalies.",
  },
  {
    id: "sec_incident_response",
    category: "security",
    criterion: "CC7.4",
    control: "Incident response plan",
    prompt:
      "Do you have a documented, tested incident response plan with defined roles and escalation?",
    priority: "high",
    remediation:
      "Write an incident response plan (detection, containment, notification, post-mortem) and run a tabletop test.",
  },
  {
    id: "sec_vuln_mgmt",
    category: "security",
    criterion: "CC7.1",
    control: "Vulnerability management",
    prompt:
      "Do you scan for vulnerabilities and patch on a defined schedule (incl. dependencies)?",
    priority: "high",
    remediation:
      "Run regular vulnerability + dependency scans and define SLAs to remediate by severity.",
  },
  {
    id: "sec_change_mgmt",
    category: "security",
    criterion: "CC8.1",
    control: "Change management",
    prompt:
      "Are changes to production code/infrastructure reviewed, approved and tracked (e.g. PRs + CI)?",
    priority: "medium",
    remediation:
      "Require peer-reviewed PRs, separate environments, and an auditable change/approval trail.",
  },
  {
    id: "sec_risk_assessment",
    category: "security",
    criterion: "CC3.2",
    control: "Risk assessment",
    prompt:
      "Do you run a documented risk assessment that identifies and rates threats to your systems?",
    priority: "medium",
    remediation:
      "Run an annual risk assessment, rate risks by likelihood/impact, and track treatment decisions.",
  },
  {
    id: "sec_policies",
    category: "security",
    criterion: "CC1.1",
    control: "Security policies",
    prompt:
      "Do you maintain written information-security policies that staff acknowledge?",
    priority: "medium",
    remediation:
      "Adopt a baseline policy set (infosec, acceptable use, data handling) and require annual acknowledgement.",
  },
  {
    id: "sec_onboarding",
    category: "security",
    criterion: "CC1.4",
    control: "Onboarding/offboarding & training",
    prompt:
      "Do you have formal onboarding/offboarding (access provisioning + revocation) and security awareness training?",
    priority: "medium",
    remediation:
      "Document joiner/mover/leaver flows (revoke access on exit) and run annual security-awareness training.",
  },
  {
    id: "sec_vendor_risk",
    category: "security",
    criterion: "CC9.2",
    control: "Vendor / third-party risk",
    prompt:
      "Do you assess the security of critical third-party vendors and subprocessors?",
    priority: "medium",
    remediation:
      "Maintain a vendor inventory; review subprocessor SOC 2 / security posture before and during use.",
  },
  {
    id: "sec_monitoring_controls",
    category: "security",
    criterion: "CC4.1",
    control: "Monitoring of controls",
    prompt:
      "Do you periodically evaluate whether your controls are operating effectively?",
    priority: "low",
    remediation:
      "Schedule internal control reviews / self-audits so deficiencies are caught before the audit.",
  },
  {
    id: "sec_comms",
    category: "security",
    criterion: "CC2.1",
    control: "Communication of objectives",
    prompt:
      "Are security responsibilities and objectives communicated to staff and (where relevant) external parties?",
    priority: "low",
    remediation:
      "Communicate security objectives internally and publish relevant commitments (e.g. a security page/contact).",
  },

  // ---- AVAILABILITY (A1) ----
  {
    id: "avail_backups_dr",
    category: "availability",
    criterion: "A1.2",
    control: "Backups & disaster recovery",
    prompt:
      "Do you take regular backups and have a tested disaster-recovery / restore process?",
    priority: "high",
    remediation:
      "Automate backups, define RPO/RTO, and test restores at least annually.",
  },
  {
    id: "avail_capacity",
    category: "availability",
    criterion: "A1.1",
    control: "Capacity monitoring",
    prompt:
      "Do you monitor capacity/performance and alert before resource exhaustion affects availability?",
    priority: "medium",
    remediation:
      "Monitor capacity metrics with thresholds and alerts; plan scaling ahead of demand.",
  },
  {
    id: "avail_recovery_tested",
    category: "availability",
    criterion: "A1.3",
    control: "Recovery testing",
    prompt:
      "Do you test recovery procedures (failover / restore) on a defined schedule?",
    priority: "medium",
    remediation:
      "Run scheduled failover/restore drills and record the results and remediation.",
  },

  // ---- CONFIDENTIALITY (C1) ----
  {
    id: "conf_classification",
    category: "confidentiality",
    criterion: "C1.1",
    control: "Data classification",
    prompt:
      "Do you identify and label confidential information so it can be protected appropriately?",
    priority: "high",
    remediation:
      "Define a data-classification scheme and tag confidential data so handling rules can apply.",
  },
  {
    id: "conf_disposal",
    category: "confidentiality",
    criterion: "C1.2",
    control: "Retention & secure disposal",
    prompt:
      "Do you securely retain and dispose of confidential information per a documented policy?",
    priority: "medium",
    remediation:
      "Adopt a retention schedule and secure-deletion process for confidential data and media.",
  },

  // ---- PROCESSING INTEGRITY (PI1) ----
  {
    id: "pi_input_validation",
    category: "processing_integrity",
    criterion: "PI1.2",
    control: "Input validation & accuracy",
    prompt:
      "Do you validate inputs and processing so data is complete, valid and accurate?",
    priority: "medium",
    remediation:
      "Add input validation, reconciliation checks and error handling across processing paths.",
  },
  {
    id: "pi_error_handling",
    category: "processing_integrity",
    criterion: "PI1.5",
    control: "Output & error monitoring",
    prompt:
      "Do you detect, log and correct processing errors (e.g. failed jobs, bad records)?",
    priority: "medium",
    remediation:
      "Monitor processing outputs, alert on failures, and define a correction/reprocessing workflow.",
  },

  // ---- PRIVACY (P1–P8) ----
  {
    id: "priv_notice",
    category: "privacy",
    criterion: "P1.1",
    control: "Privacy notice & consent",
    prompt:
      "Do you provide a privacy notice and obtain consent for collecting personal information where required?",
    priority: "high",
    remediation:
      "Publish a privacy notice describing collection/use and capture consent where the law requires it.",
  },
  {
    id: "priv_rights",
    category: "privacy",
    criterion: "P5.1",
    control: "Data-subject access/deletion",
    prompt:
      "Can data subjects access, correct or request deletion of their personal information?",
    priority: "medium",
    remediation:
      "Build a documented process to handle access, correction and deletion (DSAR) requests within required timeframes.",
  },
];

const priorityWeight: Record<Priority, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

const answerScore: Record<Answer, number> = {
  yes: 1,
  partial: 0.5,
  no: 0,
};

export interface CategoryResult {
  id: CategoryId;
  label: string;
  readiness: number; // 0–100
  answered: number;
  total: number;
}

export interface Gap {
  questionId: string;
  category: CategoryId;
  categoryLabel: string;
  control: string;
  criterion: string;
  priority: Priority;
  answer: "no" | "partial"; // a gap is only ever an unmet/partially-met control
  remediation: string;
}

export interface ReadinessResult {
  overall: number; // 0–100 weighted readiness
  perCategory: CategoryResult[];
  gaps: Gap[]; // prioritized: high → low, partials after nos within a tier
  effort: "low" | "medium" | "high";
  effortLabel: string;
  inScope: CategoryId[];
  highGaps: number;
}

// Return the questions in scope for the chosen categories. Security is always
// included (mandatory baseline) regardless of selection.
export function questionsInScope(selected: CategoryId[]): Question[] {
  const scope = new Set<CategoryId>(selected);
  scope.add("security");
  return questions.filter((q) => scope.has(q.category));
}

const priorityRank: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
// Within a priority tier, an unanswered control ("no") is a bigger gap than a
// partially-met one, so "no" sorts ahead of "partial".
const answerRank: Record<"no" | "partial", number> = { no: 0, partial: 1 };

/**
 * Score a SOC 2 readiness self-assessment.
 *
 * @param selected  the elective categories in scope (Security is always added)
 * @param answers   map of questionId -> "yes" | "partial" | "no"
 *
 * Weighting: each question contributes priorityWeight × answerScore. Overall
 * readiness is the weighted percentage across all in-scope questions, so
 * high-priority Security controls (CC6/CC7) dominate the number — a SOC 2 report
 * is Security-weighted by design.
 *
 * Complexity: O(n) over in-scope questions for scoring, O(g log g) to sort the
 * gap list (g = number of gaps). Pure + deterministic — no I/O.
 */
export function scoreReadiness(
  selected: CategoryId[],
  answers: Record<string, Answer>,
): ReadinessResult {
  const scope = new Set<CategoryId>(selected);
  scope.add("security");
  const inScope = categories
    .map((c) => c.id)
    .filter((id) => scope.has(id));

  const scoped = questions.filter((q) => scope.has(q.category));

  let weightedScore = 0;
  let weightedMax = 0;

  // Per-category accumulators.
  const catAccum = new Map<
    CategoryId,
    { score: number; max: number; answered: number; total: number }
  >();
  for (const id of inScope) {
    catAccum.set(id, { score: 0, max: 0, answered: 0, total: 0 });
  }

  const gaps: Gap[] = [];

  for (const q of scoped) {
    const ans = answers[q.id];
    const weight = priorityWeight[q.priority];
    const acc = catAccum.get(q.category)!;
    acc.total += 1;
    acc.max += weight;
    weightedMax += weight;

    // Unanswered questions count as "no" for scoring (conservative), but are
    // not surfaced as a remediation gap (we don't lecture on what they skipped).
    const effective: Answer = ans ?? "no";
    const s = answerScore[effective] * weight;
    acc.score += s;
    weightedScore += s;
    if (ans) acc.answered += 1;

    if (ans === "no" || ans === "partial") {
      const cat = categories.find((c) => c.id === q.category)!;
      gaps.push({
        questionId: q.id,
        category: q.category,
        categoryLabel: cat.label,
        control: q.control,
        criterion: q.criterion,
        priority: q.priority,
        answer: ans,
        remediation: q.remediation,
      });
    }
  }

  const overall =
    weightedMax > 0 ? Math.round((weightedScore / weightedMax) * 100) : 0;

  const perCategory: CategoryResult[] = inScope.map((id) => {
    const acc = catAccum.get(id)!;
    const cat = categories.find((c) => c.id === id)!;
    return {
      id,
      label: cat.label,
      readiness: acc.max > 0 ? Math.round((acc.score / acc.max) * 100) : 0,
      answered: acc.answered,
      total: acc.total,
    };
  });

  // Prioritize gaps: high → low, then "no" before "partial" within a tier.
  gaps.sort((a, b) => {
    const p = priorityRank[a.priority] - priorityRank[b.priority];
    if (p !== 0) return p;
    return answerRank[a.answer] - answerRank[b.answer];
  });

  const highGaps = gaps.filter((g) => g.priority === "high").length;

  // Effort framing from the readiness band (broad estimate, not a quote).
  let effort: ReadinessResult["effort"];
  let effortLabel: string;
  if (overall >= 80) {
    effort = "low";
    effortLabel = "Audit-ready soon — mostly evidence collection and minor gaps.";
  } else if (overall >= 50) {
    effort = "medium";
    effortLabel =
      "A focused remediation sprint — close the high-priority gaps first.";
  } else {
    effort = "high";
    effortLabel =
      "Foundational work needed — stand up core controls before an audit window.";
  }

  return {
    overall,
    perCategory,
    gaps,
    effort,
    effortLabel,
    inScope,
    highGaps,
  };
}
