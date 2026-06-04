"use server";

import { createClient } from "./server";
import type { Lead } from "@/types";

export async function insertLead(lead: Lead): Promise<{ error?: string }> {
  const supabase = createClient();
  const { error } = await supabase.from("leads").insert([lead]);
  if (error) {
    console.error("insertLead error:", error.message);
    return { error: error.message };
  }
  return {};
}

export async function insertClaimRequest(data: {
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
      message: `[REVENDIQUER] SIREN: ${data.siren ?? "N/A"} — Rôle: ${data.role}\n\n${data.message ?? ""}`,
      status: "nouveau",
    },
  ]);
  if (error) {
    console.error("insertClaimRequest error:", error.message);
    return { error: error.message };
  }
  return {};
}
