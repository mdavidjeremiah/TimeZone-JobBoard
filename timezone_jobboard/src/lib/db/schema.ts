import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
  pgEnum,
  serial,
} from "drizzle-orm/pg-core";

export const jobStatusEnum = pgEnum("job_status", [
  "pending_payment", // created, waiting for checkout to complete
  "live",
  "expired",
  "removed",
]);

export const workModeEnum = pgEnum("work_mode", ["remote", "hybrid"]);

export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),

  // Company
  companyName: text("company_name").notNull(),
  companyWebsite: text("company_website").notNull(),
  companyLogoUrl: text("company_logo_url"),
  companyEmail: text("company_email").notNull(), // used for edit link + receipt, never shown publicly

  // Role
  title: text("title").notNull(),
  description: text("description").notNull(), // markdown
  roleType: text("role_type").notNull(), // e.g. "Backend", "Frontend", "Mobile", "DevOps", "Data/ML", "Full-Stack", "QA", "Design"
  stack: text("stack").array().notNull(), // e.g. ["React", "Node.js", "Postgres"]
  seniority: text("seniority").notNull(), // "Junior" | "Mid" | "Senior" | "Lead"
  workMode: workModeEnum("work_mode").notNull().default("remote"),
  timezoneOverlap: text("timezone_overlap").notNull(), // e.g. "GMT-5 to GMT+3" (employer's required overlap window)
  location: text("location"), // optional hybrid location

  salaryMin: integer("salary_min"), // USD/year, nullable if undisclosed
  salaryMax: integer("salary_max"),
  salaryDisclosed: boolean("salary_disclosed").notNull().default(false),

  applyUrl: text("apply_url").notNull(),

  // Monetization / lifecycle
  status: jobStatusEnum("status").notNull().default("pending_payment"),
  featured: boolean("featured").notNull().default(false),
  editToken: text("edit_token").notNull(), // lets employer manage listing without an account
  checkoutId: text("checkout_id"), // Lemon Squeezy order/checkout id
  amountPaidCents: integer("amount_paid_cents"),

  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
});

export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;