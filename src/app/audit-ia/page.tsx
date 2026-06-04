"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  Clock,
  TrendingUp,
  Zap,
  FileText,
  Target,
  ChevronRight,
  Sparkles,
  BarChart3,
  MessageSquare,
  Shield,
  AlertTriangle,
} from "lucide-react";
import Navbar from "@/components/Navbar";

const AUDIT_BENEFITS = [
  {
    icon: Brain,
    title: "Analyse IA de votre cabinet",
    description: "Notre IA analyse votre stack technologique, vos processus et votre positionnement marché.",
    color: "text-violet-600 bg-violet-50 ring-violet-100",
  },
  {
    icon: BarChart3,
    title: "Rapport benchmark sectoriel",
    description: "Comparez-vous aux 20% de cabinets les plus avancés de votre région et spécialité.",
    color: "text-sky-600 bg-sky-50 ring-sky-100",
  },
  {
    icon: Zap,
    title: "3 automatisations prioritaires",
    description: "Identifiez les processus où l'IA vous ferait économiser le plus d'heures cette semaine.",
    color: "text-amber-600 bg-amber-50 ring-amber-100",
  },
  {
    icon: TrendingUp,
    title: "Estimation du ROI",
    description: "Quantifiez les heures récupérables et le chiffre d'affaires additionnel potentiel.",
    color: "text-emerald-600 bg-emerald-50 ring-emerald-100",
  },
];

const PROCESS_STEPS = [
  {
    step: "01",
    icon: FileText,
    title: "Remplissez le formulaire",
    description: "10 questions sur votre cabinet, vos outils et vos processus. Moins de 5 minutes.",
    time: "5 min",
  },
  {
    step: "02",
    icon: Brain,
    title: "L'IA analyse votre dossier",
    description: "Notre agent IA croise vos réponses avec les données de marché et les benchmarks sectoriels.",
    time: "Instantané",
  },
  {
    step: "03",
    icon: FileText,
    title: "Rapport PDF personnalisé",
    description: "Vous recevez un rapport de 8–12 pages avec votre score, benchmark et recommandations chiffrées.",
    time: "24h",
  },
  {
    step: "04",
    icon: MessageSquare,
    title: "Call stratégique optionnel",
    description: "30 minutes avec un expert Nira pour prioriser les actions et répondre à vos questions.",
    time: "Offert",
  },
];

const PAIN_POINTS = [
  { icon: Clock, text: "Saisie comptable encore majoritairement manuelle" },
  { icon: AlertTriangle, text: "Lettrage bancaire chronophage chaque mois" },
  { icon: FileText, text: "Reporting clients sur Excel, sans automatisation" },
  { icon: MessageSquare, text: "Appels clients récurrents pour des questions simples" },
  { icon: Target, text: "Relances de pièces manquantes gérées manuellement" },
  { icon: BarChart3, text: "Pas de visibilité sur la rentabilité dossier par dossier" },
];

const SAMPLE_FINDINGS = [
  { label: "Heures perdues/semaine en saisie", value: "~18h", trend: "down", color: "text-red-600 bg-red-50" },
  { label: "Gain potentiel avec OCR + lettrage auto", value: "14h/sem", trend: "up", color: "text-emerald-600 bg-emerald-50" },
  { label: "ROI estimé sur 12 mois", value: "× 4.2", trend: "up", color: "text-violet-600 bg-violet-50" },
  { label: "Position vs. concurrents locaux", value: "Top 40%", trend: "neutral", color: "text-amber-600 bg-amber-50" },
];

type FormState = "idle" | "submitting" | "success";

const LOGICIELS = ["Pennylane", "Cegid", "ACD", "MyUnisoft", "Indy", "Dext", "Silae", "Sage", "Autre"];

