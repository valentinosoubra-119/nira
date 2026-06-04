#!/usr/bin/env python3
"""
Nira — Import Sirene
Récupère les cabinets comptables (NAF 69.20Z) via l'API recherche-entreprises.api.gouv.fr,
calcule un score de maturité IA automatique, et les insère dans Supabase.

Usage :
  python3 scripts/import_sirene.py              # 1 page (25 cabinets)
  python3 scripts/import_sirene.py --pages 5    # 5 pages (125 cabinets)
  python3 scripts/import_sirene.py --dry-run    # Affiche sans insérer
"""

import argparse
import os
import re
import sys
import time
import warnings
from datetime import date
from typing import Optional

# Supprime le warning LibreSSL sur macOS (cosmétique, pas fonctionnel)
warnings.filterwarnings("ignore", category=Warning, module="urllib3")

import requests
from supabase import create_client, Client

# ─────────────────────────────────────────────
# Config
# ─────────────────────────────────────────────
SUPABASE_URL = os.environ.get(
    "NEXT_PUBLIC_SUPABASE_URL",
    "https://rvcbxydspswqvsckhyil.supabase.co",
)
# Le script d'import a besoin de la service_role key pour bypasser le RLS.
# Dashboard Supabase > Settings > API > service_role (secret).
# Passe-la via : SUPABASE_SERVICE_KEY=... python3 scripts/import_sirene.py
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY") or os.environ.get(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "sb_publishable_I_pqr6OL4vig8HTW-zBx3Q_4acxAw25",
)

API_BASE = "https://recherche-entreprises.api.gouv.fr/search"
NAF_CODE = "69.20Z"
PER_PAGE = 25
DELAY_BETWEEN_PAGES = 1.0  # secondes — respecte les limites de l'API

# ─────────────────────────────────────────────
# Correspondance codes région INSEE → nom
# ─────────────────────────────────────────────
REGIONS = {
    "01": "Guadeloupe",
    "02": "Martinique",
    "03": "Guyane",
    "04": "La Réunion",
    "06": "Mayotte",
    "11": "Île-de-France",
    "24": "Centre-Val de Loire",
    "27": "Bourgogne-Franche-Comté",
    "28": "Normandie",
    "32": "Hauts-de-France",
    "44": "Grand Est",
    "52": "Pays de la Loire",
    "53": "Bretagne",
    "75": "Nouvelle-Aquitaine",
    "76": "Occitanie",
    "84": "Auvergne-Rhône-Alpes",
    "93": "Provence-Alpes-Côte d'Azur",
    "94": "Corse",
}

# Tranche INSEE → effectif estimé (milieu de fourchette)
TRANCHE_EFFECTIF = {
    "NN": 0, "00": 0, "01": 2, "02": 5, "03": 10, "11": 15, "12": 25,
    "21": 40, "22": 75, "31": 150, "32": 350, "41": 750, "42": 1500,
    "51": 3500, "52": 7500, "53": 15000,
}

# Catégorie entreprise INSEE → taille Nira
CATEGORIE_TO_SIZE = {
    "PME": "PME",
    "ETI": "ETI",
    "GE":  "Grand",
}


