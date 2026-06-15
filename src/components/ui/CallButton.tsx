"use client";

import { useState, useRef, useEffect } from "react";
import { Phone, PhoneOff, Check, Loader2, X, UserSearch } from "lucide-react";
import {
  markAsCalled,
  unmarkAsCalled,
  markAsWrongNumber,
  unmarkAsWrongNumber,
} from "@/lib/supabase/client-actions";

interface Props {
  cabinetId: string;
  initialCalled: boolean;
  calledAt?: string | null;
  initialWrongNumber: boolean;
  initialContactToFind?: string | null;
}

export default function CallButton({
  cabinetId,
  initialCalled,
  calledAt,
  initialWrongNumber,
  initialContactToFind,
}: Props) {
  // ── État "Call réalisé" ────────────────────────────────────
  const [called, setCalled] = useState(initialCalled);
  const [calledAtState, setCalledAtState] = useState<string | null>(calledAt ?? null);
  const [callLoading, setCallLoading] = useState(false);
  const [callFlash, setCallFlash] = useState(false);

  // ── État "Mauvais numéro" ──────────────────────────────────
  const [wrongNumber, setWrongNumber] = useState(initialWrongNumber);
  const [contactToFind, setContactToFind] = useState(initialContactToFind ?? "");
  const [wrongLoading, setWrongLoading] = useState(false);

  // ── Modale ─────────────────────────────────────────────────
  const [modalOpen, setModalOpen] = useState(false);
  const [draftContact, setDraftContact] = useState(initialContactToFind ?? "");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus l'input quand la modale s'ouvre
  useEffect(() => {
    if (modalOpen) {
      setDraftContact(contactToFind);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [modalOpen, contactToFind]);

  // Ferme la modale sur Échap
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  // ── Handlers ───────────────────────────────────────────────
  const handleCallToggle = async () => {
    setCallLoading(true);
    if (!called) {
      const { error } = await markAsCalled(cabinetId);
      if (!error) {
        const now = new Date().toISOString();
        setCalled(true);
        setCalledAtState(now);
        setCallFlash(true);
        setTimeout(() => setCallFlash(false), 2000);
        // Si on marque "call réalisé", on retire "mauvais numéro"
        if (wrongNumber) {
          await unmarkAsWrongNumber(cabinetId);
          setWrongNumber(false);
          setContactToFind("");
        }
      }
    } else {
      const { error } = await unmarkAsCalled(cabinetId);
      if (!error) {
        setCalled(false);
        setCalledAtState(null);
      }
    }
    setCallLoading(false);
  };

  const handleWrongNumberSave = async () => {
    setWrongLoading(true);
    const { error } = await markAsWrongNumber(cabinetId, draftContact.trim());
    if (!error) {
      setWrongNumber(true);
      setContactToFind(draftContact.trim());
      setModalOpen(false);
      // Si on marque "mauvais numéro", on retire "call réalisé"
      if (called) {
        await unmarkAsCalled(cabinetId);
        setCalled(false);
        setCalledAtState(null);
      }
    }
    setWrongLoading(false);
  };

  const handleWrongNumberClear = async () => {
    setWrongLoading(true);
    const { error } = await unmarkAsWrongNumber(cabinetId);
    if (!error) {
      setWrongNumber(false);
      setContactToFind("");
    }
    setWrongLoading(false);
  };

  const formattedDate = calledAtState
    ? new Date(calledAtState).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <>
      {/* ── Boutons ── */}
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          {/* Call réalisé */}
          <button
            onClick={handleCallToggle}
            disabled={callLoading}
            className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm
              ${called
                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100"
                : "bg-brand-600 text-white hover:bg-brand-700"
              }
              ${callFlash ? "scale-105" : "scale-100"}
            `}
          >
            {callLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : called ? (
              <Check className="h-4 w-4" />
            ) : (
              <Phone className="h-4 w-4" />
            )}
            {called ? "Call réalisé ✓" : "📞 Call réalisé"}
          </button>

          {/* Mauvais numéro */}
          <button
            onClick={() => wrongNumber ? handleWrongNumberClear() : setModalOpen(true)}
            disabled={wrongLoading}
            className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm
              ${wrongNumber
                ? "bg-red-50 text-red-600 ring-1 ring-red-200 hover:bg-red-100"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }
            `}
          >
            {wrongLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <X className="h-4 w-4" />
            )}
            {wrongNumber ? "Mauvais n° ✓" : "❌ Mauvais n°"}
          </button>
        </div>

        {/* Sous-labels d'état */}
        <div className="space-y-1">
          {called && formattedDate && (
            <p className="flex items-center gap-1.5 text-xs text-slate-400">
              <PhoneOff className="h-3 w-3" />
              Appelé le {formattedDate}
              <button
                onClick={handleCallToggle}
                disabled={callLoading}
                className="ml-1 underline underline-offset-2 hover:text-slate-600 transition-colors"
              >
                Annuler
              </button>
            </p>
          )}

          {wrongNumber && (
            <p className="flex items-center gap-1.5 text-xs text-red-400">
              <UserSearch className="h-3 w-3" />
              {contactToFind
                ? <>Contact à trouver : <span className="font-medium text-red-600">{contactToFind}</span></>
                : "Mauvais numéro enregistré"
              }
              <button
                onClick={() => setModalOpen(true)}
                className="ml-1 underline underline-offset-2 hover:text-red-600 transition-colors"
              >
                Modifier
              </button>
            </p>
          )}
        </div>
      </div>

      {/* ── Modale "Mauvais numéro" ── */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />

          {/* Panneau */}
          <div className="relative w-full max-w-sm rounded-2xl bg-white shadow-xl border border-slate-100 p-6 animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50">
                  <X className="h-4 w-4 text-red-500" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Mauvais numéro</h3>
                  <p className="text-xs text-slate-400">Quel contact chercher ?</p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Input */}
            <div className="space-y-1.5 mb-5">
              <label htmlFor="contact-input" className="text-xs font-medium text-slate-700">
                Nom du bon contact à trouver
              </label>
              <input
                id="contact-input"
                ref={inputRef}
                type="text"
                value={draftContact}
                onChange={(e) => setDraftContact(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleWrongNumberSave(); }}
                placeholder="Ex: Marie Dupont, DRH"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 transition-colors"
              />
              <p className="text-xs text-slate-400">Optionnel — laissez vide si inconnu</p>
            </div>

            {/* Boutons */}
            <div className="flex gap-2">
              <button
                onClick={() => setModalOpen(false)}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleWrongNumberSave}
                disabled={wrongLoading}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 transition-colors disabled:opacity-60"
              >
                {wrongLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