export default function AuditIaPage() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [form, setForm] = useState({
    cabinetName: "",
    email: "",
    phone: "",
    city: "",
    collaborateurs: "",
    logiciel: "",
    specialite: "",
    painPoint: "",
    objectif: "",
    budget: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("submitting");
    const { submitLead } = await import("@/lib/supabase/client-actions");
    const result = await submitLead({
      type: "audit",
      email: form.email,
      company: form.cabinetName,
      city: form.city || undefined,
      phone: form.phone || undefined,
      collaborateurs: form.collaborateurs || undefined,
      logiciel: form.logiciel || undefined,
      specialite: form.specialite || undefined,
      pain_point: form.painPoint || undefined,
    });
    if (result.error) {
      console.error(result.error);
    }
    setFormState("success");
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-100">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-1/4 h-96 w-96 rounded-full bg-violet-100/40 blur-3xl" />
          <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-brand-100/30 blur-3xl" />
        </div>

        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-sm font-medium text-violet-700 mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            100% gratuit · Rapport en 24h
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl text-balance">
            Audit IA de votre cabinet{" "}
            <span className="bg-gradient-to-r from-brand-600 to-violet-600 bg-clip-text text-transparent">
              offert par Nira
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 leading-relaxed text-balance">
            Découvrez combien d&apos;heures votre cabinet perd chaque semaine sur des tâches automatisables, et quelles sont les 3 actions prioritaires pour rattraper les cabinets en avance sur vous.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href="#formulaire"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-brand-700 transition-colors"
            >
              Lancer mon audit gratuit <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#exemple"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-6 py-3 text-sm font-medium text-slate-700 hover:border-brand-300 hover:text-brand-700 transition-colors"
            >
              Voir un exemple de rapport
            </a>
          </div>

          <p className="mt-4 text-xs text-slate-400">Déjà 47 cabinets audités ce mois · Aucune carte bancaire requise</p>
        </div>
      </section>

      {/* Pain points */}
      <section className="bg-slate-900 py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <p className="text-center text-sm font-medium text-slate-400 mb-6 uppercase tracking-wider">
            Est-ce que votre cabinet souffre de ces problèmes ?
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PAIN_POINTS.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.text} className="flex items-center gap-3 rounded-xl bg-slate-800 px-4 py-3">
                  <Icon className="h-4.5 w-4.5 shrink-0 text-amber-400" />
                  <span className="text-sm text-slate-300">{p.text}</span>
                </div>
              );
            })}
          </div>
          <p className="mt-6 text-center text-sm text-slate-400">
            Si vous avez coché au moins 2 cases, l&apos;IA peut vous faire économiser{" "}
            <span className="font-semibold text-white">10 à 20 heures par semaine</span>.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-slate-900">Ce que vous obtenez</h2>
          <p className="mt-2 text-slate-500">Un rapport personnalisé, pas un template générique</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {AUDIT_BENEFITS.map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.title} className={`rounded-2xl border p-5 ring-1 ${b.color}`}>
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl mb-3 ${b.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">{b.title}</h3>
                <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">{b.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Exemple de résultats */}
      <section id="exemple" className="bg-slate-50 border-y border-slate-100 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-900">Exemple de résultats d&apos;audit</h2>
            <p className="mt-2 text-slate-500">Cabinet fictif · 28 collaborateurs · Logiciel Cegid · Région PACA</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {SAMPLE_FINDINGS.map((f) => (
              <div key={f.label} className={`rounded-2xl p-5 ${f.color} bg-opacity-20`}>
                <p className={`text-2xl font-bold ${f.color.split(" ")[0]}`}>{f.value}</p>
                <p className="mt-1 text-xs text-slate-600 leading-tight">{f.label}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50">
                <Target className="h-4 w-4 text-violet-600" />
              </div>
              <h3 className="font-semibold text-slate-900">3 actions prioritaires recommandées</h3>
            </div>
            <div className="space-y-3">
              {[
                { priority: "P1", action: "Déployer Dext ou Pennylane pour automatiser la capture de factures", gain: "−8h/sem", difficulty: "Facile" },
                { priority: "P2", action: "Activer le lettrage automatique dans Cegid (module disponible mais désactivé)", gain: "−5h/sem", difficulty: "Moyen" },
                { priority: "P3", action: "Mettre en place un agent IA de relance de pièces manquantes par email", gain: "−3h/sem", difficulty: "Moyen" },
              ].map((item) => (
                <div key={item.priority} className="flex items-start gap-4 rounded-xl bg-slate-50 p-4">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                    {item.priority}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700">{item.action}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="block text-sm font-semibold text-emerald-600">{item.gain}</span>
                    <span className="text-xs text-slate-400">{item.difficulty}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-slate-900">Comment se déroule l&apos;audit</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS_STEPS.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.step} className="relative text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 ring-1 ring-brand-100">
                  <Icon className="h-6 w-6 text-brand-600" />
                </div>
                <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                  {s.step}
                </div>
                <h3 className="text-sm font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">{s.description}</p>
                <span className="mt-2 inline-block rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-100">
                  {s.time}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Form */}
      <section id="formulaire" className="bg-slate-50 border-t border-slate-100 py-16">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Démarrer mon audit IA</h2>
            <p className="mt-2 text-slate-500 text-sm">Gratuit · Sans engagement · Rapport sous 24h</p>
          </div>

          {formState === "success" ? (
            <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 mb-5">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Audit lancé !</h3>
              <p className="mt-3 text-slate-500 max-w-xs mx-auto">
                Notre IA analyse votre dossier. Vous recevrez votre rapport personnalisé sous 24h à l&apos;adresse indiquée.
              </p>
              <div className="mt-6 space-y-3">
                <Link
                  href="/firms"
                  className="flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition-colors"
                >
                  Explorer l&apos;annuaire en attendant <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/revendiquer"
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-brand-300 hover:text-brand-700 transition-colors"
                >
                  Revendiquer ma fiche cabinet
                </Link>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="cabinetName" className="block text-sm font-medium text-slate-700 mb-1.5">
                      Nom du cabinet <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="cabinetName"
                      name="cabinetName"
                      type="text"
                      required
                      value={form.cabinetName}
                      onChange={handleChange}
                      placeholder="Dupont Expertise"
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-slate-700 mb-1.5">
                      Ville <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      required
                      value={form.city}
                      onChange={handleChange}
                      placeholder="Lyon"
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="vous@cabinet.fr"
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1.5">
                      Téléphone
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="06 00 00 00 00"
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="collaborateurs" className="block text-sm font-medium text-slate-700 mb-1.5">
                      Nombre de collaborateurs <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="collaborateurs"
                      name="collaborateurs"
                      required
                      value={form.collaborateurs}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm bg-white focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-colors"
                    >
                      <option value="">Sélectionnez</option>
                      <option value="1-5">1 – 5</option>
                      <option value="6-15">6 – 15</option>
                      <option value="16-30">16 – 30</option>
                      <option value="31-50">31 – 50</option>
                      <option value="50+">Plus de 50</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="logiciel" className="block text-sm font-medium text-slate-700 mb-1.5">
                      Logiciel comptable principal <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="logiciel"
                      name="logiciel"
                      required
                      value={form.logiciel}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm bg-white focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-colors"
                    >
                      <option value="">Sélectionnez</option>
                      {LOGICIELS.map((l) => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="specialite" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Spécialité principale
                  </label>
                  <select
                    id="specialite"
                    name="specialite"
                    value={form.specialite}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm bg-white focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-colors"
                  >
                    <option value="">Sélectionnez (optionnel)</option>
                    <option value="tpe-pme">Comptabilité TPE/PME généraliste</option>
                    <option value="audit">Audit et commissariat aux comptes</option>
                    <option value="fiscal">Conseil et optimisation fiscale</option>
                    <option value="paie">Paie & RH</option>
                    <option value="patrimonial">Conseil patrimonial</option>
                    <option value="international">Fiscalité internationale</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Quel est votre plus grand problème opérationnel ?
                  </label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {[
                      { value: "saisie", label: "Saisie comptable trop chronophage" },
                      { value: "lettrage", label: "Lettrage bancaire fastidieux" },
                      { value: "reporting", label: "Reporting clients difficile à automatiser" },
                      { value: "relances", label: "Relances de pièces manquantes" },
                    ].map((opt) => (
                      <label
                        key={opt.value}
                        className={`flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-colors ${
                          form.painPoint === opt.value
                            ? "border-brand-400 bg-brand-50 ring-2 ring-brand-100"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="painPoint"
                          value={opt.value}
                          checked={form.painPoint === opt.value}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className={`h-4 w-4 shrink-0 rounded-full border-2 ${form.painPoint === opt.value ? "border-brand-600 bg-brand-600" : "border-slate-300"} flex items-center justify-center`}>
                          {form.painPoint === opt.value && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                        </div>
                        <span className="text-sm text-slate-700">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl bg-brand-50 border border-brand-100 p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="h-4.5 w-4.5 text-brand-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-brand-700 leading-relaxed">
                      Audit 100% gratuit et sans engagement. Vos données sont confidentielles et ne sont pas transmises à des tiers. Vous recevrez uniquement votre rapport + un email de suivi optionnel.
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={formState === "submitting"}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {formState === "submitting" ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Lancement de l&apos;analyse IA…
                    </>
                  ) : (
                    <>
                      Lancer mon audit gratuit <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700">
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="font-bold text-slate-900">Nira</span>
              <span className="text-slate-400 text-sm">— Annuaire IA des cabinets comptables</span>
            </div>
            <div className="flex items-center gap-5 text-sm text-slate-400">
              <Link href="/" className="hover:text-brand-600">Accueil</Link>
              <Link href="/firms" className="hover:text-brand-600">Annuaire</Link>
              <Link href="/revendiquer" className="hover:text-brand-600">Revendiquer</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
