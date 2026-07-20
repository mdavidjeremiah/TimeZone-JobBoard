import { getDb } from "./index";
import { jobs, type NewJob } from "./schema";
import { and, desc, eq, lt, ilike, or, sql } from "drizzle-orm";

export type JobFilters = {
  q?: string;
  role?: string;
  seniority?: string;
  mode?: string;
};

export async function listLiveJobs(filters: JobFilters = {}) {
  const db = getDb();
  const conditions = [eq(jobs.status, "live")];

  if (filters.role) conditions.push(eq(jobs.roleType, filters.role));
  if (filters.seniority) conditions.push(eq(jobs.seniority, filters.seniority));
  if (filters.mode === "remote" || filters.mode === "hybrid") {
    conditions.push(eq(jobs.workMode, filters.mode));
  }
  if (filters.q) {
    const term = `%${filters.q}%`;
    conditions.push(
      or(
        ilike(jobs.title, term),
        ilike(jobs.companyName, term),
        sql`${jobs.stack}::text ilike ${term}`
      )!
    );
  }

  return db
    .select()
    .from(jobs)
    .where(and(...conditions))
    .orderBy(desc(jobs.featured), desc(jobs.publishedAt));
}

export async function getJobBySlug(slug: string) {
  const db = getDb();
  const rows = await db.select().from(jobs).where(eq(jobs.slug, slug)).limit(1);
  return rows[0] ?? null;
}

export async function getJobByEditToken(token: string) {
  const db = getDb();
  const rows = await db.select().from(jobs).where(eq(jobs.editToken, token)).limit(1);
  return rows[0] ?? null;
}

export async function createPendingJob(data: NewJob) {
  const db = getDb();
  const rows = await db.insert(jobs).values(data).returning();
  return rows[0];
}

export async function markJobPaidAndLive(
  checkoutCustomJobId: number,
  opts: { amountPaidCents: number; checkoutId: string; featured: boolean }
) {
  const db = getDb();
  const now = new Date();
  const expires = new Date(now.getTime() + 30 * 86400000);
  const rows = await db
    .update(jobs)
    .set({
      status: "live",
      featured: opts.featured,
      amountPaidCents: opts.amountPaidCents,
      checkoutId: opts.checkoutId,
      publishedAt: now,
      expiresAt: expires,
    })
    .where(eq(jobs.id, checkoutCustomJobId))
    .returning();
  return rows[0];
}

export async function listAllJobsForAdmin() {
  const db = getDb();
  return db.select().from(jobs).orderBy(desc(jobs.createdAt));
}

export async function setJobStatus(id: number, status: "live" | "expired" | "removed") {
  const db = getDb();
  const rows = await db.update(jobs).set({ status }).where(eq(jobs.id, id)).returning();
  return rows[0];
}

export async function setJobFeatured(id: number, featured: boolean) {
  const db = getDb();
  const rows = await db.update(jobs).set({ featured }).where(eq(jobs.id, id)).returning();
  return rows[0];
}

export async function expireStaleJobs() {
  const db = getDb();
  const now = new Date();
  return db
    .update(jobs)
    .set({ status: "expired" })
    .where(and(eq(jobs.status, "live"), lt(jobs.expiresAt, now)))
    .returning();
}