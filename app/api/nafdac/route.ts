import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

interface DrugRecord {
  product_id: number;
  product_name: string;
  ingredient_id: number;
  form_id: string;
  strength: string;
  NAFDAC: string;
  applicant_id: number;
  approval_date: string;
  expiry_date: string;
  smpc: string | null;
  ingredient?: { ingredient_name: string };
  applicant?: { applicant_name: string };
  manufacturer?: { manufacturer_name: string };
  form?: { form_name: string };
}

let drugCache: DrugRecord[] | null = null;

function getDrugs(): DrugRecord[] {
  if (drugCache) return drugCache;
  const filePath = join(process.cwd(), "public", "nafdac-drugs.json");
  drugCache = JSON.parse(readFileSync(filePath, "utf-8"));
  return drugCache!;
}

function normalize(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function searchDrugs(query: string): DrugRecord[] {
  const drugs = getDrugs();
  const q = normalize(query);
  const scored = drugs.map((d) => {
    const name = normalize(d.product_name ?? "");
    const nafdac = normalize(d.NAFDAC ?? "");
    const ingredient = normalize(d.ingredient?.ingredient_name ?? "");
    const applicant = normalize(d.applicant?.applicant_name ?? "");
    let score = 0;
    if (name === q) score = 100;
    else if (name.startsWith(q)) score = 80;
    else if (name.includes(q)) score = 60;
    else if (nafdac === q || nafdac.includes(q)) score = 90;
    else if (ingredient.startsWith(q)) score = 70;
    else if (ingredient.includes(q)) score = 50;
    else if (applicant.includes(q)) score = 30;
    return { drug: d, score };
  });
  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map((s) => s.drug);
}

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    if (!query || typeof query !== "string" || query.trim().length < 2) {
      return NextResponse.json({ error: "Query too short" }, { status: 400 });
    }
    const matches = searchDrugs(query.trim());
    if (matches.length === 0) {
      return NextResponse.json({ status: "not_found", name: query.trim(), score: 0 });
    }
    const top = matches[0];
    const isExpired = top.expiry_date && new Date(top.expiry_date) < new Date();
    return NextResponse.json({
      status: isExpired ? "suspicious" : "verified",
      name: top.product_name,
      activeIngredients: top.ingredient?.ingredient_name ?? null,
      registrationNumber: top.NAFDAC,
      manufacturer: top.manufacturer?.manufacturer_name ?? null,
      applicant: top.applicant?.applicant_name ?? null,
      form: top.form?.form_name ?? null,
      strength: top.strength ?? null,
      approvalDate: top.approval_date ?? null,
      expiryDate: top.expiry_date ?? null,
      smpc: top.smpc ?? null,
      warning: isExpired ? "This product registration has expired." : null,
      score: isExpired ? 40 : 98,
      totalMatches: matches.length,
      otherMatches: matches.slice(1).map((d) => ({
        name: d.product_name,
        nafdac: d.NAFDAC,
        strength: d.strength,
        form: d.form?.form_name ?? null,
      })),
    });
  } catch (e) {
    console.error("NAFDAC search error:", e);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
