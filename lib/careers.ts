/**
 * Content for the careers page. Same convention as lib/solutions.ts — the
 * components render whatever they are handed, so copy edits never require
 * touching layout.
 *
 * Imported from the Claude Design project "Rebel Labz Careers (standalone)".
 */

/** Discipline a role belongs to. Doubles as the filter set on the board. */
export const DISCIPLINES = [
  "Research",
  "Engineering",
  "Applied AI",
  "Ops",
] as const;

export type Discipline = (typeof DISCIPLINES)[number];

export type Role = {
  discipline: Discipline;
  title: string;
  /** Location and contract shape, e.g. "Remote · Full-time". */
  meta: string;
  posted: string;
  comp: string;
  featured?: boolean;
};

export type Perk = {
  title: string;
  desc: string;
};

export type CandidateFaq = {
  question: string;
  answer: string;
};

/** "All Roles" is the default chip; the rest mirror DISCIPLINES. */
export const ROLE_FILTERS = ["All Roles", ...DISCIPLINES] as const;

export type RoleFilter = (typeof ROLE_FILTERS)[number];

/** Roles revealed per page on the board, and per "load more" press. */
export const ROLES_PER_PAGE = 6;

export const ROLES: Role[] = [
  {
    discipline: "Research",
    title: "Applied Research Scientist — Memory Systems",
    meta: "Remote · Contract",
    posted: "2 days ago",
    comp: "$140–190k /yr",
    featured: true,
  },
  {
    discipline: "Engineering",
    title: "Senior Systems Engineer — Reasoning Engines",
    meta: "Remote · Full-time",
    posted: "3 days ago",
    comp: "$130–175k /yr",
    featured: true,
  },
  {
    discipline: "Applied AI",
    title: "Agent Mesh Engineer",
    meta: "Hybrid · NYC · Contract",
    posted: "4 days ago",
    comp: "$120–160k /yr",
  },
  {
    discipline: "Ops",
    title: "Deployment & Client Ops Lead",
    meta: "Remote · Full-time",
    posted: "5 days ago",
    comp: "$95–130k /yr",
  },
  {
    discipline: "Research",
    title: "Collective Intelligence Researcher",
    meta: "Remote · 6-mo residency",
    posted: "1 week ago",
    comp: "$110–150k /yr",
  },
  {
    discipline: "Engineering",
    title: "Frugal Compute Engineer",
    meta: "Remote · Full-time",
    posted: "1 week ago",
    comp: "$125–165k /yr",
  },
  {
    discipline: "Applied AI",
    title: "Evaluation & Drift Analyst",
    meta: "Remote · Full-time",
    posted: "1 week ago",
    comp: "$100–135k /yr",
  },
  {
    discipline: "Ops",
    title: "Candidate Desk Coordinator",
    meta: "Remote · Full-time",
    posted: "2 weeks ago",
    comp: "$70–90k /yr",
  },
];

export const PERKS: Perk[] = [
  {
    title: "Fair, transparent equity",
    desc: "Every hire gets equity banded by level and published internally — no negotiation games.",
  },
  {
    title: "Remote-first, always",
    desc: "Work from anywhere; we hire the person, not the timezone.",
  },
  {
    title: "Direct access to research",
    desc: "No layers between you and the problem — talk to the founders, week one.",
  },
  {
    title: "A real learning budget",
    desc: "Conference, course, or compute — your call, funded every quarter.",
  },
  {
    title: "Measured on outcomes",
    desc: "No hours logged, no busywork theater — just what shipped.",
  },
  {
    title: "Long-term, not headcount",
    desc: "We hire for years, not sprints — pipeline and continuity, not churn.",
  },
];

export const CANDIDATE_FAQS: CandidateFaq[] = [
  {
    question: "Do I need to apply for every role separately?",
    answer:
      "No — register once with your background and we'll match you to every relevant role as it opens, across every discipline.",
  },
  {
    question: "Is this fully remote?",
    answer:
      "Most roles are remote-first; a few hybrid or on-site roles are marked directly in the listing.",
  },
  {
    question: "How is equity decided?",
    answer:
      "Banded by level and published internally — the same offer for everyone at that level, no back-room negotiating.",
  },
  {
    question: "What does the trial project look like?",
    answer:
      "A short, paid, real problem from our actual backlog — typically one to two weeks, on your own schedule.",
  },
  {
    question: "How quickly will I hear back?",
    answer:
      "Our candidate desk replies within one business day, at every stage of the process.",
  },
];

export const CAREERS = {
  hero: {
    title: "The work behind adaptive",
    /** Rendered in brand red, immediately after `title`. */
    titleAccent: "intelligence",
    lede: "Research, engineering, and applied roles building systems that adapt — remote-first, open by design, measured on outcomes, never on hours logged.",
    cta: { label: "Browse open roles", href: "#roles" },
  },
  roles: {
    eyebrow: "Open Roles",
    heading: "Find your next problem to work on",
    aside:
      "Live openings across every discipline. Apply once and the desk matches you to what fits.",
  },
  perks: {
    eyebrow: "Why Build Here",
    heading: "More than a job. A lab you help write",
    aside:
      "The friction most labs tolerate, we removed on purpose — so the work is what's left.",
  },
  faq: {
    eyebrow: "Before You Apply",
    heading: "Questions candidates actually ask",
    aside: "Anything else? The candidate desk replies within one business day.",
  },
  pipeline: {
    eyebrow: "Join The Pipeline",
    heading: "Not seeing the right problem yet",
    bullets: [
      "One profile, matched to every relevant opening as it posts.",
      "First-access alerts before roles go public.",
      "A dedicated contact who already knows your background.",
    ],
    /** Options for the "Discipline" select on the pipeline form. */
    disciplines: [...DISCIPLINES, "Something else"],
  },
} as const;
