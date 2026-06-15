import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Phone,
  Globe,
  Users,
  Calendar,
  Brain,
  CheckCircle2,
  AlertTriangle,
  Zap,
  ExternalLink,
  BadgeCheck,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { getCabinetBySlug } from "@/lib/supabase/queries";
import CallButton from "@/components/ui/CallButton";
import type { AiMaturityLevel, Cabinet } from "@/types";

// --- helpers ---
const maturityConfig: Record<AiMaturityLevel, { gradient: string; badge: string; label: string; description: string }> = {
  Leader: {
    gradient: "from-violet-500 to-violet-700",
    badge: "bg-violet-50 text-violet-700 ring-violet-200",
    label: "Leader IA",
    description: "Ce cabinet est en avance sur 90% du marché",
  },
  Avancé: {
    gradient: "from-sky-500 to-sky-700",
    badge: "bg-sky-50 text-sky-700 ring-sky-200",
    label: "Avancé",
    description: "Ce cabinet a adopté des outils IA significatifs",
  },
  Intermédiaire: {
    gradient: "from-amber-500 to-amber-600",
    badge: "bg-amber-50 text-amber-700 ring-amber-200",
    label: "Intermédiaire",
    description: "Ce cabinet utilise quelques outils digitaux",
  },
  Débutant: {
    gradient: "from-slate-400 to-slate-600",
    badge: "bg-slate-100 text-slate-600 ring-slate-200",
    label: "Débutant",
    description: "Ce cabinet est en début de transformation digitale",
  },
};

const scoreColor = (s: number) =>
  s >= 80 ? "text-violet-600" : s >= 60 ? "text-sky-600" : s >= 40 ? "text-amber-600" : "text-slate-500";
const scoreBg = (s: number) =>
  s >= 80 ? "bg-violet-500" : s >= 60 ? "bg-sky-500" : s >= 40 ? "bg-amber-500" : "bg-slate-400";

const LEGACY_SOFTWARE = ["ACD", "Excel", "Cegid", "Sage", "EBP"];
const MODERN_SOFTWARE = ["Pennylane", "Karima", "ChatGPT Enterprise", "Silae", "Dext", "Indy", "MyUnisoft"];

