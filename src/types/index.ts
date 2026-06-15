export type AiMaturityLevel = "Débutant" | "Intermédiaire" | "Avancé" | "Leader";

export interface Cabinet {
  id: string;
  slug: string;
  name: string;
  city: string;
  region: string;
  department: string;
  postal_code?: string;
  phone?: string;
  email?: string;
  website?: string;
  siren?: string;
  size: "TPE" | "PME" | "ETI" | "Grand";
  specialties: string[];
  software: string[];
  description?: string;
  employee_count?: number;
  founded?: number;
  logo_url?: string;
  address?: string;
  ai_score: number;
  ai_maturity: AiMaturityLevel;
  score_automation: number;
  score_analytics: number;
  score_tools: number;
  score_training: number;
  score_compliance: number;
  strengths: string[];
  weaknesses: string[];
  claimed: boolean;
  claimed_at?: string;
  called: boolean;
  called_at?: string;
  wrong_number: boolean;
  contact_to_find?: string | null;
  source?: string;
  created_at: string;
  updated_at: string;
}

// Backward-compat alias used in older components
export type Firm = Cabinet & { specializations: string[] };

export interface Lead {
  id?: string;
  cabinet_id?: string;
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
  status?: "nouveau" | "contacté" | "qualifié" | "vendu" | "perdu";
}

export interface SearchFilters {
  query?: string;
  region?: string;
  size?: string;
  ai_maturity?: AiMaturityLevel;
  specialization?: string;
}
