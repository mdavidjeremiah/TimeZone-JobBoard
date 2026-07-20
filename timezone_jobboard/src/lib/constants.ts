export const ROLE_TYPES = [
  "Full-Stack",
  "Frontend",
  "Backend",
  "Mobile",
  "DevOps / Infra",
  "Data / ML",
  "QA / Test",
  "Product / Design",
] as const;

export const SENIORITY_LEVELS = ["Junior", "Mid", "Senior", "Lead"] as const;

export const COMMON_STACK_TAGS = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Vue",
  "Node.js",
  "Python",
  "Django",
  "Flask",
  "Go",
  "Java",
  "Spring",
  "PHP",
  "Laravel",
  "Ruby",
  "Rails",
  "Flutter",
  "React Native",
  "Swift",
  "Kotlin",
  "PostgreSQL",
  "MongoDB",
  "AWS",
  "GCP",
  "Docker",
  "Kubernetes",
  "Rust",
  "C#",
  ".NET",
] as const;

export const WORK_MODES = ["remote", "hybrid"] as const;

// Pricing in USD cents (Lemon Squeezy variant prices should mirror these)
export const PRICING = {
  standard: {
    label: "Standard listing",
    priceCents: 4900,
    durationDays: 30,
    description: "Live for 30 days, listed in search & filters.",
  },
  featured: {
    label: "Featured add-on",
    priceCents: 5000, // on top of standard -> $99 total
    description: "Pinned to the top of the board and the homepage spotlight.",
  },
} as const;

export const TOTAL_FEATURED_CENTS =
  PRICING.standard.priceCents + PRICING.featured.priceCents;