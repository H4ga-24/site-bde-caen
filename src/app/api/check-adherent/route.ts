import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ isAdherent: false, error: "Email requis" }, { status: 400 });
    }

    const sheetUrl = process.env.GOOGLE_SHEET_CSV_URL;
    if (!sheetUrl) {
      return NextResponse.json({ isAdherent: false, error: "Configuration manquante" }, { status: 500 });
    }

    const cleanTargetEmail = email.trim().toLowerCase();

    // Récupération du CSV Google Sheets en direct côté serveur
    const response = await fetch(`${sheetUrl}&t=${Date.now()}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json({ isAdherent: false, error: "Erreur lecture Sheets" }, { status: 500 });
    }

    const csvText = await response.text();
    const rows = csvText.split(/\r?\n/).filter((line) => line.trim() !== "");

    // Vérifie si l'email de l'étudiant est présent dans une des colonnes
    const isAdherent = rows.some((row) => {
      const columns = row.split(",").map((c) => c.trim().toLowerCase());
      return columns.some((col) => col === cleanTargetEmail);
    });

    return NextResponse.json({ isAdherent });
  } catch (err) {
    return NextResponse.json({ isAdherent: false, error: "Erreur interne" }, { status: 500 });
  }
}