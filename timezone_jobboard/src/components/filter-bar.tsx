"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROLE_TYPES, SENIORITY_LEVELS } from "@/lib/constants";
import { Search } from "lucide-react";

export function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [pathname, router, searchParams]
  );

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
        <Input
          placeholder="Search stack, title, or company…"
          defaultValue={searchParams.get("q") ?? ""}
          onChange={(e) => setParam("q", e.target.value)}
          className="pl-9"
        />
      </div>
      <Select
        defaultValue={searchParams.get("role") ?? "all"}
        onValueChange={(v) => setParam("role", v)}
      >
        <SelectTrigger className="sm:w-48">
          <SelectValue placeholder="Role type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All role types</SelectItem>
          {ROLE_TYPES.map((r) => (
            <SelectItem key={r} value={r}>
              {r}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        defaultValue={searchParams.get("seniority") ?? "all"}
        onValueChange={(v) => setParam("seniority", v)}
      >
        <SelectTrigger className="sm:w-40">
          <SelectValue placeholder="Seniority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Any seniority</SelectItem>
          {SENIORITY_LEVELS.map((s) => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        defaultValue={searchParams.get("mode") ?? "all"}
        onValueChange={(v) => setParam("mode", v)}
      >
        <SelectTrigger className="sm:w-40">
          <SelectValue placeholder="Work mode" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Remote & hybrid</SelectItem>
          <SelectItem value="remote">Remote only</SelectItem>
          <SelectItem value="hybrid">Hybrid only</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}