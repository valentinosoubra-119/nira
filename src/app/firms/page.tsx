import { Search } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import { getCabinets } from "@/lib/supabase/queries";
import type { Cabinet, AiMaturityLevel } from "@/types";

const maturityColors: Record<AiMaturityLevel, string> = {
  Leader: "from-violet-500 to-violet-700",
  Avancé: "from-sky-500 to-sky-700",
  Intermédiaire: "from-amber-500 to-amber-600",
  Débutant: "from-slate-400 to-slate-600",
};

const MATURITY_OPTIONS: (AiMaturityLevel | "Tous")[] = ["Tous", "Leader", "Avancé", "Intermédiaire", "Débutant"];

export default async function FirmsPage({
  searchParams,
}: {
  searchParams: { q?: string; maturity?: string; region?: string };
}) {
  const query = searchParams.q ?? "";
  const maturity = (searchParams.maturity ?? "Tous") as AiMaturityLevel | "Tous";

  // Résultats filtrés (affichés dans la grille)
  const cabinets = await getCabinets({
    query: query || undefined,
    ai_maturity: maturity !== "Tous" ? maturity : undefined,
    region: searchParams.region || undefined,
  });

  // Tous les cabinets correspondant uniquement à la recherche textuelle,
  // sans filtre de maturité — pour calculer les compteurs de la sidebar.
  const allForCounts = await getCabinets({
    query: query || undefined,
    region: searchParams.region || undefined,
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="border-b border-slate-100 bg-slate-50/60 px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-4 text-2xl font-bold text-slate-900">
            Annuaire des cabinets comptables
          </h1>
          <SearchBar initialQuery={query} />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row">

          {/* Sidebar */}
          <aside className="w-full sm:w-56 shrink-0">
            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Maturité IA
              </h2>
              <div className="space-y-1">
                {MATURITY_OPTIONS.map((m) => (
                  <Link
                    key={m}
                    href={`/firms?${query ? `q=${encodeURIComponent(query)}&` : ""}maturity=${m}`}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                      maturity === m
                        ? "bg-brand-50 text-brand-700 font-medium"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {m}
                    {m !== "Tous" && (
                      <span className="text-xs text-slate-400">
                        {allForCounts.filter((c) => c.ai_maturity === m).length}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          {/* Results */}
          <main className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                <span className="font-medium text-slate-900">{cabinets.length}</span>{" "}
                cabinet{cabinets.length !== 1 ? "s" : ""} trouvé{cabinets.length !== 1 ? "s" : ""}
              </p>
            </div>

            {cabinets.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 py-20 text-center">
                <Search className="h-10 w-10 text-slate-300 mb-3" />
                <p className="font-medium text-slate-600">Aucun résultat</p>
                <p className="mt-1 text-sm text-slate-400">
                  {query ? "Essayez une autre recherche" : "Aucun cabinet dans la base de données encore"}
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {cabinets.map((cabinet: Cabinet) => (
                  <Link key={cabinet.id} href={`/firms/${cabinet.slug}`} className="group block">
                    <div className="h-full rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-200 hover:border-brand-200 hover:shadow-md hover:-translate-y-0.5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-sm font-semibold text-slate-900 group-hover:text-brand-700 transition-colors">
                            {cabinet.name}
                          </h3>
                          <p className="mt-0.5 text-xs text-slate-500">
                            {cabinet.city}{cabinet.region ? ` · ${cabinet.region}` : ""}
                          </p>
                        </div>
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 font-bold text-xs">
                          {cabinet.name.slice(0, 2).toUpperCase()}
                        </div>
                      </div>

                      {cabinet.description && (
                        <p className="mt-2.5 line-clamp-2 text-xs text-slate-600 leading-relaxed">
                          {cabinet.description}
                        </p>
                      )}

                      {cabinet.specialties?.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {cabinet.specialties.slice(0, 2).map((s) => (
                            <span key={s} className="rounded-md bg-slate-50 px-1.5 py-0.5 text-xs text-slate-500 ring-1 ring-inset ring-slate-200">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="mt-3 flex items-center gap-2 border-t border-slate-50 pt-3">
                        <div className={`flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br ${maturityColors[cabinet.ai_maturity]} text-xs font-bold text-white`}>
                          {cabinet.ai_score}
                        </div>
                        <span className="text-xs font-medium text-slate-700">{cabinet.ai_maturity}</span>
                        <span className="ml-auto text-xs text-slate-400">{cabinet.size}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
