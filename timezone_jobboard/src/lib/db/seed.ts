import "dotenv/config";
import { getDb } from "./index";
import { jobs } from "./schema";
import { nanoid } from "nanoid";

const sample = [
  {
    slug: "backend-engineer-flywheel-pay",
    companyName: "Flywheel Pay",
    companyWebsite: "https://example.com",
    companyEmail: "hiring@example.com",
    title: "Backend Engineer (Payments)",
    description:
      "Own our ledger and settlement services. You'll work closely with our Lagos and Berlin teams to ship reliable, auditable payment infrastructure.",
    roleType: "Backend",
    stack: ["Node.js", "TypeScript", "PostgreSQL", "AWS"],
    seniority: "Mid",
    workMode: "remote" as const,
    timezoneOverlap: "GMT+0 to GMT+3",
    salaryMin: 42000,
    salaryMax: 60000,
    salaryDisclosed: true,
    applyUrl: "https://example.com/careers/backend-engineer",
    status: "live" as const,
    featured: true,
  },
  {
    slug: "react-native-engineer-savanna-health",
    companyName: "Savanna Health",
    companyWebsite: "https://example.com",
    companyEmail: "hiring@example.com",
    title: "React Native Engineer",
    description:
      "Build the patient-facing app used across five African markets. Strong offline-first experience required.",
    roleType: "Mobile",
    stack: ["React Native", "TypeScript", "Flutter"],
    seniority: "Senior",
    workMode: "remote" as const,
    timezoneOverlap: "GMT+1 to GMT+3",
    salaryMin: 50000,
    salaryMax: 70000,
    salaryDisclosed: true,
    applyUrl: "https://example.com/careers/react-native",
    status: "live" as const,
    featured: false,
  },
  {
    slug: "platform-devops-nairobi-cloud",
    companyName: "Nairobi Cloud Co.",
    companyWebsite: "https://example.com",
    companyEmail: "hiring@example.com",
    title: "Platform / DevOps Engineer",
    description:
      "Run our Kubernetes fleet across three regions. On-call rotation shared with a distributed team across EAT and CET.",
    roleType: "DevOps / Infra",
    stack: ["Kubernetes", "Docker", "AWS", "Go"],
    seniority: "Senior",
    workMode: "hybrid" as const,
    location: "Nairobi, Kenya",
    timezoneOverlap: "GMT+2 to GMT+3",
    salaryDisclosed: false,
    applyUrl: "https://example.com/careers/devops",
    status: "live" as const,
    featured: false,
  },
];

async function main() {
  const db = getDb();
  for (const j of sample) {
    await db
      .insert(jobs)
      .values({
        ...j,
        editToken: nanoid(24),
        publishedAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 86400000),
      })
      .onConflictDoNothing();
  }
  console.log(`Seeded ${sample.length} jobs.`);
}

main().then(() => process.exit(0));