# ─────────────────────────────────────────────
# Score IA
# ─────────────────────────────────────────────
def compute_ai_score(
    employee_count: int,
    founded_year: Optional[int],
    categorie: str,
    nombre_etablissements: int,
) -> dict:
    """
    Calcule un score de maturité IA (0-100) sur 5 dimensions.

    Hypothèses :
    - Les grands cabinets investissent plus dans l'IA (Automatisation, Outils)
    - Les cabinets récents sont plus agiles techniquement (Outils, Formation)
    - Les réseaux multi-établissements ont plus de moyens (Analytics, Conformité)
    - La maturité globale est une moyenne pondérée
    """
    current_year = date.today().year
    age = current_year - founded_year if founded_year else 20

    # ── Automatisation ─────────────────────────────────────────
    # Grands cabinets automatisent davantage
    if employee_count >= 200:
        auto = 75
    elif employee_count >= 50:
        auto = 55
    elif employee_count >= 10:
        auto = 35
    else:
        auto = 20
    # Bonus si réseau (multi-établissements)
    auto += min(10, nombre_etablissements // 5)
    # Bonus si entreprise jeune (moins de 10 ans → cloud-native)
    if age <= 5:
        auto += 15
    elif age <= 10:
        auto += 8
    auto = min(95, auto)

    # ── Analytics ──────────────────────────────────────────────
    if employee_count >= 100:
        analytics = 65
    elif employee_count >= 30:
        analytics = 45
    else:
        analytics = 25
    if nombre_etablissements >= 10:
        analytics += 15
    analytics = min(90, analytics)

    # ── Outils IA ──────────────────────────────────────────────
    if age <= 5:
        tools = 70  # Née après 2019 → stack moderne probable
    elif age <= 10:
        tools = 50
    elif age <= 20:
        tools = 35
    else:
        tools = 20
    if employee_count >= 100:
        tools += 15
    tools = min(90, tools)

    # ── Formation ──────────────────────────────────────────────
    # Corrélé à la taille (budget formation) et à l'âge de l'entreprise
    if employee_count >= 100:
        training = 65
    elif employee_count >= 20:
        training = 45
    else:
        training = 25
    if age <= 10:
        training += 10
    training = min(85, training)

    # ── Conformité / Qualité ───────────────────────────────────
    if categorie == "GE":
        compliance = 80
    elif categorie == "ETI":
        compliance = 65
    elif employee_count >= 20:
        compliance = 50
    else:
        compliance = 35
    compliance = min(90, compliance)

    # Score global pondéré
    weights = {
        "automation": 0.30,
        "analytics":  0.20,
        "tools":      0.25,
        "training":   0.15,
        "compliance": 0.10,
    }
    total = (
        auto       * weights["automation"]
        + analytics * weights["analytics"]
        + tools     * weights["tools"]
        + training  * weights["training"]
        + compliance * weights["compliance"]
    )
    total = round(total)

    # Maturité
    if total >= 75:
        maturity = "Leader"
    elif total >= 55:
        maturity = "Avancé"
    elif total >= 35:
        maturity = "Intermédiaire"
    else:
        maturity = "Débutant"

    return {
        "ai_score":         total,
        "ai_maturity":      maturity,
        "score_automation": auto,
        "score_analytics":  analytics,
        "score_tools":      tools,
        "score_training":   training,
        "score_compliance": compliance,
    }


# ─────────────────────────────────────────────
# Slug
# ─────────────────────────────────────────────
def slugify(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[àáâãäå]", "a", text)
    text = re.sub(r"[èéêë]", "e", text)
    text = re.sub(r"[ìíîï]", "i", text)
    text = re.sub(r"[òóôõö]", "o", text)
    text = re.sub(r"[ùúûü]", "u", text)
    text = re.sub(r"[ç]", "c", text)
    text = re.sub(r"[ñ]", "n", text)
    text = re.sub(r"[^a-z0-9\s-]", "", text)
    text = re.sub(r"[\s-]+", "-", text).strip("-")
    return text[:80]


# ─────────────────────────────────────────────
# Transformation API → Supabase
# ─────────────────────────────────────────────
def transform(entreprise: dict) -> Optional[dict]:
    siege = entreprise.get("siege", {})

    siren = entreprise.get("siren", "").strip()
    name = (
        entreprise.get("nom_complet")
        or entreprise.get("nom_raison_sociale")
        or ""
    ).strip()

    if not name or not siren:
        return None

    # Localisation
    city = (siege.get("libelle_commune") or "").title()
    region_code = siege.get("region") or ""
    region = REGIONS.get(region_code, region_code)
    department = siege.get("departement") or ""
    postal_code = siege.get("code_postal") or ""
    address = (siege.get("adresse") or "").title()

    # Taille
    tranche_siege = siege.get("tranche_effectif_salarie") or "NN"
    employee_count = TRANCHE_EFFECTIF.get(tranche_siege, 0)
    categorie = entreprise.get("categorie_entreprise") or "PME"
    size = CATEGORIE_TO_SIZE.get(categorie, "TPE" if employee_count < 10 else "PME")

    # Ancienneté
    date_creation_str = entreprise.get("date_creation") or ""
    founded_year = None
    if date_creation_str:
        try:
            founded_year = int(date_creation_str[:4])
        except ValueError:
            pass

    # Établissements
    nombre_etabs = entreprise.get("nombre_etablissements_ouverts") or 1

    # Score IA
    scores = compute_ai_score(
        employee_count=employee_count,
        founded_year=founded_year,
        categorie=categorie,
        nombre_etablissements=nombre_etabs,
    )

    # Slug unique : nom + siren partiel pour éviter les doublons
    slug = slugify(name)
    if not slug:
        slug = siren
    slug = f"{slug}-{siren[-4:]}"

    return {
        "slug":            slug,
        "name":            name,
        "siren":           siren,
        "city":            city,
        "region":          region,
        "department":      department,
        "postal_code":     postal_code,
        "address":         address,
        "size":            size,
        "employee_count":  employee_count if employee_count > 0 else None,
        "founded":         founded_year,
        "specialties":     ["Expertise comptable"],
        "software":        [],
        "claimed":         False,
        "source":          "sirene",
        **scores,
    }


# ─────────────────────────────────────────────
# Fetch API
# ─────────────────────────────────────────────
def fetch_page(page: int, session: requests.Session) -> list[dict]:
    params = {
        "activite_principale": NAF_CODE,
        "page":     page,
        "per_page": PER_PAGE,
        "etat_administratif": "A",  # seulement les entreprises actives
    }
    r = session.get(API_BASE, params=params, timeout=15)
    r.raise_for_status()
    data = r.json()
    return data.get("results", [])


# ─────────────────────────────────────────────
# Upsert Supabase
# ─────────────────────────────────────────────
def upsert_batch(supabase: Client, rows: list[dict]) -> tuple[int, int]:
    """Retourne (inserted, skipped)."""
    if not rows:
        return 0, 0

    response = (
        supabase.table("cabinets")
        .upsert(rows, on_conflict="siren")
        .execute()
    )
    inserted = len(response.data) if response.data else 0
    skipped = len(rows) - inserted
    return inserted, skipped


# ─────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(description="Import cabinets Sirene → Supabase")
    parser.add_argument("--pages", type=int, default=1, help="Nombre de pages à importer (défaut: 1 = 25 cabinets)")
    parser.add_argument("--dry-run", action="store_true", help="Affiche sans insérer dans Supabase")
    args = parser.parse_args()

    print("=" * 60)
    print("  Nira — Import Sirene (NAF 69.20Z)")
    print("=" * 60)
    print(f"  Pages   : {args.pages} ({args.pages * PER_PAGE} cabinets max)")
    print(f"  Mode    : {'DRY-RUN (aucune insertion)' if args.dry_run else 'PRODUCTION'}")
    print(f"  Supabase: {SUPABASE_URL}")
    print("=" * 60)
    print()

    supabase: Optional[Client] = None
    if not args.dry_run:
        if not os.environ.get("SUPABASE_SERVICE_KEY"):
            print("⚠  ATTENTION : SUPABASE_SERVICE_KEY non définie.")
            print("   L'insertion sera bloquée par RLS avec la clé publique.")
            print("   → Supabase Dashboard > Settings > API > service_role key")
            print("   → export SUPABASE_SERVICE_KEY=<clé> puis relancez.")
            print()
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

    session = requests.Session()
    session.headers.update({"User-Agent": "Nira/1.0 (contact@nira.fr)"})

    stats = {
        "fetched":   0,
        "valid":     0,
        "inserted":  0,
        "skipped":   0,
        "errors":    0,
    }

    score_distribution = {"Leader": 0, "Avancé": 0, "Intermédiaire": 0, "Débutant": 0}
    size_distribution  = {"TPE": 0, "PME": 0, "ETI": 0, "Grand": 0}

    for page in range(1, args.pages + 1):
        print(f"[Page {page}/{args.pages}] Récupération en cours…", end=" ", flush=True)

        try:
            results = fetch_page(page, session)
        except requests.RequestException as e:
            print(f"ERREUR: {e}")
            stats["errors"] += 1
            continue

        print(f"{len(results)} entreprises reçues")
        stats["fetched"] += len(results)

        rows = []
        for entreprise in results:
            row = transform(entreprise)
            if row is None:
                stats["errors"] += 1
                continue
            stats["valid"] += 1
            score_distribution[row["ai_maturity"]] += 1
            size_distribution[row["size"]] += 1
            rows.append(row)

            # Aperçu dans le terminal
            bar_len = 20
            filled = round(row["ai_score"] / 100 * bar_len)
            bar = "█" * filled + "░" * (bar_len - filled)
            print(
                f"  {'[DRY]' if args.dry_run else '    '} "
                f"{row['name'][:38]:<38} "
                f"[{bar}] {row['ai_score']:>3}/100  "
                f"{row['ai_maturity']:<14} "
                f"{row['city']}"
            )

        if not args.dry_run and rows:
            try:
                ins, skip = upsert_batch(supabase, rows)
                stats["inserted"] += ins
                stats["skipped"]  += skip
            except Exception as e:
                print(f"  ⚠ Erreur Supabase : {e}")
                stats["errors"] += len(rows)

        if page < args.pages:
            time.sleep(DELAY_BETWEEN_PAGES)

    # ─────────────────────────────────────────
    # Résumé
    # ─────────────────────────────────────────
    print()
    print("=" * 60)
    print("  RÉSUMÉ DE L'IMPORT")
    print("=" * 60)
    print(f"  Entreprises récupérées  : {stats['fetched']}")
    print(f"  Lignes valides          : {stats['valid']}")

    if not args.dry_run:
        print(f"  Insérées / mises à jour : {stats['inserted']}")
        print(f"  Doublons ignorés        : {stats['skipped']}")

    print(f"  Erreurs                 : {stats['errors']}")
    print()

    print("  Répartition Score IA :")
    for level, count in score_distribution.items():
        if count == 0:
            continue
        bar = "█" * count + " " * max(0, 20 - count)
        print(f"    {level:<14} {bar} {count}")

    print()
    print("  Répartition Taille :")
    for sz, count in size_distribution.items():
        if count == 0:
            continue
        print(f"    {sz:<6} {count}")

    if args.dry_run:
        print()
        print("  ℹ  Mode DRY-RUN — aucune donnée n'a été insérée.")
        print("     Relancez sans --dry-run pour pousser vers Supabase.")

    print("=" * 60)


if __name__ == "__main__":
    main()
