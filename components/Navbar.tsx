import Link from "next/link";
import { BarChart3 } from "lucide-react";

export function Navbar() {
  return (
    <header className="border-b border-white/10 bg-ink/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3 font-semibold tracking-wide text-white">
          <BarChart3 className="h-5 w-5" />
          <span>Botswana Macro Lab</span>
        </Link>

        <nav className="flex items-center gap-6 text-sm text-slate-300">
          <Link href="/">Home</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/comparison">Comparison</Link>
          <Link href="/analysis">Analysis</Link>
          <Link href="/data">Data</Link>
          <Link href="/methodology">Methodology</Link>
        </nav>
      </div>
    </header>
  );
}