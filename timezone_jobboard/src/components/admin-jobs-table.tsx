"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Job } from "@/lib/db/schema";

export function AdminJobsTable({ jobs }: { jobs: Job[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<number | null>(null);

  async function patch(id: number, body: Record<string, unknown>) {
    setBusyId(id);
    await fetch(`/api/admin/jobs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setBusyId(null);
    router.refresh();
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-ink-line">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-ink-line bg-ink-soft text-left text-muted font-mono text-xs uppercase">
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Company</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Featured</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id} className="border-b border-ink-line/60 last:border-0">
              <td className="px-4 py-3 text-paper">{job.title}</td>
              <td className="px-4 py-3 text-muted">{job.companyName}</td>
              <td className="px-4 py-3">
                <Badge
                  variant={
                    job.status === "live"
                      ? "teal"
                      : job.status === "pending_payment"
                      ? "signal"
                      : "outline"
                  }
                >
                  {job.status}
                </Badge>
              </td>
              <td className="px-4 py-3">{job.featured ? "Yes" : "—"}</td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  {job.status !== "live" && (
                    <Button
                      size="sm"
                      variant="teal"
                      disabled={busyId === job.id}
                      onClick={() => patch(job.id, { status: "live" })}
                    >
                      Approve / go live
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={busyId === job.id}
                    onClick={() => patch(job.id, { featured: !job.featured })}
                  >
                    {job.featured ? "Unfeature" : "Feature"}
                  </Button>
                  {job.status !== "removed" && (
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={busyId === job.id}
                      onClick={() => patch(job.id, { status: "removed" })}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}