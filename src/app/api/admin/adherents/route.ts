import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  try {
    const memberMap = new Map();
    const sheetUrl = process.env.GOOGLE_SHEET_CSV_URL;

    // 1. Lecture Google Sheets côté serveur via variable protégée
    if (sheetUrl) {
      try {
        const res = await fetch(`${sheetUrl}&t=${Date.now()}`, {
          cache: "no-store",
        });

        if (res.ok) {
          const text = await res.text();
          const lines = text.trim().split(/\r?\n/).filter((l) => l.trim() !== "");

          lines.slice(1).forEach((line) => {
            const cols = line.split(",").map((c) => c.replace(/"/g, "").trim());
            const mailCol = cols.find((c) => c.includes("@"));

            if (mailCol) {
              const cleanMail = mailCol.toLowerCase();
              const rawText = cols.join(" ").toUpperCase();
              let detectedPromo = "Autre";
              if (rawText.includes("L1")) detectedPromo = "L1";
              if (rawText.includes("L2")) detectedPromo = "L2";

              memberMap.set(cleanMail, {
                email: cleanMail,
                fullName: cols[0] && cols[1] ? `${cols[0]} ${cols[1]}` : "Adhérent HelloAsso",
                promo: detectedPromo,
                hasAccount: false,
                hasPaidDues: true,
                source: "HelloAsso",
              });
            }
          });
        }
      } catch (sheetErr) {
        console.error("Erreur Sheets serveur:", sheetErr);
      }
    }

    // 2. Lecture des profils Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: profiles } = await supabase.from("profiles").select("*");

    if (profiles) {
      profiles.forEach((p: any) => {
        const cleanMail = (p.email || "").toLowerCase();
        if (!cleanMail) return;

        if (memberMap.has(cleanMail)) {
          const existing = memberMap.get(cleanMail);
          memberMap.set(cleanMail, {
            ...existing,
            id: p.id,
            fullName: p.full_name || existing.fullName,
            promo: p.promotion || existing.promo,
            hasAccount: true,
            hasPaidDues: p.has_paid_dues ?? existing.hasPaidDues,
            source: "Les deux",
          });
        } else {
          memberMap.set(cleanMail, {
            id: p.id,
            email: cleanMail,
            fullName: p.full_name || "Sans nom",
            promo: p.promotion || "Non précisée",
            hasAccount: true,
            hasPaidDues: !!p.has_paid_dues,
            source: "Site Web",
          });
        }
      });
    }

    return NextResponse.json({ members: Array.from(memberMap.values()) });
  } catch (err: any) {
    return NextResponse.json({ error: err.message, members: [] }, { status: 500 });
  }
}