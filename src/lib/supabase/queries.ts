import { createClient } from "./server";
import type { Cabinet, SearchFilters } from "@/types";

export async function getCabinets(filters?: SearchFilters): Promise<Cabinet[]> {
  const supabase = createClient();
  let query = supabase
    .from("cabinets")
    .select("*")
    .order("ai_score", { ascending: false });

  if (filters?.query) {
    query = query.or(
      `name.ilike.%${filters.query}%,city.ilike.%${filters.query}%,region.ilike.%${filters.query}%`
    );
  }
  if (filters?.region) {
    query = query.eq("region", filters.region);
  }
  if (filters?.size) {
    query = query.eq("size", filters.size);
  }
  if (filters?.ai_maturity) {
    query = query.eq("ai_maturity", filters.ai_maturity);
  }

  const { data, error } = await query;
  if (error) {
    console.error("getCabinets error:", error.message);
    return [];
  }
  return (data as Cabinet[]) ?? [];
}

export async function getCabinetBySlug(slug: string): Promise<Cabinet | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("cabinets")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("getCabinetBySlug error:", error.message);
    return null;
  }
  return data as Cabinet;
}

export async function getFeaturedCabinets(limit = 3): Promise<Cabinet[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("cabinets")
    .select("*")
    .order("ai_score", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getFeaturedCabinets error:", error.message);
    return [];
  }
  return (data as Cabinet[]) ?? [];
}

export async function getRegions(): Promise<string[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("cabinets")
    .select("region")
    .not("region", "is", null);

  const seen = new Set<string>();
  const unique = (data ?? [])
    .map((r: { region: string }) => r.region)
    .filter((r: string) => { if (seen.has(r)) return false; seen.add(r); return true; })
    .sort();
  return unique;
}
