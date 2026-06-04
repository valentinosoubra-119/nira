import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 shadow-sm">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Nira
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 sm:flex">
          <Link href="/firms" className="hover:text-brand-600 transition-colors">
            Annuaire
          </Link>
          <Link href="/audit-ia" className="hover:text-brand-600 transition-colors">
            Audit IA
          </Link>
          <Link href="/about" className="hover:text-brand-600 transition-colors">
            Méthodologie
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/revendiquer"
            className="hidden rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:border-brand-300 hover:text-brand-700 transition-colors sm:block"
          >
            Mon cabinet
          </Link>
          <Link
            href="/audit-ia"
            className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-700 transition-colors"
          >
            Audit gratuit
          </Link>
        </div>
      </div>
    </header>
  );
}
