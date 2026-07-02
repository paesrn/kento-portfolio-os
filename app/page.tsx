const dashboardCards = [
  {
    title: "Portfolio Value",
    value: "$10,000",
    status: "NORMAL",
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
];

const missions = [
  "Check BTC market structure",
  "Update trading journal",
  "Review watchlist",
  "Check open risk",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-8">
        <header className="border-b border-zinc-800 pb-6">
          <p className="text-sm uppercase tracking-[0.3em] text-green-400">
            Investment Control Room
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight">
            Kento Portfolio OS
          </h1>
          <p className="mt-2 max-w-2xl text-zinc-400">
            Data-driven portfolio operating system for risk management,
            Bitcoin allocation, trading decisions, and performance review.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-4">
          {dashboardCards.map((card) => (
            <div
              key={card.title}
              className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 shadow-lg"
            >
              <p className="text-sm text-zinc-400">{card.title}</p>
              <div className="mt-4 flex items-end justify-between">
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

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 lg:col-span-2">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <h2 className="text-xl font-semibold">Bitcoin Dashboard</h2>
                <p className="text-sm text-zinc-400">
                  Current decision status based on trend, macro, sentiment, and
                  risk.
                </p>
              </div>
              <div className="rounded-lg border border-yellow-500/40 bg-yellow-500/10 px-4 py-2 text-yellow-400">
                WAIT
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-4">
              <Metric label="Trend" value="28/40" />
              <Metric label="On-chain" value="15/25" />
              <Metric label="Macro" value="12/20" />
              <Metric label="Sentiment" value="12/15" />
            </div>

            <div className="mt-6 rounded-lg border border-zinc-800 bg-black p-4">
              <p className="text-sm text-zinc-400">System Reasoning</p>
              <p className="mt-2 text-zinc-200">
                Bitcoin score is neutral-positive. Trend is improving, risk is
                controlled, but confirmation is not strong enough for aggressive
                buying. Current action: wait and monitor.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-xl font-semibold">Today&apos;s Mission</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Daily operating checklist
            </p>

            <div className="mt-5 space-y-3">
              {missions.map((mission) => (
                <label
                  key={mission}
                  className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-black px-4 py-3 text-sm text-zinc-300"
                >
                  <input type="checkbox" className="h-4 w-4 accent-green-500" />
                  {mission}
                </label>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="text-xl font-semibold">System Status</h2>

          <div className="mt-5 grid gap-3 md:grid-cols-6">
            <Status label="Portfolio" value="NORMAL" color="text-green-400" />
            <Status label="Risk" value="LOW" color="text-green-400" />
            <Status label="Bitcoin" value="WATCH" color="text-yellow-400" />
            <Status label="Liquidity" value="NORMAL" color="text-green-400" />
            <Status label="Cash" value="HIGH" color="text-blue-400" />
            <Status label="Alarm" value="NONE" color="text-green-400" />
          </div>
        </section>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-black p-4">
      <p className="text-sm text-zinc-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

function Status({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-black p-4">
      <p className="text-xs uppercase tracking-wider text-zinc-500">{label}</p>
      <p className={`mt-2 font-bold ${color}`}>{value}</p>
    </div>
  );
}