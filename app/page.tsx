import Link from "next/link";
``

const navItems = [
  { label: "Home", href: "/" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Spot Calculator", href: "/spot-calculator" },
  { label: "Futures Calculator", href: "/futures-calculator" },
  { label: "Trading Journal", href: "/trading-journal" },
  { label: "Performance", href: "/performance" },
  { label: "Risk", href: "/risk" },
  { label: "Bitcoin", href: "/bitcoin" },
  { label: "Watchlist", href: "/watchlist" },
  { label: "Settings", href: "/settings" },
];

const dashboardCards = [
  {
    title: "Portfolio Value",
    value: "$10,000",
    status: "NORMAL",
    color: "text-green-400",
  },
  {
    title: "Today P/L",
    value: "+$120",
    status: "+1.2%",
    color: "text-green-400",
  },
  {
    title: "Bitcoin Score",
    value: "67",
    status: "WAIT",
    color: "text-yellow-400",
  },
  {
    title: "Open Risk",
    value: "0.5%",
    status: "SAFE",
    color: "text-green-400",
  },
  {
    title: "Cash",
    value: "$2,500",
    status: "HIGH",
    color: "text-blue-400",
  },
  {
    title: "Open Positions",
    value: "2",
    status: "CONTROLLED",
    color: "text-white",
  },
];

const missions = [
  "Check BTC market structure",
  "Update trading journal",
  "Review watchlist",
  "Check open risk",
  "Confirm no rule violation",
];

const riskRules = [
  {
    rule: "Total open risk must be below 2%",
    current: "0.5%",
    status: "PASS",
  },
  {
    rule: "Maximum 3 open positions",
    current: "2 / 3",
    status: "PASS",
  },
  {
    rule: "Stop trading after 3 consecutive losses",
    current: "0 losses",
    status: "PASS",
  },
  {
    rule: "BTC allocation minimum 50%",
    current: "55%",
    status: "PASS",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 border-r border-zinc-800 bg-zinc-950 lg:block">
          <div className="border-b border-zinc-800 p-6">
            <p className="text-xs uppercase tracking-[0.35em] text-green-400">
              Kento
            </p>
            <h1 className="mt-3 text-2xl font-bold">Portfolio OS</h1>
            <p className="mt-2 text-sm text-zinc-500">
              Investment Control Room
            </p>
          </div>

          <nav className="space-y-1 p-4">
  {navItems.map((item) => (
    <Link
      key={item.href}
      href={item.href}
      className={`block w-full rounded-lg px-4 py-3 text-left text-sm transition ${
        item.href === "/"
          ? "border border-green-500/40 bg-green-500/10 text-green-400"
          : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
      }`}
    >
      {item.label}
    </Link>
  ))}
</nav>

          <div className="m-4 rounded-xl border border-zinc-800 bg-black p-4">
            <p className="text-xs uppercase tracking-wider text-zinc-500">
              System Mode
            </p>
            <p className="mt-2 text-lg font-bold text-green-400">NORMAL</p>
            <p className="mt-1 text-xs text-zinc-500">
              No active portfolio alarm
            </p>
          </div>
        </aside>

        <section className="flex flex-1 flex-col">
          <header className="border-b border-zinc-800 bg-zinc-950 px-6 py-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-green-400">
                  Live Command Dashboard
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight">
                  Home Control Room
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
                <HeaderStatus label="Portfolio" value="NORMAL" color="green" />
                <HeaderStatus label="Risk" value="LOW" color="green" />
                <HeaderStatus label="Bitcoin" value="WATCH" color="yellow" />
                <HeaderStatus label="Alarm" value="NONE" color="green" />
              </div>
            </div>
          </header>

          <div className="flex-1 space-y-6 p-6">
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
              {dashboardCards.map((card) => (
                <div
                  key={card.title}
                  className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 shadow-lg"
                >
                  <p className="text-sm text-zinc-400">{card.title}</p>
                  <div className="mt-4 flex items-end justify-between gap-3">
                    <p className={`text-3xl font-bold ${card.color}`}>
                      {card.value}
                    </p>
                    <span className="rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-300">
                      {card.status}
                    </span>
                  </div>
                </div>
              ))}
            </section>

            <section className="grid gap-6 xl:grid-cols-3">
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 xl:col-span-2">
                <div className="flex flex-col gap-4 border-b border-zinc-800 pb-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">
                      Bitcoin Decision Engine
                    </h3>
                    <p className="mt-1 text-sm text-zinc-400">
                      Current status based on trend, on-chain, macro, and
                      sentiment.
                    </p>
                  </div>

                  <div className="rounded-lg border border-yellow-500/40 bg-yellow-500/10 px-5 py-3 text-center">
                    <p className="text-xs uppercase tracking-wider text-yellow-300">
                      Recommendation
                    </p>
                    <p className="text-2xl font-bold text-yellow-400">WAIT</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-4">
                  <Metric label="Trend" value="28/40" status="Improving" />
                  <Metric label="On-chain" value="15/25" status="Neutral" />
                  <Metric label="Macro" value="12/20" status="Mixed" />
                  <Metric label="Sentiment" value="12/15" status="Healthy" />
                </div>

                <div className="mt-6 rounded-lg border border-zinc-800 bg-black p-5">
                  <p className="text-sm uppercase tracking-wider text-zinc-500">
                    System Reasoning
                  </p>
                  <p className="mt-3 leading-7 text-zinc-300">
                    Bitcoin score is neutral-positive. Trend is improving and
                    open risk remains controlled. However, the current signal is
                    not strong enough for aggressive buying. Recommended action:
                    wait, monitor confirmation, and avoid emotional entry.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
                <h3 className="text-xl font-semibold">Today&apos;s Mission</h3>
                <p className="mt-1 text-sm text-zinc-400">
                  Daily operating checklist
                </p>

                <div className="mt-5 space-y-3">
                  {missions.map((mission) => (
                    <label
                      key={mission}
                      className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-black px-4 py-3 text-sm text-zinc-300"
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-green-500"
                      />
                      {mission}
                    </label>
                  ))}
                </div>
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-2">
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
                <h3 className="text-xl font-semibold">Risk Rule Engine</h3>
                <p className="mt-1 text-sm text-zinc-400">
                  Rules checked before opening a new position.
                </p>

                <div className="mt-5 space-y-3">
                  {riskRules.map((item) => (
                    <div
                      key={item.rule}
                      className="grid gap-3 rounded-lg border border-zinc-800 bg-black p-4 md:grid-cols-[1fr_120px_80px]"
                    >
                      <p className="text-sm text-zinc-300">{item.rule}</p>
                      <p className="text-sm text-zinc-400">{item.current}</p>
                      <p className="text-sm font-bold text-green-400">
                        {item.status}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
                <h3 className="text-xl font-semibold">
                  Portfolio Operating Manual
                </h3>
                <p className="mt-1 text-sm text-zinc-400">
                  Personal decision rules for reducing emotional trading.
                </p>

                <div className="mt-5 rounded-lg border border-zinc-800 bg-black p-5">
                  <p className="text-sm uppercase tracking-wider text-zinc-500">
                    Current Manual
                  </p>

                  <ul className="mt-4 space-y-3 text-sm leading-6 text-zinc-300">
                    <li>Every trade must define entry, stop, target, and risk.</li>
                    <li>No new trade if total open risk exceeds 2%.</li>
                    <li>Position size must be calculated before entry.</li>
                    <li>After 3 consecutive losses, stop trading for 48 hours.</li>
                    <li>Bitcoin allocation should remain the core portfolio anchor.</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

function HeaderStatus({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: "green" | "yellow" | "red" | "blue";
}) {
  const colorClass = {
    green: "text-green-400",
    yellow: "text-yellow-400",
    red: "text-red-400",
    blue: "text-blue-400",
  }[color];

  return (
    <div className="rounded-lg border border-zinc-800 bg-black px-4 py-3">
      <p className="text-xs uppercase tracking-wider text-zinc-500">{label}</p>
      <p className={`mt-1 font-bold ${colorClass}`}>{value}</p>
    </div>
  );
}

function Metric({
  label,
  value,
  status,
}: {
  label: string;
  value: string;
  status: string;
}) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-black p-4">
      <p className="text-sm text-zinc-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
      <p className="mt-1 text-xs text-zinc-500">{status}</p>
    </div>
  );
}