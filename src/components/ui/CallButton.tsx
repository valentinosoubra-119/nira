"use client";

import { useState } from "react";
import { Phone, PhoneOff, Check, Loader2 } from "lucide-react";
import { markAsCalled, unmarkAsCalled } from "@/lib/supabase/client-actions";

interface Props {
  cabinetId: string;
  initialCalled: boolean;
  calledAt?: string | null;
}

export default function CallButton({ cabinetId, initialCalled, calledAt }: Props) {
  const [called, setCalled] = useState(initialCalled);
  const [calledAtState, setCalledAtState] = useState<string | null>(calledAt ?? null);
  const [loading, setLoading] = useState(false);
  const [flash, setFlash] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    if (!called) {
      const { error } = await markAsCalled(cabinetId);
      if (!error) {
        const now = new Date().toISOString();
        setCalled(true);
        setCalledAtState(now);
        setFlash(true);
        setTimeout(() => setFlash(false), 2000);
      }
    } else {
      const { error } = await unmarkAsCalled(cabinetId);
      if (!error) {
        setCalled(false);
        setCalledAtState(null);
      }
    }
    setLoading(false);
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
    <div className="flex flex-col gap-2">
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm
          ${called
            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100"
            : "bg-brand-600 text-white hover:bg-brand-700"
          }
          ${flash ? "scale-105" : "scale-100"}
        `}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : called ? (
          <Check className="h-4 w-4" />
        ) : (
          <Phone className="h-4 w-4" />
        )}
        {called ? "Call réalisé ✓" : "📞 Call réalisé"}
      </button>

      {called && formattedDate && (
        <p className="flex items-center gap-1.5 text-xs text-slate-400">
          <PhoneOff className="h-3 w-3" />
          Appelé le {formattedDate}
          <button
            onClick={handleToggle}
            disabled={loading}
            className="ml-1 underline underline-offset-2 hover:text-slate-600 transition-colors"
          >
            Annuler
          </button>
        </p>
      )}
    </div>
  );
}
