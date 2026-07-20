import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { Job } from "@/lib/db/schema";
import { formatSalary, timeAgo } from "@/lib/utils";

export function JobCard({ job }: { job: Job }) {
  return (
    <Link
      href={`/jobs/${job.slug}`}
      className={`focus-ring block rounded-lg border p-5 transition-colors hover:border-signal/60 ${
        job.featured
          ? "border-signal/40 bg-signal/[0.04]"
          : "border-ink-line bg-ink-soft"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {job.featured && <Badge variant="signal">Featured</Badge>}
            <Badge variant={job.workMode === "remote" ? "teal" : "outline"}>
              {job.workMode}
            </Badge>
          </div>
          <h3 className="font-display font-semibold text-paper text-lg leading-snug">
            {job.title}
          </h3>
          <p className="text-sm text-muted mt-0.5">{job.companyName}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="font-mono text-sm text-paper">
            {formatSalary(job.salaryMin, job.salaryMax, job.salaryDisclosed)}
          </p>
          <p className="text-xs text-muted mt-1">
            {job.publishedAt ? timeAgo(new Date(job.publishedAt)) : ""}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {job.stack.slice(0, 5).map((s) => (
          <Badge key={s}>{s}</Badge>
        ))}
        {job.stack.length > 5 && (
          <Badge variant="outline">+{job.stack.length - 5}</Badge>
        )}
      </div>

      <div className="mt-3 flex items-center gap-3 text-xs text-muted font-mono">
        <span>{job.seniority}</span>
        <span className="text-ink-line">·</span>
        <span>{job.roleType}</span>
        <span className="text-ink-line">·</span>
        <span className="text-signal">{job.timezoneOverlap}</span>
      </div>
    </Link>
  );
}