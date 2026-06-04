"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X, MapPin, Building2 } from "lucide-react";

const SUGGESTIONS = [
  { label: "Paris", type: "city", icon: MapPin },
  { label: "Lyon", type: "city", icon: MapPin },
  { label: "Marseille", type: "city", icon: MapPin },
  { label: "Bordeaux", type: "city", icon: MapPin },
  { label: "Audit & Commissariat", type: "specialization", icon: Building2 },
  { label: "Fiscalité internationale", type: "specialization", icon: Building2 },
  { label: "Paie & RH", type: "specialization", icon: Building2 },
];

interface Props {
  initialQuery?: string;
  large?: boolean;
}

export default function SearchBar({ initialQuery = "", large = false }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filtered = SUGGESTIONS.filter((s) =>
    s.label.toLowerCase().includes(query.toLowerCase())
  );
  const showDropdown = focused && query.length === 0;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/firms?q=${encodeURIComponent(query.trim())}`);
      setFocused(false);
    }
  };

  const handleSuggestion = (label: string) => {
    setQuery(label);
    router.push(`/firms?q=${encodeURIComponent(label)}`);
    setFocused(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={`flex items-center gap-3 rounded-2xl border bg-white transition-all duration-200 ${
            large ? "px-5 py-4 text-base" : "px-4 py-3 text-sm"
          } ${
            focused
              ? "border-brand-400 shadow-lg shadow-brand-100/50 ring-2 ring-brand-100"
              : "border-slate-200 shadow-sm hover:border-slate-300"
          }`}
        >
          <Search
            className={`shrink-0 text-slate-400 ${large ? "h-5 w-5" : "h-4 w-4"}`}
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            placeholder="Rechercher un cabinet, une ville, une spécialité…"
            className={`flex-1 bg-transparent outline-none placeholder:text-slate-400 text-slate-900 ${
              large ? "text-base" : "text-sm"
            }`}
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="shrink-0 rounded-full p-0.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            type="submit"
            className={`shrink-0 rounded-xl bg-brand-600 font-medium text-white transition-colors hover:bg-brand-700 active:bg-brand-800 ${
              large ? "px-5 py-2 text-sm" : "px-4 py-1.5 text-xs"
            }`}
          >
            Rechercher
          </button>
        </div>
      </form>

      {showDropdown && (
        <div className="absolute z-50 mt-2 w-full rounded-2xl border border-slate-100 bg-white shadow-xl shadow-slate-200/60 animate-slide-up">
          <div className="p-2">
            <p className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-slate-400">
              Suggestions
            </p>
            {filtered.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => handleSuggestion(s.label)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-50">
                    <Icon className="h-4 w-4 text-brand-600" />
                  </span>
                  {s.label}
                  <span className="ml-auto text-xs text-slate-400">
                    {s.type === "city" ? "Ville" : "Spécialité"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
