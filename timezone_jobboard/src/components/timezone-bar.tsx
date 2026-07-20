const ROWS = [
  { label: "SF / PST", utcOffset: -8 },
  { label: "NYC / EST", utcOffset: -5 },
  { label: "London / GMT", utcOffset: 0 },
  { label: "Lagos / WAT", utcOffset: 1, highlight: true },
  { label: "Nairobi / EAT", utcOffset: 3, highlight: true },
];

// A cell is "working" if local time (9am-6pm) falls in that UTC hour.
function isWorkingHour(utcHour: number, offset: number) {
  const local = ((utcHour + offset) % 24 + 24) % 24;
  return local >= 9 && local < 18;
}

export function TimezoneBar() {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[640px]">
        <div className="grid grid-cols-[110px_repeat(24,1fr)] gap-[2px] mb-[2px]">
          <div />
          {hours.map((h) => (
            <div
              key={h}
              className="text-center text-[9px] font-mono text-muted"
            >
              {h % 3 === 0 ? h : ""}
            </div>
          ))}
        </div>
        {ROWS.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-[110px_repeat(24,1fr)] gap-[2px] mb-[2px]"
          >
            <div
              className={`text-[11px] font-mono pr-2 flex items-center justify-end ${
                row.highlight ? "text-signal" : "text-muted"
              }`}
            >
              {row.label}
            </div>
            {hours.map((h) => {
              const working = isWorkingHour(h, row.utcOffset);
              return (
                <div
                  key={h}
                  className={`h-4 rounded-[2px] ${
                    working
                      ? row.highlight
                        ? "bg-signal"
                        : "bg-teal/70"
                      : "bg-ink-line/40"
                  }`}
                />
              );
            })}
          </div>
        ))}
        <p className="mt-3 text-xs text-muted font-mono">
          <span className="text-signal">■</span> African work hours{" "}
          <span className="text-teal">■</span> US / EU work hours — the overlap
          is bigger than most job boards let on.
        </p>
      </div>
    </div>
  );
}