function ScoreGauge({ score, maturity }: { score: number; maturity: AiMaturityLevel }) {
  const circumference = 2 * Math.PI * 54;
  const progress = (score / 100) * circumference;
  const config = maturityConfig[maturity];
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-36 w-36">
        <svg className="-rotate-90 h-36 w-36">
          <circle cx="72" cy="72" r="54" fill="none" stroke="#e2e8f0" strokeWidth="10" />
          <circle
            cx="72" cy="72" r="54" fill="none" stroke="currentColor" strokeWidth="10"
            strokeDasharray={`${progress} ${circumference}`} strokeLinecap="round"
            className={scoreColor(score)}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-bold ${scoreColor(score)}`}>{score}</span>
          <span className="text-xs text-slate-400 mt-0.5">/100</span>
        </div>
      </div>
      <span className={`mt-3 inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ring-1 ring-inset ${config.badge}`}>
        {config.label}
      </span>
      <p className="mt-2 text-center text-xs text-slate-500 max-w-[160px]">{config.description}</p>
    </div>
  );
}

const SCORE_DIMS = [
  { key: "score_automation" as keyof Cabinet, label: "Automatisation", description: "OCR, lettrage, saisie auto" },
  { key: "score_analytics" as keyof Cabinet, label: "Analytics", description: "Tableaux de bord, prédictif" },
  { key: "score_tools" as keyof Cabinet, label: "Outils IA", description: "Assistants et agents IA" },
  { key: "score_training" as keyof Cabinet, label: "Formation", description: "Collaborateurs formés à l'IA" },
  { key: "score_compliance" as keyof Cabinet, label: "Conformité", description: "Qualité & contrôle augmentés" },
];

// --- page ---
export default async function FirmPage({ params }: { params: { slug: string } }) {
  const cabinet = await getCabinetBySlug(params.slug);
  if (!cabinet) notFound();

  const config = maturityConfig[cabinet.ai_maturity];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Breadcrumb */}
      <div className="border-b border-slate-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
          <nav className="flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="hover:text-brand-600">Accueil</Link>
            <span>/</span>
            <Link href="/firms" className="hover:text-brand-600">Annuaire</Link>
            <span>/</span>
            <span className="text-slate-900 font-medium">{cabinet.name}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-3">

          {/* Main column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Header */}
            <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white font-bold text-xl shadow-sm">
                  {cabinet.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-bold text-slate-900">{cabinet.name}</h1>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${config.badge}`}>
                      {config.label}
                    </span>
                    {cabinet.claimed && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
                        <BadgeCheck className="h-3 w-3" /> Fiche certifiée
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {cabinet.city}{cabinet.region ? `, ${cabinet.region}` : ""}
                    </span>
                    {cabinet.employee_count && (
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {cabinet.employee_count} collaborateurs
                      </span>
                    )}
                    {cabinet.founded && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        Depuis {cabinet.founded}
                      </span>
                    )}
                  </div>
                  {cabinet.specialties?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {cabinet.specialties.map((s) => (
                        <span key={s} className="inline-flex items-center rounded-md bg-slate-50 px-2 py-0.5 text-xs text-slate-600 ring-1 ring-inset ring-slate-200">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {cabinet.description && (
                <p className="mt-5 text-slate-600 leading-relaxed">{cabinet.description}</p>
              )}

              <div className="mt-5 flex flex-wrap gap-3">
                {cabinet.phone && (
                  <a href={`tel:${cabinet.phone}`} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:border-brand-300 hover:text-brand-700 transition-colors">
                    <Phone className="h-4 w-4" /> {cabinet.phone}
                  </a>
                )}
                {cabinet.website && (
                  <a href={cabinet.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:border-brand-300 hover:text-brand-700 transition-colors">
                    <Globe className="h-4 w-4" /> Site web <ExternalLink className="h-3 w-3 text-slate-400" />
                  </a>
                )}
              </div>
            </div>

            {/* Score IA */}
            <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50">
                  <Brain className="h-4 w-4 text-violet-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Score de Maturité IA</h2>
                  <p className="text-xs text-slate-500">5 dimensions — mis à jour automatiquement</p>
                </div>
              </div>

              {/* Mini gauges */}
              <div className="grid gap-4 grid-cols-5 mb-6">
                {SCORE_DIMS.map((dim) => {
                  const val = (cabinet[dim.key] as number) ?? 0;
                  const circ = 2 * Math.PI * 22;
                  return (
                    <div key={dim.label} className="flex flex-col items-center gap-1.5">
                      <div className="relative h-14 w-14">
                        <svg className="-rotate-90 h-14 w-14">
                          <circle cx="28" cy="28" r="22" fill="none" stroke="#e2e8f0" strokeWidth="5" />
                          <circle cx="28" cy="28" r="22" fill="none" stroke="currentColor" strokeWidth="5"
                            strokeDasharray={`${(val / 100) * circ} ${circ}`} strokeLinecap="round"
                            className={scoreColor(val)} />
                        </svg>
                        <span className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${scoreColor(val)}`}>{val}</span>
                      </div>
                      <span className="text-xs font-medium text-slate-700 text-center leading-tight">{dim.label}</span>
                      <p className="text-[10px] text-slate-400 text-center leading-tight hidden sm:block">{dim.description}</p>
                    </div>
                  );
                })}
              </div>

              {/* Barres */}
              <div className="space-y-3 border-t border-slate-50 pt-5">
                {SCORE_DIMS.map((dim) => {
                  const val = (cabinet[dim.key] as number) ?? 0;
                  return (
                    <div key={dim.label} className="flex items-center gap-3">
                      <span className="w-28 shrink-0 text-sm text-slate-600">{dim.label}</span>
                      <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div className={`h-full rounded-full ${scoreBg(val)}`} style={{ width: `${val}%` }} />
                      </div>
                      <span className={`w-8 text-right text-sm font-semibold ${scoreColor(val)}`}>{val}</span>
                    </div>
                  );
                })}
              </div>
              <p className="mt-4 text-xs text-slate-400">
                Score calculé depuis : site web, offres d&apos;emploi, logiciels détectés, présence digitale et données Sirene. Dernière mise à jour : {new Date(cabinet.updated_at).toLocaleDateString("fr-FR")}.
              </p>
            </div>

            {/* Forces & Faiblesses */}
            {((cabinet.strengths?.length ?? 0) > 0 || (cabinet.weaknesses?.length ?? 0) > 0) && (
              <div className="grid gap-4 sm:grid-cols-2">
                {(cabinet.strengths?.length ?? 0) > 0 && (
                  <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-5">
                    <h3 className="flex items-center gap-2 font-semibold text-emerald-800 mb-3">
                      <CheckCircle2 className="h-4 w-4" /> Points forts
                    </h3>
                    <ul className="space-y-2">
                      {cabinet.strengths.map((s) => (
                        <li key={s} className="flex items-start gap-2 text-sm text-emerald-700">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {(cabinet.weaknesses?.length ?? 0) > 0 && (
                  <div className="rounded-2xl bg-amber-50 border border-amber-100 p-5">
                    <h3 className="flex items-center gap-2 font-semibold text-amber-800 mb-3">
                      <AlertTriangle className="h-4 w-4" /> Points d&apos;amélioration
                    </h3>
                    <ul className="space-y-2">
                      {cabinet.weaknesses.map((w) => (
                        <li key={w} className="flex items-start gap-2 text-sm text-amber-700">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Logiciels */}
            {(cabinet.software?.length ?? 0) > 0 && (
              <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6">
                <h2 className="text-base font-bold text-slate-900 mb-4">Logiciels utilisés</h2>
                <div className="flex flex-wrap gap-2">
                  {cabinet.software.map((sw) => (
                    <span key={sw} className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium ring-1 ring-inset
                      ${MODERN_SOFTWARE.includes(sw) ? "bg-violet-50 text-violet-700 ring-violet-200" : "bg-slate-50 text-slate-600 ring-slate-200"}`}>
                      {LEGACY_SOFTWARE.includes(sw) && <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />}
                      {MODERN_SOFTWARE.includes(sw) && <Zap className="h-3.5 w-3.5" />}
                      {sw}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-xs text-slate-400">
                  Les outils modernes (Pennylane, Dext…) favorisent l&apos;automatisation. Les solutions legacy (ACD, Cegid…) sont des freins à l&apos;adoption IA.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6 flex flex-col items-center">
              <ScoreGauge score={cabinet.ai_score} maturity={cabinet.ai_maturity} />
            </div>

            {/* CRM — Call */}
            <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Suivi commercial</h3>
              <CallButton
                cabinetId={cabinet.id}
                initialCalled={cabinet.called ?? false}
                calledAt={cabinet.called_at ?? null}
                initialWrongNumber={cabinet.wrong_number ?? false}
                initialContactToFind={cabinet.contact_to_find ?? null}
              />
            </div>

            <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 p-6 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="h-5 w-5 text-brand-200" />
                <span className="text-sm font-semibold text-brand-100">Audit IA Gratuit</span>
              </div>
              <h3 className="text-lg font-bold">Comparez ce cabinet avec votre profil</h3>
              <p className="mt-2 text-sm text-brand-100 leading-relaxed">
                Découvrez si ce cabinet est le bon partenaire pour votre transformation digitale.
              </p>
              <Link href="/audit-ia" className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-brand-700 shadow hover:bg-brand-50 transition-colors">
                Lancer mon audit <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
              <h3 className="text-sm font-semibold text-slate-900">Vous gérez ce cabinet ?</h3>
              <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                Revendiquez votre fiche pour mettre à jour vos informations et booster votre score de visibilité.
              </p>
              <Link href="/revendiquer" className="mt-3 flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-700">
                Revendiquer cette fiche <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {(cabinet.siren || cabinet.address || cabinet.size || cabinet.founded) && (
              <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Informations légales</h3>
                <dl className="space-y-2 text-sm">
                  {cabinet.siren && (
                    <div className="flex justify-between">
                      <dt className="text-slate-500">SIREN</dt>
                      <dd className="font-mono text-slate-700">{cabinet.siren}</dd>
                    </div>
                  )}
                  {cabinet.size && (
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Taille</dt>
                      <dd className="text-slate-700">{cabinet.size}</dd>
                    </div>
                  )}
                  {cabinet.founded && (
                    <div className="flex justify-between">
                      <dt className="text-slate-500">Fondé en</dt>
                      <dd className="text-slate-700">{cabinet.founded}</dd>
                    </div>
                  )}
                  {cabinet.address && (
                    <div>
                      <dt className="text-slate-500 mb-1">Adresse</dt>
                      <dd className="text-slate-700">{cabinet.address}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8">
          <Link href="/firms" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-brand-600 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Retour à l&apos;annuaire
          </Link>
        </div>
      </div>
    </div>
  );
}
