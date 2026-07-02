"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

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

export default function AppShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  const pathname = usePathname();

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
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block w-full rounded-lg px-4 py-3 text-left text-sm transition ${
                    isActive
                      ? "border border-green-500/40 bg-green-500/10 text-green-400"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
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
                  {title}
                </h2>
                <p className="mt-2 text-sm text-zinc-400">{subtitle}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
                <HeaderStatus label="Portfolio" value="NORMAL" color="green" />
                <HeaderStatus label="Risk" value="LOW" color="green" />
                <HeaderStatus label="Bitcoin" value="WATCH" color="yellow" />
                <HeaderStatus label="Alarm" value="NONE" color="green" />
              </div>
            </div>
          </header>

          <div className="flex-1 space-y-6 p-6">{children}</div>
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
