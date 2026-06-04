import Link from "next/link";
import { MapPin, Users } from "lucide-react";
import Image from "next/image";
import type { Firm } from "@/types";
import AiScoreBadge from "./AiScoreBadge";

interface Props {
  firm: Firm;
}

const sizeLabel: Record<Firm["size"], string> = {
  TPE: "Très petite",
  PME: "Petite/Moyenne",
  ETI: "ETI",
  Grand: "Grand groupe",
};

export default function FirmCard({ firm }: Props) {
  return (
    <Link href={`/firms/${firm.slug}`} className="group block">
      <div className="relative h-full rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-200 hover:border-brand-200 hover:shadow-md hover:-translate-y-0.5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="truncate text-base font-semibold text-slate-900 group-hover:text-brand-700 transition-colors">
              {firm.name}
            </h3>
            <div className="mt-1 flex items-center gap-1 text-sm text-slate-500">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">
                {firm.city}, {firm.region}
              </span>
            </div>
          </div>

          {firm.logo_url ? (
            <Image
              src={firm.logo_url}
              alt={firm.name}
              width={40}
              height={40}
              className="h-10 w-10 rounded-lg object-contain border border-slate-100"
            />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 font-bold text-sm">
              {firm.name.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>

        <p className="mt-3 line-clamp-2 text-sm text-slate-600">{firm.description}</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {firm.specializations.slice(0, 3).map((spec) => (
            <span
              key={spec}
              className="inline-flex items-center rounded-md bg-slate-50 px-2 py-0.5 text-xs text-slate-600 ring-1 ring-inset ring-slate-200"
            >
              {spec}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-4">
          <AiScoreBadge score={firm.ai_score} maturity={firm.ai_maturity} size="sm" />
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Users className="h-3.5 w-3.5" />
            <span>{sizeLabel[firm.size]}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
