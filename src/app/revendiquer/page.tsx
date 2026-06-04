"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Shield,
  Brain,
  TrendingUp,
  Star,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";

const BENEFITS = [
  {
    icon: Brain,
    title: "Score IA personnalisé",
    description: "Obtenez un score de maturité IA précis basé sur vos outils réels, pas une estimation publique.",
    color: "text-violet-600 bg-violet-50",
  },
  {
    icon: TrendingUp,
    title: "Visibilité accrue",
    description: "Les fiches revendiquées apparaissent en tête de liste et sont recommandées en priorité.",
    color: "text-sky-600 bg-sky-50",
  },
  {
    icon: Shield,
    title: "Données vérifiées",
    description: "Un badge « Fiche certifiée » rassure les dirigeants qui consultent votre profil.",
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    icon: Star,
    title: "Leads qualifiés",
    description: "Recevez des mises en relation directes de dirigeants cherchant votre spécialité.",
    color: "text-amber-600 bg-amber-50",
  },
];

const STEPS = [
  { step: 1, title: "Recherchez votre fiche", description: "Entrez le nom ou le SIREN de votre cabinet" },
  { step: 2, title: "Vérifiez votre identité", description: "Par email professionnel ou code reçu par courrier" },
  { step: 3, title: "Complétez votre profil", description: "Ajoutez vos spécialités, logiciels et description" },
  { step: 4, title: "Obtenez votre score IA", description: "Score recalculé avec vos données réelles" },
];

type FormState = "idle" | "submitting" | "success";

export default function RevendiquerPage() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [form, setForm] = useState({
    cabinetName: "",
    siren: "",
    email: "",
    role: "",
    phone: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("submitting");
    const { submitClaimRequest } = await import("@/lib/supabase/client-actions");
    const result = await submitClaimRequest({
      cabinet_name: form.cabinetName,
      siren: form.siren || undefined,
      email: form.email,
      role: form.role,
      phone: form.phone || undefined,
      message: form.message || undefined,
    });
    if (result.error) {
      console.error(result.error);
    }
    setFormState("success");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Breadcrumb */}
      <div className="border-b border-slate-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
          <nav className="flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="hover:text-brand-600">Accueil</Link>
            <span>/</span>
            <span className="text-slate-900 font-medium">Revendiquer ma fiche</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2">

          {/* Left: pitch */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 mb-5">
              <Building2 className="h-3.5 w-3.5" />
              Pour les cabinets comptables
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Revendiquez votre fiche{" "}
              <span className="bg-gradient-to-r from-brand-600 to-violet-600 bg-clip-text text-transparent">
                gratuitement
              </span>
            </h1>

            <p className="mt-4 text-lg text-slate-600 leading-relaxed">
              Votre cabinet est peut-être déjà référencé. Revendiquez votre fiche pour prendre le contrôle de votre présence, afficher vos vraies données et obtenir un score IA précis.
            </p>

            {/* Bénéfices */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {BENEFITS.map((b) => {
                const Icon = b.icon;
                return (
                  <div key={b.title} className="flex gap-3 rounded-xl bg-white border border-slate-100 p-4 shadow-sm">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${b.color}`}>
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">{b.title}</h3>
                      <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">{b.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Étapes */}
            <div className="mt-10">
              <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Comment ça marche</h2>
              <div className="space-y-3">
                {STEPS.map((s, i) => (
                  <div key={s.step} className="flex items-start gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white shadow-sm">
                      {s.step}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{s.title}</p>
                      <p className="text-xs text-slate-500">{s.description}</p>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className="ml-4 mt-8 hidden h-4 w-px bg-slate-200 sm:block absolute" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Social proof */}
            <div className="mt-10 rounded-xl bg-gradient-to-br from-brand-50 to-violet-50 border border-brand-100 p-5">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {["EC", "LM", "SR"].map((initials) => (
                    <div key={initials} className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white ring-2 ring-white">
                      {initials}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-slate-700">
                  <span className="font-semibold">+120 cabinets</span> ont déjà revendiqué leur fiche ce mois-ci.
                </p>
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div>
            {formState === "success" ? (
              <div className="flex flex-col items-center justify-center rounded-2xl bg-white border border-slate-100 shadow-sm p-12 text-center h-full">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 mb-5">
                  <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Demande envoyée !</h2>
                <p className="mt-3 text-slate-500 max-w-xs">
                  Nous avons bien reçu votre demande. Vous recevrez un email de confirmation sous 24h pour valider votre identité.
                </p>
                <div className="mt-6 space-y-3 w-full max-w-xs">
                  <Link
                    href="/firms"
                    className="flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 transition-colors"
                  >
                    Explorer l&apos;annuaire <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/audit-ia"
                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-brand-300 hover:text-brand-700 transition-colors"
                  >
                    Découvrir l&apos;audit IA <Sparkles className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-8">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Revendiquer ma fiche cabinet</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
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
                      placeholder="Ex: Dupont & Associés"
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="siren" className="block text-sm font-medium text-slate-700 mb-1.5">
                      SIREN / SIRET
                    </label>
                    <input
                      id="siren"
                      name="siren"
                      type="text"
                      value={form.siren}
                      onChange={handleChange}
                      placeholder="Ex: 123 456 789"
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-slate-700 mb-1.5">
                      Votre rôle <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="role"
                      name="role"
                      required
                      value={form.role}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-colors bg-white"
                    >
                      <option value="">Sélectionnez votre rôle</option>
                      <option value="expert-comptable">Expert-comptable associé</option>
                      <option value="dirigeant">Dirigeant / Gérant</option>
                      <option value="collaborateur">Collaborateur autorisé</option>
                      <option value="office-manager">Office Manager</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                      Email professionnel <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="prenom.nom@cabinet.fr"
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-colors"
                    />
                    <p className="mt-1 text-xs text-slate-400">Utilisez votre email du cabinet pour faciliter la vérification</p>
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
                      placeholder="Ex: 01 42 00 00 00"
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1.5">
                      Message (optionnel)
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={3}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Précisez vos spécialités, logiciels utilisés, ou toute information utile..."
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-colors resize-none"
                    />
                  </div>

                  <div className="rounded-xl bg-brand-50 border border-brand-100 p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="h-4.5 w-4.5 text-brand-600 shrink-0 mt-0.5" />
                      <p className="text-xs text-brand-700 leading-relaxed">
                        Vos données sont traitées conformément au RGPD. Elles ne seront jamais revendues à des tiers. Vous disposez d&apos;un droit de rectification et de suppression à tout moment.
                      </p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={formState === "submitting"}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {formState === "submitting" ? (
                      <>
                        <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Envoi en cours…
                      </>
                    ) : (
                      <>
                        Envoyer ma demande <ChevronRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>

                <p className="mt-4 text-center text-xs text-slate-400">
                  Déjà un compte ?{" "}
                  <Link href="#" className="text-brand-600 hover:underline">Se connecter</Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer mini */}
      <footer className="border-t border-slate-100 bg-white mt-16">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 text-center text-sm text-slate-400">
          © 2025 Nira — <Link href="/" className="hover:text-brand-600">Accueil</Link> · <Link href="/firms" className="hover:text-brand-600">Annuaire</Link> · <Link href="/audit-ia" className="hover:text-brand-600">Audit IA</Link>
        </div>
      </footer>
    </div>
  );
}
