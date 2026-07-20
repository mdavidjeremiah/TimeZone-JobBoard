import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-ink-line/70 mt-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="text-sm text-muted font-mono">
          Timezone — built by{" "}
          <a
            href="https://github.com/mdavidjeremiah"
            className="text-paper hover:text-signal"
            target="_blank"
            rel="noreferrer"
          >
            LitmusTech Solutions
          </a>
        </div>
        <div className="flex gap-6 text-sm text-muted">
          <Link href="/post-job" className="hover:text-paper">
            Post a job
          </Link>
          <Link href="/admin" className="hover:text-paper">
            Employer / Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}