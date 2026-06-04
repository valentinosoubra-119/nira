-- ============================================================
-- NIRA — Migration initiale
-- À exécuter dans : Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. CABINETS
create table if not exists public.cabinets (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  name          text not null,
  address       text,
  city          text not null,
  region        text,
  department    text,
  postal_code   text,
  phone         text,
  email         text,
  website       text,
  siren         text unique,
  size          text check (size in ('TPE','PME','ETI','Grand')),
  specialties   text[] default '{}',
  software      text[] default '{}',
  description   text,
  employee_count integer,
  founded       integer,
  logo_url      text,
  ai_score      integer default 0 check (ai_score between 0 and 100),
  ai_maturity   text check (ai_maturity in ('Débutant','Intermédiaire','Avancé','Leader')),
  score_automation  integer default 0,
  score_analytics   integer default 0,
  score_tools       integer default 0,
  score_training    integer default 0,
  score_compliance  integer default 0,
  strengths     text[] default '{}',
  weaknesses    text[] default '{}',
  claimed       boolean default false,
  claimed_at    timestamptz,
  source        text default 'manual',
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- 2. LEADS
create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  cabinet_id  uuid references public.cabinets(id) on delete set null,
  type        text not null check (type in ('dirigeant','cabinet','audit')),
  email       text not null,
  name        text,
  phone       text,
  city        text,
  company     text,
  message     text,
  -- champs audit IA
  collaborateurs text,
  logiciel    text,
  specialite  text,
  pain_point  text,
  -- pipeline
  status      text default 'nouveau' check (status in ('nouveau','contacté','qualifié','vendu','perdu')),
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- 3. DIRIGEANTS
create table if not exists public.dirigeants (
  id          uuid primary key default gen_random_uuid(),
  email       text unique not null,
  name        text,
  sector      text,
  city        text,
  company     text,
  searches    text[] default '{}',
  created_at  timestamptz default now()
);

-- ============================================================
-- RLS (Row Level Security) — lecture publique, écriture protégée
-- ============================================================
alter table public.cabinets enable row level security;
alter table public.leads enable row level security;
alter table public.dirigeants enable row level security;

-- Cabinets : tout le monde peut lire
create policy "cabinets_select_public"
  on public.cabinets for select
  using (true);

-- Leads : insertion publique (formulaires), lecture restreinte
create policy "leads_insert_public"
  on public.leads for insert
  with check (true);

-- Dirigeants : insertion publique
create policy "dirigeants_insert_public"
  on public.dirigeants for insert
  with check (true);

-- ============================================================
-- Fonction auto-update updated_at
-- ============================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger cabinets_updated_at
  before update on public.cabinets
  for each row execute function public.set_updated_at();

create trigger leads_updated_at
  before update on public.leads
  for each row execute function public.set_updated_at();

-- ============================================================
-- Index utiles
-- ============================================================
create index if not exists cabinets_city_idx on public.cabinets(city);
create index if not exists cabinets_region_idx on public.cabinets(region);
create index if not exists cabinets_ai_score_idx on public.cabinets(ai_score desc);
create index if not exists cabinets_slug_idx on public.cabinets(slug);
create index if not exists leads_type_idx on public.leads(type);
create index if not exists leads_status_idx on public.leads(status);

-- ============================================================
-- Données de démonstration (3 cabinets)
-- ============================================================
insert into public.cabinets (slug, name, city, region, department, phone, website, siren, size, specialties, software, description, employee_count, founded, ai_score, ai_maturity, score_automation, score_analytics, score_tools, score_training, score_compliance, strengths, weaknesses, claimed, source)
values
(
  'exco-fcec',
  'Exco FCEC',
  'Paris', 'Île-de-France', '75',
  '01 42 00 00 00', 'https://exco.fr', '123456789',
  'ETI',
  array['Audit','Conseil fiscal','Paie & RH','Commissariat aux comptes'],
  array['Pennylane','Silae','Karima','ChatGPT Enterprise'],
  'Réseau national d''expertise comptable intégrant des outils IA pour l''automatisation fiscale et la gestion de paie.',
  850, 1982,
  87, 'Leader',
  92, 88, 85, 80, 90,
  array['Adoption avancée de Pennylane (cloud-native)','Programme de formation IA interne','Automatisation de la saisie à 90%','Dashboard clients en temps réel'],
  array['Coût élevé pour les TPE','Temps d''attente parfois long en période fiscale'],
  true, 'demo'
),
(
  'cog-associes',
  'Cogérance & Associés',
  'Lyon', 'Auvergne-Rhône-Alpes', '69',
  '04 72 00 00 00', 'https://cog-associes.fr', '987654321',
  'PME',
  array['Comptabilité TPE','TVA','Bilan','Création d''entreprise'],
  array['Cegid','Indy','Dext'],
  'Cabinet lyonnais spécialisé dans l''accompagnement des PME avec une adoption progressive des outils IA.',
  45, 2003,
  62, 'Avancé',
  65, 55, 60, 70, 60,
  array['Adoption de Dext pour la capture documentaire','Équipe jeune et ouverte à la technologie','Spécialisation sectorielle forte'],
  array['Logiciel Cegid (legacy) frein à l''automatisation','Pas encore de dashboard client en temps réel','Formation IA à renforcer'],
  false, 'demo'
),
(
  'lapierre-expertise',
  'Lapierre Expertise',
  'Bordeaux', 'Nouvelle-Aquitaine', '33',
  '05 56 00 00 00', 'https://lapierre-expertise.fr', '456123789',
  'PME',
  array['Commissariat aux comptes','Fiscalité internationale','Restructuration'],
  array['ACD','Excel'],
  'Cabinet à taille humaine proposant des services d''audit et de conseil fiscal pour les sociétés exportatrices.',
  22, 1998,
  44, 'Intermédiaire',
  35, 50, 40, 45, 50,
  array['Expertise fiscale internationale reconnue','Clientèle fidèle et long terme'],
  array['Logiciel ACD très legacy, peu d''automatisation','Saisie manuelle chronophage','Pas de portail client digital','Aucun outil d''automatisation des relances'],
  false, 'demo'
)
on conflict (slug) do nothing;
