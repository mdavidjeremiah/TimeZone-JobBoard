import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="border-b border-ink-line/70 sticky top-0 z-40 bg-ink/95 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="h-2 w-2 rounded-full bg-signal group-hover:animate-pulse" />
          <span className="font-display font-semibold text-lg tracking-tight text-paper">
            Timezone
          </span>
          <span className="hidden sm:inline text-xs font-mono text-muted border-l border-ink-line pl-2 ml-1">
            remote jobs · Africa
          </span>
        </Link>
        <nav className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/">Browse jobs</Link>
          </Button>
          <Button asChild variant="primary" size="sm">
            <Link href="/post-job">Post a job</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}