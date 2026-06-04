"use client";

import { createClient } from "./client";

export async function submitLead(data: {
  type: "dirigeant" | "cabinet" | "audit";
  email: string;
  name?: string;
  phone?: string;
  city?: string;
  company?: string;
  message?: string;
  collaborateurs?: string;
  logiciel?: string;
  specialite?: string;
  pain_point?: string;
}): Promise<{ error?: string }> {
  const supabase = createClient();
  const { error } = await supabase.from("leads").insert([{ ...data, status: "nouveau" }]);
  if (error) {
    console.error("submitLead:", error.message);
    return { error: error.message };
  }
  return {};
}

export async function submitClaimRequest(data: {
  cabinet_name: string;
  siren?: string;
  email: string;
  role: string;
  phone?: string;
  message?: string;
}): Promise<{ error?: string }> {
  const supabase = createClient();
  const { error } = await supabase.from("leads").insert([
    {
      type: "cabinet",
      email: data.email,
      company: data.cabinet_name,
      name: data.role,
      phone: data.phone ?? null,
      message: `[REVENDIQUER] SIREN: ${data.siren ?? "N/A"} — Rôle: ${data.role}\n\n${data.message ?? ""}`.trim(),
      status: "nouveau",
    },
  ]);
  if (error) {
    console.error("submitClaimRequest:", error.message);
    return { error: error.message };
  }
  return {};
}
