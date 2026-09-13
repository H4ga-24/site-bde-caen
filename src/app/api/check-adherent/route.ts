import { NextResponse } from "next/server";

const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vT7jG5IgjcvEmfymnE9PMBmngGw0hopjdX9a-bLL2P54LLfPe-kjymBVe2bVF-CIoq8-1ZjnJLpDUBI/pub?gid=87679688&single=true&output=csv";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ isAdherent: false, error: "Email requis" }, { status: 400 });
    }

    const cleanTargetEmail = email.trim().toLowerCase();

    // Récupération du CSV Google Sheets en direct (sans cache)
    const response = await fetch(`${SHEET_CSV_URL}&t=${Date.now()}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json({ isAdherent: false, error: "Erreur lecture Sheets" }, { status: 500 });
    }

    const csvText = await response.text();
    const rows = csvText.split(/\r?\n/).filter((line) => line.trim() !== "");

    // Vérifie si l'email de l'étudiant est présent dans l'une des colonnes du tableau
    const isAdherent = rows.some((row) => {
      const columns = row.split(",").map((c) => c.trim().toLowerCase());
      return columns.some((col) => col === cleanTargetEmail);
    });

    return NextResponse.json({ isAdherent });
  } catch (err) {
    return NextResponse.json({ isAdherent: false, error: "Erreur interne" }, { status: 500 });
  }
}