import Link from "next/link";
import { ArrowRight, Brain, Building2, MapPin, TrendingUp, Star, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import { getFeaturedCabinets } from "@/lib/supabase/queries";
import type { Cabinet, AiMaturityLevel } from "@/types";

const STATS = [
  { value: "2 400+", label: "Cabinets référencés" },
  { value: "96", label: "Départements couverts" },
  { value: "5 critères", label: "Pour le score IA" },
  { value: "100%", label: "Données vérifiées" },
];

const AI_CRITERIA = [
  {
    icon: Brain,
    title: "Automatisation",
    desc: "Usage d'outils d'automatisation comptable et fiscale",
    color: "text-violet-600 bg-violet-50",
  },
  {
    icon: TrendingUp,
    title: "Analytics avancés",
    desc: "Exploitation des données pour le conseil prédictif",
    color: "text-sky-600 bg-sky-50",
  },
  {
    icon: Building2,
    title: "Outils collaboratifs IA",
    desc: "Intégration d'assistants IA dans les workflows internes",
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    icon: Star,
    title: "Formation équipes",
    desc: "Niveau de formation des collaborateurs aux technologies IA",
    color: "text-amber-600 bg-amber-50",
  },
  {
    icon: CheckCircle2,
    title: "Qualité & conformité",
    desc: "Processus de contrôle qualité augmentés par l'IA",
    color: "text-rose-600 bg-rose-50",
  },
];

const maturityColors: Record<AiMaturityLevel, string> = {
  Leader: "from-violet-500 to-violet-700",
  Avancé: "from-sky-500 to-sky-700",
  Intermédiaire: "from-amber-500 to-amber-600",
  Débutant: "from-slate-400 to-slate-600",
};

function SparkleIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1l1.5 7.5L21 10l-7.5 1.5L12 19l-1.5-7.5L3 10l7.5-1.5L12 1z" />
    </svg>
  );
}

export default async function Home() {
  const featuredCabinets = await getFeaturedCabinets(3);
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-brand-100/60 blur-3xl" />
          <div className="absolute top-20 right-1/4 h-64 w-64 rounded-full bg-violet-100/40 blur-3xl" />
          <div className="absolute -bottom-20 left-1/2 h-80 w-80 rounded-full bg-sky-100/30 blur-3xl" />
        </div>

        <div className="mx-auto max-w-4xl px-4 pb-24 pt-20 text-center sm:px-6 sm:pt-28">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700 mb-8">
            <SparkleIcon className="h-3.5 w-3.5" />
            Le premier annuaire IA des cabinets comptables en France
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl text-balance">
            Trouvez un cabinet comptable{" "}
            <span className="bg-gradient-to-r from-brand-600 to-violet-600 bg-clip-text text-transparent">
              prêt pour l&apos;IA
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 text-balance">
            Nira évalue la maturité digitale et l&apos;adoption de l&apos;intelligence artificielle de plus de 2 400
            cabinets d&apos;expertise comptable en France.
          </p>

          <div className="mx-auto mt-10 max-w-2xl">
            <SearchBar large />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-slate-500">
            <span>Populaires :</span>
            {["Paris", "Lyon", "Audit", "Paie & RH", "PME"].map((tag) => (
              <Link
                key={tag}
                href={`/firms?q=${encodeURIComponent(tag)}`}
                className="rounded-lg border border-slate-200 px-3 py-1 hover:border-brand-300 hover:text-brand-700 hover:bg-brand-50 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-slate-100 bg-slate-50/60">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
          <dl className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <dt className="text-2xl font-bold text-slate-900">{s.value}</dt>
                <dd className="mt-1 text-sm text-slate-500">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Featured firms */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Cabinets mis en avant</h2>
            <p className="mt-1 text-slate-500">Les mieux notés cette semaine</p>
          </div>
          <Link
            href="/firms"
            className="hidden items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700 sm:flex"
          >
            Voir tout <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredCabinets.map((cabinet: Cabinet) => (
            <Link key={cabinet.id} href={`/firms/${cabinet.slug}`} className="group block">
              <div className="h-full rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-200 hover:border-brand-200 hover:shadow-md hover:-translate-y-0.5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-brand-700 transition-colors">
                      {cabinet.name}
                    </h3>
                    <div className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                      <MapPin className="h-3.5 w-3.5" />
                      {cabinet.city}{cabinet.region ? `, ${cabinet.region}` : ""}
                    </div>
                  </div>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 font-bold text-sm">
                    {cabinet.name.slice(0, 2).toUpperCase()}
                  </div>
                </div>

                <p className="mt-3 line-clamp-2 text-sm text-slate-600">{cabinet.description}</p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {cabinet.specialties?.slice(0, 3).map((spec) => (
                    <span
                      key={spec}
                      className="inline-flex items-center rounded-md bg-slate-50 px-2 py-0.5 text-xs text-slate-600 ring-1 ring-inset ring-slate-200"
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${maturityColors[cabinet.ai_maturity]} text-xs font-bold text-white shadow-sm`}
                    >
                      {cabinet.ai_score}
                    </div>
                    <span className="text-sm font-medium text-slate-700">{cabinet.ai_maturity}</span>
                  </div>
                  <span className="text-xs text-slate-400">{cabinet.size}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/firms"
            className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            Voir tous les cabinets <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Methodology section */}
      <section className="bg-slate-50/80 border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-900">Comment le score IA est calculé</h2>
            <p className="mt-3 text-slate-500">
              Cinq dimensions évaluées par nos analystes sur la base d&apos;entretiens, d&apos;enquêtes et de sources
              publiques.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {AI_CRITERIA.map((c, i) => {
              const Icon = c.icon;
              return (
                <div key={c.title} className="relative rounded-2xl bg-white border border-slate-100 p-5 shadow-sm">
                  <div className="absolute -top-3 -left-3 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white shadow">
                    {i + 1}
                  </div>
                  <div
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${c.color} mb-3`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900">{c.title}</h3>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">{c.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 px-8 py-14 text-center shadow-2xl">
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-violet-400/20 blur-2xl" />
          <div className="relative">
            <h2 className="text-3xl font-bold text-white">
              Votre cabinet n&apos;est pas encore référencé ?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-brand-100">
              Rejoignez Nira gratuitement et obtenez votre score de maturité IA en moins de 10 minutes.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/onboard"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-brand-700 shadow-lg hover:bg-brand-50 transition-colors"
              >
                Référencer mon cabinet <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/firms"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors"
              >
                Explorer l&apos;annuaire
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700">
                <SparkleIcon className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="font-bold text-slate-900">Nira</span>
              <span className="text-slate-400 text-sm">— Annuaire IA des cabinets comptables</span>
            </div>
            <p className="text-sm text-slate-400">© 2025 Nira. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
