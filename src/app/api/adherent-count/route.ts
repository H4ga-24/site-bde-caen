import { NextResponse } from "next/server";

export async function GET() {
  const sheetUrl = process.env.GOOGLE_SHEET_CSV_URL;
  if (!sheetUrl) return NextResponse.json({ count: 0 });

  try {
    const res = await fetch(`${sheetUrl}&t=${Date.now()}`, { cache: "no-store" });
    const text = await res.text();
    const lines = text.trim().split(/\r?\n/).filter((l) => l.trim() !== "");
    const count = Math.max(0, lines.length - 1);
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}